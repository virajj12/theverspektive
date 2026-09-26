"use client";

/**
 * /tech — VerspeKtive Tech.
 */

import { useEffect } from "react";
import TechHero from "@/components/tech/TechHero";
import { ScrollTargetSequence } from "@/components/ui/scroll-target-sequence";
import ProcessSequence from "@/components/tech/ProcessSequence";
import CredibilitySignals from "@/components/tech/CredibilitySignals";
import TechContact from "@/components/tech/TechContact";
import { useTechTrackStore } from "@/store/tech-track-store";
import TeamsSection from "@/components/TeamsSection";

export default function TechClientPage({
  heroHeadline,
  heroCta,
  teams,
}: {
  heroHeadline: string;
  heroCta: string;
  teams?: any[];
}) {
  const clearTrack = useTechTrackStore((s) => s.clearTrack);

  // The store is module-scoped, so a client-side navigation back to /tech
  // would otherwise restore the previous visitor's selection.
  useEffect(() => clearTrack, [clearTrack]);

  return (
    <main className="relative transition-colors duration-500">
      <TechHero headline={heroHeadline} ctaLabel={heroCta} />
      <div className="relative z-10">
        <ScrollTargetSequence />
        <ProcessSequence />
        <CredibilitySignals />
        <div id="team" className="scroll-mt-20">
          <TeamsSection teams={teams} />
        </div>
        <TechContact />
      </div>
    </main>
  );
}
