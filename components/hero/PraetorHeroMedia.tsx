"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const PraetorHeroScene = dynamic(
  () => import("@/components/hero/PraetorHeroScene").then((mod) => mod.PraetorHeroScene),
  {
    ssr: false,
    loading: () => <div className="h-full min-h-[420px] w-full rounded-[2rem] bg-[radial-gradient(circle_at_center,rgba(152,233,255,0.12),rgba(0,0,0,0.9)_64%)]" />,
  },
);

export function PraetorHeroMedia() {
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  return (
    <div className="relative min-h-[520px] overflow-hidden rounded-[2.25rem] border border-white/10 bg-black shadow-[0_34px_130px_rgba(0,0,0,0.54)]">
      {!videoReady || videoFailed ? (
        <div className="absolute inset-0">
          <PraetorHeroScene className="h-full min-h-[520px] rounded-[2.25rem] border-0" />
        </div>
      ) : null}
      {!videoFailed ? (
        <video
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${videoReady ? "opacity-100" : "opacity-0"}`}
          src="/brand/praetor-hero.webm"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-label="Praetor cinematic hero animation"
          onCanPlay={() => setVideoReady(true)}
          onError={() => setVideoFailed(true)}
        />
      ) : null}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.74),rgba(0,0,0,0.22)_42%,rgba(0,0,0,0.38)),radial-gradient(circle_at_58%_32%,rgba(231,184,93,0.16),transparent_34%),linear-gradient(180deg,rgba(0,0,0,0.12),rgba(0,0,0,0.58))]" />
      <div className="pointer-events-none absolute bottom-5 left-5 right-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/35 px-4 py-3 backdrop-blur-xl">
        <span className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[var(--praetor-cyan)]">Verified data streams</span>
        <span className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[var(--praetor-orange-soft)]">Threat vectors intercepted</span>
      </div>
    </div>
  );
}
