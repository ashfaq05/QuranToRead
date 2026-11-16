import { User } from "firebase/auth";
import {
  Timestamp,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { OperationType, db, handleFirestoreError } from "../firebase";
import {
  BookmarkItem,
  DailyActivityRecord,
  ProgressState,
  ReadingMode,
  ReadingPosition,
  ReadingSession,
  ReadingSettings,
} from "./quranStore";

function clampInt(val: number, min: number, max: number): number {
  const n = Math.trunc(Number.isFinite(val) ? val : min);
  return Math.max(min, Math.min(max, n));
}

function clampStr(val: string | undefined, maxLen: number, fallback = ""): string {
  const clean = (val ?? fallback).trim();
  return clean.slice(0, maxLen);
}

function timestampToIso(ts: unknown): string {
  if (ts instanceof Timestamp) {
    return ts.toDate().toISOString();
  }
  if (typeof ts === "string") return ts;
  return new Date().toISOString();
}

export async function ensureUserProfileInFirestore(
  user: User,
  localSettings: ReadingSettings,
  localPosition: ReadingPosition
): Promise<void> {
  const userPath = `users/${user.uid}`;
  const ref = doc(db, "users", user.uid);
  try {
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        uid: user.uid,
        displayName: clampStr(user.displayName ?? "Reader", 120, "Reader"),
        photoURL: clampStr(user.photoURL ?? "", 500, ""),
        theme: localSettings.theme,
        arabicFontSize: localSettings.arabicFontSize,
        translationFontSize: localSettings.translationFontSize,
        translationFormat: localSettings.translationFormat,
        arabicFont: localSettings.arabicFont,
        lineSpacing: localSettings.lineSpacing,
        showTranslation: localSettings.showTranslation,
        voiceTrackingEnabled: localSettings.voiceTrackingEnabled,
        lastSurah: clampInt(localPosition.surah, 1, 114),
        lastSurahName: clampStr(localPosition.surahName, 80, "Al-Faatiha"),
        lastAyah: clampInt(localPosition.ayah, 1, 286),
        lastPage: clampInt(localPosition.page, 1, 604),
        lastJuz: clampInt(localPosition.juz, 1, 30),
        lastMode: localPosition.mode,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, userPath);
  }
}

