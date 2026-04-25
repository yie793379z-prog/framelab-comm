import { getProjectTemplateById } from "@/features/templates/utils/project-codebooks";
import { localizeTemplate } from "@/i18n/utils";
import type { Locale } from "@/i18n/types";
import type { ExportMetadata, ExportFormat } from "@/types/export";
import type { WorkspaceState } from "@/types/workspace";

const PROJECT_TITLES = {
  en: "FrameLab Analysis Project",
  "zh-CN": "FrameLab 分析项目"
} as const;

function buildExportMetadata(workspace: WorkspaceState, format: ExportFormat, locale: Locale): ExportMetadata {
  const selectedTemplate = getProjectTemplateById(
    workspace.selectedTemplateId,
    workspace.customProjectCodebooks
  );
  const projectTitle = workspace.projectMetadata.projectTitle.trim() || PROJECT_TITLES[locale];

  return {
    projectTitle,
    generatedAt: new Date().toISOString(),
    sampleCount: workspace.samples.length,
    selectedTemplateId: workspace.selectedTemplateId,
    selectedTemplateName: selectedTemplate ? localizeTemplate(selectedTemplate, locale).name : null,
    format,
    language: locale
  };
}

export function buildJsonExport(workspace: WorkspaceState, locale: Locale) {
  const selectedTemplate =
    getProjectTemplateById(workspace.selectedTemplateId, workspace.customProjectCodebooks) ?? null;

  return JSON.stringify(
    {
      projectMetadata: workspace.projectMetadata,
      customProjectCodebooks: workspace.customProjectCodebooks,
      samples: workspace.samples,
      selectedTemplate: selectedTemplate ? localizeTemplate(selectedTemplate, locale) : null,
      codingResults: workspace.codingRows,
      exportMetadata: buildExportMetadata(workspace, "json", locale)
    },
    null,
    2
  );
}
