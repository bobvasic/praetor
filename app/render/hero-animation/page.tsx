"use client";

import dynamic from "next/dynamic";
import { Download, Film, Info } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { PremiumButton } from "@/components/ui/PremiumButton";

const PraetorHeroScene = dynamic(
  () => import("@/components/hero/PraetorHeroScene").then((mod) => mod.PraetorHeroScene),
  { ssr: false },
);

export default function HeroAnimationRecorderPage() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [recording, setRecording] = useState(false);
  const [status, setStatus] = useState("Ready to record a browser-rendered WebM.");
  const supported = useMemo(() => typeof window !== "undefined" && "MediaRecorder" in window, []);

  async function recordWebM() {
    const canvas = sceneRef.current?.querySelector("canvas");
    if (!canvas) {
      setStatus("Canvas is not ready yet. Wait a moment, then try again.");
      return;
    }
    if (!canvas.captureStream || !("MediaRecorder" in window)) {
      setStatus("This browser does not support canvas captureStream + MediaRecorder.");
      return;
    }

    setRecording(true);
    setStatus("Recording 12 seconds at 60fps...");

    const stream = canvas.captureStream(60);
    const chunks: BlobPart[] = [];
    const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
      ? "video/webm;codecs=vp9"
      : "video/webm";
    const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 8_000_000 });

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunks.push(event.data);
    };
    recorder.onstop = () => {
      stream.getTracks().forEach((track) => track.stop());
      const blob = new Blob(chunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "praetor-hero.webm";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setRecording(false);
      setStatus("Downloaded praetor-hero.webm. Place it at public/brand/praetor-hero.webm.");
    };

    recorder.start(250);
    window.setTimeout(() => recorder.stop(), 12_000);
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-12">
      <div className="mb-7 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="praetor-kicker">Render utility</p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] text-white md:text-6xl">Praetor Hero Animation Recorder</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--praetor-muted)]">
            Render the premium Praetor city shield scene in-browser, then record the canvas with HTMLCanvasElement.captureStream and MediaRecorder.
          </p>
        </div>
        <PremiumButton onClick={recordWebM} disabled={recording || !supported}>
          {recording ? <Film className="mr-2 h-4 w-4 animate-pulse" /> : <Download className="mr-2 h-4 w-4" />}
          {recording ? "Recording..." : "Record WebM"}
        </PremiumButton>
      </div>

      <div ref={sceneRef} className="aspect-video min-h-[420px] overflow-hidden rounded-[2.5rem] border border-white/10 bg-black shadow-[0_40px_160px_rgba(0,0,0,0.7)]">
        <PraetorHeroScene recorderMode className="h-full min-h-[420px] rounded-[2.5rem] border-0" />
      </div>

      <div className="mt-6 rounded-3xl border border-[rgba(152,233,255,0.18)] bg-white/[0.045] p-5 text-sm leading-7 text-[var(--praetor-muted)] backdrop-blur-xl">
        <div className="flex gap-3">
          <Info className="mt-1 h-5 w-5 flex-none text-[var(--praetor-cyan)]" />
          <div>
            <p className="font-black text-white">Export instructions</p>
            <p>
              The button downloads <code className="text-[var(--praetor-orange-soft)]">praetor-hero.webm</code>. Commit or copy that file to <code className="text-[var(--praetor-orange-soft)]">public/brand/praetor-hero.webm</code> when you want the landing page to use the static video. Recording is optional and is not part of <code>npm run build</code>.
            </p>
            <p className="mt-3">If the WebM is absent, the homepage falls back to the live Praetor hero scene automatically.</p>
            <p className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-white/70">Status: {status}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
