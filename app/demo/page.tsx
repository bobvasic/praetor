"use client";

import { useMemo, useState } from "react";
import { Badge, Card } from "@/components/UI";
import { demoIncident, policyRules } from "@/lib/demo-data";

type DemoStep = "ready" | "detected" | "attested" | "challenged" | "blocked";

const stepCopy: Record<DemoStep, string> = {
  ready: "Protocol profile armed. Trigger the simulated transaction to begin.",
  detected: "Critical incident created with deterministic risk score 91.",
  attested:
    "Evidence bundle hashed and attestation prepared for onchain verification.",
  challenged:
    "Guardian challenge opened against the suspicious privileged action.",
  blocked: "Execution attempt denied. Final state: Blocked by Praetor.",
};

export default function DemoPage() {
  const [step, setStep] = useState<DemoStep>("ready");
  const activeIndex = useMemo(
    () =>
      ["ready", "detected", "attested", "challenged", "blocked"].indexOf(step),
    [step],
  );

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 md:py-16">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <Badge>Interactive guided demo</Badge>
          <h1 className="mt-5 text-4xl font-black tracking-tight text-white md:text-6xl">
            Demo Protocol Security Profile
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
            Walk through a protected treasury withdrawal as Praetor detects,
            attests, challenges, and blocks a critical operational risk.
          </p>
        </div>
        <div className="rounded-2xl border border-emerald-300/30 bg-emerald-300/10 px-5 py-3 text-sm font-bold text-emerald-100">
          Monitoring active
        </div>
      </div>

      <section className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <Card>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-cyanfire">
              Protected Treasury Wallet
            </p>
            <h2 className="mt-4 break-all text-2xl font-black text-white">
              {demoIncident.protectedWallet}
            </h2>
            <p className="mt-4 text-slate-300">
              Daily threshold:{" "}
              <span className="font-bold text-white">1,000 SOL</span>
            </p>
            <p className="text-slate-300">
              Guardian delay:{" "}
              <span className="font-bold text-white">15 minutes</span>
            </p>
          </Card>

          <Card>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-cyanfire">
              Security Policy
            </p>
            <ul className="mt-5 space-y-3">
              {policyRules.map((rule) => (
                <li key={rule} className="flex gap-3 text-slate-300">
                  <span className="text-cyanfire">✦</span>
                  {rule}
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <Card className="min-h-[620px]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-cyanfire">
                Live incident console
              </p>
              <h2 className="mt-3 text-3xl font-black text-white">
                {stepCopy[step]}
              </h2>
            </div>
            <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-200">
                Risk score
              </p>
              <p className="text-5xl font-black text-red-100">
                {activeIndex >= 1 ? demoIncident.riskScore : "--"}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-4">
            {["Detect", "Attest", "Challenge", "Block"].map((label, index) => (
              <div
                key={label}
                className={`rounded-2xl border p-4 ${activeIndex > index ? "border-cyan-300/40 bg-cyan-300/10" : "border-white/10 bg-white/5"}`}
              >
                <p className="text-xs font-bold text-slate-400">0{index + 1}</p>
                <p className="mt-2 font-black text-white">{label}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-3xl border border-white/10 bg-slate-950/60 p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-400">Action type</p>
                <p className="font-black text-white">
                  Treasury withdrawal • {demoIncident.amount}
                </p>
              </div>
              <Badge tone={activeIndex >= 1 ? "red" : "slate"}>
                {activeIndex >= 1 ? "Critical" : "Armed"}
              </Badge>
            </div>
            {activeIndex >= 1 && (
              <div className="mt-6">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-200">
                  Reasons
                </p>
                <ul className="mt-4 space-y-3">
                  {demoIncident.reasons.map((reason) => (
                    <li
                      key={reason}
                      className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-red-50"
                    >
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {step === "blocked" && (
              <div className="mt-6 rounded-3xl border border-cyan-300/30 bg-cyan-300/10 p-5">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyanfire">
                  Final state
                </p>
                <p className="mt-2 text-3xl font-black text-white">
                  Blocked by Praetor
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <button
              onClick={() => setStep("detected")}
              className="rounded-2xl bg-red-500 px-5 py-4 font-black text-white transition hover:bg-red-400"
            >
              Trigger Suspicious Withdrawal
            </button>
            <button
              disabled={activeIndex < 1}
              onClick={() => setStep("attested")}
              className="rounded-2xl bg-cyanfire px-5 py-4 font-black text-slate-950 transition disabled:cursor-not-allowed disabled:opacity-35"
            >
              Create Attestation
            </button>
            <button
              disabled={activeIndex < 2}
              onClick={() => setStep("challenged")}
              className="rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-5 py-4 font-black text-cyan-100 transition disabled:cursor-not-allowed disabled:opacity-35"
            >
              Guardian Challenge
            </button>
            <button
              disabled={activeIndex < 3}
              onClick={() => setStep("blocked")}
              className="rounded-2xl border border-white/15 bg-white px-5 py-4 font-black text-slate-950 transition disabled:cursor-not-allowed disabled:opacity-35"
            >
              Attempt Execution
            </button>
          </div>
        </Card>
      </section>
    </main>
  );
}
