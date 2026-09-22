"use client";

import MaskText from "@/components/MaskText";
import { CoverflowCarousel, CoverflowSlide } from "@/components/ui/coverflow-carousel";

export interface TeamMember {
  src: string;
}

export interface TeamGroup {
  id: number;
  title: string;
  duration?: number;
  members: TeamMember[];
}

export interface TeamsSectionProps {
  teams?: TeamGroup[];
}

export default function TeamsSection({ teams }: TeamsSectionProps) {
  if (!teams || teams.length === 0) return null;

  return (
    <div className="mb-32 space-y-24 w-full">
      {teams.map((team) => {
        const slides: CoverflowSlide[] = team.members.map((m) => ({
          src: m.src,
          alt: "Team Member",
        }));

        if (slides.length === 0) return null;

        return (
          <div key={team.id} className="flex flex-col items-center w-full">
            <MaskText text={team.title} className="text-4xl font-bold tracking-tight mb-12 justify-center" />
            <div className="w-full max-w-5xl">
              <CoverflowCarousel
                slides={slides}
                autoPlayDuration={team.duration || 0}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
