export const runtime = 'edge';

import { getRequestContext } from "@cloudflare/next-on-pages";
import { getDb } from "@/db/client";
import { youtube_videos, pages } from "@/db/schema";
import { desc, and, eq } from "drizzle-orm";
import ProductionsClient from "./client-page";

export default async function Productions() {
  let videos: any[] = [];
  let teams: any[] = [];

  try {
    const env = getRequestContext().env;
    if (env && env.DB) {
      const db = getDb(env.DB);
      const results = await db.select().from(youtube_videos).orderBy(desc(youtube_videos.created_at));
      
      // Serialize dates for Client Component
      videos = results.map(v => ({
        ...v,
        created_at: v.created_at.toISOString(),
      }));

      // Fetch teams JSON
      const teamConfig = await db.select().from(pages).where(
        and(eq(pages.slug, "productions"), eq(pages.section_key, "teams"))
      );
      if (teamConfig.length > 0 && teamConfig[0].value) {
        try {
          teams = JSON.parse(teamConfig[0].value);
        } catch (e) {}
      }
    }
  } catch (error) {
    console.error("Failed to load videos/teams from D1", error);
  }

  return <ProductionsClient initialVideos={videos} teams={teams} />;
}
