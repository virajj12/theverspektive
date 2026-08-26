"use client";

/**
 * /tech — VerspeKtive Tech.
 *
 * Section order follows the spec exactly:
 *   4.1 Hero → 4.2 Audience split → 4.3 Services → 4.4 Case study
 *   → 4.5 Process → 4.6 Credibility → 4.7 Contact
 */

import { useEffect } from "react";
import TechHero from "@/components/tech/TechHero";
import AudienceSplit from "@/components/tech/AudienceSplit";
import ServicesTrack from "@/components/tech/ServicesTrack";
import CaseStudy from "@/components/tech/CaseStudy";
import ProcessSequence from "@/components/tech/ProcessSequence";
import CredibilitySignals from "@/components/tech/CredibilitySignals";
import TechContact from "@/components/tech/TechContact";
import { useTechTrackStore } from "@/store/tech-track-store";

export default function TechClientPage({
  heroHeadline,
  heroCta,
}: {
  heroHeadline: string;
  heroCta: string;
}) {
  const clearTrack = useTechTrackStore((s) => s.clearTrack);

  // The store is module-scoped, so a client-side navigation back to /tech
  // would otherwise restore the previous visitor's selection.
  useEffect(() => clearTrack, [clearTrack]);

  // The dark scrollbar is handled by Navbar's isBlackHeroPage list, which
  // /tech is registered in — duplicating it here would race with that effect.

  return (
    <main className="bg-black">
      <TechHero headline={heroHeadline} ctaLabel={heroCta} />
      <AudienceSplit />
      <ServicesTrack />
      <CaseStudy />
      <ProcessSequence />
      <CredibilitySignals />
      <TechContact />
    </main>
  );
}
