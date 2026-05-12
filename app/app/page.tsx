"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Buffer } from "buffer";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, Ban, CheckCircle2, ExternalLink, RadioTower, ShieldAlert, ShieldCheck, Wallet, type LucideIcon } from "lucide-react";
import { PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js";
import { OperationalBadges } from "@/components/OperationalBadges";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { SectionShell } from "@/components/ui/SectionShell";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { calculateRisk, type RiskInput, type RiskLevel, type RiskResult } from "@/lib/risk-engine";
import { PRAETOR_ANCHOR_PROGRAM_ID, PRAETOR_INCIDENT_ID, SOLANA_MEMO_PROGRAM_ID, getExplorerAddressUrl } from "@/lib/solana/constants";

const STORAGE_KEY = "praetor.devnet.attestation.inc_demo_001.risk_v2";
const RISK_ENGINE_VERSION = "praetor-risk-rules-v1";
const DEMO_TREASURY_PUBLIC_KEY = "Dk22YaGKhnsaD7pLvCJyejHo3xj6NkSuvaCgbMVZLYgy";
const DEFAULT_OPERATION: OperationDraft = {
  amountSol: 25,
  thresholdSol: 10,
  signerTrusted: false,
  destinationAllowlisted: false,
  upgradeAuthorityInteraction: false,
  policyMismatch: true,
  repeatedSuspiciousAttempt: false,
};

type PhantomProvider = {
  isPhantom?: boolean;
  publicKey?: { toString(): string };
  connect(): Promise<{ publicKey: { toString(): string } }>;
  disconnect?: () => Promise<void>;
  signTransaction(transaction: Transaction): Promise<Transaction>;
};

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

type OperationDraft = {
  amountSol: number;
  thresholdSol: number;
  signerTrusted: boolean;
  destinationAllowlisted: boolean;
  upgradeAuthorityInteraction: boolean;
  policyMismatch: boolean;
  repeatedSuspiciousAttempt: boolean;
};

type PolicyDecision = "allowed" | "monitor" | "challenge" | "blocked";

type AttestationResult = {
  signature: string;
  explorerUrl: string;
  status: string;
  payload: AttestationPayload;
};

type AttestationPayload = {
  app: "Praetor";
  network: "solana-devnet";
  type: "risk_attestation";
  incidentId: string;
  protocol: "DemoDAO Treasury";
  riskEngine: typeof RISK_ENGINE_VERSION;
  riskScore: number;
  riskLevel: RiskLevel;
  decision: PolicyDecision;
  actionType: "treasury_withdrawal";
  reason: string;
  reasons: string[];
  guardianChallengeRequired: boolean;
  operation: {
    amountSol: number;
    thresholdSol: number;
    signer: "trusted" | "unknown";
    destination: "allowlisted" | "non_allowlisted";
    upgradeAuthorityInteraction: boolean;
    policyMismatch: boolean;
    repeatedSuspiciousAttempt: boolean;
  };
  rules: Array<{
    id: keyof RiskInput;
    score: number;
    reason: string;
  }>;
  timestamp: string;
};

declare global {
  interface Window {
    solana?: PhantomProvider;
  }
}

function shortenAddress(address: string) {
  return `${address.slice(0, 4)}…${address.slice(-4)}`;
}

function transactionToBase64(transaction: Transaction) {
  const bytes = transaction.serialize({ requireAllSignatures: true, verifySignatures: false });
  let binary = "";
  Array.from(bytes).forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function deriveRiskInput(operation: OperationDraft): RiskInput {
  return {
    treasuryTransferAboveThreshold: operation.amountSol > operation.thresholdSol,
    unknownSigner: !operation.signerTrusted,
    nonAllowlistedDestination: !operation.destinationAllowlisted,
    upgradeAuthorityInteraction: operation.upgradeAuthorityInteraction,
    policyMismatch: operation.policyMismatch,
    repeatedSuspiciousAttempt: operation.repeatedSuspiciousAttempt,
  };
}

function getPolicyDecision(score: number): PolicyDecision {
  if (score >= 80) return "blocked";
  if (score >= 60) return "challenge";
  if (score >= 30) return "monitor";
  return "allowed";
}

function getDecisionLabel(decision: PolicyDecision) {
  if (decision === "blocked") return "Block";
  if (decision === "challenge") return "Challenge";
  if (decision === "monitor") return "Monitor";
  return "Allow";
}

function getDecisionSummary(decision: PolicyDecision) {
  if (decision === "blocked") return "Execution blocked by Praetor policy. Guardian challenge required.";
  if (decision === "challenge") return "Execution paused for guardian challenge before it can proceed.";
  if (decision === "monitor") return "Execution can proceed under heightened monitoring.";
  return "No blocking policy matched. Execution can proceed.";
}

function formatRiskLevel(level: RiskLevel) {
  return level.charAt(0).toUpperCase() + level.slice(1);
}

function createAttestationPayload(operation: OperationDraft, risk: RiskResult): AttestationPayload {
  const decision = getPolicyDecision(risk.riskScore);

  return {
    app: "Praetor",
    network: "solana-devnet",
    type: "risk_attestation",
    incidentId: PRAETOR_INCIDENT_ID,
    protocol: "DemoDAO Treasury",
    riskEngine: RISK_ENGINE_VERSION,
    riskScore: risk.riskScore,
    riskLevel: risk.riskLevel,
    decision,
    actionType: "treasury_withdrawal",
    reason: risk.reasons[0] ?? "no_policy_violation",
    reasons: risk.reasons,
    guardianChallengeRequired: decision === "blocked" || decision === "challenge",
    operation: {
      amountSol: operation.amountSol,
      thresholdSol: operation.thresholdSol,
      signer: operation.signerTrusted ? "trusted" : "unknown",
      destination: operation.destinationAllowlisted ? "allowlisted" : "non_allowlisted",
      upgradeAuthorityInteraction: operation.upgradeAuthorityInteraction,
      policyMismatch: operation.policyMismatch,
      repeatedSuspiciousAttempt: operation.repeatedSuspiciousAttempt,
    },
    rules: risk.matchedRules.map((rule) => ({
      id: rule.key,
      score: rule.score,
      reason: rule.reason,
    })),
    timestamp: new Date().toISOString(),
  };
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

function PanelTitle({ icon: Icon, kicker, title }: { icon: LucideIcon; kicker: string; title: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="rounded-md border border-white/10 bg-[#101010] p-2.5 text-[#FF6B6B]">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="praetor-kicker">{kicker}</p>
        <h2 className="mt-1.5 text-xl font-black tracking-[-0.03em] text-white md:text-2xl">{title}</h2>
      </div>
    </div>
  );
}

function NumericField({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}) {
  return (
    <label className="block rounded-xl border border-white/10 bg-[#0A0A0A] p-4">
      <span className="font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/55">{label}</span>
      <div className="mt-2 flex items-center gap-2">
        <input
          className="min-w-0 flex-1 bg-transparent font-mono text-2xl font-black tabular-nums text-white outline-none disabled:opacity-55"
          disabled={disabled}
          inputMode="decimal"
          min={0}
          onChange={(event) => onChange(Number(event.target.value))}
          step="0.1"
          type="number"
          value={value}
        />
        <span className="font-mono text-xs font-black uppercase tracking-[0.18em] text-white/45">SOL</span>
      </div>
    </label>
  );
}

function RuleToggle({
  active,
  disabled,
  label,
  onClick,
}: {
  active: boolean;
  disabled?: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className={
        "rounded-xl border px-4 py-3 text-left transition duration-200 disabled:cursor-not-allowed disabled:opacity-60 " +
        (active
          ? "border-[rgba(255,32,32,0.48)] bg-[rgba(122,7,16,0.20)] text-white"
          : "border-white/10 bg-[#0A0A0A] text-white/58 hover:border-white/20 hover:text-white")
      }
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <span className="flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-[0.16em]">
        <span className={"h-2 w-2 rounded-full " + (active ? "bg-[#FF2020]" : "bg-white/24")} />
        {label}
      </span>
    </button>
  );
}

function RiskScoreMeter({ decision, risk, reduced }: { decision: PolicyDecision; risk: RiskResult; reduced: boolean | null }) {
  return (
    <motion.div layout className="rounded-xl border border-[rgba(255,32,32,0.32)] bg-[rgba(122,7,16,0.14)] p-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#FF8888]">Computed Risk Score</p>
          <AnimatePresence mode="wait">
            <motion.p
              key={risk.riskScore}
              animate={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
              className="mt-1.5 text-6xl font-black tabular-nums text-[#FF6B6B]"
              exit={reduced ? undefined : { opacity: 0, y: -8, scale: 0.98 }}
              initial={reduced ? false : { opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              {risk.riskScore}
            </motion.p>
          </AnimatePresence>
        </div>
        <div className="text-right">
          <p className="font-mono text-xs font-black uppercase tracking-[0.22em] text-[#FF8888]">
            {formatRiskLevel(risk.riskLevel)}
          </p>
          <p className="mt-2 text-sm font-bold text-white">{getDecisionLabel(decision)}</p>
        </div>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
        <motion.div
          animate={reduced ? undefined : { width: `${risk.riskScore}%` }}
          className="h-full rounded-full bg-[#FF2020]"
          initial={false}
          style={reduced ? { width: `${risk.riskScore}%` } : undefined}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </motion.div>
  );
}

export default function PraetorAppPage() {
  const reduced = useReducedMotion();
  const [provider, setProvider] = useState<PhantomProvider | null>(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [status, setStatus] = useState<SolanaStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const [operation, setOperation] = useState<OperationDraft>(DEFAULT_OPERATION);
  const [incidentTriggered, setIncidentTriggered] = useState(false);
  const [attesting, setAttesting] = useState(false);
  const [attestation, setAttestation] = useState<AttestationResult | null>(null);
  const [error, setError] = useState("");
  const decisionRef = useRef<HTMLElement | null>(null);

  const walletInstalled = Boolean(provider);
  const connected = Boolean(walletAddress);

  const latestStatusLabel = useMemo(() => {
    if (statusLoading) return "Checking QuickNode RPC";
    if (status?.ok) return "QuickNode RPC Connected";
    return "QuickNode RPC Unavailable";
  }, [status, statusLoading]);

  const riskInput = useMemo(() => deriveRiskInput(operation), [operation]);
  const riskDecision = useMemo(() => calculateRisk(riskInput), [riskInput]);
  const policyDecision = useMemo(() => getPolicyDecision(riskDecision.riskScore), [riskDecision.riskScore]);
  const policyDecisionLabel = getDecisionLabel(policyDecision);

  useEffect(() => {
    setProvider(window.solana ?? null);

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as AttestationResult;
        setAttestation(parsed);
        if (parsed.payload.operation) {
          setOperation({
            amountSol: parsed.payload.operation.amountSol,
            thresholdSol: parsed.payload.operation.thresholdSol,
            signerTrusted: parsed.payload.operation.signer === "trusted",
            destinationAllowlisted: parsed.payload.operation.destination === "allowlisted",
            upgradeAuthorityInteraction: parsed.payload.operation.upgradeAuthorityInteraction,
            policyMismatch: parsed.payload.operation.policyMismatch,
            repeatedSuspiciousAttempt: parsed.payload.operation.repeatedSuspiciousAttempt,
          });
        }
        setIncidentTriggered(true);
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadStatus() {
      setStatusLoading(true);
      try {
        const response = await fetch("/api/solana/status", { cache: "no-store" });
        const body = (await response.json()) as SolanaStatus;
        if (!cancelled) setStatus(body);
      } catch (requestError) {
        if (!cancelled) {
          setStatus({ ok: false, error: requestError instanceof Error ? requestError.message : "Unable to reach status route" });
        }
      } finally {
        if (!cancelled) setStatusLoading(false);
      }
    }

    loadStatus();
    const interval = window.setInterval(loadStatus, 20_000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  async function connectWallet() {
    setError("");

    if (!provider) {
      setError("Phantom wallet was not detected. Install Phantom or enable a Solana wallet extension to sign the devnet attestation.");
      return;
    }

    try {
      const response = await provider.connect();
      setWalletAddress(response.publicKey.toString());
    } catch (connectError) {
      setError(connectError instanceof Error ? connectError.message : "Wallet connection was rejected.");
    }
  }

  function updateOperation(next: Partial<OperationDraft>) {
    setError("");
    setOperation((current) => ({
      ...current,
      ...next,
      amountSol: Math.max(0, next.amountSol ?? current.amountSol),
      thresholdSol: Math.max(0, next.thresholdSol ?? current.thresholdSol),
    }));
    if (incidentTriggered || attestation) {
      setIncidentTriggered(false);
      setAttestation(null);
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }

  function resetScenario() {
    setError("");
    setOperation(DEFAULT_OPERATION);
    setIncidentTriggered(false);
    setAttestation(null);
    window.localStorage.removeItem(STORAGE_KEY);
  }

  function triggerSuspiciousOperation() {
    setError("");
    setIncidentTriggered(true);
    // Visible feedback: scroll the freshly-revealed risk decision panel into
    // view so judges can immediately see the Block decision and CTA.
    setTimeout(() => {
      decisionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }

  // Poll on-chain confirmation so the Solana Explorer link is always valid by
  // the time the user clicks it. Server-side polling was removed because it
  // blew past the DO/Cloudflare gateway timeout.
  async function pollOnChainStatus(signature: string, initial: AttestationResult) {
    const deadline = Date.now() + 45_000;
    while (Date.now() < deadline) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      try {
        const res = await fetch(`/api/solana/tx-status?signature=${encodeURIComponent(signature)}`, { cache: "no-store" });
        const body = (await res.json().catch(() => null)) as
          | { ok?: boolean; confirmationStatus?: string | null; err?: unknown }
          | null;
        if (body?.err) {
          setError("Solana rejected the transaction on chain. Please retry the attestation.");
          return;
        }
        const cs = body?.confirmationStatus;
        if (cs === "confirmed" || cs === "finalized") {
          const updated = { ...initial, status: cs };
          setAttestation(updated);
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          return;
        }
      } catch {
        // transient network blip — keep polling within the deadline
      }
    }
  }

  async function createDevnetAttestation() {
    setError("");

    if (!provider || !connected) {
      setError("Connect a Solana wallet before creating the devnet attestation.");
      return;
    }

    if (!incidentTriggered) {
      setError("Trigger the suspicious protocol operation before attesting the risk decision.");
      return;
    }

    setAttesting(true);
    try {
      const blockhashResponse = await fetch("/api/solana/blockhash", { cache: "no-store" });
      const blockhashBody = (await blockhashResponse.json()) as { ok: boolean; blockhash?: string; error?: string };
      if (!blockhashResponse.ok || !blockhashBody.ok || !blockhashBody.blockhash) {
        throw new Error(blockhashBody.error ?? "Unable to fetch latest devnet blockhash from QuickNode.");
      }

      const payload = createAttestationPayload(operation, riskDecision);
      const transaction = new Transaction();
      transaction.feePayer = new PublicKey(walletAddress);
      transaction.recentBlockhash = blockhashBody.blockhash;
      transaction.add(
        new TransactionInstruction({
          keys: [],
          programId: new PublicKey(SOLANA_MEMO_PROGRAM_ID),
          data: Buffer.from(JSON.stringify(payload), "utf8"),
        }),
      );

      const signedTransaction = await provider.signTransaction(transaction);
      const signedTransactionBase64 = transactionToBase64(signedTransaction);
      const sendResponse = await fetch("/api/solana/send-attestation", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          signedTransaction: signedTransactionBase64,
          incidentId: PRAETOR_INCIDENT_ID,
        }),
      });
      // Tolerate non-JSON responses (e.g. an upstream HTML 504 from the gateway)
      // so the user gets a readable error instead of a JSON parse exception.
      const sendBody = (await sendResponse.json().catch(() => ({
        ok: false,
        error: "Server returned an invalid response. Your wallet may have already submitted the transaction — check Solana Explorer or your wallet activity.",
      }))) as { ok: boolean; signature?: string; explorerUrl?: string; status?: string; error?: string };
      if (!sendResponse.ok || !sendBody.ok || !sendBody.signature || !sendBody.explorerUrl) {
        throw new Error(sendBody.error ?? "Devnet attestation transaction failed.");
      }

      const result: AttestationResult = {
        signature: sendBody.signature,
        explorerUrl: sendBody.explorerUrl,
        status: sendBody.status ?? "submitted",
        payload,
      };
      setAttestation(result);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
      // Fire-and-forget client-side confirmation poll. UI updates from
      // "Submitted" → "Confirmed"/"Finalized" once the leader includes it.
      void pollOnChainStatus(sendBody.signature, result);
    } catch (attestationError) {
      setError(attestationError instanceof Error ? attestationError.message : "User rejected signing or transaction confirmation failed.");
    } finally {
      setAttesting(false);
    }
  }

  return (
    <main className="relative overflow-hidden">
      <SectionShell className="py-12 md:py-16">
        <div className="praetor-command-rail mx-auto max-w-7xl px-6 pl-10 md:pl-14">
          <GlassPanel className="rounded-2xl p-6 md:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <OperationalBadges />
                <div className="mt-3 flex flex-wrap gap-2.5">
                  <StatusBadge tone={connected ? "online" : "crimson"}>{connected ? "Wallet Connected" : "Wallet Required"}</StatusBadge>
                  <StatusBadge tone={status?.ok ? "cyan" : "red"}>{latestStatusLabel}</StatusBadge>
                </div>
                <p className="praetor-kicker mt-7">LIVE SOLANA DEVNET ATTESTATION FLOW</p>
                <h1 className="mt-3 max-w-4xl text-3xl font-black leading-[1.06] tracking-[-0.03em] text-white md:text-5xl xl:text-6xl">
                  Runtime security for privileged Solana operations.
                </h1>
                <p className="mt-4 max-w-3xl text-base leading-7 text-white/72 md:text-lg">
                  Wallet signs client-side only. Praetor never asks for private keys. QuickNode RPC provides Solana Devnet status, slot, and blockhash data.
                </p>
              </div>
              <PremiumButton onClick={connectWallet} variant={connected ? "glass" : "crimson"}>
                <Wallet className="mr-2 h-4 w-4" /> {connected ? shortenAddress(walletAddress) : "Connect Wallet"}
              </PremiumButton>
            </div>
          </GlassPanel>

          {error && (
            <div className="mt-6 rounded-xl border border-[rgba(255,32,32,0.45)] bg-[rgba(122,7,16,0.18)] p-4 text-[#FFD8D8]">
              <div className="flex gap-3"><AlertTriangle className="mt-0.5 h-4 w-4" /><p className="text-sm leading-6">{error}</p></div>
            </div>
          )}

          <section className="mt-6 grid gap-5 lg:grid-cols-2">
            <GlassPanel className="rounded-xl p-6 md:p-7">
              <PanelTitle icon={Wallet} kicker="Wallet connection" title="Sign with your Solana wallet" />
              <div className="mt-5 rounded-xl border border-white/10 bg-[#0A0A0A] p-4">
                <DetailRow label="Wallet" value={connected ? walletAddress : walletInstalled ? "Installed, not connected" : "Not detected"} />
                <DetailRow label="Network" value="Solana Devnet" />
                <DetailRow label="RPC provider" value="QuickNode (server-side)" />
                <DetailRow label="Signing model" value="Client-side only" />
              </div>
              {!connected && (
                <p className="mt-4 rounded-md border border-[rgba(255,32,32,0.32)] bg-[rgba(122,7,16,0.10)] p-3.5 text-sm leading-6 text-white/82">
                  Wallet signs client-side only. Praetor never asks for private keys.
                </p>
              )}
            </GlassPanel>

            <GlassPanel className="rounded-xl p-6 md:p-7">
              <PanelTitle icon={RadioTower} kicker="System status" title="All Systems Online" />
              <div className="mt-5 rounded-xl border border-white/10 bg-[#0A0A0A] p-4">
                <DetailRow label="Network" value="Solana Devnet" />
                <DetailRow label="QuickNode RPC" value={status?.ok ? "Connected" : status?.error ?? "Checking"} />
                <DetailRow label="Latest devnet slot" value={status?.slot ?? "Unavailable"} />
                <DetailRow label="Blockhash preview" value={status?.blockhashPreview ?? "Unavailable"} />
                <DetailRow label="Praetor Anchor program" value={shortenAddress(PRAETOR_ANCHOR_PROGRAM_ID)} href={getExplorerAddressUrl(PRAETOR_ANCHOR_PROGRAM_ID)} />
              </div>
            </GlassPanel>
          </section>

          <section className="mt-6 grid gap-5 lg:grid-cols-[0.94fr_1.06fr]">
            <GlassPanel className="rounded-xl p-6 md:p-7">
              <PanelTitle icon={ShieldCheck} kicker="Protected protocol" title="DemoDAO Treasury" />
              <div className="mt-5 rounded-xl border border-white/10 bg-[#0A0A0A] p-4">
                <DetailRow label="Category" value="DAO Treasury / DeFi Ops" />
                <DetailRow label="Protected treasury" value={DEMO_TREASURY_PUBLIC_KEY} />
                <DetailRow label="Upgrade authority policy" value="Guardian challenge required" />
                <DetailRow label="Max withdrawal threshold" value="10 SOL" />
                <DetailRow label="Unknown signer policy" value="Critical" />
                <DetailRow label="Unknown destination policy" value="Critical" />
              </div>
            </GlassPanel>

            <GlassPanel className="rounded-xl p-6 md:p-7">
              <PanelTitle icon={ShieldAlert} kicker="Attestation payload" title="Auditable protocol operation" />
              <p className="mt-4 text-sm leading-6 text-white/68">
                Edit the operation inputs before staging. Praetor computes the risk decision from deterministic rules, then commits that exact decision and rule trace to Solana Devnet.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <NumericField
                  disabled={attesting}
                  label="Withdrawal amount"
                  onChange={(amountSol) => updateOperation({ amountSol })}
                  value={operation.amountSol}
                />
                <NumericField
                  disabled={attesting}
                  label="Policy threshold"
                  onChange={(thresholdSol) => updateOperation({ thresholdSol })}
                  value={operation.thresholdSol}
                />
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <RuleToggle
                  active={!operation.signerTrusted}
                  disabled={attesting}
                  label="Unknown signer"
                  onClick={() => updateOperation({ signerTrusted: !operation.signerTrusted })}
                />
                <RuleToggle
                  active={!operation.destinationAllowlisted}
                  disabled={attesting}
                  label="Destination not allowlisted"
                  onClick={() => updateOperation({ destinationAllowlisted: !operation.destinationAllowlisted })}
                />
                <RuleToggle
                  active={operation.policyMismatch}
                  disabled={attesting}
                  label="Policy mismatch"
                  onClick={() => updateOperation({ policyMismatch: !operation.policyMismatch })}
                />
                <RuleToggle
                  active={operation.upgradeAuthorityInteraction}
                  disabled={attesting}
                  label="Upgrade authority touched"
                  onClick={() => updateOperation({ upgradeAuthorityInteraction: !operation.upgradeAuthorityInteraction })}
                />
                <RuleToggle
                  active={operation.repeatedSuspiciousAttempt}
                  disabled={attesting}
                  label="Repeated suspicious attempt"
                  onClick={() => updateOperation({ repeatedSuspiciousAttempt: !operation.repeatedSuspiciousAttempt })}
                />
              </div>
              <div className="mt-5">
                <RiskScoreMeter decision={policyDecision} reduced={reduced} risk={riskDecision} />
              </div>
              <div className="mt-5 rounded-xl border border-white/10 bg-[#0A0A0A] p-4">
                <DetailRow label="Action type" value="treasury_withdrawal" />
                <DetailRow label="Amount" value={`${operation.amountSol} SOL`} />
                <DetailRow label="Threshold" value={`${operation.thresholdSol} SOL`} />
                <DetailRow label="Signer" value={operation.signerTrusted ? "Trusted signer" : "Unknown signer"} />
                <DetailRow label="Destination" value={operation.destinationAllowlisted ? "Allowlisted wallet" : "Non-allowlisted wallet"} />
                <DetailRow label="Result" value={incidentTriggered ? "Computed risk decision staged for signing" : "Awaiting staged risk decision"} />
              </div>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <PremiumButton
                  className="w-full"
                  onClick={triggerSuspiciousOperation}
                  variant={policyDecision === "blocked" ? "danger" : "crimson"}
                  disabled={incidentTriggered || attesting}
                >
                  {incidentTriggered ? "Risk Decision Staged" : "Stage Computed Decision"}
                </PremiumButton>
                <PremiumButton className="w-full sm:w-auto" onClick={resetScenario} variant="glass" disabled={attesting}>
                  Reset
                </PremiumButton>
              </div>
            </GlassPanel>
          </section>

          <AnimatePresence>
            {incidentTriggered && (
            <motion.section
              ref={decisionRef}
              animate={reduced ? undefined : { opacity: 1, y: 0 }}
              className="mt-6 grid gap-5 lg:grid-cols-2"
              exit={reduced ? undefined : { opacity: 0, y: -12 }}
              initial={reduced ? false : { opacity: 0, y: 18 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <GlassPanel className="rounded-xl p-6 md:p-7">
                <PanelTitle icon={Ban} kicker="Risk decision" title={`Decision: ${policyDecisionLabel}`} />
                <p className="mt-4 text-sm leading-6 text-white/68">
                  {getDecisionSummary(policyDecision)}
                </p>
                <div className="mt-5">
                  <RiskScoreMeter decision={policyDecision} reduced={reduced} risk={riskDecision} />
                </div>
                <p className="mt-4 font-mono text-[10px] font-black uppercase tracking-[0.18em] text-white/45">
                  Engine · {RISK_ENGINE_VERSION}
                </p>
                <ul className="mt-4 space-y-2">
                  {riskDecision.matchedRules.length ? (
                    riskDecision.matchedRules.map((rule) => (
                      <motion.li
                        key={rule.key}
                        animate={reduced ? undefined : { opacity: 1, x: 0 }}
                        className="flex items-center justify-between gap-3 rounded-md border border-white/10 bg-[#0A0A0A] px-4 py-2.5 text-sm text-white/86"
                        initial={reduced ? false : { opacity: 0, x: -8 }}
                        transition={{ duration: 0.22, ease: "easeOut" }}
                      >
                        <span className="flex items-center gap-3">
                          <AlertTriangle className="h-4 w-4 shrink-0 text-[#FF6B6B]" /> {rule.reason}
                        </span>
                        <span className="font-mono text-xs font-black tabular-nums text-[#FF8888]">+{rule.score}</span>
                      </motion.li>
                    ))
                  ) : (
                    <li className="rounded-md border border-white/10 bg-[#0A0A0A] px-4 py-2.5 text-sm text-white/70">
                      No blocking rule matched this operation.
                    </li>
                  )}
                </ul>
              </GlassPanel>

              <GlassPanel className="rounded-xl p-6 md:p-7">
                <PanelTitle icon={CheckCircle2} kicker="Onchain attestation" title="Commit risk decision to Devnet" />
                <p className="mt-4 text-sm leading-6 text-white/68">
                  Praetor writes the computed score, decision, matching rules, and operation inputs into a Solana Memo Program transaction signed by your wallet.
                </p>
                <PremiumButton className="mt-5 w-full" onClick={createDevnetAttestation} disabled={attesting || !connected}>
                  {attesting ? "Committing Risk Decision…" : "Commit Risk Decision to Devnet"}
                </PremiumButton>

                <AnimatePresence>
                  {attestation && (
                  <motion.div
                    animate={reduced ? undefined : { opacity: 1, y: 0 }}
                    className="mt-5 rounded-xl border border-[rgba(28,201,160,0.40)] bg-[#0A0A0A] p-4"
                    initial={reduced ? false : { opacity: 0, y: 12 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    <StatusBadge
                      tone={attestation.status === "confirmed" || attestation.status === "finalized" ? "online" : "cyan"}
                      pulse
                    >
                      {attestation.status === "finalized"
                        ? "Finalized on Solana Devnet"
                        : attestation.status === "confirmed"
                        ? "Confirmed on Solana Devnet"
                        : "Submitted · Awaiting devnet confirmation"}
                    </StatusBadge>
                    <div className="mt-3">
                      <DetailRow label="Signature" value={attestation.signature} />
                      <DetailRow label="Status" value={attestation.status} />
                    </div>
                    <a className="mt-3 inline-flex items-center gap-2 font-mono text-xs font-black uppercase tracking-[0.18em] text-[#7BD9F2] hover:text-white" href={attestation.explorerUrl} target="_blank" rel="noreferrer">
                      View on Solana Explorer <ExternalLink className="h-4 w-4" />
                    </a>
                    <div className="mt-4 rounded-md border border-white/10 bg-[#050505] p-3 font-mono text-[11px] leading-6 text-white/70">
                      <p>incidentId: {attestation.payload.incidentId}</p>
                      <p>protocol: {attestation.payload.protocol}</p>
                      <p>riskEngine: {attestation.payload.riskEngine}</p>
                      <p>riskScore: {attestation.payload.riskScore}</p>
                      <p>riskLevel: {attestation.payload.riskLevel}</p>
                      <p>decision: {attestation.payload.decision}</p>
                      <p>rules: {attestation.payload.rules.map((rule) => `${rule.id}+${rule.score}`).join(", ") || "none"}</p>
                      <p>timestamp: {attestation.payload.timestamp}</p>
                    </div>
                  </motion.div>
                  )}
                </AnimatePresence>
              </GlassPanel>
            </motion.section>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {attestation && (
            <motion.div
              animate={reduced ? undefined : { opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -12 }}
              initial={reduced ? false : { opacity: 0, y: 14 }}
              transition={{ duration: 0.32, ease: "easeOut" }}
            >
            <GlassPanel className="mt-6 rounded-xl border-[rgba(255,32,32,0.45)] p-6 md:p-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <StatusBadge tone={policyDecision === "blocked" ? "crimson" : "cyan"}>Committed on Solana Devnet</StatusBadge>
                  <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-white md:text-4xl">{getDecisionSummary(policyDecision)}</h2>
                </div>
                <Ban className="h-12 w-12 shrink-0 text-[#FF6B6B]" />
              </div>
            </GlassPanel>
            </motion.div>
            )}
          </AnimatePresence>
        </div>
      </SectionShell>
    </main>
  );
}
