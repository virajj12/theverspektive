"use client";

/**
 * Shared GSAP/ScrollTrigger setup for the G3 signature sequences (spec 3a).
 *
 * A note on "pinning": these sequences hold an element still while scroll
 * drives a transform. That is done with CSS `position: sticky` for the holding
 * part and GSAP only for the scrubbed transform — rather than ScrollTrigger's
 * `pin: true`.
 *
 * ScrollTrigger's pin works by injecting a pin-spacer element and rewriting
 * layout, which on iOS Safari fights the address-bar resize and is the usual
 * source of the jank the spec warns about ("gets janky on mid-range phones and
 * undermines the premium feel"). Sticky is native, compositor-friendly, and
 * survives viewport resize for free. The visual result is what the spec
 * describes; the mechanism is just the one that holds up on a phone.
 *
 * Every sequence here is registered inside a gsap.matchMedia so it only exists
 * where it should, and reverts cleanly. Under prefers-reduced-motion nothing
 * is registered at all — spec 3a: "pinned/scrubbed sequences degrade to simple
 * fade-ins, parallax and rotation effects are disabled entirely."
 */

import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Media query for "animate this properly" — desktop-and-tablet, motion allowed. */
export const MOTION_OK = "(min-width: 768px) and (prefers-reduced-motion: no-preference)";

/** Motion allowed at any width — for sequences that work on phones too. */
export const MOTION_OK_ANY = "(prefers-reduced-motion: no-preference)";

/**
 * Registers a scoped GSAP context against a root ref.
 *
 * `build` receives the matchMedia instance; add conditions to it rather than
 * checking widths by hand, so GSAP handles teardown on resize.
 */
export function useG3Scroll(
  root: RefObject<HTMLElement | null>,
  build: (mm: gsap.MatchMedia) => void,
  deps: unknown[] = []
) {
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      build(mm);
    }, root);

    // Late-loading images change page height and leave triggers measuring
    // stale positions; one refresh on window load fixes the common case.
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      window.removeEventListener("load", onLoad);
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
