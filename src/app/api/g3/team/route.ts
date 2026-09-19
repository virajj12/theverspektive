export const runtime = 'edge';

import { getRequestContext } from "@cloudflare/next-on-pages";
import { NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/d1";
import { g3_team_members, g3_media } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const env = getRequestContext().env;
    const db = drizzle(env.DB);
    
    const team = await db
      .select({
        id: g3_team_members.id,
        name: g3_team_members.name,
        role: g3_team_members.role,
        bio: g3_team_members.bio,
        photo_media_id: g3_team_members.photo_media_id,
        sort_order: g3_team_members.sort_order,
        photoUrl: g3_media.url,
      })
      .from(g3_team_members)
      .leftJoin(g3_media, eq(g3_team_members.photo_media_id, g3_media.id))
      .orderBy(asc(g3_team_members.sort_order), asc(g3_team_members.id))
      .all();
      
    return NextResponse.json({ success: true, data: team });
  } catch (error) {
    console.error("Failed to fetch G3 team", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const env = getRequestContext().env;
    const db = drizzle(env.DB);
    
    const session = await getSession();
    if (!session.isLoggedIn) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body: any = await request.json();
    const { name, role, bio, photo_media_id, sort_order } = body;

    if (!name || !role) {
      return NextResponse.json({ success: false, error: "Name and role are required" }, { status: 400 });
    }

    await db.insert(g3_team_members).values({
      name,
      role,
      bio: bio || null,
      photo_media_id: photo_media_id || null,
      sort_order: sort_order || 0,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to create G3 team member", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
