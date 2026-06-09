"use client";

import { RotateCcw } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function Header() {
  const reset = () => {
    (window as unknown as { __resetGame?: () => void }).__resetGame?.();
  };
  return (
    <header className="w-full bg-transparent flex flex-col items-center py-6">
      <div className="w-full max-w-2xl px-4 mx-auto relative">
        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={reset}
            className="cursor-pointer transition-opacity hover:opacity-80"
            aria-label="Restart game"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${BASE_PATH}/logo.png`}
              alt="82-0 Logo"
              width={256}
              height={256}
              className="h-28 w-28 rounded-[22%] shadow-lg sm:h-32 sm:w-32"
            />
          </button>
          <h1 className="text-3xl font-bold text-center">Can you go 82-0?</h1>
        </div>
        <div className="absolute top-2 right-0 flex items-center gap-1">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[var(--border)] px-2.5 text-sm font-medium text-[var(--muted-foreground)] transition-colors hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"
            aria-label="Restart game"
          >
            <RotateCcw className="h-4 w-4" />
            <span className="hidden sm:inline">Restart</span>
          </button>
          <Link
            href="/how-to-play"
            className="hidden sm:inline-flex h-8 items-center rounded-md border border-[var(--border)] px-3 text-sm text-[var(--muted-foreground)] transition-colors hover:bg-[var(--secondary)]"
          >
            How to Play
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
