import { POSITIONS } from "./constants";
import type { CourtRoster, Player, Position, RosterEntry } from "./types";

export function emptyCourt(): CourtRoster {
  return { PG: null, SG: null, SF: null, PF: null, C: null };
}

/** A player can occupy a court slot only if it's one of their listed positions. */
export function canPlayerPlayPosition(p: Player, pos: Position): boolean {
  return p.positions.includes(pos);
}

/**
 * Two court slots may swap only if each occupant (when present) is eligible to
 * play the OTHER slot's position.
 */
export function canSwapPositions(
  court: CourtRoster,
  a: Position,
  b: Position,
): boolean {
  if (a === b) return false;
  const pa = court[a];
  const pb = court[b];
  return (
    (!pa || canPlayerPlayPosition(pa, b)) &&
    (!pb || canPlayerPlayPosition(pb, a))
  );
}

export function swap(court: CourtRoster, a: Position, b: Position): CourtRoster {
  return { ...court, [a]: court[b], [b]: court[a] };
}

/** Positions a player is eligible for that are also still open on the court. */
export function openEligiblePositions(
  court: CourtRoster,
  p: Player,
): Position[] {
  return POSITIONS.filter((pos) => court[pos] === null && canPlayerPlayPosition(p, pos));
}

/** Names of every player already placed on the court (for de-duplication). */
export function draftedNames(court: CourtRoster): Set<string> {
  const names = new Set<string>();
  for (const pos of POSITIONS) {
    const e = court[pos];
    if (e) names.add(e.player);
  }
  return names;
}

export function filledCount(court: CourtRoster): number {
  return POSITIONS.reduce((n, pos) => n + (court[pos] ? 1 : 0), 0);
}

/** Ordered list of placed players (PG → C) for the simulation engine. */
export function rosterList(court: CourtRoster): RosterEntry[] {
  return POSITIONS.map((pos) => court[pos]).filter(
    (e): e is RosterEntry => e !== null,
  );
}

export type PositionGroup = "All" | "G" | "F" | "C";

/** Position-group filter used in the draft list dropdown. */
export function matchesGroup(p: Player, group: PositionGroup): boolean {
  switch (group) {
    case "All":
      return true;
    case "G":
      return p.positions.some((x) => x === "PG" || x === "SG");
    case "F":
      return p.positions.some((x) => x === "SF" || x === "PF");
    case "C":
      return p.positions.includes("C");
  }
}
