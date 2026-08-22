"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Mail } from "lucide-react";

export function MailDropdown({ email, children }: { email: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setIsOpen(false);
    // Optionally alert the user, but since the menu closes, it feels responsive.
  };

  return (
    <div className="relative inline-block" ref={menuRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {children}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-60 p-2 rounded-2xl border border-white/10 bg-[#141414] shadow-2xl z-50 flex flex-col gap-1 backdrop-blur-xl"
          >
            <a
              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-[12px] hover:bg-white/10 transition-colors text-white font-medium text-sm cursor-can-hover"
            >
              <Mail className="w-4 h-4 text-red-500" />
              Open in Gmail
            </a>
            <a
              href={`https://outlook.live.com/mail/0/deeplink/compose?to=${email}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-[12px] hover:bg-white/10 transition-colors text-white font-medium text-sm cursor-can-hover"
            >
              <Mail className="w-4 h-4 text-blue-500" />
              Open in Outlook
            </a>
            <a
              href={`mailto:${email}`}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-[12px] hover:bg-white/10 transition-colors text-white font-medium text-sm cursor-can-hover"
            >
              <Mail className="w-4 h-4 text-white/50" />
              Open Default App
            </a>
            <button
              onClick={handleCopy}
              className="flex items-center w-full text-left gap-3 px-3 py-2.5 rounded-[12px] hover:bg-white/10 transition-colors text-white font-medium text-sm cursor-can-hover"
            >
              <Copy className="w-4 h-4 text-white/50" />
              Copy Email Address
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
