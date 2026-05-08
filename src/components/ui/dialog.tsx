"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/src/lib/utils";

export function Dialog({ children }: { children: ReactNode }) {
  return <DialogPrimitive.Root>{children}</DialogPrimitive.Root>;
}
export const DialogTrigger = DialogPrimitive.Trigger;

export function DialogContent({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-obsidian/80 backdrop-blur-sm data-[state=open]:animate-fade-in" />
      <DialogPrimitive.Content
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-arctic/[0.22] bg-panel-gradient p-6 shadow-card focus:outline-none data-[state=open]:animate-dialog-in",
          className,
        )}
      >
        {children}
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-md border border-titanium/[0.12] bg-titanium/[0.05] p-2 text-titanium transition hover:border-arctic/[0.35] hover:text-arctic focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-arctic/70">
          <X className="h-4 w-4" aria-hidden />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;
