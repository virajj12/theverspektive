export const runtime = 'edge';

/**
 * Step 1 of the direct-to-R2 upload (spec 5a).
 *
 * Returns a short-lived presigned PUT. The browser uploads the bytes straight
 * to R2, then calls POST /api/g3/media to record the asset. Splitting it this
 * way is what keeps large video off the Worker.
 */

import { getSession } from "@/lib/auth";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { NextResponse } from "next/server";
import { z } from "zod";
import { validateUpload, buildKey, presignPut, publicUrlFor, kindOf } from "@/lib/g3-media";

const schema = z.object({
  contentType: z.string().min(1).max(120),
  sizeBytes: z.number().int().positive(),
  purpose: z.enum(["asset", "poster"]).optional(),
});

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { contentType, sizeBytes, purpose } = parsed.data;

    const invalid = validateUpload(contentType, sizeBytes);
    if (invalid) {
      return NextResponse.json({ error: invalid }, { status: 400 });
    }

    const env = getRequestContext().env;
    const key = buildKey(contentType, purpose || "asset");
    const uploadUrl = await presignPut(env, key, contentType);

    return NextResponse.json({
      success: true,
      uploadUrl,
      key,
      publicUrl: publicUrlFor(env, key),
      kind: kindOf(contentType),
    });
  } catch (error) {
    console.error("G3 presign error:", error);
    const message = error instanceof Error && error.message.startsWith("R2 is not configured")
      ? error.message
      : "Could not prepare the upload.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
