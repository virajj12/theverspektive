"use client";
// Force cache invalidation

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User } from "lucide-react";
import clsx from "clsx";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

const navItems = [
  { name: "G3 Builders & Architecture", href: "/g3-builders" },
  { name: "Productions", href: "/productions" },
  { name: "Tech", href: "/tech" },
  { name: "Founder", href: "/founder" },
  { name: "Store", href: "/store" },
];

const megaMenus: Record<string, { title: string, links: { name: string, href: string }[] }[]> = {
  "G3 Builders & Architecture": [
    {
      title: "Social",
      links: [{ name: "Instagram", href: "https://instagram.com/projects_by_g3" }]
    }
  ],
  "Productions": [
    {
      title: "Explore",
      links: [
        { name: "Talk It Out", href: "/productions/talk-it-out" },
        { name: "Taste It Out", href: "/productions/taste-it-out" },
        { name: "Verspektive Studios", href: "/productions/verspektive-studios" }
      ]
    },
    {
      title: "Quick Links",
      links: [
        { name: "About", href: "/productions#about" },
        { name: "Contact Us", href: "/productions#contact" }
      ]
    },
    {
      title: "Social",
      links: [
        { name: "YouTube", href: "https://www.youtube.com/@verspektive_productions/" },
        { name: "Instagram", href: "https://www.instagram.com/verspektive_productions" }
      ]
    }
  ],
  "Tech": [
    {
      title: "Explore",
      links: [
        { name: "For Businesses", href: "/tech#audience" },
        { name: "For Personal Brands", href: "/tech#audience" },
        { name: "How We Work", href: "/tech#process" }
      ]
    },
    {
      title: "Quick Links",
      links: [
        { name: "Case Study", href: "/tech#case-study" },
        { name: "Start a Project", href: "/tech#contact" }
      ]
    }
  ],
  "Founder": [
    {
      title: "Explore",
      links: [
        { name: "About Founder", href: "/founder" },
        { name: "Our Team", href: "/founder" }
      ]
    }
  ],
  "Store": [
    {
      title: "Quick Links",
      links: [
        { name: "Browse Products", href: "/store" }
      ]
    }
  ]
};

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  const handleMouseEnter = (name: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMegaMenu(name);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setActiveMegaMenu(null);
    }, 150);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveMegaMenu(null);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Hide navbar on admin pages (must be after all hooks)
  if (pathname.startsWith('/admin')) {
    return null;
  }

  // Define pages with black hero sections
  const isProductionsPage = pathname.startsWith("/productions");
  const isBlackHeroPage = pathname === "/error" || pathname.startsWith("/account") || pathname === "/founder" || pathname === "/tech";

  // Enforce theme isolation: remove .dark class when not on productions page
  useEffect(() => {
    if (!isProductionsPage) {
      document.documentElement.classList.remove("dark");
    } else {
      const savedTheme = localStorage.getItem("theme");
      // Default to dark mode for productions unless explicitly set to light
      if (savedTheme !== "light") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [isProductionsPage]);

  // Toggle dark scrollbar class on HTML element
  useEffect(() => {
    if (isBlackHeroPage) {
      document.documentElement.classList.add("dark-page-scrollbar");
    } else {
      document.documentElement.classList.remove("dark-page-scrollbar");
    }
  }, [isBlackHeroPage]);

  return (
    <>
      <header
        onMouseLeave={handleMouseLeave}
        className={clsx(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
          isBlackHeroPage
            ? isScrolled ? "bg-black/90 backdrop-blur-xl border-b border-white/[0.04]" : "bg-black"
            : isProductionsPage
              ? isScrolled ? "bg-background/90 backdrop-blur-xl border-b border-black/10 dark:border-white/[0.08]" : "bg-background backdrop-blur-xl"
              : isScrolled ? "bg-white/90 backdrop-blur-md border-b border-zinc-200" : "bg-white backdrop-blur-xl"
        )}
      >
        <nav className="max-w-[1024px] mx-auto h-11 flex items-center justify-between px-4 lg:px-0">
          {/* Logo */}
          <Link
            href="/"
            className="relative z-50 flex-shrink-0 opacity-100 hover:opacity-100 transition-opacity duration-200 -ml-3 lg:ml-0"
          >
            <Image
              src="/VB-01.svg"
              alt="VerspeKtive"
              width={40}
              height={40}
              priority
              className={clsx(
                !isBlackHeroPage && !isProductionsPage && "invert",
                isProductionsPage && "dark:invert-0 invert",
                "w-7 h-auto transition-all"
              )}
            />
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onMouseEnter={() => handleMouseEnter(item.name)}
                className={clsx(
                  "relative px-3 py-1.5 text-[12px] font-normal tracking-[0.01em] transition-colors duration-200",
                  pathname === item.href
                    ? isBlackHeroPage ? "text-white" : isProductionsPage ? "text-foreground" : "text-black"
                    : isBlackHeroPage ? "text-[#d1d1d6] hover:text-white" : isProductionsPage ? "text-muted-foreground hover:text-foreground" : "text-muted-foreground hover:text-black"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            {isProductionsPage && (
              <AnimatedThemeToggler
                className="flex text-muted-foreground hover:text-foreground transition-colors duration-200"
              />
            )}
            <Link
              href="/account"
              aria-label="Account"
              className={clsx(
                "hidden lg:flex transition-colors duration-200",
                isBlackHeroPage ? "text-[#d1d1d6] hover:text-white" : isProductionsPage ? "text-muted-foreground hover:text-foreground" : "text-muted-foreground hover:text-black"
              )}
            >
              <User className="w-[16px] h-[16px]" />
            </Link>

            {/* Mobile Toggle */}
            <button
              className={clsx(
                "lg:hidden relative z-50 transition-colors duration-200",
                isBlackHeroPage || isMobileMenuOpen ? "text-[#d1d1d6] hover:text-white" : isProductionsPage ? "text-muted-foreground hover:text-foreground" : "text-muted-foreground hover:text-black"
              )}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </nav>



        {/* Mega Menu Dropdown */}
        <AnimatePresence>
          {activeMegaMenu && megaMenus[activeMegaMenu] && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              className={clsx(
                "absolute top-[44px] left-0 right-0 overflow-hidden shadow-lg",
                isBlackHeroPage ? "bg-black/90 backdrop-blur-xl border-b border-white/[0.04]" : isProductionsPage ? "bg-background/90 backdrop-blur-xl border-b border-black/10 dark:border-white/[0.08]" : "bg-white/90 backdrop-blur-md border-b border-zinc-200"
              )}
            >
              <div className="max-w-[1024px] mx-auto px-4 lg:px-0 py-10">
                <div className="flex gap-20">
                  {megaMenus[activeMegaMenu].map((section, idx) => (
                    <div key={idx} className="flex flex-col gap-4 min-w-[120px]">
                      <h4 className={clsx(
                        "text-[11px] font-semibold tracking-wider uppercase",
                        isBlackHeroPage ? "text-[#86868b]" : "text-muted-foreground"
                      )}>
                        {section.title}
                      </h4>
                      {section.links.length > 0 ? (
                        <ul className="flex flex-col gap-3">
                          {section.links.map((link) => (
                            <li key={link.name}>
                              <Link
                                href={link.href}
                                onClick={() => setActiveMegaMenu(null)}
                                className={clsx(
                                  "text-[13px] font-medium transition-colors duration-200 block",
                                  isBlackHeroPage ? "text-[#d1d1d6] hover:text-white" : isProductionsPage ? "text-foreground/80 hover:text-foreground" : "text-[#1d1d1f] hover:text-[#000]"
                                )}
                              >
                                {link.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className={clsx(
                          "text-[13px] italic",
                          isBlackHeroPage ? "text-[#86868b]" : "text-muted-foreground"
                        )}>
                          {section.title === "Coming Soon" ? "Coming soon..." : ""}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mega Menu Backdrop (covers rest of screen) */}
      <AnimatePresence>
        {activeMegaMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-[44px] inset-x-0 bottom-0 z-40 bg-black/20 backdrop-blur-md"
            onMouseEnter={handleMouseLeave}
          />
        )}
      </AnimatePresence>

      {/* Mobile Full-Screen Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            className={clsx(
              "fixed inset-0 z-[45] backdrop-blur-2xl flex flex-col pt-12",
              isBlackHeroPage ? "bg-[#1d1d1f]/98" : isProductionsPage ? "bg-background/98" : "bg-white/98"
            )}
          >
            <div className="flex-1 flex flex-col px-12 pt-8 overflow-y-auto">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{
                    delay: index * 0.05,
                    duration: 0.45,
                    ease: [0.32, 0.72, 0, 1],
                  }}
                >
                  <Link
                    href={item.href}
                    className={clsx(
                      "block text-[28px] font-semibold tracking-tight py-3 border-b transition-colors duration-200",
                      isBlackHeroPage ? "border-white/[0.08]" : isProductionsPage ? "border-black/10 dark:border-white/[0.08]" : "border-black/[0.08]",
                      pathname === item.href
                        ? (isBlackHeroPage ? "text-white" : isProductionsPage ? "text-foreground" : "text-black")
                        : (isBlackHeroPage ? "text-[#86868b] hover:text-white" : isProductionsPage ? "text-muted-foreground hover:text-foreground" : "text-muted-foreground hover:text-black")
                    )}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
