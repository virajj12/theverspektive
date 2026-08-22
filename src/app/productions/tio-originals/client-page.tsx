"use client";

import { useEffect } from "react";
import Image from "next/image";
import { PerspectiveHero } from "@/components/ui/perspective-hero";
import MaskText from "@/components/MaskText";
import { Play } from "lucide-react";
import { LiquidMetal, liquidMetalPresets } from '@paper-design/shaders-react';

export default function TioOriginalsClient() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const hash = `#${entry.target.id}`;
            if (window.location.hash !== hash) {
              window.history.replaceState(null, '', hash);
              window.dispatchEvent(new CustomEvent("updateActiveHash", { detail: hash }));
            }
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    );

    const talkSection = document.getElementById("talk-it-out");
    const tasteSection = document.getElementById("taste-it-out");

    if (talkSection) observer.observe(talkSection);
    if (tasteSection) observer.observe(tasteSection);

    return () => observer.disconnect();
  }, []);

  const talkHero = (
    <div className="flex flex-col items-center justify-center text-foreground bg-background transition-colors duration-300 w-full h-full px-6 text-center">
      <div
        className="relative w-full max-w-[400px] h-[150px] mx-auto mb-8"
        style={{
          maskImage: `url('/TIO-01.png')`,
          WebkitMaskImage: `url('/TIO-01.png')`,
          maskSize: "contain",
          WebkitMaskSize: "contain",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskPosition: "center"
        }}
      >
        <LiquidMetal {...liquidMetalPresets[2]} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", transform: "scale(5)" }} />
      </div>
      <MaskText
        text="Conversations that matter. Stories that inspire."
        className="text-xl md:text-2xl text-white/80 font-medium max-w-3xl leading-relaxed justify-center"
      />
    </div>
  );

  const talkCover = (
    <div className="relative w-full h-full overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=2656&auto=format&fit=crop"
        alt="Podcast Studio"
        fill
        priority
        className="object-cover"
      />
    </div>
  );

  const tasteHero = (
    <div className="flex flex-col items-center justify-center text-foreground bg-background transition-colors duration-300 w-full h-full px-6 text-center">
      <div
        className="relative w-full max-w-[400px] h-[150px] mx-auto mb-8"
        style={{
          maskImage: `url(/TIO-01.png)`,
          WebkitMaskImage: `url(/TIO-01.png)`,
          maskSize: "contain",
          WebkitMaskSize: "contain",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskPosition: "center"
        }}
      >
        <LiquidMetal {...liquidMetalPresets[2]} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", transform: "scale(5)" }} />
      </div>
      <MaskText
        text="A culinary journey through stories and flavors."
        className="text-xl md:text-2xl text-white/80 font-medium max-w-3xl leading-relaxed justify-center"
      />
    </div>
  );

  const tasteCover = (
    <div className="relative w-full h-full overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2000&auto=format&fit=crop"
        alt="Food Presentation"
        fill
        priority
        className="object-cover"
      />
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Talk It Out Section */}
      <div id="talk-it-out" className="relative scroll-m-20">
        <PerspectiveHero hero={talkHero} cover={talkCover}>
          <div className="container mx-auto px-6 md:px-12 py-12 md:py-24 max-w-[1200px] relative z-10">
            <div className="mb-32">
              <MaskText text="Talk It Out - Featured Episodes" className="text-4xl font-bold tracking-tight mb-10" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={`talk-${i}`} className="group flex flex-col gap-4">
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-900 border border-white/10">
                      <div className="absolute inset-0 flex items-center justify-center text-zinc-500">
                        <Play className="w-8 h-8" />
                      </div>
                    </div>
                    <h3 className="text-lg font-medium leading-snug">Episode {i}</h3>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </PerspectiveHero>
      </div>

      {/* Taste It Out Section */}
      <div id="taste-it-out" className="relative scroll-m-20">
        <PerspectiveHero hero={tasteHero} cover={tasteCover}>
          <div className="container mx-auto px-6 md:px-12 py-12 md:py-24 max-w-[1200px] relative z-10">
            <div className="mb-32">
              <MaskText text="Taste It Out - Recent Experiences" className="text-4xl font-bold tracking-tight mb-10" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={`taste-${i}`} className="group flex flex-col gap-4">
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-900 border border-white/10">
                      <div className="absolute inset-0 flex items-center justify-center text-zinc-500">
                        <Play className="w-8 h-8" />
                      </div>
                    </div>
                    <h3 className="text-lg font-medium leading-snug">Episode {i}</h3>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </PerspectiveHero>
      </div>
    </div>
  );
}
