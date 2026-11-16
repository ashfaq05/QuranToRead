import React, { useEffect, useMemo, useRef, useState } from "react";
import { User } from "firebase/auth";
import {
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  List,
  SlidersHorizontal,
  X,
} from "lucide-react";
import {
  AyahData,
  JUZ_INDEX,
  SURAH_META,
  SurahData,
  TOTAL_QURAN_PAGES,
} from "../data/surahMeta";
import {
  ArabicFontFamily,
  FontSizeScale,
  LineSpacingScale,
  ProgressState,
  ReadingMode,
  ReadingSettings,
  ReadingTheme,
  TranslationFormat,
} from "../utils/quranStore";

interface ReaderViewProps {
  quranMap: Record<number, SurahData>;
  isFullLoaded: boolean;
  activeSurah: number;
  activeAyah: number;
  pageMode: boolean;
  activePage: number;
  settings: ReadingSettings;
  progress: ProgressState;
  user: User | null;
  onSignIn: () => void;
  onUpdateSettings: (patch: Partial<ReadingSettings>) => void;
  onSelectPosition: (
    surah: number,
    ayah: number,
    options?: { pageMode?: boolean; page?: number; mode?: ReadingMode }
  ) => void;
  onConfirmVerse: (info: {
    surah: number;
    surahName: string;
    ayah: number;
    page: number;
    juz: number;
    mode: ReadingMode;
  }) => void;
  onAddBookmark: (info: {
    surah: number;
    surahName: string;
    ayah: number;
    page: number;
    juz: number;
    name: string;
    mode: ReadingMode;
    fromModal?: boolean;
  }) => void;
  onRecordSession: (session: {
    surah: number;
    surahName: string;
    startAyah: number;
    endAyah: number;
    versesCount: number;
    durationSeconds: number;
    mode: ReadingMode;
    startedAt: string;
  }) => void;
}

function toArabicIndicDigits(num: number): string {
  const digits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return String(num)
    .split("")
    .map((d) => digits[Number(d)] ?? d)
    .join("");
}

const ARABIC_SIZE_CLASSES: Record<FontSizeScale, string> = {
  sm: "text-2xl sm:text-[1.75rem]",
  md: "text-3xl sm:text-[2rem]",
  lg: "text-[2rem] sm:text-[2.35rem]",
  xl: "text-[2.35rem] sm:text-[2.85rem]",
};

const TRANSLATION_SIZE_CLASSES: Record<FontSizeScale, string> = {
  sm: "text-sm",
  md: "text-[15px] sm:text-base",
  lg: "text-base sm:text-lg",
  xl: "text-lg sm:text-xl",
};

const LINE_SPACING_CLASSES: Record<LineSpacingScale, string> = {
  compact: "leading-[1.9]",
  normal: "leading-[2.25]",
  relaxed: "leading-[2.6]",
};

const ARABIC_FONT_CLASSES: Record<ArabicFontFamily, string> = {
  amiri: "font-arabic-amiri",
  scheherazade: "font-arabic-scheherazade",
  naskh: "font-arabic-naskh",
};

const FONT_SCALE_ORDER: FontSizeScale[] = ["sm", "md", "lg", "xl"];

