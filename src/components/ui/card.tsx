import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/src/lib/utils";

const cardVariants = cva(
  "command-card relative overflow-hidden rounded-[1.65rem] border p-6 backdrop-blur-2xl transition duration-300",
  {
    variants: {
      variant: {
        default:
          "border-white/[0.105] bg-[linear-gradient(145deg,rgba(255,255,255,0.085),rgba(255,255,255,0.026)_38%,rgba(152,233,255,0.035)),rgba(9,11,16,0.62)] shadow-command hover:border-arctic/[0.24] hover:shadow-[0_30px_105px_rgba(44,82,255,0.17)]",
        hero: "border-arctic/[0.22] bg-[radial-gradient(circle_at_24%_0%,rgba(153,69,255,0.15),transparent_22rem),radial-gradient(circle_at_82%_12%,rgba(20,241,149,0.10),transparent_20rem),linear-gradient(145deg,rgba(9,11,16,0.92),rgba(19,24,38,0.82)_48%,rgba(11,46,74,0.58))] shadow-[0_38px_130px_rgba(44,82,255,0.22)] hover:border-arctic/[0.36] hover:shadow-[0_42px_150px_rgba(152,233,255,0.18)]",
        metric:
          "border-white/[0.10] bg-[linear-gradient(180deg,rgba(255,255,255,0.072),rgba(19,24,38,0.72)_36%,rgba(9,11,16,0.78))] shadow-command hover:border-arctic/[0.24] hover:bg-arctic/[0.05]",
        incident:
          "border-alert/[0.34] bg-[radial-gradient(circle_at_80%_0%,rgba(255,91,110,0.18),transparent_18rem),linear-gradient(145deg,rgba(255,91,110,0.13),rgba(19,24,38,0.86)_42%,rgba(9,11,16,0.93))] shadow-[0_28px_100px_rgba(255,91,110,0.13)] hover:border-alert/[0.50] hover:shadow-[0_34px_120px_rgba(255,91,110,0.17)]",
        subtle:
          "border-white/[0.085] bg-[linear-gradient(145deg,rgba(255,255,255,0.055),rgba(9,11,16,0.48))] shadow-none hover:border-arctic/[0.22] hover:bg-arctic/[0.045]",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export type CardProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof cardVariants>;

const cardAccents = {
  default: { top: "via-white/45", glow: "bg-arctic/[0.055]" },
  hero: { top: "via-arctic/[0.82]", glow: "bg-sovereign/[0.16]" },
  metric: { top: "via-titanium/[0.42]", glow: "bg-arctic/[0.045]" },
  incident: { top: "via-alert/[0.72]", glow: "bg-alert/[0.08]" },
  subtle: { top: "via-titanium/[0.24]", glow: "bg-graphite/[0.10]" },
};

export function Card({
  className,
  children,
  variant = "default",
  ...props
}: CardProps) {
  const accents = cardAccents[variant ?? "default"];

  return (
    <div className={cn(cardVariants({ variant }), className)} {...props}>
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent",
          accents.top,
        )}
      />
      <div
        className={cn(
          "pointer-events-none absolute -right-24 -top-24 h-52 w-52 rounded-full blur-3xl",
          accents.glow,
        )}
      />
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.105),inset_0_-1px_0_rgba(255,255,255,0.035)]" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
