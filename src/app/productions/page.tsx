import { getCuratedVideos } from "@/lib/youtube";
import ProductionsClient from "./client-page";
import productionsTeamData from "../../../content/teams/productions.json";

export default async function Productions() {
  let teams: any[] = productionsTeamData;
  let curatedVideos: any[] = [];

  try {
    curatedVideos = await getCuratedVideos(10);
  } catch (error) {
    console.error("Failed to load videos from YouTube service", error);
  }

  return (
    <ProductionsClient 
      initialVideos={curatedVideos}
      teams={teams} 
    />
  );
}
