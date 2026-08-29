export const runtime = 'edge';

/**
 * Media library collection endpoint (spec 5a).
 *
 *   GET  — list the library, each row annotated with where it is used so the
 *          admin can tell at a glance what is safe to delete.
 *   POST — step 2 of the upload: record an asset that has already landed in R2.
 */

import { getSession } from "@/lib/auth";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { drizzle } from "drizzle-orm/d1";
import {
  g3_media,
  g3_projects,
  g3_project_media,
  g3_services,
  g3_team_members,
  g3_pages,
} from "@/db/schema";
import { NextResponse } from "next/server";
import { desc, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { kindOf } from "@/lib/g3-media";

const createSchema = z.object({
  r2Key: z.string().min(1).max(400),
  url: z.string().url(),
  mimeType: z.string().min(1).max(120),
  sizeBytes: z.number().int().positive().optional(),
  // Spec 5a: "Require alt text on upload" — it feeds the SEO goals in spec 7.
  altText: z.string().min(1, "Alt text is required for every asset").max(500),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  durationSeconds: z.number().int().nonnegative().optional(),
  thumbnailR2Key: z.string().max(400).optional(),
  thumbnailUrl: z.string().url().optional(),
});

export async function GET() {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = drizzle(getRequestContext().env.DB);
    const items = await db.select().from(g3_media).orderBy(desc(g3_media.uploaded_at)).all();

    if (items.length === 0) {
      return NextResponse.json({ success: true, media: [] });
    }

    // Build a usage map in four bulk queries rather than N per asset.
    const ids = items.map((m) => m.id);
    const [galleries, covers, services, team, heroes] = await Promise.all([
      db.select({ mediaId: g3_project_media.media_id, projectId: g3_project_media.project_id })
        .from(g3_project_media).where(inArray(g3_project_media.media_id, ids)).all(),
      db.select({ id: g3_projects.id, title: g3_projects.title, mediaId: g3_projects.cover_media_id })
        .from(g3_projects).where(inArray(g3_projects.cover_media_id, ids)).all(),
      db.select({ title: g3_services.title, mediaId: g3_services.icon_media_id })
        .from(g3_services).where(inArray(g3_services.icon_media_id, ids)).all(),
      db.select({ name: g3_team_members.name, mediaId: g3_team_members.photo_media_id })
        .from(g3_team_members).where(inArray(g3_team_members.photo_media_id, ids)).all(),
      db.select({ slug: g3_pages.slug, mediaId: g3_pages.hero_media_id })
        .from(g3_pages).where(inArray(g3_pages.hero_media_id, ids)).all(),
    ]);

    const projectTitles = new Map<number, string>();
    const allProjects = await db.select({ id: g3_projects.id, title: g3_projects.title }).from(g3_projects).all();
    allProjects.forEach((p) => projectTitles.set(p.id, p.title));

    const usage = new Map<number, string[]>();
    const add = (mediaId: number | null, label: string) => {
      if (mediaId == null) return;
      const list = usage.get(mediaId) || [];
      if (!list.includes(label)) list.push(label);
      usage.set(mediaId, list);
    };

    galleries.forEach((g) => add(g.mediaId, `Gallery: ${projectTitles.get(g.projectId) ?? `project #${g.projectId}`}`));
    covers.forEach((c) => add(c.mediaId, `Cover: ${c.title}`));
    services.forEach((s) => add(s.mediaId, `Service: ${s.title}`));
    team.forEach((t) => add(t.mediaId, `Team: ${t.name}`));
    heroes.forEach((h) => add(h.mediaId, `Hero: ${h.slug}`));

    return NextResponse.json({
      success: true,
      media: items.map((m) => ({ ...m, usedIn: usage.get(m.id) || [] })),
    });
  } catch (error) {
    console.error("G3 media list error:", error);
    return NextResponse.json({ error: "Could not load the media library." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parsed = createSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }
    const d = parsed.data;

    const kind = kindOf(d.mimeType);
    if (!kind) {
      return NextResponse.json({ error: `Unsupported type "${d.mimeType}"` }, { status: 400 });
    }

    const db = drizzle(getRequestContext().env.DB);

    // The key is unique in the schema; guard here so a double-submit reads as
    // success rather than a 500 from the constraint.
    const existing = await db.select().from(g3_media).where(eq(g3_media.r2_key, d.r2Key)).get();
    if (existing) {
      return NextResponse.json({ success: true, media: existing });
    }

    const inserted = await db.insert(g3_media).values({
      type: kind,
      r2_key: d.r2Key,
      url: d.url,
      alt_text: d.altText,
      width: d.width ?? null,
      height: d.height ?? null,
      duration_seconds: d.durationSeconds ?? null,
      thumbnail_r2_key: d.thumbnailR2Key ?? null,
      thumbnail_url: d.thumbnailUrl ?? null,
      size_bytes: d.sizeBytes ?? null,
      mime_type: d.mimeType,
      uploaded_at: new Date(),
      uploaded_by: "admin",
    }).returning();

    return NextResponse.json({ success: true, media: inserted[0] });
  } catch (error) {
    console.error("G3 media create error:", error);
    return NextResponse.json({ error: "Could not save the asset." }, { status: 500 });
  }
}
