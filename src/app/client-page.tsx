"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronRight } from "lucide-react";
import ScrollStack, { ScrollStackItem } from "@/components/ui/ScrollStack";
import { useGlobalLoader } from "@/components/global-loader-provider";
import dynamic from "next/dynamic";
import InlineSocials from "@/components/inline-socials";

const AnimatedBackground = dynamic(() => import("@/components/AnimatedBackground"), {
  ssr: false,
});

// GSAP replaced by Framer Motion

interface ClientHomeProps {
  heroHeadline: string;
  heroTagline: string;
  heroImage: string;
}

export default function ClientHome({
  heroHeadline,
  heroTagline,
  heroImage,
}: ClientHomeProps) {
  const { loading } = useGlobalLoader();

  const { scrollY } = useScroll();
  const logoY = useTransform(scrollY, [0, 1000], [0, -800]);

  useEffect(() => {
    // Force scroll to top on reload to prevent awkward mid-scroll states
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className="w-full flex flex-col bg-transparent">

        {/* Wrapper to contain the sticky logo so it doesn't bleed into Bento Grid */}
        <div className="relative w-full z-0">
          {/* ═══════════════════════════════════════
              HERO 1 — Primary Brand Hero (Full-Screen)
              ═══════════════════════════════════════ */}
          <section className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-background -z-10 transition-colors duration-500">
            {/* Dynamically loaded AnimatedBackground — delayed to prevent blocking the loader */}
            {!loading && <AnimatedBackground />}

            <motion.div
              style={{ y: logoY }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: loading ? 0.6 : 0, ease: "easeOut" }}
              className="relative z-10 flex flex-col items-center w-full"
            >
              <Image
                src="/VerspeKtive White Word-01.png"
                alt="VerspeKtive"
                width={800}
                height={200}
                sizes="(max-width: 640px) 220px, (max-width: 768px) 320px, 440px"
                className="w-[220px] sm:w-[320px] md:w-[440px] h-auto object-contain drop-shadow-xl dark:drop-shadow-[0_0px_80px_rgba(0,0,0,0.8)] dark:invert-0 invert"
                priority
              />

            </motion.div>


          </section>



          {/* ═══════════════════════════════════════
            SCROLL STACK — Secondary Features
            ═══════════════════════════════════════ */}
          <div className="relative z-10 w-full bg-background transition-colors duration-500">
            <div className="text-center pt-24 -mb-12">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">Explore our brands</h2>
            </div>
            <ScrollStack
              useWindowScroll={true}
              itemStackDistance={30}
              stackPosition="10%"
              scaleEndPosition="-40%"
              className="py-12 md:py-24"
            >
              <ScrollStackItem itemClassName="!h-[60vh] md:!h-[70vh] !p-0 overflow-hidden border border-black/10 dark:border-white/10 bg-zinc-100 dark:bg-neutral-900">
                <Image src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=2000&auto=format&fit=crop" fill alt="G3 Builders & Architects" className="object-cover" loading="lazy" sizes="100vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
                  <h2 className="text-3xl md:text-5xl lg:text-7xl font-black uppercase text-foreground mb-6">G3 Builders & Architects</h2>
                  <Link href="https://projectsbyg3.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-full font-medium hover:bg-foreground/90 transition-colors">
                    Explore <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </ScrollStackItem>

              <ScrollStackItem itemClassName="!h-[60vh] md:!h-[70vh] !p-0 overflow-hidden border border-black/10 dark:border-white/10 bg-zinc-100 dark:bg-neutral-900">
                <Image src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2000&auto=format&fit=crop" fill alt="Verspektive Productions" className="object-cover" loading="lazy" sizes="100vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
                  <h2 className="text-3xl md:text-5xl lg:text-7xl font-black uppercase text-foreground mb-6">Verspektive Productions</h2>
                  <Link href="/productions" className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-full font-medium hover:bg-foreground/90 transition-colors">
                    Explore <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </ScrollStackItem>

              <ScrollStackItem itemClassName="!h-[60vh] md:!h-[70vh] !p-0 overflow-hidden border border-black/10 dark:border-white/10 bg-zinc-100 dark:bg-neutral-900">
                <Image src="https://images.unsplash.com/photo-1714568398464-fa1006821617?q=80&w=2000&auto=format&fit=crop" fill alt="Unusval Apparels" className="object-cover" loading="lazy" sizes="100vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
                  <h2 className="text-3xl md:text-5xl lg:text-7xl font-black uppercase text-foreground mb-6">Unusval Apparels</h2>
                  <Link href="/unusval-apparels" className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-full font-medium hover:bg-foreground/90 transition-colors">
                    Explore <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </ScrollStackItem>

              <ScrollStackItem itemClassName="!h-[60vh] md:!h-[70vh] !p-0 overflow-hidden border border-black/10 dark:border-white/10 bg-zinc-100 dark:bg-neutral-900">
                <Image src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2000&auto=format&fit=crop" fill alt="VerspeKtive Tech" className="object-cover" loading="lazy" sizes="100vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
                  <h2 className="text-3xl md:text-5xl lg:text-7xl font-black uppercase text-foreground mb-6">Tech</h2>
                  <Link href="/tech" className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-full font-medium hover:bg-foreground/90 transition-colors">
                    Explore <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </ScrollStackItem>


            </ScrollStack>
          </div>
        </div>
      </div>
    </>
  );
}
