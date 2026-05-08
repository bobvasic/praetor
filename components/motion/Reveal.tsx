"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Transition } from "framer-motion";
import type { ReactNode } from "react";

type FadeUpProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "main";
};

const defaultTransition: Transition = {
  duration: 0.45,
  ease: [0.22, 1, 0.36, 1],
};

const fadeUpMotion = (reduced: boolean | null, delay: number) => {
  const transition: Transition = { ...defaultTransition, duration: 0.38, delay };

  return {
    initial: reduced ? false : { opacity: 0, y: 14 },
    whileInView: reduced ? undefined : { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-40px" },
    transition,
  };
};

export function FadeUp({ children, className = "", delay = 0, as = "div" }: FadeUpProps) {
  const reduced = useReducedMotion();
  const motionProps = fadeUpMotion(reduced, delay);

  if (as === "section") {
    return <motion.section className={className} {...motionProps}>{children}</motion.section>;
  }

  if (as === "main") {
    return <motion.main className={className} {...motionProps}>{children}</motion.main>;
  }

  return <motion.div className={className} {...motionProps}>{children}</motion.div>;
}

export function HoverLift({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  const transition: Transition = { ...defaultTransition, duration: 0.32, delay };

  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 12 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      whileHover={reduced ? undefined : { y: -3 }}
      viewport={{ once: true }}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
