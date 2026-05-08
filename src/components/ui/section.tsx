import type { ReactNode } from "react";
import { Badge } from "./badge";
import { cn } from "@/src/lib/utils";

export function SectionTitle({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <Badge>{eyebrow}</Badge>
      <h2 className="mt-5 text-3xl font-black tracking-[-0.035em] text-white md:text-5xl">{title}</h2>
      <p className="mt-5 text-lg leading-8 text-titanium/[0.82]">{body}</p>
    </div>
  );
}

export function Section({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={cn(className)}>{children}</section>;
}
