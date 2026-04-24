import { analysisTemplates } from "@/features/templates/data/templates";
import type { CodingFieldValue } from "@/types/coding";
import type { WorkspaceState } from "@/types/workspace";
import type { TemplateField } from "@/types/template";

const PROJECT_TITLE = "FrameLab Analysis Project";
const AI_DISCLAIMER =
  "AI suggestions are editable aids and should not be treated as final academic judgments.";

function formatDate(value: Date) {
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(value);
}

function formatFieldValue(field: TemplateField, value: CodingFieldValue) {
  if (value === null || value === undefined || value === "" || (Array.isArray(value) && value.length === 0)) {
    return "Not coded";
  }

  if (field.type === "single-select" && typeof value === "string") {
    return field.options?.find((option) => option.value === value)?.label ?? value;
  }

  if (field.type === "multi-select" && Array.isArray(value)) {
    return value
      .map((item) => field.options?.find((option) => option.value === item)?.label ?? item)
      .join(", ");
  }

  return String(value);
}

export function buildMarkdownExport(workspace: WorkspaceState) {
  const selectedTemplate = analysisTemplates.find((template) => template.id === workspace.selectedTemplateId) ?? null;
  const generatedAt = new Date();
  const lines: string[] = [
    `# ${PROJECT_TITLE}`,
    "",
    `- Project title: ${PROJECT_TITLE}`,
    `- Generated date: ${formatDate(generatedAt)}`,
    `- Selected template: ${selectedTemplate?.name ?? "No template selected"}`,
    `- Number of samples: ${workspace.samples.length}`,
    "",
    "## Methodology Note",
    "",
    "This report was generated from a local FrameLab workspace. Coding values may include user-entered judgments and mock AI-assisted suggestions that remain fully editable during the research workflow.",
    "",
    `> ${AI_DISCLAIMER}`,
    "",
    "## Sample Coding Summary",
    ""
  ];

  if (!workspace.samples.length) {
    lines.push("No samples were available at export time.");
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
    lines.push(`**Source**: ${sample.source ?? "Unknown"}`);
    lines.push("");
    lines.push("**Text excerpt**");
    lines.push("");
    lines.push(sample.text);
    lines.push("");

    if (!selectedTemplate) {
      lines.push("No template was selected when this report was generated.");
      lines.push("");
      continue;
    }

    lines.push("**Coding summary**");
    lines.push("");

    for (const field of selectedTemplate.fields) {
      const formattedValue = formatFieldValue(field, codingRow?.values[field.id] ?? null);
      lines.push(`- ${field.label}: ${formattedValue}`);
    }

    lines.push("");
  }

  return lines.join("\n");
}
