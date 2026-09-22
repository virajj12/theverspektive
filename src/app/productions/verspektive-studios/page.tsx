import VerspektiveStudiosClient from "./client-page";
import studiosTeamData from "../../../../content/teams/verspektive-studios.json";

export const metadata = {
  title: "VerspeKtive Studios | VerspeKtive Productions",
};

export default function VerspektiveStudiosPage() {
  return <VerspektiveStudiosClient teams={studiosTeamData} />;
}
