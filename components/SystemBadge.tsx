import { CircuitBoard, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/src/lib/utils";

type SystemBadgeProps = {
  kind?: "online" | "devnet" | "mvp";
  children?: ReactNode;
  className?: string;
  compact?: boolean;
};

const badgeCopy = {
  online: "All Systems Online",
  devnet: "Solana Devnet",
  mvp: "Devnet-ready MVP",
} as const;

export function SystemBadge({
  kind = "online",
  children,
  className,
  compact = false,
}: SystemBadgeProps) {
  const Icon = kind === "devnet" ? CircuitBoard : ShieldCheck;

  return (
    <span
      className={cn(
        "status-badge-premium relative inline-flex items-center gap-2.5 overflow-hidden font-mono text-[11px] font-bold uppercase tracking-[0.22em]",
        kind === "devnet" && "solana-pill text-arctic",
        kind === "online" && "text-teal-100",
        kind === "mvp" && "border-gold/[0.30] text-amber-100",
        compact ? "px-3.5 py-1.5" : "px-4 py-2",
        className,
      )}
    >
      <span className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white/[0.10] to-transparent" />
      {kind === "online" ? (
        <span className="live-pulse-dot relative z-10 h-2 w-2 rounded-full bg-secure" />
      ) : (
        <Icon
          className={cn(
            "relative z-10 h-3.5 w-3.5",
            kind === "devnet" ? "text-[#14F195]" : "text-amber-100",
          )}
          aria-hidden
        />
      )}
      <span className="relative z-10">{children ?? badgeCopy[kind]}</span>
    </span>
  );
}
