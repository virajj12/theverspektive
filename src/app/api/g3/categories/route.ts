import { NextResponse } from "next/server";
import { db } from "@/db";
import { g3_projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { G3_CATEGORIES } from "@/lib/g3-constants";

export const runtime = 'edge';

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { oldName, newName, action } = body;

    if (!oldName) {
      return NextResponse.json({ error: "Missing oldName" }, { status: 400 });
    }

    const d = db();

    if (action === "rename") {
      if (!newName || typeof newName !== "string" || !newName.trim()) {
        return NextResponse.json({ error: "Invalid newName" }, { status: 400 });
      }
      
      await d.update(g3_projects)
        .set({ category: newName.trim(), updated_at: new Date() })
        .where(eq(g3_projects.category, oldName));

      return NextResponse.json({ success: true });
    }

    if (action === "delete") {
      // Move to a safe default category so we don't break notNull constraints
      const fallback = G3_CATEGORIES[0];
      await d.update(g3_projects)
        .set({ category: fallback, updated_at: new Date() })
        .where(eq(g3_projects.category, oldName));

      return NextResponse.json({ success: true, fallback });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (e) {
    console.error("Categories PATCH error:", e);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}
