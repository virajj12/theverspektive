"use client";

/**
 * Spec 4.2 — the two-path fork.
 *
 * The seam between the two panels is slanted to echo the V-mark's own angle,
 * which keeps the section asymmetric rather than a two-column grid (non-goal 1).
 * Choosing a track writes to the shared store, which drives BOTH the 3D hero
 * state (spec 5) and what 4.3 renders — so the fork exists exactly once.
 */

import { motion } from "framer-motion";
import { useTechTrackStore } from "@/store/tech-track-store";
import { TRACKS } from "./tech-content";
import { cn } from "@/lib/utils";

export default function AudienceSplit() {
  const { track, setTrack } = useTechTrackStore();

  const panels = [TRACKS.business, TRACKS.personal];

  return (
    <section id="audience" className="section-dark relative py-28 md:py-40">
      <div className="mx-auto max-w-6xl px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-[#86868b]"
        >
          Who we&rsquo;re building for
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
          className="text-display-md max-w-2xl text-[#f5f5f7]"
        >
          Two very different problems. Pick yours.
        </motion.h2>

        <div className="mt-16 flex flex-col md:flex-row md:items-stretch">
          {panels.map((panel, i) => {
            const isActive = track === panel.id;
            const isDimmed = track !== null && !isActive;

            return (
              <motion.button
                key={panel.id}
                type="button"
                onClick={() => setTrack(panel.id)}
                aria-pressed={isActive}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.1 + i * 0.12,
                }}
                className={cn(
                  "group relative flex-1 cursor-pointer overflow-hidden px-8 py-14 text-left transition-all duration-500 md:py-20",
                  "focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#2997ff]",
                  isDimmed ? "opacity-40" : "opacity-100",
                  // The slanted seam: the first panel's trailing edge cuts in,
                  // the second panel's leading edge cuts out, so they interlock.
                  i === 0
                    ? "md:[clip-path:polygon(0_0,100%_0,calc(100%-56px)_100%,0_100%)] md:pr-20"
                    : "md:-ml-[56px] md:[clip-path:polygon(56px_0,100%_0,100%_100%,0_100%)] md:pl-20"
                )}
              >
                {/* Fill that rises on hover/active — the accent only ever
                    appears as a thin edge, never as a filled button. */}
                <span
                  className={cn(
                    "absolute inset-0 -z-10 transition-opacity duration-500",
                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-60"
                  )}
                  style={{
                    background:
                      "linear-gradient(160deg, rgba(41,151,255,0.14) 0%, rgba(41,151,255,0.02) 60%, transparent 100%)",
                  }}
                />

                <span
                  className={cn(
                    "absolute bottom-0 left-0 h-[2px] bg-[#2997ff] transition-all duration-500",
                    isActive ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-1/3 group-hover:opacity-70"
                  )}
                />

                <span className="block text-sm font-medium uppercase tracking-[0.18em] text-[#2997ff]">
                  {isActive ? "Selected" : `0${i + 1}`}
                </span>

                <span className="text-display-md mt-4 block text-[#f5f5f7]">
                  {panel.label}
                </span>

                <span className="text-body-lg mt-5 block max-w-sm text-[#86868b]">
                  {panel.pitch}
                </span>
              </motion.button>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 text-sm text-[#86868b]"
        >
          {track
            ? "Showing what that involves below."
            : "Or keep scrolling — both tracks are shown in full."}
        </motion.p>
      </div>
    </section>
  );
}
