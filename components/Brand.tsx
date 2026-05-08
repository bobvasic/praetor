import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/src/components/ui/button";

export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`relative flex h-11 w-11 items-center justify-center rounded-xl border border-arctic/[0.25] bg-graphite/[0.80] shadow-glow transition duration-200 ${className}`}
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
    <header className="sticky top-0 z-50 border-b border-titanium/[0.10] bg-obsidian/[0.80] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arctic/70 focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian">
          <LogoMark />
          <div>
            <p className="text-base font-black tracking-[0.24em] text-white">
              PRAETOR
            </p>
            <p className="text-xs text-titanium/[0.62]">praetores.com</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-7 font-mono text-xs uppercase tracking-[0.18em] text-titanium/[0.72] md:flex">
          <Link className="rounded-md transition hover:text-arctic focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arctic/70" href="/demo">
            Demo
          </Link>
          <Link className="rounded-md transition hover:text-arctic focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arctic/70" href="/dashboard">
            Dashboard
          </Link>
          <a className="rounded-md transition hover:text-arctic focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arctic/70" href="/#flow">
            Flow
          </a>
        </nav>
        <ButtonLink href="/demo" variant="outline" size="sm">
          Launch demo
        </ButtonLink>
      </div>
    </header>
  );
}
