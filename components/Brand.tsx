import Image from "next/image";
import Link from "next/link";
import { PremiumButtonLink } from "@/components/ui/PremiumButton";

export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`relative flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/35 bg-card/80 shadow-[0_18px_48px_hsl(0_100%_50%_/_0.18)] backdrop-blur-xl transition duration-200 hover:border-primary ${className}`}
    >
      <Image
        src="/brand/praetor-mark.svg"
        alt="PRAETOR shield mark"
        width={34}
        height={34}
        priority
      />
    </span>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/brand/praetor-wordmark.svg"
      alt="PRAETOR"
      width={230}
      height={48}
      priority
      className={className}
    />
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/40 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/30">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <LogoMark />
          <div>
            <p className="text-base font-black tracking-[0.24em] text-foreground">
              PRAETOR
            </p>
            <p className="text-xs text-muted-foreground">praetores.com</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-7 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground md:flex">
          <Link
            className="rounded-md transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            href="/"
          >
            Praetor
          </Link>
          <Link
            className="rounded-md text-primary transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            href="/app"
          >
            Launch Devnet App
          </Link>
          <Link
            className="rounded-md transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            href="/dashboard"
          >
            Dashboard
          </Link>
          <Link
            className="rounded-md transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            href="/demo"
          >
            Guided Walkthrough
          </Link>
        </nav>
        <PremiumButtonLink href="/app" variant="glass" className="hidden px-4 py-2 text-[10px] sm:inline-flex">
          Launch Devnet App
        </PremiumButtonLink>
      </div>
    </header>
  );
}
