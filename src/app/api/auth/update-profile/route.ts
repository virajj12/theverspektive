import { NextResponse } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { drizzle } from "drizzle-orm/d1";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getUserSession } from "@/lib/auth";
import { z } from "zod";

const updateProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
});

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const session = await getUserSession();
    
    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = updateProfileSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error.issues[0].message }, { status: 400 });
    }
    
    const { firstName, lastName } = result.data;
    const env = getRequestContext().env;
    const db = drizzle(env.DB);
    
    await db.update(users)
      .set({
        first_name: firstName,
        last_name: lastName,
        updated_at: new Date()
      })
      .where(eq(users.id, session.userId));
      
    return NextResponse.json({ success: true, message: "Profile updated successfully" });
    
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json({ success: false, error: "An unexpected error occurred" }, { status: 500 });
  }
}
