"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronRight, ChevronDown } from "lucide-react";
import HeroSection from "@/components/HeroSection";
import { ElasticGallery } from "@/components/ui/elastic-gallery";
import MaskText from "@/components/MaskText";
import { useGlobalLoader } from "@/components/global-loader-provider";
import { DottedSurface } from "@/components/ui/dotted-surface";

// GSAP replaced by Framer Motion

interface ClientHomeProps {
  heroHeadline: string;
  heroTagline: string;
  heroImage: string;
}

export default function ClientHome({
  heroHeadline,
  heroTagline,
  heroImage,
}: ClientHomeProps) {
  const heroRef = useRef<HTMLElement>(null);
  const { loading } = useGlobalLoader();

  const { scrollY } = useScroll();
  const logoY = useTransform(scrollY, [0, 1000], [0, -800]);


  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start end', 'end start']
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["-40%", "40%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  useEffect(() => {
    // Force scroll to top on reload to prevent awkward mid-scroll states
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className="w-full flex flex-col bg-transparent">

        {/* Wrapper to contain the sticky logo so it doesn't bleed into Bento Grid */}
        <div className="relative w-full z-0">
          {/* ═══════════════════════════════════════
              HERO 1 — Primary Brand Hero (Full-Screen)
              ═══════════════════════════════════════ */}
          <section className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-black -z-10">
            {/* Dotted Surface Background */}
            <div className="absolute inset-0 z-0 opacity-60 pointer-events-none">
              <DottedSurface themeOverride="dark" />
            </div>

            <motion.div
              style={{ y: logoY }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: loading ? 1.8 : 0, ease: "easeOut" }}
              className="relative z-10"
            >
              <Image
                src="/VerspeKtive White Word-01.png"
                alt="VerspeKtive"
                width={800}
                height={200}
                className="w-[220px] sm:w-[320px] md:w-[440px] h-auto object-contain drop-shadow-[0_0px_80px_rgba(0,0,0,0.8)]"
                priority
              />
            </motion.div>

            {/* Scroll Indication */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: !loading ? 1 : 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="absolute bottom-30 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-70"
            >
              {/* <span className="text-white text-[10px] tracking-[0.2em] uppercase mb-4">Scroll Up</span> */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              >
                <div className="w-6 h-6 rounded-full border border-white/30 flex items-center justify-center">
                  <ChevronDown className="text-white/70 w-5 h-5" />
                </div>
              </motion.div>
            </motion.div>
          </section>

          {/* ═══════════════════════════════════════
              HERO 2 — Vikhil Section (Replacing Productions)
              ═══════════════════════════════════════ */}
          {/* Dummy element for unused heroRef to prevent Framer Motion hydration error */}
          <div ref={heroRef as any} style={{ display: 'none' }} />

          {false && (
            <section className="relative z-10 w-full min-h-[50vh] md:min-h-screen flex overflow-hidden bg-black shadow-[0_-30px_60px_rgba(0,0,0,0.8)]">
              {/* Top gradient shadow for seamless transition over black sticky header */}
              <div className="absolute inset-x-0 top-0 h-32 md:h-48 bg-gradient-to-b from-black via-black/80 to-transparent z-10 pointer-events-none" />
              {/* Background image */}
              {heroImage && (
                <div className="absolute inset-0 z-0 bg-black overflow-hidden">
                  <motion.div style={{ y: bgY }} className="absolute inset-x-0 -top-[30%] h-[160%] w-full">
                    <Image
                      src={heroImage}
                      alt={heroHeadline}
                      fill
                      sizes="100vw"
                      className="object-cover opacity-40"
                    />
                  </motion.div>
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 to-transparent" />
                </div>
              )}

              {/* Foreground Content */}
              <div className="relative z-10 w-full flex-grow flex items-center min-h-[50vh] md:min-h-screen max-w-[1440px] mx-auto px-6 md:px-12">

                {/* Text Content */}
                <motion.div
                  style={{ y: textY }}
                  className="relative z-20 max-w-xl md:w-1/2 flex flex-col items-start justify-center text-left pt-24 pb-32 md:py-0"
                >
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-2xl md:text-3xl lg:text-4xl font-light text-white/80 mb-2"
                  >
                    The Founder
                  </motion.h3>
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 tracking-tight"
                  >
                    Vikhil V Salian
                  </motion.h1>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  >
                    <Link
                      href="/team#founder"
                      className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-zinc-200 transition-colors"
                    >
                      Meet the Founder <ChevronRight className="w-4 h-4" />
                    </Link>
                  </motion.div>
                </motion.div>

                {/* Vikhil Transparent Image */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="absolute bottom-0 right-[-10%] md:-right-[5%] lg:-right-[2%] z-10 w-[90%] sm:w-[70%] md:w-[65%] lg:w-[60%]"
                >
                  <Image
                    src="/Vikhil transparent.png"
                    alt="Vikhil V Salian"
                    width={1000}
                    height={1000}
                    className="w-full h-auto max-h-[95vh] object-contain object-bottom pointer-events-none"
                    priority
                  />
                </motion.div>
              </div>
            </section>
          )}

          {/* ═══════════════════════════════════════
            ELASTIC GALLERY — Secondary Features
            ═══════════════════════════════════════ */}
          <ElasticGallery />
        </div>
      </div>
    </>
  );
}
