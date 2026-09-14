"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useG3Scroll, MOTION_OK_ANY } from "./use-g3-scroll";
import { cn } from "@/lib/utils";

export type MaskAnimationType = "circle" | "vertical-blinds" | "diagonal" | "spotlight" | "curtain" | "shrink-reveal" | "none";

export function MaskedSection({
  children,
  type,
  className,
  innerClassName,
  id,
  disablePin,
  pinDistance = 1
}: {
  children: React.ReactNode;
  type: MaskAnimationType;
  className?: string;
  innerClassName?: string;
  id?: string;
  disablePin?: boolean;
  pinDistance?: number;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useG3Scroll(sectionRef, (mm) => {
    mm.add(MOTION_OK_ANY, () => {
      if (!sectionRef.current || !contentRef.current) return;

      // Pin this section when it has finished scrolling into view,
      // so the NEXT section can scroll up OVER it.
      // We don't use pinSpacing so the next section physically overlaps it.
      if (!disablePin) {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: () => {
            if (!sectionRef.current) return "top top";
            return sectionRef.current.offsetHeight > window.innerHeight
              ? "bottom bottom"
              : "top top";
          },
          end: () => "+=" + (window.innerHeight * pinDistance),
          pin: true,
          pinSpacing: false,
        });
      }

      // The mask animation for THIS section as it scrolls up over the PREVIOUS pinned section
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom", // Starts when this section enters the bottom of the screen
          end: "top top",      // Ends when this section reaches the top of the screen
          scrub: 1,
        },
      });

      switch (type) {
        case "circle":
          gsap.set(contentRef.current, { clipPath: "circle(0% at 50% 0%)" });
          tl.to(contentRef.current, { clipPath: "circle(150% at 50% 0%)", ease: "power1.inOut" });
          break;
        case "vertical-blinds":
          gsap.set(contentRef.current, { clipPath: "inset(0 50% 100% 50%)" });
          tl.to(contentRef.current, { clipPath: "inset(0 0% 0% 0%)", ease: "power2.inOut" });
          break;
        case "diagonal":
          gsap.set(contentRef.current, { clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" });
          tl.to(contentRef.current, { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", ease: "none" });
          break;
        case "spotlight":
          gsap.set(contentRef.current, { clipPath: "ellipse(0% 0% at 50% 0%)" });
          tl.to(contentRef.current, { clipPath: "ellipse(150% 150% at 50% 0%)", ease: "power1.inOut" });
          break;
        case "curtain":
          gsap.set(contentRef.current, { clipPath: "inset(0 0 100% 0)" });
          tl.to(contentRef.current, { clipPath: "inset(0 0 0 0)", ease: "power2.inOut" });
          break;
        case "shrink-reveal":
        case "none":
          break;
      }

      if (!disablePin && type === "shrink-reveal") {
        gsap.to(contentRef.current, {
          scale: 0.86,
          borderRadius: 28,
          transformOrigin: "top center",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: () => {
              if (!sectionRef.current) return "top top";
              return sectionRef.current.offsetHeight > window.innerHeight
                ? "bottom bottom"
                : "top top";
            },
            end: () => "+=" + (window.innerHeight * pinDistance),
            scrub: true,
          }
        });
      }
    });
  });

  return (
    <section ref={sectionRef} id={id} className={cn("relative w-full", className)}>
      <div ref={contentRef} className={cn("w-full min-h-screen will-change-transform", innerClassName || "bg-[var(--g3-black)]")}>
        {children}
      </div>
    </section>
  );
}
