import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import { cn } from "@/src/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl font-mono text-xs font-black uppercase tracking-[0.16em] transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arctic/70 focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40 active:translate-y-px",
  {
    variants: {
      variant: {
        primary:
          "border border-arctic/[0.32] bg-gradient-to-r from-sovereign via-[#46B9FF] to-arctic text-obsidian shadow-glow hover:border-white/[0.46] hover:shadow-[0_0_62px_rgba(152,233,255,0.26)] motion-safe:hover:-translate-y-0.5",
        hero: "rounded-2xl border border-arctic/[0.34] bg-[linear-gradient(135deg,#2C52FF_0%,#46B9FF_42%,#98E9FF_100%)] text-obsidian shadow-[0_18px_64px_rgba(44,82,255,0.34),0_0_48px_rgba(152,233,255,0.28)] hover:border-white/[0.52] hover:shadow-[0_24px_82px_rgba(44,82,255,0.44),0_0_74px_rgba(152,233,255,0.38)] motion-safe:hover:-translate-y-0.5",
        command:
          "border border-white/[0.14] bg-white/[0.065] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.11),0_16px_44px_rgba(0,0,0,0.24)] backdrop-blur-xl hover:border-arctic/[0.40] hover:bg-arctic/[0.10] motion-safe:hover:-translate-y-0.5",
        secondary:
          "border border-titanium/[0.15] bg-titanium/[0.05] text-white hover:border-arctic/[0.35] hover:bg-arctic/[0.10]",
        outline:
          "border border-arctic/[0.35] bg-arctic/[0.10] text-arctic hover:border-arctic/[0.60] hover:bg-arctic/[0.15] motion-safe:hover:-translate-y-0.5",
        danger:
          "border border-alert/[0.42] bg-[linear-gradient(135deg,rgba(255,91,110,0.96),rgba(160,32,54,0.90))] text-white shadow-[0_16px_54px_rgba(255,91,110,0.18)] hover:border-red-100/60 hover:bg-alert motion-safe:hover:-translate-y-0.5",
        gold: "border border-gold/[0.48] bg-[linear-gradient(135deg,rgba(199,161,91,0.22),rgba(255,226,163,0.10))] text-amber-100 hover:bg-gold/[0.20] hover:shadow-gold motion-safe:hover:-translate-y-0.5",
        ghost: "text-titanium hover:bg-titanium/[0.06] hover:text-arctic",
        white: "bg-white text-obsidian hover:bg-arctic",
      },
      size: {
        sm: "px-4 py-2",
        md: "px-5 py-3",
        lg: "px-7 py-4",
        hero: "px-8 py-4 text-sm tracking-[0.18em]",
        command: "px-5 py-4",
        compact: "px-3.5 py-2 text-[10px] tracking-[0.18em]",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof buttonVariants> & {
    href: string;
    children: ReactNode;
  };

export function ButtonLink({
  className,
  variant,
  size,
  href,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
