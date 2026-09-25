import youtubeConfig from "../../content/youtube.json";
import { unstable_cache } from "next/cache";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

export interface YouTubeVideo {
  id: string;
  title: string;
  youtube_url: string;
  thumbnail_url: string;
  published_at: string;
  isShort?: boolean;
  viewCount?: string;
}

// Helper to extract video ID from URL
function extractVideoId(url: string) {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
  return match ? match[1] : null;
}

// Helper to extract playlist ID from URL
function extractPlaylistId(url: string) {
  const match = url.match(/[&?]list=([^&]+)/);
  return match ? match[1] : null;
}

// Helper to quickly check if a video is a YouTube Short
async function checkIsShort(videoId: string): Promise<boolean> {
  try {
    const res = await fetch(`https://www.youtube.com/shorts/${videoId}`, { 
      method: 'HEAD', 
      redirect: 'manual' 
    });
    return res.status === 200;
  } catch (error) {
    return false;
  }
}

async function fetchVideoStatistics(videoIds: string[]): Promise<Record<string, string>> {
  if (!YOUTUBE_API_KEY || videoIds.length === 0) return {};
  
  const chunks = [];
  for (let i = 0; i < videoIds.length; i += 50) {
    chunks.push(videoIds.slice(i, i + 50));
  }

  const statsMap: Record<string, string> = {};

  for (const chunk of chunks) {
    const data = await fetchFromYouTube("videos", {
      part: "statistics",
      id: chunk.join(",")
    });

    if (data?.items) {
      data.items.forEach((item: any) => {
        statsMap[item.id] = item.statistics?.viewCount || "0";
      });
    }
  }

  return statsMap;
}

async function fetchFromYouTube(endpoint: string, params: Record<string, string>) {
  if (!YOUTUBE_API_KEY) {
    console.warn("YOUTUBE_API_KEY is not set. Returning empty data.");
    return null;
  }

  const queryParams = new URLSearchParams({
    ...params,
    key: YOUTUBE_API_KEY,
  });

  const url = `https://www.googleapis.com/youtube/v3/${endpoint}?${queryParams.toString()}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    console.warn(`YouTube API Request Failed: ${response.status} ${response.statusText}`, await response.text());
    return null;
  }

  return response.json();
}

export const getLatestVideos = unstable_cache(
  async (maxResults: number = 50): Promise<YouTubeVideo[]> => {
    if (!youtubeConfig.channelId || youtubeConfig.channelId.includes("YOURCHANNELID")) return [];
    
    const data = await fetchFromYouTube("search", {
      part: "snippet",
      channelId: youtubeConfig.channelId,
      maxResults: maxResults.toString(),
      order: "date",
      type: "video"
    });

    if (!data?.items) return [];

    const videosWithoutStats = await Promise.all(data.items.map(async (item: any) => {
      const isShort = await checkIsShort(item.id.videoId);
      return {
        id: item.id.videoId,
        title: item.snippet.title,
        youtube_url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        thumbnail_url: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
        published_at: item.snippet.publishedAt,
        isShort
      };
    }));

    const statsMap = await fetchVideoStatistics(videosWithoutStats.map(v => v.id));

    return videosWithoutStats.map(v => ({
      ...v,
      viewCount: statsMap[v.id]
    }));
  },
  ['youtube-latest-videos-v3-50'],
  { revalidate: youtubeConfig.cacheTtlSeconds }
);

export const getPlaylistVideos = unstable_cache(
  async (playlistUrlOrId: string, maxResults: number = 20): Promise<YouTubeVideo[]> => {
    let playlistId = playlistUrlOrId.includes("list=") ? extractPlaylistId(playlistUrlOrId) : playlistUrlOrId;
    if (!playlistId || playlistId.includes("MOCK")) return [];

    const data = await fetchFromYouTube("playlistItems", {
      part: "snippet",
      playlistId: playlistId,
      maxResults: maxResults.toString()
    });

    if (!data?.items) return [];

    const videosWithoutStats = data.items.map((item: any) => ({
      id: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      youtube_url: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
      thumbnail_url: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
      published_at: item.snippet.publishedAt,
    }));

    const statsMap = await fetchVideoStatistics(videosWithoutStats.map((v: any) => v.id));

    return videosWithoutStats.map((v: any) => ({
      ...v,
      viewCount: statsMap[v.id]
    }));
  },
  ['youtube-playlist-videos'],
  { revalidate: youtubeConfig.cacheTtlSeconds }
);

export const getVideoDetails = unstable_cache(
  async (videoUrlOrId: string): Promise<YouTubeVideo | null> => {
    let videoId = videoUrlOrId.includes("watch?v=") || videoUrlOrId.includes("youtu.be") 
      ? extractVideoId(videoUrlOrId) 
      : videoUrlOrId;
      
    if (!videoId || videoId.includes("MOCK")) return null;

    const data = await fetchFromYouTube("videos", {
      part: "snippet,statistics",
      id: videoId
    });

    if (!data?.items?.[0]) return null;
    const item = data.items[0];

    return {
      id: item.id,
      title: item.snippet.title,
      youtube_url: `https://www.youtube.com/watch?v=${item.id}`,
      thumbnail_url: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
      published_at: item.snippet.publishedAt,
      viewCount: item.statistics?.viewCount || "0",
    };
  },
  ['youtube-video-details'],
  { revalidate: youtubeConfig.cacheTtlSeconds }
);

export const getCuratedVideos = async (limit: number = 6): Promise<YouTubeVideo[]> => {
  const curatedItems = youtubeConfig.curated;
  let allVideos: YouTubeVideo[] = [];

  for (const item of curatedItems) {
    if (item.type === "video") {
      const video = await getVideoDetails(item.url);
      if (video) allVideos.push(video);
    } else if (item.type === "playlist") {
      const playlistVideos = await getPlaylistVideos(item.url, 10);
      allVideos.push(...playlistVideos);
    }
  }

  // Deduplicate and slice
  const uniqueVideos = Array.from(new Map(allVideos.map(v => [v.id, v])).values());
  return uniqueVideos.slice(0, limit);
};
