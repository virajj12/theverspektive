"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Film, Video, MonitorPlay, Mic, Play } from "lucide-react";
import MaskText from "@/components/MaskText";
import { motion } from "framer-motion";
import { ContactEmailDropdown } from "@/components/ContactEmailDropdown";
import { CoverflowCarousel, CoverflowSlide } from "@/components/ui/coverflow-carousel";
import AnimatedGradient from "@/components/ui/animated-gradient";

interface Video {
  id: number;
  title: string;
  youtube_url: string;
  thumbnail_url: string;
  created_at: string;
}
import { PerspectiveHero } from "@/components/ui/perspective-hero";

export default function ProductionsClient({ initialVideos, teams = [] }: { initialVideos: Video[], teams?: any[] }) {
  const [visibleCount, setVisibleCount] = useState(6);

  const visibleVideos = initialVideos.slice(0, visibleCount);
  const hasMore = visibleCount < initialVideos.length;

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  const hero = (
    <div className="flex flex-col items-center justify-center text-white bg-transparent relative overflow-hidden w-full h-full px-6 text-center">
      <AnimatedGradient />
      <div className="relative z-10 flex flex-col items-center justify-center w-full">
        <div className="relative w-full max-w-[400px] h-[150px] mx-auto mb-8">
          <Image
            src="/555-01.png"
            alt="VerspeKtive Productions"
            fill
            className="object-contain"
            priority
          />
        </div>
        <MaskText
          text="1st Premium Multi-Cam & Podcast & Creator Studio in DK & Udupi District"
          className="text-xl md:text-2xl text-white/80 font-medium max-w-3xl leading-relaxed justify-center"
        />
      </div>
    </div>
  );

  const cover = (
    <div className="relative w-full h-full overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=2656&auto=format&fit=crop"
        alt="Production Studio"
        fill
        priority
        className="object-cover"
      />
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      <PerspectiveHero hero={hero} cover={cover}>
        <div className="container mx-auto px-6 md:px-12 pt-12 pb-32 md:pt-24 md:pb-40 max-w-[1200px] relative z-10">

        {/* About Section */}
        <div id="about" className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 mb-32">
          <div>
            <MaskText text="About Us" className="text-3xl font-semibold mb-6" />
            <MaskText 
              text="VerspeKtive Productions is a premium digital media and content production company based in Beluvai, strategically located between Karkala and Moodbidri, Karnataka — dedicated to high-quality visual storytelling and meaningful digital content across platforms."
              className="text-lg text-white/70 leading-relaxed mb-6 block"
            />
            <MaskText 
              text="We bring creativity, professionalism, and cinematic production standards to every project we undertake."
              className="text-lg text-white/70 leading-relaxed block"
            />
          </div>
          <div>
            <MaskText text="Our Services" className="text-3xl font-semibold mb-6" />
            <ul className="space-y-6">
              {[
                { icon: Mic, title: "Podcast Production" },
                { icon: Film, title: "Commercial Video Production" },
                { icon: MonitorPlay, title: "Social Media Content" },
                { icon: Video, title: "Creative Media Solutions & Post-Production" },
              ].map((service, i) => (
                <motion.li 
                  key={i} 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex items-center gap-4 text-lg font-medium p-4 rounded-2xl bg-zinc-900 border border-white/10 text-white"
                >
                  <service.icon className="w-6 h-6 text-white/80" />
                  <MaskText text={service.title} />
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        {/* YouTube Showcase Section */}
        <div className="mb-32">
          <MaskText text="Our Latest Work" className="text-4xl font-bold tracking-tight mb-10" />
          
          {initialVideos.length === 0 ? (
            <p className="text-muted-foreground text-lg">No videos added yet. Check back soon!</p>
          ) : (
            <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleVideos.map((video) => (
                  <Link 
                    key={video.id} 
                    href={video.youtube_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group flex flex-col gap-4"
                  >
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-black/10 dark:group-hover:shadow-white/5">
                      <Image 
                        src={video.thumbnail_url} 
                        alt={video.title} 
                        fill 
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-110">
                          <Play className="w-5 h-5 text-black ml-1" />
                        </div>
                      </div>
                    </div>
                    <h3 className="text-lg font-medium leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                      {video.title}
                    </h3>
                  </Link>
                ))}
              </div>

              {hasMore && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={handleShowMore}
                    className="px-8 py-3 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 font-medium transition-colors"
                  >
                    Show More
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Teams Section */}
        {teams && teams.length > 0 && (
          <div className="mb-32 space-y-24">
            {teams.map((team: any) => {
              const slides: CoverflowSlide[] = team.members.map((m: any) => ({
                src: m.src,
                alt: "Team Member",
              }));
              
              if (slides.length === 0) return null;

              return (
                <div key={team.id} className="flex flex-col items-center">
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
        )}

        {/* Instagram Section */}
        <div className="mb-32">
          <div className="flex flex-col items-center text-center space-y-6">
            <MaskText text="Follow Our Journey" className="text-4xl font-bold tracking-tight justify-center" />
            <MaskText 
              text="Stay updated with behind-the-scenes content, latest projects, and more on our Instagram."
              className="text-lg text-muted-foreground max-w-2xl justify-center"
            />
            <Link 
              href="https://instagram.com/verspektive_productions" 
              target="_blank" 
              rel="noopener noreferrer"
              className="relative w-full max-w-4xl aspect-[16/10] md:aspect-video rounded-3xl overflow-hidden border border-zinc-200 dark:border-white/10 mt-8 group block"
            >
              <Image
                src="/Productions screenshot.png"
                alt="VerspeKtive Productions Instagram"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 dark:group-hover:bg-white/5 transition-colors" />
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div id="contact" className="bg-zinc-900 text-white rounded-[32px] p-12 md:p-24 text-center">
          <MaskText text="Ready to create?" className="text-4xl md:text-5xl font-bold mb-6 justify-center" />
          <MaskText 
            text="Let's discuss how we can bring your creative vision to life with our premium production standards."
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
