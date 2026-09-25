"use client";

/**
 * Spec 4.7 — contact.
 *
 * Spec 4.7 — contact.
 *
 * A traditional contact form that collects the user's project details, email, and name upfront.
 * Submits to /api/tech-inquiry, which persists to D1 and notifies by email.
 */

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Check } from "lucide-react";
import Link from "next/link";
import { useTechTrackStore } from "@/store/tech-track-store";

type Status = "idle" | "sending" | "sent" | "error";

export default function TechContact() {
  const track = useTechTrackStore((s) => s.track);

  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const revealed = message.trim().length > 0;
  const canSubmit = message.trim().length >= 10 && email.trim().length > 0 && status !== "sending";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setStatus("sending");
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message.trim(),
          email: email.trim(),
          name: name.trim() || undefined,
          track: track || undefined,
          source: typeof window !== "undefined" ? window.location.pathname : "Unknown",
        }),
      });

      const data = (await res.json()) as { success?: boolean; error?: string };

      if (!res.ok || !data.success) {
        setStatus("error");
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setStatus("sent");
    } catch {
      setStatus("error");
      setError("Couldn't reach the server. Please try again.");
    }
  }

  return (
    <section id="contact" className="py-28 md:py-40 transition-colors duration-500">
      <div className="mx-auto max-w-3xl px-6">
        <AnimatePresence mode="wait">
          {status === "sent" ? (
            <motion.div
              key="sent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="py-16 text-center"
            >
              <div className="mx-auto mb-8 flex h-14 w-14 items-center justify-center rounded-full border border-accent/40 bg-accent/10">
                <Check className="h-6 w-6 text-accent" aria-hidden="true" />
              </div>
              <h2 className="text-display-md mb-4 text-foreground">Got it.</h2>
              <p className="text-body-lg text-muted-foreground">
                We read everything that comes through here. You&rsquo;ll hear back
                from a person, usually within a couple of days.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-950 p-8 md:p-12 shadow-2xl"
            >
              <h2 className="text-display-lg mb-10 text-foreground">
                Tell us what you&rsquo;re building.
              </h2>

              <form onSubmit={handleSubmit} className="space-y-8" noValidate>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="ti-name"
                      className="text-sm font-medium text-muted-foreground"
                    >
                      Name <span className="text-muted-foreground/60">(optional)</span>
                    </label>
                    <input
                      id="ti-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="flex h-12 w-full rounded-md border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-2 text-base text-foreground placeholder:text-muted-foreground/50 transition-colors focus-visible:border-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="ti-email"
                      className="text-sm font-medium text-muted-foreground"
                    >
                      Email
                    </label>
                    <input
                      id="ti-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex h-12 w-full rounded-md border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-2 text-base text-foreground placeholder:text-muted-foreground/50 transition-colors focus-visible:border-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="jane@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="ti-message" className="text-sm font-medium text-muted-foreground">
                    What you&rsquo;re building
                  </label>
                  <textarea
                    id="ti-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    placeholder="A booking system for a studio, a portfolio that doesn't look like everyone else's, something else entirely&hellip;"
                    className="flex min-h-[120px] w-full resize-none rounded-md border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-3 text-base text-foreground placeholder:text-muted-foreground/50 transition-colors focus-visible:border-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                {error && (
                  <p role="alert" className="text-sm font-medium text-[#ff6169]">
                    {error}
                  </p>
                )}

                <p className="text-sm text-muted-foreground mt-4 mb-6 leading-relaxed">
                  By submitting this form, you agree that we may use the information provided to respond to your enquiry. See our <Link href="/privacy" className="underline underline-offset-4 hover:text-foreground transition-colors">Privacy Policy</Link>.
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center gap-6 pt-2">
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className="inline-flex h-12 items-center justify-center rounded-md bg-black text-white hover:bg-black/90 dark:bg-white px-8 text-sm font-medium dark:text-black transition-colors dark:hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                  >
                    {status === "sending" ? "Sending…" : "Send it over"}
                    <ChevronRight aria-hidden="true" className="ml-2 h-4 w-4" />
                  </button>

                  <span className="text-sm text-muted-foreground">
                    Or email{" "}
                    <a
                      href="mailto:hey@verspektive.in"
                      className="underline underline-offset-4 hover:text-foreground transition-colors"
                    >
                      hey@verspektive.in
                    </a>
                  </span>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
