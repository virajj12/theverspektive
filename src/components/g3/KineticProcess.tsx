"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useG3Scroll, MOTION_OK_ANY } from "./use-g3-scroll";
import { PROCESS_STAGES } from "./ProcessTimeline";
import MaskText from "@/components/MaskText";
import { useReducedMotion } from "framer-motion";

export default function KineticProcess() {
  const rootRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useG3Scroll(rootRef, (mm) => {
    mm.add(MOTION_OK_ANY, () => {
      if (!rootRef.current || !scrollContainerRef.current || reduced) return;

      // Calculate how far to scroll horizontally
      // We want to scroll the entire width of the scrollContainer minus the viewport width.
      const getScrollAmount = () => -(scrollContainerRef.current!.scrollWidth - window.innerWidth);

      gsap.to(scrollContainerRef.current, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top", // When the section hits the top of the viewport
          end: () => `+=${scrollContainerRef.current!.scrollWidth}`, // Scroll for a distance equal to the width
          pin: true,
          scrub: 1, // Smooth scrubbing
          invalidateOnRefresh: true, // Recalculate on resize
        },
      });
    });
  });

  return (
    <section ref={rootRef} className="relative w-full overflow-hidden bg-[var(--g3-black)]" style={{ color: "var(--g3-wood)" }}>
      {/* 
        This is the inner container that will move horizontally. 
        It flexes its children in a row and its total width will exceed the viewport.
      */}
      <div 
        ref={scrollContainerRef} 
        className={`flex items-center ${reduced ? "flex-col py-32" : "h-screen w-max"}`}
      >
        {/* Intro space before the kinetic type starts */}
        {!reduced && <div className="w-[30vw] shrink-0" />}

        {PROCESS_STAGES.map((s, i) => (
          <div 
            key={s.key} 
            className={`flex shrink-0 ${reduced ? "w-full max-w-4xl px-6 py-12 flex-col" : "w-[80vw] max-w-[1200px] flex-row items-center gap-16 px-10"}`}
          >
            {/* Massive Editorial Stage Number */}
            <div className={`${reduced ? "mb-6" : "w-[40%]"}`}>
              <div className="g3-meta mb-4 opacity-50 uppercase tracking-widest text-sm">Stage {String(i + 1).padStart(2, "0")}</div>
              <MaskText text={s.title} className="text-6xl md:text-8xl font-semibold tracking-tight leading-none" />
              <div className="mt-6 text-xl opacity-70" style={{ color: "var(--g3-brass-light)" }}>
                {s.duration}
              </div>
            </div>

            {/* Supporting Details */}
            <div className={`${reduced ? "" : "w-[60%]"}`}>
              <p className="text-2xl md:text-4xl font-light leading-snug mb-8 opacity-90">
                {s.what}
              </p>
              <div className="border-t border-white/20 pt-6">
                <span className="g3-meta !text-white block mb-2 opacity-60">Deliverables & Responsibilities</span>
                <p className="text-lg opacity-80">{s.client}</p>
              </div>
            </div>
          </div>
        ))}

        {/* Outro space to allow the final item to rest before unpinning */}
        {!reduced && <div className="w-[30vw] shrink-0" />}
      </div>
    </section>
  );
}
