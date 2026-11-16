import { useCallback, useEffect, useRef, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { STARTER_SURAHS, SURAH_META, SurahData } from "./data/surahMeta";
import { auth, signInWithGoogle, signOutUser } from "./firebase";
import {
  BookmarkItem,
  ProgressState,
  ReadingMode,
  ReadingSettings,
  getTodayDateKey,
  loadFullQuranData,
  loadProgress,
  loadSettings,
  recordReadingSeconds,
  recordVerseConfirmed,
  saveProgress,
  saveSettings,
} from "./utils/quranStore";
import {
  deleteBookmarkFromFirestore,
  ensureUserProfileInFirestore,
  makeSafeBookmarkId,
  mergeLocalBookmarksToCloud,
  renameBookmarkInFirestore,
  saveBookmarkToFirestore,
  saveCompletedVerseToFirestore,
  saveSessionToFirestore,
  subscribeUserCloudState,
  syncDailyActivityToFirestore,
  syncLastPositionToFirestore,
  syncSettingsToFirestore,
} from "./utils/firebaseSync";
import { AppView, TopBar } from "./components/TopBar";
import { HomeView } from "./components/HomeView";
import { ReaderView } from "./components/ReaderView";
import { BookmarksView } from "./components/BookmarksView";
import { ProgressView } from "./components/ProgressView";

function getInitialView(): AppView {
  const hash = window.location.hash.replace(/^#/, "");
  if (hash === "reader" || hash === "bookmarks" || hash === "progress") {
    return hash;
  }
  return "home";
}

export default function App() {
  const [activeView, setActiveView] = useState<AppView>(() => getInitialView());
  const [settings, setSettings] = useState<ReadingSettings>(() => loadSettings());
  const [progress, setProgress] = useState<ProgressState>(() => loadProgress());

  useEffect(() => {
    window.location.hash = activeView;
  }, [activeView]);

  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const userRef = useRef<User | null>(null);
  userRef.current = user;

  const [quranMap, setQuranMap] = useState<Record<number, SurahData>>(
    () => STARTER_SURAHS
  );
  const [isFullLoaded, setIsFullLoaded] = useState(false);

  const [activeSurah, setActiveSurah] = useState<number>(
    () => loadProgress().lastPosition.surah || 1
  );
  const [activeAyah, setActiveAyah] = useState<number>(
    () => loadProgress().lastPosition.ayah || 1
  );
  const [pageMode, setPageMode] = useState(false);
  const [activePage, setActivePage] = useState<number>(
    () => loadProgress().lastPosition.page || 1
  );
  const [autoStartVoice, setAutoStartVoice] = useState(false);

  // Track if user explicitly navigated inside Reader so cloud profile doesn't yank them back
  const hasExplicitlyNavigatedRef = useRef(false);

  // Apply reading theme class to documentElement cleanly
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark", "theme-dark", "theme-sepia");
    if (settings.theme === "dark") {
      root.classList.add("dark", "theme-dark");
    } else if (settings.theme === "sepia") {
      root.classList.add("theme-sepia");
    }
  }, [settings.theme]);

  // Load full offline Quran dataset & manage Service Worker cleanly
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      if (import.meta.env.DEV) {
        navigator.serviceWorker
          .getRegistrations()
          .then((regs) => Promise.all(regs.map((r) => r.unregister())))
          .catch(() => {});
        if ("caches" in window) {
          caches
            .keys()
            .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
            .catch(() => {});
        }
      } else {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => reg.update().catch(() => {}))
          .catch(() => {});
      }
    }
    loadFullQuranData()
      .then((map) => {
        setQuranMap(map);
        setIsFullLoaded(true);
      })
      .catch(() => {
        // Starter Surahs remain available
      });
  }, []);

  // Firebase Auth & Cloud Firestore Subscription
  useEffect(() => {
    let unsubCloud: (() => void) | null = null;

    const unsubAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (unsubCloud) {
        unsubCloud();
        unsubCloud = null;
      }

      setUser(firebaseUser);
      setAuthReady(true);

      if (!firebaseUser) return;

      try {
        const localSettings = loadSettings();
        const localProgress = loadProgress();
        await ensureUserProfileInFirestore(
          firebaseUser,
          localSettings,
          localProgress.lastPosition
        );

        // Upload any bookmarks created locally prior to sign-in
        if (localProgress.bookmarks.length > 0) {
          await mergeLocalBookmarksToCloud(firebaseUser.uid, localProgress);
        }

        unsubCloud = subscribeUserCloudState(firebaseUser.uid, {
          onProfileLoaded: (settingsPatch, lastPosition) => {
            if (Object.keys(settingsPatch).length > 0) {
              setSettings((prev) => {
                const next = { ...prev, ...settingsPatch };
                saveSettings(next);
                return next;
              });
            }
            setProgress((prev) => {
              const next = { ...prev, lastPosition };
              saveProgress(next);
              return next;
            });
            if (!hasExplicitlyNavigatedRef.current) {
              setActiveSurah(lastPosition.surah);
              setActiveAyah(lastPosition.ayah);
              setActivePage(lastPosition.page);
            }
          },
          onBookmarksChanged: (bookmarks) => {
            setProgress((prev) => {
              const next = { ...prev, bookmarks };
              saveProgress(next);
              return next;
            });
          },
          onCompletedVersesChanged: (completedVerses) => {
            setProgress((prev) => {
              const merged = { ...prev.completedVerses, ...completedVerses };
              const next = { ...prev, completedVerses: merged };
              saveProgress(next);
              return next;
            });
          },
          onDailyActivityChanged: (cloudDaily) => {
            setProgress((prev) => {
              const mergedDaily = { ...prev.dailyActivity };
              for (const [dateKey, rec] of Object.entries(cloudDaily)) {
                const localRec = mergedDaily[dateKey];
                if (
                  !localRec ||
                  rec.uniqueVerses.length >= localRec.uniqueVerses.length
                ) {
                  mergedDaily[dateKey] = rec;
                }
              }
              const next = { ...prev, dailyActivity: mergedDaily };
              saveProgress(next);
              return next;
            });
          },
          onSessionsChanged: (sessions) => {
            if (sessions.length > 0) {
              setProgress((prev) => {
                const next = { ...prev, sessions };
                saveProgress(next);
                return next;
              });
            }
          },
          onError: (err) => {
            console.error("Cloud sync error:", err.message);
          },
        });
      } catch (err) {
        console.error("Failed initializing user cloud profile:", err);
      }
    });

    return () => {
      unsubAuth();
      if (unsubCloud) unsubCloud();
    };
  }, []);

  // Active reading time tracker (counts seconds while Reader is open & visible)
  useEffect(() => {
    if (activeView !== "reader") return;
    let ticks = 0;
    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        ticks++;
        setProgress((prev) => {
          const next = recordReadingSeconds(prev, 5);
          saveProgress(next);
          if (userRef.current && ticks % 3 === 0) {
            const todayKey = getTodayDateKey();
            const day = next.dailyActivity[todayKey];
            if (day) {
              void syncDailyActivityToFirestore(
                userRef.current.uid,
                todayKey,
                day.uniqueVerses.length,
                day.practiceRepeats,
                day.readingSeconds
              );
            }
          }
          return next;
        });
      }
    }, 5000);
    return () => window.clearInterval(interval);
  }, [activeView]);

  const handleSignIn = useCallback(async () => {
    setAuthError(null);
    setSigningIn(true);
    try {
      await signInWithGoogle();
    } catch (err: unknown) {
      const code =
        typeof err === "object" && err !== null && "code" in err
          ? String((err as { code?: string }).code)
          : "";
      if (code === "auth/popup-blocked") {
        setAuthError(
          "Sign-in popup was blocked by your browser. Please allow popups for this site and try again."
        );
      } else if (code !== "auth/popup-closed-by-user") {
        const msg =
          err instanceof Error ? err.message : "Could not sign in with Google.";
        setAuthError(msg);
      }
    } finally {
      setSigningIn(false);
    }
  }, []);

  const handleSignOut = useCallback(async () => {
    try {
      await signOutUser();
    } catch (err) {
      console.error("Sign out error:", err);
    }
  }, []);

  const handleUpdateSettings = useCallback(
    (patch: Partial<ReadingSettings>) => {
      setSettings((prev) => {
        const next = { ...prev, ...patch };
        saveSettings(next);
        if (userRef.current) {
          void syncSettingsToFirestore(userRef.current.uid, next);
        }
        return next;
      });
    },
    []
  );

  const handleOpenPosition = useCallback(
    (
      surah: number,
      ayah: number,
      options?: { startVoice?: boolean; pageMode?: boolean; page?: number }
    ) => {
      hasExplicitlyNavigatedRef.current = true;
      setActiveSurah(surah);
      setActiveAyah(ayah);
      setPageMode(Boolean(options?.pageMode));
      if (options?.page) {
        setActivePage(options.page);
      } else {
        const meta = SURAH_META.find((s) => s.number === surah);
        setActivePage(meta?.startPage ?? 1);
      }
      setAutoStartVoice(Boolean(options?.startVoice));
      setActiveView("reader");
    },
    []
  );

  const handleSelectPositionInReader = useCallback(
    (
      surah: number,
      ayah: number,
      options?: { pageMode?: boolean; page?: number; mode?: ReadingMode }
    ) => {
      hasExplicitlyNavigatedRef.current = true;
      setActiveSurah(surah);
      setActiveAyah(ayah);
      if (typeof options?.pageMode === "boolean") {
        setPageMode(options.pageMode);
      }
      if (options?.page) {
        setActivePage(options.page);
      }
    },
    []
  );

  const handleConfirmVerse = useCallback(
    (info: {
      surah: number;
      surahName: string;
      ayah: number;
      page: number;
      juz: number;
      mode: ReadingMode;
    }) => {
      const todayKey = getTodayDateKey();
      setProgress((prev) => {
        const next = recordVerseConfirmed(prev, info);
        saveProgress(next);
        if (userRef.current) {
          const uid = userRef.current.uid;
          void syncLastPositionToFirestore(uid, info);
          void saveCompletedVerseToFirestore(
            uid,
            info.surah,
            info.ayah,
            todayKey
          );
          const day = next.dailyActivity[todayKey];
          if (day) {
            void syncDailyActivityToFirestore(
              uid,
              todayKey,
              day.uniqueVerses.length,
              day.practiceRepeats,
              day.readingSeconds
            );
          }
        }
        return next;
      });
    },
    []
  );

  const handleAddBookmark = useCallback(
    (info: {
      surah: number;
      surahName: string;
      ayah: number;
      page: number;
      juz: number;
      name: string;
      mode: ReadingMode;
      fromModal?: boolean;
    }) => {
      setProgress((prev) => {
        const existingItem = prev.bookmarks.find(
          (b) => b.surah === info.surah && b.ayah === info.ayah
        );

        let nextBookmarks: BookmarkItem[];
        if (existingItem && !info.fromModal) {
          // Quick verse-row icon toggles off an existing bookmark
          nextBookmarks = prev.bookmarks.filter(
            (b) => b.id !== existingItem.id
          );
          if (userRef.current) {
            void deleteBookmarkFromFirestore(
              userRef.current.uid,
              existingItem.id
            );
          }
        } else {
          const id = makeSafeBookmarkId();
          const item: BookmarkItem = {
            id,
            surah: info.surah,
            surahName: info.surahName,
            ayah: info.ayah,
            page: info.page,
            juz: info.juz,
            name: info.name,
            mode: info.mode,
            createdAt: new Date().toISOString(),
          };
          nextBookmarks = [item, ...prev.bookmarks];
          if (userRef.current) {
            void saveBookmarkToFirestore(userRef.current.uid, item);
          }
        }

        const next = { ...prev, bookmarks: nextBookmarks };
        saveProgress(next);
        return next;
      });
    },
    []
  );

  const handleRenameBookmark = useCallback((id: string, newName: string) => {
    setProgress((prev) => {
      const next = {
        ...prev,
        bookmarks: prev.bookmarks.map((b) =>
          b.id === id ? { ...b, name: newName } : b
        ),
      };
      saveProgress(next);
      if (userRef.current) {
        void renameBookmarkInFirestore(userRef.current.uid, id, newName);
      }
      return next;
    });
  }, []);

  const handleDeleteBookmark = useCallback((id: string) => {
    setProgress((prev) => {
      const next = {
        ...prev,
        bookmarks: prev.bookmarks.filter((b) => b.id !== id),
      };
      saveProgress(next);
      if (userRef.current) {
        void deleteBookmarkFromFirestore(userRef.current.uid, id);
      }
      return next;
    });
  }, []);

  const handleRecordSession = useCallback(
    (session: {
      surah: number;
      surahName: string;
      startAyah: number;
      endAyah: number;
      versesCount: number;
      durationSeconds: number;
      mode: ReadingMode;
      startedAt: string;
    }) => {
      const newSession = {
        id: makeSafeBookmarkId(`sess_${Date.now()}`),
        ...session,
        endedAt: new Date().toISOString(),
      };
      setProgress((prev) => {
        const next = {
          ...prev,
          sessions: [newSession, ...prev.sessions].slice(0, 50),
        };
        saveProgress(next);
        if (userRef.current) {
          void saveSessionToFirestore(userRef.current.uid, newSession);
        }
        return next;
      });
    },
    []
  );

  const handleImportProgress = useCallback((imported: ProgressState) => {
    saveProgress(imported);
    setProgress(imported);
    setActiveSurah(imported.lastPosition.surah || 1);
    setActiveAyah(imported.lastPosition.ayah || 1);
    if (userRef.current) {
      void mergeLocalBookmarksToCloud(userRef.current.uid, imported);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-ink)]">
      <TopBar
        activeView={activeView}
        onNavigate={(view) => {
          setAutoStartVoice(false);
          setActiveView(view);
        }}
        user={user}
        authReady={authReady}
        signingIn={signingIn}
        onSignIn={() => void handleSignIn()}
        onSignOut={() => void handleSignOut()}
        onContinueReading={() =>
          handleOpenPosition(
            progress.lastPosition.surah,
            progress.lastPosition.ayah
          )
        }
      />

      {authError && (
        <div className="mx-auto max-w-5xl px-4 pt-4 sm:px-6">
          <div className="flex items-center justify-between rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-elevated)] px-4 py-2.5 text-xs text-red-600 dark:text-red-400">
            <span>{authError}</span>
            <button
              type="button"
              onClick={() => setAuthError(null)}
              className="text-[var(--text-muted)] hover:text-[var(--text-ink)] cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {activeView === "home" && (
        <HomeView
          progress={progress}
          isOfflineReady={isFullLoaded}
          user={user}
          signingIn={signingIn}
          onSignIn={() => void handleSignIn()}
          onSignOut={() => void handleSignOut()}
          onOpenPosition={handleOpenPosition}
          onNavigate={setActiveView}
        />
      )}

      {activeView === "reader" && (
        <ReaderView
          quranMap={quranMap}
          isFullLoaded={isFullLoaded}
          activeSurah={activeSurah}
          activeAyah={activeAyah}
          pageMode={pageMode}
          activePage={activePage}
          autoStartVoice={autoStartVoice}
          settings={settings}
          progress={progress}
          user={user}
          onSignIn={() => void handleSignIn()}
          onUpdateSettings={handleUpdateSettings}
          onSelectPosition={handleSelectPositionInReader}
          onConfirmVerse={handleConfirmVerse}
          onAddBookmark={handleAddBookmark}
          onRecordSession={handleRecordSession}
        />
      )}

      {activeView === "bookmarks" && (
        <BookmarksView
          progress={progress}
          user={user}
          onSignIn={() => void handleSignIn()}
          onOpenBookmark={(surah, ayah) => handleOpenPosition(surah, ayah)}
          onRenameBookmark={handleRenameBookmark}
          onDeleteBookmark={handleDeleteBookmark}
          onImportProgress={handleImportProgress}
        />
      )}

      {activeView === "progress" && (
        <ProgressView
          progress={progress}
          onOpenLastPosition={() =>
            handleOpenPosition(
              progress.lastPosition.surah,
              progress.lastPosition.ayah
            )
          }
        />
      )}
    </div>
  );
}
