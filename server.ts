import express from "express";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    })
  : null;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "6mb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, hasAsr: Boolean(ai) });
  });

  // Transient Arabic Quran recitation transcription (no audio is stored)
  app.post("/api/transcribe", async (req, res) => {
    try {
      if (!ai) {
        res.status(503).json({
          error: "Speech transcription service is not configured on the server.",
        });
        return;
      }

      const { audioBase64, mimeType, contextHint } = req.body as {
        audioBase64?: string;
        mimeType?: string;
        contextHint?: string;
      };

      if (!audioBase64 || typeof audioBase64 !== "string") {
        res.status(400).json({ error: "Missing audio payload." });
        return;
      }

      const cleanMime = (mimeType || "audio/webm").split(";")[0].trim();

      const promptText = contextHint
        ? `Transcribe ONLY the exact Arabic Quranic words spoken in this audio clip into plain Arabic script (no diacritics needed, no translation, no commentary). If the audio is silent or unclear, return an empty string. Context hint (expected Surah area): ${contextHint}`
        : "Transcribe ONLY the exact Arabic Quranic words spoken in this audio clip into plain Arabic script (no translation, no commentary). If silent or unclear, return an empty string.";

      const response = await ai.models.generateContent({
        model: "gemini-3.5-transcribe",
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: cleanMime,
                data: audioBase64,
              },
            },
            {
              text: promptText,
            },
          ],
        },
      });

      const transcript = (response.text || "").trim();
      res.json({ transcript });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to transcribe recitation.";
      console.error("Transcription error:", message);
      res.status(500).json({ error: message });
    }
  });

  if (process.env.NODE_ENV === "production") {
    const distDir = path.resolve(__dirname, "dist");
    app.use(express.static(distDir));
    app.get("/{*splat}", (_req, res) => {
      const indexHtml = path.join(distDir, "index.html");
      if (fs.existsSync(indexHtml)) {
        res.sendFile(indexHtml);
      } else {
        res.status(404).send("Application build not found.");
      }
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Al-Kitab server listening on http://localhost:${PORT}`);
  });
}

startServer();
