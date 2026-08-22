"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import clsx from "clsx";

interface MaskTextProps {
  text: string;
  className?: string;
}

export default function MaskText({ text, className }: MaskTextProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  const animation = {
    initial: { y: "100%" },
    enter: (i: number) => ({
      y: "0",
      transition: { duration: 0.75, ease: [0.33, 1, 0.68, 1] as const, delay: 0.05 * i },
    }),
  };

  const words = text.split(" ");

  return (
    <div ref={ref} className={clsx("flex flex-wrap gap-x-[0.25em]", className)}>
      {words.map((word, index) => (
        <div key={index} className="overflow-hidden inline-flex py-[0.1em]">
          <motion.span
            custom={index}
            variants={animation}
            initial="initial"
            animate={isInView ? "enter" : "initial"}
            className="inline-block"
          >
            {word}
          </motion.span>
        </div>
      ))}
    </div>
  );
}
