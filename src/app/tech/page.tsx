export const runtime = 'edge';

import type { Metadata } from "next";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { getDb } from "@/db/client";
import { pages } from "@/db/schema";
import { eq } from "drizzle-orm";
import TechClientPage from "./client-page";

export const metadata: Metadata = {
  title: "Tech - VerspeKtive",
  description:
    "The team behind theverspektive.com builds websites, applications and booking systems for businesses and personal brands.",
};

export default async function TechPage() {
  // Spec 4.1: one outcome-focused headline, not a job title.
  let heroHeadline = "We build the tech behind premium brands.";
  let heroCta = "Tell us what you're building";

  // Editable from the existing admin CMS, same pattern as the home page —
  // falls back to the copy above if D1 is unreachable or the rows don't exist.
  try {
    const env = getRequestContext().env;
    if (env && env.DB) {
      const db = getDb(env.DB);
      const content = await db.select().from(pages).where(eq(pages.slug, "tech"));

      content.forEach((item) => {
        if (item.section_key === "heroHeadline") heroHeadline = item.value;
        if (item.section_key === "heroCta") heroCta = item.value;
      });
    }
  } catch (error) {
    console.error("Failed to load D1 content for /tech, using defaults", error);
  }

  return <TechClientPage heroHeadline={heroHeadline} heroCta={heroCta} />;
}
