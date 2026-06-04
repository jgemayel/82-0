"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import {
  DECADES,
  POSITIONS,
  STAT_KEYS,
  STAT_LABELS,
  TEAM_NAMES,
  teamColor,
} from "@/lib/constants";
import type { PlayerIndex } from "@/lib/data";
import { draftedNames, openEligiblePositions } from "@/lib/positions";
import { playerGrade, playerRating } from "@/lib/sim";
import type { CourtRoster, Player, Position, StatKey } from "@/lib/types";
import { cn, formatStat } from "@/lib/utils";
import { Badge } from "./ui";

type SortKey = StatKey | "name";

interface Props {
  index: PlayerIndex;
  court: CourtRoster;
  onPick: (p: Player) => void;
}

const RENDER_CAP = 200;
const TEAM_ABBRS = Object.keys(TEAM_NAMES).sort();

export function FreeDraft({ index, court, onPick }: Props) {
  const [query, setQuery] = useState("");
  const [pos, setPos] = useState<"All" | Position>("All");
  const [era, setEra] = useState<"All" | string>("All");
  const [team, setTeam] = useState<"All" | string>("All");
  const [sort, setSort] = useState<SortKey>("ppg");

  const drafted = useMemo(() => draftedNames(court), [court]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return index.allPlayers
      .filter((p) => !drafted.has(p.player))
      .filter((p) => (pos === "All" ? true : p.positions.includes(pos)))
      .filter((p) => (era === "All" ? true : p.era === era))
      .filter((p) => (team === "All" ? true : p.team === team))
      .filter((p) => (q ? p.player.toLowerCase().includes(q) : true))
      .sort((a, b) => {
        if (sort === "name") return a.player.localeCompare(b.player);
        return (b[sort] ?? 0) - (a[sort] ?? 0);
      });
  }, [index, drafted, query, pos, era, team, sort]);

  const shown = filtered.slice(0, RENDER_CAP);

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between px-1">
        <h3 className="font-semibold">All players</h3>
        <span className="text-xs text-[var(--muted-foreground)]">
          {filtered.length.toLocaleString()} match
          {filtered.length === 1 ? "" : "es"}
        </span>
      </div>

      {/* filters */}
      <div className="mb-2 space-y-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--muted-foreground)]" />
          <input
            type="text"
            placeholder="Search any player…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-8 w-full rounded-md border border-[var(--border)] bg-[var(--background)] pl-7 pr-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Select label="Position" value={pos} onChange={(v) => setPos(v as never)}>
            <option value="All">Any position</option>
            {POSITIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Select>
          <Select label="Era" value={era} onChange={setEra}>
            <option value="All">Any era</option>
            {DECADES.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </Select>
          <Select label="Team" value={team} onChange={setTeam}>
            <option value="All">Any team</option>
            {TEAM_ABBRS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
          <Select label="Sort" value={sort} onChange={(v) => setSort(v as SortKey)}>
            {STAT_KEYS.map((k) => (
              <option key={k} value={k}>
                {STAT_LABELS[k]}
              </option>
            ))}
            <option value="name">A–Z</option>
          </Select>
        </div>
      </div>

      <div className="max-h-[44vh] space-y-2 overflow-y-auto thin-scroll pr-1">
        {shown.length === 0 && (
          <div className="py-8 text-center text-sm text-[var(--muted-foreground)]">
            No players match these filters.
          </div>
        )}
        {shown.map((p, i) => {
          const rating = playerRating(p, false);
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
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className="inline-block h-3 w-3 shrink-0 rounded-sm"
                    style={{ backgroundColor: teamColor(p.team) }}
                  />
                  <div className="min-w-0">
                    <div className="truncate font-semibold">{p.player}</div>
                    <div className="text-xs text-[var(--muted-foreground)]">
                      {p.team} · {p.era} · {p.positions.join("/")}
                    </div>
                  </div>
                </div>
                <Badge
                  style={{ backgroundColor: grade.color, color: "#fff" }}
                  className="shrink-0"
                >
                  {grade.grade}
                </Badge>
              </div>
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
            </button>
          );
        })}
        {filtered.length > RENDER_CAP && (
          <p className="py-2 text-center text-xs text-[var(--muted-foreground)]">
            Showing top {RENDER_CAP} of {filtered.length.toLocaleString()} —
            refine your filters to see more.
          </p>
        )}
      </div>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-0.5">
      <span className="px-0.5 text-[10px] uppercase tracking-wide text-[var(--muted-foreground)]">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 rounded-md border border-[var(--border)] bg-[var(--background)] px-2 text-xs outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
      >
        {children}
      </select>
    </label>
  );
}
