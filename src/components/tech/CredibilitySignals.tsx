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

export default function CredibilitySignals() {
  return (
    <section className="bg-[#f5f5f7] py-24 dark:bg-black md:py-32">
      <div className="mx-auto max-w-6xl px-6">
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
            >
              <h3 className="text-headline mb-4 font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">
                {item.title}
              </h3>
              <p className="leading-relaxed text-[#86868b]">{item.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
