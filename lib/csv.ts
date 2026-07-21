// Validation for optional, temporary CSV uploads. Extracted from the generate
// route so it can be unit-tested in isolation (no Next/OpenAI imports here).
// Bounds mirror the client parser: 1–20 unique columns, 1–200 rows, string
// cells only, capped lengths. Data is untrusted user input.

export type UploadedData = { fileName: string; columns: string[]; rows: Record<string, string>[] };

export function parseUploadedData(value: unknown): UploadedData | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as { fileName?: unknown; columns?: unknown; rows?: unknown };
  if (
    typeof candidate.fileName !== "string" ||
    candidate.fileName.length > 120 ||
    !Array.isArray(candidate.columns) ||
    !Array.isArray(candidate.rows)
  ) {
    return null;
  }
  const columns = candidate.columns
    .filter((column): column is string => typeof column === "string" && column.trim().length > 0 && column.length <= 80)
    .map((column) => column.trim());
  if (
    !columns.length ||
    columns.length > 20 ||
    columns.length !== candidate.columns.length ||
    new Set(columns).size !== columns.length ||
    !candidate.rows.length ||
    candidate.rows.length > 200
  ) {
    return null;
  }
  const rows: Record<string, string>[] = [];
  for (const row of candidate.rows) {
    if (!row || typeof row !== "object" || Array.isArray(row)) return null;
    const normalized: Record<string, string> = {};
    for (const column of columns) {
      const cell = (row as Record<string, unknown>)[column];
      if (typeof cell !== "string" || cell.length > 280) return null;
      normalized[column] = cell;
    }
    rows.push(normalized);
  }
  return { fileName: candidate.fileName, columns, rows };
}
