"use client";

import React, { useRef, useState, useEffect } from 'react';
import Link from "next/link";
import { ContactEmailDropdown } from "@/components/ContactEmailDropdown";

const footerSections = [
  {
    title: "Explore",
    links: [
      { name: "G3 Builders", href: "/g3-builders" },
      { name: "Productions", href: "/productions" },
      { name: "Studios", href: "/studios" },
      { name: "Talk it Out", href: "/talk-it-out" },
      { name: "Taste it Out", href: "/taste-it-out" },
    ],
  },
  {
    title: "About",
    links: [
      { name: "Vikhil V Salian", href: "/team" },
      { name: "VerspeKtive", href: "/" },
      { name: "Careers", href: "#" },
      { name: "Team", href: "/team" },
    ],
  },
  {
    title: "Connect",
    links: [
      { name: "Instagram", href: "https://www.instagram.com/the_verspektive" },
      { name: "YouTube", href: "https://www.youtube.com/@verspektive_productions" },
      // { name: "LinkedIn", href: "#" },
      // { name: "Twitter / X", href: "#" },
    ],
  },
  {
    title: "Contact",
    links: [
      { name: "verspektive@gmail.com", href: "mailto:verspektive@gmail.com" },
      { name: "+91", href: "tel:+91" },
    ],
  },
];

export default function Footer() {
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
          <footer ref={containerRef} className="w-full bg-[#ebebeb] text-[#1d1d1f] shadow-[inset_0_10px_20px_rgba(0,0,0,0.03)]">
            <div className="max-w-[1120px] mx-auto px-6 lg:px-8">
              {/* Breadcrumb-style note */}
              <div className="pt-5 pb-3 border-b border-[#d2d2d7] text-xs text-[#6e6e73] leading-relaxed">
                <p>
                  VerspeKtive is a premium media and content studio based in Karnataka, India.
                  <br />
                  Beluvai, between Karkala and Moodbidri, Karnataka.
                </p>
              </div>

              {/* Link Columns */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-8 py-8">
                {footerSections.map((section) => (
                  <div key={section.title}>
                    <h4 className="text-xs font-semibold text-[#1d1d1f] mb-3">
                      {section.title}
                    </h4>
                    <ul className="space-y-2">
                      {section.links.map((link) => (
                        <li key={link.name}>
                          {link.href.startsWith("mailto:") ? (
                            <ContactEmailDropdown
                              email={link.name}
                              className="text-xs text-[#424245] hover:text-[#1d1d1f] hover:underline transition-colors duration-200 text-left p-0 m-0 bg-transparent"
                            >
                              {link.name}
                            </ContactEmailDropdown>
                          ) : (
                            <Link
                              href={link.href}
                              className="text-xs text-[#424245] hover:text-[#1d1d1f] hover:underline transition-colors duration-200"
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
              <div className="border-t border-[#d2d2d7] py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <p className="text-xs text-[#6e6e73]">
                  Copyright &copy; {currentYear} VerspeKtive. All rights reserved.
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#424245]">
                  <Link href="#" className="hover:text-[#1d1d1f] hover:underline transition-colors duration-200">
                    Privacy Policy
                  </Link>
                  <span className="text-[#d2d2d7]">|</span>
                  <Link href="#" className="hover:text-[#1d1d1f] hover:underline transition-colors duration-200">
                    Terms of Use
                  </Link>
                  <span className="text-[#d2d2d7]">|</span>
                  <Link href="#" className="hover:text-[#1d1d1f] hover:underline transition-colors duration-200">
                    Site Map
                  </Link>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
