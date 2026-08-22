export const runtime = 'edge';

import { getRequestContext } from "@cloudflare/next-on-pages";
import { drizzle } from "drizzle-orm/d1";
import { users, email_verification_tokens } from "@/db/schema";
import { hashToken } from "@/lib/crypto";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  const email = url.searchParams.get("email");

  if (!token || !email) {
    return NextResponse.json({ success: false, error: "Missing token or email" }, { status: 400 });
  }

  try {
    const env = getRequestContext().env;
    const db = drizzle(env.DB);
    const emailLower = email.toLowerCase();

    const user = await db.select().from(users).where(eq(users.email, emailLower)).get();
    if (!user) {
      return NextResponse.json({ success: false, error: "Invalid link" }, { status: 400 });
    }

    const hashedToken = await hashToken(token);

    const tokenRecord = await db.select()
      .from(email_verification_tokens)
      .where(and(
        eq(email_verification_tokens.user_id, user.id),
        eq(email_verification_tokens.token_hash, hashedToken),
        eq(email_verification_tokens.used, false)
      )).get();

    if (!tokenRecord) {
      return NextResponse.json({ success: false, error: "Invalid or expired link" }, { status: 400 });
    }

    if (new Date(tokenRecord.expires_at) < new Date()) {
      return NextResponse.json({ success: false, error: "Link expired" }, { status: 400 });
    }

    // Mark verified and invalidate token
    await db.update(users).set({ email_verified: true }).where(eq(users.id, user.id));
    await db.update(email_verification_tokens).set({ used: true }).where(eq(email_verification_tokens.id, tokenRecord.id));

    // Redirect to login page with success message
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('verified', '1');
    return NextResponse.redirect(loginUrl);

  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ success: false, error: "An unexpected error occurred" }, { status: 500 });
  }
}
