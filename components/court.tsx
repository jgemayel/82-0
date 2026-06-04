"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { POSITIONS, POSITION_NAMES, teamColor } from "@/lib/constants";
import { canSwapPositions, filledCount } from "@/lib/positions";
import type { CourtRoster, Position } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Half-court spot coordinates (basket at the top). */
const SPOTS: Record<Position, { top: string; left: string }> = {
  C: { top: "16%", left: "50%" },
  PF: { top: "33%", left: "26%" },
  SF: { top: "52%", left: "74%" },
  SG: { top: "70%", left: "24%" },
  PG: { top: "82%", left: "52%" },
};

function initials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Court({
  court,
  onSwap,
  onRemove,
  interactive = true,
}: {
  court: CourtRoster;
  onSwap?: (a: Position, b: Position) => void;
  onRemove?: (pos: Position) => void;
  interactive?: boolean;
}) {
  const [selected, setSelected] = useState<Position | null>(null);

  function handle(pos: Position) {
    if (!interactive || !onSwap) return;
    if (selected === null) {
      if (court[pos]) setSelected(pos);
      return;
    }
    if (selected === pos) {
      setSelected(null);
      return;
    }
    if (canSwapPositions(court, selected, pos)) {
      onSwap(selected, pos);
      setSelected(null);
    } else {
      // re-target selection to a new filled slot, otherwise clear
      setSelected(court[pos] ? pos : null);
    }
  }

  const filled = filledCount(court);

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
          Lineup
        </h3>
        <span className="text-xs text-[var(--muted-foreground)]">
          {filled}/5
        </span>
      </div>

      <div
        className="relative w-full overflow-hidden rounded-xl border border-[var(--border)]"
        style={{
          aspectRatio: "3 / 4",
          background:
            "linear-gradient(160deg, #c2814a 0%, #b06f3a 100%)",
        }}
      >
        {/* court markings */}
        <CourtLines />

        {POSITIONS.map((pos) => {
          const entry = court[pos];
          const isSel = selected === pos;
          const swapTarget =
            selected !== null &&
            selected !== pos &&
            canSwapPositions(court, selected, pos);
          return (
            <button
              key={pos}
              onClick={() => handle(pos)}
              disabled={!interactive}
              aria-label={
                entry
                  ? `${pos}: ${entry.player}${interactive ? ", tap to select for swap" : ""}`
                  : `${pos} empty`
              }
              className={cn(
                "absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-0.5",
                interactive && "cursor-pointer",
              )}
              style={{ top: SPOTS[pos].top, left: SPOTS[pos].left }}
            >
              <span
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-full text-xs font-bold text-white shadow-md transition-all",
                  isSel && "ring-2 ring-white scale-110",
                  swapTarget && "ring-2 ring-white/80 animate-pulse",
                )}
                style={{
                  backgroundColor: entry
                    ? teamColor(entry.team)
                    : "rgba(0,0,0,0.35)",
                  border: entry ? "2px solid rgba(255,255,255,0.8)" : "2px dashed rgba(255,255,255,0.5)",
                }}
              >
                {entry ? initials(entry.player) : pos}
              </span>
              <span className="rounded bg-black/45 px-1.5 py-0.5 text-[10px] font-semibold leading-tight text-white">
                {pos}
              </span>
              {entry && (
                <span className="max-w-[84px] truncate rounded bg-black/45 px-1 text-[9px] leading-tight text-white">
                  {entry.player}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {interactive && filled > 1 && (
        <p className="mt-2 text-center text-[11px] text-[var(--muted-foreground)]">
          Tap a player, then tap another spot to swap.
        </p>
      )}

      {/* compact roster legend */}
      <div className="mt-2 space-y-1">
        {POSITIONS.map((pos) => {
          const entry = court[pos];
          return (
            <div
              key={pos}
              className="flex items-center justify-between rounded-md border border-[var(--border)] bg-[var(--card)] px-2 py-1 text-xs"
            >
              <span className="w-7 font-bold text-[var(--muted-foreground)]">
                {pos}
              </span>
              {entry ? (
                <span className="flex-1 truncate text-right">
                  {entry.player}{" "}
                  <span className="text-[var(--muted-foreground)]">
                    ({entry.team} {entry.era})
                  </span>
                </span>
              ) : (
                <span className="flex-1 text-right text-[var(--muted-foreground)]">
                  {POSITION_NAMES[pos]}
                </span>
              )}
              {interactive && onRemove && entry && (
                <button
                  onClick={() => onRemove(pos)}
                  aria-label={`Remove ${entry.player}`}
                  className="ml-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded text-[var(--muted-foreground)] transition-colors hover:bg-[var(--secondary)] hover:text-[var(--destructive)]"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CourtLines() {
  return (
    <svg
      viewBox="0 0 300 400"
      preserveAspectRatio="none"
      className="absolute inset-0 h-full w-full"
      aria-hidden
    >
      <g
        fill="none"
        stroke="rgba(255,255,255,0.45)"
        strokeWidth="2"
      >
        {/* baseline + hoop at top */}
        <line x1="0" y1="6" x2="300" y2="6" />
        <rect x="110" y="6" width="80" height="60" />
        <circle cx="150" cy="66" r="34" />
        <circle cx="150" cy="20" r="6" fill="rgba(255,140,0,0.9)" stroke="none" />
        {/* three-point arc */}
        <path d="M30 6 L30 120 A 130 130 0 0 0 270 120 L270 6" />
        {/* half-court hint */}
        <line x1="0" y1="394" x2="300" y2="394" />
      </g>
    </svg>
  );
}
