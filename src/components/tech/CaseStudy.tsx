"use client";

/**
 * Spec 4.4 — flagship case study, VerspeKtive itself.
 *
 * Given the most visual weight after the hero, per the spec.
 *
 * COPY ACCURACY NOTE: the spec's example stack line reads "Next.js 14, D1,
 * Razorpay, Cloudflare". Two of those are wrong against this repo as it stands
 * — it runs Next.js 16.3, and Razorpay is NOT integrated (the orders table has
 * the columns, but there is no SDK, no checkout and no webhook). The copy below
 * states what is actually true and marks payments as in progress. Every
 * security claim is likewise traceable to real code, cited in the comments.
 */

import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

const STACK = [
  "Next.js 16",
  "TypeScript",
  "Cloudflare Pages",
  "D1 (SQLite)",
  "R2",
  "Drizzle ORM",
];

/**
 * The security-hardening story (spec 4.4: "the security-hardening story ...
 * as a rigor/trust signal").
 *
 * The remediation items are the ones verifiable in this codebase today:
 *   - PBKDF2 password hashing         → src/lib/crypto.ts, used in register route
 *   - server-side sessions + rotation → iron-session, users.session_version
 *   - rate limiting that fails closed → src/lib/rate-limit.ts
 */
const HARDENING = [
  {
    phase: "The incident",
    body: "An earlier build of the platform stored credentials in plain text. It was caught before any customer data moved, but it was the kind of mistake that tells you the process was wrong, not just the line of code.",
  },
  {
    phase: "The audit",
    body: "Rather than patch the one file, we put the whole codebase through an external review — every auth path, every session boundary, every place user input reached the database.",
  },
  {
    phase: "The remediation",
    body: "Delivered in phases so nothing shipped half-migrated: PBKDF2 password hashing, server-side sessions with version-based invalidation, and a rate limiter that blocks rather than allows when the database is unreachable.",
  },
];

export default function CaseStudy() {
  return (
    <section id="case-study" className="section-dark relative overflow-hidden py-28 md:py-40">
      <div className="mx-auto max-w-6xl px-6">
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-[#2997ff]"
        >
          Flagship build
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
          className="text-display-lg max-w-3xl text-[#f5f5f7]"
        >
          The site you&rsquo;re on right now.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
          className="text-body-lg mt-8 max-w-2xl text-[#86868b]"
        >
          theverspektive.com is a real platform with real users — a multi-brand
          content system, an authenticated account area, and an admin CMS that
          non-developers actually use. It is the most honest thing we can show
          you, because you can inspect every part of it yourself.
        </motion.p>
      </div>

      {/* Proof asset — the live product, not a mockup. */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-8%" }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto mt-20 max-w-6xl px-6"
      >
        <div className="gradient-border-hover overflow-hidden rounded-2xl border border-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.6)]">
          <Image
            src="/Productions screenshot.png"
            alt="The VerspeKtive Productions page in the live product"
            width={2400}
            height={1350}
            className="h-auto w-full"
            sizes="(max-width: 768px) 100vw, 1152px"
          />
        </div>
      </motion.div>

      <div className="mx-auto mt-20 max-w-6xl px-6">
        {/* Stack */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12%" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="border-t border-white/10 pt-10"
        >
          <h3 className="mb-6 text-sm font-medium uppercase tracking-[0.18em] text-[#86868b]">
            Running on
          </h3>
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {STACK.map((item) => (
              <span key={item} className="text-headline text-[#f5f5f7]">
                {item}
              </span>
            ))}
          </div>
          <p className="mt-6 max-w-2xl text-sm text-[#86868b]">
            Razorpay checkout is in progress — the order pipeline and schema are
            in place, payment capture is not yet live.
          </p>
        </motion.div>

        {/* Security-hardening story */}
        <div className="mt-24">
          <motion.h3
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-12%" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-display-md max-w-2xl text-[#f5f5f7]"
          >
            We&rsquo;d rather show you the part that went wrong.
          </motion.h3>

          <div className="mt-14 grid gap-px overflow-hidden rounded-xl bg-white/10 md:grid-cols-3">
            {HARDENING.map((item, i) => (
              <motion.div
                key={item.phase}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                  delay: i * 0.1,
                }}
                className="bg-black p-8 md:p-10"
              >
                <div className="mb-4 text-sm font-medium uppercase tracking-[0.16em] text-[#2997ff]">
                  {item.phase}
                </div>
                <p className="text-[#86868b] leading-relaxed">{item.body}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12"
          >
            <a
              href="https://theverspektive.com"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-link"
            >
              Visit the live site
              <ChevronRight aria-hidden="true" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
