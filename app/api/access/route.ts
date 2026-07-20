import { NextResponse } from "next/server";
import { createDemoToken, demoCookie, hasDemoAccess, isDemoAccessBypassEnabled } from "@/lib/demo-session";

export async function GET() {
  const bypass = isDemoAccessBypassEnabled();
  return NextResponse.json({ ok: bypass || await hasDemoAccess(), bypass });
}

export async function POST(request: Request) {
  if (isDemoAccessBypassEnabled()) return NextResponse.json({ ok: true, bypass: true });
  const body = await request.json().catch(() => null) as { code?: unknown } | null;
  const configuredCode = process.env.DEMO_ACCESS_CODE;
  if (!configuredCode || typeof body?.code !== "string" || body.code !== configuredCode) {
    return NextResponse.json({ error: "Incorrect demo access code." }, { status: 401 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(demoCookie.name, createDemoToken(), demoCookie.options);
  return response;
}
