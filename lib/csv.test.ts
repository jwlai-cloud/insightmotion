import { describe, it, expect } from "vitest";
import { parseUploadedData } from "@/lib/csv";
import { isScenarioId, isHighlightForScenario } from "@/lib/retail-data";
import { checkRateLimit, __resetRateLimit } from "@/lib/rate-limit";

const validCsv = {
  fileName: "sales.csv",
  columns: ["region", "revenue"],
  rows: [
    { region: "West", revenue: "100" },
    { region: "East", revenue: "80" },
  ],
};

describe("parseUploadedData", () => {
  it("accepts a well-formed payload", () => {
    const parsed = parseUploadedData(validCsv);
    expect(parsed).not.toBeNull();
    expect(parsed!.columns).toEqual(["region", "revenue"]);
    expect(parsed!.rows).toHaveLength(2);
  });

  it("rejects non-objects and missing fields", () => {
    expect(parseUploadedData(null)).toBeNull();
    expect(parseUploadedData("nope")).toBeNull();
    expect(parseUploadedData({ columns: ["a"], rows: [{ a: "1" }] })).toBeNull(); // no fileName
  });

  it("rejects duplicate columns", () => {
    expect(parseUploadedData({ ...validCsv, columns: ["region", "region"] })).toBeNull();
  });

  it("enforces the 20-column and 200-row caps", () => {
    const cols = Array.from({ length: 21 }, (_, i) => `c${i}`);
    expect(parseUploadedData({ fileName: "x.csv", columns: cols, rows: [Object.fromEntries(cols.map((c) => [c, "v"]))] })).toBeNull();
    const rows = Array.from({ length: 201 }, () => ({ region: "W", revenue: "1" }));
    expect(parseUploadedData({ ...validCsv, rows })).toBeNull();
  });

  it("rejects non-string or oversized cells", () => {
    expect(parseUploadedData({ ...validCsv, rows: [{ region: "W", revenue: 5 as unknown as string }] })).toBeNull();
    expect(parseUploadedData({ ...validCsv, rows: [{ region: "W", revenue: "x".repeat(281) }] })).toBeNull();
  });
});

describe("scenario guards", () => {
  it("validates known scenarios", () => {
    expect(isScenarioId("global-football-2026-review")).toBe(true);
    expect(isScenarioId("retail-q2-2026")).toBe(true);
    expect(isScenarioId("world-cup-2026-review")).toBe(false);
    expect(isScenarioId(42)).toBe(false);
  });

  it("validates highlight belongs to scenario+focus", () => {
    expect(isHighlightForScenario("global-football-2026-review", "regions", "europe")).toBe(true);
    expect(isHighlightForScenario("global-football-2026-review", "regions", "not-a-region")).toBe(false);
    expect(isHighlightForScenario("global-football-2026-review", 1, "europe")).toBe(false);
  });
});

describe("checkRateLimit", () => {
  it("allows up to the cap then blocks within the window", () => {
    __resetRateLimit();
    const t = 1_000_000;
    let last = { ok: true, remaining: 0, retryAfterSeconds: 0 };
    for (let i = 0; i < 12; i++) last = checkRateLimit("ip-a", t);
    expect(last.ok).toBe(true);
    const blocked = checkRateLimit("ip-a", t);
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("resets after the window and isolates keys", () => {
    __resetRateLimit();
    for (let i = 0; i < 12; i++) checkRateLimit("ip-b", 0);
    expect(checkRateLimit("ip-b", 0).ok).toBe(false);
    expect(checkRateLimit("ip-b", 60_001).ok).toBe(true); // new window
    expect(checkRateLimit("ip-c", 0).ok).toBe(true); // separate key
  });
});
