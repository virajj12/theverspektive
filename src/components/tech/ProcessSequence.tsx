"use client";

/**
 * Spec 4.5 — four-step horizontal sequence, scroll-driven with GSAP.
 *
 * Desktop: the section pins and the four steps translate horizontally as you
 * scroll, so the sequence reads as one continuous move rather than four
 * separate reveals.
 *
 * Mobile / reduced-motion: no pin, no horizontal scroll — the steps stack and
 * fade in. Pinning on a phone fights the browser's own scroll and is the main
 * way this pattern goes wrong.
 */

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROCESS } from "./tech-content";

export default function ProcessSequence() {
  const root = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Desktop, motion allowed → pinned horizontal sequence.
      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          const track = rail.current;
          if (!track) return;

          const distance = track.scrollWidth - window.innerWidth;
          if (distance <= 0) return;

          gsap.to(track, {
            x: -distance,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: () => `+=${distance}`,
              scrub: 1,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });
        }
      );

      // Everything else → simple staggered fade, no pin.
      mm.add("(max-width: 767px), (prefers-reduced-motion: reduce)", () => {
        gsap.from(".process-step", {
          opacity: 0,
          y: 30,
          duration: 0.7,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: root.current,
            start: "top 75%",
          },
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="process"
      ref={root}
      className="section-gray relative overflow-hidden py-24 md:h-screen md:py-0"
    >
      <div className="md:flex md:h-full md:flex-col md:justify-center">
        <div className="mx-auto mb-14 w-full max-w-6xl px-6 md:mb-20">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-[#2997ff]">
            How it goes
          </p>
          <h2 className="text-display-md max-w-2xl text-[#f5f5f7]">
            Four steps, and you can see the work at every one.
          </h2>
        </div>

        <div
          ref={rail}
          className="flex flex-col gap-10 px-6 md:w-max md:flex-row md:gap-0 md:px-[max(1.5rem,calc((100vw-72rem)/2))]"
        >
          {PROCESS.map((item, i) => (
            <div
              key={item.step}
              className="process-step relative shrink-0 border-t border-white/15 pt-8 md:w-[clamp(340px,32vw,460px)] md:border-t-0 md:border-l md:pl-10 md:pr-16 md:pt-0"
            >
              <div className="mb-6 font-mono text-sm tracking-widest text-[#2997ff]">
                {item.step}
              </div>
              <h3 className="text-display-md mb-5 text-[#f5f5f7]">{item.title}</h3>
              <p className="text-body-lg max-w-sm text-[#86868b]">{item.body}</p>

              {/* Connector — only meaningful in the horizontal arrangement. */}
              {i < PROCESS.length - 1 && (
                <div className="absolute right-6 top-2 hidden h-[1px] w-10 bg-white/20 md:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
