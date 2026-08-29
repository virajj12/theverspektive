export const runtime = 'edge';

/**
 * G3 media helpers — spec section 5a.
 *
 * The existing /api/upload route streams the whole file through the Worker,
 * which caps it at 10MB and burns Worker CPU on every byte. The spec calls
 * that out explicitly: "signed/direct upload to Cloudflare R2 (avoid routing
 * large video files through the Worker itself)".
 *
 * So G3 presigns a PUT instead. The Worker only ever sees a small JSON
 * request; the bytes go browser → R2 directly. That is what makes the video
 * ceiling (200MB below) practical at all.
 *
 * Keys are namespaced under g3/ inside the shared verspektive-media bucket,
 * so G3 assets are trivially distinguishable and separately purgeable without
 * provisioning a second bucket.
 */

import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const R2_BUCKET = "verspektive-media";
export const G3_PREFIX = "g3/";

export const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

export const VIDEO_TYPES = new Set([
  "video/mp4",
  "video/webm",
]);

/** Spec 5a: "enforce a reasonable file-size ceiling with a clear error message". */
export const MAX_IMAGE_BYTES = 15 * 1024 * 1024;   // 15MB
export const MAX_VIDEO_BYTES = 200 * 1024 * 1024;  // 200MB — viable only because
                                                   // the upload bypasses the Worker

const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "video/mp4": "mp4",
  "video/webm": "webm",
};

export type MediaKind = "image" | "video";

export function kindOf(mimeType: string): MediaKind | null {
  if (IMAGE_TYPES.has(mimeType)) return "image";
  if (VIDEO_TYPES.has(mimeType)) return "video";
  return null;
}

/**
 * Validates a requested upload. Returns an error string, or null if allowed.
 * Messages are written to be shown directly to the admin.
 */
export function validateUpload(mimeType: string, sizeBytes: number): string | null {
  const kind = kindOf(mimeType);
  if (!kind) {
    const allowed = [...IMAGE_TYPES, ...VIDEO_TYPES].join(", ");
    return `"${mimeType}" isn't an accepted file type. Allowed: ${allowed}`;
  }
  if (!Number.isFinite(sizeBytes) || sizeBytes <= 0) {
    return "Could not read the file size.";
  }
  const max = kind === "video" ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
  if (sizeBytes > max) {
    const mb = (sizeBytes / 1024 / 1024).toFixed(1);
    return `That ${kind} is ${mb}MB — the limit is ${max / 1024 / 1024}MB.`;
  }
  return null;
}

/** Random, collision-resistant key. The client filename is never trusted. */
export function buildKey(mimeType: string, purpose = "asset"): string {
  const ext = EXT[mimeType] || "bin";
  const rand = Array.from(crypto.getRandomValues(new Uint8Array(12)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${G3_PREFIX}${purpose}/${Date.now()}-${rand}.${ext}`;
}

interface R2Env {
  R2_ACCOUNT_ID?: string;
  R2_ACCESS_KEY_ID?: string;
  R2_SECRET_ACCESS_KEY?: string;
  R2_PUBLIC_URL?: string;
}

export function r2Client(env: R2Env) {
  const accountId = env.R2_ACCOUNT_ID || process.env.R2_ACCOUNT_ID;
  const accessKeyId = env.R2_ACCESS_KEY_ID || process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = env.R2_SECRET_ACCESS_KEY || process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error("R2 is not configured (R2_ACCOUNT_ID / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY)");
  }

  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
}

export function publicUrlFor(env: R2Env, key: string): string {
  const base = (env.R2_PUBLIC_URL || process.env.R2_PUBLIC_URL || "").replace(/\/+$/, "");
  return `${base}/${key}`;
}

/** Presigned PUT the browser uploads to directly. Short TTL — it's used immediately. */
export async function presignPut(env: R2Env, key: string, contentType: string) {
  const client = r2Client(env);
  const url = await getSignedUrl(
    client,
    new PutObjectCommand({ Bucket: R2_BUCKET, Key: key, ContentType: contentType }),
    { expiresIn: 600 }
  );
  return url;
}

export async function deleteObject(env: R2Env, key: string) {
  const client = r2Client(env);
  await client.send(new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: key }));
}
