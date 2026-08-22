"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronRight } from "lucide-react";
import clsx from "clsx";
import MaskText from "./MaskText";
import { DottedSurface } from "@/components/ui/dotted-surface";

// GSAP removed in favor of Framer Motion

export type HeroVariant = "dark" | "light";

interface HeroSectionProps {
  /** Small label text above the headline (e.g. "VerspeKtive Productions") */
  label?: string;
  /** Large display headline */
  headline: string;
  /** Sub-headline / tagline shown below the main headline */
  tagline?: string;
  /** Background image URL */
  image?: string;
  /** "dark" = white text on dark bg, "light" = dark text on light bg */
  variant?: HeroVariant;
  /** Primary CTA */
  ctaText?: string;
  ctaHref?: string;
  /** Secondary CTA */
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  /** Show the image as a contained product shot (like iPhone) vs full background */
  containedImage?: boolean;
  /** Custom height (default: 100vh for first hero, 580px for others) */
  fullHeight?: boolean;
  /** Unique ID for animations */
  id?: string;
}

export default function HeroSection({
  label,
  headline,
  tagline,
  image,
  variant = "dark",
  ctaText = "Learn more",
  ctaHref = "#",
  secondaryCtaText,
  secondaryCtaHref,
  containedImage = false,
  fullHeight = false,
  id = "hero",
}: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  const isDark = variant === "dark";

  return (
    <section
      ref={sectionRef}
      id={id}
      className={clsx(
        "relative w-full overflow-hidden",
        fullHeight ? "min-h-screen" : "min-h-[580px] lg:min-h-[680px]",
        isDark ? "section-dark" : "section-light"
      )}
      style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
    >
      {/* Background Image */}
      {image && !containedImage && (
        <div className="fixed top-[-10vh] left-0 w-full h-[120vh] z-0">
          <motion.div style={{ y }} className="relative w-full h-full">
            <Image
              src={image}
              alt={headline}
              fill
              sizes="100vw"
              className="object-cover"
              priority={fullHeight}
            />
            <div
              className={clsx(
                "absolute inset-0 pointer-events-none",
                isDark
                  ? "bg-gradient-to-b from-black/60 via-black/30 to-black/70"
                  : "bg-gradient-to-b from-white/60 via-white/20 to-white/70"
              )}
            />
          </motion.div>
        </div>
      )}

      {/* Dotted Surface Background */}
      <div className="absolute inset-0 z-[1] opacity-60 pointer-events-none">
        <DottedSurface themeOverride={variant} />
      </div>

      {/* Content */}
      <div
        className={clsx(
          "relative z-10 flex flex-col items-center text-center px-6",
          containedImage
            ? "pt-20 lg:pt-28"
            : "justify-center py-28 lg:py-36 min-h-[inherit]"
        )}
      >
        {/* Label */}
        {label && (
          <p
            className={clsx(
              "text-sm md:text-base font-medium tracking-wide mb-2",
              isDark ? "text-white/60" : "text-[#86868b]"
            )}
          >
            {label}
          </p>
        )}

        {/* Headline */}
        <MaskText
          text={headline}
          className={clsx(
            "text-display-lg max-w-4xl justify-center",
            isDark ? "text-white" : "text-[#1d1d1f]"
          )}
        />

        {/* Tagline */}
        {tagline && (
          <MaskText
            text={tagline}
            className={clsx(
              "text-headline max-w-2xl mt-3 justify-center",
              isDark ? "text-[#a1a1a6]" : "text-[#6e6e73]"
            )}
          />
        )}

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-5 mt-5"
        >
          {ctaText && (
            <Link href={ctaHref} className="cta-link">
              {ctaText} <ChevronRight />
            </Link>
          )}
          {secondaryCtaText && secondaryCtaHref && (
            <Link href={secondaryCtaHref} className="cta-link">
              {secondaryCtaText} <ChevronRight />
            </Link>
          )}
        </motion.div>

        {/* Contained Product Image */}
        {image && containedImage && (
          <div className="relative w-full max-w-3xl mt-10 mx-auto">
            <Image
              src={image}
              alt={headline}
              width={1200}
              height={800}
              className="w-full h-auto object-contain"
            />
          </div>
        )}
      </div>
    </section>
  );
}
