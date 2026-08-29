"use client";

/**
 * Project editor + gallery manager (spec 5a): edit metadata, pick a cover,
 * add media from the library, reorder by drag-and-drop, caption each item,
 * remove items.
 *
 * The gallery is held in local state and saved as one ordered array, matching
 * the API's replace-wholesale contract. That keeps "reorder three images and
 * retitle two captions" a single request instead of five.
 */

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, GripVertical, X, Plus, Loader2, Check, Image as ImageIcon } from "lucide-react";
import MediaLibrary, { type MediaItem } from "./MediaLibrary";

interface Project {
  id: number;
  title: string;
  slug: string;
  category: string;
  location: string | null;
  sqft: number | null;
  year: number | null;
  status: string;
  client_name: string | null;
  summary: string | null;
  body: string | null;
  cover_media_id: number | null;
  featured: boolean;
  published: boolean;
}

interface GalleryRow {
  mediaId: number;
  url: string;
  thumbnailUrl: string | null;
  type: string;
  altText: string;
  caption: string | null;
}

const CATEGORIES = ["Residential", "Commercial", "Interiors", "Concept"];
const STATUSES = ["completed", "in-progress", "concept"];

export default function ProjectEditor({ projectId }: { projectId: number }) {
  const [project, setProject] = useState<Project | null>(null);
  const [gallery, setGallery] = useState<GalleryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [picker, setPicker] = useState<null | "cover" | "gallery">(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const load = useCallback(async () => {
    // `loading` starts true, so no setState here — refreshes update in place
    // rather than flashing a spinner, and the effect stays synchronously pure.
    try {
      const res = await fetch(`/api/g3/projects/${projectId}`);
      const data = (await res.json()) as {
        project?: Project;
        gallery?: (GalleryRow & { sortOrder: number })[];
        error?: string;
      };
      if (!res.ok || !data.project) throw new Error(data.error || "Could not load project");
      setProject(data.project);
      setGallery(
        (data.gallery || []).map((g) => ({
          mediaId: g.mediaId, url: g.url, thumbnailUrl: g.thumbnailUrl,
          type: g.type, altText: g.altText, caption: g.caption,
        }))
      );
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load project");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    let cancelled = false;
    void (async () => { if (!cancelled) await load(); })();
    return () => { cancelled = true; };
  }, [load]);

  function field<K extends keyof Project>(key: K, value: Project[K]) {
    setProject((p) => (p ? { ...p, [key]: value } : p));
    setSaved(false);
  }

  async function save() {
    if (!project) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/g3/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: project.title,
          category: project.category,
          location: project.location,
          sqft: project.sqft,
          year: project.year,
          status: project.status,
          clientName: project.client_name,
          summary: project.summary,
          body: project.body,
          coverMediaId: project.cover_media_id,
          featured: project.featured,
          published: project.published,
          gallery: gallery.map((g) => ({ mediaId: g.mediaId, caption: g.caption })),
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Could not save");
      setSaved(true);
      setError("");
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save");
    } finally {
      setSaving(false);
    }
  }

  function pick(item: MediaItem) {
    if (picker === "cover") {
      field("cover_media_id", item.id);
    } else if (picker === "gallery") {
      setGallery((g) =>
        g.some((x) => x.mediaId === item.id)
          ? g
          : [...g, { mediaId: item.id, url: item.url, thumbnailUrl: item.thumbnail_url, type: item.type, altText: item.alt_text, caption: null }]
      );
      setSaved(false);
      return; // keep the picker open for multi-add
    }
    setPicker(null);
  }

  function reorder(to: number) {
    if (dragIdx === null || dragIdx === to) return;
    const next = [...gallery];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(to, 0, moved);
    setGallery(next);
    setDragIdx(null);
    setSaved(false);
  }

  if (loading) return <p className="text-center text-zinc-500">Loading…</p>;
  if (!project) return <p className="text-center text-red-600">{error || "Not found"}</p>;

  const cover = gallery.find((g) => g.mediaId === project.cover_media_id);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <Link href="/admin/g3/projects" className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-800">
          <ArrowLeft className="h-4 w-4" /> All projects
        </Link>
        <div className="flex items-center gap-3">
          {saved && <span className="flex items-center gap-1 text-sm text-green-600"><Check className="h-4 w-4" /> Saved</span>}
          <button
            onClick={save}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-zinc-900 px-5 py-2 text-sm font-medium text-white disabled:opacity-40"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save
          </button>
        </div>
      </div>

      {error && <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      {/* Metadata */}
      <div className="mb-8 grid gap-4 rounded-xl border border-zinc-200 bg-white p-5 sm:grid-cols-2">
        <label className="sm:col-span-2">
          <span className="mb-1 block text-xs font-medium text-zinc-500">Title</span>
          <input value={project.title} onChange={(e) => field("title", e.target.value)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm" />
        </label>

        <label>
          <span className="mb-1 block text-xs font-medium text-zinc-500">Category</span>
          <select value={project.category} onChange={(e) => field("category", e.target.value)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm">
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>

        <label>
          <span className="mb-1 block text-xs font-medium text-zinc-500">Status</span>
          <select value={project.status} onChange={(e) => field("status", e.target.value)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm">
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>

        <label>
          <span className="mb-1 block text-xs font-medium text-zinc-500">Location</span>
          <input value={project.location ?? ""} onChange={(e) => field("location", e.target.value)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm" />
        </label>

        <label>
          <span className="mb-1 block text-xs font-medium text-zinc-500">Client</span>
          <input value={project.client_name ?? ""} onChange={(e) => field("client_name", e.target.value)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm" />
        </label>

        <label>
          <span className="mb-1 block text-xs font-medium text-zinc-500">Sq ft</span>
          <input type="number" inputMode="numeric" value={project.sqft ?? ""}
            onChange={(e) => field("sqft", e.target.value ? Number(e.target.value) : null)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm" />
        </label>

        <label>
          <span className="mb-1 block text-xs font-medium text-zinc-500">Year</span>
          <input type="number" inputMode="numeric" value={project.year ?? ""}
            onChange={(e) => field("year", e.target.value ? Number(e.target.value) : null)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm" />
        </label>

        <label className="sm:col-span-2">
          <span className="mb-1 block text-xs font-medium text-zinc-500">Summary</span>
          <textarea rows={2} value={project.summary ?? ""} onChange={(e) => field("summary", e.target.value)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm" />
        </label>

        <label className="sm:col-span-2">
          <span className="mb-1 block text-xs font-medium text-zinc-500">Narrative — brief, challenge, approach</span>
          <textarea rows={6} value={project.body ?? ""} onChange={(e) => field("body", e.target.value)}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm" />
        </label>

        <div className="flex gap-6 sm:col-span-2">
          <label className="flex items-center gap-2 text-sm text-zinc-700">
            <input type="checkbox" checked={project.featured} onChange={(e) => field("featured", e.target.checked)} />
            Featured on homepage
          </label>
          <label className="flex items-center gap-2 text-sm text-zinc-700">
            <input type="checkbox" checked={project.published} onChange={(e) => field("published", e.target.checked)} />
            Published
          </label>
        </div>
      </div>

      {/* Cover */}
      <div className="mb-8 rounded-xl border border-zinc-200 bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold text-zinc-900">Cover image</h2>
          <button onClick={() => setPicker("cover")} className="text-sm text-amber-700 hover:underline">
            {project.cover_media_id ? "Change" : "Choose"}
          </button>
        </div>
        {project.cover_media_id ? (
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cover?.thumbnailUrl || cover?.url || ""} alt={cover?.altText || "Cover"}
              className="h-20 w-28 rounded-lg border border-zinc-200 object-cover" />
            <button onClick={() => field("cover_media_id", null)} className="text-sm text-red-500 hover:underline">
              Remove
            </button>
          </div>
        ) : (
          <p className="flex items-center gap-2 text-sm text-zinc-500">
            <ImageIcon className="h-4 w-4" /> No cover set — add the image to the gallery first, then pick it here.
          </p>
        )}
      </div>

      {/* Gallery */}
      <div className="rounded-xl border border-zinc-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-zinc-900">Gallery</h2>
            <p className="text-xs text-zinc-500">Drag to reorder. Order here is the order on the site.</p>
          </div>
          <button onClick={() => setPicker("gallery")}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-50">
            <Plus className="h-4 w-4" /> Add media
          </button>
        </div>

        {gallery.length === 0 ? (
          <p className="py-8 text-center text-sm text-zinc-500">No images yet.</p>
        ) : (
          <ul className="space-y-2">
            {gallery.map((g, i) => (
              <li
                key={g.mediaId}
                draggable
                onDragStart={() => setDragIdx(i)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => reorder(i)}
                className={`flex items-center gap-3 rounded-lg border p-2 ${
                  dragIdx === i ? "border-amber-400 opacity-60" : "border-zinc-200"
                }`}
              >
                <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-zinc-300" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.thumbnailUrl || g.url} alt={g.altText}
                  className="h-14 w-20 shrink-0 rounded object-cover" />
                <input
                  value={g.caption ?? ""}
                  onChange={(e) => {
                    const v = e.target.value;
                    setGallery((prev) => prev.map((x, j) => (j === i ? { ...x, caption: v } : x)));
                    setSaved(false);
                  }}
                  placeholder="Caption (optional)"
                  className="flex-1 rounded border border-zinc-200 px-2 py-1.5 text-sm"
                />
                {project.cover_media_id !== g.mediaId && (
                  <button onClick={() => field("cover_media_id", g.mediaId)}
                    className="whitespace-nowrap text-xs text-zinc-500 hover:text-amber-700">
                    Set cover
                  </button>
                )}
                <button
                  onClick={() => {
                    setGallery((prev) => prev.filter((_, j) => j !== i));
                    if (project.cover_media_id === g.mediaId) field("cover_media_id", null);
                    setSaved(false);
                  }}
                  className="text-zinc-400 hover:text-red-600"
                  aria-label="Remove from gallery"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Picker */}
      {picker && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:p-8">
          <div className="w-full max-w-4xl rounded-xl bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-zinc-900">
                {picker === "cover" ? "Choose a cover image" : "Add media to the gallery"}
              </h3>
              <button onClick={() => setPicker(null)} className="text-zinc-400 hover:text-zinc-700" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            <MediaLibrary
              pickMode
              onPick={pick}
              selectedIds={picker === "cover"
                ? (project.cover_media_id ? [project.cover_media_id] : [])
                : gallery.map((g) => g.mediaId)}
            />
            {picker === "gallery" && (
              <div className="mt-4 flex justify-end">
                <button onClick={() => setPicker(null)}
                  className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white">Done</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
