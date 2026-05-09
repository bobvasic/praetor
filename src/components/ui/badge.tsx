import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/src/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] shadow-[inset_0_1px_0_rgba(255,255,255,0.10)] backdrop-blur-xl",
  {
    variants: {
      tone: {
        cyan: "border-arctic/[0.35] bg-arctic/[0.10] text-arctic",
        red: "border-alert/[0.35] bg-alert/[0.10] text-red-100",
        green: "border-secure/[0.45] bg-secure/[0.15] text-teal-100",
        slate: "border-titanium/[0.15] bg-titanium/[0.05] text-titanium",
        gold: "border-gold/[0.45] bg-gold/[0.10] text-amber-100",
        blue: "border-sovereign/[0.45] bg-sovereign/[0.15] text-blue-100",
      },
      pulse: {
        true: "animate-[subtle-pulse_2.6s_ease-in-out_infinite]",
        false: "",
      },
    },
    defaultVariants: { tone: "cyan", pulse: false },
  },
);

export type BadgeProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>;

export function Badge({ className, tone, pulse, ...props }: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ tone, pulse }), className)}
      {...props}
    />
  );
}
