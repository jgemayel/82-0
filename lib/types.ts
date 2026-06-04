export type StatKey = "ppg" | "rpg" | "apg" | "spg" | "bpg";

export type Decade =
  | "1960s"
  | "1970s"
  | "1980s"
  | "1990s"
  | "2000s"
  | "2010s"
  | "2020s";

export type Position = "PG" | "SG" | "SF" | "PF" | "C";

export type GameMode = "classic" | "hoopiq" | "free";

/** One row of the factual stat dataset. */
export interface Player {
  id: string;
  player: string;
  team: string; // franchise abbreviation, e.g. "LAL"
  pos: string;
  positions: Position[];
  ppg: number | null;
  rpg: number | null;
  apg: number | null;
  spg: number | null;
  bpg: number | null;
  baseSlug: string;
  era: string; // decade label, e.g. "1990s"
}

/** A player drafted onto the court, tagged with the slot it was drawn from. */
export interface RosterEntry extends Player {
  slotDecade: Decade;
  slotTeam: string;
}

/** The five court slots; null until a player is placed there. */
export type CourtRoster = Record<Position, RosterEntry | null>;

export interface GradeBand {
  min: number;
  grade: string;
  label: string;
  color: string;
}

export interface TeamResult {
  teamOvr: number;
  wins: number;
  losses: number;
  grade: string;
  label: string;
  color: string;
}

export interface SavedGame {
  date: number;
  mode: GameMode;
  wins: number;
  losses: number;
  teamOvr: number;
  grade: string;
  label: string;
  color: string;
  roster: {
    position: Position;
    player: string;
    team: string;
    era: string;
  }[];
}
