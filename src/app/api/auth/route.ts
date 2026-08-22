export const runtime = 'edge';

import { getSession } from "@/lib/auth";
import { getRequestContext } from "@cloudflare/next-on-pages";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/d1";
import { checkRateLimit, getRequestIdentifier } from "@/lib/rate-limit";
import { z } from "zod";

const adminLoginSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

export async function POST(request: Request) {
  try {
    let env: any = {};
    try {
      env = getRequestContext()?.env || {};
    } catch (e) {
      // Ignore: running locally without Cloudflare context
    }

    const storedHash = env.ADMIN_PASSWORD_HASH;
    if (!storedHash) {
      console.error("CRITICAL: ADMIN_PASSWORD_HASH env var is not set. Admin login is disabled.");
      return NextResponse.json({ success: false, error: "Server configuration error" }, { status: 500 });
    }

    // Rate Limiting: 10 admin login attempts per IP per 15 minutes
    if (env.DB) {
      const db = drizzle(env.DB);
      const ip = getRequestIdentifier(request);
      const rateLimit = await checkRateLimit(db, {
        action: "admin_login",
        identifier: ip,
        limit: 10,
        windowMs: 15 * 60 * 1000,
      });

      if (!rateLimit.success) {
        return NextResponse.json({ success: false, error: "Too many login attempts. Please try again later." }, { status: 429 });
      }
    }

    const body = await request.json();
    const parsed = adminLoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid input" }, { status: 400 });
    }

    const isValid = bcrypt.compareSync(parsed.data.password, storedHash);
    
    if (isValid) {
      const session = await getSession();
      session.isLoggedIn = true;
      await session.save();
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: "Invalid password" }, { status: 401 });
    }
  } catch (error: any) {
    console.error("Auth error:", error);
    return NextResponse.json({ success: false, error: "Authentication failed" }, { status: 500 });
  }
}

export async function DELETE() {
  const session = await getSession();
  session.destroy();
  return NextResponse.json({ success: true });
}
