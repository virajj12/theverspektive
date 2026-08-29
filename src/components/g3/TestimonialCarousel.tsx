"use client";

/**
 * Testimonials (spec 4.1). Swipeable on touch (spec 6: "native touch/swipe,
 * not tiny arrow buttons") via CSS scroll-snap, with arrows added only at
 * desktop widths where there is no swipe gesture to rely on.
 */

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

export interface Testimonial {
  id: number;
  clientName: string;
  quote: string;
  rating: number | null;
  projectTitle: string | null;
}

export default function TestimonialCarousel({ items }: { items: Testimonial[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  if (!items.length) return null;

  function scrollTo(i: number) {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(i, items.length - 1));
    const child = track.children[clamped] as HTMLElement | undefined;
    if (child) {
      track.scrollTo({ left: child.offsetLeft - track.offsetLeft, behavior: "smooth" });
      setIndex(clamped);
    }
  }

  return (
    <div className="relative">
      <div
        ref={trackRef}
        onScroll={(e) => {
          const t = e.currentTarget;
          const w = t.scrollWidth / items.length;
          setIndex(Math.round(t.scrollLeft / w));
        }}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((t) => (
          <figure
            key={t.id}
            className="g3-wood-surface w-[85%] shrink-0 snap-center rounded-xl border p-7 sm:w-[420px]"
            style={{ borderColor: "var(--g3-rule-faint)" }}
          >
            <Quote className="mb-4 h-6 w-6" style={{ color: "var(--g3-brass)" }} aria-hidden="true" />
            <blockquote className="g3-body mb-5" style={{ color: "var(--g3-ink)" }}>
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <figcaption>
              <p className="text-sm font-semibold" style={{ color: "var(--g3-ink)" }}>{t.clientName}</p>
              {t.projectTitle && <p className="g3-meta mt-1">{t.projectTitle}</p>}
            </figcaption>
          </figure>
        ))}
      </div>

      {items.length > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-1.5" role="tablist" aria-label="Testimonials">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                aria-selected={i === index}
                role="tab"
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: i === index ? 24 : 8,
                  background: i === index ? "var(--g3-brass)" : "var(--g3-rule)",
                }}
              />
            ))}
          </div>

          <div className="hidden gap-2 md:flex">
            {[["Previous", -1, ChevronLeft], ["Next", 1, ChevronRight]].map(([label, dir, Icon]) => {
              const I = Icon as typeof ChevronLeft;
              return (
                <button
                  key={label as string}
                  onClick={() => scrollTo(index + (dir as number))}
                  aria-label={label as string}
                  className="flex h-9 w-9 items-center justify-center rounded-full border transition-colors"
                  style={{ borderColor: "var(--g3-rule)", color: "var(--g3-ink-soft)" }}
                >
                  <I className="h-4 w-4" />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
