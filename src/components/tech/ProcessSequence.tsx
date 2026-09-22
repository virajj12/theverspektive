"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent, useTransform, useMotionTemplate } from "framer-motion";
import { PROCESS } from "./tech-content";

function StageTitle({ title, isActive }: { title: string, isActive: boolean }) {
  return (
    <motion.div 
      className="shrink-0 tech-stage-title-width whitespace-normal pr-4 md:pr-8" 
      animate={{ opacity: isActive ? 1 : 0.2 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="text-4xl md:text-7xl lg:text-8xl font-semibold tracking-tight leading-none block text-white">
        {title}
      </span>
    </motion.div>
  );
}

function StageNumber({ step, isActive }: { step: string, isActive: boolean }) {
  return (
    <motion.span 
      className="absolute right-full mr-4 md:mr-6 top-1/2 -translate-y-1/2 text-sm md:text-base tracking-widest text-accent font-mono" 
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 0.6 }}
    >
      {step}
    </motion.span>
  );
}

function StageContent({ body, isActive }: { body: string, isActive: boolean }) {
  return (
    <motion.div 
      className="absolute top-0 left-0 w-full pointer-events-none" 
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-lg md:text-xl font-light leading-relaxed mb-4 md:mb-6 text-white/70 min-h-[80px]">
        {body}
      </div>
    </motion.div>
  );
}

export default function ProcessSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const { scrollYProgress: totalProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const blurValue = useTransform(totalProgress, [0, 0.2, 0.8, 1], [0, 12, 12, 0]);
  const bgOpacity = useTransform(totalProgress, [0, 0.2, 0.8, 1], [0, 0.1, 0.1, 0]);
  
  const backdropFilter = useMotionTemplate`blur(${blurValue}px)`;
  const backgroundColor = useMotionTemplate`rgba(0,0,0,${bgOpacity})`;

  const [activeIndex, setActiveIndex] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // 4 stages, so we divide the progress evenly.
    const stages = PROCESS.length;
    const progressPerStage = 1 / stages;
    const index = Math.floor(latest / progressPerStage);
    const safeIndex = Math.max(0, Math.min(stages - 1, index));
    if (activeIndex !== safeIndex) setActiveIndex(safeIndex);
  });

  return (
    <div 
      id="process"
      ref={containerRef} 
      className="relative w-full transition-colors duration-500" 
      style={{ height: "400vh" }} 
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center">
        <motion.div 
          className="absolute inset-0 pointer-events-none -z-10"
          style={{
            backdropFilter,
            backgroundColor,
            WebkitBackdropFilter: backdropFilter,
            maskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)"
          }}
        />
        
        {/* Intro text */}
        <div className="absolute top-24 md:top-32 left-6 md:left-[10vw]">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-accent">
            How it goes
          </p>
          <h2 className="text-display-sm md:text-display-md max-w-2xl text-white">
            Four steps, and you can see the work at every one.
          </h2>
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          .tech-stage-slider { --stage-offset: 15vw; --stage-width: 80vw; }
          .tech-stage-title-width { width: 80vw; }
          
          @media (min-width: 768px) {
            .tech-stage-slider { --stage-offset: 10vw; --stage-width: 50vw; }
            .tech-stage-title-width { width: 50vw; }
          }
        `}} />

        <div className="relative w-full h-[300px] md:h-[400px] z-20 mt-20">
          
          {/* TOP HALF: Titles (Above the line) */}
          <div className="absolute bottom-[50%] left-0 w-full pb-4 md:pb-8">
            <motion.div 
              className="flex items-end whitespace-nowrap w-max tech-stage-slider" 
              animate={{ x: `calc(var(--stage-offset) - calc(var(--stage-width) * ${activeIndex}))` }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {PROCESS.map((stage, i) => (
                <StageTitle key={i} title={stage.title} isActive={activeIndex === i} />
              ))}
            </motion.div>
          </div>

          {/* THE LINE & NUMBER (Center) */}
          <div className="absolute top-[50%] left-[15vw] md:left-[10vw] right-[5vw] md:right-[10vw] h-px bg-white/15">
            <div className="relative w-full h-full">
              {PROCESS.map((stage, i) => (
                <StageNumber key={i} step={stage.step} isActive={activeIndex === i} />
              ))}
            </div>
          </div>

          {/* BOTTOM HALF: Descriptions (Below the line) */}
          <div className="absolute top-[50%] left-[15vw] md:left-[10vw] right-[5vw] md:right-[10vw] w-auto md:w-[35vw] max-w-[500px] pt-6 md:pt-10">
            <div className="relative w-full h-full">
              {PROCESS.map((s, i) => (
                <StageContent key={i} body={s.body} isActive={activeIndex === i} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
