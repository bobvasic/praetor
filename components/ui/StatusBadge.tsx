import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/src/lib/utils";

// Tone palette: matte graphite surface + tone-specific border/text only.
// Cyan/teal are reserved for online/connected/verified status badges per the
// Praetor visual brief. Crimson is the primary accent. No orange/amber.
type Tone =
  | "online"
  | "devnet"
  | "crimson"
  | "orange" // legacy alias → crimson
  | "cyan"
  | "red"
  | "gold" // legacy alias → crimson
  | "muted";

const tones: Record<Tone, string> = {
  online:
    "border-[rgba(28,201,160,0.45)] bg-[#0A0A0A] text-[#5DE0BB]",
  devnet:
    "border-[rgba(94,227,255,0.40)] bg-[#0A0A0A] text-[#7BD9F2]",
  cyan:
    "border-[rgba(94,227,255,0.40)] bg-[#0A0A0A] text-[#7BD9F2]",
  crimson:
    "border-[rgba(255,32,32,0.45)] bg-[#0A0A0A] text-[#FF6B6B]",
  orange:
    "border-[rgba(255,32,32,0.45)] bg-[#0A0A0A] text-[#FF6B6B]",
  red:
    "border-[rgba(255,32,32,0.55)] bg-[rgba(122,7,16,0.18)] text-[#FF8888]",
  gold:
    "border-[rgba(255,32,32,0.45)] bg-[#0A0A0A] text-[#FF6B6B]",
  muted:
    "border-white/12 bg-[#0A0A0A] text-white/60",
};

export function StatusBadge({
  children,
  tone = "cyan",
  pulse = false,
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  tone?: Tone;
  pulse?: boolean;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "relative inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[10px] font-black uppercase tracking-[0.22em]",
        tones[tone],
        className,
      )}
      {...props}
    >
      {pulse && (
        <span
          className="relative z-10 inline-block h-1.5 w-1.5 rounded-full bg-current animate-pulse"
          aria-hidden
        />
      )}
      <span className="relative z-10">{children}</span>
    </span>
  );
}
