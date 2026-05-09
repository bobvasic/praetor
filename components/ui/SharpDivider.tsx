import type { HTMLAttributes } from "react";
import { cn } from "@/src/lib/utils";

type SharpDividerProps = HTMLAttributes<HTMLDivElement> & {
  flip?: boolean;
};

export function SharpDivider({ className, flip = false, ...props }: SharpDividerProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("praetor-sharp-divider", flip && "praetor-sharp-divider-flip", className)}
      {...props}
    />
  );
}
