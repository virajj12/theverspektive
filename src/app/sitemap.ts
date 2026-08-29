import type { MetadataRoute } from "next";

/**
 * Sitemap (spec 7). Static routes only.
 *
 * Project detail URLs are deliberately omitted: generating them needs a D1
 * read, and sitemap.ts runs in the Node build context where the Cloudflare
 * binding does not exist. A sitemap that 500s the build is worse than one
 * that lists the routes crawlers can walk to anyway from /g3-builders/projects.
 */
const BASE = "https://theverspektive.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const g3 = [
    "", "/projects", "/services", "/process", "/about", "/contact",
  ].map((path) => ({
    url: `${BASE}/g3-builders${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 0.9 : 0.7,
  }));

  const core = ["", "/tech", "/productions", "/founder", "/store"].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  return [...core, ...g3];
}
