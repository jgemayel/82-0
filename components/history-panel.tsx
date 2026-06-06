"use client";

import { ChevronRight, Trophy } from "lucide-react";
import { MODE_LABELS } from "@/lib/constants";
import { bestRecord } from "@/lib/history";
import type { SavedGame } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Badge, Card } from "./ui";

export function HistoryPanel({
  history,
  onSelect,
}: {
  history: SavedGame[];
  onSelect?: (game: SavedGame) => void;
}) {
  if (history.length === 0) return null;
  const best = bestRecord(history);

  return (
    <Card className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
          Your attempts
        </h3>
        {best && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--primary)]">
            <Trophy className="h-3.5 w-3.5" /> Best {best.wins}-{best.losses}
          </span>
        )}
      </div>
      <div className="max-h-64 space-y-2 overflow-y-auto thin-scroll pr-1">
        {history.map((g, i) => (
          <button
            key={`${g.date}-${i}`}
            onClick={() => onSelect?.(g)}
            disabled={!onSelect}
            title={onSelect ? "Load this lineup" : undefined}
            className={`flex w-full items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-left transition-all ${
              onSelect
                ? "cursor-pointer hover:border-[var(--primary)] hover:bg-[var(--secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                : ""
            }`}
          >
            <div className="flex items-center gap-2">
              <Badge style={{ backgroundColor: g.color, color: "#fff" }}>
                {g.grade}
              </Badge>
              <div>
                <div className="text-sm font-semibold tabular-nums">
                  {g.wins}-{g.losses}
                </div>
                <div className="text-[11px] text-[var(--muted-foreground)]">
                  {MODE_LABELS[g.mode]} · {formatDate(g.date)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs tabular-nums text-[var(--muted-foreground)]">
                {g.teamOvr}
              </span>
              {onSelect && (
                <ChevronRight className="h-4 w-4 text-[var(--muted-foreground)]" />
              )}
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
}
