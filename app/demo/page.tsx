"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
} from "framer-motion";
import {
  AlertTriangle,
  BadgeCheck,
  Ban,
  FileCheck2,
  KeyRound,
  LockKeyhole,
  Radar,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Badge, Card, Container, Section } from "@/components/UI";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Tooltip, TooltipProvider } from "@/src/components/ui/tooltip";
import { cn } from "@/src/lib/utils";
import {
  demoIncident,
  flowSteps,
  policyRules,
  protectedAddresses,
} from "@/lib/demo-data";
import type { Incident } from "@/lib/risk-engine";

type DemoStep = "ready" | "detected" | "attested" | "challenged" | "blocked";

const orderedStates: DemoStep[] = [
  "ready",
  "detected",
  "attested",
  "challenged",
  "blocked",
];

const defaultTransition: Transition = {
  duration: 0.38,
  ease: [0.22, 1, 0.36, 1],
};

const quickTransition: Transition = {
  duration: 0.24,
  ease: [0.22, 1, 0.36, 1],
};

const statusCopy: Record<DemoStep, string> = {
  ready: "Protocol profile armed. Trigger the simulated withdrawal to begin.",
  detected: "Critical incident detected with deterministic local risk logic.",
  attested: "Onchain security attestation prepared for Solana devnet.",
  challenged: "Guardian challenge submitted for operator review.",
  blocked: "Execution blocked by Praetor policy.",
};

const stepDetail: Record<DemoStep, string> = {
  ready:
    "Praetor is monitoring protected addresses and waiting for a privileged action.",
  detected:
    "The action breached withdrawal, signer, destination, and policy controls.",
  attested:
    "Evidence is packaged into a signed security record for transparent review.",
  challenged: "Guardians receive a challenge before the operation can proceed.",
  blocked:
    "The high-risk execution path is denied until policy risk is cleared.",
};

const stepIcons = [Radar, FileCheck2, KeyRound, Ban];
const perimeterAddresses = protectedAddresses.slice(0, 3);

const demoActions: Array<{
  label: string;
  helper: string;
  lockedLabel: string;
}> = [
  {
    label: "Trigger Suspicious Withdrawal",
    helper:
      "Start by simulating a privileged treasury withdrawal against the local incident endpoint.",
    lockedLabel: "Incident simulation",
  },
  {
    label: "Create Attestation",
    helper:
      "Evidence is ready. Package the finding into a signed security record.",
    lockedLabel: "Attestation",
  },
  {
    label: "Guardian Challenge",
    helper:
      "Escalate the attested incident to guardian review before execution can proceed.",
    lockedLabel: "Guardian review",
  },
  {
    label: "Attempt Execution",
    helper:
      "Attempt the risky operation so Praetor can enforce the policy block.",
    lockedLabel: "Policy enforcement",
  },
];

