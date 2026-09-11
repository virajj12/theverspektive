"use client";

import { useScroll, useTransform, motion } from "framer-motion";
import { useRef, ReactNode } from "react";

export function PerspectiveHero({
  hero,
  cover,
  children,
}: {
  hero: ReactNode;
  cover: ReactNode;
  children?: ReactNode;
}) {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  const scale1 = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, -5]);

  return (
    <>
      <div ref={container} className="relative h-[200vh]" style={{ perspective: "1000px" }}>
        <motion.div
          style={{ scale: scale1, rotateX: rotate1, transformOrigin: "top center" }}
          className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-background transition-colors duration-300 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
        >
          {hero}
        </motion.div>
        <motion.div
          className="relative h-screen w-full z-10 bg-background transition-colors duration-300 overflow-hidden shadow-[0_-20px_50px_rgba(0,0,0,0.3)] rounded-t-[2rem] md:rounded-t-[4rem]"
        >
          {cover}
        </motion.div>
      </div>
      {children && (
        <div className="relative z-10 bg-background transition-colors duration-300 w-full min-h-screen">
          {children}
        </div>
      )}
    </>
  );
}
