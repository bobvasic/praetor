import { StatusBadge } from "@/components/ui/StatusBadge";

export function OperationalBadges({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <StatusBadge tone="online" pulse>All Systems Online</StatusBadge>
      <StatusBadge tone="devnet">Solana Devnet</StatusBadge>
      <StatusBadge tone="cyan">QuickNode RPC Connected</StatusBadge>
      <StatusBadge tone="orange">Onchain Attestation Ready</StatusBadge>
    </div>
  );
}
