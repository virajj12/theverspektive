export const runtime = 'edge';

import { getSession } from "@/lib/auth";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { drizzle } from "drizzle-orm/d1";
import { g3_projects } from "@/db/schema";
import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";

export const CATEGORIES = ["Residential", "Commercial", "Interiors", "Concept"] as const;
export const STATUSES = ["completed", "in-progress", "concept"] as const;

const createSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  category: z.enum(CATEGORIES),
  location: z.string().max(200).optional(),
  sqft: z.number().int().positive().optional(),
  year: z.number().int().min(1900).max(2200).optional(),
  status: z.enum(STATUSES).optional(),
  clientName: z.string().max(200).optional(),
  summary: z.string().max(2000).optional(),
  body: z.string().max(20000).optional(),
});

/** URL-safe slug; uniqueness is enforced by the caller against existing rows. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80) || "project";
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const db = drizzle(getRequestContext().env.DB);
    const projects = await db.select().from(g3_projects)
      .orderBy(asc(g3_projects.sort_order), asc(g3_projects.id)).all();

    return NextResponse.json({ success: true, projects });
  } catch (error) {
    console.error("G3 projects list error:", error);
    return NextResponse.json({ error: "Could not load projects." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const parsed = createSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }
    const d = parsed.data;

    const db = drizzle(getRequestContext().env.DB);

    // Ensure a unique slug rather than letting the constraint 500.
    const base = slugify(d.title);
    let slug = base;
    for (let i = 2; i < 200; i++) {
      const clash = await db.select({ id: g3_projects.id }).from(g3_projects).where(eq(g3_projects.slug, slug)).get();
      if (!clash) break;
      slug = `${base}-${i}`;
    }

    const now = new Date();
    const inserted = await db.insert(g3_projects).values({
      title: d.title,
      slug,
      category: d.category,
      location: d.location ?? null,
      sqft: d.sqft ?? null,
      year: d.year ?? null,
      status: d.status ?? "completed",
      client_name: d.clientName ?? null,
      cover_media_id: null,
      summary: d.summary ?? null,
      body: d.body ?? null,
      featured: false,
      published: false,   // new projects start as drafts
      sort_order: 0,
      created_at: now,
      updated_at: now,
    }).returning();

    return NextResponse.json({ success: true, project: inserted[0] });
  } catch (error) {
    console.error("G3 project create error:", error);
    return NextResponse.json({ error: "Could not create the project." }, { status: 500 });
  }
}
