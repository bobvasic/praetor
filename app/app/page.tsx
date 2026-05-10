"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Ban, CheckCircle2, ExternalLink, RadioTower, ShieldAlert, ShieldCheck, Wallet, type LucideIcon } from "lucide-react";
import { PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js";
import { OperationalBadges } from "@/components/OperationalBadges";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { SectionShell } from "@/components/ui/SectionShell";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PRAETOR_ANCHOR_PROGRAM_ID, PRAETOR_INCIDENT_ID, SOLANA_MEMO_PROGRAM_ID, getExplorerAddressUrl } from "@/lib/solana/constants";

const STORAGE_KEY = "praetor.devnet.attestation.inc_demo_001";
const DEMO_TREASURY_PUBLIC_KEY = "Dk22YaGKhnsaD7pLvCJyejHo3xj6NkSuvaCgbMVZLYgy";
const RISK_REASONS = [
  "Treasury transfer above threshold",
  "Unknown signer",
  "Destination not allowlisted",
  "Policy mismatch",
];

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
  riskScore: 91;
  riskLevel: "critical";
  decision: "blocked";
  actionType: "treasury_withdrawal";
  reason: "treasury_withdrawal_above_threshold";
  guardianChallengeRequired: true;
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

function createAttestationPayload(): AttestationPayload {
  return {
    app: "Praetor",
    network: "solana-devnet",
    type: "risk_attestation",
    incidentId: PRAETOR_INCIDENT_ID,
    protocol: "DemoDAO Treasury",
    riskScore: 91,
    riskLevel: "critical",
    decision: "blocked",
    actionType: "treasury_withdrawal",
    reason: "treasury_withdrawal_above_threshold",
    guardianChallengeRequired: true,
    timestamp: new Date().toISOString(),
  };
}

function DetailRow({ label, value, href }: { label: string; value: string | number; href?: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/10 py-3 last:border-b-0">
      <span className="text-sm text-[var(--praetor-muted)]">{label}</span>
      {href ? (
        <a className="inline-flex max-w-[62%] items-center gap-2 break-all text-right font-mono text-sm font-bold text-[var(--praetor-cyan)] hover:text-white" href={href} target="_blank" rel="noreferrer">
          {value} <ExternalLink className="h-3.5 w-3.5 shrink-0" />
        </a>
      ) : (
        <span className="max-w-[62%] break-words text-right font-mono text-sm font-bold text-white">{value}</span>
      )}
    </div>
  );
}

function PanelTitle({ icon: Icon, kicker, title }: { icon: LucideIcon; kicker: string; title: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="rounded-2xl border border-white/15 bg-white/[0.07] p-3 text-[var(--praetor-orange-soft)]">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="praetor-kicker">{kicker}</p>
        <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-white md:text-3xl">{title}</h2>
      </div>
    </div>
  );
}

