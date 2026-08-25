export const runtime = 'edge';

import { getRequestContext } from "@cloudflare/next-on-pages";
import { getDb } from "@/db/client";
import { pages } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import TalkItOutClient from "./client-page";

export const metadata = {
  title: "Talk It Out | VerspeKtive Productions",
};

export default async function TalkItOutPage() {
  let playlists: { id: string, title: string, playlistId: string }[] = [];
  let playlistVideos: Record<string, any[]> = {};

  try {
    let env: any = null;
    try {
      env = getRequestContext().env;
    } catch (e) {
      // getRequestContext throws in Vercel, ignore
    }

    if (env && env.DB) {
      const db = getDb(env.DB);
      const playlistsConfig = await db.select().from(pages).where(
        and(eq(pages.slug, "talk-it-out"), eq(pages.section_key, "playlists"))
      );
      
      if (playlistsConfig.length > 0 && playlistsConfig[0].value) {
        try {
          playlists = JSON.parse(playlistsConfig[0].value);
        } catch (e) {}
      }
    }

    // Default playlists if none configured
    if (playlists.length === 0) {
      playlists = [
        { id: "tulu", title: "Tulu", playlistId: "" },
        { id: "kannada", title: "Kannada", playlistId: "" },
        { id: "english", title: "English", playlistId: "" }
      ];
    }

    // Fetch from YouTube Data API
    const ytApiKey = (env as any)?.YOUTUBE_API_KEY || process.env.YOUTUBE_API_KEY;

    if (ytApiKey) {
      for (const playlist of playlists) {
        if (!playlist.playlistId) continue;
        
        const ytUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlist.playlistId}&maxResults=10&key=${ytApiKey}`;
        const res = await fetch(ytUrl, { next: { revalidate: 3600 } });
        
        if (res.ok) {
          const data = (await res.json()) as any;
          if (data.items) {
            playlistVideos[playlist.id] = data.items.map((item: any) => ({
              id: item.snippet.resourceId.videoId,
              title: item.snippet.title,
              thumbnail_url: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
              youtube_url: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
              published_at: item.snippet.publishedAt,
            }));
          }
        } else {
          console.error(`YouTube API error for playlist ${playlist.playlistId}:`, await res.text());
        }
      }
    }
  } catch (error) {
    console.error("Failed to load playlists or YouTube API data", error);
  }

  return <TalkItOutClient playlists={playlists} playlistVideos={playlistVideos} />;
}
