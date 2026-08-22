export const runtime = 'edge';

import { getSession } from "@/lib/auth";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// --- Validation constants ---
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
]);

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "video/mp4": ".mp4",
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

/**
 * Generates a safe, random filename with a validated extension.
 * Never trusts the original filename from the client.
 */
function generateSafeFilename(mimeType: string): string {
  const ext = MIME_TO_EXT[mimeType] || ".bin";
  const randomBytes = crypto.getRandomValues(new Uint8Array(16));
  const id = Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0')).join('');
  return `${Date.now()}-${id}${ext}`;
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // --- MIME type validation ---
    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: `File type "${file.type}" is not allowed. Accepted: ${[...ALLOWED_MIME_TYPES].join(", ")}` },
        { status: 400 }
      );
    }

    // --- File size validation ---
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum is ${MAX_FILE_SIZE / 1024 / 1024}MB.` },
        { status: 400 }
      );
    }

    const env = getRequestContext().env;
    
    // Use R2_ACCOUNT_ID from env — fail explicitly if not configured
    const accountId = env.R2_ACCOUNT_ID;
    if (!accountId) {
      console.error("CRITICAL: R2_ACCOUNT_ID env var is not set. File uploads are disabled.");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const s3 = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
      },
    });

    const buffer = await file.arrayBuffer();
    const filename = generateSafeFilename(file.type);

    await s3.send(new PutObjectCommand({
      Bucket: "verspektive-media",
      Key: filename,
      Body: new Uint8Array(buffer),
      ContentType: file.type,
    }));

    const publicUrl = `${env.R2_PUBLIC_URL}/${filename}`;

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
