export type ExportFormat = "csv" | "json" | "markdown";

export interface ExportMetadata {
  projectTitle: string;
  generatedAt: string;
  sampleCount: number;
  selectedTemplateId: string | null;
  selectedTemplateName: string | null;
  format: ExportFormat;
}
