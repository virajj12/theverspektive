export const runtime = 'edge';

import { getRequestContext } from "@cloudflare/next-on-pages";
import { getDb } from "@/db/client";
import { pages } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import G3BuildersClient from "./client-page";

export default async function G3Builders() {
  let teams: any[] = [];

  try {
    const env = getRequestContext().env;
    if (env && env.DB) {
      const db = getDb(env.DB);
      
      const teamConfig = await db.select().from(pages).where(
        and(eq(pages.slug, "g3-builders"), eq(pages.section_key, "teams"))
      );
      if (teamConfig.length > 0 && teamConfig[0].value) {
        try {
          teams = JSON.parse(teamConfig[0].value);
        } catch (e) {}
      }
    }
  } catch (error) {
    console.error("Failed to load teams from D1", error);
  }

  return <G3BuildersClient teams={teams} />;
}
