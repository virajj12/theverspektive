"use client"

import * as React from "react"
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { ChevronLeftIcon } from "@/components/ui/chevron-left-icon";

export interface AnimatedTabsProps {
  tabs: { label: string, href: string, grouped?: boolean, className?: string }[];
  backHref?: string;
  activeTabOverride?: string;
}

export function AnimatedTabs({ tabs, backHref, activeTabOverride }: AnimatedTabsProps) {
  const pathname = usePathname();
  
  // Use override if provided (for hash matching), otherwise fallback to pathname
  const activeTab = activeTabOverride 
    ? tabs.find(t => t.href === activeTabOverride)?.label
    : tabs.find(t => t.href === pathname)?.label;

  const containerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLAnchorElement>(null);

  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, opacity: 0 });

  useEffect(() => {
    if (activeTab && activeTabRef.current) {
      const { offsetLeft, offsetWidth } = activeTabRef.current;
      setPillStyle({
        left: offsetLeft,
        width: Math.max(offsetWidth, 64), // Ensure a minimum width so it doesn't look like a circle
        opacity: 1,
      });
    } else {
      setPillStyle((prev) => {
        const slideDistance = 150; 
        
        return { 
          ...prev, 
          left: prev.left - slideDistance,
          opacity: 0 
        };
      });
    }
  }, [activeTab]);

  const showBack = backHref && pathname !== backHref;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center">
      <div className="relative bg-black/60 border border-white/10 mx-auto flex w-fit items-center rounded-full p-2 backdrop-blur-md overflow-hidden">
        
        <div className="relative flex items-center">
          {/* The Active Tab / Back Button Pill */}
          <div
            className={cn(
              "absolute z-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]",
              !activeTab && "pointer-events-none"
            )}
            style={pillStyle}
          >
            {showBack && (
              <Link
                href={backHref}
                className="flex items-center justify-center w-full h-full text-black hover:bg-black/5 transition-colors"
                aria-label="Go back"
              >
                <ChevronLeftIcon size={24} />
              </Link>
            )}
          </div>

          <div className="relative flex w-full justify-center">
            {tabs.map((tab, index) => {
              const isActive = activeTab === tab.label;
              const isGrouped = tab.grouped;
              const isFirstGrouped = isGrouped && (index === 0 || !tabs[index - 1].grouped);
              const isLastGrouped = isGrouped && (index === tabs.length - 1 || !tabs[index + 1].grouped);

              return (
                <Link
                  key={index}
                  href={tab.href}
                  ref={isActive ? activeTabRef : null}
                  onClick={() => {
                    if (tab.href.startsWith("#")) {
                      window.dispatchEvent(new CustomEvent("updateActiveHash", { detail: tab.href }));
                    }
                  }}
                  className={cn(
                    "flex h-10 items-center justify-center cursor-pointer px-5 text-sm font-medium transition-colors duration-300 ease-out whitespace-nowrap",
                    isActive ? (showBack ? "text-transparent pointer-events-none" : "text-black pointer-events-none") : "text-white/60 hover:text-white",
                    !isGrouped && "rounded-full",
                    isGrouped && "bg-white/10",
                    isFirstGrouped && "rounded-l-full",
                    isLastGrouped && "rounded-r-full",
                    tab.className
                  )}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
