export const runtime = 'edge';

/**
 * Single project (spec 5a): edit fields, set cover, toggle featured/published,
 * and manage the gallery — add, reorder, caption, remove.
 *
 * The gallery is sent as a complete ordered array and replaced wholesale.
 * Drag-and-drop reordering produces a new order for every row at once, so
 * diffing individual moves would be more code for the same result; replacing
 * also guarantees sort_order is always dense and conflict-free.
 */

import { getSession } from "@/lib/auth";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { drizzle } from "drizzle-orm/d1";
import { g3_projects, g3_project_media, g3_media } from "@/db/schema";
import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import { CATEGORIES, STATUSES } from "../route";

const patchSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  category: z.enum(CATEGORIES).optional(),
  location: z.string().max(200).nullable().optional(),
  sqft: z.number().int().positive().nullable().optional(),
  year: z.number().int().min(1900).max(2200).nullable().optional(),
  status: z.enum(STATUSES).optional(),
  clientName: z.string().max(200).nullable().optional(),
  summary: z.string().max(2000).nullable().optional(),
  body: z.string().max(20000).nullable().optional(),
  coverMediaId: z.number().int().positive().nullable().optional(),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  gallery: z.array(z.object({
    mediaId: z.number().int().positive(),
    caption: z.string().max(500).nullable().optional(),
  })).max(200).optional(),
});

async function parseId(params: Promise<{ id: string }>) {
  const { id } = await params;
  const n = Number(id);
  return Number.isInteger(n) && n > 0 ? n : null;
}

export async function GET(_r: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const id = await parseId(ctx.params);
    if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    const db = drizzle(getRequestContext().env.DB);
    const project = await db.select().from(g3_projects).where(eq(g3_projects.id, id)).get();
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const gallery = await db
      .select({
        rowId: g3_project_media.id,
        mediaId: g3_media.id,
        caption: g3_project_media.caption,
        sortOrder: g3_project_media.sort_order,
        url: g3_media.url,
        thumbnailUrl: g3_media.thumbnail_url,
        type: g3_media.type,
        altText: g3_media.alt_text,
      })
      .from(g3_project_media)
      .innerJoin(g3_media, eq(g3_project_media.media_id, g3_media.id))
      .where(eq(g3_project_media.project_id, id))
      .orderBy(asc(g3_project_media.sort_order))
      .all();

    return NextResponse.json({ success: true, project, gallery });
  } catch (error) {
    console.error("G3 project get error:", error);
    return NextResponse.json({ error: "Could not load the project." }, { status: 500 });
  }
}

export async function PATCH(request: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const id = await parseId(ctx.params);
    if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    const parsed = patchSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }
    const d = parsed.data;

    const db = drizzle(getRequestContext().env.DB);
    const existing = await db.select().from(g3_projects).where(eq(g3_projects.id, id)).get();
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Only touch columns that were actually sent.
    const fields: Record<string, unknown> = { updated_at: new Date() };
    if (d.title !== undefined) fields.title = d.title;
    if (d.category !== undefined) fields.category = d.category;
    if (d.location !== undefined) fields.location = d.location;
    if (d.sqft !== undefined) fields.sqft = d.sqft;
    if (d.year !== undefined) fields.year = d.year;
    if (d.status !== undefined) fields.status = d.status;
    if (d.clientName !== undefined) fields.client_name = d.clientName;
    if (d.summary !== undefined) fields.summary = d.summary;
    if (d.body !== undefined) fields.body = d.body;
    if (d.featured !== undefined) fields.featured = d.featured;
    if (d.published !== undefined) fields.published = d.published;
    if (d.sortOrder !== undefined) fields.sort_order = d.sortOrder;

    if (d.coverMediaId !== undefined) {
      if (d.coverMediaId !== null) {
        const m = await db.select({ id: g3_media.id }).from(g3_media).where(eq(g3_media.id, d.coverMediaId)).get();
        if (!m) return NextResponse.json({ error: "Cover image does not exist" }, { status: 400 });
      }
      fields.cover_media_id = d.coverMediaId;
    }

    await db.update(g3_projects).set(fields).where(eq(g3_projects.id, id));

    if (d.gallery) {
      // Reject unknown media before destroying the current gallery, so a bad
      // payload can't leave the project with no images.
      for (const item of d.gallery) {
        const m = await db.select({ id: g3_media.id }).from(g3_media).where(eq(g3_media.id, item.mediaId)).get();
        if (!m) {
          return NextResponse.json({ error: `Media #${item.mediaId} does not exist` }, { status: 400 });
        }
      }

      await db.delete(g3_project_media).where(eq(g3_project_media.project_id, id));
      if (d.gallery.length) {
        await db.insert(g3_project_media).values(
          d.gallery.map((item, i) => ({
            project_id: id,
            media_id: item.mediaId,
            sort_order: i,
            caption: item.caption ?? null,
          }))
        );
      }
    }

    const project = await db.select().from(g3_projects).where(eq(g3_projects.id, id)).get();
    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error("G3 project patch error:", error);
    return NextResponse.json({ error: "Could not save the project." }, { status: 500 });
  }
}

export async function DELETE(_r: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const id = await parseId(ctx.params);
    if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    const db = drizzle(getRequestContext().env.DB);
    // Clear join rows first so no orphans survive the project.
    await db.delete(g3_project_media).where(eq(g3_project_media.project_id, id));
    await db.delete(g3_projects).where(eq(g3_projects.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("G3 project delete error:", error);
    return NextResponse.json({ error: "Could not delete the project." }, { status: 500 });
  }
}
