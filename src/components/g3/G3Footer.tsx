"use client";

/**
 * Footer on a wood surface (spec 3), with the infinite marquee from spec 3a —
 * one of the signature moments, chosen here because it is cheap, gives the
 * dark footer some life, and costs nothing on the animation budget (it is a
 * CSS transform loop, not a pinned ScrollTrigger).
 */

import Link from "next/link";
import { useReducedMotion } from "framer-motion";

const TAGLINE = "G3 Builders & Architecture — Architecture · Interiors · Construction · Renovation — ";

export default function G3Footer() {
  const reduced = useReducedMotion();

  return (
    <footer className="g3-wood-surface-deep relative overflow-hidden">
      {/* Marquee */}
      <div className="overflow-hidden border-b py-5" style={{ borderColor: "var(--g3-rule-faint)" }}>
        <div
          className="flex whitespace-nowrap"
          style={reduced ? undefined : { animation: "g3-marquee 32s linear infinite" }}
        >
          {[0, 1].map((i) => (
            <span
              key={i}
              className="shrink-0 pr-8 text-lg tracking-tight"
              style={{ fontFamily: "var(--g3-font-display)", color: "var(--g3-ink-faint)" }}
              aria-hidden={i === 1}
            >
              {TAGLINE.repeat(3)}
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <p className="g3-display-md mb-3" style={{ color: "var(--g3-ink)" }}>
            G3 Builders<br />&amp; Architecture
          </p>
          <p className="g3-body max-w-sm">
            Architecture, interiors and construction delivered end to end.
          </p>
        </div>

        <div>
          <p className="g3-meta mb-4">Explore</p>
          <ul className="space-y-2 text-sm">
            {[
              ["Projects", "/g3-builders/projects"],
              ["Services", "/g3-builders/services"],
              ["Process", "/g3-builders/process"],
              ["About", "/g3-builders/about"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} style={{ color: "var(--g3-ink-soft)" }}>{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="g3-meta mb-4">Contact</p>
          <ul className="space-y-2 text-sm" style={{ color: "var(--g3-ink-soft)" }}>
            <li><a href="tel:+919880000000">+91 98800 00000</a></li>
            <li><a href="mailto:verspektive@gmail.com">verspektive@gmail.com</a></li>
            <li>Moodbidri, Karnataka</li>
          </ul>
        </div>
      </div>

      <div className="border-t px-6 py-6 text-center text-xs" style={{ borderColor: "var(--g3-rule-faint)", color: "var(--g3-ink-faint)" }}>
        © {new Date().getFullYear()} G3 Builders &amp; Architecture · A VerspeKtive company
      </div>

      <style jsx>{`
        @keyframes g3-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </footer>
  );
}
