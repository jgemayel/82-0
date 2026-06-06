import { DECADES } from "./constants";
import type { Decade, Player } from "./types";

export interface PlayerIndex {
  all: Player[];
  /** Every draftable player/team/era row, de-duplicated (for Free Draft). */
  allPlayers: Player[];
  /** "TEAM|DECADE" -> players, sorted by descending scoring. */
  byTeamDecade: Map<string, Player[]>;
  /** decade -> set of team abbreviations that have at least one player. */
  teamsByDecade: Map<Decade, string[]>;
}

const decadeSet = new Set<string>(DECADES);

export function key(team: string, decade: string): string {
  return `${team}|${decade}`;
}

/** Build lookup indexes from the flat dataset (draft pool = 1960s–2020s). */
export function buildIndex(raw: Player[]): PlayerIndex {
  const all = raw.filter((p) => decadeSet.has(p.era));

  const byTeamDecade = new Map<string, Player[]>();
  const teamsByDecade = new Map<Decade, Set<string>>();

  // The raw dataset can contain duplicate rows for the same player/team/era,
  // so de-duplicate each bucket by baseSlug while indexing.
  const seenInBucket = new Map<string, Set<string>>();
  for (const p of all) {
    const k = key(p.team, p.era);
    if (!byTeamDecade.has(k)) {
      byTeamDecade.set(k, []);
      seenInBucket.set(k, new Set());
    }
    const seen = seenInBucket.get(k)!;
    const slug = p.baseSlug || p.id || p.player;
    if (seen.has(slug)) continue;
    seen.add(slug);
    byTeamDecade.get(k)!.push(p);

    const dec = p.era as Decade;
    if (!teamsByDecade.has(dec)) teamsByDecade.set(dec, new Set());
    teamsByDecade.get(dec)!.add(p.team);
  }

  // Sort each team/decade bucket by overall box-score production (desc).
  for (const list of byTeamDecade.values()) {
    list.sort((a, b) => productionScore(b) - productionScore(a));
  }

  const teamsByDecadeArr = new Map<Decade, string[]>();
  for (const [dec, teams] of teamsByDecade) {
    teamsByDecadeArr.set(dec, [...teams].sort());
  }

  // Flatten the de-duplicated buckets into one list for the Free Draft browser.
  const allPlayers = [...byTeamDecade.values()].flat();

  return { all, allPlayers, byTeamDecade, teamsByDecade: teamsByDecadeArr };
}

function productionScore(p: Player): number {
  return (
    (p.ppg ?? 0) +
    (p.rpg ?? 0) * 1.2 +
    (p.apg ?? 0) * 1.5 +
    (p.spg ?? 0) * 3 +
    (p.bpg ?? 0) * 3
  );
}

export function playersFor(
  index: PlayerIndex,
  team: string,
  decade: Decade,
): Player[] {
  return index.byTeamDecade.get(key(team, decade)) ?? [];
}

/** Find the full dataset row for a saved (player, team, era) reference. */
export function findPlayerRow(
  index: PlayerIndex,
  player: string,
  team: string,
  era: string,
): Player | null {
  return (
    index.allPlayers.find(
      (p) => p.player === player && p.team === team && p.era === era,
    ) ?? null
  );
}

/** Teams that field at least one player in the given decade. */
export function teamsFor(index: PlayerIndex, decade: Decade): string[] {
  return index.teamsByDecade.get(decade) ?? [];
}
