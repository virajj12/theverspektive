export const runtime = 'edge';

import { getRequestContext } from "@cloudflare/next-on-pages";
import { NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/d1";
import { g3_team_members } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const env = getRequestContext().env;
    const db = drizzle(env.DB);
    
    const session = await getSession();
    if (!session.isLoggedIn) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const id = parseInt(params.id);
    if (isNaN(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const body = await request.json();
    const { name, role, bio, photo_media_id, sort_order } = body;

    await db.update(g3_team_members)
      .set({
        ...(name !== undefined && { name }),
        ...(role !== undefined && { role }),
        ...(bio !== undefined && { bio }),
        ...(photo_media_id !== undefined && { photo_media_id }),
        ...(sort_order !== undefined && { sort_order }),
      })
      .where(eq(g3_team_members.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update G3 team member", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const env = getRequestContext().env;
    const db = drizzle(env.DB);
    
    const session = await getSession();
    if (!session.isLoggedIn) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const id = parseInt(params.id);
    if (isNaN(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    await db.delete(g3_team_members).where(eq(g3_team_members.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete G3 team member", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
