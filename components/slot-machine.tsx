"use client";

import { useEffect, useState } from "react";
import { DECADES, teamColor, teamName } from "@/lib/constants";
import type { PlayerIndex } from "@/lib/data";
import { teamsFor } from "@/lib/data";
import type { Decade } from "@/lib/types";
import { cn, pickRandom } from "@/lib/utils";
import { Button } from "./ui";

export type SpinKind = "full" | "team" | "decade";

interface SpinTarget {
  team: string;
  decade: Decade;
  spinTeam: boolean;
  spinDecade: boolean;
  kind: SpinKind;
  id: number;
}

interface Props {
  index: PlayerIndex;
  status: "idle" | "spinning" | "locked";
  target: SpinTarget | null;
  onSpin: () => void;
  onComplete: () => void;
}

const TICK_MS = 70;
const SPIN_MS = 1100;

export function SlotMachine({ index, status, target, onSpin, onComplete }: Props) {
  const [displayTeam, setDisplayTeam] = useState<string>(target?.team ?? "LAL");
  const [displayDecade, setDisplayDecade] = useState<Decade>(
    target?.decade ?? "1990s",
  );
  const [teamSpinning, setTeamSpinning] = useState(false);
  const [decadeSpinning, setDecadeSpinning] = useState(false);

  useEffect(() => {
    if (!target || status !== "spinning") return;

    const allTeams = Array.from(
      new Set(DECADES.flatMap((d) => teamsFor(index, d))),
    );
    let teamInterval: ReturnType<typeof setInterval> | undefined;
    let decadeInterval: ReturnType<typeof setInterval> | undefined;

    if (target.spinTeam) {
      setTeamSpinning(true);
      teamInterval = setInterval(
        () => setDisplayTeam(pickRandom(allTeams)),
        TICK_MS,
      );
    } else {
      setDisplayTeam(target.team);
    }
    if (target.spinDecade) {
      setDecadeSpinning(true);
      decadeInterval = setInterval(
        () => setDisplayDecade(pickRandom(DECADES)),
        TICK_MS,
      );
    } else {
      setDisplayDecade(target.decade);
    }

    const decadeStop = setTimeout(() => {
      if (decadeInterval) clearInterval(decadeInterval);
      setDisplayDecade(target.decade);
      setDecadeSpinning(false);
    }, SPIN_MS - 250);

    const teamStop = setTimeout(() => {
      if (teamInterval) clearInterval(teamInterval);
      setDisplayTeam(target.team);
      setTeamSpinning(false);
    }, SPIN_MS);

    const done = setTimeout(() => onComplete(), SPIN_MS + 120);

    return () => {
      if (teamInterval) clearInterval(teamInterval);
      if (decadeInterval) clearInterval(decadeInterval);
      clearTimeout(decadeStop);
      clearTimeout(teamStop);
      clearTimeout(done);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target?.id, status]);

  const spinning = status === "spinning";
  const locked = status === "locked";
  const accent = teamColor(displayTeam);

  const spinningText =
    target?.kind === "decade"
      ? "RESPINNING DECADE…"
      : target?.kind === "team"
        ? "RESPINNING TEAM…"
        : "SPINNING…";

  return (
    <div className="w-full">
      <div className="rounded-xl border-2 border-[var(--primary)]/40 bg-[var(--card)] p-4 sm:p-6 shadow-lg">
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <Reel
            label={locked ? "LOCKED" : "ERA"}
            locked={locked}
            spinning={decadeSpinning}
          >
            <span className="text-2xl sm:text-3xl font-extrabold tabular-nums">
              {displayDecade}
            </span>
          </Reel>

          <Reel
            label={locked ? "LOCKED" : "FRANCHISE"}
            locked={locked}
            spinning={teamSpinning}
            accent={accent}
          >
            <span className="text-2xl sm:text-3xl font-extrabold">
              {displayTeam}
            </span>
            <span className="mt-0.5 block text-[10px] sm:text-xs font-medium text-[var(--muted-foreground)] leading-tight">
              {teamName(displayTeam)}
            </span>
          </Reel>
        </div>

        <div className="mt-4 flex min-h-[52px] items-center justify-center">
          {status === "idle" && (
            <Button size="lg" className="px-8 text-lg font-bold" onClick={onSpin}>
              SPIN
            </Button>
          )}
          {spinning && (
            <p className="animate-pulse text-lg text-[var(--muted-foreground)]">
              {spinningText}
            </p>
          )}
          {locked && (
            <p className="text-sm font-semibold text-[var(--primary)]">
              Draft a player below
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Reel({
  label,
  locked,
  spinning,
  accent,
  children,
}: {
  label: string;
  locked: boolean;
  spinning: boolean;
  accent?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--background)]">
      <div
        className="absolute inset-x-0 top-0 h-1"
        style={{ backgroundColor: accent ?? "var(--primary)" }}
      />
      <div className="px-3 pt-3 pb-4 text-center">
        <div
          className={cn(
            "text-[10px] uppercase tracking-widest mb-1",
            locked ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]",
          )}
        >
          {label}
        </div>
        <div
          className={cn(
            "min-h-[3.25rem] flex flex-col items-center justify-center",
            spinning && "reel-tick blur-[1px] opacity-90",
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
