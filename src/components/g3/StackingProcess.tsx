"use client";

/**
 * Signature moment 3 — stacking card deck (spec 3a), on the Process section.
 *
 * The spec picks this pairing itself, and the reasoning is sound: each stage
 * card stacks onto the last, reinforcing "building on what came before" for a
 * construction sequence that literally works that way.
 *
 * One viewport of scroll per card, per spec 3a. Each card is sticky at the
 * same offset, so the next scrolls up and covers the previous almost
 * completely — the stack is the natural consequence of sticky siblings, no
 * per-card pinning needed.
 *
 * Cards scale down very slightly as they are covered, which keeps the buried
 * ones readable as a deck rather than a single flat surface. That scale is the
 * only scrubbed part; the stacking itself is pure CSS and works with JS off.
 *
 * Below 768px or under reduced motion the cards render as a plain vertical
 * list — spec 3a: scrubbed sequences degrade to simple reveals.
 */

import { useRef } from "react";
import gsap from "gsap";
import { PROCESS_STAGES } from "./ProcessTimeline";
import { useG3Scroll, MOTION_OK } from "./use-g3-scroll";

export default function StackingProcess() {
  const root = useRef<HTMLElement>(null);

  useG3Scroll(root, (mm) => {
    mm.add(MOTION_OK, () => {
      const cards = gsap.utils.toArray<HTMLElement>(".g3-stack-card");

      cards.forEach((card, i) => {
        // The last card is never covered, so it never needs to recede.
        if (i === cards.length - 1) return;

        gsap.to(card, {
          scale: 0.94,
          opacity: 0.55,
          ease: "none",
          scrollTrigger: {
            trigger: cards[i + 1],
            start: "top bottom",
            end: "top top",
            scrub: 0.5,
          },
        });
      });
    });
  });

  return (
    <section ref={root} className="relative">
      {PROCESS_STAGES.map((s, i) => (
        <div
          key={s.key}
          className="g3-stack-card sticky mx-auto max-w-4xl px-6 will-change-transform md:top-24"
          style={{
            // Each card sits a little lower than the last so a sliver of the
            // one beneath stays visible — otherwise the deck reads as a single
            // card swapping its contents.
            top: `calc(6rem + ${i * 12}px)`,
            zIndex: i + 1,
            marginBottom: "6vh",
          }}
        >
          <div
            className={`rounded-2xl border p-8 md:p-12 ${i % 2 === 0 ? "g3-wood-surface" : ""}`}
            style={{
              borderColor: "var(--g3-rule-faint)",
              background: i % 2 === 0 ? undefined : "var(--g3-black-raised)",
              boxShadow: "0 -20px 60px rgba(0,0,0,0.45)",
              minHeight: "clamp(280px, 42vh, 420px)",
            }}
          >
            <div className="mb-6 flex items-baseline justify-between gap-4">
              <span className="g3-meta">{String(i + 1).padStart(2, "0")}</span>
              <span className="g3-meta" style={{ color: "var(--g3-ink-faint)" }}>
                {s.duration}
              </span>
            </div>

            <h3
              className="g3-display-md mb-5"
              style={{ color: "var(--g3-ink)" }}
            >
              {s.title}
            </h3>

            <p className="g3-body max-w-2xl">{s.what}</p>

            <p className="mt-5 text-sm" style={{ color: "var(--g3-brass-light)" }}>
              {s.client}
            </p>
          </div>
        </div>
      ))}

      {/* Tail room so the final card can settle before the next section
          arrives, rather than being shoved off mid-stack. */}
      <div className="h-[30svh]" aria-hidden="true" />
    </section>
  );
}
