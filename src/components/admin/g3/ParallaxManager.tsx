"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Check, X, Image as ImageIcon } from "lucide-react";
import MediaLibrary, { type MediaItem } from "./MediaLibrary";

interface PageSection {
  id: number;
  slug: string;
  section_key: string;
  hero_media_id: number | null;
}

export default function ParallaxManager() {
  const [pages, setPages] = useState<PageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [picker, setPicker] = useState<{ slug: string, section_key: string } | null>(null);
  const [mediaMap, setMediaMap] = useState<Record<number, MediaItem>>({});
  
  const load = useCallback(async () => {
    try {
      const [pagesRes, mediaRes] = await Promise.all([
        fetch("/api/g3/pages"),
        fetch("/api/g3/media")
      ]);
      
      const pagesData = await pagesRes.json() as { pages?: PageSection[], error?: string };
      const mediaData = await mediaRes.json() as { media?: MediaItem[], error?: string };
      
      if (!pagesRes.ok) throw new Error(pagesData.error || "Could not load pages");
      if (!mediaRes.ok) throw new Error(mediaData.error || "Could not load media");
      
      setPages(pagesData.pages || []);
      
      const map: Record<number, MediaItem> = {};
      if (mediaData.media) {
        mediaData.media.forEach(m => map[m.id] = m);
      }
      setMediaMap(map);
      
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function updateHeroMedia(slug: string, section_key: string, hero_media_id: number | null) {
    try {
      const res = await fetch("/api/g3/pages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, section_key, hero_media_id })
      });
      if (!res.ok) {
        const data = await res.json() as { error?: string };
        throw new Error(data.error || "Could not save");
      }
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save image");
    }
  }

  function pick(item: MediaItem) {
    if (picker) {
      updateHeroMedia(picker.slug, picker.section_key, item.id);
    }
    setPicker(null);
  }

  if (loading) return <p className="text-center text-zinc-500">Loading…</p>;

  // We explicitly want to manage the home hero parallax image.
  // The frontend calls getPageContent("home") and expects a heroImage.
  const homeHeroPage = pages.find(p => p.slug === "home" && p.section_key === "hero");
  const homeMediaId = homeHeroPage?.hero_media_id || null;
  const homeMedia = homeMediaId ? mediaMap[homeMediaId] : null;

  return (
    <div>
      {error && <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="mb-8 rounded-xl border border-zinc-200 bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold text-zinc-900">Home Page Hero Parallax</h2>
          <button onClick={() => setPicker({ slug: "home", section_key: "hero" })} className="text-sm text-amber-700 hover:underline">
            {homeMediaId ? "Change" : "Choose Image"}
          </button>
        </div>
        
        <p className="text-sm text-zinc-500 mb-4">This image appears as the immersive shrinking parallax background at the top of the G3 page.</p>

        {homeMediaId && homeMedia ? (
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={homeMedia.thumbnail_url || homeMedia.url || ""} alt={homeMedia.alt_text || "Cover"}
              className="h-20 w-32 rounded-lg border border-zinc-200 object-cover" />
            <button onClick={() => updateHeroMedia("home", "hero", null)} className="text-sm text-red-500 hover:underline">
              Remove
            </button>
          </div>
        ) : (
          <p className="flex items-center gap-2 text-sm text-zinc-500">
            <ImageIcon className="h-4 w-4" /> No parallax image set. Click choose to select or upload one.
          </p>
        )}
      </div>

      {picker && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:p-8">
          <div className="w-full max-w-4xl rounded-xl bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-zinc-900">
                Choose a parallax image
              </h3>
              <button onClick={() => setPicker(null)} className="text-zinc-400 hover:text-zinc-700" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            <MediaLibrary
              pickMode
              onPick={pick}
              selectedIds={homeMediaId && picker.slug === "home" ? [homeMediaId] : []}
            />
          </div>
        </div>
      )}
    </div>
  );
}
