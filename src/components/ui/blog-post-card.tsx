"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { TiltCard } from "./be-ui-tilt-card";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, useEffect } from "react";

export interface ArticleCardProps {
  headline: string;
  excerpt: string;
  cover?: string;
  tag?: string;
  readingTime?: number; // in seconds
  writer?: string;
  publishedAt?: Date;
  clampLines?: number;
  href?: string;
  tooltipText?: string;
}

// Human-friendly read time: seconds -> "X min read"
export function formatReadTime(seconds: number): string {
  if (!seconds || seconds < 60) return "Less than 1 min read";
  const minutes = Math.ceil(seconds / 60);
  return `${minutes} min read`;
}

// Date -> "Aug 15, 2025" (localized but concise)
export function formatPostDate(date: Date): string {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  headline,
  excerpt,
  cover,
  readingTime,
  publishedAt,
  tag,
  writer,
  href,
  clampLines = 2,
  tooltipText,
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  };

  const hasMeta = tag || readingTime;
  const hasFooter = writer || publishedAt;

  const content = (
    <Card className="flex w-full h-full flex-col gap-3 overflow-hidden rounded-[24px] p-3 shadow-lg hover:border-white/30 transition-all duration-300 backdrop-blur-xl bg-black/40">
      {cover && (
        <CardHeader className="p-0">
          <div className="relative h-56 w-full glass-card-dark rounded-2xl overflow-hidden p-6 flex items-center justify-center">
            <Image
              src={cover}
              alt={headline}
              fill
              className="object-contain p-8 drop-shadow-2xl"
            />
            {/* Soft gradient overlay for better blending */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none mix-blend-overlay" />
          </div>
        </CardHeader>
      )}

      <CardContent className="flex-grow p-4">
        {hasMeta && (
          <div className="mb-4 flex items-center text-xs text-white/60">
            {tag && (
              <Badge variant="secondary" className="px-3 py-1 text-xs">
                {tag}
              </Badge>
            )}
            {tag && readingTime && <span className="mx-2">•</span>}
            {readingTime && <span>{formatReadTime(readingTime)}</span>}
          </div>
        )}

        <h2 className="mb-3 text-2xl font-semibold leading-tight text-white">
          {headline}
        </h2>

        <p
          className={cn("text-white/60 text-sm leading-relaxed", {
            "overflow-hidden text-ellipsis [-webkit-box-orient:vertical] [display:-webkit-box]":
              clampLines && clampLines > 0,
          })}
          style={{
            WebkitLineClamp: clampLines,
          }}
        >
          {excerpt}
        </p>
      </CardContent>

      {hasFooter && (
        <CardFooter className="flex items-center justify-between p-4 pt-0">
          {writer && (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Role</p>
              <p className="font-medium text-white/80 text-sm">{writer}</p>
            </div>
          )}
          {publishedAt && (
            <div className={writer ? "text-right" : ""}>
              <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Established</p>
              <p className="font-medium text-white/80 text-sm">
                {formatPostDate(publishedAt)}
              </p>
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );

  if (href) {
    return (
      <TiltCard className="block h-full rounded-[24px]">
        <a
          href={href}
          className="block h-full relative group cursor-none"
          onMouseMove={handleMouseMove}
        >
          {content}
          {tooltipText && (
            <motion.div
              style={{ x: smoothX, y: smoothY }}
              className="absolute top-17 left-17 z-100 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <div className="bg-black/90 backdrop-blur-md text-white text-xs px-4 py-2 rounded-full border border-white/20 shadow-2xl tracking-wide whitespace-nowrap -translate-x-1/2 -translate-y-full mt-[-10px]">
                {tooltipText}
              </div>
            </motion.div>
          )}
        </a>
      </TiltCard>
    );
  }

  return (
    <TiltCard className="block h-full rounded-[24px]">
      {content}
    </TiltCard>
  );
};
