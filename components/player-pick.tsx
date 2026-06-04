"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { STAT_KEYS, STAT_LABELS, teamColor, teamName } from "@/lib/constants";
import type { PlayerIndex } from "@/lib/data";
import { playersFor } from "@/lib/data";
import {
  draftedNames,
  matchesGroup,
  openEligiblePositions,
  type PositionGroup,
} from "@/lib/positions";
import { playerGrade, playerRating } from "@/lib/sim";
import type { CourtRoster, Decade, GameMode, Player } from "@/lib/types";
import { cn, formatStat } from "@/lib/utils";
import { Badge } from "./ui";

type SortKey = "ppg" | "rpg" | "apg" | "alphabetical";

interface Props {
  index: PlayerIndex;
  team: string;
  decade: Decade;
  mode: GameMode;
  court: CourtRoster;
  onPick: (p: Player) => void;
}

const GROUPS: PositionGroup[] = ["All", "G", "F", "C"];

export function PlayerPick({ index, team, decade, mode, court, onPick }: Props) {
  const showStats = mode === "classic";
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<PositionGroup>("All");
  const [sort, setSort] = useState<SortKey>(showStats ? "ppg" : "alphabetical");

  const drafted = useMemo(() => draftedNames(court), [court]);

  const players = useMemo(() => {
    const all = playersFor(index, team, decade);
    return all
      .filter((p) => !drafted.has(p.player))
      .filter((p) => p.player.toLowerCase().includes(query.toLowerCase()))
      .filter((p) => matchesGroup(p, group))
      .sort((a, b) => {
        switch (sort) {
          case "ppg":
            return (b.ppg ?? 0) - (a.ppg ?? 0);
          case "rpg":
            return (b.rpg ?? 0) - (a.rpg ?? 0);
          case "apg":
            return (b.apg ?? 0) - (a.apg ?? 0);
          default:
            return a.player.localeCompare(b.player);
        }
      });
  }, [index, team, decade, drafted, query, group, sort]);

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span
            className="inline-block h-3 w-3 rounded-sm"
            style={{ backgroundColor: teamColor(team) }}
          />
          <h3 className="font-semibold">
            {teamName(team)}{" "}
            <span className="font-normal text-[var(--muted-foreground)]">
              · {decade}
            </span>
          </h3>
        </div>
        <span className="text-xs text-[var(--muted-foreground)]">
          {players.length} player{players.length === 1 ? "" : "s"} available
        </span>
      </div>

      {/* search + group filter + sort */}
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[140px]">
          <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--muted-foreground)]" />
          <input
            type="text"
            placeholder="Search…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-8 w-full rounded-md border border-[var(--border)] bg-[var(--background)] pl-7 pr-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          />
        </div>
        <div className="flex overflow-hidden rounded-md border border-[var(--border)]">
          {GROUPS.map((g) => (
            <button
              key={g}
              onClick={() => setGroup(g)}
              className={cn(
                "h-8 px-2.5 text-xs font-medium transition-colors",
                group === g
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                  : "bg-[var(--background)] text-[var(--muted-foreground)] hover:bg-[var(--secondary)]",
              )}
            >
              {g}
            </button>
          ))}
        </div>
        {showStats && (
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="h-8 rounded-md border border-[var(--border)] bg-[var(--background)] px-2 text-xs outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          >
            <option value="ppg">Sort: PTS</option>
            <option value="rpg">Sort: REB</option>
            <option value="apg">Sort: AST</option>
            <option value="alphabetical">Sort: A–Z</option>
          </select>
        )}
      </div>

      <div className="max-h-[42vh] space-y-2 overflow-y-auto thin-scroll pr-1">
        {players.length === 0 && (
          <div className="py-8 text-center text-sm text-[var(--muted-foreground)]">
            No players found{query && ` matching "${query}"`}
          </div>
        )}
        {players.map((p, i) => {
          const rating = playerRating(p, mode === "hoopiq");
          const grade = playerGrade(rating);
          const open = openEligiblePositions(court, p);
          const playable = open.length > 0;
          return (
            <button
              key={`${p.id}-${i}`}
              onClick={() => onPick(p)}
              disabled={!playable}
              title={
                playable
                  ? undefined
                  : "No open court position this player is eligible for"
              }
              className={cn(
                "w-full rounded-lg border border-[var(--border)] bg-[var(--card)] p-3 text-left transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
                playable
                  ? "cursor-pointer hover:border-[var(--primary)] hover:shadow-sm"
                  : "cursor-not-allowed opacity-40",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate font-semibold">{p.player}</div>
                  <div className="text-xs text-[var(--muted-foreground)]">
                    {p.positions.join(" / ")} · {p.era}
                  </div>
                </div>
                {showStats && (
                  <Badge
                    style={{ backgroundColor: grade.color, color: "#fff" }}
                    className="shrink-0"
                  >
                    {grade.grade}
                  </Badge>
                )}
              </div>

              {showStats && (
                <div className="mt-2 grid grid-cols-5 gap-1 text-center">
                  {STAT_KEYS.map((k) => (
                    <div key={k} className="rounded bg-[var(--secondary)] py-1">
                      <div className="text-[10px] text-[var(--muted-foreground)]">
                        {STAT_LABELS[k]}
                      </div>
                      <div className="text-sm font-semibold tabular-nums">
                        {formatStat(p[k])}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
