import { analysisTemplates } from "@/features/templates/data/templates";
import { emptyProjectMetadata, hasProjectMetadataValue, sanitizeProjectMetadata } from "@/features/project/utils/project-metadata";
import { sanitizeProjectCodebooks } from "@/features/templates/utils/project-codebooks";
import type { CodingFieldValue, CodingRow } from "@/types/coding";
import type { SampleMetadata, SampleRecord } from "@/types/sample";
import type { PersistedWorkspaceState, WorkspaceState } from "@/types/workspace";

export const WORKSPACE_AUTOSAVE_STORAGE_KEY = "framelab-workspace-autosave-v1";

export type WorkspaceAutosaveSnapshot = {
  version: 1;
  savedAt: string;
  workspace: PersistedWorkspaceState;
};

type WorkspaceAutosaveResult =
  | {
      success: true;
      snapshot: WorkspaceAutosaveSnapshot;
    }
  | {
      success: false;
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

function sanitizeSampleMetadata(input: unknown): SampleMetadata | undefined | null {
  if (input === undefined) {
    return undefined;
  }

  if (!isRecord(input)) {
    return null;
  }

  const metadata: SampleMetadata = {};

  for (const key of ["platform", "date", "author", "url"] as const) {
    const value = input[key];

    if (value !== undefined) {
      if (typeof value !== "string") {
        return null;
      }

      if (value.trim()) {
        metadata[key] = value;
      }
    }
  }

  return Object.keys(metadata).length ? metadata : undefined;
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

    const { id, title, text, source } = item;
    const metadata = sanitizeSampleMetadata(item.metadata);

    if (typeof id !== "string" || typeof title !== "string" || typeof text !== "string") {
      return null;
    }

    if (!id.trim() || seenIds.has(id)) {
      return null;
    }

    if (source !== undefined && typeof source !== "string") {
      return null;
    }

    if (metadata === null) {
      return null;
    }

    seenIds.add(id);
    samples.push({
      id,
      title,
      text,
      source,
      metadata
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

    const { sampleId, templateId } = item;

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

export function hasMeaningfulWorkspaceData(
  state: Pick<
    WorkspaceState,
    | "importText"
    | "samples"
    | "selectedTemplateId"
    | "selectedSampleId"
    | "codingRows"
    | "projectMetadata"
    | "customProjectCodebooks"
  >
) {
  return (
    state.importText.trim().length > 0 ||
    state.samples.length > 0 ||
    state.codingRows.length > 0 ||
    state.selectedTemplateId !== null ||
    state.selectedSampleId !== null ||
    hasProjectMetadataValue(state.projectMetadata) ||
    Object.keys(state.customProjectCodebooks).length > 0
  );
}

export function createWorkspaceAutosaveSnapshot(state: WorkspaceState): WorkspaceAutosaveSnapshot {
  return {
    version: 1,
    savedAt: new Date().toISOString(),
    workspace: {
      importText: state.importText,
      samples: state.samples,
      selectedTemplateId: state.selectedTemplateId,
      selectedSampleId: state.selectedSampleId,
      codingRows: state.codingRows,
      projectMetadata: state.projectMetadata,
      customProjectCodebooks: state.customProjectCodebooks
    }
  };
}

export function parseWorkspaceAutosave(rawInput: string): WorkspaceAutosaveResult {
  let parsed: unknown;

  try {
    parsed = JSON.parse(rawInput);
  } catch {
    return { success: false };
  }

  if (!isRecord(parsed) || parsed.version !== 1 || !isRecord(parsed.workspace) || typeof parsed.savedAt !== "string") {
    return { success: false };
  }

  const savedAtDate = new Date(parsed.savedAt);

  if (Number.isNaN(savedAtDate.getTime())) {
    return { success: false };
  }

  const samples = sanitizeSamples(parsed.workspace.samples);
  const codingRows = sanitizeCodingRows(parsed.workspace.codingRows);

  if (!samples || !codingRows) {
    return { success: false };
  }

  const importText = typeof parsed.workspace.importText === "string" ? parsed.workspace.importText : "";
  const projectMetadata = sanitizeProjectMetadata(parsed.workspace.projectMetadata);
  const customProjectCodebooks = sanitizeProjectCodebooks(parsed.workspace.customProjectCodebooks);
  const validTemplateIds = new Set(analysisTemplates.map((template) => template.id));
  const validSampleIds = new Set(samples.map((sample) => sample.id));
  const rawSelectedTemplateId = parsed.workspace.selectedTemplateId;
  const rawSelectedSampleId = parsed.workspace.selectedSampleId;

  if (rawSelectedTemplateId !== null && rawSelectedTemplateId !== undefined && typeof rawSelectedTemplateId !== "string") {
    return { success: false };
  }

  if (rawSelectedSampleId !== null && rawSelectedSampleId !== undefined && typeof rawSelectedSampleId !== "string") {
    return { success: false };
  }

  if (!projectMetadata) {
    return { success: false };
  }

  for (const row of codingRows) {
    if (!validSampleIds.has(row.sampleId) || !validTemplateIds.has(row.templateId)) {
      return { success: false };
    }
  }

  const selectedTemplateId =
    typeof rawSelectedTemplateId === "string" && validTemplateIds.has(rawSelectedTemplateId)
      ? rawSelectedTemplateId
      : null;
  const selectedSampleId =
    typeof rawSelectedSampleId === "string" && validSampleIds.has(rawSelectedSampleId)
      ? rawSelectedSampleId
      : samples[0]?.id ?? null;

  const workspace: PersistedWorkspaceState = {
    importText,
    samples,
    selectedTemplateId,
    selectedSampleId,
    codingRows,
    projectMetadata: projectMetadata ?? emptyProjectMetadata,
    customProjectCodebooks
  };

  if (!hasMeaningfulWorkspaceData(workspace)) {
    return { success: false };
  }

  return {
    success: true,
    snapshot: {
      version: 1,
      savedAt: savedAtDate.toISOString(),
      workspace
    }
  };
}
