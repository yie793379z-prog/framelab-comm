import type { CodingRow } from "@/types/coding";
import type { ExportFormat } from "@/types/export";
import type { ProjectMetadata } from "@/types/project";
import type { SampleRecord } from "@/types/sample";
import type { ProjectCodebookMap } from "@/types/template";

export interface WorkspaceState {
  importText: string;
  samples: SampleRecord[];
  selectedTemplateId: string | null;
  selectedSampleId: string | null;
  codingRows: CodingRow[];
  projectMetadata: ProjectMetadata;
  customProjectCodebooks: ProjectCodebookMap;
  exportFormats: ExportFormat[];
}

export type PersistedWorkspaceState = Pick<
  WorkspaceState,
  | "importText"
  | "samples"
  | "selectedTemplateId"
  | "selectedSampleId"
  | "codingRows"
  | "projectMetadata"
  | "customProjectCodebooks"
>;
