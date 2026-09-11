"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import type { G3Project } from "@/lib/g3-data";
import ProjectCard from "./ProjectCard";
import { Reveal, RevealImage } from "./Reveal";

interface EditorialPortfolioProps {
  projects: G3Project[];
  children?: React.ReactNode; // For the Title and CategoryFilter
}

type Position = {
  top: string;
  left?: string;
  right?: string;
  width: string;
  zIndex: number;
  yRange: [string, string];
  xRange?: [string, string];
};

// Hardcoded, intentionally art-directed positions for up to 10 projects.
const POSITIONS: Position[] = [
  // 1: Large image upper-left
  { top: "5%", left: "5%", width: "32%", zIndex: 10, yRange: ["-10%", "15%"], xRange: ["-2%", "2%"] },
  // 2: Medium image upper-right
  { top: "12%", right: "8%", width: "24%", zIndex: 11, yRange: ["-25%", "5%"] },
  // 3: Middle-left
  { top: "35%", left: "8%", width: "26%", zIndex: 12, yRange: ["-5%", "25%"] },
  // 4: Middle-right
  { top: "45%", right: "12%", width: "28%", zIndex: 13, yRange: ["-30%", "10%"], xRange: ["2%", "-2%"] },
  // 5: Lower-left
  { top: "65%", left: "12%", width: "22%", zIndex: 14, yRange: ["-20%", "20%"] },
  // 6: Lower-right
  { top: "75%", right: "8%", width: "30%", zIndex: 15, yRange: ["-10%", "30%"] },
  // 7: Far-left partial
  { top: "25%", left: "-4%", width: "16%", zIndex: 5, yRange: ["5%", "35%"] },
  // 8: Far-right partial
  { top: "60%", right: "-2%", width: "18%", zIndex: 6, yRange: ["-35%", "5%"] },
  // 9: Top-center-ish
  { top: "2%", left: "45%", width: "14%", zIndex: 4, yRange: ["15%", "-15%"] },
  // 10: Bottom-center-ish
  { top: "85%", left: "42%", width: "22%", zIndex: 7, yRange: ["-15%", "15%"] },
];

function ParallaxImage({ project, pos }: { project: G3Project; pos: Position }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], pos.yRange);
  const x = useTransform(scrollYProgress, [0, 1], pos.xRange || ["0%", "0%"]);

  return (
    <motion.div
      ref={ref}
      className="absolute will-change-transform group"
      style={{
        top: pos.top,
        left: pos.left,
        right: pos.right,
        width: pos.width,
        zIndex: pos.zIndex,
        y,
        x,
      }}
    >
      <ProjectCard project={project} />
    </motion.div>
  );
}

export default function EditorialPortfolio({ projects, children }: EditorialPortfolioProps) {
  const reduced = useReducedMotion();

  // If reduced motion is explicitly preferred, or if we want a safe mobile fallback,
  // we render a standard grid. We use CSS media queries to handle the desktop vs mobile switch natively.
  return (
    <div className="w-full">
      
      {/* MOBILE / REDUCED MOTION FALLBACK (Normal Grid) */}
      <div className="md:hidden grid gap-5 sm:grid-cols-2">
        <div className="mb-8">{children}</div>
        {projects.map((p, i) => (
          <RevealImage key={p.id} delay={i * 0.05}>
            <ProjectCard project={p} priority={i < 3} />
          </RevealImage>
        ))}
      </div>

      {/* DESKTOP ART-DIRECTED EDITORIAL LAYOUT */}
      <div className="hidden md:block relative w-full h-[180vh] overflow-hidden">
        
        {/* Center Title / Filters (Sticky in the middle of the viewport) */}
        <div className="absolute inset-0 pointer-events-none z-20 flex flex-col items-center pt-[30vh]">
          <div className="pointer-events-auto">
            {children}
          </div>
        </div>

        {/* Scattered Parallax Images */}
        {projects.slice(0, POSITIONS.length).map((p, i) => (
          <ParallaxImage key={p.id} project={p} pos={POSITIONS[i]} />
        ))}
        
      </div>
    </div>
  );
}
