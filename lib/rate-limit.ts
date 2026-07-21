// In-memory fixed-window rate limiter for the live-generation endpoint.
// ponytail: per warm serverless instance, not global. Fine as a cost backstop
// for a demo; swap for Vercel KV / Upstash if you need a limit shared across
// instances or strict guarantees.

type Bucket = { count: number; resetAt: number };

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 12; // generations per IP per minute
const buckets = new Map<string, Bucket>();

export type RateLimitResult = { ok: boolean; remaining: number; retryAfterSeconds: number };

export function checkRateLimit(key: string, now: number = Date.now()): RateLimitResult {
  const bucket = buckets.get(key);
  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true, remaining: MAX_PER_WINDOW - 1, retryAfterSeconds: 0 };
  }
  if (bucket.count >= MAX_PER_WINDOW) {
    return { ok: false, remaining: 0, retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  bucket.count += 1;
  return { ok: true, remaining: MAX_PER_WINDOW - bucket.count, retryAfterSeconds: 0 };
}

// Test seam: reset state between unit tests.
export function __resetRateLimit() {
  buckets.clear();
}
