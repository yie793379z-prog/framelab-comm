import type { ProjectMetadata } from "@/types/project";

export const emptyProjectMetadata: ProjectMetadata = {
  projectTitle: "",
  researchQuestion: "",
  researcherName: "",
  courseContext: "",
  datasetDescription: "",
  methodNote: ""
};

export function hasProjectMetadataValue(metadata: ProjectMetadata) {
  return Object.values(metadata).some((value) => value.trim().length > 0);
}

export function sanitizeProjectMetadata(input: unknown): ProjectMetadata | null {
  if (input === undefined) {
    return { ...emptyProjectMetadata };
  }

  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return null;
  }

  const candidate = input as Record<string, unknown>;
  const nextMetadata: ProjectMetadata = { ...emptyProjectMetadata };

  for (const key of Object.keys(emptyProjectMetadata) as Array<keyof ProjectMetadata>) {
    const value = candidate[key];

    if (value === undefined || value === null) {
      continue;
    }

    if (typeof value !== "string") {
      return null;
    }

    nextMetadata[key] = value;
  }

  return nextMetadata;
}
