export const runtime = 'edge';

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ChevronRight, Phone, MessageCircle, Mail, MapPin, Clock } from "lucide-react";
import {
  getProjects,
  getServices,
  getTestimonials,
  getPageContent,
  getStats,
  getTeam,
  G3_CATEGORIES
} from "@/lib/g3-data";
import HeroShrinkReveal from "@/components/g3/HeroShrinkReveal";
import ProjectCard from "@/components/g3/ProjectCard";
import CategoryFilter from "@/components/g3/CategoryFilter";
import StackingProcess from "@/components/g3/StackingProcess";
import InquiryForm from "@/components/g3/InquiryForm";
import TestimonialCarousel from "@/components/g3/TestimonialCarousel";
import { Reveal, RevealImage } from "@/components/g3/Reveal";
import { revealDelay } from "@/components/g3/motion";
import { MaskedSection } from "@/components/g3/MaskedSection";

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

const FALLBACK_SERVICES = [
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

const PHONE_DISPLAY = "+91 98800 00000";
const PHONE_TEL = "+919880000000";
const WHATSAPP = "919880000000";
const EMAIL = "verspektive@gmail.com";

function relatedCategory(title: string): string | null {
  const t = title.toLowerCase();
  if (t.includes("interior")) return "Interiors";
  if (t.includes("architect")) return "Residential";
  if (t.includes("construction")) return "Commercial";
  return null;
}

export default async function G3Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const validCategory =
    category && (G3_CATEGORIES as readonly string[]).includes(category) ? category : undefined;

  const [
    allProjects,
    filteredProjects,
    team,
    homePage,
    aboutPage,
    stats,
    fromDbServices,
    testimonials
  ] = await Promise.all([
    getProjects(),
    getProjects(validCategory),
    getTeam(),
    getPageContent("home"),
    getPageContent("about"),
    getStats(),
    getServices(),
    getTestimonials()
  ]);

  const services = fromDbServices.length ? fromDbServices : FALLBACK_SERVICES;

  const counts: Record<string, number> = {};
  for (const c of G3_CATEGORIES) counts[c] = allProjects.filter((p) => p.category === c).length;

  const headline = homePage.content.heroHeadline || "We build what you'll live in for thirty years.";
  const tagline =
    homePage.content.heroTagline ||
    "Architecture, interiors and construction, delivered end to end by one team.";

  const story =
    aboutPage.content.story ||
    "G3 Builders & Architecture works across coastal Karnataka on homes, commercial buildings and interiors. We are deliberately small: the people you meet at the first conversation are the same people on site when the concrete is poured.";

  return (
    <>
      <HeroShrinkReveal heroImage={homePage.heroImage} headline={headline} tagline={tagline} />

      {/* PROJECTS SECTION */}
      <MaskedSection id="projects" type="circle" className="border-t border-white/5 !z-10">
        <div className="mx-auto max-w-6xl px-6 pb-24 pt-32 md:pt-40">
          <Reveal>
            <span className="g3-meta">Portfolio</span>
            <h1 className="g3-display-xl mt-3" style={{ color: "var(--g3-ink)" }}>Projects</h1>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mb-12 mt-8">
              <Suspense fallback={null}>
                <CategoryFilter counts={counts} />
              </Suspense>
            </div>
          </Reveal>

          {filteredProjects.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((p, i) => (
                <RevealImage key={p.id} delay={revealDelay(i, 0.06)}>
                  <ProjectCard project={p} priority={i < 3} />
                </RevealImage>
              ))}
            </div>
          ) : (
            <p className="g3-body py-16 text-center">
              {validCategory
                ? `No ${validCategory.toLowerCase()} projects published yet.`
                : "Projects are being added — check back shortly."}
            </p>
          )}
        </div>
      </MaskedSection>

      {/* SERVICES SECTION */}
      <MaskedSection id="services" type="vertical-blinds" className="border-t border-white/5 !z-20" innerClassName="g3-wood-surface">
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
              const related = cat ? allProjects.filter((p) => p.category === cat).slice(0, 3) : [];

              return (
                <section
                  key={s.id}
                  className="border-t py-16 md:py-20"
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

                      <Link href="#contact" className="g3-link mt-6">
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
      </MaskedSection>

      {/* PROCESS SECTION */}
      <MaskedSection id="process" type="diagonal" className="border-t border-white/5 !z-30">
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
          </div>

          <div className="mt-16">
            <StackingProcess />
          </div>

          <div className="mx-auto max-w-6xl px-6">
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
                  href="#contact"
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
      </MaskedSection>

      {/* ABOUT SECTION */}
      <MaskedSection id="about" type="spotlight" className="border-t border-white/5 !z-40" innerClassName="g3-wood-surface">
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
        </div>
      </MaskedSection>

      {/* CONTACT SECTION */}
      <MaskedSection id="contact" type="curtain" className="border-t border-white/5 !z-50">
        <div className="pb-24 pt-32 md:pt-40">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal>
              <span className="g3-meta">Get in touch</span>
              <h1 className="g3-display-xl mt-3 max-w-3xl" style={{ color: "var(--g3-ink)" }}>
                Tell us about your project.
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="g3-body mt-6 max-w-xl">
                Three fields to start. We&rsquo;ll call you back within two working days
                — no automated sequence, no mailing list.
              </p>
            </Reveal>

            <div className="mt-16 grid gap-14 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
              <Reveal delay={0.15}>
                <InquiryForm />
              </Reveal>

              <Reveal delay={0.25}>
                <div className="space-y-8">
                  <div>
                    <p className="g3-meta mb-4">Rather talk now?</p>
                    <div className="space-y-3">
                      <a
                        href={`tel:${PHONE_TEL}`}
                        className="flex items-center gap-3 rounded-lg border px-4 py-3.5 transition-colors"
                        style={{ borderColor: "var(--g3-rule-faint)", color: "var(--g3-ink)" }}
                      >
                        <Phone className="h-4 w-4 shrink-0" style={{ color: "var(--g3-brass)" }} aria-hidden="true" />
                        {PHONE_DISPLAY}
                      </a>
                      <a
                        href={`https://wa.me/${WHATSAPP}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 rounded-lg border px-4 py-3.5 transition-colors"
                        style={{ borderColor: "var(--g3-rule-faint)", color: "var(--g3-ink)" }}
                      >
                        <MessageCircle className="h-4 w-4 shrink-0" style={{ color: "var(--g3-brass)" }} aria-hidden="true" />
                        WhatsApp us
                      </a>
                      <a
                        href={`mailto:${EMAIL}`}
                        className="flex items-center gap-3 rounded-lg border px-4 py-3.5 transition-colors"
                        style={{ borderColor: "var(--g3-rule-faint)", color: "var(--g3-ink)" }}
                      >
                        <Mail className="h-4 w-4 shrink-0" style={{ color: "var(--g3-brass)" }} aria-hidden="true" />
                        {EMAIL}
                      </a>
                    </div>
                  </div>

                  <div className="g3-rule" />

                  <div>
                    <p className="g3-meta mb-3">Office</p>
                    <p className="flex items-start gap-3 g3-body">
                      <MapPin className="mt-1 h-4 w-4 shrink-0" style={{ color: "var(--g3-brass)" }} aria-hidden="true" />
                      Moodbidri, Dakshina Kannada<br />Karnataka, India
                    </p>
                  </div>

                  <div>
                    <p className="g3-meta mb-3">Hours</p>
                    <p className="flex items-start gap-3 g3-body">
                      <Clock className="mt-1 h-4 w-4 shrink-0" style={{ color: "var(--g3-brass)" }} aria-hidden="true" />
                      Monday&ndash;Saturday, 9:30am&ndash;6:30pm<br />
                      Site visits by appointment
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </MaskedSection>
    </>
  );
}
