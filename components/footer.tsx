import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full text-center py-6 flex-shrink-0 space-y-2">
      <p className="text-xs text-[var(--muted-foreground)] opacity-70 max-w-xl mx-auto px-4">
        This is an independent fan project and is not affiliated with, endorsed
        by, or sponsored by the National Basketball Association. Player names and
        statistics are used for informational purposes only.
      </p>
      <p className="text-xs text-[var(--muted-foreground)] opacity-60">
        <Link href="/how-to-play" className="hover:text-[var(--foreground)] transition-colors">
          How to Play
        </Link>
      </p>
    </footer>
  );
}
