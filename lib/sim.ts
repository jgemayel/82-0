import {
  CATEGORY_DENOMINATORS,
  CATEGORY_WEIGHTS,
  ERA_BENCHMARKS,
  INTANGIBLES,
  PLAYER_GRADE_BANDS,
  POSITION_WEIGHTS,
  STAT_KEYS,
  TEAM_GRADE_BANDS,
  WIN_EXPONENT,
} from "./constants";
import type { Decade, GameMode, GradeBand, Player, StatKey, TeamResult } from "./types";

const round1 = (n: number) => Math.round(n * 10) / 10;
const isNum = (v: unknown): v is number =>
  typeof v === "number" && !Number.isNaN(v);

function benchmark(era: string): Record<StatKey, number> {
  return ERA_BENCHMARKS[(era as Decade)] ?? ERA_BENCHMARKS["2020s"];
}

/**
 * Individual player rating on a 0–100 scale.
 *
 * Classic: simple sum of each category measured against its era benchmark.
 * HoopIQ: a positional weighting of those ratios, rewarding output above the
 * benchmark and giving generational two-way players a small intangibles bump.
 */
export function playerRating(p: Player, hoopIQ = false): number {
  const bench = benchmark(p.era);
  const exp = hoopIQ ? 1.25 : 1;
  let n = 0;

  if (hoopIQ) {
    const baseKey = p.positions?.[0] || p.pos || "SF";
    const weights = { ...(POSITION_WEIGHTS[baseKey] ?? POSITION_WEIGHTS.SF) };

    // Older eras have no steals/blocks — redistribute that weight to the
    // categories we do have so those players are not unfairly penalised.
    const missing = (["spg", "bpg"] as StatKey[]).filter((k) => !isNum(p[k]));
    if (missing.length > 0) {
      const kept = STAT_KEYS.filter((k) => !missing.includes(k)).reduce(
        (sum, k) => sum + weights[k],
        0,
      );
      const scale = kept > 0 ? 1 / kept : 1;
      (["ppg", "rpg", "apg"] as StatKey[]).forEach((k) => (weights[k] *= scale));
      missing.forEach((k) => (weights[k] = 0));
    }

    STAT_KEYS.forEach((k) => {
      const v = p[k];
      if (isNum(v)) {
        let ratio = v / bench[k];
        if (ratio > 1) ratio = Math.pow(ratio, exp);
        n += weights[k] * ratio;
      }
    });
  } else {
    STAT_KEYS.forEach((k) => {
      const v = p[k];
      if (isNum(v)) n += v / bench[k];
    });
  }

  const base = 60 + 40 * n;
  const posCount = p.positions?.length || 1;
  const versatility = (posCount - 1) * (hoopIQ ? 3 : 2);
  const intangibles =
    hoopIQ && INTANGIBLES.has((p.player ?? "").toLowerCase()) ? 2.5 : 0;

  return Math.min(100, round1(base + versatility + intangibles));
}

/**
 * Steals/blocks weren't tracked before the 1973-74 season, so a roster can
 * carry players with null defensive stats. Sum the players who do have the
 * stat and scale the total up as if all five roster spots contributed.
 */
function adjustDefensive(roster: Player[]): { spg: number; bpg: number } {
  const scale = (vals: number[]) =>
    vals.reduce((a, b) => a + b, 0) * (vals.length > 0 ? 5 / vals.length : 1);
  const spgs = roster.filter((p) => isNum(p.spg) && p.spg! > 0).map((p) => p.spg!);
  const bpgs = roster.filter((p) => isNum(p.bpg) && p.bpg! > 0).map((p) => p.bpg!);
  return { spg: scale(spgs), bpg: scale(bpgs) };
}

function bandFor(bands: GradeBand[], value: number): GradeBand {
  return bands.find((b) => value >= b.min) ?? bands[bands.length - 1];
}

export function playerGrade(rating: number): GradeBand {
  return bandFor(PLAYER_GRADE_BANDS, rating);
}

export function projectedWins(teamOvr: number, mode: GameMode): number {
  // Free Draft shows stats, so it uses the same engine as Classic.
  const exponent = mode === "hoopiq" ? WIN_EXPONENT.hoopiq : WIN_EXPONENT.classic;
  return Math.round(82 * Math.pow(Math.min(teamOvr / 110, 1), exponent));
}

const EMPTY_RESULT: TeamResult = {
  teamOvr: 0,
  wins: 0,
  losses: 82,
  grade: "F",
  label: "TANKING",
  color: "#ef4444",
};

/** Run the full five-player roster through the season simulation. */
export function simulateSeason(roster: Player[], mode: GameMode): TeamResult {
  if (roster.length === 0) return { ...EMPTY_RESULT };

  let teamOvr: number;

  if (mode === "hoopiq") {
    const ratings = roster.map((p) => playerRating(p, true));
    const product = ratings.reduce((a, b) => a * b, 1);
    const geoMean = Math.pow(product, 1 / ratings.length);
    teamOvr = round1(1.1 * geoMean);
  } else {
    const def = adjustDefensive(roster);
    const sum = (k: StatKey) =>
      roster.reduce((acc, p) => acc + (isNum(p[k]) ? (p[k] as number) : 0), 0);
    const totals: Record<StatKey, number> = {
      ppg: sum("ppg"),
      rpg: sum("rpg"),
      apg: sum("apg"),
      spg: def.spg,
      bpg: def.bpg,
    };
    const weighted = STAT_KEYS.reduce(
      (acc, k) =>
        acc + (totals[k] / CATEGORY_DENOMINATORS[k]) * CATEGORY_WEIGHTS[k],
      0,
    );
    teamOvr = round1(100 * weighted);
  }

  const wins = projectedWins(teamOvr, mode);
  const band = bandFor(TEAM_GRADE_BANDS, wins);
  return {
    teamOvr,
    wins,
    losses: 82 - wins,
    grade: band.grade,
    label: band.label,
    color: band.color,
  };
}
