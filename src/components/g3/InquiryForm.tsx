"use client";

/**
 * Consultation enquiry form (spec 4.7), posting to /api/g3/inquiries.
 *
 * Mobile keyboard handling per spec 6: type="tel" with inputMode="tel",
 * type="email" with inputMode="email" and autocomplete hints, so phones raise
 * the right keyboard and can autofill. Only name, phone and email are
 * required — everything else is optional to keep the barrier low.
 *
 * Inputs are 16px on purpose: iOS Safari zooms the viewport on focus for
 * anything smaller and does not zoom back out.
 */

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";

const PROJECT_TYPES = ["Residential", "Commercial", "Interiors", "Renovation", "Not sure yet"];
const BUDGETS = ["Under ₹25L", "₹25L – ₹50L", "₹50L – ₹1Cr", "₹1Cr – ₹3Cr", "Above ₹3Cr", "Not sure yet"];

type Status = "idle" | "sending" | "sent" | "error";

export default function InquiryForm() {
  const [form, setForm] = useState({
    name: "", phone: "", email: "",
    projectType: "", budgetRange: "", location: "", message: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const ready = form.name.trim() && form.phone.trim() && form.email.trim();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!ready || status === "sending") return;
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/g3/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          projectType: form.projectType || undefined,
          budgetRange: form.budgetRange || undefined,
          location: form.location.trim() || undefined,
          message: form.message.trim() || undefined,
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
      setError("Couldn't reach the server. Please try again, or call us directly.");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-xl border p-10 text-center" style={{ borderColor: "var(--g3-rule)", background: "var(--g3-black-raised)" }}>
        <div
          className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full"
          style={{ background: "rgba(184,144,91,0.15)", color: "var(--g3-brass-light)" }}
        >
          <Check className="h-6 w-6" />
        </div>
        <h3 className="g3-display-md mb-3" style={{ color: "var(--g3-ink)" }}>Thank you.</h3>
        <p className="g3-body mx-auto max-w-md">
          We&rsquo;ve got your enquiry and someone will call you within two working days.
        </p>
      </div>
    );
  }

  const field = "w-full rounded-lg border bg-transparent px-4 py-3 text-base outline-none transition-colors";
  const style = { borderColor: "var(--g3-rule-faint)", color: "var(--g3-ink)" };
  const labelCls = "mb-1.5 block text-xs font-medium uppercase tracking-wider";
  const labelStyle = { color: "var(--g3-ink-faint)" };

  return (
    <form onSubmit={submit} noValidate className="grid gap-5 sm:grid-cols-2">
      <div>
        <label htmlFor="g3-name" className={labelCls} style={labelStyle}>Name *</label>
        <input
          id="g3-name" required value={form.name} onChange={(e) => set("name", e.target.value)}
          autoComplete="name" className={field} style={style}
        />
      </div>

      <div>
        <label htmlFor="g3-phone" className={labelCls} style={labelStyle}>Phone *</label>
        <input
          id="g3-phone" required type="tel" inputMode="tel" autoComplete="tel"
          value={form.phone} onChange={(e) => set("phone", e.target.value)}
          className={field} style={style}
        />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="g3-email" className={labelCls} style={labelStyle}>Email *</label>
        <input
          id="g3-email" required type="email" inputMode="email" autoComplete="email"
          value={form.email} onChange={(e) => set("email", e.target.value)}
          className={field} style={style}
        />
      </div>

      <div>
        <label htmlFor="g3-type" className={labelCls} style={labelStyle}>Project type</label>
        <select id="g3-type" value={form.projectType} onChange={(e) => set("projectType", e.target.value)} className={field} style={style}>
          <option value="">Select…</option>
          {PROJECT_TYPES.map((t) => <option key={t} value={t} style={{ color: "#111" }}>{t}</option>)}
        </select>
      </div>

      <div>
        <label htmlFor="g3-budget" className={labelCls} style={labelStyle}>Budget range</label>
        <select id="g3-budget" value={form.budgetRange} onChange={(e) => set("budgetRange", e.target.value)} className={field} style={style}>
          <option value="">Select…</option>
          {BUDGETS.map((b) => <option key={b} value={b} style={{ color: "#111" }}>{b}</option>)}
        </select>
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="g3-location" className={labelCls} style={labelStyle}>Location</label>
        <input
          id="g3-location" value={form.location} onChange={(e) => set("location", e.target.value)}
          placeholder="Where is the site?" className={field} style={style}
        />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="g3-message" className={labelCls} style={labelStyle}>Anything else</label>
        <textarea
          id="g3-message" rows={4} value={form.message} onChange={(e) => set("message", e.target.value)}
          placeholder="Tell us about the project…" className={`${field} resize-none`} style={style}
        />
      </div>

      {error && (
        <p role="alert" className="sm:col-span-2 text-sm" style={{ color: "#e57373" }}>{error}</p>
      )}

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={!ready || status === "sending"}
          className="flex w-full items-center justify-center gap-2 rounded-lg px-6 py-4 text-base font-semibold transition-opacity disabled:opacity-40 sm:w-auto"
          style={{ background: "var(--g3-brass)", color: "#0a0908" }}
        >
          {status === "sending" && <Loader2 className="h-4 w-4 animate-spin" />}
          Book a consultation
        </button>
        <p className="mt-3 text-xs" style={{ color: "var(--g3-ink-faint)" }}>
          We reply within two working days. No mailing list, no spam.
        </p>
      </div>
    </form>
  );
}
