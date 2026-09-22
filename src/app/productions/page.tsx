import { getCuratedVideos, getLatestVideos } from "@/lib/youtube";
import ProductionsClient from "./client-page";
import productionsData from "../../../content/productions.json";
import productionsTeamData from "../../../content/teams/productions.json";

export default async function Productions() {
  let curatedVideos: any[] = [];
  let latestVideos: any[] = [];
  let teams: any[] = productionsTeamData;

  try {
    const [curated, latest] = await Promise.all([
      getCuratedVideos(6),
      getLatestVideos(6)
    ]);
    
    curatedVideos = curated;
    latestVideos = latest;
  } catch (error) {
    console.error("Failed to load videos from YouTube service", error);
  }

  return (
    <ProductionsClient 
      initialVideos={curatedVideos} 
      teams={teams} 
      youtubeApiVideos={latestVideos} 
    />
  );
}
