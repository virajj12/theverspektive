"use client";

import { PerspectiveHero } from "@/components/ui/perspective-hero";
import { LiquidMetal, liquidMetalPresets } from "@paper-design/shaders-react";
import Link from "next/link";
import { ArrowRight, MessageCircle, Utensils } from "lucide-react";
import { TiltCard } from "@/components/ui/be-ui-tilt-card";

export default function TioOriginalsClient() {
  const tioOriginalsHero = (
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
      <p className="text-xl md:text-2xl text-zinc-400 font-medium max-w-2xl leading-relaxed">
        Pioneering perspectives. Authentic stories.
      </p>
    </div>
  );

  const tioOriginalsAboutCover = (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-zinc-900 p-6 md:p-16 text-center">
      <div className="max-w-4xl">
        <h2 className="text-3xl md:text-5xl font-bold mb-8 text-white">About TIO Originals</h2>
        <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-6">
          TIO Originals is the flagship production house of VerspeKtive, dedicated to creating profound, thought-provoking content that challenges the status quo. We believe in the power of authentic storytelling to bridge divides and foster understanding across diverse communities.
        </p>
        <p className="text-lg md:text-xl text-white/80 leading-relaxed">
          Our productions include deep-dive conversational series like <span className="font-semibold text-white">Talk It Out</span>, with new original formats and stories taking shape for what comes next, all produced with our signature commitment to raw, unfiltered truth and exceptional production value.
        </p>

      </div>
    </div>
  );

  const ENABLE_TASTE_IT_OUT = false;

  return (
    <div className="flex flex-col min-h-screen bg-black text-white pb-32">
      {/* TIO Originals Section */}
      <div id="tio-originals" className="relative scroll-m-20">
        <PerspectiveHero hero={tioOriginalsHero} cover={tioOriginalsAboutCover}>
          <div className="container mx-auto px-6 md:px-12 py-24 max-w-[1200px] relative z-10 flex flex-col items-center justify-center min-h-[50vh]">

            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Explore the Brands</h2>
              <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto">
                Dive into our specialized production verticals, each crafted to tell stories from a unique perspective.
              </p>
            </div>

            <div className={`grid grid-cols-1 gap-8 w-full ${ENABLE_TASTE_IT_OUT ? 'md:grid-cols-2 max-w-5xl' : 'max-w-2xl mx-auto'}`}>
              {/* Talk It Out Card */}
              <TiltCard className="rounded-3xl border border-white/10 hover:border-white/20 transition-colors duration-500 overflow-hidden">
                <Link
                  href="/productions/tio-originals/talk-it-out"
                  className="group relative flex flex-col justify-between h-[400px] p-10 bg-zinc-900 w-full"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center backdrop-blur-md border border-white/10 group-hover:scale-110 transition-transform duration-500">
                      <MessageCircle className="w-8 h-8 text-white" />
                    </div>
                    <ArrowRight className="w-8 h-8 text-white/30 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div className="relative z-10 mt-auto">
                    <h3 className="text-3xl font-bold mb-4">Talk It Out</h3>
                    <p className="text-zinc-400 text-lg">Profound, unfiltered conversations with guests from all walks of life.</p>
                  </div>
                </Link>
              </TiltCard>

              {/* Taste It Out Card */}
              {ENABLE_TASTE_IT_OUT && (
                <TiltCard className="rounded-3xl border border-white/10 hover:border-white/20 transition-colors duration-500 overflow-hidden">
                  <Link
                    href="/productions/tio-originals/taste-it-out"
                    className="group relative flex flex-col justify-between h-[400px] p-10 bg-zinc-900 w-full"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center backdrop-blur-md border border-white/10 group-hover:scale-110 transition-transform duration-500">
                        <Utensils className="w-8 h-8 text-white" />
                      </div>
                      <ArrowRight className="w-8 h-8 text-white/30 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div className="relative z-10 mt-auto">
                      <h3 className="text-3xl font-bold mb-4">Taste It Out</h3>
                      <p className="text-zinc-400 text-lg">A flavorful journey exploring culinary gems and the stories behind them.</p>
                    </div>
                  </Link>
                </TiltCard>
              )}
            </div>

          </div>
        </PerspectiveHero>
      </div>
    </div>
  );
}
