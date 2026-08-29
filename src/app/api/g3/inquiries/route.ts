export const runtime = 'edge';

/**
 * G3 inquiries (spec 4.7 + 5a).
 *
 *   POST — public consultation form. Persist first, notify second, so a lead
 *          survives a Resend outage; the row is the record, email is a nudge.
 *   GET  — admin inbox listing.
 */

import { getSession } from "@/lib/auth";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { drizzle } from "drizzle-orm/d1";
import { g3_inquiries } from "@/db/schema";
import { sendEmail } from "@/lib/email";
import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { checkRateLimit, getRequestIdentifier } from "@/lib/rate-limit";

const INQUIRY_TO = process.env.G3_INQUIRY_TO || "verspektive@gmail.com";

const schema = z.object({
  name: z.string().min(1, "Please tell us your name").max(200),
  phone: z.string().min(6, "A reachable phone number is required").max(40),
  email: z.string().email("That email doesn't look right").max(320),
  projectType: z.string().max(120).optional(),
  budgetRange: z.string().max(120).optional(),
  location: z.string().max(200).optional(),
  message: z.string().max(5000).optional(),
});

function esc(v: string) {
  return v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  try {
    const env = getRequestContext().env;
    const db = drizzle(env.DB);

    const ip = getRequestIdentifier(request);
    const rl = await checkRateLimit(db, {
      action: "g3_inquiry", identifier: ip, limit: 5, windowMs: 60 * 60 * 1000,
    });
    if (!rl.success) {
      return NextResponse.json(
        { success: false, error: "Too many enquiries from this connection. Please try again later." },
        { status: 429 }
      );
    }

    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues[0].message }, { status: 400 });
    }
    const d = parsed.data;

    const inserted = await db.insert(g3_inquiries).values({
      name: d.name,
      phone: d.phone,
      email: d.email.toLowerCase(),
      project_type: d.projectType ?? null,
      budget_range: d.budgetRange ?? null,
      location: d.location ?? null,
      message: d.message ?? null,
      status: "new",
      notified: false,
      created_at: new Date(),
    }).returning({ id: g3_inquiries.id });

    const id = inserted[0]?.id;

    const sent = await sendEmail({
      to: INQUIRY_TO,
      subject: `New G3 consultation request — ${d.name}`,
      html: `
        <h2>New consultation request</h2>
        <p><strong>Name:</strong> ${esc(d.name)}</p>
        <p><strong>Phone:</strong> ${esc(d.phone)}</p>
        <p><strong>Email:</strong> ${esc(d.email)}</p>
        <p><strong>Project type:</strong> ${esc(d.projectType || "—")}</p>
        <p><strong>Budget:</strong> ${esc(d.budgetRange || "—")}</p>
        <p><strong>Location:</strong> ${esc(d.location || "—")}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space:pre-wrap">${esc(d.message || "—")}</p>
        <hr><p style="color:#888;font-size:12px">Inquiry #${id ?? "?"}</p>`,
    });

    // Auto-reply to the enquirer (spec 4.7). Best-effort — never blocks success.
    if (sent.success) {
      await sendEmail({
        to: d.email,
        subject: "We've received your enquiry — G3 Builders & Architecture",
        html: `<p>Hi ${esc(d.name)},</p>
               <p>Thanks for getting in touch with G3 Builders &amp; Architecture.
               We've received your enquiry and someone will call you shortly.</p>
               <p>— G3 Builders &amp; Architecture</p>`,
      });
      if (id) await db.update(g3_inquiries).set({ notified: true }).where(eq(g3_inquiries.id, id));
    }

    return NextResponse.json({ success: true, message: "Thanks — we'll be in touch shortly." });
  } catch (error) {
    console.error("G3 inquiry error:", error);
    return NextResponse.json({ success: false, error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const db = drizzle(getRequestContext().env.DB);
    const inquiries = await db.select().from(g3_inquiries).orderBy(desc(g3_inquiries.created_at)).all();
    return NextResponse.json({ success: true, inquiries });
  } catch (error) {
    console.error("G3 inquiries list error:", error);
    return NextResponse.json({ error: "Could not load enquiries." }, { status: 500 });
  }
}
