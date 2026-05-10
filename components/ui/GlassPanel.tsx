import type { HTMLAttributes } from "react";
import { cn } from "@/src/lib/utils";

export function GlassPanel({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("praetor-glass-panel", className)} {...props}>
      {/* Top crimson hairline — single restrained accent, no orange blob, no glass blur */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,32,32,0.42)] to-transparent"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
