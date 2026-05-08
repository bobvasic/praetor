"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import type { ReactNode } from "react";
import { cn } from "@/src/lib/utils";

export function TooltipProvider({ children }: { children: ReactNode }) {
  return (
    <TooltipPrimitive.Provider delayDuration={180} skipDelayDuration={250}>
      {children}
    </TooltipPrimitive.Provider>
  );
}

export function Tooltip({ children, content }: { children: ReactNode; content: ReactNode }) {
  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          sideOffset={8}
          className={cn(
            "z-50 max-w-xs rounded-lg border border-arctic/[0.22] bg-obsidian px-3 py-2 text-xs leading-5 text-titanium shadow-card",
            "data-[state=delayed-open]:animate-tooltip-in data-[state=instant-open]:animate-tooltip-in",
          )}
        >
          {content}
          <TooltipPrimitive.Arrow className="fill-obsidian" />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}
