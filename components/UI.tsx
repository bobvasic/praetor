import type { ReactNode } from "react";
import { Badge as BaseBadge } from "@/src/components/ui/badge";
import { Card } from "@/src/components/ui/card";
import { SectionTitle } from "@/src/components/ui/section";

export { Badge } from "@/src/components/ui/badge";
export { Card } from "@/src/components/ui/card";
export { SectionTitle } from "@/src/components/ui/section";

export function MetricCard({ label, value, tone = "cyan" }: { label: string; value: string; tone?: "cyan" | "red" | "green" | "gold" }) {
  const valueTone = {
    cyan: "text-arctic",
    red: "text-red-100",
    green: "text-teal-100",
    gold: "text-amber-100",
  };

  return (
    <Card>
      <p className="font-mono text-xs uppercase tracking-[0.22em] text-titanium/[0.60]">{label}</p>
      <p className={`mt-4 text-4xl font-black ${valueTone[tone]}`}>{value}</p>
    </Card>
  );
}

export function LegacyBadge({ children, tone = "cyan" }: { children: ReactNode; tone?: "cyan" | "red" | "green" | "slate" | "gold" | "blue" }) {
  return <BaseBadge tone={tone}>{children}</BaseBadge>;
}
