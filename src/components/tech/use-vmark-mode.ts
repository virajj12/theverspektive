"use client";

import { useSyncExternalStore } from "react";

export type VMarkMode = "loading" | "3d" | "fallback";

export interface VMarkCapability {
  mode: VMarkMode;
  reducedMotion: boolean;
}

/**
 * Decides whether this visitor gets the real 3D V-mark or the static fallback.
 *
 * Acceptance criterion: "3D hero should not block or significantly delay first
 * meaningful paint of the rest of the page." Two things enforce that — this
 * hook (which reports "loading" through hydration, so three.js is never
 * requested during the first paint) and the dynamic import in TechHero (which
 * keeps three.js out of the initial bundle entirely).
 *
 * Anything uncertain resolves to "fallback". A visitor seeing a crisp static
 * mark is a good outcome; a visitor watching a phone heat up is not.
 *
 * Implemented with useSyncExternalStore rather than useEffect + setState
 * because that is what this actually is: reading a value that lives outside
 * React and never changes for the life of the page.
 */

const SERVER_SNAPSHOT: VMarkCapability = { mode: "loading", reducedMotion: false };

let cached: VMarkCapability | null = null;

function detect(): VMarkCapability {
  if (cached) return cached;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // A narrow viewport is the phone case the spec calls out.
  const isNarrow = window.matchMedia("(max-width: 767px)").matches;

  // Respect an explicit data-saver request.
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  const saveData = conn?.saveData === true;

  // Low-memory devices struggle with a physical material plus several lights.
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  const lowMemory = typeof mem === "number" && mem < 4;

  if (isNarrow || saveData || lowMemory) {
    cached = { mode: "fallback", reducedMotion };
    return cached;
  }

  // Confirm WebGL actually works before importing three.js.
  let webgl = false;
  try {
    const canvas = document.createElement("canvas");
    webgl = Boolean(
      canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl")
    );
  } catch {
    webgl = false;
  }

  cached = { mode: webgl ? "3d" : "fallback", reducedMotion };
  return cached;
}

/** Capability is fixed once measured, so there is nothing to subscribe to. */
function subscribe() {
  return () => {};
}

export function useVMarkMode(): VMarkCapability {
  return useSyncExternalStore(subscribe, detect, () => SERVER_SNAPSHOT);
}
