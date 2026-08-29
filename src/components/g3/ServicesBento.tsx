"use client";

/**
 * Services overview as a bento grid (spec 4.1 — one of the patterns the spec
 * explicitly says to reuse from VerspeKtive).
 *
 * Alternates wood and black tiles down the grid, which is the rhythmic
 * material alternation spec 3 asks for so the page never reads as monotone.
 */

import Link from "next/link";
import { Reveal } from "./Reveal";
import { revealDelay } from "./motion";
import { ChevronRight } from "lucide-react";

export interface BentoService {
  id: number;
  title: string;
  slug: string;
  summary: string | null;
}

/** Layout weights — first tile is wide, the rest fill around it. */
const SPAN = ["sm:col-span-2 sm:row-span-2", "", "", "sm:col-span-2", ""];

export default function ServicesBento({ services }: { services: BentoService[] }) {
  if (!services.length) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {services.slice(0, 5).map((s, i) => (
        <Reveal key={s.id} delay={revealDelay(i)} className={SPAN[i] || ""}>
          <Link
            href={`/g3-builders/services#${s.slug}`}
            className={`group flex h-full flex-col justify-between rounded-xl border p-6 transition-transform duration-500 hover:-translate-y-1 ${
              i % 2 === 0 ? "g3-wood-surface" : ""
            }`}
            style={{
              borderColor: "var(--g3-rule-faint)",
              background: i % 2 === 0 ? undefined : "var(--g3-black-raised)",
              minHeight: 170,
            }}
          >
            <div>
              <h3 className="mb-2 text-xl font-semibold tracking-tight" style={{ fontFamily: "var(--g3-font-display)", color: "var(--g3-ink)" }}>
                {s.title}
              </h3>
              {s.summary && <p className="g3-body text-sm">{s.summary}</p>}
            </div>
            <span className="g3-link mt-5 text-sm">
              Learn more <ChevronRight aria-hidden="true" />
            </span>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
