import { buildSampleId, buildSampleTitle } from "@/features/import/utils/parse-text-input";
import type { SampleMetadata, SampleRecord } from "@/types/sample";

const TEXT_COLUMN_CANDIDATES = ["text", "content", "body", "message", "transcript"] as const;
const SOURCE_COLUMN_CANDIDATES = ["source"] as const;
const METADATA_COLUMN_CANDIDATES = ["platform", "date", "author", "url"] as const;

export type CsvImportErrorKey = "empty" | "noTextColumn" | "invalidCsv";

export type CsvImportResult =
  | {
      success: true;
      samples: SampleRecord[];
      textColumn: string;
      skippedRowCount: number;
    }
  | {
      success: false;
      errorKey: CsvImportErrorKey;
    };

function normalizeHeader(value: string) {
  return value.trim().toLowerCase();
}

function parseCsvRows(input: string) {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = "";
  let inQuotes = false;

  const text = input.replace(/^\uFEFF/, "");

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const nextChar = text[index + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        currentCell += '"';
        index += 1;
        continue;
      }

      if (char === '"') {
        inQuotes = false;
        continue;
      }

      currentCell += char;
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      continue;
    }

    if (char === ",") {
      currentRow.push(currentCell);
      currentCell = "";
      continue;
    }

    if (char === "\n") {
      currentRow.push(currentCell);
      rows.push(currentRow);
      currentRow = [];
      currentCell = "";
      continue;
    }

    if (char === "\r") {
      continue;
    }

    currentCell += char;
  }

  if (inQuotes) {
    return null;
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell);
    rows.push(currentRow);
  }

  return rows;
}

function findColumnIndex(headers: string[], candidates: readonly string[]) {
  return headers.findIndex((header) => candidates.includes(header as (typeof candidates)[number]));
}

function buildMetadata(row: string[], headers: string[]) {
  const metadata: SampleMetadata = {};

  for (const key of METADATA_COLUMN_CANDIDATES) {
    const columnIndex = headers.findIndex((header) => header === key);
    const value = columnIndex >= 0 ? row[columnIndex]?.trim() : "";

    if (value) {
      metadata[key] = value;
    }
  }

  return Object.keys(metadata).length ? metadata : undefined;
}

export function parseCsvImport(csvText: string, fileName: string): CsvImportResult {
  if (!csvText.trim()) {
    return {
      success: false,
      errorKey: "empty"
    };
  }

  const rows = parseCsvRows(csvText);

  if (!rows || rows.length < 2) {
    return {
      success: false,
      errorKey: "invalidCsv"
    };
  }

  const rawHeaders = rows[0].map((item) => item.trim());
  const normalizedHeaders = rawHeaders.map((item) => normalizeHeader(item));
  const textColumnIndex = findColumnIndex(normalizedHeaders, TEXT_COLUMN_CANDIDATES);

  if (textColumnIndex === -1) {
    return {
      success: false,
      errorKey: "noTextColumn"
    };
  }

  const sourceColumnIndex = findColumnIndex(normalizedHeaders, SOURCE_COLUMN_CANDIDATES);
  const seed = Date.now();
  const samples: SampleRecord[] = [];
  let skippedRowCount = 0;

  for (const [rowIndex, row] of rows.slice(1).entries()) {
    const text = row[textColumnIndex]?.trim() ?? "";

    if (!text) {
      skippedRowCount += 1;
      continue;
    }

    const sourceFromCsv = sourceColumnIndex >= 0 ? row[sourceColumnIndex]?.trim() : "";
    const metadata = buildMetadata(row, normalizedHeaders);

    samples.push({
      id: buildSampleId(seed, rowIndex),
      title: buildSampleTitle(text, rowIndex),
      text,
      source: sourceFromCsv || fileName,
      metadata
    });
  }

  if (!samples.length) {
    return {
      success: false,
      errorKey: "empty"
    };
  }

  return {
    success: true,
    samples,
    textColumn: rawHeaders[textColumnIndex] ?? TEXT_COLUMN_CANDIDATES[0],
    skippedRowCount
  };
}
