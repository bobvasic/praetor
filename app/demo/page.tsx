"use client";

import { motion, type Transition } from "framer-motion";
import { ArrowRight, Database, ExternalLink, FileCheck2, RadioTower, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { OperationalBadges } from "@/components/OperationalBadges";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { MetricCard } from "@/components/ui/MetricCard";
import { PremiumButton, PremiumButtonLink } from "@/components/ui/PremiumButton";
import { SectionShell } from "@/components/ui/SectionShell";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PRAETOR_ANCHOR_PROGRAM_ID, getExplorerAddressUrl } from "@/lib/solana/constants";
import { cn } from "@/src/lib/utils";

type WalkthroughStep = "ready" | "rpc" | "program" | "blockhash" | "app";
const orderedStates: WalkthroughStep[] = ["ready", "rpc", "program", "blockhash", "app"];
const transition: Transition = { duration: 0.35, ease: [0.22, 1, 0.36, 1] };

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
  program?: ProgramStatus;
  error?: string;
};

const statusCopy: Record<WalkthroughStep, string> = {
  ready: "Live devnet walkthrough is ready.",
  rpc: "QuickNode returned live Solana devnet status.",
  program: "Praetor Anchor program account is verified on devnet.",
  blockhash: "Fresh blockhash data is loaded from Solana devnet.",
  app: "Wallet-signed attestation path is ready in the app.",
};

const stepDetail: Record<WalkthroughStep, string> = {
  ready: "This walkthrough reads the same devnet RPC route used by the app and dashboard.",
  rpc: "Health, slot, block height, and Solana core version are fetched through QuickNode.",
  program: "The program account is checked with getAccountInfo against the deployed Anchor program ID.",
  blockhash: "The current blockhash preview and last valid block height come from getLatestBlockhash.",
  app: "The final attestation requires a wallet signature in /app; no private keys touch the server.",
};

const stepIcons = [RadioTower, FileCheck2, Database, ShieldCheck];

function shorten(value: string) {
  return `${value.slice(0, 10)}…${value.slice(-10)}`;
}