export async function syncSettingsToFirestore(
  uid: string,
  settings: ReadingSettings
): Promise<void> {
  const userPath = `users/${uid}`;
  try {
    await updateDoc(doc(db, "users", uid), {
      theme: settings.theme,
      arabicFontSize: settings.arabicFontSize,
      translationFontSize: settings.translationFontSize,
      translationFormat: settings.translationFormat,
      arabicFont: settings.arabicFont,
      lineSpacing: settings.lineSpacing,
      showTranslation: settings.showTranslation,
      voiceTrackingEnabled: settings.voiceTrackingEnabled,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, userPath);
  }
}

export async function syncLastPositionToFirestore(
  uid: string,
  pos: {
    surah: number;
    surahName: string;
    ayah: number;
    page: number;
    juz: number;
    mode: ReadingMode;
  }
): Promise<void> {
  const userPath = `users/${uid}`;
  try {
    await updateDoc(doc(db, "users", uid), {
      lastSurah: clampInt(pos.surah, 1, 114),
      lastSurahName: clampStr(pos.surahName, 80, "Al-Faatiha"),
      lastAyah: clampInt(pos.ayah, 1, 286),
      lastPage: clampInt(pos.page, 1, 604),
      lastJuz: clampInt(pos.juz, 1, 30),
      lastMode: pos.mode,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, userPath);
  }
}

export function makeSafeBookmarkId(rawId?: string): string {
  const cleaned = (rawId ?? "").replace(/[^a-zA-Z0-9_-]/g, "");
  if (cleaned.length >= 4 && cleaned.length <= 120) return cleaned;
  return `bm_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function saveBookmarkToFirestore(
  uid: string,
  bookmark: BookmarkItem
): Promise<void> {
  const safeId = makeSafeBookmarkId(bookmark.id);
  const path = `users/${uid}/bookmarks/${safeId}`;
  const ref = doc(db, "users", uid, "bookmarks", safeId);
  try {
    const existing = await getDoc(ref);
    if (existing.exists()) {
      await updateDoc(ref, {
        surah: clampInt(bookmark.surah, 1, 114),
        surahName: clampStr(bookmark.surahName, 80, "Al-Faatiha"),
        ayah: clampInt(bookmark.ayah, 1, 286),
        page: clampInt(bookmark.page, 1, 604),
        juz: clampInt(bookmark.juz, 1, 30),
        name: clampStr(bookmark.name, 120, `Surah ${bookmark.surahName}`),
        mode: bookmark.mode,
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(ref, {
        ownerId: uid,
        surah: clampInt(bookmark.surah, 1, 114),
        surahName: clampStr(bookmark.surahName, 80, "Al-Faatiha"),
        ayah: clampInt(bookmark.ayah, 1, 286),
        page: clampInt(bookmark.page, 1, 604),
        juz: clampInt(bookmark.juz, 1, 30),
        name: clampStr(bookmark.name, 120, `Surah ${bookmark.surahName}`),
        mode: bookmark.mode,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}

export async function renameBookmarkInFirestore(
  uid: string,
  bookmarkId: string,
  newName: string
): Promise<void> {
  const safeId = makeSafeBookmarkId(bookmarkId);
  const path = `users/${uid}/bookmarks/${safeId}`;
  try {
    await updateDoc(doc(db, "users", uid, "bookmarks", safeId), {
      name: clampStr(newName, 120, "Bookmark"),
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

export async function deleteBookmarkFromFirestore(
  uid: string,
  bookmarkId: string
): Promise<void> {
  const safeId = makeSafeBookmarkId(bookmarkId);
  const path = `users/${uid}/bookmarks/${safeId}`;
  try {
    await deleteDoc(doc(db, "users", uid, "bookmarks", safeId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

export async function saveCompletedVerseToFirestore(
  uid: string,
  surah: number,
  ayah: number,
  dateKey: string
): Promise<void> {
  const verseKey = `${clampInt(surah, 1, 114)}_${clampInt(ayah, 1, 286)}`;
  const path = `users/${uid}/completedVerses/${verseKey}`;
  const ref = doc(db, "users", uid, "completedVerses", verseKey);
  try {
    const existing = await getDoc(ref);
    if (!existing.exists()) {
      await setDoc(ref, {
        ownerId: uid,
        surah: clampInt(surah, 1, 114),
        ayah: clampInt(ayah, 1, 286),
        completedDate: dateKey,
        createdAt: serverTimestamp(),
      });
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}

export async function syncDailyActivityToFirestore(
  uid: string,
  dateKey: string,
  uniqueCount: number,
  practiceRepeats: number,
  readingSeconds: number
): Promise<void> {
  const path = `users/${uid}/dailyActivity/${dateKey}`;
  const ref = doc(db, "users", uid, "dailyActivity", dateKey);
  try {
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        ownerId: uid,
        date: dateKey,
        uniqueCount: clampInt(uniqueCount, 0, 6236),
        practiceRepeats: clampInt(practiceRepeats, 0, 100000),
        readingSeconds: clampInt(readingSeconds, 0, 86400),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      await updateDoc(ref, {
        uniqueCount: clampInt(uniqueCount, 0, 6236),
        practiceRepeats: clampInt(practiceRepeats, 0, 100000),
        readingSeconds: clampInt(readingSeconds, 0, 86400),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function saveSessionToFirestore(
  uid: string,
  session: ReadingSession
): Promise<void> {
  const safeId = makeSafeBookmarkId(session.id);
  const path = `users/${uid}/sessions/${safeId}`;
  try {
    await setDoc(doc(db, "users", uid, "sessions", safeId), {
      ownerId: uid,
      surah: clampInt(session.surah, 1, 114),
      surahName: clampStr(session.surahName, 80, "Al-Faatiha"),
      startAyah: clampInt(session.startAyah, 1, 286),
      endAyah: clampInt(session.endAyah, 1, 286),
      versesCount: clampInt(session.versesCount, 1, 286),
      durationSeconds: clampInt(session.durationSeconds, 1, 86400),
      mode: session.mode,
      startedAt: clampStr(session.startedAt, 40, new Date().toISOString()),
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}

export function subscribeUserCloudState(
  uid: string,
  callbacks: {
    onProfileLoaded: (
      settingsPatch: Partial<ReadingSettings>,
      lastPosition: ReadingPosition
    ) => void;
    onBookmarksChanged: (bookmarks: BookmarkItem[]) => void;
    onCompletedVersesChanged: (completedMap: Record<string, string>) => void;
    onDailyActivityChanged: (
      dailyMap: Record<string, DailyActivityRecord>
    ) => void;
    onSessionsChanged: (sessions: ReadingSession[]) => void;
    onError: (err: Error) => void;
  }
): () => void {
  const unsubProfile = onSnapshot(
    doc(db, "users", uid),
    (snap) => {
      if (!snap.exists()) return;
      const d = snap.data();
      const settingsPatch: Partial<ReadingSettings> = {};
      if (d.theme) settingsPatch.theme = d.theme;
      if (d.arabicFontSize) settingsPatch.arabicFontSize = d.arabicFontSize;
      if (d.translationFontSize)
        settingsPatch.translationFontSize = d.translationFontSize;
      if (d.translationFormat)
        settingsPatch.translationFormat = d.translationFormat;
      if (d.arabicFont) settingsPatch.arabicFont = d.arabicFont;
      if (d.lineSpacing) settingsPatch.lineSpacing = d.lineSpacing;
      if (typeof d.showTranslation === "boolean")
        settingsPatch.showTranslation = d.showTranslation;
      if (typeof d.voiceTrackingEnabled === "boolean")
        settingsPatch.voiceTrackingEnabled = d.voiceTrackingEnabled;

      const lastPos: ReadingPosition = {
        surah: d.lastSurah ?? 1,
        surahName: d.lastSurahName ?? "Al-Faatiha",
        ayah: d.lastAyah ?? 1,
        page: d.lastPage ?? 1,
        juz: d.lastJuz ?? 1,
        mode: d.lastMode === "voice" ? "voice" : "manual",
        updatedAt: timestampToIso(d.updatedAt),
      };
      callbacks.onProfileLoaded(settingsPatch, lastPos);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.GET, `users/${uid}`);
      } catch (wrapped) {
        callbacks.onError(wrapped as Error);
      }
    }
  );

  const bookmarksPath = `users/${uid}/bookmarks`;
  const unsubBookmarks = onSnapshot(
    query(collection(db, "users", uid, "bookmarks"), where("ownerId", "==", uid)),
    (snap) => {
      const items: BookmarkItem[] = snap.docs.map((docSnap) => {
        const d = docSnap.data();
        return {
          id: docSnap.id,
          surah: d.surah,
          surahName: d.surahName,
          ayah: d.ayah,
          page: d.page,
          juz: d.juz,
          name: d.name,
          mode: d.mode === "voice" ? "voice" : "manual",
          createdAt: timestampToIso(d.createdAt),
        };
      });
      items.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      callbacks.onBookmarksChanged(items);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, bookmarksPath);
      } catch (wrapped) {
        callbacks.onError(wrapped as Error);
      }
    }
  );

  const completedPath = `users/${uid}/completedVerses`;
  const unsubCompleted = onSnapshot(
    query(
      collection(db, "users", uid, "completedVerses"),
      where("ownerId", "==", uid)
    ),
    (snap) => {
      const map: Record<string, string> = {};
      for (const docSnap of snap.docs) {
        const d = docSnap.data();
        map[`${d.surah}:${d.ayah}`] = d.completedDate;
      }
      callbacks.onCompletedVersesChanged(map);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, completedPath);
      } catch (wrapped) {
        callbacks.onError(wrapped as Error);
      }
    }
  );

  const dailyPath = `users/${uid}/dailyActivity`;
  const unsubDaily = onSnapshot(
    query(
      collection(db, "users", uid, "dailyActivity"),
      where("ownerId", "==", uid)
    ),
    (snap) => {
      const map: Record<string, DailyActivityRecord> = {};
      for (const docSnap of snap.docs) {
        const d = docSnap.data();
        // uniqueVerses array reconstructed from completedVerses or count placeholder
        map[d.date] = {
          date: d.date,
          uniqueVerses: Array.from(
            { length: d.uniqueCount ?? 0 },
            (_, idx) => `${d.date}:${idx}`
          ),
          practiceRepeats: d.practiceRepeats ?? 0,
          readingSeconds: d.readingSeconds ?? 0,
        };
      }
      callbacks.onDailyActivityChanged(map);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, dailyPath);
      } catch (wrapped) {
        callbacks.onError(wrapped as Error);
      }
    }
  );

  const sessionsPath = `users/${uid}/sessions`;
  const unsubSessions = onSnapshot(
    query(collection(db, "users", uid, "sessions"), where("ownerId", "==", uid)),
    (snap) => {
      const list: ReadingSession[] = snap.docs.map((docSnap) => {
        const d = docSnap.data();
        return {
          id: docSnap.id,
          surah: d.surah,
          surahName: d.surahName,
          startAyah: d.startAyah,
          endAyah: d.endAyah,
          versesCount: d.versesCount,
          durationSeconds: d.durationSeconds,
          mode: d.mode === "voice" ? "voice" : "manual",
          startedAt: d.startedAt,
          endedAt: timestampToIso(d.createdAt),
        };
      });
      list.sort(
        (a, b) =>
          new Date(b.endedAt).getTime() - new Date(a.endedAt).getTime()
      );
      callbacks.onSessionsChanged(list.slice(0, 50));
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, sessionsPath);
      } catch (wrapped) {
        callbacks.onError(wrapped as Error);
      }
    }
  );

  return () => {
    unsubProfile();
    unsubBookmarks();
    unsubCompleted();
    unsubDaily();
    unsubSessions();
  };
}

export async function mergeLocalBookmarksToCloud(
  uid: string,
  localProgress: ProgressState
): Promise<void> {
  // Push only locally-created bookmarks that do not yet exist in Firestore
  for (const bm of localProgress.bookmarks) {
    const safeId = makeSafeBookmarkId(bm.id);
    const ref = doc(db, "users", uid, "bookmarks", safeId);
    try {
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        await saveBookmarkToFirestore(uid, { ...bm, id: safeId });
      }
    } catch (err) {
      handleFirestoreError(
        err,
        OperationType.GET,
        `users/${uid}/bookmarks/${safeId}`
      );
    }
  }
}
