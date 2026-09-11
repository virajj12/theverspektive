"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ScrollDrivenSlideIn({
  children,
  className,
  startOffset = "-10vw",
}: {
  children: React.ReactNode;
  className?: string;
  startOffset?: string | number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "center center"],
  });

  const x = useTransform(scrollYProgress, [0, 1], [startOffset, "0vw"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.div ref={ref} className={className} style={{ x, opacity }}>
      {children}
    </motion.div>
  );
}
