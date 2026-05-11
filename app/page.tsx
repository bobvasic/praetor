import {
  Activity,
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
import { GlassPanel } from "@/components/ui/GlassPanel";
import { PremiumButtonLink } from "@/components/ui/PremiumButton";
import { SectionShell } from "@/components/ui/SectionShell";

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
  { label: "Deterministic risk score: 91 Critical", icon: Activity },
] as const;

export default function HomePage() {
  return (
    <main className="relative overflow-hidden">
      {/* Hero */}
      <SectionShell className="relative isolate min-h-[760px] py-16 md:py-24 lg:min-h-[820px]">
        <video
          className="praetor-hero-video pointer-events-none absolute inset-0 -z-30 h-full w-full object-cover"
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
        <div className="praetor-hero-video-glow pointer-events-none absolute inset-0 -z-20" aria-hidden />
        <div className="praetor-hero-video-mask pointer-events-none absolute inset-0 -z-10" aria-hidden />
        <div className="praetor-honeycomb pointer-events-none absolute inset-0 -z-10 opacity-[0.22]" aria-hidden />

        <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="max-w-2xl py-8 md:py-14 lg:py-20">
            <p className="font-mono text-[11px] font-black uppercase tracking-[0.24em] text-[var(--praetor-crimson)]">
              Runtime threat perimeter
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-black leading-[1.04] tracking-normal text-white md:text-6xl xl:text-7xl">
              The protocol was audited.
              <br />
              The operation was not.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/72 md:text-xl">
              Praetor protects privileged Solana operations after launch.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <PremiumButtonLink href="/app" variant="crimson">
                Launch Devnet App
              </PremiumButtonLink>
              <PremiumButtonLink href="/dashboard" variant="glass">
                View Dashboard
              </PremiumButtonLink>
            </div>
            <p className="mt-4 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white/42">
              Solana Devnet • QuickNode RPC • Wallet-signed attestations • Non-custodial
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-[620px] pb-8 lg:pb-0">
            <div className="praetor-perimeter-wrap">
              <div className="praetor-module praetor-module-top-left">Treasury</div>
              <div className="praetor-module praetor-module-top-right">Signers</div>
              <div className="praetor-module praetor-module-bottom-left">Upgrade Authority</div>
              <div className="praetor-module praetor-module-bottom-right">Governance</div>

              <div className="praetor-threat-vector" aria-hidden>
                <span className="praetor-threat-endpoint" />
              </div>

              <div className="praetor-perimeter-core">
                <span className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-white/58">DemoDAO Treasury</span>
                <span className="mt-2 text-2xl font-black tracking-[0.06em] text-white">PROTECTED</span>
              </div>

              {Array.from({ length: 10 }).map((_, idx) => (
                <span key={idx} className="praetor-perimeter-node" data-node={idx} />
              ))}

              <div className="praetor-telemetry">
                <p><span>privileged_operation_detected</span></p>
                <p>risk_score: <strong>91</strong></p>
                <p>decision: <strong>block</strong></p>
                <p>attestation: <strong>recorded</strong></p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mx-auto mt-6 grid w-full max-w-7xl grid-cols-2 gap-2 px-6 md:grid-cols-4 md:gap-3">
          {[['1', 'Detect', 'Monitor'], ['2', 'Attest', 'Prove'], ['3', 'Challenge', 'Review'], ['4', 'Block', 'Stop']].map(([step, title, helper]) => (
            <div key={title} className="praetor-process-item">
              <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[var(--praetor-crimson)]">{step}</p>
              <p className="mt-1 text-sm font-black uppercase tracking-[0.08em] text-white">{title}</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/42">{helper}</p>
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
                  treasury_withdrawal · 25 SOL · threshold 10 SOL · risk 91
                  Critical
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
