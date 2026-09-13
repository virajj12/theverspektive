export const runtime = 'edge';

import ParallaxManager from "@/components/admin/g3/ParallaxManager";

export default function G3ParallaxPage() {
  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-zinc-900">Parallax Images</h1>
      <p className="mb-8 text-zinc-500">
        Upload or choose images for the immersive parallax sections on the G3 builders page.
      </p>
      <ParallaxManager />
    </div>
  );
}
