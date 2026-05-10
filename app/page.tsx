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
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { OperationalBadges } from "@/components/OperationalBadges";
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
  { label: "Deterministic risk score: 91 Critical", icon: Activity },
] as const;

const consoleRows: Array<[string, string, "critical" | "info"]> = [
  ["PROTOCOL", "DemoDAO Treasury", "info"],
  ["NETWORK", "Solana Devnet", "info"],
  ["RPC", "QuickNode", "info"],
  ["RISK SCORE", "91 / 100", "critical"],
  ["RISK LEVEL", "Critical", "critical"],
  ["ATTESTATION", "Ready", "info"],
];

export default function HomePage() {
  return (
    <main className="relative overflow-hidden">
      {/* Hero */}
      <SectionShell className="relative py-16 md:py-24">
        <div className="praetor-honeycomb pointer-events-none absolute inset-0 opacity-[0.55]" aria-hidden />
        <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-6 lg:grid-cols-[0.96fr_1.04fr] lg:items-center">
          <div>
            <OperationalBadges />
            <p className="praetor-kicker mt-7">
              Onchain ops firewall · Solana protocols
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-black leading-[1.04] tracking-[-0.04em] text-white md:text-6xl xl:text-7xl">
              Onchain Ops Firewall for{" "}
              <span className="text-[#FF2020]">Solana</span> Protocols
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72 md:text-xl">
              Detect, attest, challenge, and block high-risk privileged actions
              before they can damage protocol operations.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <PremiumButtonLink href="/app" variant="crimson">
                Launch Devnet App <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </PremiumButtonLink>
              <PremiumButtonLink href="/dashboard" variant="glass">
                View Dashboard
              </PremiumButtonLink>
              <PremiumButtonLink href="/demo" variant="ghost">
                Guided Walkthrough
              </PremiumButtonLink>
            </div>
            <div className="mt-10 grid max-w-2xl gap-2.5 sm:grid-cols-3">
              {[
                "Real Solana Devnet attestation",
                "Verifiable on Solana Explorer",
                "Wallet signs client-side; no keys handled",
              ].map((item) => (
                <div
                  key={item}
                  className="praetor-mini-card flex items-start gap-2.5 rounded-xl px-3.5 py-3 text-sm text-white/72"
                >
                  <ShieldCheck
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#FF6B6B]"
                    aria-hidden
                  />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Security console preview */}
          <GlassPanel className="rounded-2xl p-0">
            <div className="p-6 md:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="praetor-kicker">Security console</p>
                  <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-white md:text-3xl">
                    DemoDAO Treasury
                  </h2>
                </div>
                <StatusBadge tone="online" pulse>
                  Monitoring
                </StatusBadge>
              </div>

              <div className="mt-6 rounded-xl border border-[rgba(255,32,32,0.32)] bg-[rgba(122,7,16,0.10)] p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#FF8888]">
                      Outcome
                    </p>
                    <p className="mt-2 text-2xl font-black tracking-[-0.03em] text-white md:text-3xl">
                      Execution blocked by Praetor policy.
                    </p>
                  </div>
                  <Ban
                    className="h-10 w-10 shrink-0 text-[#FF6B6B]"
                    aria-hidden
                  />
                </div>
              </div>

              <div className="mt-5 divide-y divide-white/[0.06] rounded-xl border border-white/10 bg-[#0A0A0A]">
                {consoleRows.map(([label, value, tone]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between gap-4 px-4 py-3"
                  >
                    <span className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-white/55">
                      {label}
                    </span>
                    <span
                      className={
                        tone === "critical"
                          ? "font-mono text-sm font-black tabular-nums text-[#FF6B6B]"
                          : "font-mono text-sm font-bold tabular-nums text-white"
                      }
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </GlassPanel>
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
