import type { MetadataRoute } from "next";

/** robots.txt (spec 7). Admin and API are kept out of the index. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api", "/account"] }],
    sitemap: "https://theverspektive.com/sitemap.xml",
  };
}
