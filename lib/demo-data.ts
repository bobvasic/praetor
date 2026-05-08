export const demoIncident = {
  id: "inc_praetor_091",
  protocol: "Demo Protocol",
  protectedWallet: "PraeTore7ury11111111111111111111111111111",
  destination: "9xQeWvG816bUx9EPf2Q6DemoUnknownVault1111",
  actionType: "treasury_withdrawal",
  amount: "18,500 SOL",
  riskScore: 91,
  riskLevel: "critical",
  status: "detected",
  reasons: [
    "Treasury transfer above threshold",
    "Unknown signer",
    "Destination not allowlisted",
  ],
  detectedAt: "2026-05-08T00:00:00.000Z",
} as const;

export const protectedAddresses = [
  {
    label: "Protected Treasury Wallet",
    address: "PraeTore7ury11111111111111111111111111111",
    policy:
      "Treasury withdrawals require allowlisted destination + guardian delay",
    status: "Monitoring",
  },
  {
    label: "Upgrade Authority",
    address: "PraeUpgradeAuth222222222222222222222222222",
    policy: "Program upgrades require two guardian attestations",
    status: "Monitoring",
  },
  {
    label: "Governance Executor",
    address: "PraeGovExec333333333333333333333333333333",
    policy: "Execution blocked during open critical challenge",
    status: "Monitoring",
  },
] as const;

export const policyRules = [
  "Flag treasury transfers above 1,000 SOL",
  "Require signer reputation and owner match",
  "Allowlist known treasury destinations",
  "Open guardian challenge window for critical actions",
  "Block execution when challenge is unresolved",
] as const;
