import { AyahData } from "../data/surahMeta";

const MUQATTAAT_EXPANSIONS: Array<[RegExp, string]> = [
  [/(^|\s)الف لام ميم(?=\s|$)/g, "$1الم"],
  [/(^|\s)الف لام ميم صاد(?=\s|$)/g, "$1المص"],
  [/(^|\s)الف لام را(?=\s|$)/g, "$1الر"],
  [/(^|\s)الف لام ميم را(?=\s|$)/g, "$1المر"],
  [/(^|\s)كاف ها يا عين صاد(?=\s|$)/g, "$1كهيعص"],
  [/(^|\s)طا ها(?=\s|$)/g, "$1طه"],
  [/(^|\s)طا سين ميم(?=\s|$)/g, "$1طسم"],
  [/(^|\s)طا سين(?=\s|$)/g, "$1طس"],
  [/(^|\s)يا سين(?=\s|$)/g, "$1يس"],
  [/(^|\s)حا ميم(?=\s|$)/g, "$1حم"],
  [/(^|\s)نون(?=\s|$)/g, "$1ن"],
  [/(^|\s)قاف(?=\s|$)/g, "$1ق"],
  [/(^|\s)صاد(?=\s|$)/g, "$1ص"],
];

const UTHMANI_VARIANTS: Array<[RegExp, string]> = [
  [/الرحمان/g, "الرحمن"],
  [/الصلوه/g, "الصلاه"],
  [/الزكوه/g, "الزكاه"],
  [/الحيوه/g, "الحياة"],
  [/الحياة/g, "الحياه"],
  [/سماوات/g, "سموت"],
  [/السماوات/g, "السموت"],
  [/عالمين/g, "علمين"],
  [/العالمين/g, "العلمين"],
  [/مالك/g, "ملك"],
  [/صراط/g, "صرط"],
  [/الصراط/g, "الصرط"],
  [/كتاب/g, "كتب"],
  [/الكتاب/g, "الكتب"],
  [/شيطان/g, "شيطن"],
  [/الشيطان/g, "الشيطن"],
  [/قران/g, "قرءان"],
  [/ايات/g, "ايت"],
  [/اولئك/g, "اوليك"],
  [/ابراهيم/g, "ابرهم"],
  [/اسماعيل/g, "اسمعيل"],
  [/اسحاق/g, "اسحق"],
  [/سليمان/g, "سليمن"],
  [/داوود/g, "داود"],
  [/هارون/g, "هرون"],
  [/فرعون/g, "فرعون"],
  [/موسى/g, "موسي"],
  [/عيسى/g, "عيسي"],
  [/يحيى/g, "يحيي"],
  [/عليهم/g, "عليهم"],
  [/انعمت/g, "انعمت"],
  [/ذلك/g, "ذلك"],
  [/ذالك/g, "ذلك"],
  [/هؤلاء/g, "هاولا"],
  [/هذا/g, "هذا"],
  [/هاذا/g, "هذا"],
];

export function normalizeArabicForMatch(input: string): string {
  if (!input) return "";

  let text = input
    // Remove Uthmani waqf signs, small letters, diacritics, and tatweel
    .replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, "")
    // Remove Arabic/Latin punctuation and verse symbols
    .replace(/[^\u0621-\u064A\u0671\s]/g, " ")
    // Normalize Alef variants (including Alef Wasla ٱ)
    .replace(/[\u0622\u0623\u0625\u0671]/g, "ا")
    // Normalize Alef Maksura & Hamza forms
    .replace(/\u0649/g, "ي")
    .replace(/\u0629/g, "ه")
    .replace(/\u0624/g, "و")
    .replace(/\u0626/g, "ي")
    .replace(/\s+/g, " ")
    .trim();

  for (const [pattern, replacement] of MUQATTAAT_EXPANSIONS) {
    text = text.replace(pattern, replacement);
  }
  for (const [pattern, replacement] of UTHMANI_VARIANTS) {
    text = text.replace(pattern, replacement);
  }

  return text.replace(/\s+/g, " ").trim();
}

function getBigrams(str: string): string[] {
  const clean = str.replace(/\s+/g, "");
  if (clean.length < 2) return clean ? [clean] : [];
  const res: string[] = [];
  for (let i = 0; i < clean.length - 1; i++) {
    res.push(clean.slice(i, i + 2));
  }
  return res;
}

function diceSimilarity(a: string, b: string): number {
  if (!a || !b) return 0;
  if (a === b) return 1;
  const bigramsA = getBigrams(a);
  const bigramsB = getBigrams(b);
  if (bigramsA.length === 0 || bigramsB.length === 0) return 0;

  const counts = new Map<string, number>();
  for (const bg of bigramsA) {
    counts.set(bg, (counts.get(bg) ?? 0) + 1);
  }

  let matches = 0;
  for (const bg of bigramsB) {
    const c = counts.get(bg) ?? 0;
    if (c > 0) {
      matches++;
      counts.set(bg, c - 1);
    }
  }
  return (2 * matches) / (bigramsA.length + bigramsB.length);
}

