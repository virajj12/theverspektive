export const runtime = 'edge';

/** About (spec 4.6): firm story, philosophy, team grid from the admin. */

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getTeam, getPageContent, getStats } from "@/lib/g3-data";
import { Reveal, RevealImage } from "@/components/g3/Reveal";
import { revealDelay } from "@/components/g3/motion";

export const metadata: Metadata = {
  title: "About",
  description:
    "G3 Builders & Architecture — who we are, how we work, and the team behind the projects.",
};

const PHILOSOPHY = [
  {
    title: "Buildable drawings",
    body: "A drawing that cannot be built on a real site with real labour is decoration. Ours are detailed to the point a contractor stops calling with questions.",
  },
  {
    title: "Budget first, always",
    body: "We design to your number from week one. Nobody should fall in love with a house they cannot afford and then watch it get value-engineered into something else.",
  },
  {
    title: "Materials that age well",
    body: "Coastal Karnataka is hard on buildings — salt, monsoon, sun. We specify for how something looks in year ten, not on handover day.",
  },
];

export default async function AboutPage() {
  const [team, page, stats] = await Promise.all([
    getTeam(),
    getPageContent("about"),
    getStats(),
  ]);

  const story =
    page.content.story ||
    "G3 Builders & Architecture works across coastal Karnataka on homes, commercial buildings and interiors. We are deliberately small: the people you meet at the first conversation are the same people on site when the concrete is poured.";

  return (
    <div className="pb-24 pt-32 md:pt-40">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <span className="g3-meta">About</span>
          <h1 className="g3-display-xl mt-3 max-w-3xl" style={{ color: "var(--g3-ink)" }}>
            Small enough to care. Equipped to deliver.
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="g3-body mt-8 max-w-2xl">{story}</p>
        </Reveal>
      </div>

      {/* Stats */}
      {stats.projects > 0 && (
        <section
          className="g3-wood-surface mt-20 border-y"
          style={{ borderColor: "var(--g3-rule-faint)" }}
        >
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-14 md:grid-cols-4">
            {[
              [stats.projects, "Projects delivered"],
              [stats.yearsActive, "Years active"],
              [stats.cities, "Locations served"],
              [team.length || "—", "People"],
            ].map(([value, label], i) => (
              <Reveal key={label as string} delay={revealDelay(i)}>
                <p
                  className="g3-display-md"
                  style={{ fontFamily: "var(--g3-font-mono)", color: "var(--g3-brass-light)" }}
                >
                  {value}
                </p>
                <p className="mt-1 text-sm" style={{ color: "var(--g3-ink-soft)" }}>{label}</p>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Philosophy */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <Reveal>
          <span className="g3-meta">How we think</span>
          <h2 className="g3-display-lg mb-12 mt-3" style={{ color: "var(--g3-ink)" }}>
            Three things we don&rsquo;t compromise on
          </h2>
        </Reveal>

        <div className="grid gap-10 md:grid-cols-3">
          {PHILOSOPHY.map((p, i) => (
            <Reveal key={p.title} delay={revealDelay(i)}>
              <h3
                className="mb-3 text-xl font-semibold tracking-tight"
                style={{ fontFamily: "var(--g3-font-display)", color: "var(--g3-ink)" }}
              >
                {p.title}
              </h3>
              <p className="g3-body">{p.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Team */}
      {team.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pb-8">
          <Reveal>
            <span className="g3-meta">The team</span>
            <h2 className="g3-display-lg mb-12 mt-3" style={{ color: "var(--g3-ink)" }}>
              Who you&rsquo;ll actually work with
            </h2>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((m, i) => (
              <RevealImage key={m.id} delay={revealDelay(i)}>
                <div
                  className="overflow-hidden rounded-xl border"
                  style={{ borderColor: "var(--g3-rule-faint)", background: "var(--g3-black-raised)" }}
                >
                  <div className="relative aspect-[4/5]" style={{ background: "var(--g3-wood)" }}>
                    {m.photoUrl && (
                      <Image
                        src={m.photoUrl}
                        alt={m.photoAlt || m.name}
                        fill
                        loading="lazy"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold" style={{ color: "var(--g3-ink)" }}>{m.name}</h3>
                    <p className="g3-meta mt-1">{m.role}</p>
                    {m.bio && <p className="g3-body mt-3 text-sm">{m.bio}</p>}
                  </div>
                </div>
              </RevealImage>
            ))}
          </div>
        </section>
      )}

      <div className="mx-auto max-w-6xl px-6 pt-16">
        <Reveal>
          <Link href="/g3-builders/contact" className="g3-link text-lg">
            Work with us <ChevronRight aria-hidden="true" />
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