function formatNumber(value: number | null | undefined) {
  return typeof value === "number" ? value.toLocaleString() : "Loading";
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

export default function DemoPage() {
  const [step, setStep] = useState<WalkthroughStep>("ready");
  const [status, setStatus] = useState<SolanaStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const activeIndex = useMemo(() => orderedStates.indexOf(step), [step]);
  const progress = Math.max(0, (activeIndex / (orderedStates.length - 1)) * 100);
  const programExplorerUrl = status?.program?.explorerUrl ?? getExplorerAddressUrl(PRAETOR_ANCHOR_PROGRAM_ID);

  async function loadStatus() {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/solana/status", { cache: "no-store" });
      const body = (await response.json()) as SolanaStatus;
      setStatus(body);
      if (!response.ok || !body.ok) {
        throw new Error(body.error ?? "Solana devnet status route failed");
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load live devnet data");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadStatus();
  }, []);

  function handleAction(index: number) {
    if (index === 0 && status?.ok) setStep("rpc");
    if (index === 1 && status?.program?.exists) setStep("program");
    if (index === 2 && status?.blockhashPreview) setStep("blockhash");
    if (index === 3) setStep("app");
  }

  const actions = [
    { label: "Verify RPC", helper: "Confirm live QuickNode devnet health, slot, and Solana core version.", enabled: activeIndex === 0 && Boolean(status?.ok) },
    { label: "Verify Program", helper: "Confirm the deployed Praetor Anchor program account exists on devnet.", enabled: activeIndex === 1 && Boolean(status?.program?.exists) },
    { label: "Verify Blockhash", helper: "Confirm fresh getLatestBlockhash data for transaction creation.", enabled: activeIndex === 2 && Boolean(status?.blockhashPreview) },
    { label: "Open App", helper: "Continue to the wallet-signed devnet attestation flow.", enabled: activeIndex === 3 },
  ];

  return (
    <main className="relative overflow-hidden">
      <SectionShell className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={transition}>
            <GlassPanel className="rounded-2xl p-6 md:p-8">
              <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                <div>
                  <StatusBadge tone="crimson">Guided Walkthrough</StatusBadge>
                  <OperationalBadges className="mt-3" />
                  <p className="praetor-kicker mt-7">Live devnet review path</p>
                  <h1 className="mt-3 max-w-4xl text-3xl font-black leading-[1.06] tracking-[-0.03em] text-white md:text-5xl xl:text-6xl">
                    Guided Walkthrough
                  </h1>
                  <p className="mt-4 max-w-3xl text-base leading-7 text-white/72 md:text-lg">
                    Watch the Praetor demo flow using live Solana devnet data: RPC status, Anchor program account state, fresh blockhash data, and the wallet-signed attestation path.
                  </p>
                </div>
                <StatusBadge tone={status?.ok ? "online" : "crimson"} pulse={Boolean(status?.ok)}>
                  {status?.ok ? "Devnet live" : isLoading ? "Loading devnet" : "Needs review"}
                </StatusBadge>
              </div>
            </GlassPanel>
          </motion.div>

          <section className="mt-6 grid gap-5 lg:grid-cols-[0.86fr_1.14fr]">
            <div className="space-y-5">
              <GlassPanel className="rounded-xl p-6">
                <p className="praetor-kicker">Live RPC data</p>
                <h2 className="mt-2.5 text-2xl font-black tracking-[-0.03em] text-white md:text-3xl">Solana Devnet</h2>
                <div className="mt-5 rounded-xl border border-white/10 bg-[#0A0A0A] p-4">
                  <DetailRow label="Health" value={status?.health ?? (error ?? "Loading")} />
                  <DetailRow label="Latest slot" value={formatNumber(status?.slot)} />
                  <DetailRow label="Block height" value={formatNumber(status?.blockHeight)} />
                  <DetailRow label="Solana core" value={status?.solanaCore ?? "Loading"} />
                </div>
              </GlassPanel>

              <GlassPanel className="rounded-xl p-6">
                <p className="praetor-kicker">Anchor program</p>
                <div className="mt-5 rounded-xl border border-white/10 bg-[#0A0A0A] p-4">
                  <DetailRow label="Program ID" value={shorten(status?.program?.address ?? PRAETOR_ANCHOR_PROGRAM_ID)} href={programExplorerUrl} />
                  <DetailRow label="Exists" value={status?.program?.exists ? "Yes" : "Loading"} />
                  <DetailRow label="Executable" value={status?.program?.executable ? "Yes" : "No"} />
                  <DetailRow label="Owner" value={status?.program?.owner ? shorten(status.program.owner) : "Loading"} />
                  <DetailRow label="Data length" value={formatNumber(status?.program?.dataLength)} />
                </div>
              </GlassPanel>

              <GlassPanel className="rounded-xl p-6">
                <p className="praetor-kicker">Transaction readiness</p>
                <div className="mt-5 rounded-xl border border-white/10 bg-[#0A0A0A] p-4">
                  <DetailRow label="Blockhash preview" value={status?.blockhashPreview ?? "Loading"} />
                  <DetailRow label="Last valid block height" value={formatNumber(status?.lastValidBlockHeight)} />
                  <DetailRow label="Signing model" value="Wallet client-side only" />
                </div>
              </GlassPanel>
            </div>

            <GlassPanel className="min-h-[700px] rounded-xl p-6 md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-5">
                <div>
                  <p className="praetor-kicker">Live devnet console</p>
                  <motion.h2
                    key={step}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={transition}
                    className="mt-3 max-w-2xl text-3xl font-black tracking-[-0.03em] text-white md:text-4xl"
                    aria-live="polite"
                  >
                    {statusCopy[step]}
                  </motion.h2>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-white/68">{stepDetail[step]}</p>
                </div>
                <MetricCard
                  label="Devnet Slot"
                  value={formatNumber(status?.slot)}
                  tone={status?.ok ? "cyan" : "white"}
                />
              </div>

              <div className="relative mt-10">
                <div className="absolute left-0 right-0 top-8 hidden h-px bg-white/10 sm:block" />
                <motion.div
                  className="absolute left-0 top-8 hidden h-px bg-[#E10600] sm:block"
                  animate={{ width: `${progress}%` }}
                  transition={transition}
                />
                <div className="relative grid gap-3 sm:grid-cols-4">
                  {["RPC", "Program", "Blockhash", "Attest"].map((label, index) => {
                    const active = activeIndex === index + 1;
                    const done = activeIndex > index + 1;
                    const Icon = stepIcons[index];
                    return (
                      <motion.div
                        key={label}
                        animate={{ scale: active || done ? 1.02 : 1 }}
                        transition={transition}
                        className={cn(
                          "rounded-xl border p-4",
                          done
                            ? "border-[rgba(28,201,160,0.45)] bg-[#0A0A0A]"
                            : active
                              ? "border-[rgba(255,32,32,0.55)] bg-[rgba(122,7,16,0.18)]"
                              : "border-white/10 bg-[#0A0A0A]",
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-5 w-5",
                            active ? "text-[#FF6B6B]" : done ? "text-[#5DE0BB]" : "text-white/40",
                          )}
                        />
                        <p className="mt-4 font-mono text-[10px] font-black uppercase tracking-[0.20em] text-white/55">
                          0{index + 1}
                        </p>
                        <p className="mt-2 font-black text-white">{label}</p>
                        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/50">
                          {done ? "Verified" : active ? "Active" : "Standby"}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-8 rounded-xl border border-white/10 bg-[#0A0A0A] p-5">
                <div className="grid gap-3 sm:grid-cols-3">
                  <MetricCard label="RPC Health" value={status?.health ?? "Loading"} tone={status?.ok ? "green" : "white"} />
                  <MetricCard label="Program" value={status?.program?.executable ? "Executable" : "Loading"} tone={status?.program?.executable ? "green" : "white"} />
                  <MetricCard label="Blockhash" value={status?.blockhashPreview ?? "Loading"} tone="cyan" />
                </div>
                {error && (
                  <div className="mt-5 rounded-md border border-[rgba(255,32,32,0.45)] bg-[rgba(122,7,16,0.18)] p-4 text-[#FFD8D8]">
                    <p className="text-sm leading-6">{error}</p>
                  </div>
                )}
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-4">
                {actions.map((action, index) => (
                  <div key={action.label} className="rounded-xl border border-white/10 bg-[#0A0A0A] p-3">
                    {index === 3 && activeIndex === 3 ? (
                      <PremiumButtonLink href="/app" variant="crimson" className="w-full px-3 py-3 text-[10px]">
                        Open App <ArrowRight className="ml-2 h-3.5 w-3.5" />
                      </PremiumButtonLink>
                    ) : (
                      <PremiumButton
                        variant={action.enabled ? "crimson" : "ghost"}
                        disabled={!action.enabled || isLoading}
                        onClick={() => handleAction(index)}
                        className="w-full px-3 py-3 text-[10px]"
                      >
                        {isLoading && index === 0 ? "Loading…" : action.label}
                      </PremiumButton>
                    )}
                    <p className="mt-3 text-xs leading-5 text-white/64">{action.helper}</p>
                  </div>
                ))}
              </div>
            </GlassPanel>
          </section>
        </div>
      </SectionShell>
    </main>
  );
}
