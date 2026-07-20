"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { SnapshotStage, type StageController } from "./snapshot-stage";

type ScenarioId = "world-cup-2026-review" | "retail-q2-2026";
type Generation = { code: string; caption: string; insight: string; visualPlan: string; generatedAt: string; model: string };
type Option = { id: string; label: string };
type UploadedCsv = { name: string; columns: string[]; rows: Record<string, string>[] };

function parseCsv(text: string) {
  const table: string[][] = []; let row: string[] = []; let cell = ""; let quoted = false;
  for (let index = 0; index < text.length; index += 1) { const character = text[index];
    if (character === '"') { if (quoted && text[index + 1] === '"') { cell += '"'; index += 1; } else quoted = !quoted; }
    else if (character === "," && !quoted) { row.push(cell); cell = ""; }
    else if (character === "\n" && !quoted) { row.push(cell); table.push(row); row = []; cell = ""; }
    else if (character !== "\r") cell += character;
  }
  if (quoted) throw new Error("CSV contains an unclosed quoted value.");
  if (cell || row.length) { row.push(cell); table.push(row); }
  const populated = table.filter((entry) => entry.some((value) => value.trim()));
  if (populated.length < 2) throw new Error("CSV needs a header row and at least one data row.");
  if (populated.length > 201) throw new Error("CSV is limited to 200 data rows.");
  const columns = populated[0].map((value) => value.trim()).filter(Boolean);
  if (!columns.length || columns.length > 20 || new Set(columns).size !== columns.length) throw new Error("Use 1–20 unique column names.");
  return { columns, rows: populated.slice(1).map((entry) => Object.fromEntries(columns.map((column, index) => [column, (entry[index] || "").trim()]))) };
}

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
  const [error, setError] = useState(""); const [generation, setGeneration] = useState<Generation | null>(null); const [isGenerating, setIsGenerating] = useState(false); const [traceStep, setTraceStep] = useState(0); const [uploadedCsv, setUploadedCsv] = useState<UploadedCsv | null>(null); const [uploadError, setUploadError] = useState("");
  const config = scenarios[scenario]; const highlightOptions = useMemo(() => config.highlights[focus] || [], [config, focus]);

