export const runtime = 'edge';

/** Portfolio (spec 4.2): filterable grid, filter persisted in the URL. */

import type { Metadata } from "next";
import { Suspense } from "react";
import { getProjects, G3_CATEGORIES } from "@/lib/g3-data";
import ProjectCard from "@/components/g3/ProjectCard";
import CategoryFilter from "@/components/g3/CategoryFilter";
import { Reveal, RevealImage } from "@/components/g3/Reveal";
import { revealDelay } from "@/components/g3/motion";

export const metadata: Metadata = {
  title: "Projects",
  description: "Residential, commercial and interior projects by G3 Builders & Architecture.",
};

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const valid =
    category && (G3_CATEGORIES as readonly string[]).includes(category) ? category : undefined;

  const [all, filtered] = await Promise.all([getProjects(), getProjects(valid)]);

  const counts: Record<string, number> = {};
  for (const c of G3_CATEGORIES) counts[c] = all.filter((p) => p.category === c).length;

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-32 md:pt-40">
      <Reveal>
        <span className="g3-meta">Portfolio</span>
        <h1 className="g3-display-xl mt-3" style={{ color: "var(--g3-ink)" }}>Projects</h1>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mb-12 mt-8">
          {/* useSearchParams needs a Suspense boundary during prerender. */}
          <Suspense fallback={null}>
            <CategoryFilter counts={counts} />
          </Suspense>
        </div>
      </Reveal>

      {filtered.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <RevealImage key={p.id} delay={revealDelay(i, 0.06)}>
              <ProjectCard project={p} priority={i < 3} />
            </RevealImage>
          ))}
        </div>
      ) : (
        <p className="g3-body py-16 text-center">
          {valid
            ? `No ${valid.toLowerCase()} projects published yet.`
            : "Projects are being added — check back shortly."}
        </p>
      )}
    </div>
  );
}
