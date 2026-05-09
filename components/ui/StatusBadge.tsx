import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/src/lib/utils";

type Tone = "online" | "devnet" | "orange" | "cyan" | "red" | "gold" | "muted";
const tones: Record<Tone, string> = {
  online: "border-[rgba(28,142,134,0.58)] bg-[linear-gradient(135deg,rgba(28,142,134,0.22),rgba(9,26,42,0.68))] text-teal-100 shadow-[0_0_34px_rgba(28,142,134,0.13)]",
  devnet: "border-[rgba(152,233,255,0.5)] bg-[linear-gradient(135deg,rgba(152,233,255,0.16),rgba(16,34,58,0.74))] text-[var(--praetor-cyan)] shadow-[0_0_34px_rgba(56,189,248,0.12)]",
  orange: "border-[rgba(255,130,0,0.58)] bg-[linear-gradient(135deg,rgba(255,130,0,0.20),rgba(54,31,12,0.68))] text-[var(--praetor-orange-soft)] shadow-[0_0_34px_rgba(255,130,0,0.13)]",
  cyan: "border-[rgba(152,233,255,0.5)] bg-[linear-gradient(135deg,rgba(152,233,255,0.16),rgba(16,34,58,0.74))] text-[var(--praetor-cyan)] shadow-[0_0_34px_rgba(56,189,248,0.12)]",
  red: "border-[rgba(255,91,110,0.54)] bg-[linear-gradient(135deg,rgba(255,91,110,0.16),rgba(60,14,24,0.70))] text-red-100 shadow-[0_0_34px_rgba(255,91,110,0.13)]",
  gold: "border-[rgba(199,161,91,0.55)] bg-[linear-gradient(135deg,rgba(199,161,91,0.18),rgba(52,37,13,0.68))] text-amber-100 shadow-[0_0_34px_rgba(199,161,91,0.12)]",
  muted: "border-white/15 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] text-[var(--praetor-muted)]",
};

export function StatusBadge({ children, tone = "cyan", pulse = false, className, ...props }: HTMLAttributes<HTMLSpanElement> & { tone?: Tone; pulse?: boolean; children: ReactNode }) {
  return (
    <span className={cn("relative inline-flex items-center gap-2 overflow-hidden rounded-[999px] border px-3.5 py-1.5 font-mono text-[11px] font-black uppercase tracking-[0.22em] shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-xl", tones[tone], className)} {...props}>
      <span className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white/[0.16] to-transparent" />
      {pulse && <span className="relative z-10 h-2 w-2 rounded-full bg-current shadow-[0_0_18px_currentColor] animate-pulse" />}
      <span className="relative z-10">{children}</span>
    </span>
  );
}
