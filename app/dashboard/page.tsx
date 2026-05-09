import { AlertTriangle, Ban, Coins, KeyRound, LockKeyhole, Radar, ShieldCheck } from "lucide-react";
import { FadeUp, HoverLift } from "@/components/motion/Reveal";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { MetricCard } from "@/components/ui/MetricCard";
import { PremiumButtonLink } from "@/components/ui/PremiumButton";
import { SectionShell } from "@/components/ui/SectionShell";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { demoIncident, protectedAddresses } from "@/lib/demo-data";

const metrics = [
  { label: "Monitoring", value: "Active", status: "Live perimeter", tone: "green" as const },
  { label: "Protected Addresses", value: "4", status: "Treasury + authority", tone: "cyan" as const },
  { label: "Critical Incidents", value: "1", status: "Review now", tone: "red" as const },
  { label: "Latest Risk", value: "91", status: "Severe", tone: "orange" as const },
];

const signals = [
  { label: "Treasury Policy", value: "10 SOL max", icon: Coins },
  { label: "Upgrade Authority", value: "Guarded", icon: KeyRound },
  { label: "Guardian Challenge", value: "Required", icon: LockKeyhole },
];

export default function DashboardPage() {
  return (
    <main className="overflow-hidden">
      <SectionShell className="py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-6">
          <FadeUp>
            <GlassPanel className="p-6 md:p-8">
              <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                <div>
                  <div className="flex flex-wrap gap-3">
                    <StatusBadge tone="orange">Security command center</StatusBadge>
                    <StatusBadge tone="online" pulse>All Systems Online</StatusBadge>
                    <StatusBadge tone="devnet">Solana Devnet</StatusBadge>
                  </div>
                  <h1 className="mt-6 max-w-4xl text-5xl font-black tracking-[-0.06em] text-white md:text-7xl">Praetor monitoring console.</h1>
                  <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--praetor-muted)]">A frosted institutional ops shell for protected addresses, latest incident evidence, risk posture, and policy enforcement readiness.</p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-end">
                  <StatusBadge tone="online" pulse>Live monitoring</StatusBadge>
                  <PremiumButtonLink href="/demo">Open Guided Demo</PremiumButtonLink>
                </div>
              </div>
            </GlassPanel>
          </FadeUp>

          <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric, index) => (
              <HoverLift key={metric.label} delay={index * 0.04}>
                <MetricCard {...metric} />
              </HoverLift>
            ))}
          </section>

          <section className="mt-6 grid gap-6 lg:grid-cols-[1.12fr_0.88fr]">
            <FadeUp delay={0.08}>
              <GlassPanel className="min-h-full p-6 md:p-7">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="praetor-kicker">Protocol perimeter</p>
                    <h2 className="mt-3 text-4xl font-black tracking-[-0.045em] text-white">DemoDAO Treasury posture</h2>
                  </div>
                  <StatusBadge tone="online">Armed</StatusBadge>
                </div>

                <div className="mt-7 grid gap-4 sm:grid-cols-2">
                  {protectedAddresses.map((address) => (
                    <div key={address.label} className="praetor-mini-card rounded-3xl p-5 transition duration-300 hover:-translate-y-1 hover:border-[rgba(255,130,0,0.42)]">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-lg font-black text-white">{address.label}</p>
                        <StatusBadge tone="online">{address.status}</StatusBadge>
                      </div>
                      <p className="mt-3 break-all font-mono text-xs leading-5 text-[var(--praetor-cyan)]">{address.address}</p>
                      <p className="mt-4 text-sm leading-6 text-[var(--praetor-muted)]">{address.policy}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  {signals.map((signal) => {
                    const Icon = signal.icon;
                    return (
                      <div key={signal.label} className="rounded-3xl border border-white/15 bg-white/[0.055] p-5">
                        <Icon className="h-6 w-6 text-[var(--praetor-orange-soft)]" />
                        <p className="mt-4 font-mono text-xs font-black uppercase tracking-[0.2em] text-[var(--praetor-muted)]">{signal.label}</p>
                        <p className="mt-2 text-xl font-black text-white">{signal.value}</p>
                      </div>
                    );
                  })}
                </div>
              </GlassPanel>
            </FadeUp>

            <div className="space-y-6">
              <FadeUp delay={0.12}>
                <GlassPanel className="border-[rgba(255,91,110,0.38)] p-6 md:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-xs font-black uppercase tracking-[0.22em] text-red-100">Latest Incident</p>
                      <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white">Treasury withdrawal above threshold</h2>
                    </div>
                    <StatusBadge tone="red" pulse>Critical</StatusBadge>
                  </div>
                  <div className="mt-6 rounded-3xl border border-[rgba(255,91,110,0.32)] bg-[rgba(255,91,110,0.11)] p-5">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="text-sm text-[var(--praetor-muted)]">{demoIncident.protocolName}</p>
                        <p className="mt-2 text-6xl font-black text-red-100">{demoIncident.riskScore}</p>
                      </div>
                      <AlertTriangle className="h-11 w-11 text-red-100" aria-hidden />
                    </div>
                    <p className="mt-4 text-sm leading-6 text-red-50/85">{demoIncident.amount} requested by {demoIncident.signer.toLowerCase()} to a {demoIncident.destination.toLowerCase()}. Unsafe operation is held until guardian review clears the policy risk.</p>
                  </div>
                  <PremiumButtonLink href="/demo" variant="danger" className="mt-6 w-full">Investigate in Demo</PremiumButtonLink>
                </GlassPanel>
              </FadeUp>

              <FadeUp delay={0.16}>
                <GlassPanel className="p-6">
                  <div className="flex items-center gap-3">
                    <Radar className="h-5 w-5 text-[var(--praetor-cyan)]" />
                    <p className="praetor-kicker">Monitoring status</p>
                  </div>
                  <div className="mt-6 space-y-3">
                    {["Webhooks receiving", "Policy engine armed", "Guardian challenge ready"].map((row) => (
                      <div key={row} className="praetor-mini-card flex items-center justify-between rounded-2xl px-4 py-3">
                        <span className="text-[var(--praetor-muted)]">{row}</span>
                        <StatusBadge tone="online">OK</StatusBadge>
                      </div>
                    ))}
                  </div>
                </GlassPanel>
              </FadeUp>
            </div>
          </section>

          <FadeUp delay={0.2} className="mt-6">
            <GlassPanel className="p-7 md:p-8">
              <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-center">
                <div>
                  <StatusBadge tone="devnet">Operational assurance</StatusBadge>
                  <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] text-white md:text-4xl">Command-center readiness for treasury and authority events.</h2>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    ["Detect", Radar],
                    ["Attest", ShieldCheck],
                    ["Block", Ban],
                  ].map(([item, Icon]) => {
                    const IconComp = Icon as typeof Radar;
                    return (
                      <div key={item as string} className="praetor-mini-card rounded-2xl p-4">
                        <IconComp className="h-5 w-5 text-[var(--praetor-orange-soft)]" />
                        <p className="mt-4 font-black text-white">{item as string}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </GlassPanel>
          </FadeUp>
        </div>
      </SectionShell>
    </main>
  );
}
