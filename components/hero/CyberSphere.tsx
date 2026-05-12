"use client";

import { useReducedMotion } from "framer-motion";
import {
  Activity,
  Ban,
  KeyRound,
  Landmark,
  Radar,
  ShieldCheck,
  TrendingUp,
  Users,
  Vault,
  type LucideIcon,
} from "lucide-react";

// CyberSphere — the animated red threat-intelligence sphere on the landing
// hero. Built from 4 stacked <svg> layers (static rings + connectors,
// drifting particle field, rotating perimeter dust + nodes, and a rotating
// scanning sweep) so each layer can spin around its own centre via CSS
// transform without affecting the others. GPU-friendly (transform + opacity
// only) and reduced-motion safe (all CSS rotations are gated by the
// .cs-rotate-* classes which respect prefers-reduced-motion in globals.css;
// the SMIL <animate> on the nodes is gated by the React useReducedMotion
// hook so it can be dropped entirely for that audience).

const VIEW = 600;
const CENTER = VIEW / 2;
const ORB_RADIUS = 230;
const PERIMETER_NODES = 8;

const CORNERS: Array<{
  label: string;
  icon: LucideIcon;
  // angle on the orb (degrees, SVG convention: 0 = east, 90 = south)
  angleDeg: number;
  // tailwind positioning for the HTML hex-label overlay
  position: string;
  // alignment of the label below the hex
  align: string;
}> = [
  { label: "Treasury",          icon: Vault,    angleDeg: 225, position: "left-1 top-1",      align: "items-start" },
  { label: "Signers",           icon: Users,    angleDeg: 315, position: "right-1 top-1",     align: "items-end"   },
  { label: "Upgrade Authority", icon: KeyRound, angleDeg: 135, position: "left-1 bottom-1",   align: "items-start" },
  { label: "Governance",        icon: Landmark, angleDeg: 45,  position: "right-1 bottom-1",  align: "items-end"   },
];

function polar(angleDeg: number, radius: number) {
  const a = (angleDeg * Math.PI) / 180;
  return { x: CENTER + Math.cos(a) * radius, y: CENTER + Math.sin(a) * radius };
}

// Deterministic pseudo-random fields (so SSR and client hydration match).
const interiorField = Array.from({ length: 70 }, (_, i) => {
  const a = (i * 137.508 * Math.PI) / 180; // golden-angle distribution
  const r = 60 + ((i * 19) % 165);
  return {
    cx: CENTER + Math.cos(a) * r,
    cy: CENTER + Math.sin(a) * r,
    r: 0.5 + ((i * 7) % 30) / 14,
    opacity: 0.14 + ((i * 11) % 45) / 100,
  };
});

const perimeterDust = Array.from({ length: 130 }, (_, i) => {
  const angle = (i / 130) * 360;
  const spread = ((i * 7) % 16) - 8; // ±8 user units around the ring
  const a = (angle * Math.PI) / 180;
  const r = ORB_RADIUS + spread;
  return {
    cx: CENTER + Math.cos(a) * r,
    cy: CENTER + Math.sin(a) * r,
    r: 0.5 + ((i * 3) % 9) / 9,
    opacity: 0.30 + ((i * 13) % 50) / 100,
  };
});

const perimeterNodes = Array.from({ length: PERIMETER_NODES }, (_, i) => {
  const angle = (360 / PERIMETER_NODES) * i;
  return { ...polar(angle, ORB_RADIUS), angle, i };
});

