import { POSITIONS } from "./constants";
import type { CourtRoster, GameMode, TeamResult } from "./types";

export function buildShareText(
  mode: GameMode,
  result: TeamResult,
  court: CourtRoster,
): string {
  const modeLabel =
    mode === "hoopiq" ? "HoopIQ 🧠" : mode === "free" ? "Free Draft 🌟" : "Classic 💯";
  const lines = [
    `82-0 — ${result.wins}-${result.losses} (${result.label})`,
    `Mode: ${modeLabel} · Rating ${result.teamOvr}`,
    "",
    ...POSITIONS.filter((pos) => court[pos]).map((pos) => {
      const e = court[pos]!;
      return `${pos}: ${e.player} (${e.team}, ${e.era})`;
    }),
    "",
    "Can you go 82-0?",
  ];
  return lines.join("\n");
}
