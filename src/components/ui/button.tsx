import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/src/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg font-mono text-xs font-black uppercase tracking-[0.16em] transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arctic/70 focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40",
  {
    variants: {
      variant: {
        primary: "bg-gradient-to-r from-sovereign to-arctic text-obsidian shadow-glow hover:shadow-[0_0_58px_rgba(152,233,255,0.22)]",
        hero: "rounded-xl border border-arctic/[0.30] bg-[linear-gradient(135deg,#2C52FF_0%,#46B9FF_46%,#98E9FF_100%)] text-obsidian shadow-[0_18px_64px_rgba(44,82,255,0.34),0_0_48px_rgba(152,233,255,0.28)] hover:border-white/[0.42] hover:shadow-[0_24px_80px_rgba(44,82,255,0.42),0_0_68px_rgba(152,233,255,0.34)] motion-safe:hover:-translate-y-0.5",
        command: "border border-titanium/[0.18] bg-obsidian/[0.62] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:border-arctic/[0.38] hover:bg-arctic/[0.09]",
        secondary: "border border-titanium/[0.15] bg-titanium/[0.05] text-white hover:border-arctic/[0.35] hover:bg-arctic/[0.10]",
        outline: "border border-arctic/[0.35] bg-arctic/[0.10] text-arctic hover:border-arctic/[0.60] hover:bg-arctic/[0.15]",
        danger: "border border-alert/[0.40] bg-alert/[0.90] text-white hover:bg-alert",
        gold: "border border-gold/[0.45] bg-gold/[0.10] text-amber-100 hover:bg-gold/[0.18] hover:shadow-gold",
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
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof buttonVariants> & {
    href: string;
    children: ReactNode;
  };

export function ButtonLink({ className, variant, size, href, ...props }: ButtonLinkProps) {
  return <Link href={href} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
