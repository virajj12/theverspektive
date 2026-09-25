"use client";

/**
 * Spec 4.6 — three credibility signals.
 *
 * Deliberately quieter than the case study: no imagery, no borders, no accent
 * fills. Typography and whitespace only, so this reads as reassurance on the
 * way to the contact section rather than competing with 4.4.
 */

import { motion } from "framer-motion";
import { CREDIBILITY } from "./tech-content";

import { ShinyCard } from "@/components/ui/shiny-card";

export default function CredibilitySignals() {
  return (
    <section id="trust" className="transition-colors duration-500 pt-6 pb-20 md:pt-8 md:pb-32">
      <div className="mx-auto max-w-6xl px-6">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12%" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-none mb-12 text-center text-white"
        >
          What you can trust us on.
        </motion.h2>
        <div className="grid gap-14 md:grid-cols-3 md:gap-12">
          {CREDIBILITY.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12%" }}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
                delay: i * 0.1,
              }}
              className="h-full"
            >
              <ShinyCard 
                className="h-full"
                fillColor="#000000" // Solid black base (100% opacity)
                accentColor="#f97316" // orange-500
                accentSoftColor="#fdba74" // orange-300
                cornerRadius={32}
                sweepDuration={8}
              >
                <h3 className="text-headline mb-4 font-medium text-white">
                  {item.title}
                </h3>
                <p className="leading-relaxed text-white/70">{item.body}</p>
              </ShinyCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
