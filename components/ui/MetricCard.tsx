import type { ReactNode } from "react";
import { Activity } from "lucide-react";
import { GlassPanel } from "./GlassPanel";
import { cn } from "@/src/lib/utils";

// Tone palette: matte graphite icon plate + tone-specific value text only.
// Cyan reserved for verified/online status. Crimson for risk/critical/blocked.
// Legacy tones (orange, gold) re-pointed to crimson to keep compatibility.
type Tone = "cyan" | "orange" | "green" | "red" | "gold" | "crimson" | "white";

const valueTones: Record<Tone, string> = {
  cyan: "text-[#7BD9F2]",
  white: "text-white",
  green: "text-[#5DE0BB]",
  red: "text-[#FF6B6B]",
  crimson: "text-[#FF6B6B]",
  orange: "text-[#FF6B6B]",
  gold: "text-[#FF6B6B]",
};

export function MetricCard({
  label,
  value,
  status,
  description,
  tone = "white",
  icon,
}: {
  label: string;
  value: ReactNode;
  status?: string;
  description?: string;
  tone?: Tone;
  icon?: ReactNode;
}) {
  return (
    <GlassPanel className="h-full rounded-xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-white/55">
            {label}
          </p>
          <p
            className={cn(
              "mt-3 text-3xl font-black tracking-[-0.03em] tabular-nums",
              valueTones[tone],
            )}
          >
            {value}
          </p>
        </div>
        <span className="rounded-md border border-white/10 bg-[#101010] p-2.5 text-white/70">
          {icon ?? <Activity className="h-4 w-4" aria-hidden />}
        </span>
      </div>
      {status && (
        <p className="mt-4 font-mono text-[10px] font-black uppercase tracking-[0.20em] text-white/60">
          {status}
        </p>
      )}
      {description && (
        <p className="mt-2 text-sm leading-6 text-white/68">{description}</p>
      )}
    </GlassPanel>
  );
}
