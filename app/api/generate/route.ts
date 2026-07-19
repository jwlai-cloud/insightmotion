import OpenAI from "openai";
import { NextResponse } from "next/server";
import { hasDemoAccess } from "@/lib/demo-session";
import { dataFor, isHighlightForScenario, isScenarioId } from "@/lib/retail-data";

export const runtime = "nodejs";

type GenerateRequest = {
  scenario?: unknown;
  selection?: { focus?: unknown; highlight?: unknown };
  question?: unknown;
  repair?: { priorCode?: unknown; error?: unknown };
};

function extractCode(raw: string) {
  const text = raw.trim();
  const fence = text.match(/```(?:js|javascript)?\s*\r?\n?([\s\S]*?)```/i);
  return fence ? fence[1].trim() : text.replace(/^`+/, "").replace(/`+$/, "").trim();
}

function systemPrompt() {
  return `You are InsightMotion's internal analytics visualization director. Analyze supplied SIMULATED aggregated business data and answer a user's question.

Return strict JSON with exactly: code, caption, insight, visualPlan.
- caption: one plain-language sentence, max 150 characters.
- insight: one or two factual sentences, max 220 characters. Do not reveal private reasoning.
- visualPlan: short public description of focus and movement, max 150 characters.
- code: raw JavaScript only, no markdown fence.

The browser already gives code these variables: scene (THREE.Scene), camera (THREE.PerspectiveCamera), THREE (three.js namespace), anime (anime.js v3 namespace). Ambient and directional lights already exist. Do not create renderer, scene, camera, lights, DOM nodes, fetches, imports, textures, or external resources.

Build polished compact scene from primitive geometry only. Choose only from data in the input: regional pillars, market-mix towers, a tournament-stage timeline, or a compact globe-like regional comparison. Keep scene within 6x6x6 centered around origin, modest mesh count, markers/rings/labels when useful. Make focus unmistakable with color, dimmed context, camera move, pulse, or subtle orbit. Define window.__sceneUpdate = function(elapsedSeconds) only if useful. Code must execute as a single snippet and be compact. Respect every numeric value supplied; never invent data. For sportsbook data, provide internal operations analysis only: never offer betting advice, predictions, odds, or claims about individual people.`;
}

export async function POST(request: Request) {
  if (!(await hasDemoAccess())) return NextResponse.json({ error: "Demo access required." }, { status: 401 });
  if (!process.env.OPENAI_API_KEY) return NextResponse.json({ error: "OPENAI_API_KEY is not configured." }, { status: 500 });

  const body = await request.json().catch(() => null) as GenerateRequest | null;
  const requestedScenario = body?.scenario;
  const highlight = body?.selection?.highlight;
  const question = typeof body?.question === "string" ? body.question.trim().slice(0, 280) : "";
  const repair = body?.repair;
  if (!isScenarioId(requestedScenario) || !isHighlightForScenario(requestedScenario, body?.selection?.focus, highlight)) {
    return NextResponse.json({ error: "Unknown scenario or highlight region." }, { status: 400 });
  }

  const repairText = repair && typeof repair.priorCode === "string" && typeof repair.error === "string"
    ? `\n\nPrevious code threw a runtime error. Return a corrected full JSON response. Previous code:\n${repair.priorCode}\n\nError:\n${repair.error}`
    : "";
  const userPrompt = `Scenario: ${requestedScenario}\nData:\n${JSON.stringify(dataFor(requestedScenario))}\n\nSelected focus: ${String(body?.selection?.focus || "comparison")}\nSuggested highlight: ${highlight}\nUser question: ${question || "Which segment needs attention, and why?"}${repairText}`;

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await client.chat.completions.create({
      model: "gpt-5.6-terra",
      messages: [{ role: "system", content: systemPrompt() }, { role: "user", content: userPrompt }],
      response_format: { type: "json_object" },
      max_completion_tokens: 2200,
    });
    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error("Model returned no content.");
    const parsed = JSON.parse(content) as Record<string, unknown>;
    if (typeof parsed.code !== "string" || typeof parsed.caption !== "string" || typeof parsed.insight !== "string" || typeof parsed.visualPlan !== "string") {
      throw new Error("Model returned incomplete structured data.");
    }
    return NextResponse.json({
      code: extractCode(parsed.code),
      caption: parsed.caption.trim(),
      insight: parsed.insight.trim(),
      visualPlan: parsed.visualPlan.trim(),
      generatedAt: new Date().toISOString(),
      model: "gpt-5.6-terra",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Generation failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
