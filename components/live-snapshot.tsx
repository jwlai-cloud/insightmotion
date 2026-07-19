"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { SnapshotStage, type StageController } from "./snapshot-stage";

type ScenarioId = "world-cup-2026-review" | "retail-q2-2026";
type Generation = { code: string; caption: string; insight: string; visualPlan: string; generatedAt: string; model: string };
type Option = { id: string; label: string };

const scenarios: Record<ScenarioId, { label: string; period: string; focus: Option[]; highlights: Record<string, Option[]>; prompts: string[] }> = {
  "world-cup-2026-review": {
    label: "World Cup 2026 Trading Review", period: "Post-tournament · 104 matches · simulated operations data",
    focus: [{ id: "regions", label: "Global regions" }, { id: "markets", label: "Betting markets" }, { id: "top_matches", label: "Top matches" }, { id: "timeline", label: "Tournament stages" }],
    highlights: {
      regions: [{ id: "europe", label: "Europe" }, { id: "americas", label: "Americas" }, { id: "apac", label: "APAC" }, { id: "mea", label: "Middle East & Africa" }],
      markets: [{ id: "match-result", label: "Match result" }, { id: "in-play", label: "Live in-play" }, { id: "accumulators", label: "Accumulators" }, { id: "player-props", label: "Player props" }],
      top_matches: [{ id: "final", label: "Final · Spain vs Argentina" }, { id: "semi-1", label: "Semi-final 1" }, { id: "semi-2", label: "Semi-final 2" }],
      timeline: [{ id: "group-stage", label: "Group stage" }, { id: "round-of-32", label: "Round of 32" }, { id: "round-of-16", label: "Round of 16" }, { id: "quarter-finals", label: "Quarter-finals" }, { id: "semi-finals", label: "Semi-finals" }, { id: "final", label: "Final" }],
    },
    prompts: ["Which region drove post-tournament growth?", "What match created the biggest volume spike?", "Which market accelerated most during knockouts?"],
  },
  "retail-q2-2026": {
    label: "Retail performance · Q2 2026", period: "Q2 2026 · simulated sales data",
    focus: [{ id: "regions", label: "Regional performance" }],
    highlights: { regions: [{ id: "west", label: "West" }, { id: "east", label: "East" }, { id: "central", label: "Central" }] },
    prompts: ["Which region needs attention, and why?", "Who outperformed target?", "What should the sales lead investigate next?"],
  },
};

function extractCode(raw: string) { const text = (raw || "").trim(); const fence = text.match(/```(?:js|javascript)?\s*\r?\n?([\s\S]*?)```/i); return fence ? fence[1].trim() : text.replace(/^`+/, "").replace(/`+$/, "").trim(); }

