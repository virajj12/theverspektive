export const runtime = 'edge';

/**
 * Server-side data access for the public G3 pages (spec 4).
 *
 * Every query resolves media by reference rather than returning raw ids, so
 * pages never have to do a second lookup to render an image.
 *
 * All of these swallow D1 failures and return empty rather than throwing. The
 * pages are a lead-generation surface: a database blip should degrade the
 * portfolio to an empty state with the contact CTA still standing, not take
 * the whole site down. Same defensive pattern the existing VerspeKtive pages
 * already use.
 */

import { getRequestContext } from "@cloudflare/next-on-pages";
import { drizzle } from "drizzle-orm/d1";
import {
  g3_projects,
  g3_project_media,
  g3_media,
  g3_services,
  g3_team_members,
  g3_testimonials,
  g3_pages,
} from "@/db/schema";
import { and, asc, desc, eq } from "drizzle-orm";
import { G3_CATEGORIES, type G3Image, type G3Project, type G3GalleryItem } from "./g3-constants";

// Re-exported so server components can keep importing everything from one place.
export { G3_CATEGORIES };
export type { G3Image, G3Project, G3GalleryItem };

function db() {
  const env = getRequestContext().env;
  if (!env?.DB) throw new Error("D1 binding unavailable");
  return drizzle(env.DB);
}

function toImage(row: {
  url: string | null;
  alt_text: string | null;
  width: number | null;
  height: number | null;
  type: string | null;
  thumbnail_url: string | null;
}): G3Image | null {
  if (!row?.url) return null;
  return {
    url: row.url,
    alt: row.alt_text || "",
    width: row.width,
    height: row.height,
    type: row.type || "image",
    thumbnailUrl: row.thumbnail_url,
  };
}

/** Published projects, optionally filtered by category (spec 4.2). */
export async function getProjects(category?: string): Promise<G3Project[]> {
  try {
    const d = db();
    const where = category && G3_CATEGORIES.includes(category as typeof G3_CATEGORIES[number])
      ? and(eq(g3_projects.published, true), eq(g3_projects.category, category))
      : eq(g3_projects.published, true);

    const rows = await d
      .select({
        p: g3_projects,
        url: g3_media.url,
        alt_text: g3_media.alt_text,
        width: g3_media.width,
        height: g3_media.height,
        type: g3_media.type,
        thumbnail_url: g3_media.thumbnail_url,
      })
      .from(g3_projects)
      .leftJoin(g3_media, eq(g3_projects.cover_media_id, g3_media.id))
      .where(where)
      .orderBy(asc(g3_projects.sort_order), desc(g3_projects.id))
      .all();

    return rows.map((r) => ({
      id: r.p.id,
      title: r.p.title,
      slug: r.p.slug,
      category: r.p.category,
      location: r.p.location,
      sqft: r.p.sqft,
      year: r.p.year,
      status: r.p.status,
      clientName: r.p.client_name,
      summary: r.p.summary,
      body: r.p.body,
      featured: r.p.featured,
      cover: toImage(r),
    }));
  } catch (e) {
    console.error("G3 getProjects failed:", e);
    return [];
  }
}

export async function getFeaturedProjects(limit = 4): Promise<G3Project[]> {
  const all = await getProjects();
  const featured = all.filter((p) => p.featured);
  // Fall back to the newest published work so the homepage strip is never
  // empty just because nobody has ticked "featured" yet.
  return (featured.length ? featured : all).slice(0, limit);
}

export async function getProjectBySlug(slug: string): Promise<{
  project: G3Project;
  gallery: G3GalleryItem[];
  prev: { slug: string; title: string } | null;
  next: { slug: string; title: string } | null;
} | null> {
  try {
    const d = db();
    const row = await d
      .select({
        p: g3_projects,
        url: g3_media.url,
        alt_text: g3_media.alt_text,
        width: g3_media.width,
        height: g3_media.height,
        type: g3_media.type,
        thumbnail_url: g3_media.thumbnail_url,
      })
      .from(g3_projects)
      .leftJoin(g3_media, eq(g3_projects.cover_media_id, g3_media.id))
      .where(and(eq(g3_projects.slug, slug), eq(g3_projects.published, true)))
      .get();

    if (!row) return null;

    const gallery = await d
      .select({
        caption: g3_project_media.caption,
        url: g3_media.url,
        alt_text: g3_media.alt_text,
        width: g3_media.width,
        height: g3_media.height,
        type: g3_media.type,
        thumbnail_url: g3_media.thumbnail_url,
      })
      .from(g3_project_media)
      .innerJoin(g3_media, eq(g3_project_media.media_id, g3_media.id))
      .where(eq(g3_project_media.project_id, row.p.id))
      .orderBy(asc(g3_project_media.sort_order))
      .all();

    // Prev/next follow the same order the portfolio grid uses.
    const ordered = await getProjects();
    const idx = ordered.findIndex((p) => p.slug === slug);
    const pick = (i: number) =>
      i >= 0 && i < ordered.length ? { slug: ordered[i].slug, title: ordered[i].title } : null;

    return {
      project: {
        id: row.p.id,
        title: row.p.title,
        slug: row.p.slug,
        category: row.p.category,
        location: row.p.location,
        sqft: row.p.sqft,
        year: row.p.year,
        status: row.p.status,
        clientName: row.p.client_name,
        summary: row.p.summary,
        body: row.p.body,
        featured: row.p.featured,
        cover: toImage(row),
      },
      gallery: gallery
        .map((g) => {
          const img = toImage(g);
          return img ? { ...img, caption: g.caption } : null;
        })
        .filter((g): g is G3GalleryItem => g !== null),
      prev: idx > 0 ? pick(idx - 1) : null,
      next: idx >= 0 ? pick(idx + 1) : null,
    };
  } catch (e) {
    console.error("G3 getProjectBySlug failed:", e);
    return null;
  }
}

