import type { ReactNode } from "react";

export function Badge({
  children,
  tone = "cyan",
}: {
  children: ReactNode;
  tone?: "cyan" | "red" | "green" | "slate";
}) {
  const tones = {
    cyan: "border-cyan-300/30 bg-cyan-300/10 text-cyan-100",
    red: "border-red-400/30 bg-red-500/10 text-red-100",
    green: "border-emerald-300/30 bg-emerald-300/10 text-emerald-100",
    slate: "border-white/10 bg-white/5 text-slate-200",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${tones[tone]}`}
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
      className={`rounded-3xl border border-white/10 bg-white/[0.055] p-6 shadow-card backdrop-blur ${className}`}
    >
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
      <h2 className="mt-5 text-3xl font-black tracking-tight text-white md:text-5xl">
        {title}
      </h2>
      <p className="mt-5 text-lg leading-8 text-slate-300">{body}</p>
    </div>
  );
}
