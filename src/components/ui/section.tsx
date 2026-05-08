import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Badge } from "./badge";
import { cn } from "@/src/lib/utils";

const sectionSpacing = {
  hero: "py-16 md:py-24",
  standard: "py-24",
  compact: "py-10 md:py-16",
  none: "",
} as const;

type SectionSpacing = keyof typeof sectionSpacing;

type ContainerProps = ComponentPropsWithoutRef<"div"> & {
  children: ReactNode;
};

type SectionProps = ComponentPropsWithoutRef<"section"> & {
  children: ReactNode;
  spacing?: SectionSpacing;
};

export function Container({ children, className, ...props }: ContainerProps) {
  return (
    <div className={cn("mx-auto max-w-7xl px-6", className)} {...props}>
      {children}
    </div>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <Badge>{eyebrow}</Badge>
      <h2 className="mt-5 text-3xl font-black tracking-[-0.035em] text-white md:text-5xl">
        {title}
      </h2>
      <p className="mt-5 text-lg leading-8 text-titanium/[0.82]">{body}</p>
    </div>
  );
}

export function Section({
  children,
  className,
  spacing = "standard",
  ...props
}: SectionProps) {
  return (
    <section className={cn(sectionSpacing[spacing], className)} {...props}>
      {children}
    </section>
  );
}
