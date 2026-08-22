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

  const scale2 = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [5, 0]);

  return (
    <>
      <div ref={container} className="relative h-[200vh]">
        <motion.div
          style={{ scale: scale1 }}
          className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-background transition-colors duration-300"
        >
          {hero}
        </motion.div>
        <motion.div
          style={{ scale: scale2 }}
          className="relative h-screen w-full z-10 bg-background transition-colors duration-300 overflow-hidden shadow-2xl rounded-t-[2rem] md:rounded-t-[4rem]"
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
