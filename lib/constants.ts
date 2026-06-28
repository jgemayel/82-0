import type { Decade, GameMode, GradeBand, Position, StatKey } from "./types";

/** Decades available in the draft pool (the 1950s are excluded). */
export const DECADES: Decade[] = [
  "1960s",
  "1970s",
  "1980s",
  "1990s",
  "2000s",
  "2010s",
  "2020s",
];

/** The five roster positions — one per round, in court order. */
export const POSITIONS: Position[] = ["PG", "SG", "SF", "PF", "C"];

export const POSITION_NAMES: Record<Position, string> = {
  PG: "Point Guard",
  SG: "Shooting Guard",
  SF: "Small Forward",
  PF: "Power Forward",
  C: "Center",
};

export const ROUNDS = 5;

/**
 * Feature flag for the Free Draft mode card on the start screen. The mode and
 * all its code remain fully intact (and saved Free Draft attempts still load);
 * flip this to `true` to surface the option again.
 */
export const ENABLE_FREE_DRAFT = false;

export const MODE_LABELS: Record<GameMode, string> = {
  classic: "Classic",
  hoopiq: "HoopIQ",
  free: "Free Draft",
};

export const STAT_KEYS: StatKey[] = ["ppg", "rpg", "apg", "spg", "bpg"];

export const STAT_LABELS: Record<StatKey, string> = {
  ppg: "PTS",
  rpg: "REB",
  apg: "AST",
  spg: "STL",
  bpg: "BLK",
};

/**
 * Era-adjusted benchmark stat line per decade. A player's output in each
 * category is measured as a ratio against these reference values, so a
 * 30 PPG season in the 1960s is not treated the same as 30 PPG today.
 */
export const ERA_BENCHMARKS: Record<Decade, Record<StatKey, number>> = {
  "1960s": { ppg: 30, rpg: 18, apg: 8, spg: 1.8, bpg: 1.8 },
  "1970s": { ppg: 28, rpg: 13, apg: 9, spg: 2, bpg: 2 },
  "1980s": { ppg: 28, rpg: 11, apg: 11, spg: 2.2, bpg: 2 },
  "1990s": { ppg: 27, rpg: 11, apg: 9, spg: 2, bpg: 2 },
  "2000s": { ppg: 27, rpg: 11, apg: 9, spg: 2, bpg: 2 },
  "2010s": { ppg: 28, rpg: 11, apg: 9, spg: 1.8, bpg: 1.8 },
  "2020s": { ppg: 28, rpg: 11, apg: 9, spg: 1.8, bpg: 1.8 },
};

/** Position usage weights (HoopIQ aggregation). */
export const POSITION_WEIGHTS: Record<string, Record<StatKey, number>> = {
  PG: { ppg: 0.4, rpg: 0.1, apg: 0.35, spg: 0.1, bpg: 0.05 },
  SG: { ppg: 0.45, rpg: 0.1, apg: 0.2, spg: 0.2, bpg: 0.05 },
  SF: { ppg: 0.45, rpg: 0.15, apg: 0.2, spg: 0.15, bpg: 0.05 },
  PF: { ppg: 0.4, rpg: 0.3, apg: 0.1, spg: 0.1, bpg: 0.1 },
  C: { ppg: 0.4, rpg: 0.35, apg: 0.1, spg: 0.05, bpg: 0.1 },
};

/** Classic-mode category weights (sum to 1). */
export const CATEGORY_WEIGHTS: Record<StatKey, number> = {
  ppg: 0.46,
  rpg: 0.25,
  apg: 0.18,
  spg: 0.07,
  bpg: 0.04,
};

/** Classic-mode reference totals for a full five-player roster. */
export const CATEGORY_DENOMINATORS: Record<StatKey, number> = {
  ppg: 133.4,
  rpg: 39.7,
  apg: 29.3,
  spg: 6.1,
  bpg: 3.2,
};

/** Win curve exponents per mode. */
export const WIN_EXPONENT: Record<"classic" | "hoopiq", number> = {
  classic: 1.15,
  hoopiq: 2.2,
};

