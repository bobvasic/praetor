import Image from "next/image";
import Link from "next/link";

export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`relative flex h-11 w-11 items-center justify-center rounded-xl border border-arctic/[0.25] bg-graphite/[0.80] shadow-glow ${className}`}
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
        <Link href="/" className="flex items-center gap-3">
          <LogoMark />
          <div>
            <p className="text-base font-black tracking-[0.24em] text-white">
              PRAETOR
            </p>
            <p className="text-xs text-titanium/[0.62]">praetores.com</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-7 font-mono text-xs uppercase tracking-[0.18em] text-titanium/[0.72] md:flex">
          <Link className="transition hover:text-arctic" href="/demo">
            Demo
          </Link>
          <Link className="transition hover:text-arctic" href="/dashboard">
            Dashboard
          </Link>
          <a className="transition hover:text-arctic" href="/#flow">
            Flow
          </a>
        </nav>
        <Link
          href="/demo"
          className="rounded-md border border-arctic/[0.35] bg-arctic/[0.10] px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.16em] text-arctic transition hover:border-arctic/[0.60] hover:bg-arctic/[0.15]"
        >
          Launch demo
        </Link>
      </div>
    </header>
  );
}
