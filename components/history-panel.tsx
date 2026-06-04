"use client";

import { Trophy } from "lucide-react";
import { bestRecord } from "@/lib/history";
import type { SavedGame } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Badge, Card } from "./ui";

export function HistoryPanel({ history }: { history: SavedGame[] }) {
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
          <div
            key={`${g.date}-${i}`}
            className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2"
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
                  {g.mode === "hoopiq"
                    ? "HoopIQ"
                    : g.mode === "free"
                      ? "Free Draft"
                      : "Classic"}{" "}
                  · {formatDate(g.date)}
                </div>
              </div>
            </div>
            <div className="text-xs text-[var(--muted-foreground)] tabular-nums">
              {g.teamOvr}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
