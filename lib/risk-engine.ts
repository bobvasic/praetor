export type RiskLevel = "low" | "medium" | "high" | "critical";

export type Incident = {
  id: string;
  protocolName: string;
  actionType: string;
  amount: string;
  threshold: string;
  signer: string;
  destination: string;
  riskScore: number;
  riskLevel: RiskLevel;
  status: "detected" | "attested" | "challenged" | "blocked";
  reasons: string[];
  createdAt: string;
};

export type RiskInput = {
  treasuryTransferAboveThreshold?: boolean;
  unknownSigner?: boolean;
  nonAllowlistedDestination?: boolean;
  upgradeAuthorityInteraction?: boolean;
  policyMismatch?: boolean;
  repeatedSuspiciousAttempt?: boolean;
};

export type RiskResult = {
  riskScore: number;
  riskLevel: RiskLevel;
  reasons: string[];
};

const riskRules: Array<{
  key: keyof RiskInput;
  score: number;
  reason: string;
}> = [
  {
    key: "treasuryTransferAboveThreshold",
    score: 30,
    reason: "Treasury transfer above threshold",
  },
  { key: "unknownSigner", score: 25, reason: "Unknown signer" },
  {
    key: "nonAllowlistedDestination",
    score: 25,
    reason: "Destination not allowlisted",
  },
  {
    key: "upgradeAuthorityInteraction",
    score: 40,
    reason: "Upgrade authority interaction",
  },
  { key: "policyMismatch", score: 20, reason: "Policy mismatch" },
  {
    key: "repeatedSuspiciousAttempt",
    score: 15,
    reason: "Repeated suspicious attempt",
  },
];

export function getRiskLevel(score: number): RiskLevel {
  if (score >= 80) return "critical";
  if (score >= 60) return "high";
  if (score >= 30) return "medium";
  return "low";
}

export function calculateRisk(input: RiskInput): RiskResult {
  const matchedRules = riskRules.filter((rule) => input[rule.key]);
  const riskScore = Math.min(
    100,
    matchedRules.reduce((total, rule) => total + rule.score, 0),
  );

  return {
    riskScore,
    riskLevel: getRiskLevel(riskScore),
    reasons: matchedRules.map((rule) => rule.reason),
  };
}
