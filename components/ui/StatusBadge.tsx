import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/src/lib/utils";

type Tone = "online" | "devnet" | "orange" | "cyan" | "red" | "gold" | "muted";
const tones: Record<Tone, string> = {
  online: "border-[rgba(28,142,134,0.55)] bg-[rgba(28,142,134,0.16)] text-teal-100",
  devnet: "border-[rgba(152,233,255,0.48)] bg-[rgba(152,233,255,0.12)] text-[var(--praetor-cyan)]",
  orange: "border-[rgba(255,130,0,0.55)] bg-[rgba(255,130,0,0.14)] text-[var(--praetor-orange-soft)]",
  cyan: "border-[rgba(152,233,255,0.48)] bg-[rgba(152,233,255,0.12)] text-[var(--praetor-cyan)]",
  red: "border-[rgba(255,91,110,0.52)] bg-[rgba(255,91,110,0.13)] text-red-100",
  gold: "border-[rgba(199,161,91,0.52)] bg-[rgba(199,161,91,0.13)] text-amber-100",
  muted: "border-white/15 bg-white/[0.06] text-[var(--praetor-muted)]",
};

export function StatusBadge({ children, tone = "cyan", pulse = false, className, ...props }: HTMLAttributes<HTMLSpanElement> & { tone?: Tone; pulse?: boolean; children: ReactNode }) {
  return (
    <span className={cn("inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-[11px] font-black uppercase tracking-[0.22em] shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-xl", tones[tone], className)} {...props}>
      {pulse && <span className="h-2 w-2 rounded-full bg-current shadow-[0_0_18px_currentColor] animate-pulse" />}
      {children}
    </span>
  );
}
