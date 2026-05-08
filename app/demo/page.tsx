"use client";

import { useMemo, useState } from "react";
import { Badge, Card } from "@/components/UI";
import { demoIncident, flowSteps, policyRules, protectedAddresses } from "@/lib/demo-data";
import type { Incident } from "@/lib/risk-engine";

type DemoStep = "ready" | "detected" | "attested" | "challenged" | "blocked";

const orderedStates: DemoStep[] = [
  "ready",
  "detected",
  "attested",
  "challenged",
  "blocked",
];

const statusCopy: Record<DemoStep, string> = {
  ready: "Protocol profile armed. Trigger the simulated withdrawal to begin.",
  detected: "Critical incident detected with deterministic local risk logic.",
  attested: "Onchain security attestation prepared for Solana devnet.",
  challenged: "Guardian challenge submitted.",
  blocked: "Execution blocked by Praetor policy.",
};

export default function DemoPage() {
  const [step, setStep] = useState<DemoStep>("ready");
  const [incident, setIncident] = useState<Incident | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeIndex = useMemo(() => orderedStates.indexOf(step), [step]);

  async function triggerSuspiciousWithdrawal() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/incidents/simulate", {
        method: "POST",
        headers: { "content-type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Incident simulation failed");
      }

      const data = (await response.json()) as { ok: boolean; incident: Incident };
      setIncident(data.incident);
      setStep("detected");
    } catch {
      setError("Unable to simulate incident. The local endpoint did not respond.");
    } finally {
      setIsLoading(false);
    }
  }

  const visibleIncident = incident ?? demoIncident;

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 md:py-16">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <Badge>Interactive guided demo</Badge>
          <h1 className="mt-5 text-4xl font-black tracking-[-0.04em] text-white md:text-6xl">
            PRAETOR protocol firewall simulation
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-titanium/[0.78]">
            Walk a DemoDAO treasury action through Detect, Attest, Challenge,
            and Block with deterministic local demo data.
          </p>
        </div>
        <Badge tone="green">Monitoring status: Active</Badge>
      </div>

      <section className="mt-10 grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="space-y-6">
          <Card>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-arctic">
              Protocol Security Profile
            </p>
            <h2 className="mt-4 text-3xl font-black text-white">
              DemoDAO Treasury
            </h2>
            <div className="mt-6 grid gap-3 text-sm">
              <div className="flex items-center justify-between rounded-xl border border-titanium/[0.10] bg-obsidian/[0.55] px-4 py-3">
                <span className="text-titanium/[0.58]">Project Type</span>
                <span className="font-bold text-white">DAO / Treasury</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-titanium/[0.10] bg-obsidian/[0.55] px-4 py-3">
                <span className="text-titanium/[0.58]">Monitoring status</span>
                <span className="font-bold text-teal-100">Active</span>
              </div>
            </div>
          </Card>

          <Card>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-arctic">
              Protected Addresses
            </p>
            <div className="mt-5 space-y-3">
              {protectedAddresses.map((address) => (
                <div
                  key={address.label}
                  className="rounded-xl border border-titanium/[0.10] bg-obsidian/[0.55] p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-bold text-white">{address.label}</p>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-teal-100">
                      {address.status}
                    </span>
                  </div>
                  <p className="mt-2 break-all font-mono text-xs text-arctic/[0.76]">
                    {address.address}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-arctic">
              Policy
            </p>
            <ul className="mt-5 space-y-3">
              {policyRules.map((rule) => (
                <li key={rule} className="flex gap-3 text-titanium/[0.78]">
                  <span className="text-gold">◆</span>
                  {rule}
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <Card className="min-h-[700px]">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-arctic">
                Live Incident Console
              </p>
              <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-[-0.025em] text-white">
                {statusCopy[step]}
              </h2>
            </div>
            <div className="rounded-2xl border border-alert/[0.30] bg-alert/[0.10] p-4 text-center">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-red-100">
                Risk Score
              </p>
              <p className="mt-1 text-5xl font-black text-red-100">
                {activeIndex >= 1 ? visibleIncident.riskScore : "--"}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-4">
            {flowSteps.map((label, index) => {
              const completed = activeIndex > index + 1;
              const active = activeIndex === index + 1;
              const final = step === "blocked" && label === "Block";

              return (
                <div
                  key={label}
                  className={`rounded-2xl border p-4 transition ${
                    final
                      ? "border-gold/[0.45] bg-gold/[0.10] shadow-gold"
                      : completed
                        ? "border-secure/[0.45] bg-secure/[0.15]"
                        : active
                          ? "border-arctic/[0.45] bg-arctic/[0.10] shadow-glow"
                          : "border-titanium/[0.10] bg-obsidian/[0.52]"
                  }`}
                >
                  <p className="font-mono text-xs font-bold text-titanium/[0.54]">
                    0{index + 1}
                  </p>
                  <p className="mt-2 font-black text-white">{label}</p>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-titanium/[0.54]">
                    {completed ? "Verified" : active ? "Active" : "Standby"}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 rounded-2xl border border-titanium/[0.10] bg-obsidian/[0.62] p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm text-titanium/[0.58]">Action type</p>
                <p className="mt-1 font-black text-white">
                  {visibleIncident.actionType} • {visibleIncident.amount}
                </p>
                <p className="mt-2 text-sm text-titanium/[0.68]">
                  Threshold: {visibleIncident.threshold} · Signer:{" "}
                  {visibleIncident.signer} · Destination:{" "}
                  {visibleIncident.destination}
                </p>
              </div>
              <Badge tone={activeIndex >= 1 ? "red" : "slate"}>
                {activeIndex >= 1 ? "Critical" : "Armed"}
              </Badge>
            </div>

            {activeIndex >= 1 && (
              <div className="mt-6">
                <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-red-100">
                  Reasons
                </p>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {visibleIncident.reasons.map((reason) => (
                    <li
                      key={reason}
                      className="rounded-xl border border-alert/[0.22] bg-alert/[0.10] px-4 py-3 text-sm text-red-50"
                    >
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {step === "attested" && (
              <div className="mt-6 rounded-2xl border border-arctic/[0.25] bg-arctic/[0.10] p-5">
                <p className="text-white">
                  Onchain security attestation prepared for Solana devnet.
                </p>
                <a
                  href="https://explorer.solana.com/?cluster=devnet"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex font-mono text-xs uppercase tracking-[0.18em] text-arctic underline decoration-arctic/[0.35] underline-offset-4"
                >
                  Mock tx link · explorer.solana.com/?cluster=devnet
                </a>
              </div>
            )}

            {step === "challenged" && (
              <div className="mt-6 rounded-2xl border border-sovereign/[0.35] bg-sovereign/[0.15] p-5 text-blue-100">
                Guardian challenge submitted.
              </div>
            )}

            {step === "blocked" && (
              <div className="mt-6 rounded-2xl border border-gold/[0.45] bg-gold/[0.10] p-6 shadow-gold">
                <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-amber-100">
                  Final security state
                </p>
                <p className="mt-3 text-4xl font-black tracking-[-0.03em] text-white">
                  Execution blocked by Praetor policy.
                </p>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-5 rounded-xl border border-alert/[0.35] bg-alert/[0.10] px-4 py-3 text-red-100">
              {error}
            </div>
          )}

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <button
              onClick={triggerSuspiciousWithdrawal}
              disabled={isLoading}
              className="rounded-md border border-alert/[0.40] bg-alert/[0.90] px-5 py-4 font-mono text-xs font-black uppercase tracking-[0.16em] text-white transition hover:bg-alert disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Simulating..." : "Trigger Suspicious Withdrawal"}
            </button>
            <button
              disabled={activeIndex < 1}
              onClick={() => setStep("attested")}
              className="rounded-md bg-gradient-to-r from-sovereign to-arctic px-5 py-4 font-mono text-xs font-black uppercase tracking-[0.16em] text-obsidian transition disabled:cursor-not-allowed disabled:opacity-35"
            >
              Create Attestation
            </button>
            <button
              disabled={activeIndex < 2}
              onClick={() => setStep("challenged")}
              className="rounded-md border border-arctic/[0.35] bg-arctic/[0.10] px-5 py-4 font-mono text-xs font-black uppercase tracking-[0.16em] text-arctic transition hover:bg-arctic/[0.15] disabled:cursor-not-allowed disabled:opacity-35"
            >
              Guardian Challenge
            </button>
            <button
              disabled={activeIndex < 3}
              onClick={() => setStep("blocked")}
              className="rounded-md border border-gold/[0.45] bg-gold/[0.10] px-5 py-4 font-mono text-xs font-black uppercase tracking-[0.16em] text-amber-100 transition hover:bg-gold/[0.20] disabled:cursor-not-allowed disabled:opacity-35"
            >
              Attempt Execution
            </button>
          </div>
        </Card>
      </section>
    </main>
  );
}
