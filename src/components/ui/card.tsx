import type { HTMLAttributes } from "react";
import { cn } from "@/src/lib/utils";

export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-titanium/[0.10] bg-panel-gradient p-6 shadow-card backdrop-blur transition duration-300 hover:border-arctic/[0.18] hover:shadow-[0_24px_80px_rgba(44,82,255,0.12)]",
        className,
      )}
      {...props}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-arctic/[0.45] to-transparent" />
      {children}
    </div>
  );
}
