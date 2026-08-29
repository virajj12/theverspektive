"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";

export default function ScrollToTop() {
  const pathname = usePathname();
  const [scrollState, setScrollState] = useState<"up" | "down" | "none">("down");

  useEffect(() => {
    const toggleVisibility = () => {
      // Show scroll down when near top, show scroll up when scrolled down
      if (window.scrollY < 100) {
        setScrollState("down");
      } else if (window.scrollY > 300) {
        setScrollState("up");
      } else {
        setScrollState("none");
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    toggleVisibility();
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const handleClick = () => {
    if (scrollState === "up") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else if (scrollState === "down") {
      window.scrollBy({
        top: window.innerHeight * 0.8,
        behavior: "smooth",
      });
    }
  };


  // G3 Builders is a standalone identity with its own chrome, and on mobile
  // this control sits directly above G3's sticky CTA bar. Stand down there —
  // same guard as navbar.tsx and footer.tsx. Must be after all hooks.
  if (pathname.startsWith('/g3-builders')) {
    return null;
  }
  return (
    <AnimatePresence mode="wait">
      {scrollState !== "none" && (
        <motion.button
          key={scrollState}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          transition={{ duration: 0.2 }}
          onClick={handleClick}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 md:bottom-6 md:right-6 md:left-auto md:translate-x-0 z-40 flex items-center justify-center h-12 w-12 bg-black/60 border border-white/10 rounded-full backdrop-blur-md text-white/60 hover:text-white hover:bg-white/10 transition-colors shadow-lg"
          aria-label={scrollState === "up" ? "Scroll to top" : "Scroll down"}
        >
          {scrollState === "up" ? <ChevronUp size={28} /> : <ChevronDown size={28} />}
        </motion.button>
      )}
    </AnimatePresence>
  );
}
