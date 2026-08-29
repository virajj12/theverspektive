"use client";

/**
 * Sticky bottom CTA bar (spec 6, non-negotiable): Call / WhatsApp / Enquiry,
 * always reachable and never covered by content.
 *
 * Hidden on the contact page itself — the form is already on screen there, and
 * a bar pointing at the thing you're looking at is just lost thumb space.
 * Pages add bottom padding via .g3-has-sticky-cta so it never overlaps content.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, MessageCircle, CalendarCheck } from "lucide-react";

const PHONE = "+919880000000";
const WHATSAPP = "919880000000";

export default function StickyMobileCTA() {
  const pathname = usePathname();
  if (pathname === "/g3-builders/contact") return null;

  const item = "flex flex-1 flex-col items-center justify-center gap-1 py-3 text-[11px] font-medium";

  return (
    <div
      className="g3-glass fixed inset-x-0 bottom-0 z-40 flex border-t md:hidden"
      style={{
        borderColor: "var(--g3-rule-faint)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <a href={`tel:${PHONE}`} className={item} style={{ color: "var(--g3-ink-soft)" }}>
        <Phone className="h-5 w-5" aria-hidden="true" />
        Call
      </a>
      <a
        href={`https://wa.me/${WHATSAPP}`}
        target="_blank"
        rel="noopener noreferrer"
        className={item}
        style={{ color: "var(--g3-ink-soft)" }}
      >
        <MessageCircle className="h-5 w-5" aria-hidden="true" />
        WhatsApp
      </a>
      <Link
        href="/g3-builders/contact"
        className={item}
        style={{ background: "var(--g3-brass)", color: "#0a0908" }}
      >
        <CalendarCheck className="h-5 w-5" aria-hidden="true" />
        Enquire
      </Link>
    </div>
  );
}
