import { formatLocaleDate, getMessages, getLocalizedText } from "@/i18n/utils";
import type { Locale } from "@/i18n/types";
import type { ProjectMetadata } from "@/types/project";
import type { AnalysisTemplate, TemplateFieldType } from "@/types/template";

type CodebookSectionOptions = {
  includeSectionTitle?: boolean;
  detailed?: boolean;
};

function getFieldTypeLabel(fieldType: TemplateFieldType, locale: Locale) {
  const messages = getMessages(locale);

  switch (fieldType) {
    case "single-select":
      return messages.codebook.fieldTypeSingleSelect;
    case "multi-select":
      return messages.codebook.fieldTypeMultiSelect;
    case "text":
      return messages.codebook.fieldTypeText;
    case "number":
      return messages.codebook.fieldTypeNumber;
    case "boolean":
      return messages.codebook.fieldTypeBoolean;
    default:
      return fieldType;
  }
}

export function buildCodebookSectionLines(
  template: AnalysisTemplate | null,
  locale: Locale,
  options: CodebookSectionOptions = {}
) {
  const messages = getMessages(locale);
  const { includeSectionTitle = true, detailed = false } = options;
  const lines: string[] = [];

  if (includeSectionTitle) {
    lines.push(`## ${messages.codebook.title}`);
    lines.push("");
  }

  if (!template) {
    lines.push(messages.codebook.noActiveTemplateSelected);
    lines.push("");
    return lines;
  }

  lines.push(`- ${messages.exportReport.selectedTemplate}: ${getLocalizedText(template.name, locale)}`);
  lines.push(`- ${messages.exportReport.templateDescription}: ${getLocalizedText(template.shortDescription, locale)}`);
  lines.push(`- ${messages.codebook.recommendedUseCase}: ${getLocalizedText(template.researchUseCase, locale)}`);
  lines.push("");

  for (const field of template.fields) {
    lines.push(`### ${getLocalizedText(field.label, locale)}`);
    lines.push("");
    lines.push(`- ${messages.codebook.fieldKey}: \`${field.id}\``);
    lines.push(`- ${messages.codebook.fieldType}: ${getFieldTypeLabel(field.type, locale)}`);
    lines.push(`- ${messages.codebook.helpText}: ${getLocalizedText(field.description, locale)}`);

    if (field.placeholder) {
      lines.push(`- ${messages.codebook.placeholder}: ${getLocalizedText(field.placeholder, locale)}`);
    }

    if (field.options?.length) {
      if (detailed) {
        lines.push(`- ${messages.codebook.options}:`);

        for (const option of field.options) {
          lines.push(
            `  - ${messages.codebook.optionValue}: \`${option.value}\` | ${messages.codebook.optionLabel}: ${getLocalizedText(option.label, locale)}`
          );
        }
      } else {
        const optionList = field.options
          .map(
            (option) =>
              `\`${option.value}\` (${messages.codebook.optionLabel}: ${getLocalizedText(option.label, locale)})`
          )
          .join(", ");

        lines.push(`- ${messages.codebook.options}: ${optionList}`);
      }
    }

    lines.push("");
  }

  return lines;
}

export function buildCodebookExport(
  template: AnalysisTemplate | null,
  projectMetadata: ProjectMetadata,
  locale: Locale
) {
  const messages = getMessages(locale);
  const generatedAt = new Date();
  const exportTitle =
    projectMetadata.projectTitle.trim() ||
    `${template ? getLocalizedText(template.name, locale) : "FrameLab"} ${messages.codebook.title}`;

  const lines: string[] = [
    `# ${exportTitle}`,
    "",
    `- ${messages.exportReport.generatedDate}: ${formatLocaleDate(generatedAt, locale)}`
  ];

  if (projectMetadata.projectTitle.trim()) {
    lines.push(`- ${messages.projectMetadata.projectTitle}: ${projectMetadata.projectTitle.trim()}`);
  }

  lines.push("");
  lines.push(...buildCodebookSectionLines(template, locale, { includeSectionTitle: true, detailed: true }));
  lines.push(`> ${messages.codebook.note}`);
  lines.push("");
  lines.push(`> ${messages.exportReport.aiDisclaimer}`);

  return lines.join("\n");
}
