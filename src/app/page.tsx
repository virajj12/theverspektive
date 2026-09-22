import ClientHome from "./client-page";
import homeData from "../../content/home.json";

export default function Home() {
  return (
    <ClientHome
      heroHeadline={homeData.heroHeadline}
      heroTagline={homeData.heroTagline}
      heroImage={homeData.heroImage}
    />
  );
}
