"use client";

/**
 * Signature moment 2 — pinned horizontal project showcase (spec 3a).
 *
 * Vertical scroll drives horizontal movement through the flagship projects,
 * with a large wordmark behind them moving at roughly half speed for depth.
 *
 * The spec is explicit that the background type must be a *parallax ratio*,
 * not equal speed — moving both at the same rate reads as one flat plane and
 * throws away the depth the moment exists for. It also insists the wordmark be
 * G3's own project names, not a placeholder studio name, so the background
 * text is built from the actual projects being shown.
 *
 * Phones get a horizontal snap-scroll strip instead: the same content and the
 * same left-to-right reading, driven by the thumb rather than by a pinned
 * scrub, which is both cheaper and more natural on touch.
 */

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ChevronRight } from "lucide-react";
import { useG3Scroll, MOTION_OK } from "./use-g3-scroll";
import type { G3Project } from "@/lib/g3-constants";

export default function PinnedProjectShowcase({ projects }: { projects: G3Project[] }) {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const wordmark = useRef<HTMLDivElement>(null);

  useG3Scroll(
    root,
    (mm) => {
      mm.add(MOTION_OK, () => {
        const el = track.current;
        if (!el) return;

        const distance = () => Math.max(0, el.scrollWidth - window.innerWidth);
        if (distance() === 0) return;

        gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });

        // Background type at ~0.45x — subtle, and never competing with the
        // imagery for attention (spec 3a keeps parallax in the 0.4–0.6 band).
        gsap.to(wordmark.current, {
          x: () => -distance() * 0.45,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
      });
    },
    [projects.length]
  );

  if (!projects.length) return null;

  // One viewport of scroll per project, per spec 3a's "one viewport-height of
  // scroll per step" rule, plus one for the pin to settle.
  const runway = `${(projects.length + 1) * 100}svh`;

  return (
    <>
      {/* Desktop: pinned horizontal scrub */}
      <section
        ref={root}
        className="relative hidden md:block"
        style={{ height: runway }}
        aria-label="Featured projects"
      >
        <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
          {/* Parallax wordmark */}
          <div
            ref={wordmark}
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 whitespace-nowrap will-change-transform"
            style={{
              fontFamily: "var(--g3-font-display)",
              fontSize: "clamp(8rem, 22vw, 20rem)",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              color: "rgba(245,241,234,0.045)",
              lineHeight: 1,
            }}
          >
            {projects.map((p) => p.title).join("  ·  ")}
          </div>

          <div className="relative mx-auto mb-8 w-full max-w-6xl px-6">
            <span className="g3-meta">Selected work</span>
          </div>

          <div ref={track} className="relative flex gap-8 pl-[max(1.5rem,calc((100vw-72rem)/2))] pr-[20vw] will-change-transform">
            {projects.map((p, i) => (
              <Link
                key={p.id}
                href={`/g3-builders/projects/${p.slug}`}
                className="group relative block w-[clamp(320px,38vw,560px)] shrink-0"
              >
                <div
                  className="relative aspect-[4/3] overflow-hidden rounded-xl"
                  style={{ background: "var(--g3-black-raised)" }}
                >
                  {p.cover ? (
                    <Image
                      src={p.cover.url}
                      alt={p.cover.alt || p.title}
                      fill
                      sizes="560px"
                      priority={i === 0}
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="g3-wood-surface absolute inset-0" />
                  )}
                </div>

                <div className="mt-5">
                  <span className="g3-meta">
                    {String(i + 1).padStart(2, "0")} — {p.category}
                  </span>
                  <h3
                    className="mt-2 text-2xl font-semibold tracking-tight"
                    style={{ fontFamily: "var(--g3-font-display)", color: "var(--g3-ink)" }}
                  >
                    {p.title}
                  </h3>
                  {(p.location || p.year) && (
                    <p className="mt-1 text-sm" style={{ color: "var(--g3-ink-faint)" }}>
                      {[p.location, p.year].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>

          <div className="relative mx-auto mt-10 w-full max-w-6xl px-6">
            <Link href="/g3-builders/projects" className="g3-link">
              All projects <ChevronRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Mobile / reduced motion: thumb-driven snap strip, same content. */}
      <section className="md:hidden">
        <div className="mx-auto max-w-6xl px-6 pt-24">
          <span className="g3-meta">Selected work</span>
          <h2 className="g3-display-lg mt-3" style={{ color: "var(--g3-ink)" }}>
            Recent projects
          </h2>
        </div>

        <div className="mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {projects.map((p, i) => (
            <Link
              key={p.id}
              href={`/g3-builders/projects/${p.slug}`}
              className="w-[80%] shrink-0 snap-center"
            >
              <div
                className="relative aspect-[4/3] overflow-hidden rounded-xl"
                style={{ background: "var(--g3-black-raised)" }}
              >
                {p.cover ? (
                  <Image
                    src={p.cover.url}
                    alt={p.cover.alt || p.title}
                    fill
                    sizes="80vw"
                    priority={i === 0}
                    className="object-cover"
                  />
                ) : (
                  <div className="g3-wood-surface absolute inset-0" />
                )}
              </div>
              <div className="mt-4">
                <span className="g3-meta">{p.category}</span>
                <h3
                  className="mt-1.5 text-xl font-semibold tracking-tight"
                  style={{ fontFamily: "var(--g3-font-display)", color: "var(--g3-ink)" }}
                >
                  {p.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        <div className="mx-auto max-w-6xl px-6 pt-4">
          <Link href="/g3-builders/projects" className="g3-link">
            All projects <ChevronRight aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
