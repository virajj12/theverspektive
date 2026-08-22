"use client";

import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface ElasticItemProps {
  id: string;
  title: string;
  src: string;
  alt: string;
  href: string;
}

function ElasticGallery() {
  const items: ElasticItemProps[] = [
    {
      id: "01",
      title: "Verspektive Productions",
      src: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2000&auto=format&fit=crop",
      alt: "Verspektive Productions",
      href: "/productions",
    },
    {
      id: "02",
      title: "Verspektive Studios",
      src: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2000&auto=format&fit=crop",
      alt: "Verspektive Studios",
      href: "/studios",
    },
    {
      id: "03",
      title: "The Founder",
      src: "/Vikhil.jpg",
      alt: "Vikhil V Salian",
      href: "/founder",
    },
    {
      id: "04",
      title: "G3 Builders & Architects",
      src: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=2000&auto=format&fit=crop",
      alt: "G3 Builders & Architects",
      href: "/g3-builders",
    },
    {
      id: "05",
      title: "TIO Originals",
      src: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=2000&auto=format&fit=crop",
      alt: "TIO Originals",
      href: "/tio-originals",
    },
  ];

  const [activeId, setActiveId] = useState<string | null>("03");

  return (
    <div className="relative z-10 w-full py-12 bg-transparent md:py-24">
      {/* Container: Fixed height on mobile/desktop to ensure animation stability */}
      <div className="mx-auto flex h-[700px] w-full max-w-6xl flex-col gap-2 px-4 md:h-[600px] md:flex-row md:gap-4">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            onMouseEnter={() => setActiveId(item.id)}
            onClick={(e) => {
              // On mobile/touch: first tap expands (prevents navigation), second tap navigates
              if (activeId !== item.id) {
                e.preventDefault();
                setActiveId(item.id);
              }
            }}
            className={cn(
              "relative cursor-pointer overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 block",
              // Layout & Flex Transition
              "transition-[flex,filter] duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]",
              // If active, take up more space on mobile to achieve ~3:4 aspect ratio.
              // On desktop, flex-[4] is sufficient.
              activeId === item.id ? "flex-[8] md:flex-[4]" : "flex-[1]",
              // Brightness logic for focus
              activeId === item.id
                ? "brightness-100"
                : "brightness-50 hover:brightness-75"
            )}
          >
            {/* Background Image Layer */}
            <div className="absolute inset-0 h-full w-full">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                quality={90}
                sizes="(max-width: 768px) 100vw, 60vw"
                className={cn(
                  "object-cover transition-transform duration-1000",
                  // Subtle zoom on active
                  activeId === item.id ? "scale-100" : "scale-110"
                )}
              />
              {/* Gradient Overlay for Text Readability */}
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500",
                  activeId === item.id ? "opacity-100" : "opacity-0"
                )}
              />
            </div>

            {/* --- Content Container --- */}
            <div className="absolute bottom-0 left-0 right-0 flex h-full flex-col justify-end p-4 md:p-8">
              {/* Active Content: Title & Button */}
              <div
                className={cn(
                  "flex flex-col gap-2 transition-all duration-500",
                  // Hide/Show based on active state with translation for smooth entry
                  activeId === item.id
                    ? "translate-y-0 opacity-100 delay-200"
                    : "translate-y-12 opacity-0"
                )}
              >


                {/* Title */}
                <h3 className="text-2xl font-black uppercase leading-none text-white md:text-5xl">
                  {item.title}
                </h3>

                {/* Call to Action */}
                <div
                  className="mt-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/80 hover:text-white transition-colors md:mt-4 md:text-sm"
                >
                  Explore <ArrowUpRight className="h-3 w-3 md:h-4 md:w-4" />
                </div>
              </div>

              {/* Inactive Content: Vertical Text (Desktop) / Short Label (Mobile) */}
              <div
                className={cn(
                  "absolute transition-all duration-500",
                  // Position logic
                  "bottom-4 left-1/2 -translate-x-1/2 md:bottom-8",
                  // Hide when active
                  activeId === item.id
                    ? "opacity-0 scale-50"
                    : "opacity-100 delay-500"
                )}
              >
                {/* Desktop: Vertical Text */}
                <span className="hidden whitespace-nowrap text-xl font-bold uppercase tracking-widest text-white [writing-mode:vertical-rl] md:block">
                  {item.title}
                </span>

                {/* Mobile: Horizontal ID/Label */}
                <span className="block text-xs font-bold uppercase text-white md:hidden">
                  {item.title}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export { ElasticGallery };
