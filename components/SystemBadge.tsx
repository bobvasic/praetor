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
        "relative inline-flex items-center gap-2 rounded-full border font-mono text-[10px] font-black uppercase tracking-[0.22em]",
        kind === "online" && "border-[rgba(28,201,160,0.45)] bg-[#0A0A0A] text-[#5DE0BB]",
        kind === "devnet" && "border-[rgba(94,227,255,0.40)] bg-[#0A0A0A] text-[#7BD9F2]",
        kind === "mvp" && "border-[rgba(255,32,32,0.45)] bg-[#0A0A0A] text-[#FF6B6B]",
        compact ? "px-3 py-1" : "px-3.5 py-1.5",
        className,
      )}
    >
      {kind === "online" ? (
        <span className="live-pulse-dot relative z-10 h-1.5 w-1.5 rounded-full bg-current" />
      ) : (
        <Icon
          className="relative z-10 h-3.5 w-3.5"
          aria-hidden
        />
      )}
      <span className="relative z-10">{children ?? badgeCopy[kind]}</span>
    </span>
  );
}
