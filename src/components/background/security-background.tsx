"use client";

import { motion, useReducedMotion } from "framer-motion";
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

const particles: Particle[] = Array.from({ length: 34 }, (_, index) => ({
  id: index,
  x: `${(index * 29 + 11) % 100}%`,
  y: `${(index * 47 + 7) % 100}%`,
  size: [1, 1.5, 2, 2.5][index % 4],
  delay: (index % 9) * 0.7,
  duration: 11 + (index % 7) * 1.8,
  opacity: 0.16 + (index % 5) * 0.035,
}));

const modeStyles: Record<BackgroundMode, { intensity: string; particleOpacity: string; scanOpacity: string }> = {
  home: {
    intensity: "opacity-100",
    particleOpacity: "opacity-100",
    scanOpacity: "opacity-75",
  },
  dashboard: {
    intensity: "opacity-[0.76]",
    particleOpacity: "opacity-70",
    scanOpacity: "opacity-[0.45]",
  },
  demo: {
    intensity: "opacity-[0.88]",
    particleOpacity: "opacity-80",
    scanOpacity: "opacity-[0.55]",
  },
  default: {
    intensity: "opacity-[0.70]",
    particleOpacity: "opacity-60",
    scanOpacity: "opacity-[0.40]",
  },
};

function getMode(pathname: string | null): BackgroundMode {
  if (pathname === "/") return "home";
  if (pathname?.startsWith("/dashboard")) return "dashboard";
  if (pathname?.startsWith("/demo")) return "demo";
  return "default";
}

export function AmbientGlowLayer({ mode }: { mode: BackgroundMode }) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={cn("security-depth-field pointer-events-none fixed inset-0", modeStyles[mode].intensity)}
      animate={
        reduced
          ? undefined
          : {
              x: [0, 20, -14, 0],
              y: [0, -12, 18, 0],
              scale: [1, 1.035, 1.015, 1],
            }
      }
      transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

export function ParticleField({ mode }: { mode: BackgroundMode }) {
  const reduced = useReducedMotion();
  const visibleParticles = mode === "dashboard" ? particles.slice(0, 22) : particles;

  return (
    <div className={cn("praetor-particle-field pointer-events-none fixed inset-0", modeStyles[mode].particleOpacity)}>
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
                  opacity: [particle.opacity * 0.35, particle.opacity, particle.opacity * 0.45],
                }
          }
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export function CinematicGridOverlay({ mode }: { mode: BackgroundMode }) {
  return (
    <>
      <div className={cn("command-grid-drift pointer-events-none fixed inset-0", mode === "home" ? "opacity-[0.24]" : "opacity-[0.14]")} />
      <div className={cn("hex-mesh pointer-events-none fixed inset-0", mode === "dashboard" ? "opacity-[0.075]" : "opacity-[0.13]")} />
      <div className={cn("circuit-board pointer-events-none fixed inset-0", mode === "home" ? "opacity-[0.12]" : "opacity-[0.08]")} />
      <div className="grid-mask pointer-events-none fixed inset-0 opacity-[0.38]" />
    </>
  );
}

export function LightSweepLayer({ mode }: { mode: BackgroundMode }) {
  const reduced = useReducedMotion();

  return (
    <>
      <motion.div
        className={cn("cinematic-sweep pointer-events-none fixed inset-0", mode === "dashboard" ? "opacity-[0.16]" : "opacity-[0.28]")}
        animate={reduced ? undefined : { opacity: mode === "dashboard" ? [0.12, 0.2, 0.12] : [0.2, 0.34, 0.2] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className={cn("scanline pointer-events-none fixed inset-x-0 top-0 h-40", modeStyles[mode].scanOpacity)} />
      <div className="praetor-beam-stack pointer-events-none fixed inset-0" />
    </>
  );
}

export function AnimatedBackground() {
  const pathname = usePathname();
  const mode = getMode(pathname);
  const reduced = useReducedMotion();

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-obsidian">
      <div className="pointer-events-none fixed inset-0 bg-radial-grid" />
      <motion.div
        className="security-orb security-orb-blue pointer-events-none fixed"
        animate={reduced ? undefined : { x: [0, 38, 12, 0], y: [0, -26, 18, 0], scale: [1, 1.1, 1.04, 1] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="security-orb security-orb-cyan pointer-events-none fixed"
        animate={reduced ? undefined : { x: [0, -34, -12, 0], y: [0, 24, -12, 0], scale: [1, 1.08, 1.02, 1] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="security-orb security-orb-gold pointer-events-none fixed"
        animate={reduced ? undefined : { x: [0, 20, -24, 0], y: [0, -18, 10, 0], scale: [1, 1.06, 1.12, 1] }}
        transition={{ duration: 34, repeat: Infinity, ease: "easeInOut" }}
      />
      <AmbientGlowLayer mode={mode} />
      <ParticleField mode={mode} />
      <LightSweepLayer mode={mode} />
      <CinematicGridOverlay mode={mode} />
      <div className="praetor-depth-vignette pointer-events-none fixed inset-0" />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(90deg,rgba(9,11,16,0.64),transparent_16%,transparent_78%,rgba(9,11,16,0.68))]" />
    </div>
  );
}

export function SecurityBackground() {
  return <AnimatedBackground />;
}
