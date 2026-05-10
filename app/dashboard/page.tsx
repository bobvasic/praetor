"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Ban, Coins, ExternalLink, KeyRound, LockKeyhole, RadioTower, ShieldCheck } from "lucide-react";
import { OperationalBadges } from "@/components/OperationalBadges";
import { FadeUp, HoverLift } from "@/components/motion/Reveal";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { MetricCard } from "@/components/ui/MetricCard";
import { PremiumButtonLink } from "@/components/ui/PremiumButton";
import { SectionShell } from "@/components/ui/SectionShell";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { demoIncident, protectedAddresses } from "@/lib/demo-data";
import type { Incident } from "@/lib/risk-engine";
import { PRAETOR_ANCHOR_PROGRAM_ID, getExplorerAddressUrl } from "@/lib/solana/constants";

const STORAGE_KEY = "praetor.devnet.attestation.inc_demo_001";

type SolanaStatus = {
  ok: boolean;
  network?: string;
  rpcProvider?: string;
  slot?: number;
  health?: string;
  blockhashPreview?: string;
  explorerCluster?: string;
  error?: string;
};

type StoredAttestation = {
  signature: string;
  explorerUrl: string;
  status: string;
  payload?: {
    protocol?: string;
    riskScore?: number;
    decision?: string;
    timestamp?: string;
  };
};

const signals = [
  { label: "Treasury Policy", value: "10 SOL max", icon: Coins },
  { label: "Upgrade Authority", value: "Guarded", icon: KeyRound },
  { label: "Guardian Challenge", value: "Required", icon: LockKeyhole },
];

function shortenSignature(signature: string) {
  return `${signature.slice(0, 10)}…${signature.slice(-10)}`;
}

