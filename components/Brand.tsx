"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PremiumButtonLink } from "@/components/ui/PremiumButton";
import { cn } from "@/src/lib/utils";

export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-[rgba(255,32,32,0.34)] bg-black shadow-[0_0_22px_rgba(255,32,32,0.18)] transition duration-200 hover:border-[rgba(255,32,32,0.66)] hover:shadow-[0_0_28px_rgba(255,32,32,0.30)]",
        className,
      )}
    >
      <Image
        src="/brand/praetor-mark-red.png"
        alt="PRAETOR shield mark"
        width={44}
        height={44}
        priority
        className="h-full w-full object-cover"
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

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/demo", label: "Guided Walkthrough" },
] as const;

const tacticalSignals = [
  "All Systems Online",
  "Solana Devnet",
  "QuickNode RPC Connected",
  "Onchain Attestation Ready",
] as const;

function isActive(pathname: string | null, href: string) {
  if (href === "/") return pathname === "/";
  return pathname?.startsWith(href) ?? false;
}

function TacticalStatusStrip() {
  return (
    <div className="border-b border-[rgba(255,32,32,0.20)] border-t border-white/[0.06] bg-[rgba(3,3,3,0.88)] shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]">
      <div className="mx-auto flex h-9 max-w-7xl items-center gap-3 px-6">
        <div className="min-w-0 flex-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max items-center gap-2 font-mono text-[10px] font-black uppercase tracking-[0.22em] text-white/52">
            {tacticalSignals.map((signal, index) => (
              <span key={signal} className="inline-flex items-center gap-2 whitespace-nowrap">
                {index > 0 && (
                  <span className="text-[#FF2020]/55" aria-hidden="true">
                    •
                  </span>
                )}
                {index === 0 && (
                  <span className="h-1.5 w-1.5 rounded-full bg-[#5DE0BB] shadow-[0_0_12px_rgba(93,224,187,0.72)]" aria-hidden="true" />
                )}
                <span className={index === 0 ? "text-[#5DE0BB]" : undefined}>
                  {signal}
                </span>
              </span>
            ))}
          </div>
        </div>
        <Link
          href="/app"
          className="inline-flex h-6 shrink-0 items-center rounded-full border border-[rgba(255,32,32,0.48)] bg-[rgba(122,7,16,0.24)] px-3 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-[#FF8A8A] transition hover:border-[rgba(255,32,32,0.76)] hover:bg-[rgba(122,7,16,0.34)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(255,32,32,0.6)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
        >
          Wallet Required
        </Link>
      </div>
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const showTacticalStatusStrip =
    pathname === "/" || pathname === "/landing-cybersphere-v2";

  return (
    <header className="sticky top-0 z-50 bg-[rgba(5,5,5,0.92)] backdrop-blur-md">
      <div className="border-b border-[rgba(255,255,255,0.08)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(255,32,32,0.6)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
          >
            <LogoMark />
            <div className="leading-tight">
              <p className="text-sm font-black tracking-[0.24em] text-white">
                PRAETOR
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">
                praetores.com
              </p>
            </div>
          </Link>
          <nav className="hidden items-center gap-7 font-mono text-[11px] uppercase tracking-[0.20em] md:flex">
            {navLinks.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(255,32,32,0.6)]",
                    active
                      ? "text-[#FF2020]"
                      : "text-white/55 hover:text-white",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <PremiumButtonLink
            href="/app"
            variant="crimson"
            className="hidden sm:inline-flex"
          >
            Launch Devnet App
          </PremiumButtonLink>
        </div>
      </div>
      {showTacticalStatusStrip && <TacticalStatusStrip />}
    </header>
  );
}
