import {
  Activity,
  ArrowRight,
  Ban,
  CheckCircle2,
  Cpu,
  Database,
  FileLock2,
  Hexagon,
  KeyRound,
  Lock,
  Radar,
  ShieldAlert,
  Wallet,
} from "lucide-react";
import { CyberSphere, CyberStatusFeed } from "@/components/hero/CyberSphere";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { PremiumButtonLink } from "@/components/ui/PremiumButton";
import { SectionShell } from "@/components/ui/SectionShell";
import { StatusBadge } from "@/components/ui/StatusBadge";

const flowCards = [
  {
    title: "Detect",
    icon: Radar,
    body: "Monitor privileged operations such as treasury withdrawals, signer activity, governance changes, and upgrade-authority actions.",
  },
  {
    title: "Attest",
    icon: CheckCircle2,
    body: "Create wallet-signed Solana devnet attestation proof through the Memo Program.",
  },
  {
    title: "Challenge",
    icon: ShieldAlert,
    body: "Escalate high-risk actions into guardian review before execution proceeds.",
  },
  {
    title: "Block",
    icon: Ban,
    body: "Show unsafe execution blocked by Praetor policy in the demo workflow.",
  },
] as const;

const whyItMatters = [
  "Audits protect code before launch; Praetor focuses on privileged operations after deployment.",
  "Operational risk can come from compromised signers, unsafe treasury movements, governance pressure, and upgrade-authority misuse.",
  "Protocols need visible, verifiable security posture around privileged actions.",
] as const;

const technicalProof = [
  { label: "Wallet signs client-side only", icon: Wallet },
  { label: "Server never handles private keys", icon: Lock },
  { label: "QuickNode-backed Solana Devnet RPC", icon: Database },
  { label: "Memo Program attestation path", icon: FileLock2 },
  { label: "Anchor Program deployed on devnet", icon: Cpu },
  { label: "Deterministic rule-based risk decisions", icon: Activity },
] as const;

