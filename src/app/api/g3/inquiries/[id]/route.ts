export const runtime = 'edge';

/** Inquiry status management (spec 5a: new / contacted / closed). */

import { getSession } from "@/lib/auth";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { drizzle } from "drizzle-orm/d1";
import { g3_inquiries } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

const schema = z.object({ status: z.enum(["new", "contacted", "closed"]) });

export async function PATCH(request: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id: raw } = await ctx.params;
    const id = Number(raw);
    if (!Number.isInteger(id) || id <= 0) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

    const db = drizzle(getRequestContext().env.DB);
    const updated = await db.update(g3_inquiries)
      .set({ status: parsed.data.status }).where(eq(g3_inquiries.id, id)).returning();

    if (!updated.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, inquiry: updated[0] });
  } catch (error) {
    console.error("G3 inquiry patch error:", error);
    return NextResponse.json({ error: "Could not update the enquiry." }, { status: 500 });
  }
}
