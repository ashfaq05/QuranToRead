import { useCallback, useEffect, useRef, useState } from "react";
import { AyahData } from "../data/surahMeta";
import { matchRecitationToVerse } from "../utils/verseMatcher";

export type VoiceStatus =
  | "idle"
  | "requesting"
  | "listening"
  | "paused"
  | "error";

interface SpeechRecognitionAlternativeLike {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResultLike {
  isFinal: boolean;
  length: number;
  [index: number]: SpeechRecognitionAlternativeLike;
}

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: SpeechRecognitionResultLike;
  };
}

interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

interface UseVoiceRecitationOptions {
  ayahs: AyahData[];
  surahName: string;
  currentAyah: number;
  onVerseMatched: (
    ayahNumber: number,
    confidence: "high" | "moderate",
    transcript: string
  ) => void;
}

export function useVoiceRecitation({
  ayahs,
  surahName,
  currentAyah,
  onVerseMatched,
}: UseVoiceRecitationOptions) {
  const [status, setStatus] = useState<VoiceStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [micLevel, setMicLevel] = useState<number>(0);
  const [lastTranscript, setLastTranscript] = useState<string>("");
  const [matchConfidence, setMatchConfidence] = useState<
    "high" | "moderate" | "waiting"
  >("waiting");

  const ayahsRef = useRef(ayahs);
  const currentAyahRef = useRef(currentAyah);
  const surahNameRef = useRef(surahName);
  const onVerseMatchedRef = useRef(onVerseMatched);
  const statusRef = useRef<VoiceStatus>("idle");

  ayahsRef.current = ayahs;
  currentAyahRef.current = currentAyah;
  surahNameRef.current = surahName;
  onVerseMatchedRef.current = onVerseMatched;
  statusRef.current = status;

  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const recorderIntervalRef = useRef<number | null>(null);
  const activeRecorderRef = useRef<MediaRecorder | null>(null);
  const lastWebSpeechMatchAtRef = useRef<number>(0);
  const peakEnergyInChunkRef = useRef<number>(0);
  const serverAsrAvailableRef = useRef<boolean>(true);

  const processTranscript = useCallback((rawText: string) => {
    const trimmed = rawText.trim();
    if (!trimmed) return;
    setLastTranscript(trimmed);

    const result = matchRecitationToVerse(
      trimmed,
      ayahsRef.current,
      currentAyahRef.current
    );

    if (result.matchedAyah !== null && result.confidence !== "low") {
      setMatchConfidence(result.confidence);
      onVerseMatchedRef.current(
        result.matchedAyah,
        result.confidence,
        trimmed
      );
    } else {
      setMatchConfidence("waiting");
    }
  }, []);

  const cleanupMedia = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (recorderIntervalRef.current !== null) {
      window.clearInterval(recorderIntervalRef.current);
      recorderIntervalRef.current = null;
    }
    if (activeRecorderRef.current && activeRecorderRef.current.state !== "inactive") {
      try {
        activeRecorderRef.current.stop();
      } catch {
        // ignore
      }
      activeRecorderRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    analyserRef.current = null;
    setMicLevel(0);
  }, []);

  const sendChunkForTranscription = useCallback(
    async (blob: Blob) => {
      if (!serverAsrAvailableRef.current) return;
      if (blob.size < 1500) return;

      try {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = typeof reader.result === "string" ? reader.result : "";
            const commaIdx = result.indexOf(",");
            resolve(commaIdx >= 0 ? result.slice(commaIdx + 1) : result);
          };
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(blob);
        });

        const res = await fetch("/api/transcribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            audioBase64: base64,
            mimeType: blob.type || "audio/webm",
            contextHint: `Surah ${surahNameRef.current}, around verse ${currentAyahRef.current}`,
          }),
        });

        if (res.status === 503) {
          serverAsrAvailableRef.current = false;
          return;
        }
        if (!res.ok) return;

        const data = (await res.json()) as { transcript?: string };
        if (data.transcript && statusRef.current === "listening") {
          processTranscript(data.transcript);
        }
      } catch {
        // Transient network/offline error: remain silent & let Web Speech API continue
      }
    },
    [processTranscript]
  );

  const startPipeline = useCallback(async () => {
    setErrorMessage(null);
    setStatus("requesting");
    setMatchConfidence("waiting");

    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus("error");
      setErrorMessage("Microphone access is not supported in this browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;

      // Setup live RMS level meter
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioCtxRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);
      analyserRef.current = analyser;

      const timeData = new Uint8Array(analyser.fftSize);
      const tickLevel = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteTimeDomainData(timeData);
        let sum = 0;
        for (let i = 0; i < timeData.length; i++) {
          const val = (timeData[i] - 128) / 128;
          sum += val * val;
        }
        const rms = Math.sqrt(sum / timeData.length);
        const scaled = Math.min(1, rms * 4.5);
        if (scaled > peakEnergyInChunkRef.current) {
          peakEnergyInChunkRef.current = scaled;
        }
        setMicLevel(scaled);
        rafRef.current = requestAnimationFrame(tickLevel);
      };
      rafRef.current = requestAnimationFrame(tickLevel);

      // 1. Start Web Speech API (instant local Arabic recognition when available)
      const SpeechRecCtor =
        (
          window as unknown as {
            SpeechRecognition?: new () => SpeechRecognitionLike;
            webkitSpeechRecognition?: new () => SpeechRecognitionLike;
          }
        ).SpeechRecognition ||
        (
          window as unknown as {
            webkitSpeechRecognition?: new () => SpeechRecognitionLike;
          }
        ).webkitSpeechRecognition;

      if (SpeechRecCtor) {
        const rec = new SpeechRecCtor();
        rec.lang = "ar-SA";
        rec.continuous = true;
        rec.interimResults = true;
        rec.maxAlternatives = 2;

        rec.onresult = (event) => {
          if (statusRef.current !== "listening") return;
          let latestText = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            if (result && result[0]?.transcript) {
              latestText += " " + result[0].transcript;
            }
          }
          const clean = latestText.trim();
          if (clean) {
            lastWebSpeechMatchAtRef.current = Date.now();
            processTranscript(clean);
          }
        };

        rec.onerror = (ev) => {
          if (ev.error === "not-allowed" || ev.error === "service-not-allowed") {
            setErrorMessage("Microphone permission was denied.");
          }
        };

        rec.onend = () => {
          // Auto-restart while actively listening (handles natural 10s+ pauses seamlessly)
          if (statusRef.current === "listening" && recognitionRef.current) {
            try {
              recognitionRef.current.start();
            } catch {
              // ignore restart error
            }
          }
        };

        recognitionRef.current = rec;
        try {
          rec.start();
        } catch {
          // ignore
        }
      }

      // 2. Rolling 3.5s transient audio segment fallback via /api/transcribe
      if (typeof MediaRecorder !== "undefined") {
        const recordSegment = () => {
          if (statusRef.current !== "listening" || !streamRef.current) return;
          // Skip server call if Web Speech API delivered a transcript within last 2.2s
          const webSpeechActive =
            Date.now() - lastWebSpeechMatchAtRef.current < 2200;

          peakEnergyInChunkRef.current = 0;
          const chunks: BlobPart[] = [];
          let recorder: MediaRecorder;
          try {
            recorder = new MediaRecorder(streamRef.current);
          } catch {
            return;
          }
          activeRecorderRef.current = recorder;

          recorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) chunks.push(e.data);
          };

          recorder.onstop = () => {
            if (statusRef.current !== "listening") return;
            // Only send to server if voice energy exceeded silence floor AND Web Speech wasn't already tracking
            const hadVoice = peakEnergyInChunkRef.current > 0.08;
            if (hadVoice && !webSpeechActive && chunks.length > 0) {
              const blob = new Blob(chunks, {
                type: recorder.mimeType || "audio/webm",
              });
              void sendChunkForTranscription(blob);
            }
          };

          try {
            recorder.start();
            window.setTimeout(() => {
              if (recorder.state !== "inactive") {
                try {
                  recorder.stop();
                } catch {
                  // ignore
                }
              }
            }, 3400);
          } catch {
            // ignore
          }
        };

        recordSegment();
        recorderIntervalRef.current = window.setInterval(recordSegment, 3600);
      }

      setStatus("listening");
    } catch (err: unknown) {
      cleanupMedia();
      setStatus("error");
      const msg =
        err instanceof Error && err.name === "NotAllowedError"
          ? "Microphone access denied. Please allow microphone access to use live voice tracking."
          : "Could not access microphone. You can continue reading manually.";
      setErrorMessage(msg);
    }
  }, [cleanupMedia, processTranscript, sendChunkForTranscription]);

  const pauseListening = useCallback(() => {
    cleanupMedia();
    setStatus("paused");
  }, [cleanupMedia]);

  const stopListening = useCallback(() => {
    cleanupMedia();
    setStatus("idle");
    setMatchConfidence("waiting");
    setLastTranscript("");
  }, [cleanupMedia]);

  useEffect(() => {
    return () => {
      cleanupMedia();
    };
  }, [cleanupMedia]);

  return {
    status,
    errorMessage,
    micLevel,
    lastTranscript,
    matchConfidence,
    startListening: startPipeline,
    pauseListening,
    stopListening,
    testTranscriptMatch: processTranscript,
  };
}