export default function HomePage() {
  return (
    <main className="relative overflow-hidden" data-praetor-route="landing-cybersphere-v2">
      {/* Hero — premium cyber-defense layout. Left: status pills, kicker,
       *   headline, body, CTAs. Right: animated CyberSphere + telemetry
       *   feed. Bottom: 4-step process strip. Sections below are untouched. */}
      <SectionShell className="relative isolate overflow-hidden pb-20 pt-12 md:pb-24 md:pt-16 lg:min-h-[860px]" data-praetor-hero="cybersphere">
        {/* Atmospheric backdrop: kept the cinematic video but turned down so
         *  the new orb is the focal point. Honeycomb + radial red glows
         *  sit between the video and the content. */}
        <video
          className="praetor-hero-video pointer-events-none absolute inset-0 -z-30 h-full w-full object-cover opacity-55"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/media/praetor-city-poster.png"
          aria-hidden="true"
        >
          <source src="/media/praetor-city.webm" type="video/webm" />
        </video>
        <div className="praetor-hero-video-mask pointer-events-none absolute inset-0 -z-20" aria-hidden />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_55%_at_78%_50%,rgba(255,32,32,0.24),transparent_72%),radial-gradient(38%_40%_at_18%_30%,rgba(255,32,32,0.10),transparent_70%)]"
        />
        <div className="praetor-honeycomb pointer-events-none absolute inset-0 -z-10 opacity-[0.16]" aria-hidden />

        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 px-6 lg:grid-cols-[0.92fr_1.08fr]">
          {/* Left — copy block */}
          <div className="py-6 lg:py-10">
            <div className="flex flex-wrap gap-2.5">
              <StatusBadge tone="online" pulse>All Systems Online</StatusBadge>
              <StatusBadge tone="devnet">Solana Devnet</StatusBadge>
              <StatusBadge tone="cyan">QuickNode RPC Connected</StatusBadge>
              <StatusBadge tone="crimson">Onchain Attestation Ready</StatusBadge>
              <StatusBadge tone="crimson">Wallet Required</StatusBadge>
            </div>

            <p className="mt-10 font-mono text-[11px] font-black uppercase tracking-[0.24em] text-[#FF2020]">
              Live Solana Devnet Attestation Flow
            </p>
            <h1 className="mt-4 max-w-[640px] text-4xl font-black leading-[1.05] tracking-[-0.03em] text-white md:text-6xl xl:text-[66px]">
              Runtime security for privileged{" "}
              <span className="text-[#FF2020]">Solana</span> operations.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/68 md:text-lg">
              Wallet signs client-side only — Praetor never asks for private keys.
              QuickNode RPC provides Solana Devnet status, slot, and blockhash data.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <PremiumButtonLink href="/app" variant="crimson">
                <Wallet className="mr-2 h-4 w-4" aria-hidden /> Connect Wallet
              </PremiumButtonLink>
              <PremiumButtonLink href="/dashboard" variant="ghost">
                Explore Platform <ArrowRight className="ml-2 h-3.5 w-3.5" aria-hidden />
              </PremiumButtonLink>
            </div>

            <p className="mt-6 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white/42">
              Solana Devnet · QuickNode RPC · Wallet-signed attestations · Non-custodial
            </p>
          </div>

          {/* Right — animated orb + status feed */}
          <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <CyberSphere />
            <CyberStatusFeed />
          </div>
        </div>

        {/* Bottom 4-step process strip */}
        <div className="relative mx-auto mt-14 grid w-full max-w-7xl grid-cols-2 gap-3 px-6 md:grid-cols-4 md:gap-4">
          {[
            ["1", "Detect"],
            ["2", "Attest"],
            ["3", "Challenge"],
            ["4", "Block"],
          ].map(([n, title]) => (
            <div
              key={n}
              className="flex items-center gap-4 rounded-xl border border-white/10 bg-[rgba(8,8,8,0.72)] px-4 py-4 backdrop-blur-sm"
            >
              <span className="relative grid h-12 w-12 shrink-0 place-items-center">
                <svg viewBox="0 0 24 24" className="absolute inset-0 h-12 w-12">
                  <polygon
                    points="12,2 22,7 22,17 12,22 2,17 2,7"
                    fill="transparent"
                    stroke="rgba(255,32,32,0.55)"
                    strokeWidth="1"
                  />
                </svg>
                <span className="relative font-mono text-base font-black text-[#FF2020]">{n}</span>
              </span>
              <div>
                <p className="text-base font-bold text-white">{title}</p>
                <span className="mt-1 block h-px w-10 bg-[#FF2020]/70" />
              </div>
            </div>
          ))}
        </div>
      </SectionShell>

      {/* What Praetor does */}
      <SectionShell className="praetor-section-cut py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <p className="praetor-kicker">What Praetor does</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-white md:text-5xl">
              Sharp controls for privileged Solana operations.
            </h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {flowCards.map((item, index) => {
              const Icon = item.icon;
              return (
                <GlassPanel key={item.title} className="h-full rounded-xl p-6">
                  <div className="flex items-center gap-3">
                    <span className="rounded-md border border-white/10 bg-[#101010] p-2 text-[#FF6B6B]">
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-white/55">
                      0{index + 1}
                    </p>
                  </div>
                  <h3 className="mt-5 text-xl font-black tracking-[-0.02em] text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-6 text-white/68">
                    {item.body}
                  </p>
                </GlassPanel>
              );
            })}
          </div>
        </div>
      </SectionShell>

      {/* Why it matters */}
      <SectionShell className="py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
          <div>
            <p className="praetor-kicker">Why it matters</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-white md:text-5xl">
              Operational security for what runs after deployment.
            </h2>
          </div>
          <div className="grid gap-3">
            {whyItMatters.map((line, index) => (
              <GlassPanel key={index} className="rounded-xl p-5">
                <div className="flex gap-3">
                  <Hexagon
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#FF2020]"
                    aria-hidden
                  />
                  <p className="text-base leading-7 text-white/82">{line}</p>
                </div>
              </GlassPanel>
            ))}
          </div>
        </div>
      </SectionShell>

      {/* Technical proof */}
      <SectionShell className="praetor-section-cut py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <p className="praetor-kicker">Technical proof</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-white md:text-5xl">
              Built deterministically. Verifiable end-to-end.
            </h2>
          </div>
          <div className="mt-10 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {technicalProof.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="praetor-mini-card flex items-center gap-3 rounded-xl px-4 py-3.5"
                >
                  <span className="rounded-md border border-white/10 bg-[#0A0A0A] p-2 text-[#FF6B6B]">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <p className="text-sm font-bold text-white/86">
                    {item.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </SectionShell>

      {/* Core loop */}
      <SectionShell className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <p className="praetor-kicker">Core loop</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-white md:text-5xl">
              Detect → Attest → Challenge → Block
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/68">
              The same loop runs across the live devnet workflow, the operator
              dashboard, and the guided walkthrough.
            </p>
          </div>

          <GlassPanel className="mt-10 rounded-2xl p-8 md:p-10">
            <div className="grid gap-4 md:grid-cols-4">
              {[
                { label: "Detect", icon: Radar },
                { label: "Attest", icon: CheckCircle2 },
                { label: "Challenge", icon: KeyRound },
                { label: "Block", icon: Ban },
              ].map((step, index) => {
                const Icon = step.icon;
                const isLast = index === 3;
                return (
                  <div
                    key={step.label}
                    className={
                      "flex flex-col items-center justify-center gap-3 rounded-xl border px-5 py-7 text-center " +
                      (isLast
                        ? "border-[rgba(255,32,32,0.45)] bg-[rgba(122,7,16,0.16)]"
                        : "border-white/10 bg-[#0A0A0A]")
                    }
                  >
                    <span
                      className={
                        "rounded-md border p-2.5 " +
                        (isLast
                          ? "border-[rgba(255,32,32,0.55)] bg-[#7A0710] text-white"
                          : "border-white/10 bg-[#101010] text-[#FF6B6B]")
                      }
                    >
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-white/55">
                      0{index + 1}
                    </p>
                    <p className="text-2xl font-black tracking-[-0.02em] text-white">
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-[#0A0A0A] px-5 py-4">
              <div>
                <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-white/55">
                  Demo Incident
                </p>
                <p className="mt-1.5 text-sm font-bold text-white">
                  treasury_withdrawal · computed rule trace · Devnet memo proof
                </p>
              </div>
              <PremiumButtonLink href="/app" variant="crimson">
                Launch Devnet App
              </PremiumButtonLink>
            </div>
          </GlassPanel>
        </div>
      </SectionShell>
    </main>
  );
}
