import { analysisTemplates } from "@/features/templates/data/templates";
import type { ExportMetadata, ExportFormat } from "@/types/export";
import type { WorkspaceState } from "@/types/workspace";

const PROJECT_TITLE = "FrameLab Analysis Project";

function buildExportMetadata(workspace: WorkspaceState, format: ExportFormat): ExportMetadata {
  const selectedTemplate = analysisTemplates.find((template) => template.id === workspace.selectedTemplateId);

  return {
    projectTitle: PROJECT_TITLE,
    generatedAt: new Date().toISOString(),
    sampleCount: workspace.samples.length,
    selectedTemplateId: workspace.selectedTemplateId,
    selectedTemplateName: selectedTemplate?.name ?? null,
    format
  };
}

export function buildJsonExport(workspace: WorkspaceState) {
  const selectedTemplate = analysisTemplates.find((template) => template.id === workspace.selectedTemplateId) ?? null;

  return JSON.stringify(
    {
      samples: workspace.samples,
      selectedTemplate,
      codingResults: workspace.codingRows,
      exportMetadata: buildExportMetadata(workspace, "json")
    },
    null,
    2
  );
}
