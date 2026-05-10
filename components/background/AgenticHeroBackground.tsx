"use client";

import { useEffect, useRef } from "react";

/**
 * AgenticHeroBackground
 * Raptor Labs signature hero background.
 * Layers (each frame, in order):
 *   1. Base wash — solid near-black fill.
 *   2. Hex grid pulse — repeating hexagons with ambient breathing alpha and
 *      rare crimson highlights.
 *   3. Neural mesh — drifting nodes with proximity links.
 *   4. Data streams — vertical Matrix-style glyph rain.
 *
 * Pure 2D canvas, brand-only palette (crimson on near-black), DPR-aware,
 * paused via IntersectionObserver and visibilitychange, honors
 * prefers-reduced-motion (renders one static frame and bails).
 */
export default function AgenticHeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let isMobile = false;

    // Brand palette
    const BG = "hsl(0, 0%, 4%)";
    const CRIMSON = (a: number) => `hsla(0, 100%, 55%, ${a})`;
    const HEX_STROKE = (a: number) => `hsla(0, 0%, 30%, ${a})`;

    type Node = { x: number; y: number; vx: number; vy: number; phase: number };
    type Stream = { x: number; y: number; speed: number; chars: string[]; head: number; len: number };

    let nodes: Node[] = [];
    let streams: Stream[] = [];

    const GLYPHS = "01{}[]<>=>::/*+-#$@&|01ABCDEF";

    const HEX_R = 22;
    const HEX_W = HEX_R * Math.sqrt(3);
    const HEX_H = HEX_R * 1.5;
    const LINK_DIST = 140;
    const LINK_DIST_SQ = LINK_DIST * LINK_DIST;

    const makeStream = (): Stream => {
      const len = 12 + Math.floor(Math.random() * 18);
      return {
        x: Math.random() * width,
        y: Math.random() * height - height,
        speed: 0.3 + Math.random() * 0.9,
        chars: Array.from({ length: len }, () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]),
        head: 0,
        len,
      };
    };

    const setup = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      isMobile = width < 768;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const nodeCount = isMobile ? 38 : 80;
      nodes = Array.from({ length: nodeCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        phase: Math.random() * Math.PI * 2,
      }));

      const streamCount = isMobile ? 5 : 10;
      streams = Array.from({ length: streamCount }, () => makeStream());
    };

    const drawHex = (cx: number, cy: number, r: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i + Math.PI / 6;
        const x = cx + r * Math.cos(a);
        const y = cy + r * Math.sin(a);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    };

    const drawHexGrid = (time: number) => {
      ctx.lineWidth = 0.7;
      const cols = Math.ceil(width / HEX_W) + 2;
      const rows = Math.ceil(height / HEX_H) + 2;
      for (let row = -1; row < rows; row++) {
        for (let col = -1; col < cols; col++) {
          const cx = col * HEX_W + (row % 2 === 0 ? 0 : HEX_W / 2);
          const cy = row * HEX_H;
          const pulse = 0.5 + 0.5 * Math.sin(time * 0.6 + (cx + cy) * 0.012);
          const alpha = 0.12 + pulse * 0.06;
          ctx.strokeStyle = HEX_STROKE(alpha);
          drawHex(cx, cy, HEX_R);
          const hi = Math.sin(time * 0.4 + col * 0.7 + row * 1.1);
          if (hi > 0.985) {
            ctx.strokeStyle = CRIMSON(0.35 * (hi - 0.985) * 60);
            ctx.lineWidth = 1.2;
            drawHex(cx, cy, HEX_R - 1);
            ctx.lineWidth = 0.7;
          }
        }
      }
    };

    const drawNeuralMesh = (time: number) => {
      for (const n of nodes) {
        n.x += n.vx + Math.sin(time * 0.3 + n.phase) * 0.05;
        n.y += n.vy + Math.cos(time * 0.25 + n.phase) * 0.05;
        if (n.x < -20) n.x = width + 20;
        if (n.x > width + 20) n.x = -20;
        if (n.y < -20) n.y = height + 20;
        if (n.y > height + 20) n.y = -20;
      }
      ctx.lineWidth = 0.6;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK_DIST_SQ) {
            const alpha = (1 - d2 / LINK_DIST_SQ) * 0.18;
            ctx.strokeStyle = CRIMSON(alpha);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        ctx.fillStyle = CRIMSON(0.55);
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.3, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawStreams = (dt: number) => {
      ctx.font = '12px ui-monospace, "SF Mono", Menlo, monospace';
      ctx.textBaseline = "top";
      const lineH = 14;
      for (const s of streams) {
        s.head += s.speed * dt * 60;
        if (Math.random() < 0.04) {
          s.chars[Math.floor(Math.random() * s.len)] = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
        for (let i = 0; i < s.len; i++) {
          const y = s.y + s.head - i * lineH;
          if (y < -20 || y > height + 20) continue;
          const headFactor = 1 - i / s.len;
          if (i === 0) {
            ctx.fillStyle = CRIMSON(0.95);
          } else {
            ctx.fillStyle = `hsla(0, 80%, ${30 + headFactor * 30}%, ${headFactor * 0.55})`;
          }
          ctx.fillText(s.chars[i], s.x, y);
        }
        if (s.y + s.head - s.len * lineH > height + 40) {
          s.x = Math.random() * width;
          s.y = -s.head - 40;
        }
      }
    };

    let lastT = performance.now();
    let raf = 0;
    let running = true;

    const frame = (now: number) => {
      if (!running) return;
      const dt = Math.min((now - lastT) / 1000, 0.05);
      lastT = now;
      const time = now / 1000;

      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, width, height);

      drawHexGrid(time);
      drawNeuralMesh(time);
      drawStreams(dt);

      raf = requestAnimationFrame(frame);
    };

    const renderStatic = () => {
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, width, height);
      drawHexGrid(0);
    };

    setup();

    if (reduced) {
      renderStatic();
      return () => {};
    }

    raf = requestAnimationFrame((t) => {
      lastT = t;
      frame(t);
    });

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !running) {
            running = true;
            lastT = performance.now();
            raf = requestAnimationFrame(frame);
          } else if (!e.isIntersecting && running) {
            running = false;
            cancelAnimationFrame(raf);
          }
        }
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    const onVis = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        lastT = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    let resizeT: number | undefined;
    const onResize = () => {
      window.clearTimeout(resizeT);
      resizeT = window.setTimeout(() => setup(), 120);
    };
    window.addEventListener("resize", onResize);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", onResize);
      window.clearTimeout(resizeT);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
      style={{ display: "block", backgroundColor: "hsl(0 0% 4%)" }}
    />
  );
}
