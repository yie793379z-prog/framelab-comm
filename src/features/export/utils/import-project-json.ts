import { analysisTemplates } from "@/features/templates/data/templates";
import type { CodingFieldValue, CodingRow } from "@/types/coding";
import type { SampleRecord } from "@/types/sample";
import type { WorkspaceState } from "@/types/workspace";

export type LoadProjectErrorKey =
  | "empty"
  | "invalidJson"
  | "invalidRoot"
  | "invalidSamples"
  | "invalidTemplate"
  | "invalidCodingResults"
  | "inconsistentCodingResults"
  | "wrongFormat";

type LoadProjectResult =
  | {
      success: true;
      data: Pick<WorkspaceState, "samples" | "selectedTemplateId" | "selectedSampleId" | "codingRows">;
    }
  | {
      success: false;
      errorKey: LoadProjectErrorKey;
    };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isValidCodingValue(value: unknown): value is CodingFieldValue {
  if (value === null) {
    return true;
  }

  if (typeof value === "string" || typeof value === "boolean") {
    return true;
  }

  if (typeof value === "number") {
    return Number.isFinite(value);
  }

  if (Array.isArray(value)) {
    return value.every((item) => typeof item === "string");
  }

  return false;
}

function sanitizeSamples(input: unknown): SampleRecord[] | null {
  if (!Array.isArray(input)) {
    return null;
  }

  const samples: SampleRecord[] = [];
  const seenIds = new Set<string>();

  for (const item of input) {
    if (!isRecord(item)) {
      return null;
    }

    const id = item.id;
    const title = item.title;
    const text = item.text;
    const source = item.source;

    if (typeof id !== "string" || typeof title !== "string" || typeof text !== "string") {
      return null;
    }

    if (!id.trim() || seenIds.has(id)) {
      return null;
    }

    if (source !== undefined && typeof source !== "string") {
      return null;
    }

    seenIds.add(id);
    samples.push({
      id,
      title,
      text,
      source
    });
  }

  return samples;
}

function sanitizeCodingRows(input: unknown): CodingRow[] | null {
  if (!Array.isArray(input)) {
    return null;
  }

  const rows: CodingRow[] = [];

  for (const item of input) {
    if (!isRecord(item) || !isRecord(item.values)) {
      return null;
    }

    const sampleId = item.sampleId;
    const templateId = item.templateId;

    if (typeof sampleId !== "string" || typeof templateId !== "string") {
      return null;
    }

    const values: Record<string, CodingFieldValue> = {};

    for (const [fieldId, value] of Object.entries(item.values)) {
      if (!isValidCodingValue(value)) {
        return null;
      }

      values[fieldId] = value;
    }

    rows.push({
      sampleId,
      templateId,
      values
    });
  }

  return rows;
}

export function importProjectJson(rawInput: string): LoadProjectResult {
  if (!rawInput.trim()) {
    return {
      success: false,
      errorKey: "empty"
    };
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(rawInput);
  } catch {
    return {
      success: false,
      errorKey: "invalidJson"
    };
  }

  if (!isRecord(parsed)) {
    return {
      success: false,
      errorKey: "invalidRoot"
    };
  }

  const samples = sanitizeSamples(parsed.samples);

  if (!samples) {
    return {
      success: false,
      errorKey: "invalidSamples"
    };
  }

  const codingRows = sanitizeCodingRows(parsed.codingResults);

  if (!codingRows) {
    return {
      success: false,
      errorKey: "invalidCodingResults"
    };
  }

  if (!isRecord(parsed.exportMetadata)) {
    return {
      success: false,
      errorKey: "wrongFormat"
    };
  }

  const selectedTemplateId = parsed.exportMetadata.selectedTemplateId;
  const format = parsed.exportMetadata.format;

  if (format !== "json") {
    return {
      success: false,
      errorKey: "wrongFormat"
    };
  }

  if (selectedTemplateId !== null && typeof selectedTemplateId !== "string") {
    return {
      success: false,
      errorKey: "invalidTemplate"
    };
  }

  const validTemplateIds = new Set(analysisTemplates.map((template) => template.id));

  if (selectedTemplateId && !validTemplateIds.has(selectedTemplateId)) {
    return {
      success: false,
      errorKey: "invalidTemplate"
    };
  }

  const validSampleIds = new Set(samples.map((sample) => sample.id));

  for (const row of codingRows) {
    if (!validSampleIds.has(row.sampleId) || !validTemplateIds.has(row.templateId)) {
      return {
        success: false,
        errorKey: "inconsistentCodingResults"
      };
    }
  }

  return {
    success: true,
    data: {
      samples,
      selectedTemplateId,
      selectedSampleId: samples[0]?.id ?? null,
      codingRows
    }
  };
}
