export const runtime = 'edge';

import { Suspense } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getProjects, G3_CATEGORIES } from "@/lib/g3-data";
import CategoryFilter from "@/components/g3/CategoryFilter";
import ProjectCard from "@/components/g3/ProjectCard";
import { Reveal, RevealImage } from "@/components/g3/Reveal";
import { revealDelay } from "@/components/g3/motion";
import MouseScaleGallery from "@/components/g3/MouseScaleGallery";

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const allProjects = await getProjects();
  const dynamicCategories = Array.from(new Set([...G3_CATEGORIES, ...allProjects.map(p => p.category)]));
  
  const validCategory = category && dynamicCategories.includes(category) ? category : undefined;
  const filteredProjects = validCategory ? allProjects.filter(p => p.category === validCategory) : allProjects;

  const counts: Record<string, number> = {};
  for (const c of dynamicCategories) counts[c] = allProjects.filter((p) => p.category === c).length;

  return (
    <div className="bg-background min-h-screen pt-32 pb-24 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* HEADER */}
        <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-black/10 dark:border-white/10 pb-8 transition-colors duration-300">
          <div>
            <Reveal>
              <h1 className="g3-display-xl text-foreground transition-colors duration-300">Portfolio</h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="g3-body mt-4 max-w-xl !text-muted-foreground transition-colors duration-300">
                Explore our selected works across coastal Karnataka, ranging from residential builds to commercial spaces and interior execution.
              </p>
            </Reveal>
          </div>
          
          <Reveal delay={0.2}>
            <Suspense fallback={null}>
              <CategoryFilter counts={counts} />
            </Suspense>
          </Reveal>
        </div>

        {/* PROJECTS GRID */}
        {!filteredProjects.length ? (
          <Reveal delay={0.3}>
            <div className="py-32 text-center flex flex-col items-center">
              <p className="text-2xl font-light opacity-60 mb-6 text-foreground transition-colors duration-300">
                {validCategory
                  ? `No ${validCategory.toLowerCase()} projects published yet.`
                  : "Projects are being added — check back shortly."}
              </p>
              <Link href="/g3-builders" className="g3-link text-foreground transition-colors duration-300">
                Return to Home <ChevronRight aria-hidden="true" className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={0.4}>
            <MouseScaleGallery projects={filteredProjects} />
          </Reveal>
        )}

      </div>
    </div>
  );
}
