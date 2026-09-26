"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { UserRoundPlusIcon } from "@/components/ui/user-round-plus";

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

export function SocialsDropdown({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    
    function handleScrollOrResize() {
      setIsOpen(false);
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleScrollOrResize, { passive: true, capture: true });
      window.addEventListener("resize", handleScrollOrResize, { passive: true });
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScrollOrResize, { capture: true });
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isOpen]);

  const handleOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOpen) {
      setIsOpen(false);
      return;
    }
    if (dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom, // Open below the icon
        left: rect.left + rect.width / 2,
      });
      setIsOpen(true);
    }
  };

  const menuContent = (
    <AnimatePresence>
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            left: coords.left,
            top: coords.top + 10,
            transform: 'translateX(-50%)',
            zIndex: 999999,
          }}
        >
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-64 rounded-2xl bg-white/90 dark:bg-[#1d1d1f]/90 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-2xl p-2 overflow-hidden"
          >
            <div className="flex flex-col gap-1">
              <a
                href="https://www.youtube.com/@verspektive_productions"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <div className="w-5 flex justify-center text-red-600 dark:text-red-500">
                  <YoutubeIcon className="w-4 h-4" />
                </div>
                @verspektive_productions
              </a>
              <a
                href="https://www.instagram.com/verspektive_productions"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <div className="w-5 flex justify-center text-pink-500">
                  <InstagramIcon className="w-4 h-4" />
                </div>
                @verspektive_productions
              </a>

              <a
                href="https://www.instagram.com/tio_originals"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <div className="w-5 flex justify-center text-pink-500">
                  <InstagramIcon className="w-4 h-4" />
                </div>
                @tio_originals
              </a>

              <a
                href="https://www.instagram.com/verspektive_studios/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <div className="w-5 flex justify-center text-pink-500">
                  <InstagramIcon className="w-4 h-4" />
                </div>
                @verspektive_studios
              </a>

              <a
                href="https://www.instagram.com/the_verspektive"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <div className="w-5 flex justify-center text-pink-500">
                  <InstagramIcon className="w-4 h-4" />
                </div>
                @the_verspektive
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <div className="relative inline-flex items-center justify-center" ref={dropdownRef}>
        <button
          onClick={handleOpen}
          aria-label="Social Links"
          className={className}
        >
          <UserRoundPlusIcon size={20} />
        </button>
      </div>
      {mounted && createPortal(menuContent, document.body)}
    </>
  );
}
