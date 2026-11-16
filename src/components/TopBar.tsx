import React, { useState } from "react";
import { User } from "firebase/auth";
import { LogOut, ChevronDown } from "lucide-react";

export type AppView = "home" | "reader" | "bookmarks" | "progress";

interface TopBarProps {
  activeView: AppView;
  onNavigate: (view: AppView) => void;
  user: User | null;
  authReady: boolean;
  signingIn: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
  onContinueReading: () => void;
}

export const GoogleGIcon: React.FC<{ className?: string }> = ({
  className = "h-3.5 w-3.5",
}) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
    fill="none"
  >
    <path
      d="M21.805 10.023H12.2v3.955h5.52c-.238 1.28-.96 2.364-2.044 3.09v2.57h3.307c1.935-1.781 3.052-4.405 3.052-7.523 0-.707-.064-1.39-.23-2.092Z"
      fill="#4285F4"
    />
    <path
      d="M12.2 22c2.76 0 5.075-.915 6.767-2.478l-3.307-2.57c-.916.614-2.088.977-3.46.977-2.662 0-4.916-1.798-5.721-4.215H3.063v2.65C4.745 19.706 8.204 22 12.2 22Z"
      fill="#34A853"
    />
    <path
      d="M6.479 13.714A5.995 5.995 0 0 1 6.165 11.8c0-.664.114-1.31.314-1.914v-2.65H3.063A9.988 9.988 0 0 0 2 11.8c0 1.611.386 3.136 1.063 4.564l3.416-2.65Z"
      fill="#FBBC05"
    />
    <path
      d="M12.2 5.671c1.501 0 2.849.516 3.91 1.53l2.932-2.932C17.27 2.618 14.955 1.6 12.2 1.6c-3.996 0-7.455 2.294-9.137 5.636l3.416 2.65C7.284 7.469 9.538 5.671 12.2 5.671Z"
      fill="#EA4335"
    />
  </svg>
);

export const TopBar: React.FC<TopBarProps> = ({
  activeView,
  onNavigate,
  user,
  authReady,
  signingIn,
  onSignIn,
  onSignOut,
  onContinueReading,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems: Array<{ id: AppView; label: string }> = [
    { id: "home", label: "Home" },
    { id: "reader", label: "Reader" },
    { id: "bookmarks", label: "Bookmarks" },
    { id: "progress", label: "Progress" },
  ];

  const firstName = user?.displayName?.split(" ")[0] || "Account";

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border-hairline)] bg-[var(--bg-canvas)]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 sm:gap-8 px-4 py-3.5 sm:px-6">
        <button
          type="button"
          onClick={() => onNavigate("home")}
          className="font-editorial text-xl font-semibold tracking-tight text-[var(--text-ink)] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-primary)]"
        >
          Al-Kitab
        </button>

        <nav
          aria-label="Primary navigation"
          className="flex items-center gap-4 sm:gap-7 overflow-x-auto"
        >
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`text-sm font-medium whitespace-nowrap shrink-0 py-1 border-b transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-primary)] ${
                  isActive
                    ? "border-[var(--accent-primary)] text-[var(--text-ink)]"
                    : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-ink)]"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="relative flex items-center shrink-0">
          {user ? (
            <>
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                aria-expanded={menuOpen}
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-elevated)] px-3 py-1.5 text-xs font-medium text-[var(--text-ink)] hover:border-[var(--accent-primary)] whitespace-nowrap shrink-0 cursor-pointer"
              >
                {user.photoURL && (
                  <img
                    src={user.photoURL}
                    alt={user.displayName ?? "Google account"}
                    referrerPolicy="no-referrer"
                    className="h-4 w-4 rounded-full object-cover"
                  />
                )}
                <span className="max-w-[96px] truncate">{firstName}</span>
                <ChevronDown className="h-3.5 w-3.5 text-[var(--text-muted)]" />
              </button>

              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 z-50 w-56 rounded-xl border border-[var(--border-hairline)] bg-[var(--bg-elevated)] p-2 shadow-lg space-y-1">
                    <div className="px-3 py-2 border-b border-[var(--border-hairline)]">
                      <p className="text-xs font-semibold text-[var(--text-ink)] truncate">
                        {user.displayName || "Signed in"}
                      </p>
                      <p className="text-[11px] text-[var(--text-muted)] truncate">
                        {user.email}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onContinueReading();
                      }}
                      className="w-full rounded-lg px-3 py-2 text-left text-xs font-medium text-[var(--text-ink)] hover:bg-[var(--bg-surface)] cursor-pointer"
                    >
                      Continue Reading
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onSignOut();
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-[var(--text-muted)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-ink)] cursor-pointer"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </>
              )}
            </>
          ) : (
            <button
              type="button"
              disabled={signingIn}
              onClick={onSignIn}
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-hairline)] bg-[var(--bg-elevated)] px-3.5 py-2 text-xs font-medium text-[var(--text-ink)] transition-colors duration-150 hover:border-[var(--accent-primary)] disabled:opacity-60 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-primary)]"
            >
              <GoogleGIcon className="h-3.5 w-3.5" />
              <span>{signingIn ? "Signing in..." : "Sign in with Google"}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
