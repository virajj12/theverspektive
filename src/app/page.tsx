export const runtime = 'edge';

import { getRequestContext } from "@cloudflare/next-on-pages";
import { getDb } from "@/db/client";
import { pages } from "@/db/schema";
import { eq } from "drizzle-orm";
import ClientHome from "./client-page";

export default async function Home() {
  let heroHeadline = "VerspeKtive";
  let heroTagline = "Premium storytelling, from studio to screen.";
  // let heroImage = "https://plus.unsplash.com/premium_photo-1675504337234-90af7b730f2b?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  let heroImage = "https://images.unsplash.com/photo-1517241034903-9a4c3ab12f00?q=80&w=1920&auto=format&fit=crop";

  try {
    const env = getRequestContext().env;
    if (env && env.DB) {
      const db = getDb(env.DB);
      const content = await db.select().from(pages).where(eq(pages.slug, "home"));

      content.forEach((item) => {
        if (item.section_key === "heroHeadline") heroHeadline = item.value;
        if (item.section_key === "heroTagline") heroTagline = item.value;
        if (item.section_key === "heroImage") heroImage = item.value;
      });
    }
  } catch (error) {
    console.error("Failed to load D1 content, falling back to defaults", error);
  }

  return (
    <ClientHome
      heroHeadline={heroHeadline}
      heroTagline={heroTagline}
      heroImage={heroImage}
    />
  );
}
