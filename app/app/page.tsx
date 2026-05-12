"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Buffer } from "buffer";
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

export default function PraetorAppPage() {
  const [provider, setProvider] = useState<PhantomProvider | null>(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [status, setStatus] = useState<SolanaStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);
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

      const payload = createAttestationPayload();
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
              <PanelTitle icon={ShieldAlert} kicker="Attestation payload" title="High-risk protocol operation" />
              <p className="mt-4 text-sm leading-6 text-white/68">
                25 SOL withdrawal policy payload against a 10 SOL threshold. The Solana blockhash, signature, submission, and confirmation are fetched from devnet.
              </p>
              <div className="mt-5 rounded-xl border border-white/10 bg-[#0A0A0A] p-4">
                <DetailRow label="Action type" value="treasury_withdrawal" />
                <DetailRow label="Amount" value="25 SOL" />
                <DetailRow label="Threshold" value="10 SOL" />
                <DetailRow label="Signer" value="Unknown signer" />
                <DetailRow label="Destination" value="Non-allowlisted wallet" />
                <DetailRow label="Result" value={incidentTriggered ? "Risk decision staged for signing" : "Awaiting wallet-signed attestation"} />
              </div>
              <PremiumButton
                className="mt-5 w-full"
                onClick={triggerSuspiciousOperation}
                variant="danger"
                disabled={incidentTriggered}
              >
                {incidentTriggered ? "Policy Payload Staged" : "Stage Attestation Payload"}
              </PremiumButton>
            </GlassPanel>
          </section>

          {incidentTriggered && (
            <section ref={decisionRef} className="mt-6 grid gap-5 lg:grid-cols-2">
              <GlassPanel className="rounded-xl p-6 md:p-7">
                <PanelTitle icon={Ban} kicker="Risk decision" title="Decision: Block" />
                <p className="mt-4 text-sm leading-6 text-white/68">
                  Decision: Block. Guardian challenge required.
                </p>
                <div className="mt-5 rounded-xl border border-[rgba(255,32,32,0.45)] bg-[rgba(122,7,16,0.16)] p-5">
                  <p className="font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#FF8888]">Risk Score</p>
                  <p className="mt-1.5 text-6xl font-black tabular-nums text-[#FF6B6B]">91</p>
                  <p className="mt-2 font-mono text-xs font-black uppercase tracking-[0.22em] text-[#FF8888]">Risk Level · Critical</p>
                </div>
                <ul className="mt-4 space-y-2">
                  {RISK_REASONS.map((reason) => (
                    <li key={reason} className="flex items-center gap-3 rounded-md border border-white/10 bg-[#0A0A0A] px-4 py-2.5 text-sm text-white/86">
                      <AlertTriangle className="h-4 w-4 shrink-0 text-[#FF6B6B]" /> {reason}
                    </li>
                  ))}
                </ul>
              </GlassPanel>

              <GlassPanel className="rounded-xl p-6 md:p-7">
                <PanelTitle icon={CheckCircle2} kicker="Onchain attestation" title="Create Memo Program attestation" />
                <p className="mt-4 text-sm leading-6 text-white/68">
                  Praetor fetches a fresh devnet blockhash from QuickNode, builds a Memo Program transaction in the browser, asks your wallet to sign it, and sends only the signed transaction bytes to the server API.
                </p>
                <PremiumButton className="mt-5 w-full" onClick={createDevnetAttestation} disabled={attesting || !connected}>
                  {attesting ? "Creating Devnet Attestation…" : "Create Devnet Attestation"}
                </PremiumButton>

                {attestation && (
                  <div className="mt-5 rounded-xl border border-[rgba(28,201,160,0.40)] bg-[#0A0A0A] p-4">
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
            <GlassPanel className="mt-6 rounded-xl border-[rgba(255,32,32,0.45)] p-6 md:p-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <StatusBadge tone="crimson">Final blocked state</StatusBadge>
                  <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-white md:text-4xl">Execution blocked by Praetor policy.</h2>
                </div>
                <Ban className="h-12 w-12 shrink-0 text-[#FF6B6B]" />
              </div>
            </GlassPanel>
          )}
        </div>
      </SectionShell>
    </main>
  );
}
