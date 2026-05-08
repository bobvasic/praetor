import type { ReactNode } from "react";
import { Badge as BaseBadge } from "@/src/components/ui/badge";
import { Card, type CardProps } from "@/src/components/ui/card";
import { SectionTitle } from "@/src/components/ui/section";
import { cn } from "@/src/lib/utils";

export { Badge } from "@/src/components/ui/badge";
export { Card } from "@/src/components/ui/card";
export { SectionTitle } from "@/src/components/ui/section";

type MetricTone = "cyan" | "red" | "green" | "gold" | "blue";

type MetricCardProps = {
  label: string;
  value: string;
  tone?: MetricTone;
  icon?: ReactNode;
  description?: string;
  trend?: string;
  status?: string;
  className?: string;
  variant?: Extract<CardProps["variant"], "metric" | "incident" | "default">;
};

const metricToneStyles: Record<MetricTone, { value: string; icon: string; accent: string; status: string }> = {
  cyan: {
    value: "text-arctic",
    icon: "border-arctic/[0.24] bg-arctic/[0.10] text-arctic",
    accent: "bg-arctic/[0.20]",
    status: "text-arctic",
  },
  red: {
    value: "text-red-100",
    icon: "border-alert/[0.34] bg-alert/[0.12] text-alert",
    accent: "bg-alert/[0.22]",
    status: "text-red-100",
  },
  green: {
    value: "text-teal-100",
    icon: "border-secure/[0.34] bg-secure/[0.14] text-teal-100",
    accent: "bg-secure/[0.22]",
    status: "text-teal-100",
  },
  gold: {
    value: "text-amber-100",
    icon: "border-gold/[0.34] bg-gold/[0.12] text-amber-100",
    accent: "bg-gold/[0.22]",
    status: "text-amber-100",
  },
  blue: {
    value: "text-blue-100",
    icon: "border-sovereign/[0.34] bg-sovereign/[0.14] text-blue-100",
    accent: "bg-sovereign/[0.22]",
    status: "text-blue-100",
  },
};

export function MetricCard({ label, value, tone = "cyan", icon, description, trend, status, className, variant = "metric" }: MetricCardProps) {
  const toneStyle = metricToneStyles[tone];

  return (
    <Card variant={variant} className={cn("min-h-44", className)}>
      <div className="flex h-full flex-col justify-between gap-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-titanium/[0.60]">{label}</p>
            {description && <p className="mt-3 text-sm leading-6 text-titanium/[0.68]">{description}</p>}
          </div>
          {icon && <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border", toneStyle.icon)}>{icon}</div>}
        </div>
        <div>
          <div className="flex items-end gap-3">
            <p className={cn("text-5xl font-black tracking-[-0.06em] leading-none", toneStyle.value)}>{value}</p>
            <span className={cn("mb-1 h-2 w-2 rounded-full", toneStyle.accent)} />
          </div>
          {(trend || status) && (
            <div className="mt-4 flex flex-wrap items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em]">
              {trend && <span className={toneStyle.status}>{trend}</span>}
              {trend && status && <span className="text-titanium/[0.32]">/</span>}
              {status && <span className="text-titanium/[0.58]">{status}</span>}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

export function LegacyBadge({ children, tone = "cyan" }: { children: ReactNode; tone?: "cyan" | "red" | "green" | "slate" | "gold" | "blue" }) {
  return <BaseBadge tone={tone}>{children}</BaseBadge>;
}
