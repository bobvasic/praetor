"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";
import { cn } from "@/src/lib/utils";

type Mode = "home" | "dashboard" | "demo" | "default";

const nodes = [
  [6, 24], [17, 15], [29, 31], [41, 18], [55, 29], [69, 14], [84, 25], [94, 17],
  [10, 52], [24, 62], [39, 47], [53, 58], [67, 43], [81, 59], [93, 49],
  [7, 80], [22, 88], [37, 75], [51, 90], [65, 77], [79, 89], [92, 76],
] as const;

const lines = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7],
  [0, 8], [2, 10], [4, 12], [6, 14], [8, 9], [9, 10], [10, 11], [11, 12],
  [12, 13], [13, 14], [8, 15], [9, 17], [11, 18], [12, 19], [13, 20],
  [14, 21], [15, 16], [16, 17], [17, 18], [18, 19], [19, 20], [20, 21],
  [1, 10], [3, 11], [5, 13], [10, 17], [12, 20],
] as const;

const particles = Array.from({ length: 84 }, (_, index) => ({
  id: index,
  x: `${(index * 37 + 9) % 100}%`,
  y: `${(index * 53 + 13) % 100}%`,
  size: [1, 1.35, 1.8, 2.35, 3.2][index % 5],
  delay: (index % 16) * 0.28,
  duration: 12 + (index % 10) * 1.45,
  driftX: ((index * 29) % 37) - 18,
  driftY: -34 - ((index * 17) % 58),
  tone: [
    "rgba(152,233,255,0.88)",
    "rgba(255,154,31,0.72)",
    "rgba(255,255,255,0.78)",
    "rgba(44,82,255,0.72)",
  ][index % 4],
  trail: [22, 30, 42, 56][index % 4],
}));

const geometryPanels = [
  { className: "left-[6%] top-[10%] h-44 w-44 rotate-12", delay: 0, duration: 22 },
  { className: "right-[10%] top-[18%] h-64 w-64 -rotate-6", delay: 1.4, duration: 28 },
  { className: "left-[18%] bottom-[14%] h-56 w-56 -rotate-12", delay: 2.1, duration: 31 },
  { className: "right-[22%] bottom-[8%] h-36 w-36 rotate-[21deg]", delay: 0.8, duration: 24 },
] as const;

function getMode(pathname: string | null): Mode {
  if (pathname === "/") return "home";
  if (pathname?.startsWith("/dashboard")) return "dashboard";
  if (pathname?.startsWith("/demo")) return "demo";
  return "default";
}

