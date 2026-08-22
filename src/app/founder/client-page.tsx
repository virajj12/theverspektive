"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
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
import MaskText from "@/components/MaskText";
import { FloatingParticles } from "@/components/ui/floating-particles";
import { CursorFollower } from "@/components/ui/cursor-follower";
import { ArticleCard } from "@/components/ui/blog-post-card";
import { MailDropdown } from "@/components/ui/mail-dropdown";
import { TiltCard } from "@/components/ui/be-ui-tilt-card";
import { BeamsBackground } from "@/components/ui/beams-background";

/* ──────────────────────────────────────────
   Animation Variants
   ────────────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.15, ease: "easeOut" },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

/* ──────────────────────────────────────────
   Ventures Data
   ────────────────────────────────────────── */

const ventures = [
  {
    name: "G3 Builders & Architects",
    // role: "Managing Director & Principal Designer",
    role: "Principal Designer & Illumination Expert",
    description:
      "Architecture, design thinking, and illumination expertise — crafting spaces that inspire.",
    logo: "/G3 B & A LOGO WHITE.png",
    href: "/g3-builders",
    tag: "Architecture",
  },
  {
    name: "VerspeKtive Productions",
    role: "Founder & Creative Head",
    description:
      "A premium digital media company delivering world-class production quality.",
    logo: "/555-01.png",
    href: "/productions",
    tag: "Digital Media",
  },
  {
    name: "TIO Originals",
    role: "Creative Head & Host",
    description:
      "Sharing impactful stories and meaningful conversations with diverse audiences.",
    logo: "/TIO-01.png",
    href: "/tio-originals",
    tag: "Content Platform",
  },
];

/* ──────────────────────────────────────────
   Philosophy Pillars Data
   ────────────────────────────────────────── */

const pillars = [
  {
    title: "Storytelling",
    description: "Crafting narratives that resonate across mediums and audiences.",
    icon: "✦",
  },
  {
    title: "Innovation",
    description: "Pushing creative boundaries with design thinking and technology.",
    icon: "◈",
  },
  {
    title: "Impact",
    description: "Creating content that educates, inspires, and entertains — leaving a lasting impression.",
    icon: "◇",
  },
];

/* ──────────────────────────────────────────
   Stats Data
   ────────────────────────────────────────── */

const stats = [
  { value: "3+", label: "Ventures Founded" },
  { value: "1", label: "Premium Studio" },
  { value: "∞", label: "Creative Vision" },
];

/* ══════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════ */

