"use client";

import type { GameMode } from "@/lib/types";
import { Button, Card } from "./ui";

const MODES: {
  mode: GameMode;
  emoji: string;
  name: string;
  desc: string;
  cta: string;
  variant: "primary" | "secondary" | "outline";
}[] = [
  {
    mode: "classic",
    emoji: "💯",
    name: "Classic",
    desc: "Draft with full player stats visible — make informed picks.",
    cta: "Play Classic",
    variant: "primary",
  },
  {
    mode: "hoopiq",
    emoji: "🧠",
    name: "HoopIQ",
    desc: "Stats hidden — draft by memory and test your ball knowledge.",
    cta: "Play HoopIQ",
    variant: "secondary",
  },
  {
    mode: "free",
    emoji: "🌟",
    name: "Free Draft",
    desc: "No slot machine. Pick any player from any team and era — search, filter and sort to build your dream lineup.",
    cta: "Play Free Draft",
    variant: "outline",
  },
];

export function ModeSelect({
  onSelect,
}: {
  onSelect: (mode: GameMode) => void;
}) {
  return (
    <div className="mx-auto max-w-3xl">
      <p className="mb-4 text-center text-[var(--muted-foreground)]">
        Build a five-position all-time lineup — PG, SG, SF, PF, C — and simulate
        your 82-game season. Pick a mode to tip off.
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        {MODES.map((m) => (
          <Card key={m.mode} className="flex flex-col p-6 text-center">
            <div className="text-2xl font-bold">
              {m.emoji} {m.name}
            </div>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--muted-foreground)]">
              {m.desc}
            </p>
            <Button
              className="mt-4 w-full"
              variant={m.variant}
              onClick={() => onSelect(m.mode)}
            >
              {m.cta}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
