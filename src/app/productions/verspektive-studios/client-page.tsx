"use client";

import Image from "next/image";
import { PerspectiveHero } from "@/components/ui/perspective-hero";
import MaskText from "@/components/MaskText";
import { Video, Mic, Film, Camera, Lightbulb, Box } from "lucide-react";
import { ContactEmailDropdown } from "@/components/ContactEmailDropdown";
import { ArrowRight } from "lucide-react";
import LightRays from "@/components/ui/LightRays";
import { useTheme } from "next-themes";
import { useEffect } from "react";

export default function VerspektiveStudiosClient() {
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    if (theme !== "dark") {
      setTheme("dark");
    }
  }, [setTheme, theme]);
  const hero = (
    <div className="flex flex-col items-center justify-center text-foreground bg-transparent relative transition-colors duration-300 w-full h-full px-6 text-center" style={{ minHeight: '600px' }}>
      <div className="absolute inset-0 z-0">
        <LightRays
          raysOrigin="top-center"
          raysColor="#ffffff"
          raysSpeed={1.5}
          lightSpread={0.8}
          rayLength={1.2}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0.1}
          distortion={0.05}
          className="custom-rays"
        />
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center w-full mt-20">
        <div className="relative w-full max-w-[400px] h-[150px] mx-auto mb-8">
          <Image
            src="/MFB LOGO wg.png"
            alt="Verspektive Studio"
            fill
            className="object-contain"
            priority
          />
        </div>
        <MaskText
          text="State-of-the-art production spaces."
          className="text-xl md:text-2xl text-white/80 font-medium max-w-3xl leading-relaxed justify-center"
        />
      </div>
    </div>
  );

  const cover = (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-zinc-900 p-6 md:p-16 text-center">
      <div className="max-w-4xl">
        <h2 className="text-3xl md:text-5xl font-bold mb-8 text-white">About the Studio</h2>
        <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-6">
          A premium podcast and content creation studio in Dakshina Kannada & Udupi. Designed for professional standards, our acoustically treated environment is available for both flexible rental and full-service self-production.
        </p>
        <p className="text-lg md:text-xl text-white/80 leading-relaxed">
          From simple space rental to end-to-end recording, editing, and delivery, we provide the high-quality cameras, lighting, and premium audio you need to transform great conversations into impactful stories.
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <PerspectiveHero hero={hero} cover={cover}>
        <div className="container mx-auto px-6 md:px-12 py-12 md:py-24 max-w-[1200px] relative z-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 mb-32">
            <div>
              <MaskText text="Our Facilities" className="text-3xl font-semibold mb-6" />
              <MaskText 
                text="VerspeKtive Studios offers premium environments engineered for high-quality audio and video production. Designed with creators in mind."
                className="text-lg text-white/70 leading-relaxed mb-6 block"
              />
            </div>
            <div>
              <ul className="space-y-4">
                {[
                  { icon: Box, title: "Studio, Podcast Set, AC, Power" },
                  { icon: Mic, title: "2 Hollyland Microphones" },
                  { icon: Camera, title: "Up to 2 Sony cinema grade cameras with operators" },
                  { icon: Lightbulb, title: "Up to 3 video lights" },
                ].map((service, i) => (
                  <div key={i} className="flex items-center gap-4 text-base md:text-lg font-medium p-4 rounded-2xl bg-zinc-900 border border-white/10">
                    <service.icon className="w-6 h-6 text-white/80 shrink-0" />
                    <MaskText text={service.title} />
                  </div>
                ))}
              </ul>
            </div>
          </div>

          <div id="contact" className="bg-zinc-900 text-white rounded-[32px] p-12 md:p-24 text-center border border-white/10 mb-20">
            <MaskText text="Book the Studio" className="text-4xl md:text-5xl font-bold mb-6 justify-center" />
            <MaskText 
              text="Want to rent our studio? Discuss your project needs with us."
              className="text-xl text-white/80 mb-10 max-w-2xl mx-auto justify-center"
            />
            <ContactEmailDropdown 
              email="verspektive@gmail.com" 
              className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-semibold text-lg transition-transform hover:scale-105"
            >
              Contact Us <ArrowRight className="w-5 h-5" />
            </ContactEmailDropdown>
          </div>

        </div>
      </PerspectiveHero>
    </div>
  );
}
