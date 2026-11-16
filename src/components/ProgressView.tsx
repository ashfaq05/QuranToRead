import React, { useMemo } from "react";
import { TOTAL_QURAN_VERSES } from "../data/surahMeta";
import {
  ProgressState,
  calculateOverallPercent,
  calculateStreak,
  getTodayDateKey,
} from "../utils/quranStore";

interface ProgressViewProps {
  progress: ProgressState;
  onOpenLastPosition: () => void;
}

function formatDuration(totalSeconds: number): string {
  if (totalSeconds < 60) return `${totalSeconds} sec`;
  const mins = Math.round(totalSeconds / 60);
  if (mins < 60) return `${mins} min`;
  const hrs = Math.floor(mins / 60);
  const rem = mins % 60;
  return `${hrs}h ${rem}m`;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  progress,
  onOpenLastPosition,
}) => {
  const todayKey = getTodayDateKey();
  const todayRec = progress.dailyActivity[todayKey];

  const totalUniqueCompleted = Object.keys(progress.completedVerses).length;
  const overallPercent = calculateOverallPercent(progress.completedVerses);
  const versesToday = todayRec?.uniqueVerses.length ?? 0;
  const practiceRepeatsToday = todayRec?.practiceRepeats ?? 0;
  const readingTimeTodaySec = todayRec?.readingSeconds ?? 0;
  const streakDays = calculateStreak(progress.dailyActivity);

  const totalReadingDays = useMemo(() => {
    return Object.values(progress.dailyActivity).filter(
      (d) => d.uniqueVerses.length > 0 || d.readingSeconds >= 10
    ).length;
  }, [progress.dailyActivity]);

  // Build Mon-Sun current week activity array
  const weeklyBars = useMemo(() => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0=Sun..6=Sat
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(now);
    monday.setDate(now.getDate() + mondayOffset);

    const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const days = labels.map((label, idx) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + idx);
      const key = getTodayDateKey(d);
      const rec = progress.dailyActivity[key];
      return {
        label,
        dateKey: key,
        isToday: key === todayKey,
        uniqueCount: rec?.uniqueVerses.length ?? 0,
        minutes: Math.round((rec?.readingSeconds ?? 0) / 60),
      };
    });

    const maxCount = Math.max(10, ...days.map((d) => d.uniqueCount));
    return { days, maxCount };
  }, [progress.dailyActivity, todayKey]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 space-y-10">
      <div className="border-b border-[var(--border-hairline)] pb-6 space-y-1.5">
        <h1 className="font-editorial text-3xl sm:text-4xl font-medium text-[var(--text-ink)]">
          Your Quran Journey
        </h1>
        <p className="text-sm text-[var(--text-muted)]">
          Unique verses are counted once toward overall completion. Repeating a
          verse counts as practice without inflating progress.
        </p>
      </div>

      {/* 4 Headline Metrics */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-elevated)] p-5 space-y-1">
          <p className="text-xs text-[var(--text-muted)]">Quran completed</p>
          <p className="font-mono-tabular text-3xl font-semibold text-[var(--text-ink)]">
            {overallPercent}%
          </p>
          <p className="font-mono-tabular text-xs text-[var(--text-muted)]">
            {totalUniqueCompleted} / {TOTAL_QURAN_VERSES} verses
          </p>
        </div>

        <div className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-elevated)] p-5 space-y-1">
          <p className="text-xs text-[var(--text-muted)]">Verses read today</p>
          <p className="font-mono-tabular text-3xl font-semibold text-[var(--text-ink)]">
            {versesToday}
          </p>
          <p className="font-mono-tabular text-xs text-[var(--text-muted)]">
            {practiceRepeatsToday} practice repeats
          </p>
        </div>

        <div className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-elevated)] p-5 space-y-1">
          <p className="text-xs text-[var(--text-muted)]">Total reading days</p>
          <p className="font-mono-tabular text-3xl font-semibold text-[var(--text-ink)]">
            {totalReadingDays}
          </p>
          <p className="font-mono-tabular text-xs text-[var(--text-muted)]">
            {streakDays} day current streak
          </p>
        </div>

        <div className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-elevated)] p-5 space-y-1">
          <p className="text-xs text-[var(--text-muted)]">Reading time today</p>
          <p className="font-mono-tabular text-3xl font-semibold text-[var(--text-ink)]">
            {formatDuration(readingTimeTodaySec)}
          </p>
          <p className="text-xs text-[var(--text-muted)]">Active study time</p>
        </div>
      </section>

      {/* Overall Completion Bar + Last Position */}
      <section className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-elevated)] p-6 space-y-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-[var(--text-ink)]">
              Overall Quran Progress
            </h2>
            <p className="text-xs text-[var(--text-muted)] font-mono-tabular">
              {totalUniqueCompleted} unique verses completed out of{" "}
              {TOTAL_QURAN_VERSES}
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenLastPosition}
            className="text-xs font-medium text-[var(--accent-primary)] underline underline-offset-4 hover:opacity-80 self-start sm:self-auto cursor-pointer"
          >
            Last reading: {progress.lastPosition.surahName} — Ayah{" "}
            {progress.lastPosition.ayah}
          </button>
        </div>

        <div
          role="progressbar"
          aria-valuenow={overallPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          className="h-2.5 w-full overflow-hidden rounded-full bg-[var(--bg-surface)]"
        >
          <div
            className="h-full rounded-full bg-[var(--accent-primary)] transition-all duration-300"
            style={{
              width: `${Math.max(
                totalUniqueCompleted > 0 ? 1.5 : 0,
                overallPercent
              )}%`,
            }}
          />
        </div>
      </section>

      {/* Weekly Activity + Recent Sessions */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-elevated)] p-6 space-y-6">
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-[var(--text-ink)]">
              Daily Reading Activity
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              Unique verses read each day (Mon–Sun)
            </p>
          </div>

          <div className="flex items-end justify-between gap-3 h-44 pt-4">
            {weeklyBars.days.map((d) => {
              const heightPct =
                d.uniqueCount === 0
                  ? 4
                  : Math.max(12, Math.round((d.uniqueCount / weeklyBars.maxCount) * 100));
              return (
                <div
                  key={d.dateKey}
                  className="flex flex-1 flex-col items-center gap-2 h-full justify-end"
                  title={`${d.label}: ${d.uniqueCount} verses, ${d.minutes} min`}
                >
                  <span className="font-mono-tabular text-[11px] text-[var(--text-muted)]">
                    {d.uniqueCount > 0 ? d.uniqueCount : ""}
                  </span>
                  <div className="w-full flex items-end justify-center h-28">
                    <div
                      className={`w-full max-w-[32px] rounded-t-md transition-all duration-200 ${
                        d.uniqueCount > 0
                          ? "bg-[var(--accent-primary)]"
                          : "bg-[var(--bg-surface)]"
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span
                    className={`text-xs ${
                      d.isToday
                        ? "font-semibold text-[var(--text-ink)]"
                        : "text-[var(--text-muted)]"
                    }`}
                  >
                    {d.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-elevated)] p-6 space-y-5">
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-[var(--text-ink)]">
              Recent Reading Sessions
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              Confirmed voice and manual reading sessions
            </p>
          </div>

          {progress.sessions.length === 0 ? (
            <p className="py-10 text-sm text-[var(--text-muted)]">
              Your reading sessions will appear here once you read or recite in
              the Quran Reader.
            </p>
          ) : (
            <div className="divide-y divide-[var(--border-hairline)]">
              {progress.sessions.slice(0, 6).map((sess) => (
                <div
                  key={sess.id}
                  className="flex items-center justify-between gap-4 py-3 text-sm"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-[var(--text-ink)] truncate">
                      {sess.surahName} · Ayah {sess.startAyah}–{sess.endAyah}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] font-mono-tabular">
                      {new Date(sess.endedAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      })}{" "}
                      · {sess.mode === "voice" ? "Voice" : "Manual"}
                    </p>
                  </div>
                  <div className="text-right shrink-0 font-mono-tabular">
                    <p className="text-xs font-medium text-[var(--text-ink)]">
                      {sess.versesCount} verses
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {formatDuration(sess.durationSeconds)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
