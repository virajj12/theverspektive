"use client";

/**
 * Process timeline (spec 4.5): Concept → Design → Approvals → Construction →
 * Handover, each with what happens, typical duration, and what the client
 * provides or receives.
 *
 * `condensed` renders the homepage teaser (spec 4.1); the full variant is the
 * Process page. One component so the two can never drift out of sync.
 *
 * The stacking-card treatment from spec 3a lands on this section in the
 * animation phase — the markup here is already one full-height block per
 * stage, which is the structure that pinning needs.
 */

import Link from "next/link";
import { Reveal } from "./Reveal";
import { revealDelay } from "./motion";
import { ChevronRight } from "lucide-react";

export const PROCESS_STAGES = [
  {
    key: "concept",
    title: "Concept",
    duration: "2–3 weeks",
    what: "We walk the site, understand how you actually live or work, and agree the brief, budget envelope and constraints before anything is drawn.",
    client: "You provide: site documents, rough budget, references you like.",
  },
  {
    key: "design",
    title: "Design",
    duration: "6–10 weeks",
    what: "Plans, elevations and 3D views developed until the space is resolved. You see real material palettes, not just line drawings.",
    client: "You receive: floor plans, renders, material board, cost estimate.",
  },
  {
    key: "approvals",
    title: "Approvals",
    duration: "4–8 weeks",
    what: "Statutory drawings, panchayat or corporation submissions, and the follow-up needed to get sanction without stalling.",
    client: "You provide: ownership papers and signatures. We handle the rest.",
  },
  {
    key: "construction",
    title: "Construction",
    duration: "8–18 months",
    what: "Execution with our own site team, staged billing tied to milestones, and weekly progress you can see rather than take on trust.",
    client: "You receive: weekly site updates, milestone billing, quality checks.",
  },
  {
    key: "handover",
    title: "Handover",
    duration: "2–4 weeks",
    what: "Snagging, final finishes, cleaning and documentation — then the keys, with warranties and drawings in a form you can actually use later.",
    client: "You receive: keys, as-built drawings, warranties, maintenance notes.",
  },
];

export default function ProcessTimeline({ condensed = false }: { condensed?: boolean }) {
  const stages = condensed ? PROCESS_STAGES.slice(0, 4) : PROCESS_STAGES;

  return (
    <div>
      <ol className="relative">
        {stages.map((s, i) => (
          <Reveal as="li" key={s.key} delay={revealDelay(i)}>
            <div
              className="grid gap-4 border-t py-8 sm:grid-cols-[auto_1fr] sm:gap-10"
              style={{ borderColor: "var(--g3-rule-faint)" }}
            >
              <div className="flex items-baseline gap-4 sm:w-40 sm:flex-col sm:gap-1">
                <span className="g3-meta">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-xs" style={{ color: "var(--g3-ink-faint)" }}>{s.duration}</span>
              </div>

              <div>
                <h3
                  className="mb-2 text-2xl font-semibold tracking-tight"
                  style={{ fontFamily: "var(--g3-font-display)", color: "var(--g3-ink)" }}
                >
                  {s.title}
                </h3>
                <p className="g3-body max-w-2xl">{s.what}</p>
                {!condensed && (
                  <p className="mt-3 text-sm" style={{ color: "var(--g3-brass-light)" }}>{s.client}</p>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </ol>

      {condensed && (
        <Reveal delay={0.2}>
          <Link href="/g3-builders/process" className="g3-link mt-8">
            See the full process <ChevronRight aria-hidden="true" />
          </Link>
        </Reveal>
      )}
    </div>
  );
}
