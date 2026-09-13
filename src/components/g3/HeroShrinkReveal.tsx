"use client";

/**
 * Signature moment 1 — hero shrink-and-reveal (spec 3a).
 *
 * The full-bleed hero scales down and gains a border-radius on first scroll,
 * shrinking into a floating rounded panel and revealing the wood-textured
 * surface underneath.
 *
 * The spec calls this out as the strongest candidate for G3's homepage
 * specifically because it doubles as the black → wood material transition that
 * is core to the brand — so the surface behind is a real wood texture, not a
 * flat colour, and that is the whole point of the moment.
 *
 * Used once, at the top of the homepage only, so it stays a "wow" rather than
 * a tic. Reduced motion and phones get the static hero with no scrub.
 */

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ChevronRight } from "lucide-react";
import { useG3Scroll, MOTION_OK } from "./use-g3-scroll";
import type { G3Image } from "@/lib/g3-constants";

export default function HeroShrinkReveal({
  heroImage,
  headline,
  tagline,
}: {
  heroImage: G3Image | null;
  headline: string;
  tagline: string;
}) {
  const root = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useG3Scroll(root, (mm) => {
    mm.add(MOTION_OK, () => {
      // One viewport of scroll drives the whole transition — spec 3a asks for
      // roughly a viewport per "step" so it reads as deliberate on a wheel and
      // on a touch flick alike.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
        },
      });

      tl.to(panel.current, { scale: 0.86, borderRadius: 28, ease: "none" }, 0);
      tl.to(logoRef.current, { opacity: 0, x: 40, ease: "none" }, 0);
    });
  });

  return (
    // The extra height is the scroll runway the scrub consumes. The inner
    // layer is sticky, so the hero holds still while the transform plays.
    <section ref={root} className="g3-hero-runway relative h-[200svh]">
      {/* Wood surface revealed as the panel shrinks. */}
      <div className="g3-hero-underlay g3-wood-surface sticky top-0 -mb-[100svh] h-[100svh]" aria-hidden="true" />

      <div className="g3-hero-sticky sticky top-0 h-[100svh] overflow-hidden">
        <div
          ref={panel}
          className="relative h-full w-full origin-center overflow-hidden will-change-transform bg-[var(--g3-black)]"
        >
          {heroImage ? (
            <Image
              src={heroImage.url}
              alt={heroImage.alt || "G3 Builders flagship project"}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <div className="g3-surface-black absolute inset-0" />
          )}

          <div
            className="absolute inset-0 bg-gradient-to-t from-[#fcfcfc]/95 via-[#fcfcfc]/45 to-[#fcfcfc]/70 dark:from-[#0a0908]/95 dark:via-[#0a0908]/45 dark:to-[#0a0908]/70"
          />

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div ref={logoRef} className="relative w-[45%] max-w-[340px] aspect-[2/1]">
              <Image
                src="/G3 B & A LOGO BLACK.png"
                alt="G3 Builders Logo"
                fill
                className="object-contain dark:hidden"
                priority
              />
              <Image
                src="/G3 B & A LOGO WHITE.png"
                alt="G3 Builders Logo"
                fill
                className="object-contain hidden dark:block"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