export default function PraetorAppPage() {
  const [provider, setProvider] = useState<PhantomProvider | null>(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [status, setStatus] = useState<SolanaStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const [incidentTriggered, setIncidentTriggered] = useState(false);
  const [attesting, setAttesting] = useState(false);
  const [attestation, setAttestation] = useState<AttestationResult | null>(null);
  const [error, setError] = useState("");

  const walletInstalled = Boolean(provider);
  const connected = Boolean(walletAddress);

  const latestStatusLabel = useMemo(() => {
    if (statusLoading) return "Checking QuickNode RPC";
    if (status?.ok) return "QuickNode RPC Connected";
    return "QuickNode RPC Unavailable";
  }, [status, statusLoading]);

  useEffect(() => {
    setProvider(window.solana ?? null);

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setAttestation(JSON.parse(stored) as AttestationResult);
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

  function triggerSuspiciousOperation() {
    setError("");
    setIncidentTriggered(true);
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

      const payload = createAttestationPayload();
      const transaction = new Transaction();
      transaction.feePayer = new PublicKey(walletAddress);
      transaction.recentBlockhash = blockhashBody.blockhash;
      transaction.add(
        new TransactionInstruction({
          keys: [],
          programId: new PublicKey(SOLANA_MEMO_PROGRAM_ID),
          data: new TextEncoder().encode(JSON.stringify(payload)),
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
      const sendBody = (await sendResponse.json()) as { ok: boolean; signature?: string; explorerUrl?: string; status?: string; error?: string };
      if (!sendResponse.ok || !sendBody.ok || !sendBody.signature || !sendBody.explorerUrl) {
        throw new Error(sendBody.error ?? "Devnet attestation transaction failed.");
      }

      const result = {
        signature: sendBody.signature,
        explorerUrl: sendBody.explorerUrl,
        status: sendBody.status ?? "confirmed",
        payload,
      };
      setAttestation(result);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
    } catch (attestationError) {
      setError(attestationError instanceof Error ? attestationError.message : "User rejected signing or transaction confirmation failed.");
    } finally {
      setAttesting(false);
    }
  }

  return (
    <main className="overflow-hidden">
      <SectionShell className="py-10 md:py-14">
        <div className="praetor-command-rail mx-auto max-w-7xl px-6 pl-10 md:pl-14">
          <GlassPanel className="p-6 md:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <OperationalBadges />
                <div className="mt-3 flex flex-wrap gap-3">
                  <StatusBadge tone={connected ? "online" : "orange"}>{connected ? "Wallet Connected" : "Wallet Required"}</StatusBadge>
                  <StatusBadge tone={status?.ok ? "cyan" : "red"}>{latestStatusLabel}</StatusBadge>
                </div>
                <h1 className="mt-6 max-w-5xl text-5xl font-black tracking-[-0.06em] text-white md:text-7xl">Praetor live devnet workflow.</h1>
                <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--praetor-muted)]">
                  Connect a wallet, run a deterministic protocol incident simulation, sign a Memo Program attestation on Solana Devnet, and verify the real transaction in Solana Explorer. Powered by QuickNode RPC; wallet signs client-side and Praetor never handles private keys.
                </p>
              </div>
              <PremiumButton onClick={connectWallet} variant={connected ? "glass" : "orange"}>
                <Wallet className="mr-2 h-4 w-4" /> {connected ? shortenAddress(walletAddress) : "Connect Wallet"}
              </PremiumButton>
            </div>
          </GlassPanel>

          {error && (
            <div className="mt-6 rounded-3xl border border-[rgba(255,91,110,0.45)] bg-[rgba(255,91,110,0.12)] p-5 text-red-50">
              <div className="flex gap-3"><AlertTriangle className="mt-0.5 h-5 w-5" /><p>{error}</p></div>
            </div>
          )}

          <section className="mt-6 grid gap-6 lg:grid-cols-2">
            <GlassPanel className="p-6 md:p-7">
              <PanelTitle icon={Wallet} kicker="Wallet connection panel" title="Sign with your Solana wallet" />
              <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.05] p-5">
                <DetailRow label="Wallet" value={connected ? walletAddress : walletInstalled ? "Installed, not connected" : "Not detected"} />
                <DetailRow label="Network" value="Solana Devnet" />
                <DetailRow label="RPC provider" value="QuickNode via server API routes" />
                <DetailRow label="Signing model" value="Wallet signs client-side only" />
              </div>
              {!connected && (
                <p className="mt-5 rounded-2xl border border-[rgba(255,130,0,0.35)] bg-[rgba(255,130,0,0.10)] p-4 text-sm leading-6 text-amber-50">
                  Wallet connection is required. Praetor never asks for private keys and never signs transactions server-side.
                </p>
              )}
            </GlassPanel>

            <GlassPanel className="p-6 md:p-7">
              <PanelTitle icon={RadioTower} kicker="System status panel" title="All Systems Online" />
              <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.05] p-5">
                <DetailRow label="Network" value="Solana Devnet" />
                <DetailRow label="QuickNode RPC" value={status?.ok ? "Connected" : status?.error ?? "Checking"} />
                <DetailRow label="Latest devnet slot" value={status?.slot ?? "Unavailable"} />
                <DetailRow label="Blockhash preview" value={status?.blockhashPreview ?? "Unavailable"} />
                <DetailRow label="Praetor Anchor program" value={shortenAddress(PRAETOR_ANCHOR_PROGRAM_ID)} href={getExplorerAddressUrl(PRAETOR_ANCHOR_PROGRAM_ID)} />
              </div>
            </GlassPanel>
          </section>

          <section className="mt-6 grid gap-6 lg:grid-cols-[0.94fr_1.06fr]">
            <GlassPanel className="p-6 md:p-7">
              <PanelTitle icon={ShieldCheck} kicker="Protected protocol profile" title="DemoDAO Treasury" />
              <div className="mt-6 space-y-2 rounded-3xl border border-white/10 bg-white/[0.05] p-5">
                <DetailRow label="Category" value="DAO Treasury / DeFi Ops" />
                <DetailRow label="Protected treasury" value={DEMO_TREASURY_PUBLIC_KEY} />
                <DetailRow label="Upgrade authority policy" value="Guardian challenge required" />
                <DetailRow label="Max withdrawal threshold" value="10 SOL" />
                <DetailRow label="Unknown signer policy" value="Critical" />
                <DetailRow label="Unknown destination policy" value="Critical" />
              </div>
            </GlassPanel>

            <GlassPanel className="p-6 md:p-7">
              <PanelTitle icon={ShieldAlert} kicker="Incident simulation panel" title="Suspicious protocol operation" />
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <DetailRow label="Action type" value="treasury_withdrawal" />
                <DetailRow label="Amount" value="25 SOL" />
                <DetailRow label="Signer" value="Unknown signer" />
                <DetailRow label="Destination" value="Non-allowlisted wallet" />
                <DetailRow label="Threshold" value="10 SOL" />
                <DetailRow label="Result" value={incidentTriggered ? "Risk decision generated" : "Awaiting trigger"} />
              </div>
              <PremiumButton className="mt-6 w-full" onClick={triggerSuspiciousOperation} variant="danger">
                Trigger Suspicious Operation
              </PremiumButton>
            </GlassPanel>
          </section>

          {incidentTriggered && (
            <section className="mt-6 grid gap-6 lg:grid-cols-2">
              <GlassPanel className="border-[rgba(255,91,110,0.38)] p-6 md:p-7">
                <PanelTitle icon={Ban} kicker="Risk decision panel" title="Decision: Block" />
                <div className="mt-6 rounded-3xl border border-[rgba(255,91,110,0.34)] bg-[rgba(255,91,110,0.11)] p-6">
                  <p className="font-mono text-xs font-black uppercase tracking-[0.2em] text-red-100">Risk Score</p>
                  <p className="mt-2 text-7xl font-black text-red-50">91</p>
                  <p className="mt-3 text-xl font-black uppercase text-red-50">Risk Level: Critical</p>
                </div>
                <ul className="mt-5 space-y-3">
                  {RISK_REASONS.map((reason) => (
                    <li key={reason} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3 text-sm text-white">
                      <AlertTriangle className="h-4 w-4 text-red-100" /> {reason}
                    </li>
                  ))}
                </ul>
              </GlassPanel>

              <GlassPanel className="p-6 md:p-7">
                <PanelTitle icon={CheckCircle2} kicker="Onchain attestation panel" title="Create Memo Program attestation" />
                <p className="mt-5 text-sm leading-6 text-[var(--praetor-muted)]">
                  Praetor fetches a fresh devnet blockhash from QuickNode, builds a Memo Program transaction in the browser, asks your wallet to sign it, and sends only the signed transaction bytes to the server API.
                </p>
                <PremiumButton className="mt-6 w-full" onClick={createDevnetAttestation} disabled={attesting || !connected}>
                  {attesting ? "Creating Devnet Attestation…" : "Create Devnet Attestation"}
                </PremiumButton>

                {attestation && (
                  <div className="mt-6 rounded-3xl border border-[rgba(28,142,134,0.45)] bg-[rgba(28,142,134,0.12)] p-5">
                    <StatusBadge tone="online" pulse>Confirmed</StatusBadge>
                    <DetailRow label="Signature" value={attestation.signature} />
                    <DetailRow label="Status" value={attestation.status} />
                    <a className="mt-4 inline-flex items-center gap-2 font-mono text-sm font-black uppercase tracking-[0.16em] text-[var(--praetor-cyan)] hover:text-white" href={attestation.explorerUrl} target="_blank" rel="noreferrer">
                      View on Solana Explorer <ExternalLink className="h-4 w-4" />
                    </a>
                    <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4 font-mono text-xs leading-6 text-[var(--praetor-muted)]">
                      <p>incidentId: {attestation.payload.incidentId}</p>
                      <p>protocol: {attestation.payload.protocol}</p>
                      <p>riskScore: {attestation.payload.riskScore}</p>
                      <p>decision: {attestation.payload.decision}</p>
                      <p>timestamp: {attestation.payload.timestamp}</p>
                    </div>
                  </div>
                )}
              </GlassPanel>
            </section>
          )}

          {attestation && (
            <GlassPanel className="mt-6 border-[rgba(255,130,0,0.45)] p-6 md:p-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <StatusBadge tone="orange">Final blocked state</StatusBadge>
                  <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] text-white">Execution blocked by Praetor policy.</h2>
                </div>
                <Ban className="h-14 w-14 text-[var(--praetor-orange-soft)]" />
              </div>
            </GlassPanel>
          )}
        </div>
      </SectionShell>
    </main>
  );
}
