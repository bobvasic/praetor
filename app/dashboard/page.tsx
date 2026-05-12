"use client";

import { useEffect, useState } from "react";
import { Ban, Database, ExternalLink, FileCheck2, RadioTower, ShieldCheck } from "lucide-react";
import { OperationalBadges } from "@/components/OperationalBadges";
import { FadeUp, HoverLift } from "@/components/motion/Reveal";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { MetricCard } from "@/components/ui/MetricCard";
import { PremiumButtonLink } from "@/components/ui/PremiumButton";
import { SectionShell } from "@/components/ui/SectionShell";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PRAETOR_ANCHOR_PROGRAM_ID, getExplorerAddressUrl } from "@/lib/solana/constants";

const STORAGE_KEY = "praetor.devnet.attestation.inc_demo_001";

type ProgramStatus = {
  address: string;
  explorerUrl: string;
  exists: boolean;
  executable: boolean;
  owner: string | null;
  lamports: number | null;
  sol: number | null;
  dataLength: number | null;
};

type SolanaStatus = {
  ok: boolean;
  network?: string;
  rpcProvider?: string;
  slot?: number;
  health?: string;
  blockhashPreview?: string;
  lastValidBlockHeight?: number;
  blockHeight?: number;
  solanaCore?: string;
  explorerCluster?: string;
  program?: ProgramStatus;
  error?: string;
};

type PraetorMemoPayload = {
  app?: string;
  network?: string;
  type?: string;
  incidentId?: string;
  protocol?: string;
  riskScore?: number;
  riskLevel?: string;
  decision?: string;
  actionType?: string;
  timestamp?: string;
};

type StoredAttestation = {
  signature: string;
  explorerUrl: string;
  status: string;
  verified?: boolean;
  slot?: number | null;
  memoPayload?: PraetorMemoPayload | string | null;
};

type TxStatusResponse = {
  ok?: boolean;
  confirmationStatus?: string | null;
  slot?: number | null;
  err?: unknown;
  memoPayload?: unknown;
};

function shortenSignature(signature: string) {
  return `${signature.slice(0, 10)}…${signature.slice(-10)}`;
}

function formatNumber(value: number | null | undefined) {
  return typeof value === "number" ? value.toLocaleString() : "Unavailable";
}

function formatSol(value: number | null | undefined) {
  return typeof value === "number" ? `${value.toFixed(6)} SOL` : "Unavailable";
}

