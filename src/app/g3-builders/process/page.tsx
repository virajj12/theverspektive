export const runtime = 'edge';

/** Process (spec 4.5): full timeline, each stage with duration and exchange. */

import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ProcessTimeline from "@/components/g3/ProcessTimeline";
import { Reveal } from "@/components/g3/Reveal";

export const metadata: Metadata = {
  title: "Process",
  description:
    "Concept, design, approvals, construction, handover — what happens at each stage of a G3 Builders project, and how long it takes.",
};

export default function ProcessPage() {
  return (
    <div className="pb-24 pt-32 md:pt-40">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <span className="g3-meta">How it works</span>
          <h1 className="g3-display-xl mt-3 max-w-3xl" style={{ color: "var(--g3-ink)" }}>
            Five stages. No surprises in the middle.
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="g3-body mt-6 max-w-2xl">
            Durations below are typical, not promises — a hillside plot with a
            tricky approach road takes longer than a flat urban site. We tell you
            which one you have at the concept stage, not halfway through.
          </p>
        </Reveal>

        <div className="mt-16">
          <ProcessTimeline />
        </div>

        <Reveal delay={0.15}>
          <div
            className="g3-wood-surface mt-16 rounded-xl border p-8 md:p-12"
            style={{ borderColor: "var(--g3-rule-faint)" }}
          >
            <h2 className="g3-display-md mb-4" style={{ color: "var(--g3-ink)" }}>
              Start with a conversation
            </h2>
            <p className="g3-body mb-7 max-w-xl">
              Bring your site documents and a rough budget. We&rsquo;ll tell you
              honestly whether what you want fits what you have.
            </p>
            <Link
              href="/g3-builders/contact"
              className="inline-flex items-center gap-2 rounded-full px-7 py-4 text-base font-semibold"
              style={{ background: "var(--g3-brass)", color: "#0a0908" }}
            >
              Book a consultation
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