function scoreTokensAgainstVerse(
  spokenTokens: string[],
  verseTokens: string[],
  normalizedSpoken: string,
  normalizedVerse: string
): number {
  if (spokenTokens.length === 0 || verseTokens.length === 0) return 0;
  if (normalizedSpoken === normalizedVerse) return 1;

  // Exact substring containment check (especially strong for long verses when user recites a phrase)
  if (
    normalizedSpoken.length >= 6 &&
    (normalizedVerse.includes(normalizedSpoken) ||
      normalizedSpoken.includes(normalizedVerse))
  ) {
    const lenRatio =
      Math.min(normalizedSpoken.length, normalizedVerse.length) /
      Math.max(normalizedSpoken.length, normalizedVerse.length);
    return Math.max(0.76, 0.65 + lenRatio * 0.35);
  }

  // Token-level soft matching (handles slight ASR spelling slips)
  let tokenMatchSum = 0;
  let lastMatchedIdx = -1;
  let orderBonus = 0;

  for (const st of spokenTokens) {
    let bestTokenScore = 0;
    let bestIdx = -1;
    for (let j = 0; j < verseTokens.length; j++) {
      const vt = verseTokens[j];
      const sim = st === vt ? 1 : diceSimilarity(st, vt);
      if (sim > bestTokenScore) {
        bestTokenScore = sim;
        bestIdx = j;
      }
    }
    if (bestTokenScore >= 0.62) {
      tokenMatchSum += bestTokenScore;
      if (bestIdx > lastMatchedIdx) {
        orderBonus += 0.12;
        lastMatchedIdx = bestIdx;
      }
    }
  }

  const spokenPrecision = tokenMatchSum / spokenTokens.length;
  const verseRecall = tokenMatchSum / verseTokens.length;
  const bigramScore = diceSimilarity(normalizedSpoken, normalizedVerse);

  // If user spoke a partial phrase from a longer verse, weight precision + order higher
  const baseScore =
    spokenPrecision * 0.55 + verseRecall * 0.25 + bigramScore * 0.2;
  const normalizedOrder =
    spokenTokens.length > 0
      ? Math.min(0.12, (orderBonus / spokenTokens.length) * 0.4)
      : 0;

  return Math.min(1, baseScore + normalizedOrder);
}

export interface VerseMatchResult {
  matchedAyah: number | null;
  confidence: "high" | "moderate" | "low";
  score: number;
  normalizedTranscript: string;
}

export function matchRecitationToVerse(
  rawTranscript: string,
  ayahs: AyahData[],
  currentAyahNumber: number
): VerseMatchResult {
  const normalized = normalizeArabicForMatch(rawTranscript);
  if (!normalized || normalized.length < 2 || ayahs.length === 0) {
    return {
      matchedAyah: null,
      confidence: "low",
      score: 0,
      normalizedTranscript: normalized,
    };
  }

  const spokenTokens = normalized.split(" ").filter(Boolean);
  // Ignore common ta'awwudh/bismillah preamble when already past ayah 1
  const cleanTokens =
    currentAyahNumber > 1 &&
    (normalized.startsWith("اعوذ بالله") || normalized.startsWith("بسم الله"))
      ? spokenTokens.slice(4)
      : spokenTokens;

  const activeTokens = cleanTokens.length > 0 ? cleanTokens : spokenTokens;
  const activeTranscript = activeTokens.join(" ");

  if (activeTranscript.length < 2) {
    return {
      matchedAyah: null,
      confidence: "low",
      score: 0,
      normalizedTranscript: normalized,
    };
  }

  let bestAyah: number | null = null;
  let bestScore = 0;
  let currentScore = 0;

  // Evaluate contextual window first + full surah fallback
  for (const ayah of ayahs) {
    const normVerse = normalizeArabicForMatch(ayah.ar);
    const verseTokens = normVerse.split(" ").filter(Boolean);
    const rawScore = scoreTokensAgainstVerse(
      activeTokens,
      verseTokens,
      activeTranscript,
      normVerse
    );

    const distance = ayah.n - currentAyahNumber;
    // Slight contextual bias toward current and immediate next verses to prevent erratic jumps
    let adjusted = rawScore;
    if (distance === 0) adjusted += 0.05;
    else if (distance === 1) adjusted += 0.04;
    else if (distance >= 2 && distance <= 5) adjusted += 0.01;
    else if (distance < -1 || distance > 8) adjusted -= 0.08;

    if (ayah.n === currentAyahNumber) {
      currentScore = rawScore;
    }

    if (adjusted > bestScore) {
      bestScore = adjusted;
      bestAyah = ayah.n;
    }
  }

  // Anti-jump & repetition safeguard:
  // If user is repeating the current verse and it still scores decently, stay on currentAyahNumber
  if (
    bestAyah !== null &&
    bestAyah !== currentAyahNumber &&
    currentScore >= 0.45 &&
    bestScore - currentScore < 0.14
  ) {
    return {
      matchedAyah: currentAyahNumber,
      confidence: currentScore >= 0.65 ? "high" : "moderate",
      score: currentScore,
      normalizedTranscript: normalized,
    };
  }

  // Gate thresholds based on jump distance
  const jumpDist = bestAyah !== null ? Math.abs(bestAyah - currentAyahNumber) : 99;
  const minThreshold =
    jumpDist <= 1 ? 0.44 : jumpDist <= 5 ? 0.56 : 0.72;

  if (bestAyah === null || bestScore < minThreshold) {
    return {
      matchedAyah: null,
      confidence: "low",
      score: bestScore,
      normalizedTranscript: normalized,
    };
  }

  return {
    matchedAyah: bestAyah,
    confidence: bestScore >= 0.68 ? "high" : "moderate",
    score: bestScore,
    normalizedTranscript: normalized,
  };
}
