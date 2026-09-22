import TechClientPage from "./client-page";
import techData from "../../../content/tech.json";
import techTeamData from "../../../content/teams/tech.json";

export const metadata = {
  title: "Tech - VerspeKtive",
  description:
    "The team behind theverspektive.com builds websites, applications and booking systems for businesses and personal brands.",
};

export default function TechPage() {
  return <TechClientPage heroHeadline={techData.heroHeadline} heroCta={techData.heroCta} teams={techTeamData} />;
}
