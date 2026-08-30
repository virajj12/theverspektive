"use client"

import * as React from "react"
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { ChevronLeftIcon } from "@/components/ui/chevron-left-icon";

import { motion, AnimatePresence } from "framer-motion";
import GlassSurface from "@/components/ui/GlassSurface";

export interface AnimatedTabsProps {
  tabs: { id?: string, label: string, href: string, grouped?: boolean, className?: string, iconOnlyWhenActiveBack?: boolean }[];
  backHref?: string;
  activeTabOverride?: string;
}

export function AnimatedTabs({ tabs, backHref, activeTabOverride }: AnimatedTabsProps) {
  const pathname = usePathname();
  
  // Use override if provided (for hash matching), otherwise fallback to pathname
  const activeTab = activeTabOverride 
    ? tabs.find(t => t.href === activeTabOverride)
    : tabs.find(t => t.href === pathname);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center">
      <motion.div 
        layout
        className="relative mx-auto flex w-fit items-center rounded-full"
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        <GlassSurface
          width="max-content"
          height="max-content"
          borderRadius={9999}
          className="p-2"
        >
          <div className="relative flex items-center">
          <div className="relative flex w-full justify-center">
            <AnimatePresence initial={false} mode="popLayout">
              {tabs.map((tab, index) => {
                const isActive = activeTab && (tab.id ? activeTab.id === tab.id : activeTab.label === tab.label);
                const isBack = isActive && backHref;
                const isGrouped = tab.grouped;
                const isFirstGrouped = isGrouped && (index === 0 || !tabs[index - 1].grouped);
                const isLastGrouped = isGrouped && (index === tabs.length - 1 || !tabs[index + 1].grouped);
                const tabId = tab.id || tab.label;

                return (
                  <motion.div
                    layout
                    key={tabId}
                    initial={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 400, 
                      damping: 30,
                      opacity: { duration: 0.2 }
                    }}
                    className={cn(
                      "relative flex items-center justify-center h-10 transition-colors duration-300",
                      !isGrouped && "rounded-full ml-1",
                      isGrouped && "bg-white/10",
                      isFirstGrouped && "rounded-l-full ml-1",
                      isLastGrouped && "rounded-r-full mr-1",
                      tab.className
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-pill"
                        className="absolute inset-0 bg-white rounded-full z-10"
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      />
                    )}
                    <Link
                      href={tab.href}
                      onClick={(e) => {
                        if (tab.href.startsWith("#")) {
                          e.preventDefault();
                          
                          // Prevent scroll spy glitches during smooth scroll
                          (window as any).isProgrammaticScroll = true;
                          
                          // Update URL and state immediately
                          window.history.pushState(null, '', tab.href);
                          window.dispatchEvent(new CustomEvent("updateActiveHash", { detail: tab.href }));
                          
                          // Use a scroll event listener to detect when scrolling stops
                          const handleScroll = () => {
                            if ((window as any).scrollTimeout) clearTimeout((window as any).scrollTimeout);
                            (window as any).scrollTimeout = setTimeout(() => {
                              (window as any).isProgrammaticScroll = false;
                              window.removeEventListener('scroll', handleScroll);
                            }, 100);
                          };
                          window.addEventListener('scroll', handleScroll);
                          
                          // Fallback in case scroll doesn't happen
                          setTimeout(() => {
                            if ((window as any).isProgrammaticScroll) {
                              (window as any).isProgrammaticScroll = false;
                              window.removeEventListener('scroll', handleScroll);
                            }
                          }, 1500);

                          const target = document.querySelector(tab.href);
                          if (target) {
                            target.scrollIntoView({ behavior: "smooth" });
                          } else if (tab.href === "#tio-originals") {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }
                        }
                      }}
                      className={cn(
                        "relative flex h-full items-center justify-center cursor-pointer text-sm font-medium whitespace-nowrap z-20 transition-colors duration-300",
                        "px-5",
                        isActive ? "text-black" : "text-white/60 hover:text-white"
                      )}
                    >
                      <span className="opacity-100 transition-opacity duration-300">
                        {tab.label}
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </GlassSurface>
    </motion.div>
  </div>
  );
}
