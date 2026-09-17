"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  type MotionValue,
} from "framer-motion";

/**
 * BlurReveal — scroll-driven, letter-by-letter blur-to-sharp text reveal.
 */

function RevealChar({
  char,
  progress,
  range,
  blurAmount,
}: {
  char: string;
  progress: MotionValue<number>;
  range: [number, number];
  blurAmount: number;
}) {
  const opacity = useTransform(progress, range, [0, 1]);
  const blur = useTransform(progress, range, [blurAmount, 0]);
  const filter = useMotionTemplate`blur(${blur}px)`;
  // A tiny slide effect for individual letters
  const x = useTransform(progress, range, [4, 0]);
  // A tiny zoom-out effect
  const scale = useTransform(progress, range, [1.1, 1]);

  return (
    <span
      style={{
        display: "inline-block",
        padding: "0.4em",
        margin: "-0.4em",
        verticalAlign: "top",
      }}
    >
      <motion.span
        style={{
          opacity,
          filter,
          x,
          scale,
          display: "inline-block",
          willChange: "opacity, filter, transform",
        }}
      >
        {char}
      </motion.span>
    </span>
  );
}

/* ── Public API ── */

interface BlurRevealProps {
  /** The text to reveal letter-by-letter. Use `\n` for line breaks. Mutually exclusive with textBlocks. */
  text?: string;
  /** Array of text blocks with individual classes, animating sequentially as one unit. */
  textBlocks?: { text: string; className?: string }[];
  /** Wrapper element tag (default "div") */
  as?: "h1" | "h2" | "h3" | "p" | "div" | "blockquote" | "span";
  /** Class names applied to each rendered line wrapper (only used if `text` is provided) */
  lineClassName?: string;
  /** Class names applied to the outermost container */
  className?: string;
  /** Peak blur in px (default 12) */
  blurAmount?: number;
  /**
   * Scroll offset for the animation range.
   * Defaults to `["start 0.85", "start 0.3"]`.
   */
  scrollRange?: [string, string];
}

export function BlurReveal({
  text,
  textBlocks,
  as: Tag = "div",
  lineClassName,
  className = "",
  blurAmount = 12,
  scrollRange = ["start 0.85", "start 0.3"],
}: BlurRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: scrollRange as any,
  });

  // Normalize input into blocks
  const blocks = textBlocks || (text ? [{ text, className: lineClassName }] : []);
  
  let globalLetterCount = 0;

  // Parse blocks -> lines -> words -> letters
  const parsedBlocks = blocks.map((block) => {
    const lines = block.text.split("\n");
    const parsedLines = lines.map((line) => {
      const words = line.split(/\s+/).filter(Boolean);
      const parsedWords = words.map((word) => {
        const letters = word.split("").map((char) => {
          const letterObj = { char, globalIdx: globalLetterCount };
          globalLetterCount++;
          return letterObj;
        });
        return { word, letters };
      });
      return { words: parsedWords };
    });
    return { ...block, lines: parsedLines };
  });

  const totalLetters = globalLetterCount;
  // Make the transition window wide enough to cover ~7 letters at a time
  const transitionWidth = Math.min(1, 7 / Math.max(1, totalLetters));

  return (
    <Tag ref={containerRef as any} className={className}>
      {parsedBlocks.map((block, blockIdx) => (
        <div key={blockIdx} className={block.className} style={{ marginBottom: blockIdx < parsedBlocks.length - 1 ? "1.25rem" : 0 }}>
          {block.lines.map((line, lineIdx) => (
            <span
              key={lineIdx}
              style={{ display: "block" }}
            >
              {line.words.map((w, wordIdx) => (
                <span key={wordIdx} style={{ display: "inline-block", whiteSpace: "nowrap" }}>
                  {w.letters.map((l, letterIdx) => {
                    const start = (l.globalIdx / Math.max(1, totalLetters - 1)) * (1 - transitionWidth);
                    const end = start + transitionWidth;

                    return (
                      <RevealChar
                        key={letterIdx}
                        char={l.char}
                        progress={scrollYProgress}
                        range={[start, end]}
                        blurAmount={blurAmount}
                      />
                    );
                  })}
                  {/* Space between words */}
                  {wordIdx < line.words.length - 1 ? (
                    <span style={{ display: "inline-block" }}>&nbsp;</span>
                  ) : null}
                </span>
              ))}
            </span>
          ))}
        </div>
      ))}
    </Tag>
  );
}
