import type { ReactNode } from "react";

export function Badge({
  children,
  tone = "cyan",
}: {
  children: ReactNode;
  tone?: "cyan" | "red" | "green" | "slate" | "gold" | "blue";
}) {
  const tones = {
    cyan: "border-arctic/[0.35] bg-arctic/[0.10] text-arctic",
    red: "border-alert/[0.35] bg-alert/[0.10] text-red-100",
    green: "border-secure/[0.45] bg-secure/[0.15] text-teal-100",
    slate: "border-titanium/[0.15] bg-titanium/[0.05] text-titanium",
    gold: "border-gold/[0.45] bg-gold/[0.10] text-amber-100",
    blue: "border-sovereign/[0.45] bg-sovereign/[0.15] text-blue-100",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-titanium/[0.10] bg-panel-gradient p-6 shadow-card backdrop-blur ${className}`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-arctic/[0.45] to-transparent" />
      {children}
    </div>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <Badge>{eyebrow}</Badge>
      <h2 className="mt-5 text-3xl font-black tracking-[-0.035em] text-white md:text-5xl">
        {title}
      </h2>
      <p className="mt-5 text-lg leading-8 text-titanium/[0.82]">{body}</p>
    </div>
  );
}

export function MetricCard({
  label,
  value,
  tone = "cyan",
}: {
  label: string;
  value: string;
  tone?: "cyan" | "red" | "green" | "gold";
}) {
  const valueTone = {
    cyan: "text-arctic",
    red: "text-red-100",
    green: "text-teal-100",
    gold: "text-amber-100",
  };

  return (
    <Card>
      <p className="font-mono text-xs uppercase tracking-[0.22em] text-titanium/[0.60]">
        {label}
      </p>
      <p className={`mt-4 text-4xl font-black ${valueTone[tone]}`}>{value}</p>
    </Card>
  );
}
