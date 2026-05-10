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
        "relative flex h-11 w-11 items-center justify-center rounded-xl border border-[rgba(255,32,32,0.28)] bg-[#0A0A0A] transition duration-200 hover:border-[rgba(255,32,32,0.55)]",
        className,
      )}
    >
      <Image
        src="/brand/praetor-mark.svg"
        alt="PRAETOR shield mark"
        width={32}
        height={32}
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

const navLinks = [
  { href: "/", label: "Praetor" },
  { href: "/app", label: "Launch Devnet App" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/demo", label: "Guided Walkthrough" },
] as const;

function isActive(pathname: string | null, href: string) {
  if (href === "/") return pathname === "/";
  return pathname?.startsWith(href) ?? false;
}

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(255,255,255,0.08)] bg-[rgba(5,5,5,0.92)] backdrop-blur-md">
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
    </header>
  );
}
