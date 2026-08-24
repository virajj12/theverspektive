export const runtime = 'edge';

import { getRequestContext } from "@cloudflare/next-on-pages";
import { getDb } from "@/db/client";
import { youtube_videos, pages } from "@/db/schema";
import { desc, and, eq } from "drizzle-orm";
import ProductionsClient from "./client-page";

export default async function Productions() {
  let videos: any[] = [];
  let teams: any[] = [];

  let youtubeApiVideos: any[] = [];

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

    // Fetch from YouTube Data API
    const ytApiKey = (env as any)?.YOUTUBE_API_KEY || process.env.YOUTUBE_API_KEY;
    const ytChannelId = (env as any)?.YOUTUBE_CHANNEL_ID || process.env.YOUTUBE_CHANNEL_ID;

    if (ytApiKey && ytChannelId) {
      const ytUrl = `https://www.googleapis.com/youtube/v3/search?key=${ytApiKey}&channelId=${ytChannelId}&part=snippet,id&order=date&maxResults=5&type=video`;
      const res = await fetch(ytUrl, { next: { revalidate: 3600 } });
      
      if (res.ok) {
        const data = await res.json();
        if (data.items) {
          youtubeApiVideos = data.items.map((item: any) => ({
            id: item.id.videoId,
            title: item.snippet.title,
            thumbnail_url: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
            youtube_url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
            published_at: item.snippet.publishedAt,
          }));
        }
      } else {
        console.error("YouTube API error:", await res.text());
      }
    }
  } catch (error) {
    console.error("Failed to load videos/teams from D1 or YouTube API", error);
  }

  return <ProductionsClient initialVideos={videos} teams={teams} youtubeApiVideos={youtubeApiVideos} />;
}
