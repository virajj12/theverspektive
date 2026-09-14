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

import Image from "next/image";
import type { G3Image } from "@/lib/g3-constants";

export default function Hero({
  heroImage,
  headline,
  tagline,
}: {
  heroImage: G3Image | null;
  headline: string;
  tagline: string;
}) {
  return (
    <section className="relative h-[100svh] w-full overflow-hidden bg-[var(--g3-black)]">
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
        <div className="relative w-[45%] max-w-[340px] aspect-[2/1]">
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
    </section>
  );
}
