import React, { useRef, useState } from "react";
import { User } from "firebase/auth";
import {
  Bookmark,
  BookOpen,
  Download,
  LogIn,
  Pencil,
  Trash2,
  Upload,
  Check,
  X,
} from "lucide-react";
import { BookmarkItem, ProgressState } from "../utils/quranStore";

interface BookmarksViewProps {
  progress: ProgressState;
  user: User | null;
  onSignIn: () => void;
  onOpenBookmark: (surah: number, ayah: number) => void;
  onRenameBookmark: (id: string, newName: string) => void;
  onDeleteBookmark: (id: string) => void;
  onImportProgress: (imported: ProgressState) => void;
}

function formatReadableDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
    });
  } catch {
    return iso;
  }
}

export const BookmarksView: React.FC<BookmarksViewProps> = ({
  progress,
  user,
  onSignIn,
  onOpenBookmark,
  onRenameBookmark,
  onDeleteBookmark,
  onImportProgress,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
  const [importNotice, setImportNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const startEdit = (bm: BookmarkItem) => {
    setEditingId(bm.id);
    setDraftName(bm.name);
  };

  const commitEdit = (id: string) => {
    const clean = draftName.trim();
    if (clean) {
      onRenameBookmark(id, clean);
    }
    setEditingId(null);
  };

  const handleExport = () => {
    const payload = JSON.stringify(progress, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `al-kitab-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as ProgressState;
      if (!parsed || !parsed.lastPosition || !parsed.completedVerses) {
        setImportNotice("The selected file does not match Al-Kitab backup format.");
        return;
      }
      onImportProgress(parsed);
      setImportNotice("Bookmarks and reading progress restored.");
    } catch {
      setImportNotice("Could not read backup file.");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-[var(--border-hairline)] pb-6">
        <div className="space-y-1.5">
          <h1 className="font-editorial text-3xl sm:text-4xl font-medium text-[var(--text-ink)]">
            Bookmarks &amp; Saved Positions
          </h1>
          <p className="text-sm text-[var(--text-muted)]">
            {user
              ? `Synced to ${user.email}. Your bookmarks persist across refreshes and devices.`
              : "Sign in with Google to save bookmarks to your account across refreshes and devices."}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!user && (
            <button
              type="button"
              onClick={onSignIn}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent-primary)] px-3.5 py-2 text-xs font-medium text-[var(--accent-primary-fg)] hover:opacity-90 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Sign in with Google</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-elevated)] px-3 py-2 text-xs font-medium text-[var(--text-ink)] hover:border-[var(--accent-primary)] whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export</span>
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-elevated)] px-3 py-2 text-xs font-medium text-[var(--text-ink)] hover:border-[var(--accent-primary)] whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Restore</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            onChange={handleImport}
            className="hidden"
          />
        </div>
      </div>

      {importNotice && (
        <div className="rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-4 py-3 text-sm text-[var(--text-ink)] flex items-center justify-between">
          <span>{importNotice}</span>
          <button
            type="button"
            onClick={() => setImportNotice(null)}
            className="text-xs text-[var(--text-muted)] hover:text-[var(--text-ink)] cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Automatic Last Position */}
      <section className="space-y-3">
        <h2 className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
          Automatic Resume Position
        </h2>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-elevated)] p-5">
          <div className="space-y-1">
            <p className="font-editorial text-2xl font-medium text-[var(--text-ink)]">
              {progress.lastPosition.surahName} — Ayah{" "}
              <span className="font-mono-tabular">
                {progress.lastPosition.ayah}
              </span>
            </p>
            <p className="text-xs text-[var(--text-muted)] font-mono-tabular">
              Surah {progress.lastPosition.surah}, Ayah{" "}
              {progress.lastPosition.ayah} · Page {progress.lastPosition.page} ·{" "}
              {formatReadableDate(progress.lastPosition.updatedAt)} · Mode:{" "}
              {progress.lastPosition.mode === "voice" ? "Voice" : "Manual"}
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              onOpenBookmark(
                progress.lastPosition.surah,
                progress.lastPosition.ayah
              )
            }
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent-primary)] px-4 py-2 text-xs font-medium text-[var(--accent-primary-fg)] hover:opacity-90 whitespace-nowrap shrink-0 cursor-pointer self-start sm:self-auto"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Resume Reading</span>
          </button>
        </div>
      </section>

      {/* Saved Bookmarks */}
      <section className="space-y-4">
        <h2 className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
          Saved Bookmarks ({progress.bookmarks.length})
        </h2>

        {progress.bookmarks.length === 0 ? (
          <div className="rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-6 py-12 text-center space-y-2">
            <Bookmark className="mx-auto h-6 w-6 text-[var(--text-muted)]" />
            <p className="text-sm font-medium text-[var(--text-ink)]">
              No manual bookmarks yet
            </p>
            <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto">
              While reading any Surah, tap the bookmark icon on a verse or use
              Save Bookmark in the reader controls to keep multiple positions.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border-hairline)] rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-elevated)]">
            {progress.bookmarks.map((bm) => (
              <div
                key={bm.id}
                className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1 min-w-0">
                  {editingId === bm.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={draftName}
                        onChange={(e) => setDraftName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") commitEdit(bm.id);
                          if (e.key === "Escape") setEditingId(null);
                        }}
                        autoFocus
                        className="rounded-md border border-[var(--accent-primary)] bg-[var(--bg-canvas)] px-2.5 py-1 text-sm text-[var(--text-ink)] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => commitEdit(bm.id)}
                        aria-label="Save bookmark name"
                        className="p-1.5 text-[var(--accent-primary)] cursor-pointer"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        aria-label="Cancel rename"
                        className="p-1.5 text-[var(--text-muted)] cursor-pointer"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-[var(--text-ink)] truncate">
                        {bm.name}
                      </h3>
                      <button
                        type="button"
                        onClick={() => startEdit(bm)}
                        aria-label="Rename bookmark"
                        className="p-1 text-[var(--text-muted)] hover:text-[var(--text-ink)] cursor-pointer"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--text-muted)] font-mono-tabular">
                    <span>
                      Surah {bm.surahName} ({bm.surah}:{bm.ayah})
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>Page {bm.page}</span>
                    <span aria-hidden="true">·</span>
                    <span>Saved {formatReadableDate(bm.createdAt)}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-sans">
                      {bm.mode === "voice" ? "Voice" : "Manual"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onOpenBookmark(bm.surah, bm.ayah)}
                    className="rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-3.5 py-2 text-xs font-medium text-[var(--text-ink)] hover:border-[var(--accent-primary)] whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Open Verse
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteBookmark(bm.id)}
                    aria-label={`Delete bookmark ${bm.name}`}
                    className="rounded-lg p-2 text-[var(--text-muted)] hover:text-red-600 dark:hover:text-red-400 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
