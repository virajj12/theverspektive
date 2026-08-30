"use client";

import { PerspectiveHero } from "@/components/ui/perspective-hero";
import MaskText from "@/components/MaskText";
import { Play } from "lucide-react";

export default function TasteItOutClient() {
  const tasteHero = (
    <div className="flex flex-col items-center justify-center text-foreground bg-background transition-colors duration-300 w-full h-full px-6 text-center">
      <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white tracking-tight">Taste It Out</h1>
      <MaskText
        text="A culinary journey through stories and flavors."
        className="text-xl md:text-2xl text-white/80 font-medium max-w-3xl leading-relaxed justify-center"
      />
    </div>
  );

  const tasteAboutCover = (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-zinc-900 p-6 md:p-16 text-center">
      <div className="max-w-4xl">
        <h2 className="text-3xl md:text-5xl font-bold mb-8 text-white">About Taste It Out</h2>
        <p className="text-lg md:text-xl text-white/80 leading-relaxed">
          Taste It Out takes you on a flavorful journey, exploring the hidden culinary gems and the vibrant stories behind the chefs who craft them. Discover the passion, the ingredients, and the cultural heritage that make every dish a masterpiece.
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-black text-white pb-32">
      <div id="taste-it-out" className="relative scroll-m-20">
        <PerspectiveHero hero={tasteHero} cover={tasteAboutCover}>
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
                    <div>
                      <div className="h-6 bg-zinc-900 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-zinc-900/50 rounded w-1/2"></div>
                    </div>
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
