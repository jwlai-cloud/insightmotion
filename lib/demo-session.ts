import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "live_snapshot_demo";
const MAX_AGE_SECONDS = 60 * 60 * 8;

function secret() {
  return process.env.DEMO_SESSION_SECRET;
}

function sign(payload: string) {
  const value = secret();
  if (!value) throw new Error("DEMO_SESSION_SECRET is not configured.");
  return createHmac("sha256", value).update(payload).digest("base64url");
}

export function createDemoToken() {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + MAX_AGE_SECONDS * 1000 })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function isValidDemoToken(token?: string) {
  if (!token || !secret()) return false;
  const [payload, providedSignature] = token.split(".");
  if (!payload || !providedSignature) return false;
  const expectedSignature = sign(payload);
  const expected = Buffer.from(expectedSignature);
  const actual = Buffer.from(providedSignature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return false;
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { exp?: number };
    return typeof parsed.exp === "number" && parsed.exp > Date.now();
  } catch {
    return false;
  }
}

export async function hasDemoAccess() {
  const store = await cookies();
  return isValidDemoToken(store.get(COOKIE_NAME)?.value);
}

export function isPreviewDemoBypassEnabled() {
  return process.env.VERCEL_ENV === "preview" && process.env.BEFORE_YOU_BELIEVE_DEMO_BYPASS === "true";
}

export function isDemoAccessBypassEnabled() {
  return process.env.DEMO_ACCESS_BYPASS === "true" || isPreviewDemoBypassEnabled();
}

export const demoCookie = {
  name: COOKIE_NAME,
  maxAge: MAX_AGE_SECONDS,
  options: {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  },
};
