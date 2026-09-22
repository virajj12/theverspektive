import TioOriginalsClient from "./client-page";
import tioTeamData from "../../../../content/teams/tio-originals.json";

export const metadata = {
  title: "TIO Originals | VerspeKtive Productions",
};

export default function TioOriginalsPage() {
  return <TioOriginalsClient teams={tioTeamData} />;
}
