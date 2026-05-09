"use client";

import { AnimatePresence, motion, useReducedMotion, type Transition } from "framer-motion";
import { AlertTriangle, BadgeCheck, Ban, FileCheck2, KeyRound, Radar, ShieldAlert } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { OperationalBadges } from "@/components/OperationalBadges";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { MetricCard } from "@/components/ui/MetricCard";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { SectionShell } from "@/components/ui/SectionShell";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { demoIncident, flowSteps, policyRules, protectedAddresses } from "@/lib/demo-data";
import type { Incident } from "@/lib/risk-engine";
import { cn } from "@/src/lib/utils";

type DemoStep = "ready" | "detected" | "attested" | "challenged" | "blocked";
const orderedStates: DemoStep[] = ["ready", "detected", "attested", "challenged", "blocked"];
const transition: Transition = { duration: 0.35, ease: [0.22, 1, 0.36, 1] };
const statusCopy: Record<DemoStep, string> = {
  ready: "Protocol profile armed. Trigger the simulated withdrawal to begin.",
  detected: "Critical incident detected with deterministic local risk logic.",
  attested: "Onchain security attestation prepared for Solana devnet.",
  challenged: "Guardian challenge submitted for operator review.",
  blocked: "Execution blocked by Praetor policy.",
};
const stepDetail: Record<DemoStep, string> = {
  ready: "Praetor is monitoring protected addresses and waiting for a privileged action.",
  detected: "The action breached withdrawal, signer, destination, and policy controls.",
  attested: "Evidence is packaged into a signed security record for transparent review.",
  challenged: "Guardians receive a challenge before the operation can proceed.",
  blocked: "The high-risk execution path is denied until policy risk is cleared.",
};
const stepIcons = [Radar, FileCheck2, KeyRound, Ban];
const actions = [
  { label: "Trigger Suspicious Withdrawal", helper: "Run a deterministic protocol incident simulation against the local incident endpoint." },
  { label: "Create Attestation", helper: "Package the finding into a signed security record." },
  { label: "Guardian Challenge", helper: "Escalate the attested incident to guardian review." },
  { label: "Attempt Execution", helper: "Attempt the risky operation so policy enforcement can block it." },
];

function CountUp({ value, active }: { value: number; active: boolean }) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(active ? value : 0);
  useEffect(() => {
    if (!active) return setDisplay(0);
    if (reduced) return setDisplay(value);
    let frame = 0;
    const id = window.setInterval(() => {
      frame += 1;
      setDisplay(Math.round((value * frame) / 22));
      if (frame >= 22) window.clearInterval(id);
    }, 18);
    return () => window.clearInterval(id);
  }, [active, reduced, value]);
  return <>{active ? display : "--"}</>;
}

