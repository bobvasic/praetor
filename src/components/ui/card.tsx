import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/src/lib/utils";

const cardVariants = cva(
  "command-card relative overflow-hidden rounded-2xl border p-6 backdrop-blur-xl transition duration-300",
  {
    variants: {
      variant: {
        default:
          "border-titanium/[0.10] bg-panel-gradient shadow-command hover:border-arctic/[0.22] hover:shadow-[0_28px_100px_rgba(44,82,255,0.16)]",
        hero:
          "border-arctic/[0.18] bg-[linear-gradient(145deg,rgba(9,11,16,0.94),rgba(19,24,38,0.90)_48%,rgba(11,46,74,0.62))] shadow-[0_34px_120px_rgba(44,82,255,0.20)] hover:border-arctic/[0.32] hover:shadow-[0_40px_140px_rgba(152,233,255,0.18)]",
        metric:
          "border-titanium/[0.12] bg-[linear-gradient(180deg,rgba(19,24,38,0.88),rgba(9,11,16,0.82))] shadow-command hover:border-arctic/[0.24] hover:bg-arctic/[0.05]",
        incident:
          "border-alert/[0.32] bg-[linear-gradient(145deg,rgba(255,91,110,0.13),rgba(19,24,38,0.88)_42%,rgba(9,11,16,0.94))] shadow-[0_28px_100px_rgba(255,91,110,0.12)] hover:border-alert/[0.48] hover:shadow-[0_34px_120px_rgba(255,91,110,0.16)]",
        subtle:
          "border-titanium/[0.10] bg-obsidian/[0.52] shadow-none hover:border-arctic/[0.22] hover:bg-arctic/[0.045]",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export type CardProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardVariants>;

const cardAccents = {
  default: {
    top: "via-arctic/[0.55]",
    glow: "bg-arctic/[0.05]",
  },
  hero: {
    top: "via-arctic/[0.78]",
    glow: "bg-sovereign/[0.16]",
  },
  metric: {
    top: "via-titanium/[0.36]",
    glow: "bg-arctic/[0.045]",
  },
  incident: {
    top: "via-alert/[0.72]",
    glow: "bg-alert/[0.08]",
  },
  subtle: {
    top: "via-titanium/[0.22]",
    glow: "bg-graphite/[0.10]",
  },
};

export function Card({ className, children, variant = "default", ...props }: CardProps) {
  const accents = cardAccents[variant ?? "default"];

  return (
    <div className={cn(cardVariants({ variant }), className)} {...props}>
      <div className={cn("pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent", accents.top)} />
      <div className={cn("pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full blur-3xl", accents.glow)} />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
