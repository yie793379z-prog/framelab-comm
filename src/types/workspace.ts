import type { CodingRow } from "@/types/coding";
import type { ExportFormat } from "@/types/export";
import type { ProjectMetadata } from "@/types/project";
import type { SampleRecord } from "@/types/sample";

export interface WorkspaceState {
  importText: string;
  samples: SampleRecord[];
  selectedTemplateId: string | null;
  selectedSampleId: string | null;
  codingRows: CodingRow[];
  projectMetadata: ProjectMetadata;
  exportFormats: ExportFormat[];
}

export type PersistedWorkspaceState = Pick<
  WorkspaceState,
  "importText" | "samples" | "selectedTemplateId" | "selectedSampleId" | "codingRows" | "projectMetadata"
>;
