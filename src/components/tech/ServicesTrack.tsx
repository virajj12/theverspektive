"use client";

/**
 * Spec 4.3 — services, per track.
 *
 * Driven entirely by the 4.2 selection (spec: "this section's state should
 * drive what's shown in 4.3 rather than duplicating the fork"), so there is no
 * second set of tabs here. Before a choice is made both tracks render in full,
 * so a visitor who only ever scrolls still sees everything.
 *
 * Lines of prose with a lead, not icon cards — the spec rules those out.
 */

import { AnimatePresence, motion } from "framer-motion";
import { useTechTrackStore } from "@/store/tech-track-store";
import { TRACKS, type TrackContent } from "./tech-content";

function TrackLines({ content, showLabel }: { content: TrackContent; showLabel: boolean }) {
  return (
    <div className="mb-20 last:mb-0">
      {showLabel && (
        <h3 className="text-display-md mb-12 text-[#1d1d1f] dark:text-[#f5f5f7]">
          {content.label}
        </h3>
      )}
      <div className="flex flex-col">
        {content.lines.map((line, i) => (
          <motion.div
            key={line.lead}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-12%" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
            className="border-t border-black/10 py-8 last:border-b dark:border-white/10 md:flex md:gap-12 md:py-10"
          >
            <h4 className="text-headline mb-3 shrink-0 font-medium text-[#1d1d1f] dark:text-[#f5f5f7] md:mb-0 md:w-[38%]">
              {line.lead}
            </h4>
            <p className="text-body-lg flex-1 text-[#86868b]">{line.body}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function ServicesTrack() {
  const { track, clearTrack } = useTechTrackStore();

  return (
    <section id="services" className="bg-[#f5f5f7] py-28 dark:bg-black md:py-40">
      <div className="mx-auto max-w-5xl px-6">
        <AnimatePresence mode="wait">
          {track ? (
            <motion.div
              key={track}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-12 flex flex-wrap items-baseline justify-between gap-4">
                <h3 className="text-display-md text-[#1d1d1f] dark:text-[#f5f5f7]">
                  For {TRACKS[track].label.toLowerCase()}
                </h3>
                <button
                  type="button"
                  onClick={clearTrack}
                  className="cta-link text-sm"
                >
                  Show both tracks
                </button>
              </div>
              <TrackLines content={TRACKS[track]} showLabel={false} />
            </motion.div>
          ) : (
            <motion.div
              key="both"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <TrackLines content={TRACKS.business} showLabel />
              <TrackLines content={TRACKS.personal} showLabel />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
