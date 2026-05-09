"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";
import { cn } from "@/src/lib/utils";

type Mode = "home" | "app" | "dashboard" | "demo";

const nodes = [
  [5, 23], [15, 13], [27, 28], [39, 17], [52, 31], [66, 14], [80, 26], [94, 18],
  [9, 50], [22, 61], [36, 46], [50, 58], [64, 42], [78, 60], [93, 48],
  [6, 80], [20, 88], [35, 75], [50, 90], [64, 76], [79, 88], [92, 75],
  [14, 33], [46, 38], [73, 34], [86, 70],
] as const;

const lines = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7],
  [0, 8], [2, 10], [4, 12], [6, 14], [8, 9], [9, 10], [10, 11], [11, 12],
  [12, 13], [13, 14], [8, 15], [9, 17], [11, 18], [12, 19], [13, 20],
  [14, 21], [15, 16], [16, 17], [17, 18], [18, 19], [19, 20], [20, 21],
  [1, 10], [3, 11], [5, 13], [10, 17], [12, 20], [22, 2], [22, 8], [23, 10],
  [23, 12], [24, 6], [24, 13], [25, 14], [25, 20],
] as const;

const threatLines = [
  { x1: 2, y1: 36, x2: 26, y2: 48, delay: 0.4 },
  { x1: 98, y1: 32, x2: 72, y2: 43, delay: 2.2 },
  { x1: 88, y1: 96, x2: 68, y2: 76, delay: 3.6 },
] as const;

const dataStreams = [
  { top: "18%", left: "56%", width: "28vw", delay: 0, tone: "cyan" },
  { top: "35%", left: "9%", width: "34vw", delay: 1.2, tone: "blue" },
  { top: "72%", left: "48%", width: "31vw", delay: 2.4, tone: "gold" },
  { top: "52%", left: "64%", width: "22vw", delay: 3.1, tone: "cyan" },
] as const;

const particles = Array.from({ length: 72 }, (_, index) => ({
  id: index,
  x: `${(index * 37 + 9) % 100}%`,
  y: `${(index * 53 + 13) % 100}%`,
  size: [1, 1.25, 1.6, 2.1][index % 4],
  delay: (index % 16) * 0.28,
  duration: 13 + (index % 10) * 1.55,
  driftX: ((index * 29) % 35) - 17,
  driftY: -28 - ((index * 17) % 48),
  tone: [
    "rgba(152,233,255,0.78)",
    "rgba(255,154,31,0.58)",
    "rgba(199,161,91,0.58)",
    "rgba(44,82,255,0.62)",
  ][index % 4],
  trail: [20, 28, 36, 48][index % 4],
}));

const geometryPanels = [
  { className: "left-[6%] top-[10%] h-44 w-44 rotate-12", delay: 0, duration: 22 },
  { className: "right-[10%] top-[18%] h-64 w-64 -rotate-6", delay: 1.4, duration: 28 },
  { className: "left-[18%] bottom-[14%] h-56 w-56 -rotate-12", delay: 2.1, duration: 31 },
  { className: "right-[22%] bottom-[8%] h-36 w-36 rotate-[21deg]", delay: 0.8, duration: 24 },
] as const;

const modeConfig = {
  home: { network: "opacity-80", particles: 68, firewall: "opacity-60", streams: "opacity-90", shield: "opacity-70" },
  app: { network: "opacity-[0.42]", particles: 38, firewall: "opacity-[0.34]", streams: "opacity-[0.42]", shield: "opacity-[0.44]" },
  dashboard: { network: "opacity-[0.68]", particles: 50, firewall: "opacity-[0.72]", streams: "opacity-[0.72]", shield: "opacity-[0.72]" },
  demo: { network: "opacity-[0.58]", particles: 54, firewall: "opacity-[0.48]", streams: "opacity-60", shield: "opacity-[0.56]" },
} as const;

function getMode(pathname: string | null): Mode {
  if (pathname === "/") return "home";
  if (pathname?.startsWith("/app")) return "app";
  if (pathname?.startsWith("/dashboard")) return "dashboard";
  return "demo";
}

