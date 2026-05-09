import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/src/components/ui/button";

export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/25 bg-white/[0.08] shadow-[0_18px_48px_rgba(255,130,0,0.16)] backdrop-blur-xl transition duration-200 hover:border-[var(--praetor-orange)] ${className}`}
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
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[rgba(11,18,32,0.68)] backdrop-blur-2xl supports-[backdrop-filter]:bg-[rgba(11,18,32,0.58)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arctic/70 focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian">
          <LogoMark />
          <div>
            <p className="text-base font-black tracking-[0.24em] text-white">
              PRAETOR
            </p>
            <p className="text-xs text-[var(--praetor-muted)]">praetores.com</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-7 font-mono text-xs uppercase tracking-[0.18em] text-[var(--praetor-muted)] md:flex">
          <Link className="rounded-md transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arctic/70" href="/">
            Praetor
          </Link>
          <Link className="rounded-md text-[var(--praetor-orange-soft)] transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arctic/70" href="/app">
            Launch Devnet App
          </Link>
          <Link className="rounded-md transition hover:text-[var(--praetor-orange-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arctic/70" href="/dashboard">
            Dashboard
          </Link>
          <Link className="rounded-md transition hover:text-[var(--praetor-orange-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arctic/70" href="/demo">
            Guided Walkthrough
          </Link>
        </nav>
        <ButtonLink href="/app" variant="command" size="sm" className="hidden sm:inline-flex">
          Launch Devnet App
        </ButtonLink>
      </div>
    </header>
  );
}
