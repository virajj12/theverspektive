"use client";

/**
 * Spec 4.1 — Hero.
 *
 * Full-bleed 3D V-mark, one outcome-focused headline, a single CTA, and
 * deliberately NO supporting paragraph (the spec rules one out as competing
 * for attention).
 */

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import VMarkFallback from "./VMarkFallback";
import { useVMarkMode } from "./use-vmark-mode";

// three.js stays out of the initial bundle. Nothing here is server-rendered,
// so the page's first paint never waits on the scene.
const VMarkScene = dynamic(() => import("./VMarkScene"), {
  ssr: false,
  loading: () => <VMarkFallback />,
});

export default function TechHero({ headline, ctaLabel }: { headline: string; ctaLabel: string }) {
  const { mode, reducedMotion } = useVMarkMode();

  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-black">
      {/* The mark sits behind the copy, full-bleed. */}
      <div className="absolute inset-0 z-0">
        {mode === "3d" ? <VMarkScene reducedMotion={reducedMotion} /> : <VMarkFallback />}
      </div>

      {/* Legibility scrim — the headline sits over the mark's brightest area. */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-black/70 via-black/25 to-black/85" />

      <div className="relative z-20 mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="text-display-xl text-[#f5f5f7]"
        >
          {headline}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
          className="mt-10"
        >
          <a href="#contact" className="cta-link text-[#2997ff]">
            {ctaLabel}
            <ChevronRight aria-hidden="true" />
          </a>
        </motion.div>
      </div>

      {/* Scroll affordance — the page is long and the hero is full-bleed. */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 z-20 -translate-x-1/2"
      >
        <div className="h-10 w-[1px] bg-gradient-to-b from-transparent via-white/40 to-transparent" />
      </motion.div>
    </section>
  );
}
