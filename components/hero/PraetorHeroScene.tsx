"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useCallback, useMemo } from "react";

type PraetorHeroSceneProps = {
  className?: string;
  recorderMode?: boolean;
};

type Tower = {
  x: number;
  y: number;
  w: number;
  h: number;
  depth: number;
  tone: "gold" | "steel" | "silver";
  phase: number;
};

type Stream = {
  lane: number;
  phase: number;
  speed: number;
  tone: "cyan" | "gold" | "red" | "solana";
  radius: number;
};

const palette = {
  obsidian: "#040508",
  navy: "#07111d",
  gold: "#e7b85d",
  amber: "#ff8a1f",
  cyan: "#98e9ff",
  blue: "#2c52ff",
  red: "#ff5b6e",
  green: "#14f195",
  purple: "#9945ff",
  steel: "#9ba8b8",
  silver: "#e4edf5",
};

function seeded(index: number) {
  const value = Math.sin(index * 999.137) * 10000;
  return value - Math.floor(value);
}

function drawLine(ctx: CanvasRenderingContext2D, points: Array<[number, number]>, color: string, width: number, glow = 0) {
  ctx.save();
  ctx.beginPath();
  points.forEach(([x, y], index) => (index === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  if (glow) {
    ctx.shadowBlur = glow;
    ctx.shadowColor = color;
  }
  ctx.stroke();
  ctx.restore();
}

function project(x: number, y: number, z: number, width: number, height: number, time: number): [number, number] {
  const sway = Math.sin(time * 0.18) * 0.035;
  const cos = Math.cos(-0.74 + sway);
  const sin = Math.sin(-0.74 + sway);
  const rx = x * cos - z * sin;
  const rz = x * sin + z * cos;
  const perspective = 1 / (1 + (rz + 1.2) * 0.14);
  return [width * 0.5 + rx * width * 0.34 * perspective, height * 0.68 - y * height * 0.18 * perspective + rz * height * 0.08 * perspective];
}

function PraetorCityFrame({ recorderMode = false }: { recorderMode?: boolean }) {
  const towers = useMemo<Tower[]>(() => Array.from({ length: 58 }, (_, index) => {
    const ring = Math.floor(index / 10);
    const angle = index * 2.399 + ring * 0.32;
    const radius = 0.08 + seeded(index + 2) * 0.98;
    const compact = 1 - Math.min(0.56, ring * 0.055);
    return {
      x: Math.cos(angle) * radius * compact,
      y: 0,
      w: 0.026 + seeded(index + 8) * 0.034,
      h: 0.22 + (1 - radius) * 0.55 + seeded(index + 15) * 0.32,
      depth: 0.026 + seeded(index + 23) * 0.038,
      tone: index % 7 === 0 ? "gold" : index % 3 === 0 ? "silver" : "steel",
      phase: seeded(index + 41) * Math.PI * 2,
    };
  }), []);

  const streams = useMemo<Stream[]>(() => Array.from({ length: 150 }, (_, index) => ({
    lane: index % 10,
    phase: seeded(index + 80),
    speed: 0.09 + seeded(index + 90) * 0.18,
    tone: index % 17 === 0 ? "red" : index % 11 === 0 ? "gold" : index % 9 === 0 ? "solana" : "cyan",
    radius: 1.4 + seeded(index + 100) * 2.2,
  })), []);

  const render = useCallback((canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, time: number) => {
    const dpr = Math.min(window.devicePixelRatio || 1, recorderMode ? 1.5 : 2);
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(1, Math.floor(rect.width * dpr));
    const height = Math.max(1, Math.floor(rect.height * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    ctx.clearRect(0, 0, width, height);
    const bg = ctx.createRadialGradient(width * 0.52, height * 0.38, 0, width * 0.5, height * 0.5, Math.max(width, height) * 0.72);
    bg.addColorStop(0, "rgba(19,31,47,1)");
    bg.addColorStop(0.48, palette.obsidian);
    bg.addColorStop(1, "#010103");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    const horizon = height * 0.67;
    for (let i = 0; i < 36; i += 1) {
      const y = horizon + i * height * 0.018;
      const alpha = Math.max(0, 0.2 - i * 0.005);
      drawLine(ctx, [[width * 0.18, y], [width * 0.82, y + Math.sin(i + time) * 2]], `rgba(152,233,255,${alpha})`, Math.max(1, dpr * 0.6));
    }

    const roadLoops = [0.28, 0.42, 0.57, 0.75];
    roadLoops.forEach((scale, index) => {
      ctx.save();
      ctx.translate(width * 0.5, horizon);
      ctx.scale(1, 0.34);
      ctx.rotate(-0.12 + Math.sin(time * 0.14) * 0.01);
      ctx.beginPath();
      ctx.ellipse(0, 0, width * scale * 0.46, height * scale * 0.22, 0, 0, Math.PI * 2);
      ctx.strokeStyle = index % 2 ? "rgba(231,184,93,0.32)" : "rgba(152,233,255,0.38)";
      ctx.lineWidth = dpr * (1.2 + index * 0.35);
      ctx.shadowBlur = 18 * dpr;
      ctx.shadowColor = ctx.strokeStyle;
      ctx.setLineDash([12 * dpr, 16 * dpr]);
      ctx.lineDashOffset = -time * (18 + index * 8) * dpr;
      ctx.stroke();
      ctx.restore();
    });

    streams.forEach((stream, index) => {
      const t = (stream.phase + time * stream.speed) % 1;
      const angle = t * Math.PI * 2 + stream.lane * 0.31;
      const r = (0.12 + stream.lane * 0.084) * stream.radius;
      const y = stream.lane % 3 === 0 ? -0.18 : stream.lane % 4 === 0 ? 0.16 : 0.02;
      const [x1, y1] = project(Math.cos(angle) * r, y, Math.sin(angle) * r, width, height, time);
      const color = stream.tone === "red" ? palette.red : stream.tone === "gold" ? palette.gold : stream.tone === "solana" ? palette.green : palette.cyan;
      ctx.save();
      ctx.globalAlpha = stream.tone === "red" ? 0.68 : 0.82;
      ctx.fillStyle = color;
      ctx.shadowBlur = (stream.tone === "red" ? 18 : 14) * dpr;
      ctx.shadowColor = color;
      ctx.beginPath();
      ctx.arc(x1, y1, (stream.tone === "red" ? 1.8 : 1.35) * dpr, 0, Math.PI * 2);
      ctx.fill();
      if (index % 3 === 0) {
        const [x2, y2] = project(Math.cos(angle - 0.08) * r, y, Math.sin(angle - 0.08) * r, width, height, time);
        drawLine(ctx, [[x2, y2], [x1, y1]], color.replace(")", ",0.46)").replace("rgb", "rgba"), dpr * 1.05, 10 * dpr);
      }
      ctx.restore();
    });

    const sortedTowers = [...towers].sort((a, b) => a.x + a.depth - (b.x + b.depth));
    sortedTowers.forEach((tower, index) => {
      const shimmer = 0.72 + Math.sin(time * 1.7 + tower.phase) * 0.14;
      const [baseX, baseY] = project(tower.x, 0, tower.y, width, height, time);
      const [topX, topY] = project(tower.x, tower.h, tower.y, width, height, time);
      const towerWidth = tower.w * width * (0.82 + tower.depth * 5);
      const body = ctx.createLinearGradient(baseX - towerWidth, baseY, baseX + towerWidth, topY);
      if (tower.tone === "gold") {
        body.addColorStop(0, "rgba(76,55,24,0.96)");
        body.addColorStop(0.48, `rgba(231,184,93,${shimmer})`);
        body.addColorStop(1, "rgba(255,243,188,0.78)");
      } else if (tower.tone === "silver") {
        body.addColorStop(0, "rgba(61,70,82,0.94)");
        body.addColorStop(0.5, `rgba(228,237,245,${shimmer * 0.82})`);
        body.addColorStop(1, "rgba(95,111,128,0.86)");
      } else {
        body.addColorStop(0, "rgba(31,39,50,0.96)");
        body.addColorStop(0.58, `rgba(155,168,184,${shimmer * 0.66})`);
        body.addColorStop(1, "rgba(12,16,23,0.96)");
      }
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(baseX - towerWidth * 0.5, baseY);
      ctx.lineTo(baseX + towerWidth * 0.58, baseY - towerWidth * 0.18);
      ctx.lineTo(topX + towerWidth * 0.35, topY);
      ctx.lineTo(topX - towerWidth * 0.42, topY + towerWidth * 0.14);
      ctx.closePath();
      ctx.fillStyle = body;
      ctx.shadowBlur = tower.tone === "gold" ? 18 * dpr : 8 * dpr;
      ctx.shadowColor = tower.tone === "gold" ? "rgba(231,184,93,0.42)" : "rgba(152,233,255,0.18)";
      ctx.fill();
      if (index % 2 === 0) {
        drawLine(ctx, [[topX - towerWidth * 0.34, topY + towerWidth * 0.18], [baseX - towerWidth * 0.4, baseY]], "rgba(255,255,255,0.17)", dpr * 0.7);
      }
      ctx.restore();
    });

    const shieldPulse = 0.52 + Math.sin(time * 1.15) * 0.12;
    ctx.save();
    ctx.translate(width * 0.5, height * 0.47);
    ctx.scale(1, 0.48);
    for (let ring = 0; ring < 4; ring += 1) {
      ctx.rotate(THREE.MathUtils.degToRad(4 + Math.sin(time * 0.4 + ring) * 1.4));
      ctx.beginPath();
      ctx.ellipse(0, 0, width * (0.23 + ring * 0.035), height * (0.34 + ring * 0.04), 0, 0, Math.PI * 2);
      ctx.strokeStyle = ring === 2 ? `rgba(231,184,93,${shieldPulse})` : `rgba(152,233,255,${0.22 + shieldPulse * 0.18})`;
      ctx.lineWidth = dpr * (1.2 + ring * 0.34);
      ctx.setLineDash([ring % 2 ? 18 * dpr : 5 * dpr, ring % 2 ? 12 * dpr : 13 * dpr]);
      ctx.lineDashOffset = time * (ring % 2 ? 18 : -22) * dpr;
      ctx.shadowBlur = 24 * dpr;
      ctx.shadowColor = ctx.strokeStyle;
      ctx.stroke();
    }
    ctx.restore();

    for (let i = 0; i < 8; i += 1) {
      const attackT = (time * 0.1 + i * 0.137) % 1;
      const side = i % 2 === 0 ? -1 : 1;
      const start: [number, number] = [width * (side < 0 ? 0.04 : 0.96), height * (0.19 + seeded(i) * 0.58)];
      const end: [number, number] = [width * (0.5 + side * (0.19 + seeded(i + 7) * 0.07)), height * (0.42 + seeded(i + 13) * 0.18)];
      const ix = THREE.MathUtils.lerp(start[0], end[0], THREE.MathUtils.smoothstep(attackT, 0, 0.82));
      const iy = THREE.MathUtils.lerp(start[1], end[1], THREE.MathUtils.smoothstep(attackT, 0, 0.82));
      drawLine(ctx, [start, [ix, iy]], `rgba(255,91,110,${0.08 + attackT * 0.42})`, dpr * 1.1, 10 * dpr);
      if (attackT > 0.72) {
        ctx.save();
        ctx.fillStyle = `rgba(255,138,31,${1 - attackT})`;
        ctx.shadowBlur = 26 * dpr;
        ctx.shadowColor = palette.amber;
        ctx.beginPath();
        ctx.arc(ix, iy, dpr * 4 * (1 - attackT + 0.2), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const vignette = ctx.createRadialGradient(width * 0.5, height * 0.48, width * 0.18, width * 0.5, height * 0.5, width * 0.72);
    vignette.addColorStop(0, "rgba(0,0,0,0)");
    vignette.addColorStop(0.75, "rgba(0,0,0,0.08)");
    vignette.addColorStop(1, "rgba(0,0,0,0.74)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);
  }, [recorderMode, streams, towers]);

  useFrame(({ canvas, gl, clock }) => {
    if (!canvas || !gl) return;
    render(canvas, gl, clock.elapsedTime);
  });

  return null;
}

export function PraetorHeroScene({ className = "", recorderMode = false }: PraetorHeroSceneProps) {
  return (
    <div className={`relative h-full min-h-[420px] w-full overflow-hidden rounded-[2rem] border border-white/10 bg-black ${className}`}>
      <Canvas
        className="block h-full min-h-[420px] w-full"
        aria-label="Praetor protects Solana protocol operations with shielded onchain data streams"
      >
        <PraetorCityFrame recorderMode={recorderMode} />
      </Canvas>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.46),rgba(0,0,0,0.04)_42%,rgba(0,0,0,0.28))]" />
      <div className="pointer-events-none absolute left-5 top-5 rounded-full border border-[rgba(231,184,93,0.34)] bg-black/34 px-4 py-2 font-mono text-[10px] font-black uppercase tracking-[0.24em] text-[var(--praetor-orange-soft)] backdrop-blur-md">
        Solana ops shield active
      </div>
    </div>
  );
}

export default PraetorHeroScene;
