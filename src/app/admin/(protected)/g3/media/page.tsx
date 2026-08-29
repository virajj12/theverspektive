export const runtime = 'edge';

import MediaLibrary from "@/components/admin/g3/MediaLibrary";

export default function G3MediaPage() {
  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-zinc-900">Media Library</h1>
      <p className="mb-8 text-zinc-500">
        Every image and video used across the G3 site. Uploads go straight to R2 —
        large video never passes through the server.
      </p>
      <MediaLibrary />
    </div>
  );
}