function NetworkSvg({ mode }: { mode: Mode }) {
  const reduced = useReducedMotion();
  const config = modeConfig[mode];

  return (
    <motion.svg
      className={cn("absolute inset-0 h-full w-full", config.network)}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      animate={reduced ? undefined : { x: [0, 0.75, -0.35, 0], y: [0, -0.55, 0.35, 0] }}
      transition={{ duration: mode === "home" ? 28 : 38, repeat: Infinity, ease: "easeInOut" }}
    >
      <defs>
        <linearGradient id="praetorNetworkLine" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,130,0,0.24)" />
          <stop offset="45%" stopColor="rgba(152,233,255,0.38)" />
          <stop offset="100%" stopColor="rgba(44,82,255,0.26)" />
        </linearGradient>
        <linearGradient id="praetorFirewallLine" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="rgba(199,161,91,0)" />
          <stop offset="45%" stopColor="rgba(199,161,91,0.46)" />
          <stop offset="100%" stopColor="rgba(255,130,0,0)" />
        </linearGradient>
        <filter id="praetorNodeGlow">
          <feGaussianBlur stdDeviation="0.45" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <g opacity={mode === "app" ? 0.48 : 0.72}>
        {Array.from({ length: 7 }, (_, index) => (
          <motion.path
            key={`firewall-${index}`}
            d={`M ${16 + index * 6} 8 L ${5 + index * 8} 92`}
            vectorEffect="non-scaling-stroke"
            stroke="url(#praetorFirewallLine)"
            strokeWidth="0.08"
            strokeDasharray="1.2 2.8"
            animate={reduced ? undefined : { strokeDashoffset: [0, index % 2 ? -12 : 12], opacity: [0.16, 0.58, 0.2] }}
            transition={{ duration: 18 + index * 1.4, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </g>

      {lines.map(([from, to], index) => {
        const [x1, y1] = nodes[from];
        const [x2, y2] = nodes[to];
        const accent = index % 7 === 0;
        return (
          <g key={`${from}-${to}`}>
            <motion.line
              x1={x1} y1={y1} x2={x2} y2={y2}
              vectorEffect="non-scaling-stroke"
              stroke={accent ? "rgba(199,161,91,0.42)" : "url(#praetorNetworkLine)"}
              strokeWidth={accent ? "0.18" : "0.13"}
              strokeLinecap="round"
              animate={reduced ? undefined : { opacity: [0.14, index % 4 === 0 ? 0.82 : 0.42, 0.14] }}
              transition={{ duration: 7 + (index % 8), delay: index * 0.07, repeat: Infinity, ease: "easeInOut" }}
            />
            {index % (mode === "app" ? 5 : 3) === 0 && (
              <motion.circle
                r={accent ? "0.5" : "0.38"}
                fill={accent ? "rgba(199,161,91,0.95)" : "rgba(152,233,255,0.92)"}
                filter="url(#praetorNodeGlow)"
                animate={reduced ? undefined : { cx: [x1, x2], cy: [y1, y2], opacity: [0, 1, 0] }}
                transition={{ duration: 4.8 + (index % 5), delay: index * 0.18, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
          </g>
        );
      })}

      {threatLines.map((line, index) => (
        <motion.line
          key={`threat-${index}`}
          x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
          vectorEffect="non-scaling-stroke"
          stroke="rgba(255,91,110,0.52)"
          strokeWidth="0.12"
          strokeLinecap="round"
          strokeDasharray="0.8 1.4"
          animate={reduced ? undefined : { opacity: [0, mode === "app" ? 0.24 : 0.62, 0], strokeDashoffset: [0, -8] }}
          transition={{ duration: 6.5, delay: line.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {nodes.map(([x, y], index) => (
        <motion.circle
          key={`${x}-${y}`} cx={x} cy={y} r={index % 6 === 0 ? 0.38 : 0.24}
          fill={index % 7 === 0 ? "rgba(199,161,91,0.88)" : index % 5 === 0 ? "rgba(255,154,31,0.82)" : index % 4 === 0 ? "rgba(44,82,255,0.74)" : "rgba(152,233,255,0.78)"}
          filter="url(#praetorNodeGlow)" vectorEffect="non-scaling-stroke"
          animate={reduced ? undefined : { opacity: [0.32, 0.96, 0.46], scale: [1, 1.45, 1] }}
          transition={{ duration: 5.5 + (index % 6), delay: index * 0.15, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </motion.svg>
  );
}

function AbstractGeometry({ mode }: { mode: Mode }) {
  const reduced = useReducedMotion();
  const quiet = mode === "app";

  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-[-8%] praetor-soft-geometry-wash"
        animate={reduced ? undefined : { x: [0, quiet ? 8 : 18, quiet ? -6 : -12, 0], y: [0, quiet ? -5 : -10, quiet ? 4 : 8, 0], scale: [1, quiet ? 1.012 : 1.025, 1] }}
        transition={{ duration: quiet ? 48 : 36, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-0 praetor-luxury-linework"
        animate={reduced ? undefined : { backgroundPosition: ["0px 0px, 0px 0px, 0px 0px", "90px 54px, -72px 72px, 120px 0px"] }}
        transition={{ duration: quiet ? 68 : 46, repeat: Infinity, ease: "linear" }}
      />
      {geometryPanels.map((panel, index) => (
        <motion.div
          key={panel.className}
          className={cn("absolute praetor-geometry-panel", panel.className, quiet && "opacity-20")}
          animate={reduced ? undefined : { y: [0, index % 2 ? 14 : -10, 0], x: [0, index % 2 ? -7 : 8, 0], rotate: [0, index % 2 ? -3 : 3, 0], opacity: quiet ? [0.12, 0.22, 0.14] : [0.22, 0.42, 0.24] }}
          transition={{ duration: panel.duration + (quiet ? 12 : 0), delay: panel.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function DataStreams({ mode }: { mode: Mode }) {
  const reduced = useReducedMotion();
  return (
    <div className={cn("absolute inset-0 praetor-data-stream-layer", modeConfig[mode].streams)}>
      {dataStreams.map((stream, index) => (
        <motion.span
          key={`${stream.top}-${stream.left}`}
          className={cn("praetor-data-stream", `praetor-data-stream-${stream.tone}`)}
          style={{ top: stream.top, left: stream.left, width: stream.width } as CSSProperties}
          animate={reduced ? undefined : { x: [0, index % 2 ? -24 : 24, 0], opacity: mode === "app" ? [0.1, 0.32, 0.12] : [0.18, 0.82, 0.2] }}
          transition={{ duration: 9 + index * 1.8, delay: stream.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function ParticleField({ mode }: { mode: Mode }) {
  const reduced = useReducedMotion();
  return (
    <div className="absolute inset-0 overflow-hidden praetor-premium-particle-field">
      {particles.slice(0, modeConfig[mode].particles).map((particle) => (
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
          animate={reduced ? undefined : { x: [0, particle.driftX * 0.45, particle.driftX, particle.driftX * 0.25, 0], y: [0, particle.driftY * 0.35, particle.driftY, particle.driftY * 0.55, 0], opacity: [0, 0.68, 0.18, 0.6, 0], scale: [0.6, 1.14, 0.84, 1, 0.6] }}
          transition={{ duration: particle.duration + (mode === "app" ? 5 : 0), delay: particle.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function SecurityOverlays({ mode }: { mode: Mode }) {
  const reduced = useReducedMotion();
  return (
    <>
      <motion.div
        className={cn("absolute left-1/2 top-1/2 h-[78vmin] w-[78vmin] -translate-x-1/2 -translate-y-1/2 praetor-firewall-shield", modeConfig[mode].shield)}
        animate={reduced ? undefined : { rotate: [0, 0.6, -0.4, 0], scale: [1, 1.018, 1] }}
        transition={{ duration: mode === "home" ? 30 : 42, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className={cn("absolute inset-0 praetor-firewall-mesh", modeConfig[mode].firewall)} />
      <motion.div
        className="absolute inset-0 praetor-light-sweep"
        animate={reduced ? undefined : { backgroundPosition: ["-120% 0, -160% 0", "180% 0, 140% 0"] }}
        transition={{ duration: mode === "home" ? 24 : 36, repeat: Infinity, ease: "easeInOut" }}
      />
    </>
  );
}

export function PraetorNetworkBackground() {
  const pathname = usePathname();
  const mode = getMode(pathname);
  const reduced = useReducedMotion();

  return (
    <div aria-hidden="true" data-background-mode={mode} className="praetor-network-background pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[var(--praetor-deep-navy)]">
      <div className="absolute inset-0 praetor-depth-base" />
      <AbstractGeometry mode={mode} />
      <motion.div className="absolute -right-[18vw] top-[7vh] h-[56vh] w-[58vw] praetor-orange-slab" animate={reduced ? undefined : { y: [0, -18, 12, 0], rotate: [-10, -8, -11, -10] }} transition={{ duration: mode === "app" ? 40 : 26, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute -left-[20vw] bottom-[-16vh] h-[46vh] w-[52vw] praetor-navy-slab" animate={reduced ? undefined : { x: [0, 18, -10, 0], rotate: [15, 13, 16, 15] }} transition={{ duration: 34, repeat: Infinity, ease: "easeInOut" }} />
      <div className="absolute left-[8%] top-[14%] h-72 w-72 rounded-full bg-[rgba(152,233,255,0.10)] blur-3xl" />
      <div className="absolute right-[18%] top-[44%] h-96 w-96 rounded-full bg-[rgba(255,130,0,0.13)] blur-3xl" />
      <SecurityOverlays mode={mode} />
      <NetworkSvg mode={mode} />
      <DataStreams mode={mode} />
      <ParticleField mode={mode} />
      <div className="absolute inset-0 praetor-geo-grid" />
      <div className="absolute inset-0 praetor-background-vignette" />
    </div>
  );
}
