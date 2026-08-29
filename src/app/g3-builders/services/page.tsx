export const runtime = 'edge';

/**
 * Services (spec 4.4): deep-dive per service with scope description and
 * related project links.
 *
 * Services come from the admin; the related-project strip is derived by
 * matching a service title against project categories, so linking happens
 * automatically as new projects are published rather than needing a manual
 * join table the admin would have to maintain.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getServices, getProjects } from "@/lib/g3-data";
import ProjectCard from "@/components/g3/ProjectCard";
import { Reveal, RevealImage } from "@/components/g3/Reveal";
import { revealDelay } from "@/components/g3/motion";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Architecture, interior design, construction management and renovation — delivered end to end by G3 Builders.",
};

/** Fallbacks so the page is presentable before the admin adds real entries. */
const FALLBACK = [
  {
    id: -1,
    title: "Architecture",
    slug: "architecture",
    summary: "Concept through sanction and construction drawings.",
    body: "Site study, massing, planning and the full drawing set — developed against your budget from the first week rather than value-engineered down after you have fallen for something unaffordable.",
    iconUrl: null,
    iconAlt: null,
  },
  {
    id: -2,
    title: "Interior Design",
    slug: "interior-design",
    summary: "Interiors resolved to the last switch plate.",
    body: "Spatial planning, joinery detailing, material and lighting selection, and procurement support — with drawings your carpenter can actually build from.",
    iconUrl: null,
    iconAlt: null,
  },
  {
    id: -3,
    title: "Construction Management",
    slug: "construction-management",
    summary: "Execution with our own site team.",
    body: "Contractor coordination, staged billing tied to milestones, quality checks at every pour and finish, and weekly progress you can see rather than take on trust.",
    iconUrl: null,
    iconAlt: null,
  },
  {
    id: -4,
    title: "Renovation",
    slug: "renovation",
    summary: "Working with what is already standing.",
    body: "Structural assessment, phased work that keeps a home liveable where possible, and honest advice about when rebuilding costs less than retrofitting.",
    iconUrl: null,
    iconAlt: null,
  },
];

/** Loose match between a service and the project categories it relates to. */
function relatedCategory(title: string): string | null {
  const t = title.toLowerCase();
  if (t.includes("interior")) return "Interiors";
  if (t.includes("architect")) return "Residential";
  if (t.includes("construction")) return "Commercial";
  return null;
}

export default async function ServicesPage() {
  const [fromDb, projects] = await Promise.all([getServices(), getProjects()]);
  const services = fromDb.length ? fromDb : FALLBACK;

  return (
    <div className="pb-24 pt-32 md:pt-40">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <span className="g3-meta">What we do</span>
          <h1 className="g3-display-xl mt-3 max-w-3xl" style={{ color: "var(--g3-ink)" }}>
            Four disciplines, one accountable team.
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="g3-body mt-6 max-w-2xl">
            Most projects go wrong in the gaps between the architect, the interior
            designer and the contractor. We hold all three, so there are no gaps
            to fall through.
          </p>
        </Reveal>
      </div>

      <div className="mx-auto mt-20 max-w-6xl px-6">
        {services.map((s, i) => {
          const cat = relatedCategory(s.title);
          const related = cat ? projects.filter((p) => p.category === cat).slice(0, 3) : [];

          return (
            <section
              key={s.id}
              id={s.slug}
              className="scroll-mt-28 border-t py-16 md:py-20"
              style={{ borderColor: "var(--g3-rule-faint)" }}
            >
              <div className="grid gap-8 md:grid-cols-[1fr_1.4fr] md:gap-16">
                <Reveal>
                  <span className="g3-meta">{String(i + 1).padStart(2, "0")}</span>
                  <h2 className="g3-display-md mt-3" style={{ color: "var(--g3-ink)" }}>{s.title}</h2>
                </Reveal>

                <Reveal delay={0.08}>
                  {s.summary && (
                    <p className="mb-4 text-xl" style={{ color: "var(--g3-ink)" }}>{s.summary}</p>
                  )}
                  {s.body && <p className="g3-body">{s.body}</p>}

                  <Link href="/g3-builders/contact" className="g3-link mt-6">
                    Discuss a {s.title.toLowerCase()} project <ChevronRight aria-hidden="true" />
                  </Link>
                </Reveal>
              </div>

              {related.length > 0 && (
                <div className="mt-12">
                  <p className="g3-meta mb-5">Related work</p>
                  <div className="grid gap-5 sm:grid-cols-3">
                    {related.map((p, j) => (
                      <RevealImage key={p.id} delay={revealDelay(j)}>
                        <ProjectCard project={p} />
                      </RevealImage>
                    ))}
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
