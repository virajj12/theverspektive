"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Film, Video, MonitorPlay, Mic, Play } from "lucide-react";
import MaskText from "@/components/MaskText";
import { motion, useScroll, useTransform } from "framer-motion";
import { ContactEmailDropdown } from "@/components/ContactEmailDropdown";
import TeamsSection from "@/components/TeamsSection";
import AnimatedGradient from "@/components/ui/animated-gradient";
import CardSwap, { Card } from "@/components/ui/CardSwap";
import BorderGlow from "@/components/ui/BorderGlow";
import { LiquidMetal, liquidMetalPresets } from "@paper-design/shaders-react";
import { useTabsStore } from "@/store/tabs-store";
import { ArticleCard } from "@/components/ui/blog-post-card";

interface Video {
  id: string | number;
  title: string;
  youtube_url: string;
  thumbnail_url: string;
  created_at?: string;
  published_at?: string;
  viewCount?: string;
}

const formatViews = (viewsStr: string | undefined) => {
  if (!viewsStr || viewsStr === "0") return "";
  const views = parseInt(viewsStr, 10);
  if (isNaN(views)) return "";
  if (views >= 1000000) return (views / 1000000).toFixed(1) + "M views";
  if (views >= 1000) return (views / 1000).toFixed(1) + "K views";
  return views + " views";
};
import { PerspectiveHero } from "@/components/ui/perspective-hero";
import { useTheme } from "next-themes";

function AnimatedVentureCard({ v, i }: { v: any; i: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start 0.85", "start 0.50"],
  });

  const start = i * 0.15;
  const end = Math.min(1, start + 0.85);

  const y = useTransform(scrollYProgress, [start, end], [120, 0]);
  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
  const rotateX = useTransform(scrollYProgress, [start, end], [30, 0]);
  const scale = useTransform(scrollYProgress, [start, end], [0.85, 1]);

  return (
    <motion.div
      ref={cardRef}
      style={{
        y,
        opacity,
        rotateX,
        scale,
        transformPerspective: 1200,
      }}
      className="h-full origin-bottom"
    >
      <ArticleCard
        headline={v.name}
        excerpt={v.description}
        cover={v.logo}
        href={v.href}
        clampLines={3}
        tooltipText="open the page"
        preserveLogoColor={v.preserveLogoColor}
      />
    </motion.div>
  );
}

const productionBrands = [
  {
    name: "VerspeKtive Studios",
    description: "A premium digital media company delivering world-class production quality.",
    logo: "/MFB LOGO wg.png",
    href: "/productions/verspektive-studios",
    preserveLogoColor: true
  },
  {
    name: "Talk it out originals",
    description: "Meaningful, insightful, and inspiring conversations with personalities from diverse fields.",
    logo: "/TIO-01.png",
    href: "/productions/tio-originals",
    preserveLogoColor: true
  }
];

