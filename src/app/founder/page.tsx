import FounderClientPage from "./client-page";
import founderData from "../../../content/founder.json";

export default function FounderPage() {
  return <FounderClientPage 
    name={founderData.name}
    role={founderData.role}
    ventures={founderData.ventures}
    pillars={founderData.pillars}
    stats={founderData.stats}
  />;
}
