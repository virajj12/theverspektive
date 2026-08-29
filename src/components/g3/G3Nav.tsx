"use client";

/**
 * G3 navigation — warm-tinted glass (spec 3), full-screen overlay on mobile
 * with 44px+ tap targets and no nested dropdowns (spec 6).
 *
 * The scroll-aware collapse from spec 3a is included here rather than held
 * for the animation phase: it is structural to the nav, and the spec calls it
 * out as a good fit for the mobile-first priority — it keeps the sticky CTA
 * area uncluttered while staying one tap from anywhere.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";

const LINKS = [
  { href: "/g3-builders/projects", label: "Projects" },
  { href: "/g3-builders/services", label: "Services" },
  { href: "/g3-builders/process", label: "Process" },
  { href: "/g3-builders/about", label: "About" },
  { href: "/g3-builders/contact", label: "Contact" },
];

export default function G3Nav() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const reduced = useReducedMotion();

  /**
   * The overlay is open only while the route it was opened on is still the
   * current one, so navigating closes it for free. Deriving this beats an
   * effect that watches `pathname` and calls setState — same behaviour, no
   * extra render pass, and nothing to keep in sync.
   */
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const open = openedAt === pathname;
  const setOpen = (next: boolean) => setOpenedAt(next ? pathname : null);

  // Collapse on scroll-down, expand on scroll-up.
  useEffect(() => {
    if (reduced) return;
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) > 8) {
        setCollapsed(y > last && y > 120);
        last = y;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduced]);

  // Stop the page scrolling behind the overlay (syncing an external system,
  // which is what effects are actually for).
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <motion.header
        className="g3-glass fixed left-1/2 top-4 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border px-2 py-2"
        style={{ borderColor: "var(--g3-rule-faint)" }}
        animate={{ width: collapsed && !open ? 56 : "auto" }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <AnimatePresence initial={false}>
          {(!collapsed || open) && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-1 overflow-hidden whitespace-nowrap"
            >
              <Link
                href="/g3-builders"
                className="px-4 py-2 text-sm font-semibold tracking-tight"
                style={{ color: "var(--g3-ink)" }}
              >
                G3
              </Link>

              <nav className="hidden items-center md:flex">
                {LINKS.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="rounded-full px-4 py-2 text-sm transition-colors"
                    style={{ color: pathname === l.href ? "var(--g3-brass-light)" : "var(--g3-ink-soft)" }}
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full md:hidden"
          style={{ background: "var(--g3-brass)", color: "#0a0908" }}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Desktop keeps a direct CTA in the pill. */}
        <Link
          href="/g3-builders/contact"
          className="hidden shrink-0 rounded-full px-5 py-2 text-sm font-semibold md:block"
          style={{ background: "var(--g3-brass)", color: "#0a0908" }}
        >
          Book a consultation
        </Link>
      </motion.header>

      {/* Full-screen overlay (spec 6) */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col justify-center px-8 md:hidden"
            style={{ background: "var(--g3-black)" }}
          >
            <nav className="flex flex-col gap-2">
              {LINKS.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={l.href}
                    className="block py-3 text-3xl font-semibold tracking-tight"
                    style={{
                      fontFamily: "var(--g3-font-display)",
                      color: pathname === l.href ? "var(--g3-brass-light)" : "var(--g3-ink)",
                    }}
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
