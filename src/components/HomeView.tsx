import React, { useMemo, useState } from "react";
import { User } from "firebase/auth";
import {
  BookOpen,
  Bookmark,
  BarChart3,
  Search,
  ArrowRight,
  LogOut,
} from "lucide-react";
import {
  JUZ_INDEX,
  SURAH_META,
  TOTAL_QURAN_PAGES,
  TOTAL_QURAN_VERSES,
} from "../data/surahMeta";
import {
  ProgressState,
  calculateOverallPercent,
  calculateStreak,
  getTodayDateKey,
} from "../utils/quranStore";
import { AppView, GoogleGIcon } from "./TopBar";

interface HomeViewProps {
  progress: ProgressState;
  isOfflineReady: boolean;
  user: User | null;
  signingIn: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
  onOpenPosition: (
    surah: number,
    ayah: number,
    options?: { pageMode?: boolean; page?: number }
  ) => void;
  onNavigate: (view: AppView) => void;
}

type IndexTab = "surahs" | "juz" | "pages";

export const HomeView: React.FC<HomeViewProps> = ({
  progress,
  isOfflineReady,
  user,
  signingIn,
  onSignIn,
  onSignOut,
  onOpenPosition,
  onNavigate,
}) => {
  const [indexTab, setIndexTab] = useState<IndexTab>("surahs");
  const [query, setQuery] = useState("");
  const [pageInput, setPageInput] = useState(
    String(progress.lastPosition.page || 1)
  );

  const todayKey = getTodayDateKey();
  const todayStats = progress.dailyActivity[todayKey];
  const versesToday = todayStats?.uniqueVerses.length ?? 0;
  const totalCompleted = Object.keys(progress.completedVerses).length;
  const overallPercent = calculateOverallPercent(progress.completedVerses);
  const streak = calculateStreak(progress.dailyActivity);

  const filteredSurahs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SURAH_META;
    return SURAH_META.filter(
      (s) =>
        String(s.number) === q ||
        s.englishName.toLowerCase().includes(q) ||
        s.englishNameTranslation.toLowerCase().includes(q) ||
        s.name.includes(q)
    );
  }, [query]);

  const { lastPosition } = progress;

  const handleJumpPage = (e: React.FormEvent) => {
    e.preventDefault();
    const num = Math.max(
      1,
      Math.min(TOTAL_QURAN_PAGES, parseInt(pageInput, 10) || 1)
    );
    // Find the Surah starting at or just before this page
    let targetSurah = SURAH_META[0];
    for (const s of SURAH_META) {
      if (s.startPage <= num) {
        targetSurah = s;
      } else {
        break;
      }
    }
    onOpenPosition(targetSurah.number, 1, { pageMode: true, page: num });
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 space-y-12">
      {/* Greeting, Google Account Bar & Focal Continue Reading Card */}
      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm text-[var(--text-muted)]">
              Assalamu Alaikum{user?.displayName ? `, ${user.displayName}` : ""}
            </p>
            <h1 className="font-editorial text-4xl sm:text-5xl font-medium tracking-tight text-[var(--text-ink)] text-balance">
              Continue your reading
            </h1>
          </div>

          {user ? (
            <div className="flex items-center gap-3 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-elevated)] px-3.5 py-2 self-start sm:self-auto">
              {user.photoURL && (
                <img
                  src={user.photoURL}
                  alt={user.displayName ?? "User"}
                  referrerPolicy="no-referrer"
                  className="h-6 w-6 rounded-full object-cover"
                />
              )}
              <div className="min-w-0">
                <p className="text-xs font-medium text-[var(--text-ink)] truncate max-w-[180px]">
                  {user.email}
                </p>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Bookmarks &amp; progress synced
                </p>
              </div>
              <button
                type="button"
                onClick={onSignOut}
                aria-label="Sign out"
                className="p-1 text-[var(--text-muted)] hover:text-[var(--text-ink)] cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-3 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-elevated)] px-4 py-2.5 self-start sm:self-auto">
              <div className="text-xs text-[var(--text-muted)]">
                Save bookmarks across refreshes
              </div>
              <button
                type="button"
                disabled={signingIn}
                onClick={onSignIn}
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent-primary)] px-3.5 py-1.5 text-xs font-medium text-[var(--accent-primary-fg)] hover:opacity-90 disabled:opacity-60 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <GoogleGIcon className="h-3.5 w-3.5" />
                <span>{signingIn ? "Signing in..." : "Sign in with Google"}</span>
              </button>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-elevated)] p-6 sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]">
                <span>Last reading position</span>
                <span aria-hidden="true">·</span>
                <span>
                  {isOfflineReady
                    ? "Offline copy ready"
                    : "Loading full Quran"}
                </span>
              </div>
              <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-[var(--text-ink)]">
                Surah {lastPosition.surahName}
              </h2>
              <p className="font-mono-tabular text-sm text-[var(--text-muted)]">
                Ayah {lastPosition.ayah} · Page {lastPosition.page} · Juz{" "}
                {lastPosition.juz}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  onOpenPosition(lastPosition.surah, lastPosition.ayah)
                }
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent-primary)] px-5 py-2.5 text-sm font-medium text-[var(--accent-primary-fg)] transition-opacity duration-150 hover:opacity-90 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <BookOpen className="h-4 w-4" />
                <span>Continue Reading</span>
              </button>
            </div>
          </div>

          <div className="mt-6 border-t border-[var(--border-hairline)] pt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => onNavigate("progress")}
              className="flex items-center justify-between text-left group cursor-pointer"
            >
              <div>
                <p className="text-xs text-[var(--text-muted)]">
                  Quran completed
                </p>
                <p className="font-mono-tabular text-lg font-medium text-[var(--text-ink)]">
                  {overallPercent}%{" "}
                  <span className="text-xs text-[var(--text-muted)]">
                    ({totalCompleted}/{TOTAL_QURAN_VERSES})
                  </span>
                </p>
              </div>
              <BarChart3 className="h-4 w-4 text-[var(--text-muted)] group-hover:text-[var(--text-ink)] transition-colors" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate("progress")}
              className="flex items-center justify-between text-left group cursor-pointer"
            >
              <div>
                <p className="text-xs text-[var(--text-muted)]">
                  Today&apos;s reading
                </p>
                <p className="font-mono-tabular text-lg font-medium text-[var(--text-ink)]">
                  {versesToday} verses{" "}
                  <span className="text-xs text-[var(--text-muted)]">
                    · {streak} day streak
                  </span>
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-[var(--text-muted)] group-hover:text-[var(--text-ink)] transition-colors" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate("bookmarks")}
              className="flex items-center justify-between text-left group cursor-pointer"
            >
              <div>
                <p className="text-xs text-[var(--text-muted)]">
                  Saved bookmarks
                </p>
                <p className="font-mono-tabular text-lg font-medium text-[var(--text-ink)]">
                  {progress.bookmarks.length} saved
                </p>
              </div>
              <Bookmark className="h-4 w-4 text-[var(--text-muted)] group-hover:text-[var(--text-ink)] transition-colors" />
            </button>
          </div>
        </div>
      </section>

      {/* Browse Quran: Surahs, Juz, Pages */}
      <section className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-[var(--border-hairline)] pb-4">
          <div className="space-y-1">
            <h2 className="font-editorial text-2xl sm:text-3xl font-medium text-[var(--text-ink)]">
              Read Quran
            </h2>
            <p className="text-sm text-[var(--text-muted)]">
              Browse all 114 Surahs, 30 Juz, or jump directly to any Mushaf page
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Browse mode"
            className="inline-flex items-center gap-1 rounded-lg bg-[var(--bg-surface)] p-1 self-start sm:self-auto"
          >
            {(
              [
                { id: "surahs", label: "Surahs (114)" },
                { id: "juz", label: "Juz (30)" },
                { id: "pages", label: "Page (604)" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={indexTab === tab.id}
                onClick={() => setIndexTab(tab.id)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  indexTab === tab.id
                    ? "bg-[var(--bg-elevated)] text-[var(--text-ink)] shadow-xs"
                    : "text-[var(--text-muted)] hover:text-[var(--text-ink)]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {indexTab === "surahs" && (
          <div className="space-y-5">
            <div className="relative max-w-md">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Surah by name or number (e.g. Yaseen, 36)..."
                aria-label="Search Surahs"
                className="w-full rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-elevated)] py-2.5 pl-10 pr-4 text-sm text-[var(--text-ink)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-primary)] focus:outline-none"
              />
            </div>

            {filteredSurahs.length === 0 ? (
              <p className="py-8 text-sm text-[var(--text-muted)]">
                No Surahs match &ldquo;{query}&rdquo;.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {filteredSurahs.map((s) => (
                  <button
                    key={s.number}
                    type="button"
                    onClick={() => onOpenPosition(s.number, 1)}
                    className="flex items-center justify-between gap-4 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-elevated)] px-4 py-3.5 text-left transition-colors duration-150 hover:border-[var(--accent-primary)] cursor-pointer"
                  >
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono-tabular text-xs text-[var(--text-muted)]">
                          {String(s.number).padStart(2, "0")}.
                        </span>
                        <span className="truncate text-sm font-semibold text-[var(--text-ink)]">
                          {s.englishName}
                        </span>
                      </div>
                      <p className="truncate text-xs text-[var(--text-muted)]">
                        {s.englishNameTranslation} · {s.numberOfAyahs} verses
                      </p>
                    </div>
                    <span
                      dir="rtl"
                      className="font-arabic-amiri text-xl text-[var(--text-ink)] shrink-0"
                    >
                      {s.name.replace(/^سُورَةُ\s+/, "")}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {indexTab === "juz" && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {JUZ_INDEX.map((entry) => (
              <button
                key={entry.juz}
                type="button"
                onClick={() => onOpenPosition(entry.surah, entry.ayah)}
                className="flex items-center justify-between rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-elevated)] px-4 py-3.5 text-left transition-colors duration-150 hover:border-[var(--accent-primary)] cursor-pointer"
              >
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold text-[var(--text-ink)]">
                    Juz {entry.juz}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    Starts at {entry.surahName} · Ayah {entry.ayah}
                  </p>
                </div>
                <span className="font-mono-tabular text-xs text-[var(--text-muted)]">
                  Page {entry.page}
                </span>
              </button>
            ))}
          </div>
        )}

        {indexTab === "pages" && (
          <div className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-elevated)] p-6 space-y-5 max-w-xl">
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-[var(--text-ink)]">
                Open by Mushaf Page (1 – {TOTAL_QURAN_PAGES})
              </h3>
              <p className="text-sm text-[var(--text-muted)]">
                Enter a standard Madani Mushaf page number to open directly in
                page-by-page book mode.
              </p>
            </div>
            <form onSubmit={handleJumpPage} className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                max={TOTAL_QURAN_PAGES}
                value={pageInput}
                onChange={(e) => setPageInput(e.target.value)}
                aria-label="Mushaf page number"
                className="w-32 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3.5 py-2 font-mono-tabular text-sm text-[var(--text-ink)] focus:border-[var(--accent-primary)] focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-lg bg-[var(--accent-primary)] px-4 py-2 text-sm font-medium text-[var(--accent-primary-fg)] hover:opacity-90 whitespace-nowrap shrink-0 cursor-pointer"
              >
                Open Page
              </button>
            </form>
            <div className="flex flex-wrap gap-2 pt-1 text-xs text-[var(--text-muted)]">
              <span>Quick pages:</span>
              {[1, 2, 50, 293, 440, 582, 604].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    let target = SURAH_META[0];
                    for (const s of SURAH_META) {
                      if (s.startPage <= p) target = s;
                      else break;
                    }
                    onOpenPosition(target.number, 1, {
                      pageMode: true,
                      page: p,
                    });
                  }}
                  className="underline decoration-[var(--border-hairline)] underline-offset-4 hover:text-[var(--text-ink)] cursor-pointer font-mono-tabular"
                >
                  Page {p}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
