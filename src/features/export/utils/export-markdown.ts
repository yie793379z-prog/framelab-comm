import { buildCodebookSectionLines } from "@/features/export/utils/export-codebook";
import { buildCodingSummary } from "@/features/summary/utils/build-coding-summary";
import { getProjectTemplateById } from "@/features/templates/utils/project-codebooks";
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
  const selectedTemplate =
    getProjectTemplateById(workspace.selectedTemplateId, workspace.customProjectCodebooks) ?? null;
  const summary = selectedTemplate
    ? buildCodingSummary(workspace.samples, workspace.codingRows, selectedTemplate, workspace.selectedSampleId)
    : null;
  const generatedAt = new Date();
  const projectTitle = workspace.projectMetadata.projectTitle.trim() || messages.exportReport.projectTitle;
  const projectInformationLines = [
    {
      label: messages.projectMetadata.projectTitle,
      value: workspace.projectMetadata.projectTitle.trim()
    },
    {
      label: messages.exportReport.researchQuestion,
      value: workspace.projectMetadata.researchQuestion.trim()
    },
    {
      label: messages.exportReport.researcherName,
      value: workspace.projectMetadata.researcherName.trim()
    },
    {
      label: messages.exportReport.courseContext,
      value: workspace.projectMetadata.courseContext.trim()
    },
    {
      label: messages.exportReport.datasetDescription,
      value: workspace.projectMetadata.datasetDescription.trim()
    }
  ].filter((item) => item.value);
  const lines: string[] = [
    `# ${projectTitle}`,
    "",
    `- ${messages.projectMetadata.projectTitle}: ${projectTitle}`,
    `- ${messages.exportReport.generatedDate}: ${formatLocaleDate(generatedAt, locale)}`,
    "",
    `## ${messages.exportReport.projectInformation}`,
    "",
    ...projectInformationLines.map((item) => `- ${item.label}: ${item.value}`),
    ...(projectInformationLines.length ? [""] : [messages.projectMetadata.noProjectInformationYet, ""])
  ];

  lines.push(`## ${messages.exportReport.selectedTemplate}`);
  lines.push("");
  lines.push(
    `- ${messages.exportReport.selectedTemplate}: ${
      selectedTemplate ? getLocalizedText(selectedTemplate.name, locale) : messages.common.noTemplateSelected
    }`
  );

  if (selectedTemplate) {
    lines.push(`- ${messages.exportReport.templateDescription}: ${getLocalizedText(selectedTemplate.shortDescription, locale)}`);
  }

  lines.push("");
  lines.push(`## ${messages.exportReport.methodologyNote}`);
  lines.push("");
  lines.push(messages.exportReport.methodologyBody);

  if (workspace.projectMetadata.methodNote.trim()) {
    lines.push("");
    lines.push(`**${messages.exportReport.methodNote}**: ${workspace.projectMetadata.methodNote.trim()}`);
  }

  lines.push("");
  lines.push(`## ${messages.exportReport.codingOverview}`);
  lines.push("");
  lines.push(`- ${messages.codingSummary.totalSamples}: ${summary?.totalSamples ?? workspace.samples.length}`);
  lines.push(`- ${messages.codingSummary.codedSamples}: ${summary?.codedSamples ?? 0}`);
  lines.push(`- ${messages.codingSummary.uncodedSamples}: ${summary?.uncodedSamples ?? workspace.samples.length}`);
  lines.push(`- ${messages.codingSummary.completion}: ${summary ? `${summary.completionPercent}%` : "0%"}`);
  lines.push("");
  lines.push(`## ${messages.exportReport.fieldDistributionSummary}`);
  lines.push("");

  if (!summary) {
    lines.push(messages.exportReport.noTemplate);
    lines.push("");
  } else if (!summary.fieldSummaries.length) {
    lines.push(messages.exportReport.noFieldSummary);
    lines.push("");
  } else {
    for (const fieldSummary of summary.fieldSummaries) {
      lines.push(`### ${getLocalizedText(fieldSummary.field.label, locale)}`);
      lines.push("");

      if (fieldSummary.type === "single-select" || fieldSummary.type === "multi-select") {
        for (const option of fieldSummary.options) {
          const optionLabel =
            getLocalizedText(
              fieldSummary.field.options?.find((item) => item.value === option.value)?.label,
              locale
            ) ?? option.value;
          lines.push(`- ${optionLabel}: ${option.count}`);
        }
      }

      if (fieldSummary.type === "boolean") {
        lines.push(`- ${messages.exportReport.trueLabel}: ${fieldSummary.trueCount}`);
        lines.push(`- ${messages.exportReport.falseLabel}: ${fieldSummary.falseCount}`);
      }

      if (fieldSummary.type === "text") {
        lines.push(
          `- ${messages.codingSummary.textFieldsCompleted}: ${fieldSummary.filledCount} / ${summary.totalSamples}`
        );
      }

      if (fieldSummary.type === "number") {
        if (fieldSummary.count === 0) {
          lines.push(`- ${messages.codingSummary.noCodedValuesYet}`);
        } else {
          lines.push(`- ${messages.exportReport.count}: ${fieldSummary.count}`);
          lines.push(`- ${messages.codingSummary.min}: ${fieldSummary.min}`);
          lines.push(`- ${messages.codingSummary.max}: ${fieldSummary.max}`);
          lines.push(`- ${messages.codingSummary.average}: ${fieldSummary.average?.toFixed(2)}`);
        }
      }

      lines.push("");
    }
  }

  lines.push(...buildCodebookSectionLines(selectedTemplate, locale, { includeSectionTitle: true, detailed: false }));
  lines.push(`> ${messages.exportReport.aiDisclaimer}`);
  lines.push("");
  lines.push(`> ${messages.exportReport.researchLimitationNote}`);
  lines.push("");
  lines.push(`## ${messages.exportReport.sampleCodingSummary}`);
  lines.push("");

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
