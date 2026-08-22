export const runtime = 'edge';

import { getRequestContext } from "@cloudflare/next-on-pages";
import { drizzle } from "drizzle-orm/d1";
import { users, password_reset_tokens } from "@/db/schema";
import { hashToken, hashPassword } from "@/lib/crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { checkRateLimit, getRequestIdentifier } from "@/lib/rate-limit";

const resetPasswordSchema = z.object({
  email: z.string().email(),
  token: z.string().min(1),
  password: z.string().min(10).refine((val) => {
    if (/^[0-9]+$/.test(val)) return false; 
    if (/^(.)\1+$/.test(val)) return false; 
    return true;
  }, "Password must be at least 10 characters and cannot be all numbers or repeating characters"),
});

export async function POST(request: Request) {
  try {
    const env = getRequestContext().env;
    const db = drizzle(env.DB);

    // Rate Limiting: 5 resets per IP per 15 minutes (stricter — each request does 600k PBKDF2 iterations)
    const ip = getRequestIdentifier(request);
    const rateLimit = await checkRateLimit(db, {
      action: "reset_password",
      identifier: ip,
      limit: 5,
      windowMs: 15 * 60 * 1000,
    });

    if (!rateLimit.success) {
      return NextResponse.json({ success: false, error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const body = await request.json();
    const result = resetPasswordSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error.issues[0].message }, { status: 400 });
    }
    
    const { email, token, password } = result.data;
    const emailLower = email.toLowerCase();

    const user = await db.select().from(users).where(eq(users.email, emailLower)).get();
    
    if (!user) {
      return NextResponse.json({ success: false, error: "Invalid link" }, { status: 400 });
    }

    const hashedToken = await hashToken(token);

    const tokenRecord = await db.select()
      .from(password_reset_tokens)
      .where(and(
        eq(password_reset_tokens.user_id, user.id),
        eq(password_reset_tokens.token_hash, hashedToken),
        eq(password_reset_tokens.used, false)
      )).get();

    if (!tokenRecord) {
      return NextResponse.json({ success: false, error: "Invalid or used link" }, { status: 400 });
    }

    if (new Date(tokenRecord.expires_at) < new Date()) {
      return NextResponse.json({ success: false, error: "Link expired" }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);

    // Invalidate session by incrementing session_version
    const newSessionVersion = user.session_version + 1;

    // Update user password and session_version, and mark token as used
    await db.update(users)
      .set({ 
        password_hash: hashedPassword,
        session_version: newSessionVersion,
        failed_login_attempts: 0,
        locked_until: null,
      })
      .where(eq(users.id, user.id));
      
    await db.update(password_reset_tokens)
      .set({ used: true })
      .where(eq(password_reset_tokens.id, tokenRecord.id));

    return NextResponse.json({ success: true, message: "Password updated successfully" });
    
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ success: false, error: "An unexpected error occurred" }, { status: 500 });
  }
}
