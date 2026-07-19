import { NextResponse } from "next/server";
import { createDemoToken, demoCookie } from "@/lib/demo-session";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { code?: unknown } | null;
  const configuredCode = process.env.DEMO_ACCESS_CODE;
  if (!configuredCode || typeof body?.code !== "string" || body.code !== configuredCode) {
    return NextResponse.json({ error: "Incorrect demo access code." }, { status: 401 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(demoCookie.name, createDemoToken(), demoCookie.options);
  return response;
}
