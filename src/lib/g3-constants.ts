/**
 * Client-safe G3 constants and types.
 *
 * Deliberately separate from g3-data.ts: that module imports the Cloudflare
 * request context and Drizzle, which drag in `server-only`. A client component
 * importing so much as a category list from there fails the build with
 * "'server-only' cannot be imported from a Client Component module".
 *
 * Anything both sides need lives here. Nothing in this file may import
 * server-side modules.
 */

export const G3_CATEGORIES = ["Residential", "Commercial", "Interiors", "Concept"] as const;

export type G3Category = (typeof G3_CATEGORIES)[number];

export const G3_STATUSES = ["completed", "in-progress", "concept"] as const;

export interface G3Image {
  url: string;
  alt: string;
  width: number | null;
  height: number | null;
  type: string;
  thumbnailUrl: string | null;
}

export interface G3Project {
  id: number;
  title: string;
  slug: string;
  category: string;
  location: string | null;
  sqft: number | null;
  year: number | null;
  status: string;
  clientName: string | null;
  summary: string | null;
  body: string | null;
  featured: boolean;
  cover: G3Image | null;
}

export interface G3GalleryItem extends G3Image {
  caption: string | null;
}