function DetailRow({ label, value, href }: { label: string; value: string | number; href?: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/[0.06] py-2.5 last:border-b-0">
      <span className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/55">{label}</span>
      {href ? (
        <a className="inline-flex max-w-[62%] items-center gap-2 break-all text-right font-mono text-sm font-bold tabular-nums text-white hover:text-[#FF6B6B]" href={href} target="_blank" rel="noreferrer">
          {value} <ExternalLink className="h-3.5 w-3.5 shrink-0" />
        </a>
      ) : (
        <span className="max-w-[62%] break-words text-right font-mono text-sm font-bold tabular-nums text-white">{value}</span>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const [status, setStatus] = useState<SolanaStatus | null>(null);
  const [attestation, setAttestation] = useState<StoredAttestation | null>(null);
  const [incident, setIncident] = useState<Incident>(demoIncident);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setAttestation(JSON.parse(stored) as StoredAttestation);
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }

    let cancelled = false;
    async function loadReadiness() {
      try {
        const [statusResponse, incidentResponse] = await Promise.all([
          fetch("/api/solana/status", { cache: "no-store" }),
          fetch("/api/incidents/simulate", { cache: "no-store" }),
        ]);
        const statusBody = (await statusResponse.json()) as SolanaStatus;
        const incidentBody = (await incidentResponse.json()) as { ok: boolean; incident?: Incident };
        if (!cancelled) {
          setStatus(statusBody);
          if (incidentBody.ok && incidentBody.incident) setIncident(incidentBody.incident);
        }
      } catch (error) {
        if (!cancelled) {
          setStatus({ ok: false, error: error instanceof Error ? error.message : "Unable to load devnet status" });
        }
      }
    }

    loadReadiness();
    const interval = window.setInterval(loadReadiness, 20_000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  const metrics = [
    { label: "Systems", value: status?.ok === false ? "Degraded" : "Online", status: "All systems online", tone: status?.ok === false ? "red" as const : "green" as const },
    { label: "Devnet Slot", value: status?.slot?.toLocaleString() ?? "Loading", status: "Latest from /api/solana/status", tone: "cyan" as const },
    { label: "Latest Risk", value: incident.riskScore, status: "Critical deterministic decision", tone: "red" as const },
    { label: "Blocked State", value: "Blocked", status: "Execution denied by policy", tone: "crimson" as const },
  ];

  return (
    <main className="relative overflow-hidden">
      <SectionShell className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-6">
          <FadeUp>
            <GlassPanel className="rounded-2xl p-6 md:p-8">
              <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                <div>
                  <StatusBadge tone="crimson">Devnet readiness dashboard</StatusBadge>
                  <OperationalBadges className="mt-3" />
                  <p className="praetor-kicker mt-7">Command center</p>
                  <h1 className="mt-3 max-w-4xl text-3xl font-black leading-[1.06] tracking-[-0.03em] text-white md:text-5xl xl:text-6xl">
                    Praetor live command center.
                  </h1>
                  <p className="mt-4 max-w-3xl text-base leading-7 text-white/72 md:text-lg">
                    A devnet-ready operational console for QuickNode RPC health, Solana slot state, latest attestation evidence, protected protocol posture, and blocked execution status.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-end">
                  <PremiumButtonLink href="/app" variant="crimson">Launch Devnet App</PremiumButtonLink>
                  <PremiumButtonLink href="/demo" variant="glass">Guided Walkthrough</PremiumButtonLink>
                </div>
              </div>
            </GlassPanel>
          </FadeUp>

          <section className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric, index) => (
              <HoverLift key={metric.label} delay={index * 0.04}>
                <MetricCard {...metric} />
              </HoverLift>
            ))}
          </section>

          <section className="mt-6 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
            <FadeUp delay={0.08}>
              <GlassPanel className="min-h-full rounded-xl p-6 md:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="praetor-kicker">Devnet infrastructure</p>
                    <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-white md:text-3xl">QuickNode RPC status</h2>
                  </div>
                  <StatusBadge tone={status?.ok === false ? "red" : "online"} pulse={status?.ok !== false}>{status?.ok === false ? "Needs review" : "Connected"}</StatusBadge>
                </div>
                <div className="mt-5 rounded-xl border border-white/10 bg-[#0A0A0A] p-4">
                  <DetailRow label="All Systems Online" value={status?.ok === false ? "No" : "Yes"} />
                  <DetailRow label="Network" value={status?.network ?? "Solana Devnet"} />
                  <DetailRow label="RPC provider" value={status?.rpcProvider ?? "QuickNode RPC"} />
                  <DetailRow label="Health" value={status?.health ?? (status?.ok === false ? status.error ?? "Unavailable" : "Checking")} />
                  <DetailRow label="Latest devnet slot" value={status?.slot ?? "Loading"} />
                  <DetailRow label="Latest blockhash preview" value={status?.blockhashPreview ?? "Loading"} />
                </div>
              </GlassPanel>
            </FadeUp>

            <FadeUp delay={0.12}>
              <GlassPanel className="min-h-full rounded-xl p-6 md:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="praetor-kicker">Onchain attestation</p>
                    <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-white md:text-3xl">Latest devnet proof</h2>
                  </div>
                  <StatusBadge tone={attestation ? "online" : "crimson"} pulse={Boolean(attestation)}>{attestation ? "Explorer ready" : "Ready"}</StatusBadge>
                </div>
                {attestation ? (
                  <div className="mt-5 rounded-xl border border-white/10 bg-[#0A0A0A] p-4">
                    <DetailRow label="Onchain Attestation Ready" value="Yes" />
                    <DetailRow label="Praetor Anchor Program" value={shortenSignature(PRAETOR_ANCHOR_PROGRAM_ID)} href={getExplorerAddressUrl(PRAETOR_ANCHOR_PROGRAM_ID)} />
                    <DetailRow label="Latest signature" value={shortenSignature(attestation.signature)} />
                    <DetailRow label="Confirmation status" value={attestation.status ?? "confirmed"} />
                    <DetailRow label="Protocol" value={attestation.payload?.protocol ?? demoIncident.protocolName} />
                    <DetailRow label="Attested risk score" value={attestation.payload?.riskScore ?? incident.riskScore} />
                    {attestation.explorerUrl && <DetailRow label="Solana Explorer" value="Open transaction" href={attestation.explorerUrl} />}
                  </div>
                ) : (
                  <div className="mt-5 rounded-xl border border-white/10 bg-[#0A0A0A] p-5">
                    <DetailRow label="Onchain Attestation Ready" value="Yes" />
                    <DetailRow label="Praetor Anchor Program" value={shortenSignature(PRAETOR_ANCHOR_PROGRAM_ID)} href={getExplorerAddressUrl(PRAETOR_ANCHOR_PROGRAM_ID)} />
                    <p className="mt-4 text-sm leading-6 text-white/70">
                      No latest attestation yet. Create a devnet attestation in Launch Devnet App.
                    </p>
                    <PremiumButtonLink href="/app" variant="glass" className="mt-4 w-full">
                      Launch Devnet App
                    </PremiumButtonLink>
                  </div>
                )}
              </GlassPanel>
            </FadeUp>
          </section>

          <section className="mt-6 grid gap-5 lg:grid-cols-[1.12fr_0.88fr]">
            <FadeUp delay={0.14}>
              <GlassPanel className="min-h-full rounded-xl p-6 md:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="praetor-kicker">Protected protocol profile</p>
                    <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-white md:text-3xl">DemoDAO Treasury posture</h2>
                  </div>
                  <StatusBadge tone="online">Armed</StatusBadge>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {protectedAddresses.map((address) => (
                    <div key={address.label} className="praetor-mini-card rounded-xl p-4 transition duration-200 hover:border-[rgba(255,32,32,0.42)]">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-base font-black text-white">{address.label}</p>
                        <StatusBadge tone="online">{address.status}</StatusBadge>
                      </div>
                      <p className="mt-2.5 break-all font-mono text-[11px] leading-5 text-white/72">{address.address}</p>
                      <p className="mt-3 text-sm leading-6 text-white/64">{address.policy}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  {signals.map((signal) => {
                    const Icon = signal.icon;
                    return (
                      <div key={signal.label} className="rounded-xl border border-white/10 bg-[#0A0A0A] p-4">
                        <Icon className="h-5 w-5 text-[#FF6B6B]" />
                        <p className="mt-3 font-mono text-[10px] font-black uppercase tracking-[0.20em] text-white/55">{signal.label}</p>
                        <p className="mt-1.5 text-lg font-black text-white">{signal.value}</p>
                      </div>
                    );
                  })}
                </div>
              </GlassPanel>
            </FadeUp>

            <div className="space-y-5">
              <FadeUp delay={0.16}>
                <GlassPanel className="rounded-xl border-[rgba(255,32,32,0.45)] p-6 md:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#FF8888]">Latest Incident</p>
                      <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-white md:text-3xl">Treasury withdrawal above threshold</h2>
                    </div>
                    <StatusBadge tone="red" pulse>Critical</StatusBadge>
                  </div>
                  <div className="mt-5 rounded-xl border border-[rgba(255,32,32,0.40)] bg-[rgba(122,7,16,0.16)] p-5">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="text-sm text-white/64">{incident.protocolName}</p>
                        <p className="mt-1.5 text-5xl font-black tabular-nums text-[#FF6B6B]">{incident.riskScore}</p>
                      </div>
                      <AlertTriangle className="h-10 w-10 text-[#FF6B6B]" aria-hidden />
                    </div>
                    <p className="mt-4 text-sm leading-6 text-white/72">{incident.amount} requested by {incident.signer.toLowerCase()} to a {incident.destination.toLowerCase()}. Unsafe operation is held until guardian review clears the policy risk.</p>
                  </div>
                  <PremiumButtonLink href="/app" variant="danger" className="mt-5 w-full">Create Devnet Attestation</PremiumButtonLink>
                </GlassPanel>
              </FadeUp>

              <FadeUp delay={0.18}>
                <GlassPanel className="rounded-xl p-6">
                  <div className="flex items-center gap-2.5">
                    <RadioTower className="h-4 w-4 text-[#FF6B6B]" />
                    <p className="praetor-kicker">Blocked execution state</p>
                  </div>
                  <div className="mt-5 space-y-2.5">
                    {[
                      ["QuickNode RPC Connected", "OK"],
                      ["Onchain Attestation Ready", attestation ? "SIGNED" : "READY"],
                      ["Execution blocked by Praetor policy", "BLOCKED"],
                    ].map(([row, state]) => (
                      <div key={row} className="praetor-mini-card flex items-center justify-between rounded-md px-3.5 py-2.5">
                        <span className="text-sm text-white/72">{row}</span>
                        <StatusBadge tone={state === "BLOCKED" ? "crimson" : "online"}>{state}</StatusBadge>
                      </div>
                    ))}
                  </div>
                </GlassPanel>
              </FadeUp>
            </div>
          </section>

          <FadeUp delay={0.2} className="mt-6">
            <GlassPanel className="rounded-2xl p-6 md:p-8">
              <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-center">
                <div>
                  <StatusBadge tone="devnet">Operational assurance</StatusBadge>
                  <h2 className="mt-3 text-2xl font-black tracking-[-0.03em] text-white md:text-3xl">
                    Detect → Attest → Challenge → Block for devnet treasury and authority events.
                  </h2>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    ["Detect", ShieldCheck],
                    ["Attest", RadioTower],
                    ["Block", Ban],
                  ].map(([item, Icon]) => {
                    const IconComp = Icon as typeof ShieldCheck;
                    return (
                      <div key={item as string} className="praetor-mini-card rounded-md p-4">
                        <IconComp className="h-5 w-5 text-[#FF6B6B]" />
                        <p className="mt-3 font-black text-white">{item as string}</p>
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
