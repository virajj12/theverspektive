export const runtime = 'edge';

/**
 * Single media asset (spec 5a: "delete unused assets, edit alt text").
 *
 *   PATCH  — edit alt text.
 *   DELETE — remove, but only if nothing references it. Deleting an in-use
 *            asset would leave broken images across the live site, so the
 *            check is server-side and returns the blocking usages rather than
 *            relying on the UI to have disabled the button.
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
import { eq } from "drizzle-orm";
import { z } from "zod";
import { deleteObject } from "@/lib/g3-media";

const patchSchema = z.object({
  altText: z.string().min(1, "Alt text cannot be empty").max(500),
});

async function parseId(params: Promise<{ id: string }>) {
  const { id } = await params;
  const n = Number(id);
  return Number.isInteger(n) && n > 0 ? n : null;
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

    const db = drizzle(getRequestContext().env.DB);
    const updated = await db.update(g3_media)
      .set({ alt_text: parsed.data.altText })
      .where(eq(g3_media.id, id))
      .returning();

    if (!updated.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, media: updated[0] });
  } catch (error) {
    console.error("G3 media patch error:", error);
    return NextResponse.json({ error: "Could not update the asset." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const id = await parseId(ctx.params);
    if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    const env = getRequestContext().env;
    const db = drizzle(env.DB);

    const asset = await db.select().from(g3_media).where(eq(g3_media.id, id)).get();
    if (!asset) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Refuse while anything still points at it.
    const [gallery, cover, service, team, hero] = await Promise.all([
      db.select({ n: g3_project_media.id }).from(g3_project_media).where(eq(g3_project_media.media_id, id)).all(),
      db.select({ t: g3_projects.title }).from(g3_projects).where(eq(g3_projects.cover_media_id, id)).all(),
      db.select({ t: g3_services.title }).from(g3_services).where(eq(g3_services.icon_media_id, id)).all(),
      db.select({ t: g3_team_members.name }).from(g3_team_members).where(eq(g3_team_members.photo_media_id, id)).all(),
      db.select({ t: g3_pages.slug }).from(g3_pages).where(eq(g3_pages.hero_media_id, id)).all(),
    ]);

    const blocking = [
      ...gallery.map(() => "a project gallery"),
      ...cover.map((r) => `cover of "${r.t}"`),
      ...service.map((r) => `service "${r.t}"`),
      ...team.map((r) => `team member "${r.t}"`),
      ...hero.map((r) => `hero of "${r.t}"`),
    ];

    if (blocking.length) {
      return NextResponse.json(
        {
          error: `Still in use by ${blocking.length} place(s). Remove it there first.`,
          usedIn: [...new Set(blocking)],
        },
        { status: 409 }
      );
    }

    // Drop the DB row first: an orphaned R2 object is recoverable waste, while
    // a row pointing at a deleted object renders as a broken image.
    await db.delete(g3_media).where(eq(g3_media.id, id));

    try {
      await deleteObject(env, asset.r2_key);
      if (asset.thumbnail_r2_key) await deleteObject(env, asset.thumbnail_r2_key);
    } catch (e) {
      console.error("R2 object delete failed (row already removed):", e);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("G3 media delete error:", error);
    return NextResponse.json({ error: "Could not delete the asset." }, { status: 500 });
  }
}
