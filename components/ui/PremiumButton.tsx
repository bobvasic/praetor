import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/src/lib/utils";

// Tactical buttons: flat crimson or graphite. No multicolor gradient, no
// orange, no decorative blue. Sharp geometry (rounded-md). Subtle hover only.
type Variant = "crimson" | "orange" | "glass" | "danger" | "ghost";

const variants: Record<Variant, string> = {
  crimson:
    "border-[#FF2020] bg-[#E10600] text-white hover:bg-[#FF2020]",
  // Legacy alias → crimson
  orange:
    "border-[#FF2020] bg-[#E10600] text-white hover:bg-[#FF2020]",
  glass:
    "border-white/15 bg-[#0A0A0A] text-white hover:border-[rgba(255,32,32,0.45)] hover:bg-[#101010]",
  danger:
    "border-[rgba(255,32,32,0.55)] bg-[#7A0710] text-white hover:bg-[#990000]",
  ghost:
    "border-transparent text-white/65 hover:bg-white/[0.05] hover:text-white",
};

const base =
  "inline-flex items-center justify-center rounded-md border px-5 py-2.5 font-mono text-[11px] font-black uppercase tracking-[0.20em] transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(255,32,32,0.6)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] disabled:pointer-events-none disabled:opacity-45";

export function PremiumButton({
  className,
  variant = "crimson",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button className={cn(base, variants[variant], className)} {...props} />;
}

export function PremiumButtonLink({
  className,
  variant = "crimson",
  href,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  href: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={cn(base, variants[variant], className)} {...props}>
      {children}
    </Link>
  );
}
