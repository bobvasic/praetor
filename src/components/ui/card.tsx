import type { HTMLAttributes } from "react";
import { cn } from "@/src/lib/utils";

export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "command-card relative overflow-hidden rounded-2xl border border-titanium/[0.10] bg-panel-gradient p-6 shadow-command backdrop-blur-xl transition duration-300 hover:border-arctic/[0.22] hover:shadow-[0_28px_100px_rgba(44,82,255,0.16)]",
        className,
      )}
      {...props}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-arctic/[0.55] to-transparent" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-arctic/[0.05] blur-3xl" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
