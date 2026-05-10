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
    address: "Dk22YaGKhnsaD7pLvCJyejHo3xj6NkSuvaCgbMVZLYgy",
    policy: "Max withdrawal without review: 10 SOL",
    status: "Active",
  },
  {
    label: "Upgrade Authority",
    address: "8h16LZgH6Hm5RmjdNHW1wtVGHPpw716ETKLLgniK5rh",
    policy: "Any upgrade authority touch becomes guardian-reviewable",
    status: "Active",
  },
  {
    label: "Operations Multisig",
    address: "7BorHb7UL3PcGSrbfWMZcLpBNWyShk6XJWb2zLbMJtnz",
    policy: "Unknown signer escalates to critical severity",
    status: "Active",
  },
  {
    label: "Guardian Wallet",
    address: "93RffqaHrZW1ZEHQAeucm8GciyFLB6ME7Jou8XWFxYSe",
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
