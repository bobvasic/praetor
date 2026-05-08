import Link from "next/link";

export function LogoMark() {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-300/10 shadow-glow">
      <span className="text-lg font-black text-cyanfire">P</span>
    </div>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <LogoMark />
          <div>
            <p className="text-base font-bold tracking-wide text-white">
              Praetor
            </p>
            <p className="text-xs text-slate-400">praetores.com</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          <Link className="hover:text-cyanfire" href="/demo">
            Demo
          </Link>
          <Link className="hover:text-cyanfire" href="/dashboard">
            Dashboard
          </Link>
          <a className="hover:text-cyanfire" href="/#flow">
            Flow
          </a>
        </nav>
        <Link
          href="/demo"
          className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/20"
        >
          Launch demo
        </Link>
      </div>
    </header>
  );
}
