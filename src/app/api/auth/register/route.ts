export const runtime = 'edge';

import { getRequestContext } from "@cloudflare/next-on-pages";
import { drizzle } from "drizzle-orm/d1";
import { users, email_verification_tokens } from "@/db/schema";
import { hashPassword, generateSecureToken } from "@/lib/crypto";
import { sendEmail } from "@/lib/email";
import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { checkRateLimit, getRequestIdentifier } from "@/lib/rate-limit";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(10).refine((val) => {
    if (/^[0-9]+$/.test(val)) return false; // not all numeric
    if (/^(.)\1+$/.test(val)) return false; // not all same character
    return true;
  }, "Password must be at least 10 characters and cannot be all numbers or repeating characters"),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
});

export async function POST(request: Request) {
  try {
    const env = getRequestContext().env;
    const db = drizzle(env.DB);

    // Rate Limiting: 5 registrations per IP per hour
    const ip = getRequestIdentifier(request);
    const rateLimit = await checkRateLimit(db, {
      action: "register",
      identifier: ip,
      limit: 5,
      windowMs: 60 * 60 * 1000, 
    });

    if (!rateLimit.success) {
      return NextResponse.json({ success: false, error: "Too many registration attempts. Please try again later." }, { status: 429 });
    }

    const body = await request.json();
    const result = registerSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error.issues[0].message }, { status: 400 });
    }
    
    const { email, password, firstName, lastName } = result.data;
    const emailLower = email.toLowerCase();
    
    // Check if user exists
    const existingUser = await db.select().from(users).where(eq(users.email, emailLower)).get();
    if (existingUser) {
      // Don't leak that email exists to attackers, just return a generic response or specific "email in use" depending on preference.
      // Usually "email in use" is acceptable for register flows.
      return NextResponse.json({ success: false, error: "An account with this email already exists" }, { status: 409 });
    }
    
    // Hash password using PBKDF2
    const hashedPassword = await hashPassword(password);
    
    // Insert user
    const insertResult = await db.insert(users).values({
      email: emailLower,
      password_hash: hashedPassword,
      first_name: firstName,
      last_name: lastName,
      email_verified: false,
      failed_login_attempts: 0,
      session_version: 1,
      created_at: new Date(),
      updated_at: new Date(),
    }).returning({ id: users.id });
    
    const newUserId = insertResult[0].id;
    
    // Generate email verification token
    const { raw: rawToken, hash: tokenHash } = await generateSecureToken();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours
    
    await db.insert(email_verification_tokens).values({
      user_id: newUserId,
      token_hash: tokenHash,
      expires_at: expiresAt,
      used: false,
    });
    
    // Send email
    const verificationUrl = new URL(request.url);
    verificationUrl.pathname = '/api/auth/verify-email';
    verificationUrl.searchParams.set('token', rawToken);
    verificationUrl.searchParams.set('email', emailLower);
    
    await sendEmail({
      to: emailLower,
      subject: 'Verify your VerspeKtive account',
      html: `
        <h2>Welcome to VerspeKtive, ${firstName}!</h2>
        <p>Please verify your email address by clicking the link below:</p>
        <a href="${verificationUrl.toString()}">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
      `
    });
    
    // We do NOT log them in immediately. They must verify.
    return NextResponse.json({ success: true, message: "Registration successful. Please check your email to verify your account." });
    
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ success: false, error: "An unexpected error occurred" }, { status: 500 });
  }
}
