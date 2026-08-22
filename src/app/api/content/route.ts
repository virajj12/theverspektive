export const runtime = 'edge';

import { getSession } from "@/lib/auth";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { pages } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

// Allowlist pattern: lowercase alphanumeric, hyphens, underscores
const slugPattern = /^[a-z0-9][a-z0-9\-_]{0,98}[a-z0-9]$/;

const getContentSchema = z.object({
  slug: z.string().min(1).max(100).regex(slugPattern, "Invalid slug format"),
});

const upsertContentSchema = z.object({
  slug: z.string().min(1).max(100).regex(slugPattern, "Invalid slug format"),
  section_key: z.string().min(1).max(100).regex(slugPattern, "Invalid section_key format"),
  content_type: z.enum(["text", "richtext", "image_url"]).default("text"),
  value: z.string().min(1).max(50000), // 50KB max per field
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    
    const parsed = getContentSchema.safeParse({ slug });
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const env = getRequestContext().env;
    const db = getDb(env.DB);
    
    const content = await db.select().from(pages).where(eq(pages.slug, parsed.data.slug));
    return NextResponse.json({ data: content });
  } catch (error) {
    console.error("Content GET error:", error);
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = upsertContentSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { slug, section_key, content_type, value } = parsed.data;

    const env = getRequestContext().env;
    const db = getDb(env.DB);
    
    // Upsert equivalent: check if exists, then update or insert
    const existing = await db.select().from(pages).where(
      and(eq(pages.slug, slug), eq(pages.section_key, section_key))
    ).limit(1);

    if (existing.length > 0) {
      await db.update(pages).set({ value, updated_at: new Date() }).where(eq(pages.id, existing[0].id));
    } else {
      await db.insert(pages).values({
        slug,
        section_key,
        content_type,
        value,
        updated_at: new Date()
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Content POST error:", error);
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
  }
}
