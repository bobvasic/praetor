import type { ReactNode } from "react";
import { Activity } from "lucide-react";
import { GlassPanel } from "./GlassPanel";
import { cn } from "@/src/lib/utils";

type Tone = "cyan" | "orange" | "green" | "red" | "gold";
const colors: Record<Tone, string> = { cyan: "text-[var(--praetor-cyan)]", orange: "text-[var(--praetor-orange-soft)]", green: "text-teal-100", red: "text-red-100", gold: "text-amber-100" };

export function MetricCard({ label, value, status, description, tone = "cyan", icon }: { label: string; value: ReactNode; status?: string; description?: string; tone?: Tone; icon?: ReactNode }) {
  return (
    <GlassPanel className="h-full p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs font-black uppercase tracking-[0.22em] text-[var(--praetor-muted)]">{label}</p>
          <p className={cn("mt-4 text-4xl font-black tracking-[-0.04em]", colors[tone])}>{value}</p>
        </div>
        <span className="rounded-2xl border border-white/20 bg-white/[0.08] p-3 text-[var(--praetor-cyan)]">{icon ?? <Activity className="h-5 w-5" aria-hidden />}</span>
      </div>
      {status && <p className="mt-4 font-mono text-[10px] font-black uppercase tracking-[0.2em] text-white/60">{status}</p>}
      {description && <p className="mt-2 text-sm leading-6 text-[var(--praetor-muted)]">{description}</p>}
    </GlassPanel>
  );
}