/** Team-season grade bands, evaluated against projected wins. */
export const TEAM_GRADE_BANDS: GradeBand[] = [
  { min: 80, grade: "S", label: "PERFECT", color: "#a855f7" },
  { min: 72, grade: "A+", label: "HISTORIC", color: "#22c55e" },
  { min: 62, grade: "A", label: "DYNASTY", color: "#22c55e" },
  { min: 57, grade: "B", label: "CONTENDER", color: "#3b82f6" },
  { min: 50, grade: "C", label: "PLAYOFF", color: "#f59e0b" },
  { min: 40, grade: "D", label: "LOTTERY", color: "#64748b" },
  { min: 0, grade: "F", label: "TANKING", color: "#ef4444" },
];

/** Individual-player grade bands, evaluated against a 0–100 rating. */
export const PLAYER_GRADE_BANDS: GradeBand[] = [
  { min: 97, grade: "S", label: "GOAT", color: "#a855f7" },
  { min: 91, grade: "A", label: "All-Time Great", color: "#22c55e" },
  { min: 85, grade: "B", label: "Elite", color: "#3b82f6" },
  { min: 78, grade: "C", label: "Solid", color: "#f59e0b" },
  { min: 70, grade: "D", label: "Average", color: "#64748b" },
  { min: 0, grade: "F", label: "Weak", color: "#ef4444" },
];

/**
 * Two-way / generational defenders & playmakers who earn a small intangibles
 * bump when their box score is hidden (HoopIQ mode only).
 */
export const INTANGIBLES = new Set<string>([
  "larry bird",
  "tim duncan",
  "kevin durant",
  "magic johnson",
  "shaquille o'neal",
  "hakeem olajuwon",
  "bill russell",
  "kobe bryant",
  "oscar robertson",
  "karl malone",
  "kevin garnett",
  "isiah thomas",
  "tony parker",
  "manu ginobili",
  "draymond green",
  "scottie pippen",
  "dennis rodman",
  "stephen curry",
  "nikola jokic",
  "dirk nowitzki",
]);

/** Franchise display names keyed by abbreviation. */
export const TEAM_NAMES: Record<string, string> = {
  ATL: "Atlanta Hawks",
  BKN: "Brooklyn Nets",
  BOS: "Boston Celtics",
  CHA: "Charlotte Hornets",
  CHI: "Chicago Bulls",
  CLE: "Cleveland Cavaliers",
  DAL: "Dallas Mavericks",
  DEN: "Denver Nuggets",
  DET: "Detroit Pistons",
  GSW: "Golden State Warriors",
  HOU: "Houston Rockets",
  IND: "Indiana Pacers",
  LAC: "Los Angeles Clippers",
  LAL: "Los Angeles Lakers",
  MEM: "Memphis Grizzlies",
  MIA: "Miami Heat",
  MIL: "Milwaukee Bucks",
  MIN: "Minnesota Timberwolves",
  NOP: "New Orleans Pelicans",
  NYK: "New York Knicks",
  OKC: "Oklahoma City Thunder",
  ORL: "Orlando Magic",
  PHI: "Philadelphia 76ers",
  PHX: "Phoenix Suns",
  POR: "Portland Trail Blazers",
  SAC: "Sacramento Kings",
  SAS: "San Antonio Spurs",
  TOR: "Toronto Raptors",
  UTA: "Utah Jazz",
  WAS: "Washington Wizards",
};

/** Brand accent that approximates each franchise (used for slot/roster chips). */
export const TEAM_COLORS: Record<string, string> = {
  ATL: "#e03a3e",
  BKN: "#777d84",
  BOS: "#007a33",
  CHA: "#1d1160",
  CHI: "#ce1141",
  CLE: "#860038",
  DAL: "#00538c",
  DEN: "#0e2240",
  DET: "#c8102e",
  GSW: "#1d428a",
  HOU: "#ce1141",
  IND: "#fdbb30",
  LAC: "#c8102e",
  LAL: "#552583",
  MEM: "#5d76a9",
  MIA: "#98002e",
  MIL: "#00471b",
  MIN: "#0c2340",
  NOP: "#0c2340",
  NYK: "#f58426",
  OKC: "#007ac1",
  ORL: "#0077c0",
  PHI: "#006bb6",
  PHX: "#1d1160",
  POR: "#e03a3e",
  SAC: "#5a2d81",
  SAS: "#6f7479",
  TOR: "#ce1141",
  UTA: "#002b5c",
  WAS: "#002b5c",
};

export function teamName(abbr: string): string {
  return TEAM_NAMES[abbr] ?? abbr;
}

export function teamColor(abbr: string): string {
  return TEAM_COLORS[abbr] ?? "#fd6a00";
}