export default function DemoPage() {
  const [step, setStep] = useState<DemoStep>("ready");
  const [incident, setIncident] = useState<Incident | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const activeIndex = useMemo(() => orderedStates.indexOf(step), [step]);
  const visibleIncident = incident ?? demoIncident;
  const progress = Math.max(0, (activeIndex / (orderedStates.length - 1)) * 100);

  async function triggerSuspiciousWithdrawal() {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/incidents/simulate", { method: "POST", headers: { "content-type": "application/json" } });
      if (!response.ok) throw new Error("Incident simulation failed");
      const data = (await response.json()) as { ok: boolean; incident: Incident };
      setIncident(data.incident);
      setStep("detected");
    } catch {
      setError("Unable to simulate incident. The local endpoint did not respond.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleAction(index: number) {
    if (index === 0) return void triggerSuspiciousWithdrawal();
    if (index === 1 && step === "detected") setStep("attested");
    if (index === 2 && step === "attested") setStep("challenged");
    if (index === 3 && step === "challenged") setStep("blocked");
  }

  return (
    <main className="overflow-hidden">
      <SectionShell className="py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={transition}>
            <GlassPanel className="p-6 md:p-8">
              <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                <div>
                  <StatusBadge tone="orange">Guided Walkthrough</StatusBadge>
                  <OperationalBadges className="mt-3" />
                  <h1 className="mt-6 max-w-5xl text-5xl font-black tracking-[-0.06em] text-white md:text-7xl">Non-wallet guided walkthrough.</h1>
                  <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--praetor-muted)]">Use this secondary path to review Detect → Attest → Challenge → Block without connecting a wallet. The live devnet product path is /app; this walkthrough uses a deterministic protocol incident simulation for judge-friendly review.</p>
                </div>
                <StatusBadge tone={step === "blocked" ? "online" : activeIndex > 0 ? "red" : "online"} pulse>{step === "blocked" ? "Policy enforced" : activeIndex > 0 ? "Incident active" : "Monitoring active"}</StatusBadge>
              </div>
            </GlassPanel>
          </motion.div>

          <section className="mt-6 grid gap-6 lg:grid-cols-[0.86fr_1.14fr]">
            <div className="space-y-6">
              <GlassPanel className="p-6">
                <p className="praetor-kicker">Onboarding panel</p>
                <h2 className="mt-3 text-3xl font-black text-white">DemoDAO Treasury</h2>
                <div className="mt-6 grid gap-3">
                  {[
                    ["Project Type", "DAO / Treasury"],
                    ["Monitoring status", "Active"],
                    ["Policy mode", "Challenge before execution"],
                  ].map(([k, v]) => (
                    <div key={k} className="praetor-mini-card flex items-center justify-between rounded-2xl px-4 py-3 text-sm">
                      <span className="text-[var(--praetor-muted)]">{k}</span><span className="font-bold text-white">{v}</span>
                    </div>
                  ))}
                </div>
              </GlassPanel>

              <GlassPanel className="p-6">
                <p className="praetor-kicker">Protected addresses</p>
                <div className="mt-5 space-y-3">
                  {protectedAddresses.map((address) => (
                    <div key={address.label} className="praetor-mini-card rounded-2xl p-4">
                      <div className="flex items-center justify-between gap-3"><p className="font-bold text-white">{address.label}</p><StatusBadge tone="online">{address.status}</StatusBadge></div>
                      <p className="mt-2 break-all font-mono text-xs text-[var(--praetor-cyan)]">{address.address}</p>
                    </div>
                  ))}
                </div>
              </GlassPanel>

              <GlassPanel className="p-6">
                <p className="praetor-kicker">Treasury policy</p>
                <ul className="mt-5 space-y-3">
                  {policyRules.map((rule) => <li key={rule} className="flex gap-3 text-[var(--praetor-muted)]"><span className="text-[var(--praetor-orange-soft)]">◆</span>{rule}</li>)}
                </ul>
              </GlassPanel>
            </div>

            <GlassPanel className="min-h-[780px] p-6 md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-5">
                <div>
                  <p className="praetor-kicker">Live incident console</p>
                  <AnimatePresence mode="wait">
                    <motion.h2 key={step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={transition} className="mt-3 max-w-2xl text-4xl font-black tracking-[-0.045em] text-white" aria-live="polite">{statusCopy[step]}</motion.h2>
                  </AnimatePresence>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--praetor-muted)]">{stepDetail[step]}</p>
                </div>
                <MetricCard label="Risk Score" value={<CountUp value={visibleIncident.riskScore} active={activeIndex >= 1} />} />
              </div>
              <div className="mt-6 rounded-3xl border border-white/15 bg-white/[0.055] p-5 text-center sm:hidden"><p className="text-5xl font-black text-red-100"><CountUp value={visibleIncident.riskScore} active={activeIndex >= 1} /></p></div>

              <div className="relative mt-10">
                <div className="absolute left-0 right-0 top-8 hidden h-px bg-white/15 sm:block" />
                <motion.div className="absolute left-0 top-8 hidden h-px bg-gradient-to-r from-[var(--praetor-orange)] via-[var(--praetor-cyan)] to-[var(--praetor-blue)] sm:block" animate={{ width: `${progress}%` }} transition={transition} />
                <div className="relative grid gap-3 sm:grid-cols-4">
                  {flowSteps.map((label, index) => {
                    const active = activeIndex === index + 1;
                    const done = activeIndex > index + 1 || (step === "blocked" && label === "Block");
                    const Icon = stepIcons[index];
                    return (
                      <motion.div key={label} animate={{ scale: active || done ? 1.02 : 1 }} transition={transition} className={cn("rounded-3xl border p-4 backdrop-blur-xl", done ? "border-[rgba(28,142,134,0.55)] bg-[rgba(28,142,134,0.16)]" : active ? "border-[rgba(255,130,0,0.62)] bg-[rgba(255,130,0,0.14)] shadow-[0_0_50px_rgba(255,130,0,0.16)]" : "border-white/12 bg-white/[0.045]")}>
                        <Icon className={cn("h-5 w-5", active ? "text-[var(--praetor-orange-soft)]" : done ? "text-teal-100" : "text-white/40")} />
                        <p className="mt-4 font-mono text-xs font-black text-white/50">0{index + 1}</p>
                        <p className="mt-2 font-black text-white">{label}</p>
                        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/50">{done ? "Verified" : active ? "Active" : "Standby"}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-8 rounded-3xl border border-white/15 bg-white/[0.055] p-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div><p className="text-sm text-[var(--praetor-muted)]">Action type</p><p className="mt-1 font-black text-white">{visibleIncident.actionType} • {visibleIncident.amount}</p><p className="mt-2 text-sm text-[var(--praetor-muted)]">Threshold: {visibleIncident.threshold} · Signer: {visibleIncident.signer} · Destination: {visibleIncident.destination}</p></div>
                  <StatusBadge tone={activeIndex >= 1 ? "red" : "muted"} pulse={activeIndex >= 1}>{activeIndex >= 1 ? "Critical" : "Armed"}</StatusBadge>
                </div>
                {activeIndex >= 1 && <div className="mt-6"><p className="font-mono text-xs font-black uppercase tracking-[0.2em] text-red-100">Reasons</p><ul className="mt-4 grid gap-3 sm:grid-cols-2">{visibleIncident.reasons.map((reason) => <li key={reason} className="rounded-2xl border border-[rgba(255,91,110,0.28)] bg-[rgba(255,91,110,0.11)] px-4 py-3 text-sm text-red-50">{reason}</li>)}</ul></div>}

                <AnimatePresence mode="wait">
                  {step === "attested" && <motion.div key="attested" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={transition} className="mt-6 rounded-3xl border border-[rgba(152,233,255,0.35)] bg-[rgba(152,233,255,0.11)] p-5"><BadgeCheck className="mr-2 inline h-5 w-5 text-[var(--praetor-cyan)]" />Onchain security attestation prepared for Solana devnet.</motion.div>}
                  {step === "challenged" && <motion.div key="challenged" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={transition} className="mt-6 rounded-3xl border border-[rgba(199,161,91,0.42)] bg-[rgba(199,161,91,0.12)] p-5 text-amber-100"><ShieldAlert className="mr-2 inline h-5 w-5" />Guardian challenge submitted.</motion.div>}
                  {step === "blocked" && <motion.div key="blocked" initial={{ opacity: 0, y: 14, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} transition={transition} className="mt-6 rounded-[2rem] border border-[rgba(28,142,134,0.55)] bg-[linear-gradient(135deg,rgba(28,142,134,0.22),rgba(255,130,0,0.11))] p-6"><div className="flex items-start gap-4"><Ban className="h-10 w-10 text-[var(--praetor-orange-soft)]" /><div><p className="text-4xl font-black tracking-[-0.045em] text-white">Execution blocked by Praetor policy.</p><p className="mt-3 text-[var(--praetor-muted)]">Treasury funds remain inside the protected perimeter and the incident trail is preserved.</p></div></div></motion.div>}
                </AnimatePresence>
              </div>

              {error && <div className="mt-5 rounded-2xl border border-red-400/40 bg-red-500/10 p-4 text-red-100"><AlertTriangle className="mr-2 inline h-4 w-4" />{error}</div>}

              <div className="mt-8 grid gap-3 sm:grid-cols-4">
                {actions.map((action, index) => {
                  const enabled = index === activeIndex;
                  return (
                    <div key={action.label} className="rounded-3xl border border-white/12 bg-white/[0.045] p-3">
                      <PremiumButton variant={enabled && index === 0 ? "orange" : enabled ? "glass" : "ghost"} disabled={!enabled || isLoading} onClick={() => handleAction(index)} className="w-full px-3 py-3 text-[10px]">{isLoading && index === 0 ? "Simulating…" : action.label}</PremiumButton>
                      <p className="mt-3 text-xs leading-5 text-[var(--praetor-muted)]">{action.helper}</p>
                    </div>
                  );
                })}
              </div>
            </GlassPanel>
          </section>
        </div>
      </SectionShell>
    </main>
  );
}