function CountUp({ value, active }: { value: number; active: boolean }) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(active ? value : 0);

  useEffect(() => {
    if (!active) {
      setDisplay(0);
      return;
    }
    if (reduced) {
      setDisplay(value);
      return;
    }
    let frame = 0;
    const total = 22;
    const id = window.setInterval(() => {
      frame += 1;
      setDisplay(Math.round((value * frame) / total));
      if (frame >= total) window.clearInterval(id);
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
  const progress = Math.max(
    0,
    (activeIndex / (orderedStates.length - 1)) * 100,
  );

  async function triggerSuspiciousWithdrawal() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/incidents/simulate", {
        method: "POST",
        headers: { "content-type": "application/json" },
      });

      if (!response.ok) throw new Error("Incident simulation failed");

      const data = (await response.json()) as {
        ok: boolean;
        incident: Incident;
      };
      setIncident(data.incident);
      setStep("detected");
    } catch {
      setError(
        "Unable to simulate incident. The local endpoint did not respond.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <TooltipProvider>
      <main>
        <Section spacing="compact">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={defaultTransition}
              className="premium-shell demo-theater rounded-[2rem] p-6 md:p-8 flex flex-col justify-between gap-6 md:flex-row md:items-end"
            >
              <div>
                <div className="flex flex-wrap gap-3">
                  <Badge>Interactive guided demo</Badge>
                  <span className="status-badge-premium inline-flex items-center gap-2 px-3.5 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-teal-100">
                    <span className="live-pulse-dot h-2 w-2 rounded-full bg-secure" />
                    All Systems Online
                  </span>
                  <span className="status-badge-premium solana-pill inline-flex items-center gap-2 px-3.5 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-arctic">
                    Solana Devnet
                  </span>
                </div>
                <h1 className="mt-5 text-4xl font-black tracking-[-0.045em] text-white md:text-6xl">
                  PRAETOR protocol firewall simulation
                </h1>
                <p className="mt-4 max-w-3xl text-lg leading-8 text-titanium/[0.78]">
                  Enter a premium command-center walkthrough for a DemoDAO
                  treasury action. Follow the exact security narrative: Detect →
                  Attest → Challenge → Block.
                </p>
              </div>
              <div className="flex flex-col items-start gap-3 md:items-end">
                <Badge tone="green" pulse>
                  <span className="live-pulse-dot h-2 w-2 rounded-full bg-secure" />
                  Monitoring status: Active
                </Badge>
                <Dialog>
                  <DialogTrigger className="font-mono text-xs uppercase tracking-[0.18em] text-arctic underline decoration-arctic/[0.35] underline-offset-4 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arctic/70">
                    How Praetor works
                  </DialogTrigger>
                  <DialogContent>
                    <Badge tone="blue">Protocol context</Badge>
                    <DialogTitle className="mt-5 text-3xl font-black tracking-[-0.03em] text-white">
                      What is a protocol?
                    </DialogTitle>
                    <DialogDescription className="mt-4 text-base leading-7 text-titanium/[0.82]">
                      In Praetor, a protocol means the Solana project, DAO,
                      treasury, app, or smart contract system you want to
                      protect.
                    </DialogDescription>
                  </DialogContent>
                </Dialog>
              </div>
            </motion.div>

            <section className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...defaultTransition, delay: 0.08 }}
                className="space-y-6"
              >
                <Card className="premium-shell rounded-2xl">
                  <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-arctic">
                    Protocol Security Profile
                  </p>
                  <h2 className="mt-4 text-3xl font-black text-white">
                    DemoDAO Treasury
                  </h2>
                  <div className="mt-6 grid gap-3 text-sm">
                    <div className="flex items-center justify-between rounded-xl border border-titanium/[0.10] bg-obsidian/[0.55] px-4 py-3">
                      <span className="text-titanium/[0.58]">Project Type</span>
                      <span className="font-bold text-white">
                        DAO / Treasury
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-titanium/[0.10] bg-obsidian/[0.55] px-4 py-3">
                      <span className="text-titanium/[0.58]">
                        Monitoring status
                      </span>
                      <span className="font-bold text-teal-100">Active</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-titanium/[0.10] bg-obsidian/[0.55] px-4 py-3">
                      <span className="text-titanium/[0.58]">Policy mode</span>
                      <span className="font-bold text-amber-100">
                        Challenge before execution
                      </span>
                    </div>
                  </div>
                </Card>

                <Card>
                  <Tooltip content="Protected Addresses are monitored Solana addresses where Praetor evaluates privileged activity and treasury movement.">
                    <p
                      tabIndex={0}
                      className="inline-flex rounded-md font-mono text-xs font-bold uppercase tracking-[0.22em] text-arctic focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arctic/70"
                    >
                      Protected Addresses
                    </p>
                  </Tooltip>
                  <div className="mt-5 space-y-3">
                    {protectedAddresses.map((address) => (
                      <div
                        key={address.label}
                        className="rounded-xl border border-titanium/[0.10] bg-obsidian/[0.55] p-4 transition duration-300 hover:-translate-y-0.5 hover:border-arctic/[0.24] hover:bg-arctic/[0.055]"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-bold text-white">
                            {address.label}
                          </p>
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
                  <Tooltip content="Treasury Policy defines transaction limits and review rules for protected protocol funds.">
                    <p
                      tabIndex={0}
                      className="inline-flex rounded-md font-mono text-xs font-bold uppercase tracking-[0.22em] text-arctic focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arctic/70"
                    >
                      Treasury Policy
                    </p>
                  </Tooltip>
                  <ul className="mt-5 space-y-3">
                    {policyRules.map((rule) => (
                      <li
                        key={rule}
                        className="flex gap-3 text-titanium/[0.78]"
                      >
                        <span className="text-gold">◆</span>
                        {rule}
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...defaultTransition, delay: 0.14 }}
              >
                <Card variant="hero" className="demo-theater min-h-[760px]">
                  <div className="flex flex-wrap items-start justify-between gap-5">
                    <div>
                      <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-arctic">
                        Live Incident Console
                      </p>
                      <AnimatePresence mode="wait">
                        <motion.h2
                          aria-live="polite"
                          key={step}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={quickTransition}
                          className="mt-3 max-w-2xl text-3xl font-black tracking-[-0.025em] text-white"
                        >
                          {statusCopy[step]}
                        </motion.h2>
                      </AnimatePresence>
                      <p className="mt-3 max-w-2xl text-sm leading-6 text-titanium/[0.68]">
                        {stepDetail[step]}
                      </p>
                    </div>
                    <Tooltip content="Risk Score is Praetor's severity signal for a privileged action, combining amount, signer, destination, and policy context.">
                      <div
                        tabIndex={0}
                        className="liquid-glass rounded-2xl border-alert/[0.30] p-4 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arctic/70"
                      >
                        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-red-100">
                          Risk Score
                        </p>
                        <p className="risk-glow mt-1 text-5xl font-black text-red-100">
                          <CountUp
                            value={visibleIncident.riskScore}
                            active={activeIndex >= 1}
                          />
                        </p>
                      </div>
                    </Tooltip>
                  </div>

                  <div className="relative mt-8">
                    <div className="absolute left-0 right-0 top-1/2 hidden h-px -translate-y-1/2 bg-titanium/[0.12] sm:block" />
                    <motion.div
                      className="flow-connector absolute left-0 top-1/2 hidden h-px -translate-y-1/2 bg-gradient-to-r from-sovereign to-arctic sm:block"
                      animate={{ width: `${progress}%` }}
                      transition={defaultTransition}
                    />
                    <div className="relative grid gap-3 sm:grid-cols-4">
                      {flowSteps.map((label, index) => {
                        const completed = activeIndex > index + 1;
                        const active = activeIndex === index + 1;
                        const final = step === "blocked" && label === "Block";
                        const Icon = stepIcons[index];
                        return (
                          <motion.div
                            key={label}
                            aria-current={active || final ? "step" : undefined}
                            animate={{ scale: active || final ? 1.02 : 1 }}
                            transition={quickTransition}
                            data-active={active || final}
                            className={cn(
                              "demo-step-card rounded-2xl border p-4 transition duration-300",
                              completed || final
                                ? "border-secure/[0.45] bg-secure/[0.15]"
                                : active
                                  ? "border-arctic/[0.45] bg-arctic/[0.10] shadow-glow"
                                  : "border-titanium/[0.10] bg-obsidian/[0.72]",
                            )}
                          >
                            <Icon
                              className={cn(
                                "h-5 w-5",
                                active || final
                                  ? "text-arctic"
                                  : completed
                                    ? "text-teal-100"
                                    : "text-titanium/[0.45]",
                              )}
                              aria-hidden
                            />
                            <p className="mt-4 font-mono text-xs font-bold text-titanium/[0.54]">
                              0{index + 1}
                            </p>
                            <p className="mt-2 font-black text-white">
                              {label}
                            </p>
                            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-titanium/[0.54]">
                              {completed || final
                                ? "Verified"
                                : active
                                  ? "Active"
                                  : "Standby"}
                            </p>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  <motion.div
                    layout
                    aria-live="polite"
                    className="liquid-glass mt-8 rounded-[1.75rem] p-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="text-sm text-titanium/[0.58]">
                          Action type
                        </p>
                        <p className="mt-1 font-black text-white">
                          {visibleIncident.actionType} •{" "}
                          {visibleIncident.amount}
                        </p>
                        <p className="mt-2 text-sm text-titanium/[0.68]">
                          Threshold: {visibleIncident.threshold} · Signer:{" "}
                          {visibleIncident.signer} · Destination:{" "}
                          {visibleIncident.destination}
                        </p>
                      </div>
                      <Badge
                        tone={activeIndex >= 1 ? "red" : "slate"}
                        pulse={activeIndex >= 1}
                      >
                        {activeIndex >= 1 ? "Critical" : "Armed"}
                      </Badge>
                    </div>

                    <AnimatePresence>
                      {activeIndex >= 1 && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.985 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          transition={quickTransition}
                          className="mt-6"
                        >
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
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <AnimatePresence mode="wait">
                      {step === "attested" && (
                        <motion.div
                          key="attested"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={quickTransition}
                          className="mt-6 rounded-2xl border border-arctic/[0.25] bg-arctic/[0.10] p-5"
                        >
                          <Tooltip content="An Attestation is a signed, reviewable security record of the incident evidence Praetor assembled.">
                            <p
                              tabIndex={0}
                              className="inline-flex rounded-md text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arctic/70"
                            >
                              <BadgeCheck
                                className="mr-2 h-5 w-5 text-arctic"
                                aria-hidden
                              />
                              Onchain security attestation prepared for Solana
                              devnet.
                            </p>
                          </Tooltip>
                          <a
                            href="https://explorer.solana.com/?cluster=devnet"
                            target="_blank"
                            rel="noreferrer"
                            className="mt-3 inline-flex rounded-md font-mono text-xs uppercase tracking-[0.18em] text-arctic underline decoration-arctic/[0.35] underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arctic/70"
                          >
                            Mock tx link · explorer.solana.com/?cluster=devnet
                          </a>
                        </motion.div>
                      )}
                      {step === "challenged" && (
                        <motion.div
                          key="challenged"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={quickTransition}
                          className="mt-6 rounded-2xl border border-sovereign/[0.35] bg-sovereign/[0.15] p-5 text-blue-100"
                        >
                          <Tooltip content="Guardian Challenge routes a critical action into manual security review before it can execute.">
                            <span
                              tabIndex={0}
                              className="inline-flex rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arctic/70"
                            >
                              <ShieldAlert
                                className="mr-2 h-5 w-5"
                                aria-hidden
                              />
                              Guardian challenge submitted.
                            </span>
                          </Tooltip>
                        </motion.div>
                      )}
                      {step === "blocked" && (
                        <motion.div
                          key="blocked"
                          initial={{ opacity: 0, y: 12, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0 }}
                          transition={defaultTransition}
                          className="premium-shell mt-6 rounded-2xl border border-gold/[0.45] bg-gold/[0.10] p-6 shadow-gold"
                        >
                          <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-amber-100">
                            Final security state
                          </p>
                          <p className="mt-3 text-4xl font-black tracking-[-0.03em] text-white drop-shadow-[0_0_34px_rgba(199,161,91,0.20)]">
                            Execution blocked by Praetor policy.
                          </p>
                          <p className="mt-3 flex items-center gap-2 text-sm text-titanium/[0.74]">
                            <ShieldCheck
                              className="h-5 w-5 text-teal-100"
                              aria-hidden
                            />{" "}
                            Funds and authority remain inside the protected
                            perimeter.
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {error && (
                    <div
                      role="alert"
                      className="mt-5 rounded-xl border border-alert/[0.35] bg-alert/[0.10] px-4 py-3 text-red-100"
                    >
                      {error}
                    </div>
                  )}

                  <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {demoActions.map((action, index) => {
                      const disabled =
                        index === 0 ? isLoading : activeIndex < index;
                      const onClick =
                        index === 0
                          ? triggerSuspiciousWithdrawal
                          : index === 1
                            ? () => setStep("attested")
                            : index === 2
                              ? () => setStep("challenged")
                              : () => setStep("blocked");
                      const variant =
                        index === 0
                          ? "danger"
                          : index === 2
                            ? "outline"
                            : index === 3
                              ? "gold"
                              : "primary";

                      return (
                        <div
                          key={action.label}
                          className="liquid-glass rounded-2xl p-3"
                        >
                          <div className="relative z-10 flex h-full flex-col justify-between gap-3">
                            <div>
                              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-titanium/[0.56]">
                                {action.lockedLabel}
                              </p>
                              <p className="mt-2 min-h-12 text-sm leading-5 text-titanium/[0.72]">
                                {action.helper}
                              </p>
                            </div>
                            <Button
                              onClick={onClick}
                              disabled={disabled}
                              variant={variant}
                              className="w-full py-4"
                            >
                              {isLoading && index === 0
                                ? "Simulating..."
                                : action.label}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </motion.div>
            </section>
          </Container>
        </Section>
      </main>
    </TooltipProvider>
  );
}
