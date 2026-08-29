"use client";

/**
 * Media Library (spec 5a): grid of every asset, drag-and-drop multi-upload,
 * usage visibility, alt-text editing, delete.
 *
 * Doubles as the media picker — pass `pickMode` and it renders a selection
 * affordance instead of management controls, so "choose from library or
 * upload new" is one component rather than two that drift apart.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { UploadCloud, Trash2, Pencil, Film, Check, X, Loader2 } from "lucide-react";
import { useG3Upload } from "./use-g3-upload";

export interface MediaItem {
  id: number;
  type: string;
  url: string;
  alt_text: string;
  thumbnail_url: string | null;
  width: number | null;
  height: number | null;
  duration_seconds: number | null;
  size_bytes: number | null;
  usedIn?: string[];
}

function humanSize(bytes: number | null) {
  if (!bytes) return "";
  return bytes > 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.round(bytes / 1024)} KB`;
}

export default function MediaLibrary({
  pickMode = false,
  onPick,
  selectedIds = [],
}: {
  pickMode?: boolean;
  onPick?: (item: MediaItem) => void;
  selectedIds?: number[];
}) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [queue, setQueue] = useState<{ name: string; status: string }[]>([]);
  const [editing, setEditing] = useState<number | null>(null);
  const [draftAlt, setDraftAlt] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { upload, progress, busy } = useG3Upload();

  const load = useCallback(async () => {
    // `loading` starts true, so no setState here — refreshes update in place
    // rather than flashing a spinner, and the effect stays synchronously pure.
    try {
      const res = await fetch("/api/g3/media");
      const data = (await res.json()) as { media?: MediaItem[]; error?: string };
      if (!res.ok) throw new Error(data.error || "Could not load media");
      setItems(data.media || []);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load media");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => { if (!cancelled) await load(); })();
    return () => { cancelled = true; };
  }, [load]);

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const list = Array.from(files);
    if (!list.length) return;
    setQueue(list.map((f) => ({ name: f.name, status: "waiting" })));

    for (let i = 0; i < list.length; i++) {
      const file = list[i];
      setQueue((q) => q.map((x, j) => (j === i ? { ...x, status: "uploading" } : x)));
      try {
        // Alt text is required by the API. Seed it from the filename so bulk
        // uploads aren't blocked, and flag it for editing right after.
        const seed = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim() || "G3 asset";
        await upload(file, seed);
        setQueue((q) => q.map((x, j) => (j === i ? { ...x, status: "done" } : x)));
      } catch (e) {
        const msg = e instanceof Error ? e.message : "failed";
        setQueue((q) => q.map((x, j) => (j === i ? { ...x, status: msg } : x)));
      }
    }
    await load();
    setTimeout(() => setQueue([]), 2500);
  }, [upload, load]);

  async function saveAlt(id: number) {
    try {
      const res = await fetch(`/api/g3/media/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ altText: draftAlt }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Could not save");
      setItems((prev) => prev.map((m) => (m.id === id ? { ...m, alt_text: draftAlt } : m)));
      setEditing(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save alt text");
    }
  }

  async function remove(id: number) {
    if (!confirm("Delete this asset permanently?")) return;
    try {
      const res = await fetch(`/api/g3/media/${id}`, { method: "DELETE" });
      const data = (await res.json()) as { error?: string; usedIn?: string[] };
      if (!res.ok) {
        setError(data.usedIn?.length ? `${data.error} (${data.usedIn.join(", ")})` : data.error || "Could not delete");
        return;
      }
      setItems((prev) => prev.filter((m) => m.id !== id));
      setError("");
    } catch {
      setError("Could not delete the asset");
    }
  }

  return (
    <div>
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
          dragOver ? "border-amber-500 bg-amber-50" : "border-zinc-300 bg-white hover:border-zinc-400"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm"
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        {busy ? (
          <div className="flex items-center justify-center gap-3 text-zinc-700">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="font-medium">Uploading… {progress}%</span>
          </div>
        ) : (
          <>
            <UploadCloud className="mx-auto mb-2 h-7 w-7 text-zinc-400" />
            <p className="font-medium text-zinc-700">Drop images or video here, or click to choose</p>
            <p className="mt-1 text-sm text-zinc-500">
              Images up to 15MB · video up to 200MB · uploaded straight to R2
            </p>
          </>
        )}
      </div>

      {queue.length > 0 && (
        <ul className="mt-3 space-y-1 text-sm">
          {queue.map((q, i) => (
            <li key={i} className="flex justify-between rounded bg-zinc-100 px-3 py-1.5">
              <span className="truncate text-zinc-700">{q.name}</span>
              <span className={q.status === "done" ? "text-green-600" : "text-zinc-500"}>{q.status}</span>
            </li>
          ))}
        </ul>
      )}

      {error && (
        <div className="mt-4 flex items-start justify-between gap-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>
          <button onClick={() => setError("")} aria-label="Dismiss"><X className="h-4 w-4" /></button>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <p className="mt-8 text-center text-zinc-500">Loading library…</p>
      ) : items.length === 0 ? (
        <p className="mt-8 text-center text-zinc-500">Nothing uploaded yet.</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((m) => {
            const selected = selectedIds.includes(m.id);
            const poster = m.thumbnail_url || m.url;
            return (
              <div
                key={m.id}
                className={`overflow-hidden rounded-lg border bg-white transition-shadow ${
                  selected ? "border-amber-500 ring-2 ring-amber-300" : "border-zinc-200"
                } ${pickMode ? "cursor-pointer hover:shadow-md" : ""}`}
                onClick={pickMode ? () => onPick?.(m) : undefined}
              >
                <div className="relative aspect-square bg-zinc-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={poster} alt={m.alt_text} className="h-full w-full object-cover" loading="lazy" />
                  {m.type === "video" && (
                    <span className="absolute left-2 top-2 flex items-center gap-1 rounded bg-black/70 px-1.5 py-0.5 text-[11px] font-medium text-white">
                      <Film className="h-3 w-3" />
                      {m.duration_seconds ? `${m.duration_seconds}s` : "video"}
                    </span>
                  )}
                  {selected && (
                    <span className="absolute right-2 top-2 rounded-full bg-amber-500 p-1 text-white">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                </div>

                <div className="p-2.5">
                  {editing === m.id ? (
                    <div className="flex gap-1">
                      <input
                        value={draftAlt}
                        onChange={(e) => setDraftAlt(e.target.value)}
                        className="w-full rounded border border-zinc-300 px-2 py-1 text-xs"
                        autoFocus
                      />
                      <button onClick={() => saveAlt(m.id)} className="text-green-600" aria-label="Save alt text">
                        <Check className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <p className="truncate text-xs text-zinc-700" title={m.alt_text}>{m.alt_text}</p>
                  )}

                  <p className="mt-1 text-[11px] text-zinc-400">
                    {m.width && m.height ? `${m.width}×${m.height}` : ""} {humanSize(m.size_bytes)}
                  </p>

                  {m.usedIn && m.usedIn.length > 0 && (
                    <p className="mt-1 truncate text-[11px] text-amber-700" title={m.usedIn.join(", ")}>
                      Used in {m.usedIn.length}: {m.usedIn[0]}
                    </p>
                  )}

                  {!pickMode && (
                    <div className="mt-2 flex gap-3">
                      <button
                        onClick={() => { setEditing(m.id); setDraftAlt(m.alt_text); }}
                        className="flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-800"
                      >
                        <Pencil className="h-3 w-3" /> Alt
                      </button>
                      <button
                        onClick={() => remove(m.id)}
                        className="flex items-center gap-1 text-[11px] text-red-500 hover:text-red-700 disabled:opacity-40"
                        disabled={Boolean(m.usedIn?.length)}
                        title={m.usedIn?.length ? "Remove it from where it's used first" : "Delete"}
                      >
                        <Trash2 className="h-3 w-3" /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
