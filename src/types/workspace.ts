import type { CodingRow } from "@/types/coding";
import type { ExportFormat } from "@/types/export";
import type { SampleRecord } from "@/types/sample";

export interface WorkspaceState {
  importText: string;
  samples: SampleRecord[];
  selectedTemplateId: string | null;
  codingRows: CodingRow[];
  exportFormats: ExportFormat[];
}
