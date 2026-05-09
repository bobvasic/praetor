import type { HTMLAttributes } from "react";
import { cn } from "@/src/lib/utils";

export function SectionShell({ className, children, ...props }: HTMLAttributes<HTMLElement>) {
  return <section className={cn("relative overflow-hidden py-20 md:py-28", className)} {...props}>{children}</section>;
}
