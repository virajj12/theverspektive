"use client";

/**
 * Category filter (spec 4.2): "filter persists in URL query params
 * (shareable, SEO-friendly)".
 *
 * Uses router.replace with scroll:false so filtering doesn't stack history
 * entries — Back should leave the portfolio, not step through every filter
 * the visitor tried.
 *
 * The cascading pill pop-in from spec 3a is applied here, which is the exact
 * placement the spec suggests for it.
 */

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { G3_CATEGORIES } from "@/lib/g3-constants";

export default function CategoryFilter({ counts }: { counts: Record<string, number> }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const reduced = useReducedMotion();
  const active = params.get("category") || "";

  function select(category: string) {
    const next = new URLSearchParams(params.toString());
    if (category) next.set("category", category);
    else next.delete("category");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  const options = [{ value: "", label: "All" }, ...G3_CATEGORIES.map((c) => ({ value: c, label: c }))];

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt, i) => {
        const on = active === opt.value;
        const n = opt.value ? counts[opt.value] ?? 0 : Object.values(counts).reduce((a, b) => a + b, 0);
        return (
          <motion.button
            key={opt.value || "all"}
            onClick={() => select(opt.value)}
            aria-pressed={on}
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05, duration: 0.4, ease: [0.34, 1.4, 0.64, 1] }}
            /* min-h-11 = 44px, spec 6's minimum tap target. py-2 alone gave 37px. */
            className="flex min-h-11 items-center rounded-full border px-4 py-2 text-sm transition-colors"
            style={{
              borderColor: on ? "var(--g3-brass)" : "var(--g3-rule-faint)",
              background: on ? "var(--g3-brass)" : "transparent",
              color: on ? "#0a0908" : "var(--g3-ink-soft)",
            }}
          >
            {opt.label}
            <span className="ml-1.5 opacity-60">{n}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
