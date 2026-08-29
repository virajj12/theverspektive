"use client";

/**
 * Direct-to-R2 upload (spec 5a).
 *
 * Three steps, deliberately:
 *   1. ask the Worker to presign a PUT
 *   2. PUT the bytes browser → R2 (the Worker never sees them)
 *   3. tell the Worker to record the asset
 *
 * Step 2 uses XMLHttpRequest rather than fetch purely because fetch still has
 * no upload-progress event — and a 200MB video upload with no progress bar is
 * indistinguishable from a hang.
 *
 * Dimensions, duration and the video poster frame are all derived here on the
 * client. Doing it server-side would mean streaming the file through the
 * Worker again, which is the exact thing this flow exists to avoid.
 */

import { useCallback, useState } from "react";

export interface UploadedMedia {
  id: number;
  type: string;
  url: string;
  alt_text: string;
  thumbnail_url: string | null;
  width: number | null;
  height: number | null;
}

interface Probe {
  width?: number;
  height?: number;
  durationSeconds?: number;
  posterBlob?: Blob;
}

/** Read intrinsic dimensions from an image file. */
function probeImage(file: File): Promise<Probe> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => { resolve({}); URL.revokeObjectURL(url); };
    img.src = url;
  });
}

/**
 * Read dimensions + duration from a video, and grab a frame for the poster.
 * The poster matters for mobile weight (spec 6): it lets <video preload="none">
 * still show something immediately.
 */
function probeVideo(file: File): Promise<Probe> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;

    const bail = () => { resolve({}); URL.revokeObjectURL(url); };
    video.onerror = bail;

    video.onloadedmetadata = () => {
      const base: Probe = {
        width: video.videoWidth,
        height: video.videoHeight,
        durationSeconds: Math.round(video.duration) || undefined,
      };
      // Seek a little in — frame 0 of most footage is a black fade-in.
      const target = Math.min(1, (video.duration || 2) / 4);
      video.onseeked = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext("2d");
          if (!ctx) return resolve(base);
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(
            (blob) => {
              resolve({ ...base, posterBlob: blob || undefined });
              URL.revokeObjectURL(url);
            },
            "image/webp",
            0.8
          );
        } catch {
          resolve(base);
          URL.revokeObjectURL(url);
        }
      };
      try { video.currentTime = target; } catch { resolve(base); }
    };

    video.src = url;
  });
}

async function presign(contentType: string, sizeBytes: number, purpose: "asset" | "poster") {
  const res = await fetch("/api/g3/media/upload-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contentType, sizeBytes, purpose }),
  });
  const data = (await res.json()) as { uploadUrl?: string; key?: string; publicUrl?: string; error?: string };
  if (!res.ok || !data.uploadUrl) throw new Error(data.error || "Could not prepare the upload");
  return data as { uploadUrl: string; key: string; publicUrl: string };
}

function putToR2(url: string, body: Blob, contentType: string, onProgress?: (pct: number) => void) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", contentType);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => (xhr.status >= 200 && xhr.status < 300
      ? resolve()
      : reject(new Error(`Upload failed (HTTP ${xhr.status})`)));
    xhr.onerror = () => reject(new Error("Upload failed — check your connection"));
    xhr.send(body);
  });
}

export function useG3Upload() {
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);

  const upload = useCallback(async (file: File, altText: string): Promise<UploadedMedia> => {
    setBusy(true);
    setProgress(0);
    try {
      const isVideo = file.type.startsWith("video/");
      const probe = isVideo ? await probeVideo(file) : await probeImage(file);

      const main = await presign(file.type, file.size, "asset");
      await putToR2(main.uploadUrl, file, file.type, setProgress);

      // Poster is a nice-to-have; a failure here must not lose the video.
      let thumbnailR2Key: string | undefined;
      let thumbnailUrl: string | undefined;
      if (probe.posterBlob) {
        try {
          const poster = await presign("image/webp", probe.posterBlob.size, "poster");
          await putToR2(poster.uploadUrl, probe.posterBlob, "image/webp");
          thumbnailR2Key = poster.key;
          thumbnailUrl = poster.publicUrl;
        } catch (e) {
          console.warn("Poster frame upload failed; continuing without one.", e);
        }
      }

      const res = await fetch("/api/g3/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          r2Key: main.key,
          url: main.publicUrl,
          mimeType: file.type,
          sizeBytes: file.size,
          altText,
          width: probe.width,
          height: probe.height,
          durationSeconds: probe.durationSeconds,
          thumbnailR2Key,
          thumbnailUrl,
        }),
      });
      const data = (await res.json()) as { media?: UploadedMedia; error?: string };
      if (!res.ok || !data.media) throw new Error(data.error || "Could not save the asset");
      return data.media;
    } finally {
      setBusy(false);
      setProgress(0);
    }
  }, []);

  return { upload, progress, busy };
}
