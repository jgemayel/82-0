"use client";

import { Ban, CalendarX, Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ROUNDS } from "@/lib/constants";
import { buildIndex, type PlayerIndex } from "@/lib/data";
import { loadHistory, saveGame } from "@/lib/history";
import {
  emptyCourt,
  filledCount,
  rosterList,
  swap as swapCourt,
} from "@/lib/positions";
import { simulateSeason } from "@/lib/sim";
import { rerollDecade, rerollTeam, rollAssignment } from "@/lib/slot";
import type {
  CourtRoster,
  Decade,
  GameMode,
  Player,
  Position,
  SavedGame,
  TeamResult,
} from "@/lib/types";
import { ChoosePosition } from "./choose-position";
import { Court } from "./court";
import { FreeDraft } from "./free-draft";
import { HistoryPanel } from "./history-panel";
import { ModeSelect } from "./mode-select";
import { PlayerPick } from "./player-pick";
import { Results } from "./results";
import { SlotMachine, type SpinKind } from "./slot-machine";
import { Button, Card } from "./ui";

type Stage = "loading" | "error" | "start" | "playing" | "results";
type Phase = "idle" | "spinning" | "picking";

interface SpinTarget {
  team: string;
  decade: Decade;
  spinTeam: boolean;
  spinDecade: boolean;
  kind: SpinKind;
  id: number;
}

