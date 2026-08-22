export const runtime = 'edge';

import { getRequestContext } from "@cloudflare/next-on-pages";
import { drizzle } from "drizzle-orm/d1";
import { users, password_reset_tokens } from "@/db/schema";
import { generateSecureToken } from "@/lib/crypto";
import { sendEmail } from "@/lib/email";
import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { checkRateLimit, getRequestIdentifier } from "@/lib/rate-limit";

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  try {
    const env = getRequestContext().env;
    const db = drizzle(env.DB);

    // Rate Limiting: 5 requests per IP per hour
    const ip = getRequestIdentifier(request);
    const rateLimit = await checkRateLimit(db, {
      action: "forgot_password",
      identifier: ip,
      limit: 5,
      windowMs: 60 * 60 * 1000, 
    });

    if (!rateLimit.success) {
      return NextResponse.json({ success: false, error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const body = await request.json();
    const result = forgotPasswordSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ success: false, error: "Invalid input" }, { status: 400 });
    }
    
    const emailLower = result.data.email.toLowerCase();
    
    const user = await db.select().from(users).where(eq(users.email, emailLower)).get();
    
    // Always return success to prevent email enumeration
    const successResponse = NextResponse.json({ 
      success: true, 
      message: "If an account exists with this email, a reset link has been sent." 
    });

    if (!user) {
      // Simulate typical processing time to prevent timing attacks
      await new Promise(res => setTimeout(res, 200));
      return successResponse;
    }

    // Generate password reset token
    const { raw: rawToken, hash: tokenHash } = await generateSecureToken();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 60 minutes
    
    await db.insert(password_reset_tokens).values({
      user_id: user.id,
      token_hash: tokenHash,
      expires_at: expiresAt,
      used: false,
    });
    
    // Send email
    const resetUrl = new URL(request.url);
    // Determine the base origin
    const baseUrl = `${resetUrl.protocol}//${resetUrl.host}`;
    const fullResetUrl = `${baseUrl}/reset-password?token=${rawToken}&email=${encodeURIComponent(emailLower)}`;
    
    await sendEmail({
      to: emailLower,
      subject: 'Reset your VerspeKtive password',
      html: `
        <h2>Password Reset Request</h2>
        <p>You requested a password reset. Click the link below to set a new password:</p>
        <a href="${fullResetUrl}">Reset Password</a>
        <p>This link will expire in 60 minutes. If you did not request this, you can ignore this email.</p>
      `
    });
    
    return successResponse;
    
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ success: false, error: "An unexpected error occurred" }, { status: 500 });
  }
}
