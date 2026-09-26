"use client";

import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useTechTrackStore, type TechTrack } from "@/store/tech-track-store";
import { TRACKS } from "../tech/tech-content";

export function ElasticGallery() {
  const track = useTechTrackStore((s) => s.track);
  const setTrack = useTechTrackStore((s) => s.setTrack);
  const clearTrack = useTechTrackStore((s) => s.clearTrack);

  const items = [
    {
      id: "business",
      title: TRACKS["business"].label,
      category: "B2B",
      src: "/Business.jpeg",
      alt: "Business infrastructure",
      pitch: TRACKS["business"].pitch,
    },
    {
      id: "personal",
      title: TRACKS["personal"].label,
      category: "B2C",
      src: "/Personal.png",
      alt: "Personal branding",
      pitch: TRACKS["personal"].pitch,
    },
  ];

  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      {/* Container: Fixed height to ensure animation stability */}
      <div className="flex h-[550px] w-full max-w-5xl flex-col gap-2 md:h-[650px] md:flex-row md:gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            onMouseEnter={() => setTrack(item.id as TechTrack)}
            onMouseLeave={() => clearTrack()}
            onClick={() => setTrack(item.id as TechTrack)}
            className={cn(
              "relative cursor-pointer overflow-hidden rounded-2xl border border-black/10 bg-white/50 dark:border-white/10 dark:bg-black/50 backdrop-blur-md",
              // Layout & Flex Transition
              "transition-[flex,filter] duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]",
              // Flex Logic:
              track === item.id ? "flex-[5]" : "flex-[1]",
              !track && "flex-[1]",
              // Dim unselected cards slightly
              track && track !== item.id
                ? "brightness-50 grayscale sm:brightness-75"
                : "brightness-75 hover:brightness-90"
            )}
          >
            {/* Background Image Layer */}
            <div className="absolute inset-0 h-full w-full">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className={cn(
                  "object-cover transition-transform duration-1000",
                  // Subtle zoom on active
                  track === item.id ? "scale-100" : "scale-110",
                  // Opacity logic to blend with background
                  "opacity-40 dark:opacity-50"
                )}
              />
              {/* Gradient Overlay for Text Readability */}
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-500",
                  track === item.id ? "opacity-100" : "opacity-60"
                )}
              />
            </div>

            {/* --- Content Container --- */}
            <div className="absolute bottom-0 left-0 right-0 flex h-full flex-col justify-end p-4 md:p-8 pointer-events-none">
              {/* Active Content: Title & Track Features */}
              <div
                className={cn(
                  "flex flex-col gap-2 transition-all duration-500 pointer-events-auto",
                  // Hide/Show based on active state with translation for smooth entry
                  track === item.id
                    ? "translate-y-0 opacity-100 delay-200"
                    : "translate-y-12 opacity-0 pointer-events-none"
                )}
              >
                {/* Title */}
                <h3 className="text-2xl font-black uppercase leading-none text-white md:text-4xl">
                  {item.title}
                </h3>
                
                {/* Track Features */}
                <div className="mt-2 flex flex-col gap-2 md:gap-4 overflow-y-auto scrollbar-none pb-2">
                  {TRACKS[item.id as TechTrack].lines.map((line, idx) => (
                    <div key={idx} className="flex flex-col">
                      <span className="text-xs font-bold text-white/95 md:text-base">{line.lead}</span>
                      <span className="text-[10px] text-white/70 md:text-sm leading-relaxed">{line.body}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Inactive Content: Horizontal Label + Instruction */}
              <div
                className={cn(
                  "absolute transition-all duration-500 w-full text-center",
                  // Position logic
                  "bottom-6 left-1/2 -translate-x-1/2 md:bottom-8",
                  // Hide when active
                  track === item.id
                    ? "opacity-0 scale-50 pointer-events-none"
                    : "opacity-100 delay-300"
                )}
              >
                <span className="flex flex-col items-center justify-center">
                  <span className="block text-xs md:text-xl font-bold uppercase tracking-widest text-white/90">
                    {item.title}
                  </span>
                  <span className="block mt-2 text-[10px] md:text-xs uppercase tracking-widest text-white/60">
                    <span className="md:hidden">Click</span><span className="hidden md:inline">Hover</span> to view track
                  </span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
