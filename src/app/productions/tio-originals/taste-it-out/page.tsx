export const runtime = 'edge';

import { getRequestContext } from "@cloudflare/next-on-pages";
import { getDb } from "@/db/client";
import { pages } from "@/db/schema";
import { eq } from "drizzle-orm";
import TasteItOutClient from "./client-page";

export const metadata = {
  title: "Taste It Out | VerspeKtive Productions",
};

export default async function TasteItOutPage() {
  let heroTitle = "Taste It Out";
  let heroSubtitle = "Taste It Out — discovering the finest culinary experiences.";

  try {
    let env: any = null;
    try {
      env = getRequestContext().env;
    } catch (e) {
      // getRequestContext throws in Vercel, ignore
    }

    if (env && env.DB) {
      const db = getDb(env.DB);
      const contentConfig = await db.select().from(pages).where(eq(pages.slug, "taste-it-out"));

      contentConfig.forEach((item) => {
        if (item.section_key === "heroTitle" && item.value) heroTitle = item.value;
        if (item.section_key === "heroSubtitle" && item.value) heroSubtitle = item.value;
      });
    }
  } catch (error) {
    console.error("Failed to load Taste It Out data", error);
  }

  return <TasteItOutClient heroTitle={heroTitle} heroSubtitle={heroSubtitle} />;
}
