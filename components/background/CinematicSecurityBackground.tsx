"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Transition } from "framer-motion";
import type { CSSProperties } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/src/lib/utils";

type BackgroundMode = "home" | "dashboard" | "demo" | "default";

type Particle = {
  id: number;
  x: string;
  y: string;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
};

const ambientTransition: Transition = {
  duration: 32,
  repeat: Infinity,
  ease: [0.42, 0, 0.18, 1],
};

const slowTransition: Transition = {
  duration: 48,
  repeat: Infinity,
  ease: "linear",
};

const particles: Particle[] = Array.from({ length: 86 }, (_, index) => ({
  id: index,
  x: `${(index * 29 + 11) % 100}%`,
  y: `${(index * 47 + 7) % 100}%`,
  size: [1, 1.15, 1.35, 1.75, 2.2, 2.8][index % 6],
  delay: (index % 13) * 0.42,
  duration: 13 + (index % 10) * 1.55,
  opacity: 0.12 + (index % 7) * 0.026,
}));

const networkNodes = [
  [8, 23],
  [18, 14],
  [28, 28],
  [41, 16],
  [54, 26],
  [68, 13],
  [83, 24],
  [94, 16],
  [13, 48],
  [27, 58],
  [40, 43],
  [53, 54],
  [66, 40],
  [78, 55],
  [91, 46],
  [6, 76],
  [21, 84],
  [36, 72],
  [49, 86],
  [63, 74],
  [76, 86],
  [90, 73],
] as const;

const networkLines = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 6],
  [6, 7],
  [0, 8],
  [2, 10],
  [4, 12],
  [6, 14],
  [8, 9],
  [9, 10],
  [10, 11],
  [11, 12],
  [12, 13],
  [13, 14],
  [8, 15],
  [9, 17],
  [11, 18],
  [12, 19],
  [13, 20],
  [14, 21],
  [15, 16],
  [16, 17],
  [17, 18],
  [18, 19],
  [19, 20],
  [20, 21],
  [1, 10],
  [3, 11],
  [5, 13],
  [10, 17],
  [12, 20],
] as const;

const modeStyles: Record<
  BackgroundMode,
  {
    intensity: string;
    particleOpacity: string;
    scanOpacity: string;
    density: number;
    network: string;
  }
> = {
  home: {
    intensity: "opacity-100",
    particleOpacity: "opacity-100",
    scanOpacity: "opacity-75",
    density: 74,
    network: "opacity-[0.62]",
  },
  dashboard: {
    intensity: "opacity-[0.74]",
    particleOpacity: "opacity-70",
    scanOpacity: "opacity-[0.40]",
    density: 42,
    network: "opacity-[0.40]",
  },
  demo: {
    intensity: "opacity-[0.94]",
    particleOpacity: "opacity-85",
    scanOpacity: "opacity-[0.56]",
    density: 62,
    network: "opacity-[0.55]",
  },
  default: {
    intensity: "opacity-[0.72]",
    particleOpacity: "opacity-60",
    scanOpacity: "opacity-[0.38]",
    density: 34,
    network: "opacity-[0.34]",
  },
};

function getMode(pathname: string | null): BackgroundMode {
  if (pathname === "/") return "home";
  if (pathname?.startsWith("/dashboard")) return "dashboard";
  if (pathname?.startsWith("/demo")) return "demo";
  return "default";
}

