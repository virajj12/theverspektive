"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useG3Scroll, MOTION_OK_ANY } from "./use-g3-scroll";
import { useReducedMotion } from "framer-motion";

export default function ImmersiveTransition() {
  const rootRef = useRef<HTMLElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const reduced = useReducedMotion();

  useG3Scroll(rootRef, (mm) => {
    mm.add(MOTION_OK_ANY, () => {
      if (!rootRef.current || !imageWrapperRef.current || !imageRef.current || reduced) return;

      // Create a timeline that pins the root, then expands the image wrapper to fill the screen,
      // and adds a subtle parallax scale to the image itself.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top", // Pin when it reaches the top
          end: "+=200%", // Pin for 200vh
          pin: true,
          pinSpacing: false, // We will manually space the next section
          scrub: true,
        },
      });

      // Expand the wrapper from a constrained size (e.g., 80vw) to full 100vw/100vh
      tl.to(imageWrapperRef.current, {
        width: "100vw",
        height: "100vh",
        borderRadius: "0px",
        ease: "none",
        duration: 0.5, // Completes halfway through the pin (after 100vh of scroll)
      }, 0);

      // Parallax scale the image slightly as it expands
      tl.to(imageRef.current, {
        scale: 1.05,
        ease: "none",
        duration: 0.5,
      }, 0);
    });
  });

  return (
    <section 
      ref={rootRef} 
      className="relative flex items-center justify-center w-full overflow-hidden z-0"
      style={{ height: "100vh", backgroundColor: "var(--g3-black)" }}
    >
      <div 
        ref={imageWrapperRef} 
        className="relative overflow-hidden will-change-transform"
        style={{ 
          width: reduced ? "100vw" : "80vw", 
          height: reduced ? "100vh" : "75vh", 
          borderRadius: reduced ? "0px" : "12px" 
        }}
      >
        <Image
          ref={imageRef}
          src="https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&w=2000&q=80"
          alt="Immersive architectural transition"
          fill
          className="object-cover will-change-transform"
          style={{ scale: reduced ? 1 : 1.2 }}
        />
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.4))" }} />
      </div>
    </section>
  );
}
