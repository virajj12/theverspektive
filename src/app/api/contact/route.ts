import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, message, track, source } = data;

    if (!message || !email) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
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
        from: "VerspeKtive Contact <onboarding@resend.dev>", // Replace with verified domain when available
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