export const ReaderView: React.FC<ReaderViewProps> = ({
  quranMap,
  isFullLoaded,
  activeSurah,
  activeAyah,
  pageMode,
  activePage,
  settings,
  progress,
  user,
  onSignIn,
  onUpdateSettings,
  onSelectPosition,
  onConfirmVerse,
  onAddBookmark,
  onRecordSession,
}) => {
  const [showNavDrawer, setShowNavDrawer] = useState(false);
  const [navTab, setNavTab] = useState<"surah" | "juz" | "page">("surah");
  const [navSearch, setNavSearch] = useState("");
  const [showCustomize, setShowCustomize] = useState(false);
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);
  const [bookmarkNameInput, setBookmarkNameInput] = useState("Evening reading");
  const [bookmarkSavedNotice, setBookmarkSavedNotice] = useState(false);

  const verseRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const sessionTrackerRef = useRef<{
    startedAt: string;
    startTs: number;
    startAyah: number;
    endAyah: number;
    surah: number;
    surahName: string;
    versesTouched: Set<string>;
    mode: ReadingMode;
  } | null>(null);

  const currentSurahData = quranMap[activeSurah];
  const currentSurahMeta =
    SURAH_META.find((s) => s.number === activeSurah) ?? SURAH_META[0];

  // Collect verses to render depending on Surah Mode vs Mushaf Page Mode
  const renderedBlocks = useMemo(() => {
    if (pageMode && isFullLoaded) {
      const blocks: Array<{
        surahNumber: number;
        surahName: string;
        arabicName: string;
        revelationType: string;
        ayahs: AyahData[];
      }> = [];

      for (let sNum = 1; sNum <= 114; sNum++) {
        const sData = quranMap[sNum];
        if (!sData) continue;
        const matching = sData.ayahs.filter((a) => a.p === activePage);
        if (matching.length > 0) {
          blocks.push({
            surahNumber: sData.number,
            surahName: sData.englishName,
            arabicName: sData.name,
            revelationType: sData.revelationType,
            ayahs: matching,
          });
        }
      }
      if (blocks.length > 0) return blocks;
    }

    if (!currentSurahData) return [];
    return [
      {
        surahNumber: currentSurahData.number,
        surahName: currentSurahData.englishName,
        arabicName: currentSurahData.name,
        revelationType: currentSurahData.revelationType,
        ayahs: currentSurahData.ayahs,
      },
    ];
  }, [pageMode, isFullLoaded, quranMap, activePage, currentSurahData]);

  const currentVerseObj = useMemo(() => {
    return (
      currentSurahData?.ayahs.find((a) => a.n === activeAyah) ??
      currentSurahData?.ayahs[0] ??
      null
    );
  }, [currentSurahData, activeAyah]);

  const ensureSession = (
    surah: number,
    surahName: string,
    ayah: number,
    mode: ReadingMode
  ) => {
    if (
      !sessionTrackerRef.current ||
      sessionTrackerRef.current.surah !== surah ||
      sessionTrackerRef.current.mode !== mode
    ) {
      if (sessionTrackerRef.current) {
        flushSession();
      }
      sessionTrackerRef.current = {
        startedAt: new Date().toISOString(),
        startTs: Date.now(),
        startAyah: ayah,
        endAyah: ayah,
        surah,
        surahName,
        versesTouched: new Set([`${surah}:${ayah}`]),
        mode,
      };
    } else {
      sessionTrackerRef.current.endAyah = ayah;
      sessionTrackerRef.current.versesTouched.add(`${surah}:${ayah}`);
    }
  };

  const flushSession = () => {
    const sess = sessionTrackerRef.current;
    if (!sess) return;
    const durationSeconds = Math.max(
      1,
      Math.round((Date.now() - sess.startTs) / 1000)
    );
    if (sess.versesTouched.size > 0 && durationSeconds >= 2) {
      onRecordSession({
        surah: sess.surah,
        surahName: sess.surahName,
        startAyah: sess.startAyah,
        endAyah: sess.endAyah,
        versesCount: sess.versesTouched.size,
        durationSeconds,
        mode: sess.mode,
        startedAt: sess.startedAt,
      });
    }
    sessionTrackerRef.current = null;
  };

  useEffect(() => {
    return () => {
      flushSession();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll active verse into view when position changes
  useEffect(() => {
    const key = `${activeSurah}:${activeAyah}`;
    const el = verseRefs.current[key];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [activeSurah, activeAyah]);

  const handleManualLockVerse = (
    surah: number,
    surahName: string,
    ayah: AyahData
  ) => {
    onSelectPosition(surah, ayah.n, { mode: "manual", page: ayah.p });
    onConfirmVerse({
      surah,
      surahName,
      ayah: ayah.n,
      page: ayah.p,
      juz: ayah.j,
      mode: "manual",
    });
    ensureSession(surah, surahName, ayah.n, "manual");
  };

  const handleStepAyah = (delta: -1 | 1) => {
    if (!currentSurahData) return;
    const nextAyahNum = Math.max(
      1,
      Math.min(currentSurahData.ayahs.length, activeAyah + delta)
    );
    const ayahObj = currentSurahData.ayahs.find((a) => a.n === nextAyahNum);
    if (ayahObj) {
      handleManualLockVerse(
        currentSurahData.number,
        currentSurahData.englishName,
        ayahObj
      );
    }
  };

  const handlePrevUnit = () => {
    if (pageMode) {
      if (activePage <= 1) return;
      const targetPage = activePage - 1;
      let targetSurah = SURAH_META[0];
      for (const s of SURAH_META) {
        if (s.startPage <= targetPage) targetSurah = s;
        else break;
      }
      onSelectPosition(targetSurah.number, 1, {
        pageMode: true,
        page: targetPage,
      });
    } else if (activeSurah > 1) {
      onSelectPosition(activeSurah - 1, 1, { pageMode: false });
    }
  };

  const handleNextUnit = () => {
    if (pageMode) {
      if (activePage >= TOTAL_QURAN_PAGES) return;
      const targetPage = activePage + 1;
      let targetSurah = SURAH_META[0];
      for (const s of SURAH_META) {
        if (s.startPage <= targetPage) targetSurah = s;
        else break;
      }
      onSelectPosition(targetSurah.number, 1, {
        pageMode: true,
        page: targetPage,
      });
    } else if (activeSurah < 114) {
      onSelectPosition(activeSurah + 1, 1, { pageMode: false });
    }
  };

  const cycleArabicFontSize = (dir: -1 | 1) => {
    const idx = FONT_SCALE_ORDER.indexOf(settings.arabicFontSize);
    const nextIdx = Math.max(
      0,
      Math.min(FONT_SCALE_ORDER.length - 1, idx + dir)
    );
    onUpdateSettings({ arabicFontSize: FONT_SCALE_ORDER[nextIdx] });
  };

  const isVerseBookmarked = (surah: number, ayah: number) =>
    progress.bookmarks.some((b) => b.surah === surah && b.ayah === ayah);

  const handleSaveCurrentBookmark = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentVerseObj) return;
    onAddBookmark({
      surah: activeSurah,
      surahName: currentSurahMeta.englishName,
      ayah: activeAyah,
      page: currentVerseObj.p,
      juz: currentVerseObj.j,
      name:
        bookmarkNameInput.trim() ||
        `Surah ${currentSurahMeta.englishName} · ${activeAyah}`,
      mode: "manual",
      fromModal: true,
    });
    setShowBookmarkModal(false);
    setBookmarkSavedNotice(true);
    window.setTimeout(() => setBookmarkSavedNotice(false), 2200);
  };

  const filteredNavSurahs = useMemo(() => {
    const q = navSearch.trim().toLowerCase();
    if (!q) return SURAH_META;
    return SURAH_META.filter(
      (s) =>
        String(s.number) === q ||
        s.englishName.toLowerCase().includes(q) ||
        s.englishNameTranslation.toLowerCase().includes(q)
    );
  }, [navSearch]);

  return (
    <div className="pb-32">
      {/* Top Reader Context & Navigation Bar */}
      <div className="border-b border-[var(--border-hairline)] bg-[var(--bg-surface)]/70">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setShowNavDrawer(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-elevated)] px-3 py-1.5 text-xs font-medium text-[var(--text-ink)] hover:border-[var(--accent-primary)] whitespace-nowrap shrink-0 cursor-pointer"
            >
              <List className="h-3.5 w-3.5" />
              <span>
                {activeSurah}. {currentSurahMeta.englishName}
              </span>
            </button>
            <span className="hidden sm:inline text-xs text-[var(--text-muted)] font-mono-tabular truncate">
              Reading · Verse {activeAyah}/
              {currentSurahMeta.numberOfAyahs} · Juz{" "}
              {currentVerseObj?.j ?? currentSurahMeta.startJuz} · Page{" "}
              {pageMode ? activePage : currentVerseObj?.p ?? currentSurahMeta.startPage}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="inline-flex items-center rounded-lg bg-[var(--bg-elevated)] p-0.5 border border-[var(--border-hairline)]">
              <button
                type="button"
                onClick={() =>
                  onSelectPosition(activeSurah, activeAyah, { pageMode: false })
                }
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  !pageMode
                    ? "bg-[var(--accent-primary)] text-[var(--accent-primary-fg)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-ink)]"
                }`}
              >
                Surah
              </button>
              <button
                type="button"
                onClick={() =>
                  onSelectPosition(activeSurah, activeAyah, {
                    pageMode: true,
                    page: currentVerseObj?.p ?? currentSurahMeta.startPage,
                  })
                }
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  pageMode
                    ? "bg-[var(--accent-primary)] text-[var(--accent-primary-fg)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-ink)]"
                }`}
              >
                Page
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevUnit}
                disabled={pageMode ? activePage <= 1 : activeSurah <= 1}
                aria-label={pageMode ? "Previous page" : "Previous Surah"}
                className="rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-elevated)] p-1.5 text-[var(--text-ink)] disabled:opacity-40 hover:border-[var(--accent-primary)] cursor-pointer disabled:cursor-default"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleNextUnit}
                disabled={
                  pageMode ? activePage >= TOTAL_QURAN_PAGES : activeSurah >= 114
                }
                aria-label={pageMode ? "Next page" : "Next Surah"}
                className="rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-elevated)] p-1.5 text-[var(--text-ink)] disabled:opacity-40 hover:border-[var(--accent-primary)] cursor-pointer disabled:cursor-default"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Book Reading Canvas */}
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        {renderedBlocks.length === 0 ? (
          <div className="py-20 text-center space-y-2">
            <p className="font-editorial text-2xl text-[var(--text-ink)]">
              Loading Surah {currentSurahMeta.englishName}...
            </p>
            <p className="text-sm text-[var(--text-muted)]">
              Preparing offline Quran text and Hinglish translation.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {renderedBlocks.map((block) => {
              const startsAtAyahOne = block.ayahs[0]?.n === 1;
              const showBismillah =
                startsAtAyahOne &&
                block.surahNumber !== 1 &&
                block.surahNumber !== 9;

              return (
                <section key={block.surahNumber} className="space-y-8">
                  {/* Surah Header */}
                  {startsAtAyahOne && (
                    <header className="border-b border-[var(--border-hairline)] pb-6 text-center space-y-3">
                      <p
                        dir="rtl"
                        className="font-arabic-amiri text-3xl sm:text-4xl text-[var(--text-ink)]"
                      >
                        {block.arabicName}
                      </p>
                      <h1 className="font-editorial text-3xl sm:text-4xl font-medium text-[var(--text-ink)]">
                        Surah {block.surahName}
                      </h1>
                      <p className="text-xs text-[var(--text-muted)] font-mono-tabular">
                        Surah {block.surahNumber} · {block.revelationType} ·{" "}
                        {SURAH_META[block.surahNumber - 1]?.numberOfAyahs}{" "}
                        Verses · Juz{" "}
                        {SURAH_META[block.surahNumber - 1]?.startJuz}
                      </p>

                      {showBismillah && (
                        <p
                          dir="rtl"
                          className={`${ARABIC_FONT_CLASSES[settings.arabicFont]} pt-4 text-2xl sm:text-3xl text-[var(--text-ink)]`}
                        >
                          بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                        </p>
                      )}
                    </header>
                  )}

                  {/* Verses */}
                  <div className="divide-y divide-[var(--border-hairline)]">
                    {block.ayahs.map((ayah) => {
                      const isCurrent =
                        block.surahNumber === activeSurah &&
                        ayah.n === activeAyah;
                      const bookmarked = isVerseBookmarked(
                        block.surahNumber,
                        ayah.n
                      );
                      const verseKey = `${block.surahNumber}:${ayah.n}`;

                      return (
                        <article
                          key={verseKey}
                          ref={(el) => {
                            verseRefs.current[verseKey] = el as HTMLDivElement | null;
                          }}
                          className={`transition-colors duration-200 rounded-xl px-4 py-7 sm:px-6 sm:py-8 ${
                            isCurrent
                              ? "bg-[var(--bg-highlight)] ring-1 ring-[var(--border-active)]"
                              : "hover:bg-[var(--bg-surface)]/45"
                          }`}
                        >
                          {/* Quiet Coordinate & Actions Row */}
                          <div className="mb-5 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2.5 text-xs">
                              <span className="font-mono-tabular font-medium text-[var(--text-muted)]">
                                {block.surahNumber}:{ayah.n}
                              </span>
                              {isCurrent && (
                                <>
                                  <span
                                    aria-hidden="true"
                                    className="text-[var(--text-muted)]"
                                  >
                                    ·
                                  </span>
                                  <span className="font-medium text-[var(--accent-primary)]">
                                    Currently reading
                                  </span>
                                </>
                              )}
                            </div>

                            <div className="flex items-center gap-3">
                              {!isCurrent && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleManualLockVerse(
                                      block.surahNumber,
                                      block.surahName,
                                      ayah
                                    )
                                  }
                                  className="text-xs text-[var(--text-muted)] hover:text-[var(--text-ink)] underline-offset-4 hover:underline cursor-pointer"
                                >
                                  Read here
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() =>
                                  onAddBookmark({
                                    surah: block.surahNumber,
                                    surahName: block.surahName,
                                    ayah: ayah.n,
                                    page: ayah.p,
                                    juz: ayah.j,
                                    name: `Surah ${block.surahName} · Ayah ${ayah.n}`,
                                    mode: "manual",
                                  })
                                }
                                aria-label={`Bookmark Surah ${block.surahName} Ayah ${ayah.n}`}
                                className={`p-1 transition-colors cursor-pointer ${
                                  bookmarked
                                    ? "text-[var(--accent-primary)]"
                                    : "text-[var(--text-muted)] hover:text-[var(--text-ink)]"
                                }`}
                              >
                                {bookmarked ? (
                                  <BookmarkCheck className="h-4 w-4" />
                                ) : (
                                  <Bookmark className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Uthmani Arabic Line */}
                          <p
                            dir="rtl"
                            lang="ar"
                            className={`${ARABIC_FONT_CLASSES[settings.arabicFont]} ${ARABIC_SIZE_CLASSES[settings.arabicFontSize]} ${LINE_SPACING_CLASSES[settings.lineSpacing]} text-right text-[var(--text-ink)] select-text`}
                          >
                            {ayah.ar}{" "}
                            <span
                              aria-hidden="true"
                              className="inline-block px-1 text-[0.75em] text-[var(--accent-warm)]"
                            >
                              ﴿{toArabicIndicDigits(ayah.n)}﴾
                            </span>
                          </p>

                          {/* Translation directly underneath */}
                          {settings.showTranslation && (
                            <div className="mt-5 space-y-2 max-w-prose">
                              {(settings.translationFormat === "hinglish" ||
                                settings.translationFormat === "both") && (
                                <p
                                  className={`${TRANSLATION_SIZE_CLASSES[settings.translationFontSize]} leading-relaxed text-[var(--text-muted)] ${
                                    isCurrent ? "text-[var(--text-ink)]" : ""
                                  }`}
                                >
                                  {ayah.hg}
                                </p>
                              )}

                              {(settings.translationFormat === "hindi" ||
                                settings.translationFormat === "both") && (
                                <p
                                  lang="hi"
                                  className={`${TRANSLATION_SIZE_CLASSES[settings.translationFontSize]} leading-relaxed text-[var(--text-muted)] ${
                                    isCurrent ? "text-[var(--text-ink)]" : ""
                                  }`}
                                >
                                  {ayah.hi}
                                </p>
                              )}

                              {settings.translationFormat ===
                                "transliteration" && (
                                <p
                                  className={`${TRANSLATION_SIZE_CLASSES[settings.translationFontSize]} italic leading-relaxed text-[var(--text-muted)] ${
                                    isCurrent ? "text-[var(--text-ink)]" : ""
                                  }`}
                                >
                                  {ayah.tr}
                                </p>
                              )}
                            </div>
                          )}
                        </article>
                      );
                    })}
                  </div>
                </section>
              );
            })}

            {/* Bottom Surah / Page Pagination */}
            <div className="flex items-center justify-between border-t border-[var(--border-hairline)] pt-8">
              <button
                type="button"
                onClick={handlePrevUnit}
                disabled={pageMode ? activePage <= 1 : activeSurah <= 1}
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-elevated)] px-4 py-2 text-sm font-medium text-[var(--text-ink)] disabled:opacity-40 hover:border-[var(--accent-primary)] cursor-pointer disabled:cursor-default"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>{pageMode ? "Previous Page" : "Previous Surah"}</span>
              </button>

              <span className="font-mono-tabular text-xs text-[var(--text-muted)]">
                {pageMode
                  ? `Page ${activePage} / ${TOTAL_QURAN_PAGES}`
                  : `Surah ${activeSurah} / 114`}
              </span>

              <button
                type="button"
                onClick={handleNextUnit}
                disabled={
                  pageMode ? activePage >= TOTAL_QURAN_PAGES : activeSurah >= 114
                }
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-elevated)] px-4 py-2 text-sm font-medium text-[var(--text-ink)] disabled:opacity-40 hover:border-[var(--accent-primary)] cursor-pointer disabled:cursor-default"
              >
                <span>{pageMode ? "Next Page" : "Next Surah"}</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Sticky Bottom Reader Control Dock */}
      <div className="fixed bottom-0 inset-x-0 z-30 border-t border-[var(--border-hairline)] bg-[var(--bg-canvas)]/95 backdrop-blur-md">
        <div className="mx-auto max-w-4xl px-4 py-2.5 sm:px-6">
          {/* Primary Reader Controls Row */}
          <div className="flex items-center justify-between gap-3">
            {/* Left: Quick Font Size & Translation Toggle */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => cycleArabicFontSize(-1)}
                disabled={settings.arabicFontSize === "sm"}
                aria-label="Decrease Arabic font size"
                className="rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-elevated)] px-2.5 py-1.5 text-xs font-medium text-[var(--text-ink)] disabled:opacity-40 hover:border-[var(--accent-primary)] cursor-pointer"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => cycleArabicFontSize(1)}
                disabled={settings.arabicFontSize === "xl"}
                aria-label="Increase Arabic font size"
                className="rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-elevated)] px-2.5 py-1.5 text-xs font-medium text-[var(--text-ink)] disabled:opacity-40 hover:border-[var(--accent-primary)] cursor-pointer"
              >
                A+
              </button>
              <button
                type="button"
                onClick={() =>
                  onUpdateSettings({
                    showTranslation: !settings.showTranslation,
                  })
                }
                aria-label={
                  settings.showTranslation
                    ? "Hide translation"
                    : "Show translation"
                }
                className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-elevated)] px-2.5 py-1.5 text-xs font-medium text-[var(--text-ink)] hover:border-[var(--accent-primary)] whitespace-nowrap shrink-0 cursor-pointer"
              >
                {settings.showTranslation ? (
                  <Eye className="h-3.5 w-3.5" />
                ) : (
                  <EyeOff className="h-3.5 w-3.5" />
                )}
                <span className="hidden sm:inline">
                  {settings.showTranslation ? "Translation" : "Arabic only"}
                </span>
              </button>
            </div>

            {/* Center: Verse Step Controls */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => handleStepAyah(-1)}
                disabled={activeAyah <= 1}
                aria-label="Previous verse"
                className="inline-flex items-center gap-1 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-elevated)] px-2.5 py-1.5 text-xs font-medium text-[var(--text-ink)] disabled:opacity-40 hover:border-[var(--accent-primary)] whitespace-nowrap cursor-pointer disabled:cursor-default"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Prev</span>
              </button>
              <span className="font-mono-tabular px-1.5 text-xs text-[var(--text-muted)] whitespace-nowrap">
                {activeAyah}/{currentSurahMeta.numberOfAyahs}
              </span>
              <button
                type="button"
                onClick={() => handleStepAyah(1)}
                disabled={activeAyah >= currentSurahMeta.numberOfAyahs}
                aria-label="Next verse"
                className="inline-flex items-center gap-1 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-elevated)] px-2.5 py-1.5 text-xs font-medium text-[var(--text-ink)] disabled:opacity-40 hover:border-[var(--accent-primary)] whitespace-nowrap cursor-pointer disabled:cursor-default"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Right: Save Bookmark & Customize */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => {
                  setBookmarkNameInput(
                    `Surah ${currentSurahMeta.englishName} · Ayah ${activeAyah}`
                  );
                  setShowBookmarkModal(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-elevated)] px-3 py-1.5 text-xs font-medium text-[var(--text-ink)] hover:border-[var(--accent-primary)] whitespace-nowrap shrink-0 cursor-pointer"
              >
                {bookmarkSavedNotice ? (
                  <BookmarkCheck className="h-3.5 w-3.5 text-[var(--accent-primary)]" />
                ) : (
                  <Bookmark className="h-3.5 w-3.5" />
                )}
                <span className="hidden sm:inline">
                  {bookmarkSavedNotice ? "Saved" : "Save bookmark"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setShowCustomize((v) => !v)}
                aria-expanded={showCustomize}
                aria-label="Reading customization"
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 cursor-pointer ${
                  showCustomize
                    ? "border-[var(--accent-primary)] bg-[var(--bg-highlight)] text-[var(--text-ink)]"
                    : "border-[var(--border-hairline)] bg-[var(--bg-elevated)] text-[var(--text-ink)] hover:border-[var(--accent-primary)]"
                }`}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Customize</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* In-Reader Customization Panel (No Leaving Reader!) */}
      {showCustomize && (
        <div
          role="dialog"
          aria-label="Reading customization"
          className="fixed bottom-16 right-4 z-40 w-[calc(100%-2rem)] max-w-sm rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-elevated)] p-5 shadow-lg space-y-5 max-h-[75vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between border-b border-[var(--border-hairline)] pb-3">
            <h2 className="text-sm font-semibold text-[var(--text-ink)]">
              Reading Preferences
            </h2>
            <button
              type="button"
              onClick={() => setShowCustomize(false)}
              aria-label="Close reading preferences"
              className="p-1 text-[var(--text-muted)] hover:text-[var(--text-ink)] cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Reading Theme */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-[var(--text-muted)]">
              Reading theme
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: "light", label: "Light" },
                  { id: "sepia", label: "Sepia" },
                  { id: "dark", label: "Dark" },
                ] as Array<{ id: ReadingTheme; label: string }>
              ).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onUpdateSettings({ theme: t.id })}
                  className={`rounded-lg border py-2 text-xs font-medium transition-colors cursor-pointer ${
                    settings.theme === t.id
                      ? "border-[var(--accent-primary)] bg-[var(--bg-highlight)] text-[var(--text-ink)]"
                      : "border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-[var(--text-muted)]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Translation Format */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-[var(--text-muted)]">
              Translation format
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { id: "hinglish", label: "Hinglish" },
                  { id: "hindi", label: "हिन्दी (Hindi)" },
                  { id: "both", label: "Both" },
                  { id: "transliteration", label: "Pronunciation" },
                ] as Array<{ id: TranslationFormat; label: string }>
              ).map((fmt) => (
                <button
                  key={fmt.id}
                  type="button"
                  onClick={() => onUpdateSettings({ translationFormat: fmt.id })}
                  className={`rounded-lg border py-1.5 px-2 text-xs font-medium transition-colors cursor-pointer ${
                    settings.translationFormat === fmt.id
                      ? "border-[var(--accent-primary)] bg-[var(--bg-highlight)] text-[var(--text-ink)]"
                      : "border-[var(--border-hairline)] bg-[var(--bg-canvas)] text-[var(--text-muted)]"
                  }`}
                >
                  {fmt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Arabic Font Size */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-[var(--text-muted)]">
              Arabic font size
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {(["sm", "md", "lg", "xl"] as FontSizeScale[]).map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => onUpdateSettings({ arabicFontSize: sz })}
                  className={`rounded-lg border py-1.5 text-xs font-medium uppercase cursor-pointer ${
                    settings.arabicFontSize === sz
                      ? "border-[var(--accent-primary)] bg-[var(--bg-highlight)] text-[var(--text-ink)]"
                      : "border-[var(--border-hairline)] text-[var(--text-muted)]"
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Translation Font Size */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-[var(--text-muted)]">
              Translation font size
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {(["sm", "md", "lg", "xl"] as FontSizeScale[]).map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => onUpdateSettings({ translationFontSize: sz })}
                  className={`rounded-lg border py-1.5 text-xs font-medium uppercase cursor-pointer ${
                    settings.translationFontSize === sz
                      ? "border-[var(--accent-primary)] bg-[var(--bg-highlight)] text-[var(--text-ink)]"
                      : "border-[var(--border-hairline)] text-[var(--text-muted)]"
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Arabic Uthmani Font Family */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-[var(--text-muted)]">
              Quranic Uthmani font
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(
                [
                  { id: "amiri", label: "Amiri" },
                  { id: "scheherazade", label: "Scheherazade" },
                  { id: "naskh", label: "Naskh" },
                ] as Array<{ id: ArabicFontFamily; label: string }>
              ).map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => onUpdateSettings({ arabicFont: f.id })}
                  className={`rounded-lg border py-1.5 px-1 text-xs font-medium truncate cursor-pointer ${
                    settings.arabicFont === f.id
                      ? "border-[var(--accent-primary)] bg-[var(--bg-highlight)] text-[var(--text-ink)]"
                      : "border-[var(--border-hairline)] text-[var(--text-muted)]"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Line Spacing */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-[var(--text-muted)]">
              Line spacing
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(["compact", "normal", "relaxed"] as LineSpacingScale[]).map(
                (sp) => (
                  <button
                    key={sp}
                    type="button"
                    onClick={() => onUpdateSettings({ lineSpacing: sp })}
                    className={`rounded-lg border py-1.5 text-xs font-medium capitalize cursor-pointer ${
                      settings.lineSpacing === sp
                        ? "border-[var(--accent-primary)] bg-[var(--bg-highlight)] text-[var(--text-ink)]"
                        : "border-[var(--border-hairline)] text-[var(--text-muted)]"
                    }`}
                  >
                    {sp}
                  </button>
                )
              )}
            </div>
          </div>

        </div>
      )}

      {/* Save Named Bookmark Modal */}
      {showBookmarkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form
            onSubmit={handleSaveCurrentBookmark}
            className="w-full max-w-sm rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-elevated)] p-6 space-y-4 shadow-xl"
          >
            <div className="space-y-1">
              <h2 className="font-editorial text-2xl font-medium text-[var(--text-ink)]">
                Save Bookmark
              </h2>
              <p className="text-xs text-[var(--text-muted)] font-mono-tabular">
                Surah {currentSurahMeta.englishName} ({activeSurah}:{activeAyah}
                ) · Page {currentVerseObj?.p ?? currentSurahMeta.startPage}
              </p>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="bookmark-name"
                className="text-xs font-medium text-[var(--text-muted)]"
              >
                Bookmark name
              </label>
              <input
                id="bookmark-name"
                type="text"
                value={bookmarkNameInput}
                onChange={(e) => setBookmarkNameInput(e.target.value)}
                placeholder="e.g. Evening reading"
                autoFocus
                className="w-full rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 py-2 text-sm text-[var(--text-ink)] focus:border-[var(--accent-primary)] focus:outline-none"
              />
            </div>

            {!user && (
              <div className="rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-3 py-2.5 text-xs text-[var(--text-muted)] flex items-center justify-between gap-2">
                <span>Sign in with Google to keep bookmarks after refresh.</span>
                <button
                  type="button"
                  onClick={onSignIn}
                  className="font-medium text-[var(--accent-primary)] underline underline-offset-4 shrink-0 cursor-pointer"
                >
                  Sign in
                </button>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowBookmarkModal(false)}
                className="rounded-lg border border-[var(--border-hairline)] px-3.5 py-2 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-ink)] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-[var(--accent-primary)] px-4 py-2 text-xs font-medium text-[var(--accent-primary-fg)] hover:opacity-90 cursor-pointer"
              >
                Save Bookmark
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Surah / Juz / Page Navigator Drawer */}
      {showNavDrawer && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setShowNavDrawer(false)}
          />
          <aside className="relative z-10 flex h-full w-full max-w-sm flex-col border-r border-[var(--border-hairline)] bg-[var(--bg-elevated)]">
            <div className="flex items-center justify-between border-b border-[var(--border-hairline)] px-5 py-4">
              <h2 className="font-editorial text-2xl font-medium text-[var(--text-ink)]">
                Navigate Quran
              </h2>
              <button
                type="button"
                onClick={() => setShowNavDrawer(false)}
                aria-label="Close navigator"
                className="p-1 text-[var(--text-muted)] hover:text-[var(--text-ink)] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex gap-1 border-b border-[var(--border-hairline)] p-2">
              {(["surah", "juz", "page"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setNavTab(t)}
                  className={`flex-1 rounded-md py-1.5 text-xs font-medium capitalize cursor-pointer ${
                    navTab === t
                      ? "bg-[var(--bg-highlight)] text-[var(--text-ink)]"
                      : "text-[var(--text-muted)]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {navTab === "surah" && (
                <>
                  <input
                    type="text"
                    value={navSearch}
                    onChange={(e) => setNavSearch(e.target.value)}
                    placeholder="Filter Surahs..."
                    className="w-full rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-canvas)] px-3 py-2 text-xs text-[var(--text-ink)] focus:border-[var(--accent-primary)] focus:outline-none"
                  />
                  <div className="divide-y divide-[var(--border-hairline)]">
                    {filteredNavSurahs.map((s) => (
                      <button
                        key={s.number}
                        type="button"
                        onClick={() => {
                          onSelectPosition(s.number, 1, { pageMode: false });
                          setShowNavDrawer(false);
                        }}
                        className={`flex w-full items-center justify-between py-2.5 px-2 text-left rounded-md cursor-pointer ${
                          s.number === activeSurah
                            ? "bg-[var(--bg-highlight)]"
                            : "hover:bg-[var(--bg-surface)]"
                        }`}
                      >
                        <div>
                          <p className="text-sm font-medium text-[var(--text-ink)]">
                            {s.number}. {s.englishName}
                          </p>
                          <p className="text-xs text-[var(--text-muted)]">
                            {s.numberOfAyahs} verses · Page {s.startPage}
                          </p>
                        </div>
                        <span
                          dir="rtl"
                          className="font-arabic-amiri text-lg text-[var(--text-ink)]"
                        >
                          {s.name.replace(/^سُورَةُ\s+/, "")}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {navTab === "juz" && (
                <div className="divide-y divide-[var(--border-hairline)]">
                  {JUZ_INDEX.map((j) => (
                    <button
                      key={j.juz}
                      type="button"
                      onClick={() => {
                        onSelectPosition(j.surah, j.ayah, { pageMode: false });
                        setShowNavDrawer(false);
                      }}
                      className="flex w-full items-center justify-between py-2.5 px-2 text-left hover:bg-[var(--bg-surface)] rounded-md cursor-pointer"
                    >
                      <div>
                        <p className="text-sm font-medium text-[var(--text-ink)]">
                          Juz {j.juz}
                        </p>
                        <p className="text-xs text-[var(--text-muted)]">
                          {j.surahName} · Ayah {j.ayah}
                        </p>
                      </div>
                      <span className="font-mono-tabular text-xs text-[var(--text-muted)]">
                        Page {j.page}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {navTab === "page" && (
                <div className="grid grid-cols-5 gap-2">
                  {Array.from({ length: TOTAL_QURAN_PAGES }, (_, idx) => idx + 1).map(
                    (p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => {
                          let target = SURAH_META[0];
                          for (const s of SURAH_META) {
                            if (s.startPage <= p) target = s;
                            else break;
                          }
                          onSelectPosition(target.number, 1, {
                            pageMode: true,
                            page: p,
                          });
                          setShowNavDrawer(false);
                        }}
                        className={`rounded-md border py-2 font-mono-tabular text-xs cursor-pointer ${
                          pageMode && activePage === p
                            ? "border-[var(--accent-primary)] bg-[var(--bg-highlight)] text-[var(--text-ink)] font-semibold"
                            : "border-[var(--border-hairline)] text-[var(--text-muted)] hover:text-[var(--text-ink)]"
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};
