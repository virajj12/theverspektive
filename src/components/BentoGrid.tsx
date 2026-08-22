"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import clsx from "clsx";
import MaskText from "./MaskText";

// GSAP replaced by Framer Motion

export type BentoVariant = "dark" | "light";

interface BentoCardProps {
  /** Small label above the headline */
  label?: string;
  /** Card headline */
  headline: string;
  /** Optional description text */
  description?: string;
  /** Background image */
  image?: string;
  /** "dark" | "light" */
  variant?: BentoVariant;
  /** CTA link text */
  ctaText?: string;
  /** CTA link href */
  ctaHref?: string;
}

interface BentoGridProps {
  cards: BentoCardProps[];
  id?: string;
}

function BentoCard({
  label,
  headline,
  description,
  image,
  variant = "dark",
  ctaText = "Learn more",
  ctaHref = "#",
}: BentoCardProps) {
  const isDark = variant === "dark";

  return (
    <div
      className={clsx(
        "relative overflow-hidden rounded-[20px] lg:rounded-[28px] min-h-[480px] lg:min-h-[580px] flex flex-col shadow-[0_0px_30px_rgba(0,0,0,0.08)]",
        isDark ? "bg-[#1d1d1f]" : "bg-[#f5f5f7]"
      )}
    >
      {/* Content Area */}
      <div className="relative z-10 flex flex-col items-center text-center pt-12 lg:pt-14 px-6">
        {label && (
          <p
            className={clsx(
              "text-sm font-medium tracking-wide mb-1",
              isDark ? "text-[#a1a1a6]" : "text-[#6e6e73]"
            )}
          >
            {label}
          </p>
        )}
        <MaskText
          text={headline}
          className={clsx(
            "text-display-md max-w-md justify-center",
            isDark ? "text-white" : "text-[#1d1d1f]"
          )}
        />
        {description && (
          <MaskText
            text={description}
            className={clsx(
              "text-body-lg max-w-sm mt-2 justify-center",
              isDark ? "text-[#86868b]" : "text-[#6e6e73]"
            )}
          />
        )}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-3"
        >
          <Link href={ctaHref} className="cta-link text-base">
            {ctaText} <ChevronRight />
          </Link>
        </motion.div>
      </div>

      {/* Card Image */}
      {image && (
        <div className="relative flex-1 mt-6 overflow-hidden">
          <Image
            src={image}
            alt={headline}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-top"
          />
        </div>
      )}
    </div>
  );
}

export default function BentoGrid({ cards, id = "bento" }: BentoGridProps) {
  return (
    <section id={id} className="w-full section-light py-12 md:py-24 px-4 lg:px-8">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.1 }}
            className="bento-item"
          >
            <BentoCard {...card} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
