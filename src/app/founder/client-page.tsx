"use client";

import { useRef, lazy, Suspense, useEffect } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { motion, useScroll, useTransform, Variants, type MotionValue } from "framer-motion";
import { Mail, ChevronDown } from "lucide-react";

/* Inline brand icons — lucide-react doesn't ship brand icons */
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <path d="m10 15 5-3-5-3z" />
  </svg>
);

import { ArticleCard } from "@/components/ui/blog-post-card";
import { MailDropdown } from "@/components/ui/mail-dropdown";
import { BlurReveal } from "@/components/ui/blur-reveal";
import { BeamsBackground } from "@/components/ui/beams-background";

/* Lazy-load the heavy cursor component — only needed on desktop */
const CursorFollower = lazy(() =>
  import("@/components/ui/cursor-follower").then((m) => ({
    default: m.CursorFollower,
  }))
);

/* ──────────────────────────────────────────
   Animation Variants (simplified)
   ────────────────────────────────────────── */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" },
  }),
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ──────────────────────────────────────────
   Animated Components
   ────────────────────────────────────────── */

function AnimatedVentureCard({ v, i }: { v: any; i: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start 0.85", "start 0.50"], // Starts at 85%, finishes at the middle of the screen (50%)
  });

  // Small artificial stagger to keep the "one after the other" feel on desktop,
  // without breaking the natural spatial staggering on mobile.
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
        transformPerspective: 1200, // Enables the 3D rotation effect
      }}
      className="h-full origin-bottom"
    >
      <ArticleCard
        headline={v.name}
        excerpt={v.description}
        cover={v.logo}
        tag={v.tag}
        writer={v.role}
        href={v.href}
        clampLines={3}
        tooltipText="open the page"
      />
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════ */

