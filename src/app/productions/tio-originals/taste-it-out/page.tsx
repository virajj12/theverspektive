import TasteItOutClient from "./client-page";

export const metadata = {
  title: "Taste It Out | VerspeKtive Productions",
};

export default async function TasteItOutPage() {
  let heroTitle = "Taste It Out";
  let heroSubtitle = "Taste It Out — discovering the finest culinary experiences.";

  return <TasteItOutClient heroTitle={heroTitle} heroSubtitle={heroSubtitle} />;
}
