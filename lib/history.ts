import { POSITIONS } from "./constants";
import type { CourtRoster, GameMode, SavedGame, TeamResult } from "./types";

const KEY = "eighty-two-and-oh:history";
const MAX = 50;

export function loadHistory(): SavedGame[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveGame(
  mode: GameMode,
  result: TeamResult,
  court: CourtRoster,
  date: number,
): SavedGame[] {
  const entry: SavedGame = {
    date,
    mode,
    wins: result.wins,
    losses: result.losses,
    teamOvr: result.teamOvr,
    grade: result.grade,
    label: result.label,
    color: result.color,
    roster: POSITIONS.filter((pos) => court[pos]).map((pos) => {
      const e = court[pos]!;
      return { position: pos, player: e.player, team: e.team, era: e.era };
    }),
  };
  const next = [entry, ...loadHistory()].slice(0, MAX);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage may be unavailable (private mode) — fail silently */
  }
  return next;
}

export function clearHistory(): void {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

export function bestRecord(history: SavedGame[]): SavedGame | null {
  if (history.length === 0) return null;
  return history.reduce((best, g) => (g.wins > best.wins ? g : best));
}
