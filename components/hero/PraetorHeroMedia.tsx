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
          src="/media/praetor-city.webm"
          poster="/media/praetor-city-poster.png"
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
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.10),rgba(0,0,0,0.55))]" />
      <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 rounded-md border border-white/10 bg-[rgba(5,5,5,0.7)] px-4 py-2.5">
        <span className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-white/70">Privileged-action perimeter</span>
        <span className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#FF6B6B]">Detect → Attest → Challenge → Block</span>
      </div>
    </div>
  );
}
