import { STARTER_SURAHS, SurahData, TOTAL_QURAN_VERSES } from "../data/surahMeta";

export type ReadingTheme = "light" | "sepia" | "dark";
export type FontSizeScale = "sm" | "md" | "lg" | "xl";
export type TranslationFormat = "hinglish" | "hindi" | "both" | "transliteration";
export type ArabicFontFamily = "amiri" | "scheherazade" | "naskh";
export type LineSpacingScale = "compact" | "normal" | "relaxed";
export type ReadingMode = "voice" | "manual";

export interface ReadingSettings {
  arabicFontSize: FontSizeScale;
  translationFontSize: FontSizeScale;
  theme: ReadingTheme;
  translationFormat: TranslationFormat;
  arabicFont: ArabicFontFamily;
  lineSpacing: LineSpacingScale;
  showTranslation: boolean;
  voiceTrackingEnabled: boolean;
}

export interface BookmarkItem {
  id: string;
  surah: number;
  surahName: string;
  ayah: number;
  page: number;
  juz: number;
  name: string;
  mode: ReadingMode;
  createdAt: string;
}

export interface ReadingPosition {
  surah: number;
  surahName: string;
  ayah: number;
  page: number;
  juz: number;
  mode: ReadingMode;
  updatedAt: string;
}

export interface DailyActivityRecord {
  date: string; // YYYY-MM-DD
  uniqueVerses: string[]; // "surah:ayah" read on this day
  practiceRepeats: number;
  readingSeconds: number;
}

export interface ReadingSession {
  id: string;
  surah: number;
  surahName: string;
  startAyah: number;
  endAyah: number;
  versesCount: number;
  durationSeconds: number;
  mode: ReadingMode;
  startedAt: string;
  endedAt: string;
}

export interface ProgressState {
  lastPosition: ReadingPosition;
  completedVerses: Record<string, string>; // "surah:ayah" -> YYYY-MM-DD first completed
  dailyActivity: Record<string, DailyActivityRecord>;
  sessions: ReadingSession[];
  bookmarks: BookmarkItem[];
}

export const DEFAULT_SETTINGS: ReadingSettings = {
  arabicFontSize: "lg",
  translationFontSize: "md",
  theme: "light",
  translationFormat: "hinglish",
  arabicFont: "amiri",
  lineSpacing: "normal",
  showTranslation: true,
  voiceTrackingEnabled: true,
};

export function getTodayDateKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export const DEFAULT_PROGRESS: ProgressState = {
  lastPosition: {
    surah: 1,
    surahName: "Al-Faatiha",
    ayah: 1,
    page: 1,
    juz: 1,
    mode: "manual",
    updatedAt: new Date().toISOString(),
  },
  completedVerses: {},
  dailyActivity: {},
  sessions: [],
  bookmarks: [],
};

const SETTINGS_KEY = "al_kitab_settings_v1";
const PROGRESS_KEY = "al_kitab_progress_v1";

export function loadSettings(): ReadingSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: ReadingSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // ignore storage quota errors
  }
}

export function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    return {
      lastPosition: parsed.lastPosition ?? DEFAULT_PROGRESS.lastPosition,
      completedVerses: parsed.completedVerses ?? {},
      dailyActivity: parsed.dailyActivity ?? {},
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
      bookmarks: Array.isArray(parsed.bookmarks) ? parsed.bookmarks : [],
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function saveProgress(progress: ProgressState): void {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    // ignore storage quota errors
  }
}

export function recordVerseConfirmed(
  prev: ProgressState,
  info: {
    surah: number;
    surahName: string;
    ayah: number;
    page: number;
    juz: number;
    mode: ReadingMode;
  }
): ProgressState {
  const today = getTodayDateKey();
  const verseId = `${info.surah}:${info.ayah}`;
  const isNewLifetime = !prev.completedVerses[verseId];

  const completedVerses = isNewLifetime
    ? { ...prev.completedVerses, [verseId]: today }
    : prev.completedVerses;

  const existingDay = prev.dailyActivity[today] ?? {
    date: today,
    uniqueVerses: [],
    practiceRepeats: 0,
    readingSeconds: 0,
  };

  const alreadyReadToday = existingDay.uniqueVerses.includes(verseId);
  const updatedDay: DailyActivityRecord = {
    ...existingDay,
    uniqueVerses: alreadyReadToday
      ? existingDay.uniqueVerses
      : [...existingDay.uniqueVerses, verseId],
    practiceRepeats: alreadyReadToday
      ? existingDay.practiceRepeats + 1
      : existingDay.practiceRepeats,
  };

  return {
    ...prev,
    lastPosition: {
      surah: info.surah,
      surahName: info.surahName,
      ayah: info.ayah,
      page: info.page,
      juz: info.juz,
      mode: info.mode,
      updatedAt: new Date().toISOString(),
    },
    completedVerses,
    dailyActivity: {
      ...prev.dailyActivity,
      [today]: updatedDay,
    },
  };
}

