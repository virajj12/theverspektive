"use client";

/**
 * Baseline entrance motion (spec 3a).
 *
 * The spec makes this the default for every new text block and image, and
 * explicitly says not to reinvent it per-section — so every G3 section uses
 * this rather than hand-rolling variants.
 *
 *   text  — lines rise from a small Y-offset at 0 opacity, strong ease-out
 *           (the power3/power4 feel the spec asks for), never bouncy
 *   image — slides up while settling from scale 1.05 → 1, reading as
 *           "material settling into place"
 *
 * Under prefers-reduced-motion both collapse to a plain fade, per spec 3a.
 */

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { G3_EASE } from "./motion";

export function Reveal({
  children,
  delay = 0,
  as = "div",
  className,
}: {
  children: ReactNode;
  delay?: number;
  as?: "div" | "section" | "li" | "span";
  className?: string;
}) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as];

  return (
    <MotionTag
      className={className}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 28 }}
      whileInView={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12%" }}
      transition={{ duration: 0.85, ease: G3_EASE, delay }}
    >
      {children}
    </MotionTag>
  );
}

/** Image variant — settles from slightly enlarged rather than clip-revealing. */
export function RevealImage({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 1.05 }}
      whileInView={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 1, ease: G3_EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

