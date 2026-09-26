"use client";

import React from 'react';
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ContactEmailDropdown } from "@/components/ContactEmailDropdown";

import footerData from "../../content/footer.json";

export default function Footer() {
  const pathname = usePathname();

  // Hide on admin pages
  if (pathname.startsWith('/admin') || pathname.startsWith('/g3-builders')) {
    return null;
  }

  const isRevealFooter = pathname !== '/' && !pathname.startsWith('/founder') && !pathname.startsWith('/tech');



  const exploreSection = footerData.sections.find(s => s.title === "Explore")?.links || [];
  const contactSection = footerData.sections.find(s => s.title === "Contact")?.links || [];

  const footerInner = (
    <>
      {/* Top Section - Follows Page Theme */}
      <div className="bg-background text-foreground flex flex-col transition-colors duration-300">
        
        {footerData.description && (
          <div className="flex flex-col justify-center items-center pt-12 md:pt-16 pb-4">
            <p className="text-sm text-muted-foreground max-w-md mx-auto text-center whitespace-pre-line px-6">
              {footerData.description}
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="w-full px-6 lg:px-12 pt-4 pb-8 md:pt-6 md:pb-10">
          <div className="flex flex-wrap md:flex-row justify-between items-center gap-x-6 gap-y-4 font-medium text-base md:text-lg">
            {exploreSection.map((link) => (
              <Link key={link.name} href={link.href} className="hover:text-muted-foreground transition-colors">
                {link.name}
              </Link>
            ))}
          </div>
        </div>
        
        {/* Mobile Bottom Row (Inside Theme Area) */}
        <div className="mt-8 flex flex-col md:hidden items-center gap-4 px-6 py-5 text-[11px] font-medium tracking-wide text-muted-foreground border-t border-black/10 dark:border-white/10">
          <span>© {new Date().getFullYear()} VerspeKtive. All rights reserved.</span>
          <div className="flex flex-wrap justify-center gap-4">
            {footerData.bottomLinks.map(link => (
              <Link key={link.name} href={link.href} className="hover:text-foreground transition-colors">
                {link.name}
              </Link>
            ))}
          </div>
          <Link href="/tech" className="hover:text-foreground transition-colors">
            Made by VerspeKtive Tech
          </Link>
        </div>
      </div>

      {/* Bottom Section - Always Dark with Huge Logo */}
      <div className="bg-zinc-950 text-white pt-8 pb-6 md:pt-12 md:pb-0">
        <div className="w-full flex flex-col items-center">
          
          {/* MASSIVE LOGO */}
          <div className="w-full flex justify-center items-center pointer-events-none mb-6 md:mb-10">
            <Image 
              src="/V.png" 
              alt="VerspeKtive" 
              width={1600} 
              height={400} 
              className="w-full h-auto object-cover md:object-contain"
              priority
            />
          </div>
        </div>

        {/* Desktop Bottom Row */}
        <div className="hidden md:grid md:grid-cols-3 items-center gap-4 px-6 lg:px-12 py-5 text-xs font-medium tracking-wide text-zinc-500 border-t border-white/10 bg-black/40">
          <div className="flex justify-start">
            <span>© {new Date().getFullYear()} VerspeKtive. All rights reserved.</span>
          </div>
          <div className="flex justify-center items-center gap-8">
            {footerData.bottomLinks.map(link => (
              <Link key={link.name} href={link.href} className="hover:text-white transition-colors">
                {link.name}
              </Link>
            ))}
          </div>
          <div className="flex justify-end">
            <Link href="/tech" className="hover:text-white transition-colors">
              Made by VerspeKtive Tech
            </Link>
          </div>
        </div>
      </div>
    </>
  );

  if (!isRevealFooter) {
    return (
      <footer 
        id="verspektive-footer" 
        className="relative z-50 w-full overflow-hidden transition-colors duration-300 border-t border-black/10 dark:border-white/10"
      >
        {footerInner}
      </footer>
    );
  }

  return (
    <>
      <div className="w-full relative z-[-20] opacity-0 pointer-events-none select-none" aria-hidden="true">
        {footerInner}
      </div>
      <footer 
        id="verspektive-footer" 
        className="fixed bottom-0 left-0 w-full z-0 overflow-hidden transition-colors duration-300 border-t border-black/10 dark:border-white/10"
      >
        {footerInner}
      </footer>
    </>
  );
}
