"use client";

import { POSITIONS, POSITION_NAMES, teamColor } from "@/lib/constants";
import { canPlayerPlayPosition } from "@/lib/positions";
import type { CourtRoster, Player, Position } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button, Card } from "./ui";

interface Props {
  player: Player;
  court: CourtRoster;
  onChoose: (pos: Position) => void;
  onCancel: () => void;
}

export function ChoosePosition({ player, court, onChoose, onCancel }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onCancel}
    >
      <Card
        className="w-full max-w-lg p-5 sm:p-6 animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-1 text-center text-sm uppercase tracking-widest text-[var(--muted-foreground)]">
          {player.team} · {player.era}
        </div>
        <h2 className="mb-4 text-center text-xl font-bold">
          {player.player} — Choose Position
        </h2>

        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {POSITIONS.map((pos) => {
            const eligible = canPlayerPlayPosition(player, pos);
            const occupied = court[pos] !== null;
            const disabled = !eligible || occupied;
            return (
              <button
                key={pos}
                disabled={disabled}
                onClick={() => onChoose(pos)}
                className={cn(
                  "flex h-20 flex-col items-center justify-center gap-1 rounded-lg border-2 text-center transition-all",
                  disabled
                    ? "cursor-not-allowed border-[var(--border)] opacity-40"
                    : "cursor-pointer border-[var(--primary)] hover:bg-[var(--primary)]/10",
                )}
                style={
                  !disabled
                    ? { borderColor: teamColor(player.team) }
                    : undefined
                }
                title={
                  occupied
                    ? `${pos} is filled`
                    : !eligible
                      ? `${player.player} can't play ${pos}`
                      : POSITION_NAMES[pos]
                }
              >
                <span className="text-lg font-extrabold">{pos}</span>
                <span className="px-1 text-[9px] leading-tight text-[var(--muted-foreground)]">
                  {occupied ? "Filled" : POSITION_NAMES[pos]}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex justify-center">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
}