export function CyberSphere() {
  const reduced = useReducedMotion();

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[560px]">
      {/* Atmospheric outer glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[-12%] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,32,32,0.28),rgba(255,32,32,0.06)_45%,transparent_70%)] blur-[42px]"
      />

      {/* Layer 1 — static rings, inner radial fill, dashed connectors. */}
      <svg
        viewBox={`0 0 ${VIEW} ${VIEW}`}
        className="absolute inset-0 h-full w-full"
        role="img"
        aria-label="Animated red threat-intelligence sphere protecting DemoDAO Treasury"
      >
        <defs>
          <radialGradient id="cs-orb-fill" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,32,32,0.20)" />
            <stop offset="55%" stopColor="rgba(255,32,32,0.04)" />
            <stop offset="100%" stopColor="rgba(255,32,32,0)" />
          </radialGradient>
          <filter id="cs-ring-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle cx={CENTER} cy={CENTER} r={ORB_RADIUS} fill="url(#cs-orb-fill)" />

        {/* Faint outer ring */}
        <circle cx={CENTER} cy={CENTER} r={ORB_RADIUS + 38} stroke="rgba(255,32,32,0.10)" strokeWidth="1" fill="none" />

        {/* Main bright ring */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={ORB_RADIUS}
          stroke="rgba(255,32,32,0.62)"
          strokeWidth="1.4"
          fill="none"
          filter="url(#cs-ring-glow)"
        />

        {/* Inner dashed ring */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={162}
          stroke="rgba(255,32,32,0.22)"
          strokeWidth="1"
          fill="none"
          strokeDasharray="3 8"
        />

        {/* Innermost faint ring */}
        <circle cx={CENTER} cy={CENTER} r={95} stroke="rgba(255,32,32,0.10)" strokeWidth="1" fill="none" />

        {/* Dashed connector lines from perimeter to the four diagonals */}
        <g>
          {CORNERS.map((c) => {
            const start = polar(c.angleDeg, ORB_RADIUS);
            const end = polar(c.angleDeg, ORB_RADIUS + 62);
            return (
              <line
                key={c.label}
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke="rgba(255,255,255,0.22)"
                strokeWidth="1"
                strokeDasharray="2 5"
              />
            );
          })}
        </g>
      </svg>

      {/* Layer 2 — interior particle field, very slow reverse drift. */}
      <svg
        viewBox={`0 0 ${VIEW} ${VIEW}`}
        className={`absolute inset-0 h-full w-full ${reduced ? "" : "cs-rotate-vslow"}`}
      >
        {interiorField.map((p, i) => (
          <circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill="#FF2020" opacity={p.opacity} />
        ))}
      </svg>

      {/* Layer 3 — scanning sweep (rotating wedge with red gradient). */}
      {!reduced && (
        <svg viewBox={`0 0 ${VIEW} ${VIEW}`} className="absolute inset-0 h-full w-full cs-rotate-mid">
          <defs>
            <linearGradient id="cs-sweep" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="rgba(255,32,32,0)" />
              <stop offset="75%" stopColor="rgba(255,32,32,0)" />
              <stop offset="100%" stopColor="rgba(255,32,32,0.55)" />
            </linearGradient>
          </defs>
          <path
            d={`M ${CENTER} ${CENTER} L ${CENTER + ORB_RADIUS} ${CENTER} A ${ORB_RADIUS} ${ORB_RADIUS} 0 0 0 ${
              CENTER + Math.cos(-Math.PI / 3) * ORB_RADIUS
            } ${CENTER + Math.sin(-Math.PI / 3) * ORB_RADIUS} Z`}
            fill="url(#cs-sweep)"
            opacity="0.45"
          />
        </svg>
      )}

      {/* Layer 4 — perimeter dust + bright nodes, slow forward rotation. */}
      <svg
        viewBox={`0 0 ${VIEW} ${VIEW}`}
        className={`absolute inset-0 h-full w-full ${reduced ? "" : "cs-rotate-slow"}`}
      >
        <defs>
          <filter id="cs-node-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Dense dust along the ring — gives the 'string of pearls' feel */}
        {perimeterDust.map((p, i) => (
          <circle key={`d-${i}`} cx={p.cx} cy={p.cy} r={p.r} fill="#FF2020" opacity={p.opacity} />
        ))}

        {/* Eight bright primary nodes, pulsing */}
        {perimeterNodes.map((n) => (
          <g key={n.i}>
            <circle cx={n.x} cy={n.y} r="14" fill="rgba(255,32,32,0.32)" filter="url(#cs-node-glow)" />
            <circle cx={n.x} cy={n.y} r="6" fill="#FF2020" filter="url(#cs-node-glow)">
              {!reduced && (
                <animate
                  attributeName="r"
                  values="5;7.2;5"
                  dur="3.2s"
                  repeatCount="indefinite"
                  begin={`${n.i * 0.32}s`}
                />
              )}
            </circle>
            <circle cx={n.x} cy={n.y} r="1.6" fill="#ffffff" />
          </g>
        ))}
      </svg>

      {/* Center copy overlay (static HTML, perfectly centred) */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        <p className="text-xl font-black leading-tight tracking-[-0.02em] text-white md:text-2xl">DemoDAO</p>
        <p className="text-xl font-black leading-tight tracking-[-0.02em] text-white md:text-2xl">Treasury</p>
        <p className="mt-3 font-mono text-[10px] font-black uppercase tracking-[0.30em] text-[#FF2020]">
          Protected
        </p>
      </div>

      {/* Corner hex labels — hidden on phones (orb stands alone there) */}
      {CORNERS.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.label}
            className={`absolute hidden flex-col gap-1.5 sm:flex ${c.position} ${c.align}`}
          >
            <span className="relative grid h-12 w-12 place-items-center">
              <svg viewBox="0 0 24 24" className="absolute inset-0 h-12 w-12">
                <polygon
                  points="12,2 22,7 22,17 12,22 2,17 2,7"
                  fill="#0A0A0A"
                  stroke="rgba(255,32,32,0.55)"
                  strokeWidth="0.9"
                />
              </svg>
              <Icon className="relative h-4 w-4 text-white/86" aria-hidden />
            </span>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-white/82">
              {c.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}

// Right-of-orb status feed: compact mono log echoing the live attestation
// flow. Rendered as a static block; the wider hero shell handles responsive
// stacking. Hidden on small screens to keep the orb breathing room.
const FEED_ROWS: Array<{ icon: LucideIcon; label: string; value?: string; valueTone?: string }> = [
  { icon: Radar,       label: "privileged_operation_detected" },
  { icon: TrendingUp,  label: "risk_score",  value: "91",       valueTone: "text-[#FF6B6B]" },
  { icon: Ban,         label: "decision",    value: "block",    valueTone: "text-[#FF6B6B]" },
  { icon: ShieldCheck, label: "attestation", value: "recorded", valueTone: "text-[#5DE0BB]" },
  { icon: Activity,    label: "anchor_program", value: "live",  valueTone: "text-[#5DE0BB]" },
];

export function CyberStatusFeed() {
  return (
    <div className="hidden flex-col gap-3 lg:flex">
      {FEED_ROWS.map((row) => {
        const Icon = row.icon;
        return (
          <div key={row.label} className="flex items-center gap-2.5">
            <span className="grid h-6 w-6 place-items-center rounded-md border border-white/10 bg-[#0A0A0A] text-[#FF6B6B]">
              <Icon className="h-3 w-3" aria-hidden />
            </span>
            <span className="font-mono text-[11px] text-white/72">
              {row.label}
              {row.value && (
                <>
                  : <span className={`font-bold ${row.valueTone ?? "text-white"}`}>{row.value}</span>
                </>
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
}