function getMemoPayload(value: unknown): PraetorMemoPayload | string | null {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (typeof value !== "object") return null;
  return value as PraetorMemoPayload;
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

  useEffect(() => {
    let cancelled = false;
    let storedAttestation: StoredAttestation | null = null;

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        storedAttestation = JSON.parse(stored) as StoredAttestation;
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }

    async function loadReadiness() {
      try {
        const [statusResponse, txStatusResponse] = await Promise.all([
          fetch("/api/solana/status", { cache: "no-store" }),
          storedAttestation
            ? fetch(`/api/solana/tx-status?signature=${encodeURIComponent(storedAttestation.signature)}`, { cache: "no-store" })
            : Promise.resolve(null),
        ]);
        const statusBody = (await statusResponse.json()) as SolanaStatus;
        const txStatusBody = txStatusResponse ? ((await txStatusResponse.json()) as TxStatusResponse) : null;

        if (!cancelled) {
          setStatus(statusBody);
          if (storedAttestation && txStatusBody?.ok && (txStatusBody.confirmationStatus || txStatusBody.err)) {
            setAttestation({
              ...storedAttestation,
              status: txStatusBody.err ? "failed" : txStatusBody.confirmationStatus ?? "submitted",
              verified: Boolean(txStatusBody.confirmationStatus) && !txStatusBody.err,
              slot: txStatusBody.slot ?? null,
              memoPayload: getMemoPayload(txStatusBody.memoPayload),
            });
          } else {
            setAttestation(null);
          }
        }
      } catch (error) {
        if (!cancelled) {
          setStatus({ ok: false, error: error instanceof Error ? error.message : "Unable to load devnet status" });
          setAttestation(null);
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

  const program = status?.program;
  const memoPayload = typeof attestation?.memoPayload === "object" ? attestation.memoPayload : null;
  const programExplorerUrl = program?.explorerUrl ?? getExplorerAddressUrl(PRAETOR_ANCHOR_PROGRAM_ID);

  const metrics = [
    { label: "Systems", value: status?.ok === false ? "Degraded" : "Online", status: status?.ok === false ? status.error ?? "QuickNode unavailable" : "Live from QuickNode devnet RPC", tone: status?.ok === false ? "red" as const : "green" as const },
    { label: "Devnet Slot", value: status?.slot?.toLocaleString() ?? "Loading", status: "Latest from /api/solana/status", tone: "cyan" as const },
    { label: "Anchor Program", value: program?.executable ? "Executable" : program?.exists ? "Found" : "Loading", status: "Fetched with getAccountInfo on devnet", tone: program?.executable ? "green" as const : "crimson" as const },
    { label: "Latest Proof", value: attestation?.verified ? "Verified" : attestation ? "Observed" : "None", status: attestation ? "Signature checked against devnet" : "No verified local signature", tone: attestation?.verified ? "green" as const : "crimson" as const },
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
                    A devnet-backed operational console for QuickNode RPC health, Solana slot state, Anchor program account state, and wallet-signed attestation evidence.
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
                  <DetailRow label="Latest devnet slot" value={formatNumber(status?.slot)} />
                  <DetailRow label="Block height" value={formatNumber(status?.blockHeight)} />
                  <DetailRow label="Latest blockhash preview" value={status?.blockhashPreview ?? "Loading"} />
                  <DetailRow label="Solana core" value={status?.solanaCore ?? "Loading"} />
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
                  <StatusBadge tone={attestation?.verified ? "online" : "crimson"} pulse={Boolean(attestation?.verified)}>{attestation?.verified ? "Verified" : "No proof"}</StatusBadge>
                </div>
                {attestation ? (
                  <div className="mt-5 rounded-xl border border-white/10 bg-[#0A0A0A] p-4">
                    <DetailRow label="Devnet signature" value={shortenSignature(attestation.signature)} />
                    <DetailRow label="Confirmation status" value={attestation.status} />
                    <DetailRow label="Confirmed slot" value={formatNumber(attestation.slot)} />
                    {memoPayload?.protocol && <DetailRow label="Memo protocol" value={memoPayload.protocol} />}
                    {typeof memoPayload?.riskScore === "number" && <DetailRow label="Memo risk score" value={memoPayload.riskScore} />}
                    {memoPayload?.decision && <DetailRow label="Memo decision" value={memoPayload.decision} />}
                    {attestation.explorerUrl && <DetailRow label="Solana Explorer" value="Open transaction" href={attestation.explorerUrl} />}
                  </div>
                ) : (
                  <div className="mt-5 rounded-xl border border-white/10 bg-[#0A0A0A] p-5">
                    <DetailRow label="Onchain Attestation" value="None verified locally" />
                    <DetailRow label="Praetor Anchor Program" value={shortenSignature(PRAETOR_ANCHOR_PROGRAM_ID)} href={programExplorerUrl} />
                    <p className="mt-4 text-sm leading-6 text-white/70">
                      No wallet-signed devnet attestation has been verified from this browser yet.
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
                    <p className="praetor-kicker">Devnet program account</p>
                    <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-white md:text-3xl">Praetor Anchor program</h2>
                  </div>
                  <StatusBadge tone={program?.executable ? "online" : "crimson"}>{program?.executable ? "Executable" : "Checking"}</StatusBadge>
                </div>

                <div className="mt-5 rounded-xl border border-white/10 bg-[#0A0A0A] p-4">
                  <DetailRow label="Program ID" value={shortenSignature(program?.address ?? PRAETOR_ANCHOR_PROGRAM_ID)} href={programExplorerUrl} />
                  <DetailRow label="Account exists" value={program?.exists ? "Yes" : "Checking"} />
                  <DetailRow label="Executable" value={program?.executable ? "Yes" : "No"} />
                  <DetailRow label="Owner" value={program?.owner ? shortenSignature(program.owner) : "Loading"} />
                  <DetailRow label="Lamports" value={formatNumber(program?.lamports)} />
                  <DetailRow label="Balance" value={formatSol(program?.sol)} />
                  <DetailRow label="Data length" value={formatNumber(program?.dataLength)} />
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  {[
                    { label: "RPC source", value: "QuickNode", icon: RadioTower },
                    { label: "Cluster", value: "Devnet", icon: Database },
                    { label: "Program state", value: program?.executable ? "Live" : "Checking", icon: FileCheck2 },
                  ].map((signal) => {
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
                      <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#FF8888]">Latest verified memo</p>
                      <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-white md:text-3xl">
                        {attestation?.verified ? "Wallet-signed attestation found" : "No verified attestation yet"}
                      </h2>
                    </div>
                    <StatusBadge tone={attestation?.verified ? "online" : "crimson"} pulse={Boolean(attestation?.verified)}>{attestation?.verified ? "Verified" : "Empty"}</StatusBadge>
                  </div>
                  <div className="mt-5 rounded-xl border border-[rgba(255,32,32,0.40)] bg-[rgba(122,7,16,0.16)] p-5">
                    {attestation?.verified ? (
                      <>
                        <p className="font-mono text-xs font-black uppercase tracking-[0.20em] text-[#FF8888]">{shortenSignature(attestation.signature)}</p>
                        <p className="mt-4 text-sm leading-6 text-white/72">
                          The signature was looked up on Solana devnet through QuickNode. Memo payload values shown here come from the parsed transaction, not from local fixture data.
                        </p>
                      </>
                    ) : (
                      <p className="text-sm leading-6 text-white/72">
                        Create a wallet-signed devnet attestation in the app. This dashboard stays empty until the signature is observed on devnet.
                      </p>
                    )}
                  </div>
                  <PremiumButtonLink href="/app" variant="danger" className="mt-5 w-full">Create Devnet Attestation</PremiumButtonLink>
                </GlassPanel>
              </FadeUp>

              <FadeUp delay={0.18}>
                <GlassPanel className="rounded-xl p-6">
                  <div className="flex items-center gap-2.5">
                    <RadioTower className="h-4 w-4 text-[#FF6B6B]" />
                    <p className="praetor-kicker">Live execution state</p>
                  </div>
                  <div className="mt-5 space-y-2.5">
                    {[
                      ["QuickNode RPC Connected", status?.ok ? "OK" : "CHECKING"],
                      ["Anchor Program Executable", program?.executable ? "YES" : "CHECKING"],
                      ["Latest Attestation Verified", attestation?.verified ? "YES" : "NONE"],
                    ].map(([row, state]) => (
                      <div key={row} className="praetor-mini-card flex items-center justify-between rounded-md px-3.5 py-2.5">
                        <span className="text-sm text-white/72">{row}</span>
                        <StatusBadge tone={state === "NONE" || state === "CHECKING" ? "crimson" : "online"}>{state}</StatusBadge>
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
                    Dashboard values are fetched from Solana devnet RPC or verified transaction lookups.
                  </h2>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    ["Fetch", RadioTower],
                    ["Verify", ShieldCheck],
                    ["Attest", Ban],
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
