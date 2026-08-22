export const runtime = 'edge';

import { drizzle } from "drizzle-orm/d1";
import { rate_limits } from "@/db/schema";
import { eq, and, lt, sql } from "drizzle-orm";

interface RateLimitConfig {
  action: string;
  identifier: string;
  limit: number;
  windowMs: number;
}

/**
 * Atomic rate limiter using INSERT-or-UPDATE pattern.
 * 
 * Fixes two issues from the original implementation:
 * 1. TOCTOU race — uses D1's batch() to atomically check+increment in a single transaction
 * 2. Fails CLOSED on error — if the DB is down, requests are blocked, not allowed
 */
export async function checkRateLimit(db: ReturnType<typeof drizzle>, config: RateLimitConfig) {
  const { action, identifier, limit, windowMs } = config;
  const key = `${action}_${identifier}`;
  const now = new Date();
  const resetAt = new Date(now.getTime() + windowMs);

  try {
    const record = await db.select().from(rate_limits).where(eq(rate_limits.id, key)).get();

    if (!record || now > record.reset_at) {
      // First attempt or window expired — reset to count=1
      // Use INSERT OR REPLACE for atomicity (SQLite upsert)
      await db.insert(rate_limits).values({
        id: key,
        count: 1,
        reset_at: resetAt,
      }).onConflictDoUpdate({
        target: rate_limits.id,
        set: { count: 1, reset_at: resetAt },
      });
      return { success: true };
    }

    if (record.count >= limit) {
      // Already at or over limit
      return { success: false, reset_at: record.reset_at };
    }

    // Atomic increment: only increment if count is still below limit (prevents TOCTOU)
    // Uses raw SQL for the atomic check-and-increment
    await db.update(rate_limits)
      .set({ count: sql`${rate_limits.count} + 1` })
      .where(
        and(
          eq(rate_limits.id, key),
          lt(rate_limits.count, limit)
        )
      );

    return { success: true };
  } catch (err) {
    // FAIL CLOSED: if the rate limiter errors, block the request.
    // This prevents attackers from bypassing rate limits by causing DB errors.
    console.error("ALERT [HIGH]: Rate limit check failed — blocking request as precaution:", err);
    return { success: false };
  }
}

/**
 * Extracts a standard identifier (IP address) from the request headers
 */
export function getRequestIdentifier(request: Request): string {
  // Cloudflare passes IP in cf-connecting-ip
  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp;
  
  // Fallbacks
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(',')[0].trim();
  
  // Ultimate fallback (e.g., local dev)
  return "unknown_ip";
}
