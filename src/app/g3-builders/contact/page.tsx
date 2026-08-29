export const runtime = 'edge';

/**
 * Contact / consultation (spec 4.7): enquiry form, phone, WhatsApp, location,
 * office hours.
 *
 * The sticky mobile CTA bar hides itself on this route (it would point at the
 * page you are already on), so the direct-contact block below carries those
 * actions instead — call and WhatsApp stay one tap away.
 */

import type { Metadata } from "next";
import { Phone, MessageCircle, Mail, MapPin, Clock } from "lucide-react";
import InquiryForm from "@/components/g3/InquiryForm";
import { Reveal } from "@/components/g3/Reveal";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Book a consultation with G3 Builders & Architecture. Call, WhatsApp, or send project details.",
};

const PHONE_DISPLAY = "+91 98800 00000";
const PHONE_TEL = "+919880000000";
const WHATSAPP = "919880000000";
const EMAIL = "verspektive@gmail.com";

export default function ContactPage() {
  return (
    <div className="pb-24 pt-32 md:pt-40">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <span className="g3-meta">Get in touch</span>
          <h1 className="g3-display-xl mt-3 max-w-3xl" style={{ color: "var(--g3-ink)" }}>
            Tell us about your project.
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="g3-body mt-6 max-w-xl">
            Three fields to start. We&rsquo;ll call you back within two working days
            — no automated sequence, no mailing list.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-14 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
          <Reveal delay={0.15}>
            <InquiryForm />
          </Reveal>

          <Reveal delay={0.25}>
            <div className="space-y-8">
              <div>
                <p className="g3-meta mb-4">Rather talk now?</p>
                <div className="space-y-3">
                  <a
                    href={`tel:${PHONE_TEL}`}
                    className="flex items-center gap-3 rounded-lg border px-4 py-3.5 transition-colors"
                    style={{ borderColor: "var(--g3-rule-faint)", color: "var(--g3-ink)" }}
                  >
                    <Phone className="h-4 w-4 shrink-0" style={{ color: "var(--g3-brass)" }} aria-hidden="true" />
                    {PHONE_DISPLAY}
                  </a>
                  <a
                    href={`https://wa.me/${WHATSAPP}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg border px-4 py-3.5 transition-colors"
                    style={{ borderColor: "var(--g3-rule-faint)", color: "var(--g3-ink)" }}
                  >
                    <MessageCircle className="h-4 w-4 shrink-0" style={{ color: "var(--g3-brass)" }} aria-hidden="true" />
                    WhatsApp us
                  </a>
                  <a
                    href={`mailto:${EMAIL}`}
                    className="flex items-center gap-3 rounded-lg border px-4 py-3.5 transition-colors"
                    style={{ borderColor: "var(--g3-rule-faint)", color: "var(--g3-ink)" }}
                  >
                    <Mail className="h-4 w-4 shrink-0" style={{ color: "var(--g3-brass)" }} aria-hidden="true" />
                    {EMAIL}
                  </a>
                </div>
              </div>

              <div className="g3-rule" />

              <div>
                <p className="g3-meta mb-3">Office</p>
                <p className="flex items-start gap-3 g3-body">
                  <MapPin className="mt-1 h-4 w-4 shrink-0" style={{ color: "var(--g3-brass)" }} aria-hidden="true" />
                  Moodbidri, Dakshina Kannada<br />Karnataka, India
                </p>
              </div>

              <div>
                <p className="g3-meta mb-3">Hours</p>
                <p className="flex items-start gap-3 g3-body">
                  <Clock className="mt-1 h-4 w-4 shrink-0" style={{ color: "var(--g3-brass)" }} aria-hidden="true" />
                  Monday&ndash;Saturday, 9:30am&ndash;6:30pm<br />
                  Site visits by appointment
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
