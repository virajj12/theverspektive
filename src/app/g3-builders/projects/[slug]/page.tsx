export const runtime = 'edge';

/**
 * Project detail (spec 4.3): full-bleed hero, metadata block, narrative,
 * gallery, prev/next navigation.
 *
 * Emits per-project structured data and an Open Graph image (spec 7) so a
 * shared project link previews with its own cover rather than a generic card.
 */

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getProjectBySlug } from "@/lib/g3-data";
import { Reveal, RevealImage } from "@/components/g3/Reveal";
import { revealDelay } from "@/components/g3/motion";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProjectBySlug(slug);
  if (!data) return { title: "Project not found" };

  const { project } = data;
  return {
    title: project.title,
    description: project.summary || `${project.category} project by G3 Builders & Architecture.`,
    openGraph: {
      title: project.title,
      description: project.summary || undefined,
      images: project.cover ? [{ url: project.cover.url, alt: project.cover.alt }] : undefined,
    },
  };
}

export default async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getProjectBySlug(slug);
  if (!data) notFound();

  const { project, gallery, prev, next } = data;

  const meta: [string, string | number][] = (
    [
      ["Client", project.clientName],
      ["Location", project.location],
      ["Sq ft", project.sqft ? project.sqft.toLocaleString("en-IN") : null],
      ["Year", project.year],
      ["Scope", project.category],
      ["Status", project.status],
    ] as [string, string | number | null][]
  ).filter((entry): entry is [string, string | number] => entry[1] != null);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary || undefined,
    image: project.cover?.url,
    dateCreated: project.year ? String(project.year) : undefined,
    creator: { "@type": "Organization", name: "G3 Builders & Architecture" },
    locationCreated: project.location ? { "@type": "Place", name: project.location } : undefined,
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="relative flex min-h-[70svh] items-end overflow-hidden">
        <div className="absolute inset-0">
          {project.cover ? (
            <Image
              src={project.cover.url}
              alt={project.cover.alt || project.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <div className="g3-wood-surface absolute inset-0" />
          )}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(10,9,8,0.95) 10%, rgba(10,9,8,0.3) 60%, rgba(10,9,8,0.6) 100%)" }}
          />
        </div>

        <div className="relative mx-auto w-full max-w-5xl px-6 pb-16 pt-32">
          <Reveal>
            <span className="g3-meta">{project.category}</span>
            <h1 className="g3-display-xl mt-3" style={{ color: "var(--g3-ink)" }}>{project.title}</h1>
          </Reveal>
        </div>
      </section>

      {/* Metadata */}
      <section className="border-b" style={{ borderColor: "var(--g3-rule-faint)" }}>
        <dl className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-6 py-10 sm:grid-cols-3 lg:grid-cols-6">
          {meta.map(([label, value], i) => (
            <Reveal key={label} delay={revealDelay(i, 0.05)}>
              <dt className="g3-meta mb-1.5">{label}</dt>
              <dd className="text-sm capitalize" style={{ color: "var(--g3-ink)" }}>{value}</dd>
            </Reveal>
          ))}
        </dl>
      </section>

      {/* Narrative */}
      {(project.summary || project.body) && (
        <section className="mx-auto max-w-3xl px-6 py-20 md:py-28">
          {project.summary && (
            <Reveal>
              <p className="g3-display-md mb-8" style={{ color: "var(--g3-ink)" }}>{project.summary}</p>
            </Reveal>
          )}
          {project.body && (
            <Reveal delay={0.1}>
              <div className="g3-body space-y-5">
                {project.body.split(/\n{2,}/).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </Reveal>
          )}
        </section>
      )}

      {/* Gallery */}
      {gallery.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="grid gap-5 sm:grid-cols-2">
            {gallery.map((g, i) => (
              <RevealImage
                key={`${g.url}-${i}`}
                delay={revealDelay(i, 0.06)}
                /* Every third image runs full width so the gallery has rhythm
                   rather than reading as an even, monotonous grid. */
                className={i % 3 === 0 ? "sm:col-span-2" : ""}
              >
                <figure>
                  <div
                    className="relative overflow-hidden rounded-xl"
                    style={{ aspectRatio: i % 3 === 0 ? "16 / 9" : "4 / 3", background: "var(--g3-black-raised)" }}
                  >
                    {g.type === "video" ? (
                      /* preload="none" + poster keeps gallery video off the
                         mobile page weight until it is actually played. */
                      <video
                        src={g.url}
                        poster={g.thumbnailUrl || undefined}
                        controls
                        preload="none"
                        playsInline
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Image
                        src={g.url}
                        alt={g.alt}
                        fill
                        loading="lazy"
                        sizes={i % 3 === 0 ? "(max-width: 640px) 100vw, 1152px" : "(max-width: 640px) 100vw, 576px"}
                        className="object-cover"
                      />
                    )}
                  </div>
                  {g.caption && (
                    <figcaption className="mt-2.5 text-sm" style={{ color: "var(--g3-ink-faint)" }}>
                      {g.caption}
                    </figcaption>
                  )}
                </figure>
              </RevealImage>
            ))}
          </div>
        </section>
      )}

      {/* Prev / next */}
      <nav className="border-t" style={{ borderColor: "var(--g3-rule-faint)" }}>
        <div className="mx-auto flex max-w-5xl items-stretch justify-between gap-4 px-6 py-10">
          {prev ? (
            <Link href={`/g3-builders/projects/${prev.slug}`} className="flex-1">
              <span className="g3-meta flex items-center gap-1">
                <ChevronLeft className="h-3 w-3" /> Previous
              </span>
              <p className="mt-1.5 font-medium" style={{ color: "var(--g3-ink)" }}>{prev.title}</p>
            </Link>
          ) : (
            <div className="flex-1" />
          )}

          {next ? (
            <Link href={`/g3-builders/projects/${next.slug}`} className="flex-1 text-right">
              <span className="g3-meta flex items-center justify-end gap-1">
                Next <ChevronRight className="h-3 w-3" />
              </span>
              <p className="mt-1.5 font-medium" style={{ color: "var(--g3-ink)" }}>{next.title}</p>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
        </div>
      </nav>
    </article>
  );
}
