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
import { Reveal } from "./Reveal";
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
  const copy = useRef<HTMLDivElement>(null);

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
      // Copy fades slightly ahead of the panel so the type never collides with
      // the shrinking edge.
      tl.to(copy.current, { opacity: 0, y: -40, ease: "none" }, 0);
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
          className="relative h-full w-full origin-center overflow-hidden will-change-transform"
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
            <div className="g3-wood-surface-deep absolute inset-0" />
          )}

          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(10,9,8,0.95) 8%, rgba(10,9,8,0.45) 45%, rgba(10,9,8,0.7) 100%)",
            }}
          />

          <div ref={copy} className="absolute inset-x-0 bottom-0">
            <div className="mx-auto w-full max-w-6xl px-6 pb-20">
              <Reveal>
                <span className="g3-meta">Architecture · Interiors · Construction</span>
              </Reveal>
              <Reveal delay={0.08}>
                <h1 className="g3-display-xl mt-4 max-w-4xl" style={{ color: "var(--g3-ink)" }}>
                  {headline}
                </h1>
              </Reveal>
              <Reveal delay={0.18}>
                <p className="g3-body mt-6 max-w-xl">{tagline}</p>
              </Reveal>
              <Reveal delay={0.26}>
                <Link
                  href="/g3-builders/contact"
                  className="mt-9 inline-flex items-center gap-2 rounded-full px-7 py-4 text-base font-semibold"
                  style={{ background: "var(--g3-brass)", color: "#0a0908" }}
                >
                  Book a consultation
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
