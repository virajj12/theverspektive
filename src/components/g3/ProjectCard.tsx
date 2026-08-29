"use client";

/**
 * Project card (spec 4.2): full-bleed image, name, location, category tag.
 * Deliberately minimal — the spec says "no clutter".
 *
 * The hover overlay has an always-visible equivalent on touch (spec 6): where
 * there is no hover, the metadata sits permanently over a gradient scrim
 * rather than being hidden behind an interaction that can never fire.
 */

import Link from "next/link";
import Image from "next/image";
import type { G3Project } from "@/lib/g3-data";

export default function ProjectCard({ project, priority = false }: { project: G3Project; priority?: boolean }) {
  return (
    <Link href={`/g3-builders/projects/${project.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl" style={{ background: "var(--g3-black-raised)" }}>
        {project.cover ? (
          <Image
            src={project.cover.url}
            alt={project.cover.alt || project.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
            className="object-cover transition-transform duration-700 will-change-transform group-hover:scale-[1.04]"
          />
        ) : (
          <div className="g3-wood-surface absolute inset-0" />
        )}

        {/* Scrim: always present on touch, strengthens on hover where available. */}
        <div
          className="absolute inset-0 transition-opacity duration-500 md:opacity-80 md:group-hover:opacity-100"
          style={{ background: "linear-gradient(to top, rgba(10,9,8,0.92) 0%, rgba(10,9,8,0.25) 45%, transparent 70%)" }}
        />

        <div className="absolute inset-x-0 bottom-0 p-5">
          <span className="g3-meta">{project.category}</span>
          <h3 className="mt-1.5 text-xl font-semibold tracking-tight" style={{ fontFamily: "var(--g3-font-display)", color: "var(--g3-ink)" }}>
            {project.title}
          </h3>
          {(project.location || project.year) && (
            <p className="mt-0.5 text-sm" style={{ color: "var(--g3-ink-faint)" }}>
              {[project.location, project.year].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
