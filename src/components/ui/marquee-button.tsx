"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface MarqueeButtonProps {
  onClick?: () => void;
  defaultText?: string;
  hoverText?: string;
}

export default function MarqueeButton({
  onClick,
  defaultText = "Want to build something?",
  hoverText = "Tell us what you want to build →",
}: MarqueeButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    // Basic check for touch device capability
    const isTouch = window.matchMedia("(hover: none)").matches || window.innerWidth < 768;
    
    if (isTouch) {
      // Trigger the hover state manually on touch
      setIsHovered(true);
      // Wait for the 500ms transition to finish before executing onClick
      setTimeout(() => {
        if (onClick) onClick();
        // Reset hover state after firing (wait another 200ms for safety)
        setTimeout(() => setIsHovered(false), 200);
      }, 500); 
    } else {
      if (onClick) onClick();
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes custom-marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-custom-marquee {
          animation: custom-marquee 8s linear infinite;
        }
      `}} />
      
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          group relative overflow-hidden rounded-full font-medium text-base md:text-lg cursor-pointer
          transition-colors duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]
          ${isHovered ? "bg-black text-white" : "bg-white text-black"}
        `}
      >
        {/* Invisible spacer to maintain stable button dimensions based on the longest text */}
        <div className="invisible px-10 py-4 flex items-center justify-center whitespace-nowrap">
          {hoverText.length > defaultText.length ? hoverText : defaultText}
        </div>

        {/* Absolute container for the animated layers */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          
          {/* Default Text Layer (Marquee) */}
          <motion.div
            initial={false}
            animate={{ 
              y: isHovered ? "-120%" : "0%", 
              opacity: isHovered ? 0 : 1,
              scale: isHovered ? 0.95 : 1
            }}
            transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
            className="absolute inset-0 flex items-center justify-center whitespace-nowrap"
          >
            <span className="px-8">{defaultText}</span>
          </motion.div>

          {/* Hover Text Layer */}
          <motion.div
            initial={false}
            animate={{ 
              y: isHovered ? "0%" : "120%", 
              opacity: isHovered ? 1 : 0,
              scale: isHovered ? 1 : 0.95
            }}
            transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
            className="absolute inset-0 flex items-center justify-center whitespace-nowrap"
          >
            <span>{hoverText}</span>
          </motion.div>
          
        </div>
      </button>
    </>
  );
}
