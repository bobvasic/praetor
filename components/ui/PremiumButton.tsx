import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/src/lib/utils";

type Variant = "orange" | "glass" | "danger" | "ghost";
const variants: Record<Variant, string> = {
  orange: "border-[rgba(255,154,31,0.75)] bg-[linear-gradient(135deg,var(--praetor-orange),var(--praetor-orange-soft))] text-[var(--praetor-deep-navy)] shadow-[0_20px_70px_rgba(255,130,0,0.28)] hover:shadow-[0_26px_90px_rgba(255,130,0,0.38)]",
  glass: "border-white/25 bg-white/[0.08] text-white shadow-[0_18px_60px_rgba(0,0,0,0.24)] hover:border-[rgba(152,233,255,0.55)] hover:bg-white/[0.13]",
  danger: "border-[rgba(255,91,110,0.55)] bg-[linear-gradient(135deg,rgba(255,91,110,0.96),rgba(121,30,48,0.92))] text-white shadow-[0_18px_60px_rgba(255,91,110,0.20)]",
  ghost: "border-transparent text-[var(--praetor-muted)] hover:bg-white/[0.07] hover:text-white",
};
const base = "inline-flex items-center justify-center rounded-2xl border px-6 py-3.5 font-mono text-xs font-black uppercase tracking-[0.18em] transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--praetor-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--praetor-deep-navy)] disabled:pointer-events-none disabled:opacity-45 motion-safe:hover:-translate-y-0.5";

export function PremiumButton({ className, variant = "orange", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button className={cn(base, variants[variant], className)} {...props} />;
}

export function PremiumButtonLink({ className, variant = "orange", href, children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant; href: string; children: ReactNode }) {
  return <Link href={href} className={cn(base, variants[variant], className)} {...props}>{children}</Link>;
}
