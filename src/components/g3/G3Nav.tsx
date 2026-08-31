"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";

const LINKS = [
  { href: "#projects", label: "Projects" },
  { href: "#services", label: "Services" },
  { href: "#process", label: "Process" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export default function G3Nav() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [activeHash, setActiveHash] = useState<string>("");

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHash(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-30% 0px -70% 0px" } // Adjust threshold for when sections become active
    );

    LINKS.forEach((l) => {
      const id = l.href.substring(1);
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  // Smooth scroll handler
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const id = href.substring(1);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        setOpen(false); // Close mobile menu if open
      }
    } else {
      setOpen(false);
    }
  };

  return (
    <>
      <motion.header
        className="g3-glass fixed left-1/2 bottom-24 md:bottom-6 z-[10000] flex -translate-x-1/2 items-center gap-2 rounded-full border px-2 py-2"
        style={{ borderColor: "var(--g3-rule-faint)" }}
        animate={{ width: "auto" }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <AnimatePresence initial={false}>
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-1 overflow-hidden whitespace-nowrap"
          >
              <Link
                href="/g3-builders"
                onClick={(e) => {
                  if (pathname === "/g3-builders") {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    setOpen(false);
                  }
                }}
                className="px-4 py-2 text-sm font-semibold tracking-tight"
                style={{ color: "var(--g3-ink)" }}
              >
                G3
              </Link>

              <nav className="hidden items-center md:flex">
                {LINKS.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={(e) => handleLinkClick(e, l.href)}
                    className="rounded-full px-4 py-2 text-sm transition-colors cursor-pointer"
                    style={{
                      color:
                        activeHash === l.href
                          ? "var(--g3-brass-light)"
                          : "var(--g3-ink-soft)",
                    }}
                  >
                    {l.label}
                  </a>
                ))}
              </nav>
            </motion.div>
        </AnimatePresence>

        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full md:hidden"
          style={{ background: "var(--g3-brass)", color: "#0a0908" }}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Desktop keeps a direct CTA in the pill. */}
        <a
          href="#contact"
          onClick={(e) => handleLinkClick(e, "#contact")}
          className="hidden shrink-0 rounded-full px-5 py-2 text-sm font-semibold md:block cursor-pointer"
          style={{ background: "var(--g3-brass)", color: "#0a0908" }}
        >
          Book a consultation
        </a>
      </motion.header>

      {/* Full-screen overlay (spec 6) */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] flex flex-col justify-center px-8 md:hidden"
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
                  <a
                    href={l.href}
                    onClick={(e) => handleLinkClick(e, l.href)}
                    className="block py-3 text-3xl font-semibold tracking-tight cursor-pointer"
                    style={{
                      fontFamily: "var(--g3-font-display)",
                      color:
                        activeHash === l.href
                          ? "var(--g3-brass-light)"
                          : "var(--g3-ink)",
                    }}
                  >
                    {l.label}
                  </a>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