export async function getServices() {
  try {
    const d = db();
    return await d
      .select({
        id: g3_services.id,
        title: g3_services.title,
        slug: g3_services.slug,
        summary: g3_services.summary,
        body: g3_services.body,
        iconUrl: g3_media.url,
        iconAlt: g3_media.alt_text,
      })
      .from(g3_services)
      .leftJoin(g3_media, eq(g3_services.icon_media_id, g3_media.id))
      .orderBy(asc(g3_services.sort_order), asc(g3_services.id))
      .all();
  } catch (e) {
    console.error("G3 getServices failed:", e);
    return [];
  }
}

export async function getTeam() {
  try {
    const d = db();
    return await d
      .select({
        id: g3_team_members.id,
        name: g3_team_members.name,
        role: g3_team_members.role,
        bio: g3_team_members.bio,
        photoUrl: g3_media.url,
        photoAlt: g3_media.alt_text,
      })
      .from(g3_team_members)
      .leftJoin(g3_media, eq(g3_team_members.photo_media_id, g3_media.id))
      .orderBy(asc(g3_team_members.sort_order), asc(g3_team_members.id))
      .all();
  } catch (e) {
    console.error("G3 getTeam failed:", e);
    return [];
  }
}

export async function getTestimonials() {
  try {
    const d = db();
    return await d
      .select({
        id: g3_testimonials.id,
        clientName: g3_testimonials.client_name,
        quote: g3_testimonials.quote,
        rating: g3_testimonials.rating,
        projectTitle: g3_projects.title,
        projectSlug: g3_projects.slug,
      })
      .from(g3_testimonials)
      .leftJoin(g3_projects, eq(g3_testimonials.project_id, g3_projects.id))
      .orderBy(asc(g3_testimonials.sort_order), asc(g3_testimonials.id))
      .all();
  } catch (e) {
    console.error("G3 getTestimonials failed:", e);
    return [];
  }
}

/**
 * CMS content for a page, as { section_key: value }, plus any hero media.
 * Lets copy and hero imagery be swapped from the admin with no deploy (spec 5).
 */
export async function getPageContent(slug: string): Promise<{
  content: Record<string, string>;
  heroImage: G3Image | null;
}> {
  try {
    const d = db();
    const rows = await d
      .select({
        section_key: g3_pages.section_key,
        value: g3_pages.value,
        url: g3_media.url,
        alt_text: g3_media.alt_text,
        width: g3_media.width,
        height: g3_media.height,
        type: g3_media.type,
        thumbnail_url: g3_media.thumbnail_url,
      })
      .from(g3_pages)
      .leftJoin(g3_media, eq(g3_pages.hero_media_id, g3_media.id))
      .where(eq(g3_pages.slug, slug))
      .all();

    const content: Record<string, string> = {};
    let heroImage: G3Image | null = null;
    for (const r of rows) {
      if (r.section_key) content[r.section_key] = r.value ?? "";
      if (!heroImage) heroImage = toImage(r);
    }
    return { content, heroImage };
  } catch (e) {
    console.error("G3 getPageContent failed:", e);
    return { content: {}, heroImage: null };
  }
}

/** Aggregate counts for the homepage credibility bar (spec 4.1). */
export async function getStats() {
  try {
    const projects = await getProjects();
    const totalSqft = projects.reduce((s, p) => s + (p.sqft || 0), 0);
    const cities = new Set(projects.map((p) => p.location).filter(Boolean));
    const years = projects.map((p) => p.year).filter((y): y is number => Boolean(y));
    return {
      projects: projects.length,
      sqft: totalSqft,
      cities: cities.size,
      yearsActive: years.length ? new Date().getFullYear() - Math.min(...years) + 1 : 0,
    };
  } catch {
    return { projects: 0, sqft: 0, cities: 0, yearsActive: 0 };
  }
}
