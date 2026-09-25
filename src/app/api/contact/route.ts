import { NextResponse } from "next/server";

// Simple in-memory rate limiter
const rateLimit = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 3; // Max 3 emails per minute per IP
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, message, track, source } = data;

    if (!message || !email) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // IP-based Rate Limiting
    const ip = request.headers.get("x-forwarded-for") || "unknown-ip";
    const now = Date.now();
    const userRate = rateLimit.get(ip);

    if (userRate) {
      if (now - userRate.timestamp < RATE_LIMIT_WINDOW_MS) {
        if (userRate.count >= MAX_REQUESTS_PER_WINDOW) {
          return NextResponse.json({ success: false, error: "Too many requests. Please try again later." }, { status: 429 });
        }
        userRate.count++;
      } else {
        rateLimit.set(ip, { count: 1, timestamp: now });
      }
    } else {
      rateLimit.set(ip, { count: 1, timestamp: now });
    }

    // Clean up old entries occasionally to prevent memory leaks
    if (Math.random() < 0.1) {
      for (const [key, value] of rateLimit.entries()) {
        if (now - value.timestamp > RATE_LIMIT_WINDOW_MS) {
          rateLimit.delete(key);
        }
      }
    }

    // Basic length validation to prevent massive payloads/DDoS via large strings
    if (
      String(email).length > 150 ||
      String(message).length > 5000 ||
      (name && String(name).length > 100) ||
      (track && String(track).length > 100) ||
      (source && String(source).length > 200)
    ) {
      return NextResponse.json({ success: false, error: "Input exceeds maximum allowed length" }, { status: 400 });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.warn("RESEND_API_KEY is not configured. Simulating successful email delivery.");
      return NextResponse.json({ success: true });
    }

    const content = `
      Name: ${name || "Not provided"}
      Email: ${email}
      Track: ${track || "Not provided"}
      Source Page: ${source || "Unknown"}
      
      Message:
      ${message}
    `;

    const subjectPrefix = source ? `${source}: ` : "";
    const subject = `${subjectPrefix}New Inquiry from ${name || email}`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "VerspeKtive Contact <hey@verspektive.in>", // Requires verspektive.in to be verified in Resend
        to: "hey@verspektive.in",
        subject: subject,
        text: content,
        reply_to: email,
      })
    });

    if (!res.ok) {
      console.error("Resend API error:", await res.text());
      return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
