import { getCuratedVideos, getLatestVideos, getPlaylistVideos } from "@/lib/youtube";
import TioOriginalsClient from "./client-page";
import tioTeamData from "../../../../content/teams/tio-originals.json";
import youtubeConfig from "../../../../content/youtube.json";

export const metadata = {
  title: "TIO Originals | VerspeKtive Productions",
};

export default async function TioOriginalsPage() {
  let curatedVideos: any[] = [];
  let latestVideos: any[] = [];
  let teams: any[] = tioTeamData;
  let playlistVideos: Record<string, any[]> = {};

  const rawPlaylists: Record<string, string> = youtubeConfig.playlists || {};
  const playlists = Object.entries(rawPlaylists)
    .filter(([_, url]) => url && url.trim() !== "")
    .map(([key, url]) => ({
      id: key,
      title: key.charAt(0).toUpperCase() + key.slice(1),
      playlistId: url
    }));

  try {
    const [curated, latest] = await Promise.all([
      getCuratedVideos(10),
      getLatestVideos(50)
    ]);
    
    curatedVideos = curated;
    latestVideos = latest;

    for (const playlist of playlists) {
      if (playlist.playlistId) {
        playlistVideos[playlist.id] = await getPlaylistVideos(playlist.playlistId, 10);
      }
    }
  } catch (error) {
    console.error("Failed to load videos from YouTube service", error);
  }

  return (
    <TioOriginalsClient 
      initialVideos={curatedVideos} 
      teams={teams} 
      youtubeApiVideos={latestVideos} 
      playlists={playlists}
      playlistVideos={playlistVideos}
    />
  );
}
