import { ArrowRight, Ban, CheckCircle2, LockKeyhole, Radar, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { Wordmark } from "@/components/Brand";
import { OperationalBadges } from "@/components/OperationalBadges";
import { PraetorHeroMedia } from "@/components/hero/PraetorHeroMedia";
import { FadeUp, HoverLift } from "@/components/motion/Reveal";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { MetricCard } from "@/components/ui/MetricCard";
import { PremiumButtonLink } from "@/components/ui/PremiumButton";
import { SectionShell } from "@/components/ui/SectionShell";
import { SharpDivider } from "@/components/ui/SharpDivider";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { demoIncident, flowSteps, protectedAddresses } from "@/lib/demo-data";

const consoleRows = [
  ["PERIMETER", "DemoDAO Treasury", "ACTIVE"],
  ["SIGNER", "Unknown signer", "CRITICAL"],
  ["DESTINATION", "Non-allowlisted wallet", "CRITICAL"],
  ["POLICY", "Guardian challenge required", "ARMED"],
];

const sections = [
  { title: "Detect", body: "Score treasury movement, signer identity, privileged instructions, and destination context before execution settles.", icon: Radar },
  { title: "Attest", body: "Convert incident evidence into a reviewable Solana security record operators can trust.", icon: CheckCircle2 },
  { title: "Challenge", body: "Route critical operations through guardian review while preserving the exact incident trail.", icon: LockKeyhole },
  { title: "Block", body: "Deny unsafe operations while unresolved policy risk remains attached to the action.", icon: Ban },
];

export default function Home() {
  return (
    <main className="overflow-hidden">
      <SectionShell className="min-h-[calc(100vh-5rem)] py-10 md:flex md:items-center md:py-16">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 lg:grid-cols-[0.96fr_1.04fr] lg:items-center">
          <FadeUp>
            <div className="mb-6 lg:hidden">
              <PraetorHeroMedia />
            </div>
            <GlassPanel className="p-6 md:p-9">
              <OperationalBadges />
              <div className="mt-8 max-w-sm"><Wordmark /></div>
              <p className="praetor-kicker mt-10">Praetor live devnet ops firewall</p>
              <h1 className="praetor-heading mt-5 max-w-5xl text-5xl font-black md:text-7xl xl:text-8xl">
                Praetor is live for Solana devnet protocols.
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-[var(--praetor-muted)] md:text-xl">
                Praetor is an onchain ops firewall for Solana protocols: QuickNode RPC-backed monitoring, real devnet attestations, guardian-ready challenge evidence, and blocked execution state for high-risk treasury or authority actions.
              </p>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <PremiumButtonLink href="/app">Launch Devnet App <ArrowRight className="ml-2 h-4 w-4" /></PremiumButtonLink>
                <PremiumButtonLink href="/dashboard" variant="glass">View Dashboard</PremiumButtonLink>
              </div>
              <a href="/demo" className="mt-5 inline-flex font-mono text-xs font-black uppercase tracking-[0.2em] text-[var(--praetor-muted)] transition hover:text-[var(--praetor-cyan)]">Guided Walkthrough for non-wallet review</a>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {["Create a real Solana devnet attestation", "Verify on Solana Explorer", "Wallet signs client-side; no keys handled"].map((item) => (
                  <div key={item} className="praetor-mini-card rounded-2xl px-4 py-3 text-sm text-[var(--praetor-muted)]">
                    <ShieldCheck className="mb-2 h-4 w-4 text-[var(--praetor-orange-soft)]" />{item}
                  </div>
                ))}
              </div>
            </GlassPanel>
          </FadeUp>

          <FadeUp delay={0.12}>
            <div className="hidden lg:block">
              <PraetorHeroMedia />
            </div>
            <GlassPanel className="praetor-console-grid relative mt-6 min-h-[620px] p-0">
              <div className="absolute inset-x-0 top-0 h-2 praetor-console-line" />
              <div className="p-6 md:p-8">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="praetor-kicker">Security console</p>
                    <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white md:text-4xl">DemoDAO Treasury Perimeter</h2>
                  </div>
                  <StatusBadge tone="online" pulse>Monitoring</StatusBadge>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <MetricCard label="Risk Score" value={String(demoIncident.riskScore)} tone="red" status="Critical incident" />
                  <MetricCard label="Protected Routes" value={String(protectedAddresses.length)} tone="cyan" status="Treasury + authority" />
                </div>

                <div className="mt-6 rounded-[1.75rem] border border-[rgba(255,130,0,0.34)] bg-[rgba(255,130,0,0.10)] p-5 shadow-[0_24px_90px_rgba(255,130,0,0.10)]">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-mono text-xs font-black uppercase tracking-[0.22em] text-[var(--praetor-orange-soft)]">Outcome</p>
                      <p className="mt-3 text-3xl font-black tracking-[-0.04em] text-white">Execution blocked by Praetor policy.</p>
                    </div>
                    <Ban className="h-12 w-12 text-[var(--praetor-orange-soft)]" aria-hidden />
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {consoleRows.map(([k, v, s]) => (
                    <div key={k} className="praetor-mini-card flex items-center justify-between gap-4 rounded-2xl px-4 py-3">
                      <span className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-[var(--praetor-muted)]">{k}</span>
                      <span className="text-sm font-bold text-white">{v}</span>
                      <span className={s === "CRITICAL" ? "font-mono text-[10px] text-red-100" : "font-mono text-[10px] text-teal-100"}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </GlassPanel>
          </FadeUp>
        </div>
      </SectionShell>

      <SharpDivider />

      <SectionShell id="flow" className="praetor-section-cut bg-[rgba(18,27,43,0.72)]">
        <div className="mx-auto max-w-7xl px-6">
          <FadeUp className="max-w-3xl">
            <StatusBadge tone="orange">Operational flow</StatusBadge>
            <h2 className="mt-5 text-4xl font-black tracking-[-0.05em] text-white md:text-6xl">Sharp controls for privileged Solana operations.</h2>
          </FadeUp>
          <div className="mt-10 grid gap-5 md:grid-cols-4">
            {sections.map((item, index) => {
              const Icon = item.icon;
              return (
                <HoverLift key={item.title} delay={index * 0.05}>
                  <GlassPanel className="h-full p-6">
                    <Icon className="h-7 w-7 text-[var(--praetor-orange-soft)]" />
                    <p className="mt-6 font-mono text-xs font-black uppercase tracking-[0.24em] text-[var(--praetor-muted)]">0{index + 1}</p>
                    <h3 className="mt-2 text-2xl font-black text-white">{flowSteps[index]}</h3>
                    <p className="mt-3 text-sm leading-6 text-[var(--praetor-muted)]">{item.body}</p>
                  </GlassPanel>
                </HoverLift>
              );
            })}
          </div>
        </div>
      </SectionShell>

      <SharpDivider flip />

      <SectionShell>
        <div className="mx-auto grid max-w-7xl gap-6 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <FadeUp>
            <GlassPanel className="p-8">
              <Sparkles className="h-8 w-8 text-[var(--praetor-orange-soft)]" />
              <h2 className="mt-5 text-4xl font-black tracking-[-0.05em] text-white md:text-5xl">Built for hackathon demo clarity and institutional operator confidence.</h2>
              <p className="mt-5 text-lg leading-8 text-[var(--praetor-muted)]">Every surface uses the same navy/orange glass system, animated Solana network symbolism, readable status hierarchy, and decisive policy outcomes.</p>
            </GlassPanel>
          </FadeUp>
          <div className="grid gap-4 sm:grid-cols-2">
            {["All Systems Online", "Solana Devnet", "Guardian Review", "Policy Block"].map((item, i) => (
              <GlassPanel key={item} className="p-5">
                <Zap className="h-5 w-5 text-[var(--praetor-cyan)]" />
                <p className="mt-4 text-xl font-black text-white">{item}</p>
                <p className="mt-2 text-sm text-[var(--praetor-muted)]">{i === 3 ? "Unsafe execution is denied." : "Visible throughout the product experience."}</p>
              </GlassPanel>
            ))}
          </div>
        </div>
      </SectionShell>
    </main>
  );
}
