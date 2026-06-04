import Link from "next/link";
import { Footer } from "@/components/footer";

export const metadata = {
  title: "How to Play · 82-0",
};

export default function HowToPlay() {
  return (
    <main className="bg-app-gradient flex min-h-screen flex-col">
      <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">How to Play</h1>
          <Link
            href="/"
            className="rounded-md border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--muted-foreground)] transition-colors hover:bg-[var(--secondary)]"
          >
            ← Back to Game
          </Link>
        </div>

        <div className="space-y-8 leading-relaxed">
          <p className="text-[var(--muted-foreground)]">
            The goal of 82-0 is to assemble an all-time NBA roster good enough to
            run the table on a full 82-game schedule. A simulation engine grades
            the raw production of your five picks — the better and more balanced
            your roster, the more games it projects to win.
          </p>

          <Section title="1. The Slot Machine">
            <p>
              Every round opens with a slot machine. Hit <strong>SPIN</strong>{" "}
              to lock a random <strong>franchise</strong> and{" "}
              <strong>decade</strong>, then draft a player from that team in that
              era — searching, filtering by guard/forward/center, or sorting by
              the box score. The game runs <strong>five rounds</strong>.
            </p>
          </Section>

          <Section title="2. Fill the Court">
            <p>
              You&apos;re building a real five-man lineup:{" "}
              <strong>PG, SG, SF, PF, and C</strong>. Each player you draft can
              only be placed at a position they actually play, and you can&apos;t
              draft the same player twice. After placing players you can{" "}
              <strong>tap two spots to swap</strong> them — as long as both
              players are eligible for the new positions.
            </p>
          </Section>

          <Section title="3. The Skips">
            <p>
              You get <strong>one team skip</strong> and{" "}
              <strong>one decade skip</strong> per game. A team skip re-rolls the
              franchise; a decade skip re-rolls the era. Spend them wisely — save
              them for a slot that doesn&apos;t fit your plan.
            </p>
          </Section>

          <Section title="4. The Five Metrics">
            <ul className="space-y-1.5">
              <li>
                <strong>Points (PTS)</strong> — baseline offensive output.
              </li>
              <li>
                <strong>Rebounds (REB)</strong> — possession control and second
                chances.
              </li>
              <li>
                <strong>Assists (AST)</strong> — playmaking and team flow.
              </li>
              <li>
                <strong>Steals (STL)</strong> — perimeter defense and transition.
              </li>
              <li>
                <strong>Blocks (BLK)</strong> — rim protection and stops.
              </li>
            </ul>
            <p className="mt-2">
              Your Team Strength Rating is a weighted, era-adjusted total across
              all five categories. A 30-point night in the 1960s is not worth the
              same as 30 today — the engine accounts for the scoring environment
              of each decade.
            </p>
          </Section>

          <Section title="5. The 82-Game Curve">
            <p>
              Wins do not scale linearly with rating. As your roster gets
              stronger, each additional win is harder to earn, and the leap to a
              perfect 82-0 demands elite production across{" "}
              <em>every</em> category at once. A single weak stat can keep you out
              of perfection no matter how high you score.
            </p>
          </Section>

          <Section title="6. Game Modes">
            <p>
              <strong>💯 Classic</strong> — full box-score stats are visible, so
              you can draft on the numbers.
            </p>
            <p>
              <strong>🧠 HoopIQ</strong> — stats are hidden. Draft from memory and
              basketball knowledge alone.
            </p>
          </Section>
        </div>
      </div>
      <Footer />
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-2 text-xl font-semibold">{title}</h2>
      <div className="space-y-2 text-[var(--foreground)]/90">{children}</div>
    </section>
  );
}
