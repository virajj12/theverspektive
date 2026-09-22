import TalkItOutClient from "./client-page";
import { getPlaylistVideos } from "@/lib/youtube";
import youtubeConfig from "../../../../../content/youtube.json";

export const metadata = {
  title: "Talk It Out | VerspeKtive Productions",
};

export default async function TalkItOutPage() {
  const playlists = [
    { id: "tulu", title: "Tulu", playlistId: youtubeConfig.playlists.tulu },
    { id: "kannada", title: "Kannada", playlistId: youtubeConfig.playlists.kannada },
    { id: "english", title: "English", playlistId: youtubeConfig.playlists.english }
  ];
  
  let playlistVideos: Record<string, any[]> = {};
  let heroTitle = "Talk It Out";
  let heroSubtitle = "Talk It Out — the flagship podcast series produced by VerspeKtive Productions.";

  try {
    for (const playlist of playlists) {
      if (playlist.playlistId) {
        playlistVideos[playlist.id] = await getPlaylistVideos(playlist.playlistId, 10);
      }
    }
  } catch (error) {
    console.error("Failed to load Talk It Out playlists from YouTube API", error);
  }

  return <TalkItOutClient playlists={playlists} playlistVideos={playlistVideos} heroTitle={heroTitle} heroSubtitle={heroSubtitle} />;
}
