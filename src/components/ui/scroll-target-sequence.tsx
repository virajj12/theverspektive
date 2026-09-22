"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, useSpring } from "framer-motion";
import Image from "next/image";
import { TRACKS } from "../tech/tech-content";

// Component for the staggered blur reveal
const BlurRevealList = ({ lines, isActive }: { lines: { lead: string, body: string }[], isActive: boolean }) => {
  return (
    <div className="flex flex-col gap-3 md:gap-5 w-full mt-4 md:mt-6 w-full pb-0 md:pb-8">
      {lines.map((line, idx) => (
        <motion.div
          key={idx}
          initial={{ filter: "blur(10px)", opacity: 0, y: 10 }}
          animate={isActive ? { filter: "blur(0px)", opacity: 1, y: 0 } : { filter: "blur(10px)", opacity: 0, y: 10 }}
          transition={{ duration: 0.8, delay: isActive ? idx * 0.15 : 0, ease: "easeOut" }}
          className="flex flex-col"
        >
          <span className="text-sm md:text-lg font-bold text-white">{line.lead}</span>
          <span className="text-xs md:text-base text-white/70 leading-relaxed max-w-2xl">{line.body}</span>
        </motion.div>
      ))}
    </div>
  );
};

export function ScrollTargetSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const { scrollYProgress: entryProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const smoothEntry = useSpring(entryProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // State to trigger automatic animations
  const [businessActive, setBusinessActive] = useState(false);
  const [personalActive, setPersonalActive] = useState(false);
  const [isWiped, setIsWiped] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Business triggers early
    setBusinessActive(latest >= 0.02 && latest < 0.4);
    
    // Trigger the wipe transition independently based on a scroll threshold
    setIsWiped(latest >= 0.4);
    
    // Personal triggers after wipe is fully complete
    setPersonalActive(latest >= 0.55);
  });

  // Business Animations (uses smoothEntry so it moves while entering the screen!)
  // 0 -> entering bottom of screen, 0.25 -> hitting top of screen (locks in), 0.4 -> fully scrolled up
  const businessTextY = useTransform(smoothEntry, [0, 0.25, 0.4], ["30vh", "0vh", "-27vh"]);
  const businessDetailsY = useTransform(smoothEntry, [0, 0.25, 0.4], ["50vh", "20vh", "-19vh"]);
  const businessDetailsOpacity = useTransform(smoothProgress, [0, 0.1, 0.35, 1], [0, 1, 1, 0]); 

  // Personal Brands Animations (uses smoothProgress, starts moving BEFORE the wipe at 0.4!)
  // 0.3 -> starts moving, 0.4 -> wipe triggers (already moving!), 0.65 -> fully scrolled up
  const personalTextY = useTransform(smoothProgress, [0.3, 0.65], ["20vh", "-27vh"]);
  const personalDetailsY = useTransform(smoothProgress, [0.3, 0.65], ["40vh", "-19vh"]);
  const personalDetailsOpacity = useTransform(smoothProgress, [0.35, 0.45, 0.65, 1], [0, 1, 1, 1]);

  const businessData = TRACKS["business"];
  const personalData = TRACKS["personal"];

  return (
    <div ref={containerRef} id="audience" className="relative h-[400vh] w-full bg-transparent py-16 px-4 md:py-24 md:px-8">
      <div className="sticky top-16 md:top-24 h-[calc(100vh-5rem)] md:h-[calc(100vh-8rem)] w-full overflow-hidden flex flex-col items-center justify-center rounded-3xl border border-white/10 shadow-2xl bg-black">
        
        {/* Sticky Header */}
        <div className="absolute top-6 md:top-8 z-50 w-full text-center pointer-events-none">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/70 drop-shadow-md">
            Who we're building for
          </p>
        </div>

        {/* --- LAYER 1: BUSINESSES --- */}
        <motion.div 
          initial={false}
          animate={{ clipPath: isWiped ? "inset(0 100% 0 0)" : "inset(0 0% 0 0)" }}
          transition={{ type: "spring", stiffness: 40, damping: 15 }}
          className="absolute inset-0 w-full h-full"
        >
          <Image
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"
            alt="Business infrastructure"
            fill
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80" />
          
          {/* Gradient Blur for Text Readability */}
          <div 
            className="absolute inset-0 backdrop-blur-md pointer-events-none" 
            style={{ 
              WebkitMaskImage: 'linear-gradient(to top, black 0%, black 50%, transparent 75%)',
              maskImage: 'linear-gradient(to top, black 0%, black 50%, transparent 75%)'
            }} 
          />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.h2 
              style={{ y: businessTextY }} 
              className="text-center text-3xl sm:text-4xl md:text-7xl lg:text-8xl font-black uppercase text-white tracking-tighter drop-shadow-xl whitespace-nowrap"
            >
              {businessData.label}
            </motion.h2>

            <motion.div 
              style={{ y: businessDetailsY, opacity: businessDetailsOpacity }}
              className="absolute top-1/2 w-full max-w-4xl px-6 flex flex-col"
            >
              <p className="text-lg md:text-2xl font-light text-white/90 drop-shadow-md">
                {businessData.pitch}
              </p>
              <BlurRevealList lines={businessData.lines} isActive={businessActive} />
            </motion.div>
          </div>
        </motion.div>

        {/* --- LAYER 2: PERSONAL BRANDS --- */}
        <motion.div 
          initial={false}
          animate={{ clipPath: isWiped ? "inset(0 0% 0 0)" : "inset(0 0 0 100%)" }}
          transition={{ type: "spring", stiffness: 40, damping: 15 }}
          className="absolute inset-0 w-full h-full"
        >
          <Image
            src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=2042&auto=format&fit=crop"
            alt="Personal branding"
            fill
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80" />
          
          {/* Gradient Blur for Text Readability */}
          <div 
            className="absolute inset-0 backdrop-blur-md pointer-events-none" 
            style={{ 
              WebkitMaskImage: 'linear-gradient(to top, black 0%, black 50%, transparent 75%)',
              maskImage: 'linear-gradient(to top, black 0%, black 50%, transparent 75%)'
            }} 
          />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.h2 
              style={{ y: personalTextY }} 
              className="text-center text-3xl sm:text-4xl md:text-7xl lg:text-8xl font-black uppercase text-white tracking-tighter drop-shadow-xl whitespace-nowrap"
            >
              {personalData.label}
            </motion.h2>

            <motion.div 
              style={{ y: personalDetailsY, opacity: personalDetailsOpacity }}
              className="absolute top-1/2 w-full max-w-4xl px-6 flex flex-col"
            >
              <p className="text-lg md:text-2xl font-light text-white/90 drop-shadow-md">
                {personalData.pitch}
              </p>
              <BlurRevealList lines={personalData.lines} isActive={personalActive} />
            </motion.div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