function EnergyBlooms({ mode }: { mode: BackgroundMode }) {
  const reduced = useReducedMotion();

  return (
    <>
      <motion.div
        className="security-orb security-orb-blue pointer-events-none fixed"
        animate={
          reduced
            ? undefined
            : {
                x: [0, 38, 12, 0],
                y: [0, -26, 18, 0],
                scale: [1, 1.1, 1.04, 1],
              }
        }
        transition={{
          ...ambientTransition,
          duration: mode === "dashboard" ? 30 : 24,
        }}
      />
      <motion.div
        className="security-orb security-orb-cyan pointer-events-none fixed"
        animate={
          reduced
            ? undefined
            : {
                x: [0, -34, -12, 0],
                y: [0, 24, -12, 0],
                scale: [1, 1.08, 1.02, 1],
              }
        }
        transition={{ ...ambientTransition, duration: 28 }}
      />
      <motion.div
        className="security-orb security-orb-solana pointer-events-none fixed"
        animate={
          reduced
            ? undefined
            : {
                x: [0, 24, -18, 0],
                y: [0, -28, 16, 0],
                scale: [1, 1.1, 1.03, 1],
              }
        }
        transition={{ ...ambientTransition, duration: 36 }}
      />
      <motion.div
        className="security-orb security-orb-gold pointer-events-none fixed"
        animate={
          reduced
            ? undefined
            : {
                x: [0, 20, -24, 0],
                y: [0, -18, 10, 0],
                scale: [1, 1.06, 1.12, 1],
              }
        }
        transition={{ ...ambientTransition, duration: 34 }}
      />
      <motion.div
        className="security-orb security-orb-teal pointer-events-none fixed"
        animate={
          reduced
            ? undefined
            : {
                x: [0, -18, 28, 0],
                y: [0, -18, -32, 0],
                scale: [1, 1.13, 1.03, 1],
              }
        }
        transition={{ ...ambientTransition, duration: 38 }}
      />
    </>
  );
}

