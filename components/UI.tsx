import type { ReactNode } from "react";
import { Activity } from "lucide-react";
import { Badge as BaseBadge } from "@/src/components/ui/badge";
import { Card } from "@/src/components/ui/card";

export { Badge } from "@/src/components/ui/badge";
export { Card } from "@/src/components/ui/card";
export { Container, Section, SectionTitle } from "@/src/components/ui/section";

export function MetricCard({
  label,
  value,
  tone = "cyan",
  status,
  description,
}: {
  label: string;
  value: string;
  tone?: "cyan" | "red" | "green" | "gold";
  status?: string;
  description?: string;
}) {
  const valueTone = {
    cyan: "text-arctic",
    red: "text-red-100 risk-glow",
    green: "text-teal-100",
    gold: "text-amber-100",
  };
  const ringTone = {
    cyan: "border-arctic/30 bg-arctic/10 text-arctic",
    red: "border-alert/35 bg-alert/10 text-red-100",
    green: "border-secure/35 bg-secure/10 text-teal-100",
    gold: "border-gold/40 bg-gold/10 text-amber-100",
  };

  return (
    <Card variant="metric" className="group h-full p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-titanium/[0.60]">
            {label}
          </p>
          <p className={`mt-4 text-4xl font-black ${valueTone[tone]}`}>{value}</p>
        </div>
        <span className={`rounded-xl border p-2 ${ringTone[tone]}`}>
          <Activity className="h-4 w-4" aria-hidden />
        </span>
      </div>
      {status && (
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-titanium/[0.58]">
          {status}
        </p>
      )}
      {description && (
        <p className="mt-2 text-sm leading-6 text-titanium/[0.68]">{description}</p>
      )}
    </Card>
  );
}

export function LegacyBadge({
  children,
  tone = "cyan",
}: {
  children: ReactNode;
  tone?: "cyan" | "red" | "green" | "slate" | "gold" | "blue";
}) {
  return <BaseBadge tone={tone}>{children}</BaseBadge>;
}
