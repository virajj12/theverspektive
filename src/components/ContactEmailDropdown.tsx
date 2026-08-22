"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Mail, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ContactEmailDropdown({ 
  email,
  children,
  className 
}: { 
  email: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
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
        top: rect.top,
        left: rect.left + rect.width / 2,
      });
      setIsOpen(true);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setIsOpen(false);
    }, 2000);
  };

  const getGmailLink = () => {
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`;
  };

  const getOutlookLink = () => {
    return `https://outlook.live.com/mail/0/deeplink/compose?to=${email}`;
  };

  const menuContent = (
    <AnimatePresence>
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            left: coords.left,
            bottom: window.innerHeight - coords.top + 10,
            transform: 'translateX(-50%)',
            zIndex: 999999,
          }}
        >
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-64 rounded-2xl bg-[#1d1d1f]/90 backdrop-blur-xl border border-white/10 shadow-2xl p-2 overflow-hidden"
          >
            <div className="flex flex-col gap-1">
              <a
                href={getGmailLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white hover:bg-white/10 rounded-xl transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <div className="w-5 flex justify-center text-red-500">
                  <svg width="18" height="14" viewBox="0 0 18 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.5 0H16.5C17.325 0 18 0.675 18 1.5V12.5C18 13.325 17.325 14 16.5 14H1.5C0.675 14 0 13.325 0 12.5V1.5C0 0.675 0.675 0 1.5 0ZM15.75 2.25L9 6.75L2.25 2.25V11.25H15.75V2.25Z" />
                  </svg>
                </div>
                Open in Gmail
              </a>

              <a
                href={getOutlookLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white hover:bg-white/10 rounded-xl transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <div className="w-5 flex justify-center text-blue-500">
                  <Mail className="w-4 h-4" />
                </div>
                Open in Outlook
              </a>

              <a
                href={`mailto:${email}`}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white hover:bg-white/10 rounded-xl transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <div className="w-5 flex justify-center text-zinc-400">
                  <Mail className="w-4 h-4" />
                </div>
                Open Default App
              </a>

              <button
                onClick={handleCopy}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-white hover:bg-white/10 rounded-xl transition-colors"
              >
                <div className="w-5 flex justify-center text-zinc-400">
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </div>
                {copied ? "Copied!" : "Copy Email Address"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <div className="relative inline-block text-left" ref={dropdownRef}>
        <button
          onClick={handleOpen}
          className={className || "inline-flex items-center justify-center gap-2 bg-white text-black hover:bg-zinc-100 px-8 py-4 rounded-full font-semibold text-lg transition-transform hover:scale-105"}
        >
          {children || (
            <>
              <Mail className="w-5 h-5" />
              Email Us
            </>
          )}
        </button>
      </div>
      {mounted && createPortal(menuContent, document.body)}
    </>
  );
}
