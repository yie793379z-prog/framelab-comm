import { analysisTemplates } from "@/features/templates/data/templates";
import { getMessages, getLocalizedText, formatLocaleDate } from "@/i18n/utils";
import type { Locale } from "@/i18n/types";
import type { CodingFieldValue } from "@/types/coding";
import type { WorkspaceState } from "@/types/workspace";
import type { TemplateField } from "@/types/template";

function formatFieldValue(field: TemplateField, value: CodingFieldValue, locale: Locale, notCodedText: string) {
  if (value === null || value === undefined || value === "" || (Array.isArray(value) && value.length === 0)) {
    return notCodedText;
  }

  if (field.type === "single-select" && typeof value === "string") {
    return getLocalizedText(field.options?.find((option) => option.value === value)?.label, locale) ?? value;
  }

  if (field.type === "multi-select" && Array.isArray(value)) {
    return value
      .map((item) => getLocalizedText(field.options?.find((option) => option.value === item)?.label, locale) ?? item)
      .join(", ");
  }

  return String(value);
}

export function buildMarkdownExport(workspace: WorkspaceState, locale: Locale) {
  const messages = getMessages(locale);
  const selectedTemplate = analysisTemplates.find((template) => template.id === workspace.selectedTemplateId) ?? null;
  const generatedAt = new Date();
  const lines: string[] = [
    `# ${messages.exportReport.projectTitle}`,
    "",
    `- ${locale === "zh-CN" ? "项目标题" : "Project title"}: ${messages.exportReport.projectTitle}`,
    `- ${messages.exportReport.generatedDate}: ${formatLocaleDate(generatedAt, locale)}`,
    `- ${messages.exportReport.selectedTemplate}: ${selectedTemplate ? getLocalizedText(selectedTemplate.name, locale) : messages.common.noTemplateSelected}`,
    `- ${messages.exportReport.numberOfSamples}: ${workspace.samples.length}`,
    "",
    `## ${messages.exportReport.methodologyNote}`,
    "",
    messages.exportReport.methodologyBody,
    "",
    `> ${messages.exportReport.aiDisclaimer}`,
    "",
    `## ${messages.exportReport.sampleCodingSummary}`,
    ""
  ];

  if (!workspace.samples.length) {
    lines.push(messages.exportReport.noSamples);
    return lines.join("\n");
  }

  for (const sample of workspace.samples) {
    const codingRow = selectedTemplate
      ? workspace.codingRows.find(
          (row) => row.sampleId === sample.id && row.templateId === selectedTemplate.id
        )
      : null;

    lines.push(`### ${sample.title}`);
    lines.push("");
    lines.push(`**${messages.exportReport.source}**: ${sample.source ?? messages.common.sourceUnknown}`);
    lines.push("");
    lines.push(`**${messages.exportReport.textExcerpt}**`);
    lines.push("");
    lines.push(sample.text);
    lines.push("");

    if (!selectedTemplate) {
      lines.push(messages.exportReport.noTemplate);
      lines.push("");
      continue;
    }

    lines.push(`**${messages.exportReport.codingSummary}**`);
    lines.push("");

    for (const field of selectedTemplate.fields) {
      const formattedValue = formatFieldValue(field, codingRow?.values[field.id] ?? null, locale, messages.common.notCoded);
      lines.push(`- ${getLocalizedText(field.label, locale)}: ${formattedValue}`);
    }

    lines.push("");
  }

  return lines.join("\n");
}
