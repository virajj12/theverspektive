export const runtime = 'edge';

import { getRequestContext } from "@cloudflare/next-on-pages";
import { drizzle } from "drizzle-orm/d1";
import { users } from "@/db/schema";
import { verifyPassword, hashPassword } from "@/lib/crypto";
import { getUserSession } from "@/lib/auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { checkRateLimit, getRequestIdentifier } from "@/lib/rate-limit";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const env = getRequestContext().env;
    const db = drizzle(env.DB);

    // Rate Limiting: 20 logins per IP per 15 minutes
    const ip = getRequestIdentifier(request);
    const rateLimit = await checkRateLimit(db, {
      action: "login",
      identifier: ip,
      limit: 20,
      windowMs: 15 * 60 * 1000, 
    });

    if (!rateLimit.success) {
      return NextResponse.json({ success: false, error: "Too many login attempts from this IP. Please try again later." }, { status: 429 });
    }

    const body = await request.json();
    const result = loginSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ success: false, error: "Invalid input" }, { status: 400 });
    }
    
    const { email, password } = result.data;
    const emailLower = email.toLowerCase();
    
    const user = await db.select().from(users).where(eq(users.email, emailLower)).get();
    
    // Mitigate timing attacks by performing a dummy hash if user not found
    if (!user) {
      await hashPassword(password); // Dummy hash
      return NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 401 });
    }

    // Check account lockout
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      return NextResponse.json({ success: false, error: "Account is temporarily locked. Please try again later." }, { status: 403 });
    }
    
    const isValid = await verifyPassword(password, user.password_hash);
    
    if (!isValid) {
      const newFails = user.failed_login_attempts + 1;
      const lockedUntil = newFails >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null; // Lock for 15 mins
      
      await db.update(users)
        .set({ failed_login_attempts: newFails, locked_until: lockedUntil })
        .where(eq(users.id, user.id));
        
      return NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 401 });
    }

    if (!user.email_verified) {
      return NextResponse.json({ success: false, error: "Please verify your email address before logging in." }, { status: 403 });
    }

    // Reset failed attempts on success
    if (user.failed_login_attempts > 0 || user.locked_until) {
      await db.update(users)
        .set({ failed_login_attempts: 0, locked_until: null })
        .where(eq(users.id, user.id));
    }
    
    const session = await getUserSession();
    session.isLoggedIn = true;
    session.userId = user.id;
    session.email = user.email;
    session.sessionVersion = user.session_version;
    await session.save();
    
    return NextResponse.json({ success: true, message: "Logged in successfully" });
    
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ success: false, error: "An unexpected error occurred" }, { status: 500 });
  }
}
