export const runtime = 'edge';

/**
 * G3 home (spec 4.1): cinematic hero, featured projects, services bento,
 * process teaser, stats bar, testimonials, final CTA.
 *
 * All content comes from the admin — hero copy and imagery via g3_pages,
 * projects/services/testimonials from their own tables. Nothing here is
 * hardcoded except the fallback copy used when the CMS row is absent, which
 * is what keeps the page presentable on a fresh install.
 */

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  getFeaturedProjects,
  getServices,
  getTestimonials,
  getPageContent,
  getStats,
} from "@/lib/g3-data";
import HeroShrinkReveal from "@/components/g3/HeroShrinkReveal";
import PinnedProjectShowcase from "@/components/g3/PinnedProjectShowcase";
import ServicesBento from "@/components/g3/ServicesBento";
import ProcessTimeline from "@/components/g3/ProcessTimeline";
import TestimonialCarousel from "@/components/g3/TestimonialCarousel";
import { Reveal } from "@/components/g3/Reveal";
import { revealDelay } from "@/components/g3/motion";

function formatSqft(n: number) {
  if (n >= 100000) return `${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `${Math.round(n / 1000)}k`;
  return String(n);
}

export default async function G3Home() {
  const [featured, services, testimonials, page, stats] = await Promise.all([
    getFeaturedProjects(4),
    getServices(),
    getTestimonials(),
    getPageContent("home"),
    getStats(),
  ]);

  const headline = page.content.heroHeadline || "We build what you'll live in for thirty years.";
  const tagline =
    page.content.heroTagline ||
    "Architecture, interiors and construction, delivered end to end by one team.";

  return (
    <>
      {/* ── Hero: signature shrink-and-reveal (spec 3a) ── */}
      <HeroShrinkReveal heroImage={page.heroImage} headline={headline} tagline={tagline} />

      {/* ── Featured work: pinned horizontal showcase (spec 3a) ── */}
      <PinnedProjectShowcase projects={featured} />

      {/* ── Services bento ── */}
      {services.length > 0 && (
        <section className="g3-surface-raised">
          <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
            <Reveal>
              <span className="g3-meta">What we do</span>
              <h2 className="g3-display-lg mb-10 mt-3" style={{ color: "var(--g3-ink)" }}>
                One team, start to finish
              </h2>
            </Reveal>
            <ServicesBento services={services} />
          </div>
        </section>
      )}

      {/* ── Process teaser ── */}
      <section className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <Reveal>
          <span className="g3-meta">How it works</span>
          <h2 className="g3-display-lg mb-10 mt-3" style={{ color: "var(--g3-ink)" }}>
            You always know what happens next
          </h2>
        </Reveal>
        <ProcessTimeline condensed />
      </section>

      {/* ── Stats ── */}
      {stats.projects > 0 && (
        <section className="g3-wood-surface border-y" style={{ borderColor: "var(--g3-rule-faint)" }}>
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-16 md:grid-cols-4">
            {[
              [stats.projects, "Projects delivered"],
              [stats.yearsActive, "Years active"],
              [formatSqft(stats.sqft), "Sq ft built"],
              [stats.cities, "Locations served"],
            ].map(([value, label], i) => (
              <Reveal key={label as string} delay={revealDelay(i)}>
                <p className="g3-display-md" style={{ fontFamily: "var(--g3-font-mono)", color: "var(--g3-brass-light)" }}>
                  {value}
                </p>
                <p className="mt-1 text-sm" style={{ color: "var(--g3-ink-soft)" }}>{label}</p>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ── Testimonials ── */}
      {testimonials.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <Reveal>
            <span className="g3-meta">Clients</span>
            <h2 className="g3-display-lg mb-10 mt-3" style={{ color: "var(--g3-ink)" }}>
              In their words
            </h2>
          </Reveal>
          <TestimonialCarousel items={testimonials} />
        </section>
      )}

      {/* ── Final CTA ── */}
      <section className="g3-surface-raised border-t" style={{ borderColor: "var(--g3-rule-faint)" }}>
        <div className="mx-auto max-w-3xl px-6 py-24 text-center md:py-32">
          <Reveal>
            <h2 className="g3-display-lg" style={{ color: "var(--g3-ink)" }}>
              Have a site and an idea?
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="g3-body mx-auto mt-5 max-w-lg">
              Tell us what you&rsquo;re planning. The first conversation costs nothing
              and usually clarifies more than you expect.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <Link
              href="/g3-builders/contact"
              className="mt-9 inline-flex items-center gap-2 rounded-full px-7 py-4 text-base font-semibold"
              style={{ background: "var(--g3-brass)", color: "#0a0908" }}
            >
              Book a consultation
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
