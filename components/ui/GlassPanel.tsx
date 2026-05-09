import type { HTMLAttributes } from "react";
import { cn } from "@/src/lib/utils";

export function GlassPanel({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("praetor-glass-panel", className)} {...props}>
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/55 to-transparent" />
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[rgba(255,130,0,0.13)] blur-3xl" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
