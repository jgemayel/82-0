"use client";

import { Check, Download, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  MODE_LABELS,
  POSITIONS,
  STAT_KEYS,
  STAT_LABELS,
  teamColor,
  teamName,
} from "@/lib/constants";
import { rosterList } from "@/lib/positions";
import { buildShareText } from "@/lib/share";
import type { CourtRoster, GameMode, StatKey, TeamResult } from "@/lib/types";
import { formatStat } from "@/lib/utils";
import { Court } from "./court";
import { Badge, Button, Card } from "./ui";

interface Props {
  mode: GameMode;
  result: TeamResult;
  court: CourtRoster;
  onPlayAgain: () => void;
}

export function Results({ mode, result, court, onPlayAgain }: Props) {
  const [copied, setCopied] = useState(false);
  const perfect = result.wins === 82;
  const roster = rosterList(court);

  const totals: Record<StatKey, number> = {
    ppg: 0,
    rpg: 0,
    apg: 0,
    spg: 0,
    bpg: 0,
  };
  for (const p of roster) {
    for (const k of STAT_KEYS) totals[k] += (p[k] as number) ?? 0;
  }

  async function share() {
    const text = buildShareText(mode, result, court);
    try {
      if (navigator.share) {
        await navigator.share({ title: "82-0", text });
        return;
      }
    } catch {
      /* dismissed */
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked */
    }
  }

  function download() {
    const url = renderCard(mode, result, court, totals);
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = `82-0_${result.wins}-${result.losses}.png`;
    a.click();
  }

  return (
    <div className="mx-auto w-full max-w-xl animate-pop-in space-y-4">
      {perfect && <Confetti />}

      <Card className="relative overflow-hidden p-6 text-center">
        <div
          className="absolute inset-x-0 top-0 h-1.5"
          style={{ backgroundColor: result.color }}
        />
        <p className="text-xs uppercase tracking-widest text-[var(--muted-foreground)]">
          {MODE_LABELS[mode]} · Season Simulation
        </p>

        <div className="my-3 flex items-center justify-center gap-4">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full text-4xl font-extrabold text-white"
            style={{ backgroundColor: result.color }}
          >
            {result.grade}
          </div>
          <div className="text-left">
            <div className="text-5xl font-extrabold leading-none tabular-nums">
              {result.wins}-{result.losses}
            </div>
            <div
              className="mt-1 text-lg font-bold tracking-wide"
              style={{ color: result.color }}
            >
              {result.label}
            </div>
          </div>
        </div>

        <p className="text-sm text-[var(--muted-foreground)]">
          Team Strength Rating:{" "}
          <span className="font-semibold text-[var(--foreground)] tabular-nums">
            {result.teamOvr}
          </span>
        </p>

        {perfect ? (
          <p className="mt-2 font-semibold text-[var(--primary)]">
            🏆 Perfect season. You went 82-0.
          </p>
        ) : (
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            {82 - result.wins} loss{82 - result.wins === 1 ? "" : "es"} short of
            perfection.
          </p>
        )}

        {/* team stat totals */}
        <div className="mx-auto mt-4 grid max-w-sm grid-cols-5 gap-1 text-center">
          {STAT_KEYS.map((k) => (
            <div key={k} className="rounded bg-[var(--secondary)] py-1.5">
              <div className="text-[10px] text-[var(--muted-foreground)]">
                {STAT_LABELS[k]}
              </div>
              <div className="text-sm font-semibold tabular-nums">
                {totals[k].toFixed(1)}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <Button onClick={onPlayAgain}>
            <RotateCcw className="h-4 w-4" /> Play again
          </Button>
          <Button variant="outline" onClick={share}>
            {copied ? (
              <>
                <Check className="h-4 w-4" /> Copied
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4" /> Share
              </>
            )}
          </Button>
          <Button variant="outline" onClick={download}>
            <Download className="h-4 w-4" /> Card
          </Button>
        </div>
      </Card>

      <Card className="p-4">
        <Court court={court} interactive={false} />
      </Card>

      <Card className="p-4">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
          Box score
        </h3>
        <div className="space-y-2">
          {POSITIONS.map((pos) => {
            const r = court[pos];
            if (!r) return null;
            return (
              <div
                key={pos}
                className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="w-7 text-xs font-bold text-[var(--muted-foreground)]">
                      {pos}
                    </span>
                    <span
                      className="inline-block h-3 w-3 rounded-sm shrink-0"
                      style={{ backgroundColor: teamColor(r.team) }}
                    />
                    <span className="truncate font-semibold">{r.player}</span>
                  </div>
                  <Badge className="shrink-0 bg-[var(--secondary)] text-[var(--secondary-foreground)]">
                    {teamName(r.team)} · {r.era}
                  </Badge>
                </div>
                <div className="mt-2 grid grid-cols-5 gap-1 text-center">
                  {STAT_KEYS.map((k) => (
                    <div key={k} className="rounded bg-[var(--secondary)] py-1">
                      <div className="text-[10px] text-[var(--muted-foreground)]">
                        {STAT_LABELS[k]}
                      </div>
                      <div className="text-sm font-semibold tabular-nums">
                        {formatStat(r[k])}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

/** Draw a shareable PNG card to an off-screen canvas and return a data URL. */
function renderCard(
  mode: GameMode,
  result: TeamResult,
  court: CourtRoster,
  totals: Record<StatKey, number>,
): string | null {
  const W = 1080;
  const H = 1080;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#0c101c";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = result.color;
  ctx.fillRect(0, 0, W, 14);

  ctx.textAlign = "center";
  ctx.fillStyle = "#fd6a00";
  ctx.font = "800 96px Arial, sans-serif";
  ctx.fillText("82-0", W / 2, 140);

  ctx.fillStyle = "#a0a0a0";
  ctx.font = "600 28px Arial, sans-serif";
  ctx.fillText(
    `${MODE_LABELS[mode]} · Season Simulation`,
    W / 2,
    194,
  );

  ctx.fillStyle = "#ffffff";
  ctx.font = "800 170px Arial, sans-serif";
  ctx.fillText(`${result.wins}-${result.losses}`, W / 2, 370);

  ctx.fillStyle = result.color;
  ctx.font = "800 60px Arial, sans-serif";
  ctx.fillText(`${result.grade} · ${result.label}`, W / 2, 444);

  ctx.fillStyle = "#a0a0a0";
  ctx.font = "500 28px Arial, sans-serif";
  ctx.fillText(`Team Strength Rating ${result.teamOvr}`, W / 2, 492);

  ctx.textAlign = "left";
  let y = 590;
  for (const pos of POSITIONS) {
    const r = court[pos];
    if (!r) continue;
    ctx.fillStyle = "#a0a0a0";
    ctx.font = "700 34px Arial, sans-serif";
    ctx.fillText(pos, 130, y);
    ctx.fillStyle = teamColor(r.team);
    ctx.fillRect(200, y - 26, 20, 24);
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 36px Arial, sans-serif";
    ctx.fillText(r.player, 236, y);
    ctx.fillStyle = "#a0a0a0";
    ctx.font = "400 28px Arial, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(`${r.team} · ${r.era}`, W - 130, y);
    ctx.textAlign = "left";
    y += 66;
  }

  y += 14;
  ctx.textAlign = "center";
  ctx.fillStyle = "#262d3f";
  ctx.fillRect(130, y - 36, W - 260, 70);
  ctx.fillStyle = "#ffffff";
  ctx.font = "600 30px Arial, sans-serif";
  const labels: Record<StatKey, string> = STAT_LABELS;
  const span = (W - 260) / 5;
  STAT_KEYS.forEach((k, i) => {
    const cx = 130 + span * i + span / 2;
    ctx.fillStyle = "#a0a0a0";
    ctx.font = "500 22px Arial, sans-serif";
    ctx.fillText(labels[k], cx, y - 8);
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 30px Arial, sans-serif";
    ctx.fillText(totals[k].toFixed(1), cx, y + 24);
  });

  ctx.fillStyle = "#fd6a00";
  ctx.font = "700 38px Arial, sans-serif";
  ctx.fillText("Can you go 82-0?", W / 2, 1030);

  try {
    return canvas.toDataURL("image/png");
  } catch {
    return null;
  }
}

function Confetti() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const colors = ["#fd6a00", "#a855f7", "#22c55e", "#3b82f6", "#ffffff"];
    const pieces = Array.from({ length: 140 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      r: 4 + Math.random() * 6,
      c: colors[Math.floor(Math.random() * colors.length)],
      vy: 2 + Math.random() * 4,
      vx: -1.5 + Math.random() * 3,
      rot: Math.random() * Math.PI,
      vr: -0.1 + Math.random() * 0.2,
    }));
    let raf = 0;
    let frames = 0;
    const tick = () => {
      frames++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of pieces) {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 1.6);
        ctx.restore();
      }
      if (frames < 220) raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <canvas
      ref={ref}
      className="pointer-events-none fixed inset-0 z-50"
      aria-hidden
    />
  );
}
