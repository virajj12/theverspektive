"use client";

/**
 * Spec 4.1 — Hero.
 *
 * Full-bleed 3D V-mark, one outcome-focused headline, a single CTA, and
 * deliberately NO supporting paragraph (the spec rules one out as competing
 * for attention).
 */

import { ChevronRight } from "lucide-react";
import Hero from "@/components/ui/animated-shader-hero";

export default function TechHero({ headline, ctaLabel }: { headline: string; ctaLabel: string }) {
  return (
    <Hero
      headline={{
        line1: headline,
        line2: ""
      }}
      subtitle=""
      buttons={{
        primary: {
          text: ctaLabel,
          onClick: () => {
            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }}
    >
      {/* V-Mark that inverts the background using difference blend mode */}
      <div 
        className="w-full max-w-[250px] h-[250px] bg-white mix-blend-difference"
        style={{
          maskImage: `url(/VB-01.svg)`,
          WebkitMaskImage: `url(/VB-01.svg)`,
          maskSize: "contain",
          WebkitMaskSize: "contain",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskPosition: "center"
        }}
      />
    </Hero>
  );
}
