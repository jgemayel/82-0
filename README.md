# 82-0

Build the ultimate all-time NBA roster and see if you can go **82-0**.

A faithful, independently-built clone of the viral basketball drafting game, made
with Next.js. Five rounds, a slot machine that locks a random franchise + decade
each round, two strategic skips, two game modes, and an era-adjusted season
simulation that grades your roster from **F (Tanking)** all the way to a perfect
**S (82-0)**.

## Stack

- **Next.js 15** (App Router) + **React 19**
- **Tailwind CSS v4**
- **next-themes** (dark/light) · **lucide-react** (icons)
- No backend — the game runs entirely in the browser. Attempt history is stored
  in `localStorage`.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

```bash
npm run build && npm start   # production build
```

## How it works

- **Data** — `public/players_flat.json` holds the factual per-decade box-score
  stat lines (PTS/REB/AST/STL/BLK) for ~11,000 player-eras across 30 franchises.
  It's fetched on load and indexed by `(franchise, decade)`.
- **Gameplay** — `lib/slot.ts` rolls valid team/decade combinations and handles
  the team/decade re-rolls. `components/game.tsx` is the round-by-round state
  machine.
- **Simulation** — `lib/sim.ts` rates each player against era benchmarks
  (`lib/constants.ts`), aggregates the roster into a Team Strength Rating, and
  maps it onto a non-linear win curve:
  `wins = round(82 · min(rating / 110, 1) ^ exponent)`.
  - **Classic** uses category totals weighted `.46 / .25 / .18 / .07 / .04`
    (curve exponent `1.15`).
  - **HoopIQ** uses the geometric mean of positionally-weighted player ratings
    (steeper exponent `2.2`) and hides the box score while you draft.

## Notes

This is an independent fan project and is not affiliated with, endorsed by, or
sponsored by the National Basketball Association. Player names and statistics are
used for informational purposes only.
