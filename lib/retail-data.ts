import retailSales from "@/data/retail-sales.json";
import worldCupReview from "@/data/world-cup-2026-review.json";

export type ScenarioId = "retail-q2-2026" | "world-cup-2026-review";

export const scenarios = {
  "retail-q2-2026": retailSales,
  "world-cup-2026-review": worldCupReview,
} as const;

export const defaultScenario: ScenarioId = "world-cup-2026-review";

export function isScenarioId(value: unknown): value is ScenarioId {
  return typeof value === "string" && value in scenarios;
}

export function dataFor(scenario: ScenarioId) {
  return scenarios[scenario];
}

export function focusOptionsFor(scenario: ScenarioId) {
  if (scenario === "retail-q2-2026") return [{ id: "regions", label: "Regional performance" }];
  return [
    { id: "regions", label: "Global regions" },
    { id: "markets", label: "Betting markets" },
    { id: "top_matches", label: "Top matches" },
    { id: "timeline", label: "Tournament stages" },
  ];
}

export function highlightsFor(scenario: ScenarioId, focus: string) {
  if (focus === "regions") return scenarios[scenario].regions.map((item) => ({ id: item.id, label: item.label }));
  if (scenario === "world-cup-2026-review" && focus === "markets") return worldCupReview.markets.map((item) => ({ id: item.id, label: item.label }));
  if (scenario === "world-cup-2026-review" && focus === "top_matches") return worldCupReview.top_matches.map((item) => ({ id: item.id, label: `${item.label} · ${item.teams}` }));
  if (scenario === "world-cup-2026-review" && focus === "timeline") return worldCupReview.timeline.map((item) => ({ id: item.stage.toLowerCase().replaceAll(" ", "-"), label: item.stage }));
  return [];
}

export function isHighlightForScenario(scenario: ScenarioId, focus: unknown, value: unknown) {
  return typeof focus === "string" && typeof value === "string" && highlightsFor(scenario, focus).some((item) => item.id === value);
}
