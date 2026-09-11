"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import GlassSurface from "@/components/ui/GlassSurface";

const LINKS = [
  { href: "#services", label: "Services" },
  { href: "#projects", label: "Projects" },
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
      { rootMargin: "-40% 0px -40% 0px" } // 20% slice in the middle of the screen
    );

    const observeLinks = () => {
      LINKS.forEach((l) => {
        const id = l.href.substring(1);
        const element = document.getElementById(id);
        if (element) observer.observe(element);
      });
    };

    // Initial observation
    observeLinks();
    
    // Retry observation after mount in case of Next.js server components streaming
    const t1 = setTimeout(observeLinks, 500);
    const t2 = setTimeout(observeLinks, 2000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      observer.disconnect();
    };
  }, [pathname]);

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
        className="fixed left-1/2 bottom-24 md:bottom-6 z-[10000] flex -translate-x-1/2 items-center rounded-full"
        animate={{ width: "auto" }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <GlassSurface
          width="max-content"
          height="max-content"
          borderRadius={9999}
          className="p-2"
        >
          <div className="flex items-center gap-2">
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
                  className="px-4 py-2 text-sm font-semibold tracking-tight text-foreground transition-colors duration-300"
                >
                  G3
                </Link>

                <nav className="hidden items-center md:flex">
                  {LINKS.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      onClick={(e) => handleLinkClick(e, l.href)}
                      className={`rounded-full px-4 py-2 text-sm transition-colors duration-300 cursor-pointer ${
                        activeHash === l.href
                          ? "text-[var(--g3-brass)]"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
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
          </div>
        </GlassSurface>
      </motion.header>

      {/* Mobile Menu Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* 75% Bottom Drawer overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            className="fixed bottom-0 left-0 right-0 h-[75vh] z-[9999] flex flex-col justify-start pt-12 px-8 md:hidden border-t border-white/10 shadow-2xl rounded-t-3xl"
            style={{ background: "var(--g3-black)" }}
          >
            <nav className="flex flex-col gap-4">
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
