export const runtime = 'edge';

import { getSession } from "@/lib/auth";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { youtube_videos } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";

// Only allow https URLs (block javascript:, data:, etc.)
const httpsUrl = z.string().url().max(2048).refine(
  (url) => url.startsWith("https://"),
  "Only HTTPS URLs are allowed"
);

const addVideoSchema = z.object({
  title: z.string().min(1, "Title is required").max(500),
  youtube_url: httpsUrl,
  thumbnail_url: httpsUrl,
});

const deleteVideoSchema = z.object({
  id: z.coerce.number().int().positive("Invalid video ID"),
});

export async function GET() {
  try {
    const env = getRequestContext().env;
    const db = getDb(env.DB);
    
    const videos = await db.select().from(youtube_videos).orderBy(desc(youtube_videos.created_at));
    return NextResponse.json({ data: videos });
  } catch (error) {
    console.error("YouTube videos GET error:", error);
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = addVideoSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { title, youtube_url, thumbnail_url } = parsed.data;

    const env = getRequestContext().env;
    const db = getDb(env.DB);
    
    await db.insert(youtube_videos).values({
      title,
      youtube_url,
      thumbnail_url,
      created_at: new Date()
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("YouTube videos POST error:", error);
    return NextResponse.json({ error: "Failed to add video" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const parsed = deleteVideoSchema.safeParse({ id: searchParams.get("id") });

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const env = getRequestContext().env;
    const db = getDb(env.DB);
    
    await db.delete(youtube_videos).where(eq(youtube_videos.id, parsed.data.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("YouTube videos DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete video" }, { status: 500 });
  }
}