export default function FounderClientPage({ 
  name, role, ventures, pillars, stats 
}: { 
  name: string, 
  role: string, 
  ventures: any[], 
  pillars: any[], 
  stats: any[] 
}) {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.95]);

  const storyWrapperRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: storyScroll } = useScroll({
    target: storyWrapperRef,
    offset: ["start start", "end end"],
  });
  const shadowOpacity = useTransform(storyScroll, [0.75, 1], [0, 1]);

  const { setTheme } = useTheme();
  useEffect(() => {
    setTheme("dark");
  }, [setTheme]);

  return (
    <div className="founder-cursor-page text-foreground overflow-clip relative min-h-screen w-full bg-[#FAFAFA] dark:bg-neutral-950 transition-colors duration-500">
      {/* Restored optimized canvas background */}
      <BeamsBackground className="fixed inset-0 z-0 pointer-events-none" />

      {/* Lazy-loaded cursor — only renders on desktop, no SSR cost */}
      <Suspense fallback={null}>
        <CursorFollower />
      </Suspense>

      <div className="relative z-10 w-full">
        {/* Sticky Background Image for Entire Page */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="sticky top-0 h-screen w-full flex flex-col items-start justify-end pt-24 pb-0 pl-0 overflow-hidden hidden lg:flex">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="relative w-[85vw] max-w-[1200px] h-full"
            >
              <Image
                src="/Vikhilanna.png"
                alt="Vikhil V Salian"
                fill
                className="object-contain object-left-bottom pointer-events-auto"
                priority
              />
            </motion.div>

            <motion.div
              style={{ opacity: shadowOpacity }}
              className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent pointer-events-none"
            />
          </div>
        </div>

        <div ref={storyWrapperRef} className="relative">
          <div className="relative z-10">
            {/* ═══════════════════════════════════════
                SECTION 1 — HERO
                ═══════════════════════════════════════ */}
            <section
              ref={heroRef}
              id="founder-hero"
              className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
            >
              {/* Subtle radial gradient */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(128,128,128,0.15)_0%,_transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.03)_0%,_transparent_70%)] pointer-events-none" />

              <motion.div
                style={{ opacity: heroOpacity, scale: heroScale }}
                className="relative z-10 w-full px-6 lg:px-24 xl:px-32"
              >
                <div className="flex flex-col lg:flex-row items-center lg:justify-end gap-8 lg:gap-16">
                  {/* Text Content */}
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={stagger}
                    className="text-center lg:text-right"
                  >
                    <motion.h1
                      variants={fadeUp}
                      custom={1}
                      className="text-display-hero mb-8"
                    >
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground/90 to-foreground/90 block pr-[0.1em] -mr-[0.1em]">
                        {name.split(" ").slice(0, 2).join("\u00A0")}<br />
                        {name.split(" ").slice(2).join(" ")}
                      </span>
                    </motion.h1>

                    <motion.p
                      variants={fadeUp}
                      custom={2}
                      className="text-lg md:text-xl text-muted-foreground font-light tracking-wide mb-8"
                    >
                      {role}
                    </motion.p>

                    {/* Social Links */}
                    <motion.div
                      variants={fadeUp}
                      custom={3}
                      className="flex items-center gap-3 justify-center lg:justify-end"
                    >
                      <a
                        href="https://www.instagram.com/the_verspektive"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cursor-can-hover w-10 h-10 rounded-full border border-foreground/20 flex items-center justify-center text-foreground/60 hover:text-foreground hover:border-foreground/40 transition-all duration-300"
                      >
                        <InstagramIcon className="w-4 h-4" />
                      </a>
                      <a
                        href="https://www.youtube.com/@verspektive_productions"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cursor-can-hover w-10 h-10 rounded-full border border-foreground/20 flex items-center justify-center text-foreground/60 hover:text-foreground hover:border-foreground/40 transition-all duration-300"
                      >
                        <YoutubeIcon className="w-4 h-4" />
                      </a>
                      <MailDropdown email="hey@verspektive.in">
                        <div className="cursor-can-hover w-10 h-10 rounded-full border border-foreground/20 flex items-center justify-center text-foreground/60 hover:text-foreground hover:border-foreground/40 transition-all duration-300">
                          <Mail className="w-4 h-4" />
                        </div>
                      </MailDropdown>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>


            </section>

            {/* ═══════════════════════════════════════
            SECTION 2 — ABOUT
            ═══════════════════════════════════════ */}
            <section id="founder-about" className="relative w-full py-24 lg:py-32">
              {/* Subtle top divider gradient */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent" />

              <div className="w-full px-6 lg:px-24 xl:px-32 relative z-20">
                <div className="flex flex-col items-end lg:ml-auto w-full lg:w-[65%] xl:w-[60%]">
                  <div className="w-full glass-card !bg-black/50 dark:!bg-black/70 p-8 lg:p-12 rounded-[24px] backdrop-blur-md">
                    {/* Mobile Portrait */}
                    <div className="lg:hidden mb-8 relative aspect-[4/5] rounded-[24px] overflow-hidden glass-card p-1 max-w-[300px] mx-auto">
                      <Image
                        src="/Vikhilanna.png"
                        alt="Vikhil V Salian"
                        fill
                        sizes="(max-width: 768px) 100vw"
                        className="object-cover rounded-[20px]"
                      />
                      {/* Gradient overlay at bottom */}
                      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent rounded-b-[20px] pointer-events-none" />
                    </div>

                    {/* Bio Text */}
                    <div className="flex-1 space-y-6">
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 0.8 }}
                        className="text-sm font-medium tracking-[0.15em] uppercase text-foreground/40"
                      >
                        The Story
                      </motion.p>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="space-y-5"
                      >
                        <BlurReveal
                          textBlocks={[
                            {
                              text: "Vikhil V Salian is the Managing Director, Principal Designer and Illumination Expert of G3 Builders & Architects, Founder and Creative Head of VerspeKtive Productions, and the Host of TIO Originals.",
                              className: "text-xl md:text-2xl font-light text-foreground/90 leading-relaxed",
                            },
                            {
                              text: "An Architect by profession, he brings together creativity, design thinking, and technical expertise to produce content that is both visually compelling and meaningful.",
                              className: "text-lg text-foreground/60 leading-relaxed",
                            },
                            {
                              text: "Driven by a passion for storytelling and innovation, Vikhil founded VerspeKtive Productions with the vision of building a premium digital media company that delivers world-class production quality while creating conversations that educate, inspire, and entertain.",
                              className: "text-lg text-foreground/60 leading-relaxed",
                            },
                          ]}
                          blurAmount={8}
                          scrollRange={["start 0.8", "end 0.4"]}
                        />
                      </motion.div>

                      {/* Stat Cards */}
                      <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-10%" }}
                        variants={stagger}
                        className="grid grid-cols-3 gap-4 pt-8"
                      >
                        {stats.map((stat) => (
                          <motion.div
                            key={stat.label}
                            variants={fadeUp}
                            custom={0}
                            className="glass-card p-4 lg:p-5 text-center h-full"
                          >
                            <p className="text-2xl lg:text-3xl font-bold text-foreground mb-1">
                              {stat.value}
                            </p>
                            <p className="text-xs lg:text-sm text-foreground/40">
                              {stat.label}
                            </p>
                          </motion.div>
                        ))}
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div> {/* Close relative z-10 */}
        </div> {/* Close parent relative */}

        {/* ═══════════════════════════════════════
            SECTION 3 — VENTURES
            ═══════════════════════════════════════ */}
        <section id="founder-ventures" className="relative w-full py-24 lg:py-32">
          <div className="max-w-6xl mx-auto px-6">
            {/* Section heading */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="text-center mb-16 lg:mb-20 relative -z-10"
            >

              <h2 className="text-display-hero text-foreground">Ventures</h2>
            </motion.div>

            {/* Venture Cards Grid - Scroll Driven 3D Stagger */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
              {ventures.map((v, i) => (
                <AnimatedVentureCard key={v.name} v={v} i={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            SECTION 4 — VISION
            ═══════════════════════════════════════ */}
        <section id="founder-vision" className="relative w-full py-24 lg:py-32">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent" />

          <div className="max-w-5xl mx-auto px-6 text-center">
            {/* Section label */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-sm font-medium tracking-[0.15em] uppercase text-foreground/40 mb-12"
            >
              The Vision
            </motion.p>

            {/* Pull-quote */}
            <div className="relative">
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-6xl text-foreground/10 font-serif leading-none select-none">
                &ldquo;
              </span>
              <BlurReveal
                text="Building premium brands that delivers world class services while creating conversations that educate, inspire, and entertain."
                as="blockquote"
                className="text-2xl md:text-3xl lg:text-4xl font-light text-white mix-blend-difference leading-snug italic max-w-4xl mx-auto relative z-10"
                blurAmount={12}
                scrollRange={["start 0.8", "end 0.4"]}
              />
            </div>


          </div>
        </section>

        {/* ═══════════════════════════════════════
            SECTION 5 — CONNECT
            ═══════════════════════════════════════ */}
        <section id="founder-connect" className="relative w-full py-24 lg:py-32">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            >
              <h2 className="text-display-lg text-white mix-blend-difference relative z-10 mb-4">
                Let&apos;s create something
                <br />
                together.
              </h2>
              <p className="text-muted-foreground text-lg mb-10 max-w-lg mx-auto">
                Want to collaborate or just want to say hello? Reach out
                through any of these channels.
              </p>
            </motion.div>

            {/* Social & Contact Links */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <motion.a
                variants={fadeUp}
                custom={0}
                href="https://www.instagram.com/the_verspektive"
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-can-hover glass-card !bg-black/80 px-6 py-3 flex items-center gap-2.5 text-foreground/70 hover:text-foreground transition-colors"
              >
                <InstagramIcon className="w-4 h-4" />
                <span className="text-sm font-medium">Instagram</span>
              </motion.a>

              <motion.a
                variants={fadeUp}
                custom={1}
                href="https://www.youtube.com/@verspektive_productions"
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-can-hover glass-card !bg-black/80 px-6 py-3 flex items-center gap-2.5 text-foreground/70 hover:text-foreground transition-colors"
              >
                <YoutubeIcon className="w-4 h-4" />
                <span className="text-sm font-medium">YouTube</span>
              </motion.a>

              <motion.div variants={fadeUp} custom={2}>
                <MailDropdown email="hey@verspektive.in">
                  <div className="cursor-can-hover glass-card !bg-black/80 px-6 py-3 flex items-center gap-2.5 text-foreground/70 hover:text-foreground transition-colors">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm font-medium">hey@verspektive.in</span>
                  </div>
                </MailDropdown>
              </motion.div>
            </motion.div>


          </div>
        </section>
      </div>
    </div>
  );
}