export default function FounderClientPage() {
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

  return (
    <BeamsBackground className="founder-cursor-page text-white overflow-clip" intensity="medium">
      <CursorFollower />

      <div ref={storyWrapperRef} className="relative">
        {/* Sticky Background Image for Hero and About */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="sticky top-0 h-screen w-full flex flex-col items-end justify-end pb-0 pr-0 overflow-hidden hidden lg:flex">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="relative w-[65vw] max-w-[1000px] h-[100vh]"
            >
              <Image
                src="/Vikhil transparent.png"
                alt="Vikhil V Salian"
                fill
                className="object-contain object-bottom pointer-events-auto"
                priority
              />
            </motion.div>

            <motion.div
              style={{ opacity: shadowOpacity }}
              className="absolute inset-x-0 bottom-0 h-[25vh] bg-gradient-to-t from-neutral-950 to-transparent pointer-events-none"
            />
          </div>
        </div>

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
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.03)_0%,_transparent_70%)] pointer-events-none" />

            <motion.div
              style={{ opacity: heroOpacity, scale: heroScale }}
              className="relative z-10 max-w-6xl mx-auto px-6 w-full"
            >
              <div className="flex flex-col lg:flex-row items-center lg:items-end gap-8 lg:gap-16">
                {/* Text Content */}
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={stagger}
                  className="flex-1 text-center lg:text-left"
                >
                  {/* <motion.p
                    variants={fadeUp}
                    custom={0}
                    className="text-sm md:text-base font-medium tracking-[0.2em] uppercase text-white/40 mb-4"
                  >
                    Managing Director · Principal Designer · Creative Head
                  </motion.p> */}

                  <motion.h1
                    variants={fadeUp}
                    custom={1}
                    className="text-display-hero text-white mb-4"
                  >
                    Vikhil
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/90">
                      V Salian
                    </span>
                  </motion.h1>

                  <motion.p
                    variants={fadeUp}
                    custom={2}
                    className="text-lg md:text-xl text-white/50 font-light tracking-wide mb-8"
                  >
                    Managing Director {/* Architect · Filmmaker · Visionary */}
                  </motion.p>

                  {/* Social Links */}
                  <motion.div
                    variants={fadeUp}
                    custom={3}
                    className="flex items-center gap-3 justify-center lg:justify-start"
                  >
                    <a
                      href="https://www.instagram.com/the_verspektive"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-can-hover w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-all duration-300"
                    >
                      <InstagramIcon className="w-4 h-4" />
                    </a>
                    <a
                      href="https://www.youtube.com/@verspektive_productions"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-can-hover w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-all duration-300"
                    >
                      <YoutubeIcon className="w-4 h-4" />
                    </a>
                    <MailDropdown email="verspektive@gmail.com">
                      <div className="cursor-can-hover w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-all duration-300">
                        <Mail className="w-4 h-4" />
                      </div>
                    </MailDropdown>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
              <span className="text-[10px] tracking-[0.25em] uppercase text-white/30">
                Scroll
              </span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              >
                <ChevronDown className="w-4 h-4 text-white/30" />
              </motion.div>
            </motion.div>
          </section>

          {/* ═══════════════════════════════════════
          SECTION 2 — ABOUT
          ═══════════════════════════════════════ */}
          <section id="founder-about" className="relative w-full py-24 lg:py-32">
            {/* Subtle top divider gradient */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="max-w-6xl mx-auto px-6 relative z-20">
              <div className="flex flex-col items-start w-full lg:w-[70%] xl:w-[65%]">
                <TiltCard className="w-full glass-card-dark p-8 lg:p-12 rounded-[24px] backdrop-blur-md">
                  {/* Mobile Portrait */}
                  <div className="lg:hidden mb-8 relative aspect-[4/5] rounded-[24px] overflow-hidden glass-card-dark p-1 max-w-[300px] mx-auto">
                    <Image
                      src="/Vikhil.jpg"
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
                      className="text-sm font-medium tracking-[0.15em] uppercase text-white/40"
                    >
                      The Story
                    </motion.p>

                    <div className="space-y-5">
                      <MaskText
                        text="Vikhil V Salian is the Managing Director, Principal Designer and Illumination Expert of G3 Builders & Architects, Founder and Creative Head of VerspeKtive Productions, and the Host of TIO Originals."
                        className="text-xl md:text-2xl font-light text-white/90 leading-relaxed"
                      />
                      <MaskText
                        text="An Architect by profession, he brings together creativity, design thinking, and technical expertise to produce content that is both visually compelling and meaningful."
                        className="text-lg text-white/60 leading-relaxed"
                      />
                      <MaskText
                        text="Driven by a passion for storytelling and innovation, Vikhil founded VerspeKtive Productions with the vision of building a premium digital media company that delivers world-class production quality while creating conversations that educate, inspire, and entertain."
                        className="text-lg text-white/60 leading-relaxed"
                      />
                    </div>

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
                          className="h-full"
                        >
                          <TiltCard className="glass-card-dark p-4 lg:p-5 text-center h-full">
                            <p className="text-2xl lg:text-3xl font-bold text-white mb-1">
                              {stat.value}
                            </p>
                            <p className="text-xs lg:text-sm text-white/40">
                              {stat.label}
                            </p>
                          </TiltCard>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                </TiltCard>
              </div>
            </div>
          </section>
        </div> {/* Close relative z-10 */}
      </div> {/* Close parent relative */}

      {/* ═══════════════════════════════════════
          SECTION 3 — VENTURES
          ═══════════════════════════════════════ */}
      <section id="founder-ventures" className="relative w-full py-24 lg:py-32">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="max-w-6xl mx-auto px-6">
          {/* Section heading */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="text-center mb-16 lg:mb-20"
          >
            <p className="text-sm font-medium tracking-[0.15em] uppercase text-white/40 mb-3">
              Building Brands
            </p>
            <h2 className="text-display-hero text-white">Ventures</h2>
          </motion.div>

          {/* Venture Cards Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-5%" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
          >
            {ventures.map((v, i) => (
              <motion.div key={v.name} variants={fadeUp} custom={i} className="h-full">
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
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 4 — VISION
          ═══════════════════════════════════════ */}
      <section id="founder-vision" className="relative w-full py-24 lg:py-32">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="max-w-5xl mx-auto px-6 text-center">
          {/* Section label */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-sm font-medium tracking-[0.15em] uppercase text-white/40 mb-12"
          >
            The Vision
          </motion.p>

          {/* Pull-quote */}
          <motion.blockquote
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative"
          >
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-6xl text-white/10 font-serif leading-none select-none">
              &ldquo;
            </span>
            <p className="text-2xl md:text-3xl lg:text-4xl font-light text-white/80 leading-snug italic max-w-4xl mx-auto">
              Building a premium digital media company that delivers world-class
              production quality while creating conversations that educate,
              inspire, and entertain.
            </p>
          </motion.blockquote>

          {/* Philosophy Pillars */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-5%" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-20"
          >
            {pillars.map((p, i) => (
              <motion.div
                key={p.title}
                variants={fadeUp}
                custom={i}
                className="h-full"
              >
                <ArticleCard
                  headline={p.title}
                  excerpt={p.description}
                  tag={p.icon}
                  clampLines={4}
                />
              </motion.div>
            ))}
          </motion.div>
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
            <p className="text-sm font-medium tracking-[0.15em] uppercase text-white/40 mb-4">
              Get In Touch
            </p>
            <h2 className="text-display-lg text-white mb-4">
              Let&apos;s create something
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white/90 to-white/90">
                together.
              </span>
            </h2>
            <p className="text-white/40 text-lg mb-10 max-w-lg mx-auto">
              Have a project in mind or just want to say hello? Reach out
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
              className="cursor-can-hover glass-card-dark px-6 py-3 flex items-center gap-2.5 text-white/70 hover:text-white transition-colors"
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
              className="cursor-can-hover glass-card-dark px-6 py-3 flex items-center gap-2.5 text-white/70 hover:text-white transition-colors"
            >
              <YoutubeIcon className="w-4 h-4" />
              <span className="text-sm font-medium">YouTube</span>
            </motion.a>

            <motion.div variants={fadeUp} custom={2}>
              <MailDropdown email="verspektive@gmail.com">
                <div className="cursor-can-hover glass-card-dark px-6 py-3 flex items-center gap-2.5 text-white/70 hover:text-white transition-colors">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm font-medium">verspektive@gmail.com</span>
                </div>
              </MailDropdown>
            </motion.div>
          </motion.div>

          {/* Bottom attribution */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-xs text-white/20 mt-16"
          >
            © {new Date().getFullYear()} VerspeKtive. All rights reserved.
          </motion.p>
        </div>
      </section>
    </BeamsBackground>
  );
}
