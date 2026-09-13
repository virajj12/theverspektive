import { getRequestContext } from "@cloudflare/next-on-pages";
import { drizzle } from "drizzle-orm/d1";
import { g3_pages } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export const runtime = 'edge';

function db() {
  const env = getRequestContext().env;
  if (!env?.DB) throw new Error("D1 binding unavailable");
  return drizzle(env.DB);
}

export async function GET() {
  try {
    const pages = await db().select().from(g3_pages).all();
    return Response.json({ pages });
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { slug, section_key, hero_media_id } = await req.json() as { slug: string, section_key: string, hero_media_id: number | null };
    
    // Check if it exists
    const existing = await db().select().from(g3_pages).where(and(eq(g3_pages.slug, slug), eq(g3_pages.section_key, section_key))).get();

    if (existing) {
      await db().update(g3_pages)
        .set({ hero_media_id, updated_at: new Date() })
        .where(eq(g3_pages.id, existing.id))
        .execute();
    } else {
      await db().insert(g3_pages)
        .values({
          slug,
          section_key,
          content_type: 'image',
          value: '',
          hero_media_id,
          updated_at: new Date(),
        })
        .execute();
    }

    return Response.json({ success: true });
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}