export function Game() {
  const [index, setIndex] = useState<PlayerIndex | null>(null);
  const [stage, setStage] = useState<Stage>("loading");
  const [mode, setMode] = useState<GameMode>("classic");

  const [round, setRound] = useState(1);
  const [phase, setPhase] = useState<Phase>("idle");
  const [court, setCourt] = useState<CourtRoster>(emptyCourt());
  const [target, setTarget] = useState<SpinTarget | null>(null);
  const [pending, setPending] = useState<Player | null>(null);
  const [teamSkipUsed, setTeamSkipUsed] = useState(false);
  const [decadeSkipUsed, setDecadeSkipUsed] = useState(false);
  const [result, setResult] = useState<TeamResult | null>(null);
  const [history, setHistory] = useState<SavedGame[]>([]);
  const spinId = useRef(0);

  useEffect(() => {
    let cancelled = false;
    fetch("/players_flat.json")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data: Player[]) => {
        if (cancelled) return;
        setIndex(buildIndex(data));
        setStage("start");
      })
      .catch(() => !cancelled && setStage("error"));
    setHistory(loadHistory());
    return () => {
      cancelled = true;
    };
  }, []);

  const startGame = useCallback((m: GameMode) => {
    setMode(m);
    setCourt(emptyCourt());
    setTeamSkipUsed(false);
    setDecadeSkipUsed(false);
    setResult(null);
    setRound(1);
    setTarget(null);
    setPending(null);
    setPhase("idle");
    setStage("playing");
  }, []);

  const reset = useCallback(() => {
    setStage("start");
    setResult(null);
    setCourt(emptyCourt());
    setTarget(null);
    setPending(null);
    setPhase("idle");
    setRound(1);
  }, []);

  useEffect(() => {
    (window as unknown as { __resetGame?: () => void }).__resetGame = reset;
  }, [reset]);

  // --- spinning ---
  const spin = useCallback(() => {
    if (!index || phase !== "idle") return;
    spinId.current += 1;
    setTarget({
      ...rollAssignment(index),
      spinTeam: true,
      spinDecade: true,
      kind: "full",
      id: spinId.current,
    });
    setPhase("spinning");
  }, [index, phase]);

  const skipTeam = useCallback(() => {
    if (!index || !target || teamSkipUsed || phase !== "picking") return;
    setTeamSkipUsed(true);
    const team = rerollTeam(index, target.decade, target.team);
    spinId.current += 1;
    setTarget({
      team,
      decade: target.decade,
      spinTeam: true,
      spinDecade: false,
      kind: "team",
      id: spinId.current,
    });
    setPhase("spinning");
  }, [index, target, teamSkipUsed, phase]);

  const skipDecade = useCallback(() => {
    if (!index || !target || decadeSkipUsed || phase !== "picking") return;
    setDecadeSkipUsed(true);
    const next = rerollDecade(index, target.decade);
    spinId.current += 1;
    setTarget({
      team: next.team,
      decade: next.decade,
      spinTeam: next.team !== target.team,
      spinDecade: true,
      kind: "decade",
      id: spinId.current,
    });
    setPhase("spinning");
  }, [index, target, decadeSkipUsed, phase]);

  const finish = useCallback(
    (finalCourt: CourtRoster) => {
      const res = simulateSeason(rosterList(finalCourt), mode);
      setResult(res);
      setStage("results");
      setHistory(saveGame(mode, res, finalCourt, Date.now()));
    },
    [mode],
  );

  // --- drafting / placement ---
  const choosePosition = useCallback(
    (pos: Position) => {
      if (!pending) return;
      const entry = {
        ...pending,
        slotDecade: (target?.decade ?? pending.era) as Decade,
        slotTeam: target?.team ?? pending.team,
      };
      const nextCourt: CourtRoster = { ...court, [pos]: entry };
      setCourt(nextCourt);
      setPending(null);

      // Free Draft never auto-simulates — the player hits "Simulate" when ready.
      if (mode === "free") return;

      if (filledCount(nextCourt) >= ROUNDS) {
        finish(nextCourt);
        return;
      }
      setRound((r) => r + 1);
      setTarget(null);
      setPhase("idle");
    },
    [pending, target, court, mode, finish],
  );

  const onSwap = useCallback((a: Position, b: Position) => {
    setCourt((c) => swapCourt(c, a, b));
  }, []);

  const onRemove = useCallback((pos: Position) => {
    setCourt((c) => ({ ...c, [pos]: null }));
  }, []);

  const content = useMemo(() => {
    if (stage === "loading") {
      return (
        <div className="pt-10 text-center">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-[var(--primary)]" />
          <p className="mt-3 animate-pulse text-lg text-[var(--muted-foreground)]">
            Loading player data…
          </p>
        </div>
      );
    }
    if (stage === "error") {
      return (
        <Card className="mx-auto max-w-md p-6 text-center">
          <p className="font-semibold">Couldn&apos;t load player data.</p>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Make sure <code>players_flat.json</code> is served from{" "}
            <code>/public</code>, then refresh.
          </p>
        </Card>
      );
    }
    if (stage === "start") {
      return (
        <div className="space-y-6">
          <ModeSelect onSelect={startGame} />
          <div className="mx-auto max-w-md">
            <HistoryPanel history={history} />
          </div>
        </div>
      );
    }
    if (stage === "results" && result) {
      return (
        <Results
          mode={mode}
          result={result}
          court={court}
          onPlayAgain={reset}
        />
      );
    }

    if (!index) return null;

    // --- Free Draft: no slot machine, pick anyone, simulate when ready ---
    if (mode === "free") {
      const filled = filledCount(court);
      return (
        <div className="mx-auto w-full max-w-3xl">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-[var(--muted-foreground)]">
              Build your dream lineup
            </span>
            <span className="rounded-full bg-[var(--secondary)] px-3 py-1 text-xs font-semibold">
              🌟 Free Draft
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_240px]">
            <div className="min-w-0 space-y-4">
              <FreeDraft
                index={index}
                court={court}
                onPick={(p) => setPending(p)}
              />
            </div>

            <div className="self-start md:sticky md:top-4 space-y-3">
              <Court court={court} onSwap={onSwap} onRemove={onRemove} />
              <Button
                className="w-full"
                disabled={filled < ROUNDS}
                onClick={() => finish(court)}
              >
                {filled < ROUNDS
                  ? `Fill all 5 (${filled}/5)`
                  : "Simulate Season"}
              </Button>
            </div>
          </div>

          {pending && (
            <ChoosePosition
              player={pending}
              court={court}
              onChoose={choosePosition}
              onCancel={() => setPending(null)}
            />
          )}
        </div>
      );
    }

    return (
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-[var(--muted-foreground)]">
            Round {Math.min(round, ROUNDS)}/{ROUNDS}
          </span>
          <span className="rounded-full bg-[var(--secondary)] px-3 py-1 text-xs font-semibold">
            {mode === "hoopiq" ? "🧠 HoopIQ" : "💯 Classic"}
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_240px]">
          <div className="min-w-0 space-y-4">
            <SlotMachine
              index={index}
              status={phase}
              target={target}
              onSpin={spin}
              onComplete={() => setPhase("picking")}
            />

            {phase === "picking" && target && (
              <>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    disabled={teamSkipUsed}
                    onClick={skipTeam}
                  >
                    <Ban className="h-4 w-4" />
                    Team skip {teamSkipUsed ? "(used)" : "(1)"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    disabled={decadeSkipUsed}
                    onClick={skipDecade}
                  >
                    <CalendarX className="h-4 w-4" />
                    Decade skip {decadeSkipUsed ? "(used)" : "(1)"}
                  </Button>
                </div>
                <PlayerPick
                  index={index}
                  team={target.team}
                  decade={target.decade}
                  mode={mode}
                  court={court}
                  onPick={(p) => setPending(p)}
                />
              </>
            )}
          </div>

          <div className="self-start md:sticky md:top-4">
            <Court court={court} onSwap={onSwap} />
          </div>
        </div>

        {pending && (
          <ChoosePosition
            player={pending}
            court={court}
            onChoose={choosePosition}
            onCancel={() => setPending(null)}
          />
        )}
      </div>
    );
  }, [
    stage,
    history,
    result,
    mode,
    court,
    index,
    target,
    round,
    phase,
    teamSkipUsed,
    decadeSkipUsed,
    pending,
    startGame,
    reset,
    spin,
    skipTeam,
    skipDecade,
    choosePosition,
    onSwap,
    onRemove,
    finish,
  ]);

  return content;
}
