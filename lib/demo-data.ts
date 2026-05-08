import { calculateRisk, type Incident } from "@/lib/risk-engine";

export const demoCreatedAt = "2026-05-08T00:00:00.000Z";

export const demoRisk = calculateRisk({
  treasuryTransferAboveThreshold: true,
  unknownSigner: true,
  nonAllowlistedDestination: true,
  policyMismatch: true,
});

export const demoIncident: Incident = {
  id: "inc_demo_001",
  protocolName: "DemoDAO Treasury",
  actionType: "treasury_withdrawal",
  amount: "25 SOL",
  threshold: "10 SOL",
  signer: "Unknown signer",
  destination: "Non-allowlisted wallet",
  riskScore: 91,
  riskLevel: "critical",
  status: "detected",
  reasons: demoRisk.reasons,
  createdAt: demoCreatedAt,
};

export function createDemoIncident(): Incident {
  return {
    ...demoIncident,
    createdAt: new Date().toISOString(),
  };
}

export const protectedAddresses = [
  {
    label: "Main Treasury",
    address: "PraeTore7ury11111111111111111111111111111",
    policy: "Max withdrawal without review: 10 SOL",
    status: "Active",
  },
  {
    label: "Upgrade Authority",
    address: "PraeUpgradeAuth222222222222222222222222222",
    policy: "Any upgrade authority touch becomes guardian-reviewable",
    status: "Active",
  },
  {
    label: "Operations Multisig",
    address: "PraeOpsMulti3333333333333333333333333333",
    policy: "Unknown signer escalates to critical severity",
    status: "Active",
  },
  {
    label: "Guardian Wallet",
    address: "PraeGuardian4444444444444444444444444444",
    policy: "Guardian challenge required before execution resumes",
    status: "Active",
  },
] as const;

export const policyRules = [
  "Max withdrawal without review: 10 SOL",
  "Unknown signer: Critical",
  "Unknown destination: Critical",
  "Guardian challenge required: Yes",
] as const;

export const flowSteps = ["Detect", "Attest", "Challenge", "Block"] as const;