export function LiveSnapshot() {
  const stageRef = useRef<StageController | null>(null);
  const [accessCode, setAccessCode] = useState(""); const [hasAccess, setHasAccess] = useState(false); const [accessError, setAccessError] = useState("");
  const [scenario, setScenario] = useState<ScenarioId>("world-cup-2026-review"); const [focus, setFocus] = useState("regions"); const [highlight, setHighlight] = useState("europe");
  const [question, setQuestion] = useState(scenarios["world-cup-2026-review"].prompts[0]); const [status, setStatus] = useState("Enter demo access to generate a live snapshot.");
  const [error, setError] = useState(""); const [generation, setGeneration] = useState<Generation | null>(null); const [isGenerating, setIsGenerating] = useState(false);
  const config = scenarios[scenario]; const highlightOptions = useMemo(() => config.highlights[focus] || [], [config, focus]);

  function updateUrl(nextScenario: ScenarioId, nextFocus: string, nextHighlight: string, nextQuestion: string) { const url = new URL(window.location.href); url.searchParams.set("scenario", nextScenario); url.searchParams.set("focus", nextFocus); url.searchParams.set("highlight", nextHighlight); if (nextQuestion.trim()) url.searchParams.set("question", nextQuestion.trim()); else url.searchParams.delete("question"); window.history.replaceState({}, "", url); }
  function chooseScenario(next: ScenarioId) { const nextConfig = scenarios[next]; const nextFocus = nextConfig.focus[0].id; const nextHighlight = nextConfig.highlights[nextFocus][0].id; setScenario(next); setFocus(nextFocus); setHighlight(nextHighlight); setQuestion(nextConfig.prompts[0]); setGeneration(null); }
  function chooseFocus(next: string) { const nextHighlight = config.highlights[next][0].id; setFocus(next); setHighlight(nextHighlight); setGeneration(null); }
  async function unlock(event: FormEvent) { event.preventDefault(); setAccessError(""); const response = await fetch("/api/access", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: accessCode }) }); if (!response.ok) { setAccessError("Access code not accepted."); return; } setHasAccess(true); setStatus("Ready. Ask a question, then generate live scene."); }
  async function generate(nextScenario = scenario, nextFocus = focus, nextHighlight = highlight, nextQuestion = question) {
    if (!hasAccess || isGenerating) return; updateUrl(nextScenario, nextFocus, nextHighlight, nextQuestion); setError(""); setIsGenerating(true); let priorCode = ""; let lastError = "";
    for (let attempt = 1; attempt <= 3; attempt += 1) { setStatus(attempt === 1 ? "GPT-5.6 Terra reading data and directing scene…" : `Repairing generated scene — attempt ${attempt} of 3…`); try {
      const response = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ scenario: nextScenario, selection: { focus: nextFocus, highlight: nextHighlight }, question: nextQuestion, repair: priorCode ? { priorCode, error: lastError } : undefined }) });
      const result = await response.json() as Generation & { error?: string }; if (!response.ok) throw new Error(result.error || "Generation failed."); priorCode = extractCode(result.code); stageRef.current?.run(priorCode); setGeneration({ ...result, code: priorCode }); setStatus("Live scene generated."); setIsGenerating(false); return;
    } catch (caught) { lastError = caught instanceof Error ? caught.message : String(caught); } }
    setError(`Could not render after 3 attempts. Last error: ${lastError}`); setStatus("Live generation needs another try."); setIsGenerating(false);
  }
  useEffect(() => { const params = new URLSearchParams(window.location.search); const rawScenario = params.get("scenario"); const rawFocus = params.get("focus"); const rawHighlight = params.get("highlight"); const rawQuestion = params.get("question"); if (rawScenario && rawScenario in scenarios) { const parsedScenario = rawScenario as ScenarioId; const parsedConfig = scenarios[parsedScenario]; const parsedFocus = parsedConfig.focus.some((item) => item.id === rawFocus) ? rawFocus! : parsedConfig.focus[0].id; const parsedHighlight = parsedConfig.highlights[parsedFocus].some((item) => item.id === rawHighlight) ? rawHighlight! : parsedConfig.highlights[parsedFocus][0].id; setScenario(parsedScenario); setFocus(parsedFocus); setHighlight(parsedHighlight); } if (rawQuestion) setQuestion(rawQuestion); }, []);
  useEffect(() => { if (hasAccess && new URLSearchParams(window.location.search).get("highlight")) generate(); /* shared URL reruns after access */ // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasAccess]);
  return <main className="shell"><header className="topbar"><div className="brand"><span className="brand-mark">✦</span><span>InsightMotion</span></div><div className="meta">{config.period} <i /> live decision brief</div></header>
    {!hasAccess ? <section className="access-card"><p className="eyebrow">Judge demo access</p><h1>Live data stories,<br />not stale screenshots.</h1><p>Enter shared demo code. GPT-5.6 Terra will generate a data insight and executable animated scene in this browser.</p><form onSubmit={unlock}><input aria-label="Demo access code" value={accessCode} onChange={(e) => setAccessCode(e.target.value)} placeholder="Demo access code" required /><button>Enter demo</button></form>{accessError && <small className="error">{accessError}</small>}</section> : <section className="workspace"><aside className="control-panel"><p className="eyebrow">AI-directed data story</p><h1>What should your team notice?</h1><p className="subtle">Ask. GPT finds insight, writes scene code, then directs attention in 3D.</p>
      <label>Scenario<select value={scenario} onChange={(e) => chooseScenario(e.target.value as ScenarioId)}>{Object.entries(scenarios).map(([id, item]) => <option key={id} value={id}>{item.label}</option>)}</select></label>
      <label>Analysis focus<select value={focus} onChange={(e) => chooseFocus(e.target.value)}>{config.focus.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
      <label>Suggested highlight<select value={highlight} onChange={(e) => { setHighlight(e.target.value); setGeneration(null); }}>{highlightOptions.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
      <label>Ask this data<textarea value={question} maxLength={280} onChange={(e) => setQuestion(e.target.value)} /></label><div className="chips">{config.prompts.map((prompt) => <button key={prompt} className="chip" onClick={() => setQuestion(prompt)}>{prompt}</button>)}</div><button className="generate" disabled={isGenerating} onClick={() => generate()}>{isGenerating ? "Generating live…" : "Generate live snapshot"}</button><div className="status"><span className={isGenerating ? "pulse-dot" : "dot"} />{status}</div>{error && <div className="error retry">{error}</div>}</aside>
      <section className="stage-wrap"><SnapshotStage controllerRef={stageRef} />{!generation && <div className="empty"><span>✦</span><p>Your AI-generated data scene will appear here.</p></div>}{generation && <div className="scene-badge">LIVE GENERATED · {generation.model}</div>}{generation && <div className="caption-card"><p className="eyebrow">Decision brief</p><h2>{generation.caption}</h2><div className="ai-decision"><strong>AI finding</strong><p>{generation.insight}</p><strong>Visual direction</strong><p>{generation.visualPlan}</p></div><small>Generated live · {new Date(generation.generatedAt).toLocaleTimeString()}</small></div>}</section></section>}{generation && <details className="code-details"><summary>View live-generated scene code</summary><pre>{generation.code}</pre></details>}</main>;
}
