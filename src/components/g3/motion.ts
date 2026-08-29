/**
 * Shared motion constants. Deliberately NOT a "use client" module.
 *
 * revealDelay is a plain function called during render by server components
 * to stagger their children. Exporting it from Reveal.tsx (which is
 * "use client") made it a client reference, and calling one of those from the
 * server throws "Attempted to call revealDelay() from the server".
 */

/** Strong ease-out — the power3/power4 feel spec 3a asks for. Never bouncy. */
export const G3_EASE = [0.16, 1, 0.3, 1] as const;

/** Per-item stagger for lists, capped so long grids don't crawl. */
export function revealDelay(index: number, step = 0.08) {
  return Math.min(index * step, 0.5);
}
