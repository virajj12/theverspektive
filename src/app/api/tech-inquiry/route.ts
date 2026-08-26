export const runtime = 'edge';

import { getRequestContext } from "@cloudflare/next-on-pages";
import { drizzle } from "drizzle-orm/d1";
import { tech_inquiries } from "@/db/schema";
import { sendEmail } from "@/lib/email";
import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { checkRateLimit, getRequestIdentifier } from "@/lib/rate-limit";

/** Where new leads are announced. Falls back to the address used site-wide. */
const INQUIRY_TO = process.env.TECH_INQUIRY_TO || "verspektive@gmail.com";

const inquirySchema = z.object({
  email: z.string().email().max(320),
  message: z.string().min(10, "Tell us a little more than that").max(5000),
  name: z.string().max(120).optional(),
  track: z.enum(["business", "personal"]).optional(),
});

/** Strip anything that could break out of the notification email's markup. */
function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  try {
    const env = getRequestContext().env;
    const db = drizzle(env.DB);

    // 5 inquiries per IP per hour — enough for a genuine sender who mistypes
    // their email twice, restrictive enough to be useless for spam.
    const ip = getRequestIdentifier(request);
    const rateLimit = await checkRateLimit(db, {
      action: "tech_inquiry",
      identifier: ip,
      limit: 5,
      windowMs: 60 * 60 * 1000,
    });

    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: "Too many messages from this connection. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const result = inquirySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, message, name, track } = result.data;
    const emailLower = email.toLowerCase();

    // Persist FIRST, notify second. If Resend is down or unconfigured the lead
    // is still captured — the email is a convenience, the row is the record.
    const inserted = await db
      .insert(tech_inquiries)
      .values({
        email: emailLower,
        name: name || null,
        track: track || null,
        message,
        notified: false,
        created_at: new Date(),
      })
      .returning({ id: tech_inquiries.id });

    const inquiryId = inserted[0]?.id;

    const trackLabel =
      track === "business" ? "Businesses" : track === "personal" ? "Personal brands" : "Not specified";

    const sent = await sendEmail({
      to: INQUIRY_TO,
      subject: `New tech inquiry${name ? ` from ${name}` : ""} — ${trackLabel}`,
      html: `
        <h2>New inquiry from the tech page</h2>
        <p><strong>From:</strong> ${escapeHtml(name || "—")} &lt;${escapeHtml(emailLower)}&gt;</p>
        <p><strong>Track:</strong> ${escapeHtml(trackLabel)}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
        <hr>
        <p style="color:#86868b;font-size:12px">Inquiry #${inquiryId ?? "?"}</p>
      `,
    });

    if (sent.success && inquiryId) {
      await db
        .update(tech_inquiries)
        .set({ notified: true })
        .where(eq(tech_inquiries.id, inquiryId));
    }

    // The sender's outcome does not depend on our email provider.
    return NextResponse.json({
      success: true,
      message: "Thanks — we'll be in touch shortly.",
    });
  } catch (error) {
    console.error("Tech inquiry error:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong sending that. Please try again." },
      { status: 500 }
    );
  }
}
