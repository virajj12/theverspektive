"use client";

/** Inquiries inbox (spec 5a): view leads, move them new → contacted → closed. */

import { useCallback, useEffect, useState } from "react";
import { Mail, Phone, MapPin, Loader2 } from "lucide-react";

interface Inquiry {
  id: number;
  name: string;
  phone: string;
  email: string;
  project_type: string | null;
  budget_range: string | null;
  location: string | null;
  message: string | null;
  status: string;
  created_at: number | string;
}

const STATUSES = ["new", "contacted", "closed"] as const;

const CHIP: Record<string, string> = {
  new: "bg-amber-100 text-amber-800",
  contacted: "bg-blue-100 text-blue-800",
  closed: "bg-zinc-100 text-zinc-600",
};

function when(value: number | string) {
  const d = new Date(typeof value === "number" ? value * 1000 : value);
  return isNaN(d.getTime())
    ? "—"
    : d.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function InquiriesInbox() {
  const [items, setItems] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const load = useCallback(async () => {
    // `loading` starts true, so no setState here — refreshes update in place
    // rather than flashing a spinner, and the effect stays synchronously pure.
    try {
      const res = await fetch("/api/g3/inquiries");
      const data = (await res.json()) as { inquiries?: Inquiry[]; error?: string };
      if (!res.ok) throw new Error(data.error || "Could not load enquiries");
      setItems(data.inquiries || []);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load enquiries");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => { if (!cancelled) await load(); })();
    return () => { cancelled = true; };
  }, [load]);

  async function setStatus(id: number, status: string) {
    setItems((p) => p.map((x) => (x.id === id ? { ...x, status } : x)));
    const res = await fetch(`/api/g3/inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) { setError("Could not update that enquiry"); load(); }
  }

  const shown = filter === "all" ? items : items.filter((i) => i.status === filter);
  const counts = STATUSES.map((s) => ({ s, n: items.filter((i) => i.status === s).length }));

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`rounded-full px-3 py-1.5 text-sm ${filter === "all" ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-600"}`}
        >
          All ({items.length})
        </button>
        {counts.map(({ s, n }) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1.5 text-sm capitalize ${filter === s ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-600"}`}
          >
            {s} ({n})
          </button>
        ))}
      </div>

      {error && <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      {loading ? (
        <p className="flex items-center justify-center gap-2 text-zinc-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </p>
      ) : shown.length === 0 ? (
        <p className="py-12 text-center text-zinc-500">No enquiries here.</p>
      ) : (
        <ul className="space-y-3">
          {shown.map((q) => (
            <li key={q.id} className="rounded-xl border border-zinc-200 bg-white p-4">
              <div className="mb-2 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-zinc-900">{q.name}</p>
                  <p className="text-xs text-zinc-400">{when(q.created_at)}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${CHIP[q.status] || CHIP.closed}`}>
                  {q.status}
                </span>
              </div>

              <div className="mb-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-zinc-600">
                <a href={`tel:${q.phone}`} className="flex items-center gap-1.5 hover:text-zinc-900">
                  <Phone className="h-3.5 w-3.5" /> {q.phone}
                </a>
                <a href={`mailto:${q.email}`} className="flex items-center gap-1.5 hover:text-zinc-900">
                  <Mail className="h-3.5 w-3.5" /> {q.email}
                </a>
                {q.location && (
                  <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {q.location}</span>
                )}
              </div>

              {(q.project_type || q.budget_range) && (
                <p className="mb-2 text-sm text-zinc-500">
                  {q.project_type && <>Type: <strong className="text-zinc-700">{q.project_type}</strong></>}
                  {q.project_type && q.budget_range && " · "}
                  {q.budget_range && <>Budget: <strong className="text-zinc-700">{q.budget_range}</strong></>}
                </p>
              )}

              {q.message && (
                <p className="mb-3 whitespace-pre-wrap rounded-lg bg-zinc-50 p-3 text-sm text-zinc-700">{q.message}</p>
              )}

              <div className="flex gap-2">
                {STATUSES.filter((s) => s !== q.status).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(q.id, s)}
                    className="rounded-lg border border-zinc-300 px-3 py-1 text-xs capitalize text-zinc-600 hover:bg-zinc-50"
                  >
                    Mark {s}
                  </button>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
