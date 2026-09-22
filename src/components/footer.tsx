"use client";

import React, { useRef, useState, useEffect } from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ContactEmailDropdown } from "@/components/ContactEmailDropdown";

import footerData from "../../content/footer.json";

const footerSections = footerData.sections;

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();
  const containerRef = useRef<HTMLElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setHeight(entry.target.getBoundingClientRect().height);
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);


  // G3 Builders ships its own footer — see the matching guard in navbar.tsx.
  // Must sit after all hooks.
  if (pathname.startsWith('/g3-builders')) {
    return null;
  }
  return (
    <div
      className="relative w-full z-0"
      style={{
        height: height > 0 ? `${height}px` : 'auto',
        clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)"
      }}
    >
      <div
        className="relative w-full"
        style={{
          height: height > 0 ? `calc(100vh + ${height}px)` : 'auto',
          top: height > 0 ? '-100vh' : 'auto'
        }}
      >
        <div
          className={height > 0 ? "sticky w-full" : "relative w-full"}
          style={{
            height: height > 0 ? `${height}px` : 'auto',
            top: height > 0 ? `calc(100vh - ${height}px)` : 'auto'
          }}
        >
          <footer ref={containerRef} className="w-full bg-[#ebebeb] dark:bg-[#111] text-[#1d1d1f] dark:text-[#f5f5f7] shadow-[inset_0_10px_20px_rgba(0,0,0,0.03)] dark:shadow-[inset_0_10px_20px_rgba(0,0,0,0.2)] transition-colors duration-300">
            <div className="max-w-[1120px] mx-auto px-6 lg:px-8">
              {/* Breadcrumb-style note */}
              <div className="pt-5 pb-3 border-b border-[#d2d2d7] dark:border-white/10 text-xs text-[#6e6e73] dark:text-white/40 leading-relaxed">
                <p className="whitespace-pre-line">
                  {footerData.description}
                </p>
              </div>

              {/* Link Columns */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-8 py-8">
                {footerSections.map((section) => (
                  <div key={section.title}>
                    <h4 className="text-xs font-semibold text-[#1d1d1f] dark:text-white/90 mb-3">
                      {section.title}
                    </h4>
                    <ul className="space-y-2">
                      {section.links.map((link) => (
                        <li key={link.name}>
                          {link.href.startsWith("mailto:") ? (
                            <ContactEmailDropdown
                              email={link.name}
                              className="text-xs text-[#424245] dark:text-white/50 hover:text-[#1d1d1f] dark:hover:text-white hover:underline transition-colors duration-200 text-left p-0 m-0 bg-transparent"
                            >
                              {link.name}
                            </ContactEmailDropdown>
                          ) : (
                            <Link
                              href={link.href}
                              className="text-xs text-[#424245] dark:text-white/50 hover:text-[#1d1d1f] dark:hover:text-white hover:underline transition-colors duration-200"
                            >
                              {link.name}
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Bottom Bar */}
              <div className="border-t border-[#d2d2d7] dark:border-white/10 py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <p className="text-xs text-[#6e6e73] dark:text-white/40">
                  Copyright &copy; {currentYear} VerspeKtive. All rights reserved.
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#424245] dark:text-white/50">
                  {footerData.bottomLinks.map((link, i) => (
                    <React.Fragment key={link.name}>
                      <Link href={link.href} className="hover:text-[#1d1d1f] dark:hover:text-white hover:underline transition-colors duration-200">
                        {link.name}
                      </Link>
                      {i < footerData.bottomLinks.length - 1 && (
                        <span className="text-[#d2d2d7] dark:text-white/20">|</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