export function recordReadingSeconds(
  prev: ProgressState,
  deltaSeconds: number
): ProgressState {
  if (deltaSeconds <= 0) return prev;
  const today = getTodayDateKey();
  const existingDay = prev.dailyActivity[today] ?? {
    date: today,
    uniqueVerses: [],
    practiceRepeats: 0,
    readingSeconds: 0,
  };
  return {
    ...prev,
    dailyActivity: {
      ...prev.dailyActivity,
      [today]: {
        ...existingDay,
        readingSeconds: existingDay.readingSeconds + deltaSeconds,
      },
    },
  };
}

export function calculateStreak(
  dailyActivity: Record<string, DailyActivityRecord>
): number {
  let streak = 0;
  const cursor = new Date();
  for (let i = 0; i < 365; i++) {
    const key = getTodayDateKey(cursor);
    const rec = dailyActivity[key];
    const hasActivity =
      rec && (rec.uniqueVerses.length > 0 || rec.readingSeconds >= 10 || rec.practiceRepeats > 0);
    if (hasActivity) {
      streak++;
    } else if (i === 0) {
      // Allow streak to stay alive if user hasn't read yet today, check yesterday
    } else {
      break;
    }
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function calculateOverallPercent(completedVerses: Record<string, string>): number {
  const count = Object.keys(completedVerses).length;
  return Number(((count / TOTAL_QURAN_VERSES) * 100).toFixed(2));
}

// IndexedDB Offline Quran Dataset Cache
const IDB_NAME = "al_kitab_quran_db";
const IDB_STORE = "surahs";
const IDB_KEY = "all_surahs_v1";

function openQuranDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function readFromIdb(): Promise<SurahData[] | null> {
  try {
    const db = await openQuranDb();
    return await new Promise((resolve) => {
      const tx = db.transaction(IDB_STORE, "readonly");
      const store = tx.objectStore(IDB_STORE);
      const getReq = store.get(IDB_KEY);
      getReq.onsuccess = () => resolve((getReq.result as SurahData[]) || null);
      getReq.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

async function writeToIdb(data: SurahData[]): Promise<void> {
  try {
    const db = await openQuranDb();
    await new Promise<void>((resolve) => {
      const tx = db.transaction(IDB_STORE, "readwrite");
      const store = tx.objectStore(IDB_STORE);
      store.put(data, IDB_KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch {
    // ignore IndexedDB errors
  }
}

let inMemoryQuranCache: Record<number, SurahData> = { ...STARTER_SURAHS };
let fullLoaded = false;

export async function loadFullQuranData(): Promise<Record<number, SurahData>> {
  if (fullLoaded) return inMemoryQuranCache;

  const cached = await readFromIdb();
  if (cached && cached.length === 114) {
    const map: Record<number, SurahData> = {};
    for (const s of cached) map[s.number] = s;
    inMemoryQuranCache = map;
    fullLoaded = true;
    return map;
  }

  const res = await fetch("/data/quran.json");
  if (!res.ok) {
    throw new Error("Could not load offline Quran dataset.");
  }
  const allSurahs = (await res.json()) as SurahData[];
  const map: Record<number, SurahData> = {};
  for (const s of allSurahs) map[s.number] = s;
  inMemoryQuranCache = map;
  fullLoaded = true;
  writeToIdb(allSurahs);
  return map;
}

export function getCachedSurah(surahNumber: number): SurahData | null {
  return inMemoryQuranCache[surahNumber] ?? null;
}

export function isFullQuranLoaded(): boolean {
  return fullLoaded;
}