async function handleCsvUpload(event: ChangeEvent<HTMLInputElement>) {
  const file = event.target.files?.[0]; if (!file) return; setUploadError("");
  if (!file.name.toLowerCase().endsWith(".csv")) { setUploadError("Choose a .csv file."); return; }
  try { const parsed = parseCsv(await file.text()); setUploadedCsv({ name: file.name, ...parsed }); setGeneration(null); setStatus(`CSV ready: ${parsed.rows.length} rows. GPT will use it for the next scene.`); }
  catch (caught) { setUploadedCsv(null); setUploadError(caught instanceof Error ? caught.message : "Could not read CSV."); }
}
function clearCsvUpload() { setUploadedCsv(null); setUploadError(""); setGeneration(null); setStatus("Using the selected simulated scenario."); }

  function updateUrl(nextScenario: ScenarioId, nextFocus: string, nextHighlight: string, nextQuestion: string) { const url = new URL(window.location.href); url.searchParams.set("scenario", nextScenario); url.searchParams.set("focus", nextFocus); url.searchParams.set("highlight", nextHighlight); if (nextQuestion.trim()) url.searchParams.set("question", nextQuestion.trim()); else url.searchParams.delete("question"); window.history.replaceState({}, "", url); }
  function chooseScenario(next: ScenarioId) { const nextConfig = scenarios[next]; const nextFocus = nextConfig.focus[0].id; const nextHighlight = nextConfig.highlights[nextFocus][0].id; setScenario(next); setFocus(nextFocus); setHighlight(nextHighlight); setQuestion(nextConfig.prompts[0]); setGeneration(null); }
  function chooseFocus(next: string) { const nextHighlight = config.highlights[next][0].id; setFocus(next); setHighlight(nextHighlight); setGeneration(null); }
  async function unlock(event: FormEvent) { event.preventDefault(); setAccessError(""); const response = await fetch("/api/access", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: accessCode }) }); if (!response.ok) { setAccessError("Access code not accepted."); return; } setHasAccess(true); setStatus("Ready. Ask a question, then generate live scene."); }
  async function generate(nextScenario = scenario, nextFocus = focus, nextHighlight = highlight, nextQuestion = question) {
    if (!hasAccess || isGenerating) return; updateUrl(nextScenario, nextFocus, nextHighlight, nextQuestion); setError(""); setTraceStep(1); setIsGenerating(true); let priorCode = ""; let lastError = "";
    for (let attempt = 1; attempt <= 3; attempt += 1) { setStatus(attempt === 1 ? "GPT-5.6 Terra reading data and directing scene…" : `Repairing generated scene — attempt ${attempt} of 3…`); try {
      const response = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ scenario: nextScenario, selection: { focus: nextFocus, highlight: nextHighlight }, question: nextQuestion, uploadedData: uploadedCsv ? { fileName: uploadedCsv.name, columns: uploadedCsv.columns, rows: uploadedCsv.rows } : undefined, repair: priorCode ? { priorCode, error: lastError } : undefined }) });
      const result = await response.json() as Generation & { error?: string }; if (!response.ok) throw new Error(result.error || "Generation failed."); priorCode = extractCode(result.code); setTraceStep(2); await new Promise<void>((resolve) => requestAnimationFrame(() => resolve())); stageRef.current?.run(priorCode); setTraceStep(3); setGeneration({ ...result, code: priorCode }); setStatus("Live scene generated."); setIsGenerating(false); return;
    } catch (caught) { lastError = caught instanceof Error ? caught.message : String(caught); } }
    setError(`Could not render after 3 attempts. Last error: ${lastError}`); setStatus("Live generation needs another try."); setIsGenerating(false);
  }
  useEffect(() => { const params = new URLSearchParams(window.location.search); const rawScenario = params.get("scenario"); const rawFocus = params.get("focus"); const rawHighlight = params.get("highlight"); const rawQuestion = params.get("question"); if (rawScenario && rawScenario in scenarios) { const parsedScenario = rawScenario as ScenarioId; const parsedConfig = scenarios[parsedScenario]; const parsedFocus = parsedConfig.focus.some((item) => item.id === rawFocus) ? rawFocus! : parsedConfig.focus[0].id; const parsedHighlight = parsedConfig.highlights[parsedFocus].some((item) => item.id === rawHighlight) ? rawHighlight! : parsedConfig.highlights[parsedFocus][0].id; setScenario(parsedScenario); setFocus(parsedFocus); setHighlight(parsedHighlight); } if (rawQuestion) setQuestion(rawQuestion); }, []);
  useEffect(() => { fetch("/api/access").then((response) => response.json()).then((result: { ok?: boolean; bypass?: boolean }) => { if (result.ok) { setHasAccess(true); if (result.bypass) setStatus("Temporary demo access bypass active — GPT remains live."); } }).catch(() => undefined); }, []);
  useEffect(() => { if (hasAccess && new URLSearchParams(window.location.search).get("highlight")) generate(); /* shared URL reruns after access */ // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasAccess]);
  return <main className="shell"><header className="topbar"><div className="brand"><span className="brand-mark">✦</span><span>InsightMotion</span></div><div className="meta">{config.period} <i /> live decision brief</div></header>
    {!hasAccess ? <section className="access-card"><p className="eyebrow">Judge demo access</p><h1>Live data stories,<br />not stale screenshots.</h1><p>Enter shared demo code. GPT-5.6 Terra will generate a data insight and executable animated scene in this browser.</p><form onSubmit={unlock}><input aria-label="Demo access code" value={accessCode} onChange={(e) => setAccessCode(e.target.value)} placeholder="Demo access code" required /><button>Enter demo</button></form>{accessError && <small className="error">{accessError}</small>}</section> : <section className="workspace"><aside className="control-panel"><p className="eyebrow">AI-directed data story</p><h1>What should your team notice?</h1><p className="subtle">Ask. GPT finds insight, writes scene code, then directs attention in 3D.</p>
      <label>Scenario<select value={scenario} onChange={(e) => chooseScenario(e.target.value as ScenarioId)}>{Object.entries(scenarios).map(([id, item]) => <option key={id} value={id}>{item.label}</option>)}</select></label><label className="csv-upload">Optional data upload<input type="file" accept=".csv,text/csv" onChange={handleCsvUpload} /><span>CSV only · max 200 data rows · temporary, not stored</span></label>{uploadedCsv && <div className="upload-ready"><strong>Using {uploadedCsv.name}</strong><span>{uploadedCsv.rows.length} rows · {uploadedCsv.columns.length} columns</span><button onClick={clearCsvUpload}>Use demo data</button></div>}{uploadError && <div className="error retry">{uploadError}</div>}
      <label>Analysis focus<select value={focus} onChange={(e) => chooseFocus(e.target.value)}>{config.focus.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
      <label>Suggested highlight<select value={highlight} onChange={(e) => { setHighlight(e.target.value); setGeneration(null); }}>{highlightOptions.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
      <label>Ask this data<textarea value={question} maxLength={280} onChange={(e) => setQuestion(e.target.value)} /></label><div className="chips">{config.prompts.map((prompt) => <button key={prompt} className="chip" onClick={() => setQuestion(prompt)}>{prompt}</button>)}</div><button className="generate" disabled={isGenerating} onClick={() => generate()}>{isGenerating ? "Generating live…" : "Generate live snapshot"}</button><div className="status" aria-live="polite"><span className={isGenerating ? "pulse-dot" : "dot"} />{status}</div>{error && <div className="error retry">{error}</div>}</aside>
      <section className="stage-wrap"><SnapshotStage controllerRef={stageRef} />{!generation && <div className="empty"><span>✦</span><p>Your AI-generated data scene will appear here.</p></div>}{generation && <div className="scene-badge">LIVE GENERATED · {generation.model}</div>}{generation && <div className="scene-help">Drag to orbit · scroll to zoom · right-drag to pan</div>}{(isGenerating || generation) && <div className="generation-trace" aria-label="Generation pipeline"><span className={traceStep >= 1 ? "trace-active" : ""}>1 Analyze data</span><span className={traceStep >= 2 ? "trace-active" : ""}>2 Generate code</span><span className={traceStep >= 3 ? "trace-active" : ""}>3 Run scene</span></div>}{generation && <div className="caption-card"><p className="eyebrow">Decision brief</p><h2>{generation.caption}</h2><div className="ai-decision"><strong>AI finding</strong><p>{generation.insight}</p><strong>Visual direction</strong><p>{generation.visualPlan}</p></div><small>Generated live · {new Date(generation.generatedAt).toLocaleTimeString()}</small></div>}</section></section>}{generation && <details className="code-details"><summary>View GPT-generated scene code → browser runtime</summary><pre>{generation.code}</pre></details>}</main>;
}
