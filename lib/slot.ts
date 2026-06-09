import { DECADES } from "./constants";
import { playersFor, teamsFor, type PlayerIndex } from "./data";
import type { Decade } from "./types";
import { pickRandom } from "./utils";

export interface SlotAssignment {
  team: string;
  decade: Decade;
}

/** A (team, decade) pair only counts if it actually has draftable players. */
function isValid(index: PlayerIndex, team: string, decade: Decade): boolean {
  return playersFor(index, team, decade).length > 0;
}

/** Roll a fresh, fully random team + decade combination that has players. */
export function rollAssignment(index: PlayerIndex): SlotAssignment {
  for (let attempt = 0; attempt < 200; attempt++) {
    const decade = pickRandom(DECADES);
    const teams = teamsFor(index, decade);
    if (teams.length === 0) continue;
    const team = pickRandom(teams);
    if (isValid(index, team, decade)) return { team, decade };
  }
  // Exhaustive fallback (should never be reached with the real dataset).
  for (const decade of DECADES) {
    const teams = teamsFor(index, decade);
    if (teams.length) return { team: teams[0], decade };
  }
  return { team: "LAL", decade: "1980s" };
}

/** Re-roll only the team, keeping the current decade. */
export function rerollTeam(
  index: PlayerIndex,
  decade: Decade,
  currentTeam: string,
): string {
  const teams = teamsFor(index, decade).filter((t) => t !== currentTeam);
  if (teams.length === 0) return currentTeam;
  return pickRandom(teams);
}

/**
 * Re-roll only the decade, keeping the SAME franchise whenever that team has
 * players in another era. Only if the team exists in no other decade does the
 * franchise change as well.
 */
export function rerollDecade(
  index: PlayerIndex,
  currentDecade: Decade,
  currentTeam: string,
): SlotAssignment {
  const sameTeamDecades = DECADES.filter(
    (d) => d !== currentDecade && isValid(index, currentTeam, d),
  );
  if (sameTeamDecades.length > 0) {
    return { team: currentTeam, decade: pickRandom(sameTeamDecades) };
  }
  // Team has no other era — fall back to a fresh valid combination.
  const others = DECADES.filter((d) => d !== currentDecade);
  for (let attempt = 0; attempt < 200; attempt++) {
    const decade = pickRandom(others);
    const teams = teamsFor(index, decade);
    if (teams.length === 0) continue;
    const team = pickRandom(teams);
    if (isValid(index, team, decade)) return { team, decade };
  }
  return rollAssignment(index);
}