function NetworkSvg({ mode }: { mode: Mode }) {
  const reduced = useReducedMotion();
  const opacity = mode === "home" ? "opacity-70" : mode === "demo" ? "opacity-60" : "opacity-50";

  return (
    <motion.svg
      className={cn("absolute inset-0 h-full w-full", opacity)}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      animate={reduced ? undefined : { x: [0, 0.8, -0.4, 0], y: [0, -0.6, 0.4, 0] }}
      transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
    >
      <defs>
        <linearGradient id="praetorNetworkLine" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,130,0,0.20)" />
          <stop offset="48%" stopColor="rgba(152,233,255,0.34)" />
          <stop offset="100%" stopColor="rgba(44,82,255,0.24)" />
        </linearGradient>
        <filter id="praetorNodeGlow">
          <feGaussianBlur stdDeviation="0.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {lines.map(([from, to], index) => {
        const [x1, y1] = nodes[from];
        const [x2, y2] = nodes[to];
        return (
          <g key={`${from}-${to}`}>
            <motion.line
              x1={x1} y1={y1} x2={x2} y2={y2}
              vectorEffect="non-scaling-stroke"
              stroke="url(#praetorNetworkLine)" strokeWidth="0.14" strokeLinecap="round"
              animate={reduced ? undefined : { opacity: [0.18, index % 4 === 0 ? 0.78 : 0.4, 0.18] }}
              transition={{ duration: 7 + (index % 8), delay: index * 0.07, repeat: Infinity, ease: "easeInOut" }}
            />
            {index % 3 === 0 && (
              <motion.circle
                r="0.42" fill="rgba(152,233,255,0.92)" filter="url(#praetorNodeGlow)"
                animate={reduced ? undefined : { cx: [x1, x2], cy: [y1, y2], opacity: [0, 1, 0] }}
                transition={{ duration: 4.8 + (index % 5), delay: index * 0.18, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
          </g>
        );
      })}
      {nodes.map(([x, y], index) => (
        <motion.circle
          key={`${x}-${y}`} cx={x} cy={y} r={index % 6 === 0 ? 0.38 : 0.24}
          fill={index % 5 === 0 ? "rgba(255,154,31,0.86)" : index % 4 === 0 ? "rgba(44,82,255,0.76)" : "rgba(152,233,255,0.78)"}
          filter="url(#praetorNodeGlow)" vectorEffect="non-scaling-stroke"
          animate={reduced ? undefined : { opacity: [0.38, 0.95, 0.5], scale: [1, 1.45, 1] }}
          transition={{ duration: 5.5 + (index % 6), delay: index * 0.15, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </motion.svg>
  );
}

function AbstractGeometry() {
  const reduced = useReducedMotion();

  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-[-8%] praetor-soft-geometry-wash"
        animate={reduced ? undefined : { x: [0, 18, -12, 0], y: [0, -10, 8, 0], scale: [1, 1.025, 1] }}
        transition={{ duration: 36, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-0 praetor-luxury-linework"
        animate={reduced ? undefined : { backgroundPosition: ["0px 0px, 0px 0px, 0px 0px", "90px 54px, -72px 72px, 120px 0px"] }}
        transition={{ duration: 46, repeat: Infinity, ease: "linear" }}
      />
      {geometryPanels.map((panel, index) => (
        <motion.div
          key={panel.className}
          className={cn("absolute praetor-geometry-panel", panel.className)}
          animate={
            reduced
              ? undefined
              : {
                  y: [0, index % 2 ? 18 : -14, 0],
                  x: [0, index % 2 ? -8 : 10, 0],
                  rotate: [0, index % 2 ? -4 : 4, 0],
                  opacity: [0.22, 0.42, 0.24],
                }
          }
          transition={{ duration: panel.duration, delay: panel.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function ParticleField({ mode }: { mode: Mode }) {
  const reduced = useReducedMotion();
  const count = mode === "dashboard" ? 52 : mode === "demo" ? 68 : 78;
  return (
    <div className="absolute inset-0 overflow-hidden praetor-premium-particle-field">
      {particles.slice(0, count).map((particle) => (
        <motion.span
          key={particle.id}
          className="praetor-network-particle"
          style={{
            "--x": particle.x,
            "--y": particle.y,
            "--size": `${particle.size}px`,
            "--particle-tone": particle.tone,
            "--trail": `${particle.trail}px`,
          } as CSSProperties}
          animate={
            reduced
              ? undefined
              : {
                  x: [0, particle.driftX * 0.45, particle.driftX, particle.driftX * 0.25, 0],
                  y: [0, particle.driftY * 0.35, particle.driftY, particle.driftY * 0.55, 0],
                  opacity: [0, 0.74, 0.2, 0.68, 0],
                  scale: [0.6, 1.18, 0.84, 1, 0.6],
                }
          }
          transition={{ duration: particle.duration, delay: particle.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

export function PraetorNetworkBackground() {
  const pathname = usePathname();
  const mode = getMode(pathname);
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[var(--praetor-deep-navy)]">
      <div className="absolute inset-0 praetor-depth-base" />
      <AbstractGeometry />
      <motion.div className="absolute -right-[18vw] top-[7vh] h-[56vh] w-[58vw] praetor-orange-slab" animate={{ y: [0, -18, 12, 0], rotate: [-10, -8, -11, -10] }} transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute -left-[20vw] bottom-[-16vh] h-[46vh] w-[52vw] praetor-navy-slab" animate={{ x: [0, 18, -10, 0], rotate: [15, 13, 16, 15] }} transition={{ duration: 34, repeat: Infinity, ease: "easeInOut" }} />
      <div className="absolute left-[8%] top-[14%] h-72 w-72 rounded-full bg-[rgba(152,233,255,0.10)] blur-3xl" />
      <div className="absolute right-[18%] top-[44%] h-96 w-96 rounded-full bg-[rgba(255,130,0,0.13)] blur-3xl" />
      <NetworkSvg mode={mode} />
      <ParticleField mode={mode} />
      <div className="absolute inset-0 praetor-geo-grid" />
      <div className="absolute inset-0 praetor-background-vignette" />
    </div>
  );
}
