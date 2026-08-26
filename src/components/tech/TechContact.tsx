"use client";

/**
 * Spec 4.7 — contact.
 *
 * "No multi-field friction up front": the page opens with one thing to do —
 * say what you're building. The email field only appears once there's
 * something worth sending, and name stays optional throughout. That's two
 * required fields total, revealed in the order a person actually thinks in.
 *
 * Submits to /api/tech-inquiry, which persists to D1 and notifies by email.
 */

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Check } from "lucide-react";
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
      const res = await fetch("/api/tech-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message.trim(),
          email: email.trim(),
          name: name.trim() || undefined,
          track: track || undefined,
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
    <section id="contact" className="section-dark py-28 md:py-40">
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
              <div className="mx-auto mb-8 flex h-14 w-14 items-center justify-center rounded-full border border-[#2997ff]/40 bg-[#2997ff]/10">
                <Check className="h-6 w-6 text-[#2997ff]" aria-hidden="true" />
              </div>
              <h2 className="text-display-md mb-4 text-[#f5f5f7]">Got it.</h2>
              <p className="text-body-lg text-[#86868b]">
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
            >
              <h2 className="text-display-lg mb-12 text-[#f5f5f7]">
                Tell us what you&rsquo;re building.
              </h2>

              <form onSubmit={handleSubmit} noValidate>
                <label htmlFor="ti-message" className="sr-only">
                  What you&rsquo;re building
                </label>
                <textarea
                  id="ti-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="A booking system for a studio, a portfolio that doesn't look like everyone else's, something else entirely&hellip;"
                  className="w-full resize-none border-b border-white/20 bg-transparent pb-4 text-lg text-[#f5f5f7] placeholder:text-[#86868b]/70 focus:border-[#2997ff] focus:outline-none"
                />

                <AnimatePresence>
                  {revealed && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="grid gap-6 pt-10 md:grid-cols-2">
                        <div>
                          <label
                            htmlFor="ti-email"
                            className="mb-2 block text-sm font-medium text-[#86868b]"
                          >
                            Email
                          </label>
                          <input
                            id="ti-email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border-b border-white/20 bg-transparent pb-3 text-[#f5f5f7] focus:border-[#2997ff] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="ti-name"
                            className="mb-2 block text-sm font-medium text-[#86868b]"
                          >
                            Name <span className="text-[#86868b]/60">(optional)</span>
                          </label>
                          <input
                            id="ti-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border-b border-white/20 bg-transparent pb-3 text-[#f5f5f7] focus:border-[#2997ff] focus:outline-none"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {error && (
                  <p role="alert" className="mt-6 text-sm text-[#ff6169]">
                    {error}
                  </p>
                )}

                <div className="mt-10 flex items-center gap-6">
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className="cta-link disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {status === "sending" ? "Sending…" : "Send it over"}
                    <ChevronRight aria-hidden="true" />
                  </button>

                  {!revealed && (
                    <span className="text-sm text-[#86868b]">
                      Or email{" "}
                      <a
                        href="mailto:verspektive@gmail.com"
                        className="underline underline-offset-4 hover:text-[#f5f5f7]"
                      >
                        verspektive@gmail.com
                      </a>
                    </span>
                  )}
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
