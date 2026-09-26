"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { TRACKS } from "../tech/tech-content";
import type { TechTrack } from "@/store/tech-track-store";

export function ScrollTargetSequence() {
  const [activeTrack, setActiveTrack] = useState<TechTrack | null>(null);

  const items: { id: TechTrack; src: string; alt: string }[] = [
    { id: "business", src: "/Business.jpeg", alt: "Businesses" },
    { id: "personal", src: "/Personal.jpeg", alt: "Personal Brands" },
  ];

  return (
    <div id="audience" className="relative w-full py-16 px-4 md:py-24 md:px-8 bg-black">
      {/* Section Header */}
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/50 text-center mb-8 md:mb-12">
        Who we&apos;re building for
      </p>

      {/* Elastic Cards */}
      <div className="flex h-[480px] md:h-[620px] w-full max-w-6xl mx-auto flex-col gap-3 md:flex-row md:gap-4">
        {items.map((item) => {
          const data = TRACKS[item.id];
          const isActive = activeTrack === item.id;
          const isDimmed = activeTrack !== null && !isActive;

          return (
            <div
              key={item.id}
              onMouseEnter={() => setActiveTrack(item.id)}
              onMouseLeave={() => setActiveTrack(null)}
              onClick={() => setActiveTrack(isActive ? null : item.id)}
              className={cn(
                "relative cursor-pointer overflow-hidden rounded-2xl border border-white/10",
                "transition-[flex,filter] duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]",
                isActive ? "flex-[5]" : "flex-[1]",
                isDimmed ? "brightness-50 grayscale sm:brightness-75" : "brightness-75 hover:brightness-90"
              )}
            >
              {/* Background image */}
              <div className="absolute inset-0">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className={cn(
                    "object-cover transition-transform duration-1000",
                    isActive ? "scale-100" : "scale-110",
                    "opacity-50"
                  )}
                />
                {/* Gradient overlay */}
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-500",
                    isActive ? "opacity-100" : "opacity-60"
                  )}
                />
              </div>

              {/* Active: expanded content */}
              <div
                className={cn(
                  "absolute bottom-0 left-0 right-0 p-5 md:p-8 flex flex-col gap-2 transition-all duration-500",
                  isActive ? "translate-y-0 opacity-100 delay-150" : "translate-y-10 opacity-0 pointer-events-none"
                )}
              >
                <h3 className="text-2xl md:text-4xl font-black uppercase text-white leading-none">
                  {data.label}
                </h3>
                <p className="text-sm md:text-base font-light text-white/80 mt-1 mb-2 max-w-xl">
                  {data.pitch}
                </p>
                <div className="flex flex-col gap-2 md:gap-3 overflow-y-auto scrollbar-none max-h-48">
                  {data.lines.map((line, idx) => (
                    <div key={idx} className="flex flex-col">
                      <span className="text-xs md:text-sm font-bold text-white/95">{line.lead}</span>
                      <span className="text-[10px] md:text-xs text-white/60 leading-relaxed">{line.body}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Inactive: centred label */}
              <div
                className={cn(
                  "absolute inset-0 flex flex-col items-center justify-end pb-8 transition-all duration-500",
                  isActive ? "opacity-0 scale-75 pointer-events-none" : "opacity-100 delay-200"
                )}
              >
                <span className="text-sm md:text-xl font-black uppercase tracking-widest text-white/90">
                  {data.label}
                </span>
                <span className="mt-2 text-[10px] md:text-xs uppercase tracking-widest text-white/50">
                  <span className="md:hidden">Tap</span>
                  <span className="hidden md:inline">Hover</span>
                  {" "}to explore
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