function SolanaNetworkLayer({ mode }: { mode: BackgroundMode }) {
  const reduced = useReducedMotion();

  return (
    <motion.svg
      className={cn(
        "praetor-network pointer-events-none fixed inset-0 h-full w-full",
        modeStyles[mode].network,
      )}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      animate={
        reduced ? undefined : { x: [0, 0.8, -0.5, 0], y: [0, -0.6, 0.45, 0] }
      }
      transition={{ ...ambientTransition, duration: 26 }}
    >
      <defs>
        <linearGradient id="praetor-line" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="rgba(153,69,255,0.16)" />
          <stop offset="45%" stopColor="rgba(20,241,149,0.28)" />
          <stop offset="100%" stopColor="rgba(152,233,255,0.22)" />
        </linearGradient>
        <filter id="praetor-node-glow">
          <feGaussianBlur stdDeviation="0.45" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {networkLines.map(([from, to], index) => {
        const [x1, y1] = networkNodes[from];
        const [x2, y2] = networkNodes[to];
        return (
          <motion.line
            key={`${from}-${to}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            vectorEffect="non-scaling-stroke"
            stroke="url(#praetor-line)"
            strokeWidth="0.12"
            strokeLinecap="round"
            initial={false}
            animate={
              reduced
                ? undefined
                : { opacity: [0.16, index % 3 === 0 ? 0.56 : 0.34, 0.16] }
            }
            transition={{
              duration: 8 + (index % 7),
              delay: index * 0.09,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        );
      })}
      {networkNodes.map(([x, y], index) => (
        <motion.circle
          key={`${x}-${y}`}
          cx={x}
          cy={y}
          r={index % 5 === 0 ? 0.34 : 0.22}
          vectorEffect="non-scaling-stroke"
          fill={
            index % 4 === 0
              ? "rgba(20,241,149,0.82)"
              : index % 3 === 0
                ? "rgba(153,69,255,0.74)"
                : "rgba(152,233,255,0.78)"
          }
          filter="url(#praetor-node-glow)"
          animate={
            reduced
              ? undefined
              : { opacity: [0.36, 0.94, 0.48], scale: [1, 1.35, 1] }
          }
          transition={{
            duration: 5.8 + (index % 6),
            delay: index * 0.18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </motion.svg>
  );
}

function AmbientGlowLayer({ mode }: { mode: BackgroundMode }) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={cn(
        "security-depth-field pointer-events-none fixed inset-0",
        modeStyles[mode].intensity,
      )}
      animate={
        reduced
          ? undefined
          : {
              x: [0, 20, -14, 0],
              y: [0, -12, 18, 0],
              scale: [1, 1.035, 1.015, 1],
            }
      }
      transition={ambientTransition}
    />
  );
}

function ParticleField({ mode }: { mode: BackgroundMode }) {
  const reduced = useReducedMotion();
  const visibleParticles = particles.slice(0, modeStyles[mode].density);

  return (
    <div
      className={cn(
        "praetor-particle-field pointer-events-none fixed inset-0",
        modeStyles[mode].particleOpacity,
      )}
    >
      {visibleParticles.map((particle) => (
        <motion.span
          key={particle.id}
          className="praetor-particle"
          style={
            {
              "--particle-x": particle.x,
              "--particle-y": particle.y,
              "--particle-size": `${particle.size}px`,
              "--particle-opacity": particle.opacity,
            } as CSSProperties
          }
          animate={
            reduced
              ? undefined
              : {
                  y: [0, -18 - particle.size * 8, 0],
                  x: [0, particle.id % 2 === 0 ? 10 : -10, 0],
                  opacity: [
                    particle.opacity * 0.35,
                    particle.opacity,
                    particle.opacity * 0.45,
                  ],
                }
          }
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: [0.42, 0, 0.58, 1],
          }}
        />
      ))}
    </div>
  );
}

function CinematicGridOverlay({ mode }: { mode: BackgroundMode }) {
  const reduced = useReducedMotion();

  return (
    <>
      <motion.div
        className={cn(
          "command-grid-drift pointer-events-none fixed inset-0",
          mode === "home" ? "opacity-[0.22]" : "opacity-[0.12]",
        )}
        animate={reduced ? undefined : { x: [0, 16, 0], y: [0, 16, 0] }}
        transition={slowTransition}
      />
      <motion.div
        className={cn(
          "hex-mesh pointer-events-none fixed inset-0",
          mode === "dashboard" ? "opacity-[0.065]" : "opacity-[0.11]",
        )}
        animate={
          reduced
            ? undefined
            : {
                opacity:
                  mode === "dashboard"
                    ? [0.05, 0.085, 0.05]
                    : [0.08, 0.14, 0.08],
              }
        }
        transition={{ ...ambientTransition, duration: 18 }}
      />
      <div
        className={cn(
          "circuit-board pointer-events-none fixed inset-0",
          mode === "home" ? "opacity-[0.10]" : "opacity-[0.06]",
        )}
      />
      <div className="audit-reticle pointer-events-none fixed inset-0" />
      <div className="grid-mask pointer-events-none fixed inset-0 opacity-[0.32]" />
    </>
  );
}

function LightSweepLayer({ mode }: { mode: BackgroundMode }) {
  const reduced = useReducedMotion();

  return (
    <>
      <motion.div
        className={cn(
          "cinematic-sweep pointer-events-none fixed inset-0",
          mode === "dashboard" ? "opacity-[0.14]" : "opacity-[0.28]",
        )}
        animate={
          reduced
            ? undefined
            : {
                opacity:
                  mode === "dashboard" ? [0.1, 0.18, 0.1] : [0.18, 0.34, 0.18],
              }
        }
        transition={{ ...ambientTransition, duration: 18 }}
      />
      <div
        className={cn(
          "scanline pointer-events-none fixed inset-x-0 top-0 h-40",
          modeStyles[mode].scanOpacity,
        )}
      />
      <div className="radar-sweep pointer-events-none fixed inset-0" />
      <div className="praetor-beam-stack pointer-events-none fixed inset-0" />
    </>
  );
}

export function CinematicSecurityBackground() {
  const pathname = usePathname();
  const mode = getMode(pathname);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-obsidian"
    >
      <div className="pointer-events-none fixed inset-0 bg-radial-grid" />
      <EnergyBlooms mode={mode} />
      <AmbientGlowLayer mode={mode} />
      <SolanaNetworkLayer mode={mode} />
      <ParticleField mode={mode} />
      <LightSweepLayer mode={mode} />
      <CinematicGridOverlay mode={mode} />
      <div className="solana-gradient-ribbon pointer-events-none fixed inset-x-0 top-0 h-[760px]" />
      <div className="hero-energy-well pointer-events-none fixed inset-x-0 top-0 h-[820px]" />
      <div className="praetor-depth-vignette pointer-events-none fixed inset-0" />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(90deg,rgba(9,11,16,0.68),transparent_15%,transparent_78%,rgba(9,11,16,0.72))]" />
    </div>
  );
}

export function SecurityBackground() {
  return <CinematicSecurityBackground />;
}