export default function ProductionsClient({ 
  initialVideos = [],
  teams = []
}: { 
  initialVideos?: Video[],
  teams?: any[]
}) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Observer removed

  const hero = (
    <div className="flex flex-col items-center justify-center text-foreground bg-transparent relative overflow-hidden w-full h-full px-6 text-center">
      <AnimatedGradient 
        config={
          mounted && resolvedTheme === "light"
            ? {
                preset: "custom",
                color1: "#ffffff",
                color2: "#66B3FF",
                color3: "#f4f4f5",
                rotation: -50,
                proportion: 1,
                scale: 0.01,
                speed: 30,
                distortion: 0,
                swirl: 50,
                swirlIterations: 16,
                softness: 47,
                offset: -299,
                shape: "Checks",
                shapeSize: 45,
              }
            : { preset: "Prism" }
        }
      />
      <div className="relative z-10 flex flex-col items-center justify-center w-full">
        <div className="relative w-full max-w-[400px] h-[150px] mx-auto mb-8">
          <Image
            src="/555-01.png"
            alt="VerspeKtive Productions"
            fill
            className="object-contain dark:invert-0 invert"
            priority
          />
        </div>
        <MaskText
          text="1st Premium Multi-Cam & Podcast & Creator Studio in Tulunadu"
          className="text-xl md:text-2xl text-foreground/80 font-medium max-w-3xl leading-relaxed justify-center"
        />

      </div>
    </div>
  );

  const cover = (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-zinc-100 dark:bg-zinc-900 p-6 md:p-16 text-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl"
      >
        <MaskText text="About Us" className="text-3xl md:text-5xl font-bold mb-8 justify-center" />
        <MaskText
          text="VerspeKtive Productions is a premium digital media and content production company based in Beluvai, strategically located between Karkala and Moodbidri, Karnataka - dedicated to high-quality visual storytelling and meaningful digital content across platforms."
          className="text-lg md:text-xl text-foreground/80 leading-relaxed mb-6 block justify-center"
        />
        <MaskText
          text="We bring creativity, professionalism, and cinematic production standards to every project we undertake."
          className="text-lg md:text-xl text-foreground/80 leading-relaxed block justify-center"
        />
      </motion.div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      <PerspectiveHero hero={hero} cover={cover}>
        <div className="container mx-auto px-6 md:px-12 pt-12 pb-32 md:pt-24 md:pb-40 max-w-[1200px] relative z-10">

          {/* Our Services Section (Hidden for now) */}
          <div className="mb-32 hidden">
            <MaskText text="Our Services" className="text-4xl font-bold tracking-tight mb-10" />
            <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory" style={{ scrollbarWidth: 'none' }}>
              {[
                { icon: Mic, title: "Podcast Production" },
                { icon: Film, title: "Commercial Video Production" },
                { icon: MonitorPlay, title: "Social Media Content" },
                { icon: Video, title: "Creative Media Solutions & Post-Production" },
              ].map((service, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="text-lg font-medium text-foreground min-w-[280px] md:min-w-[320px] snap-center shrink-0 h-full"
                >
                  <BorderGlow className="flex flex-col items-center justify-center gap-4 p-8 w-full h-full" borderRadius={24}>
                    <service.icon className="w-12 h-12 text-foreground/80" />
                    <MaskText text={service.title} className="text-center" />
                  </BorderGlow>
                </motion.div>
              ))}
            </div>
          </div>

          {/* YouTube Showcase Section */}
          <div className="mb-32">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12 bg-zinc-100/60 dark:bg-zinc-900/40 p-8 md:p-16 rounded-3xl border border-black/10 dark:border-white/10 min-h-[500px] md:min-h-[600px] relative overflow-hidden">
              <div className="z-10 w-full md:w-1/2 mb-20 md:mb-0 relative">
                <MaskText text="Featured Portfolio" className="text-3xl md:text-5xl font-semibold mb-6 text-foreground leading-tight" />
                <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-lg leading-relaxed">
                  Check out our featured video projects and productions. We bring visions to life with cinematic quality and engaging storytelling.
                </p>
                <div className="flex gap-6">
                  <button 
                    onClick={() => {
                      const video = initialVideos.slice(0, 6)[activeCardIndex];
                      if (video) window.open(video.youtube_url, '_blank', 'noopener,noreferrer');
                    }}
                    className="p-4 rounded-full bg-foreground/5 border border-foreground/10 text-foreground hover:bg-foreground/10 transition-colors focus:outline-none cursor-pointer"
                    aria-label="Play frontmost video"
                  >
                    <Play className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="w-full md:w-1/2 relative h-[300px] md:h-[500px]">
                {initialVideos.length === 0 ? (
                  <p className="text-muted-foreground text-lg">No videos added yet. Check back soon!</p>
                ) : (
                  <CardSwap
                    cardDistance={60}
                    verticalDistance={70}
                    delay={4000}
                    pauseOnHover={false}
                    width={480}
                    height={270}
                    onActiveChange={setActiveCardIndex}
                  >
                    {initialVideos.slice(0, 6).map((video) => (
                      <Card key={video.id} customClass="!border-transparent !bg-transparent overflow-hidden cursor-pointer shadow-2xl group">
                        <BorderGlow className="w-full h-full !overflow-hidden" borderRadius={12}>
                          <Link href={video.youtube_url} target="_blank" rel="noopener noreferrer" className="block w-full h-full relative overflow-hidden rounded-[inherit]">
                            <Image
                              src={video.thumbnail_url}
                              alt={video.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex flex-col justify-end p-6">
                              <h3 className="text-xl font-bold text-white mb-2 leading-snug line-clamp-2">{video.title}</h3>
                              <div className="flex items-center text-sm font-medium text-white/80 gap-3">
                                <div className="flex items-center">
                                  <Play className="w-4 h-4 mr-2" /> Watch on YouTube
                                </div>
                                {video.viewCount && (
                                  <div className="text-white/60">
                                    • {formatViews(video.viewCount)}
                                  </div>
                                )}
                              </div>
                            </div>
                          </Link>
                        </BorderGlow>
                      </Card>
                    ))}
                  </CardSwap>
                )}
              </div>
            </div>
          </div>

          {/* Brands / Ventures Section */}
          <div className="mb-32 pt-20">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="text-center mb-16 lg:mb-20"
            >
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Production Verticals</h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-6xl mx-auto px-6">
              {productionBrands.map((brand, i) => (
                <AnimatedVentureCard key={brand.name} v={brand} i={i} />
              ))}
            </div>
          </div>

          {/* YouTube Section was here, moved to tio-originals */}
          
          {teams && teams.length > 0 && (
            <div className="mt-32">
              <TeamsSection teams={teams} />
            </div>
          )}


        </div>
      </PerspectiveHero>
    </div>
  );
}
