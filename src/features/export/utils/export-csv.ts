import { analysisTemplates } from "@/features/templates/data/templates";
import { getLocalizedText } from "@/i18n/utils";
import type { Locale } from "@/i18n/types";
import type { CodingFieldValue, CodingRow } from "@/types/coding";
import type { WorkspaceState } from "@/types/workspace";

function escapeCsvCell(value: string) {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }

  return value;
}

function stringifyCodingValue(value: CodingFieldValue) {
  if (value === null || value === undefined) {
    return "";
  }

  if (Array.isArray(value)) {
    return value.join(" | ");
  }

  return String(value);
}

function buildFieldColumns(locale: Locale) {
  const fieldIds = Array.from(
    new Set(analysisTemplates.flatMap((template) => template.fields.map((field) => field.id)))
  );

  return fieldIds.map((fieldId) => {
    const field = analysisTemplates.flatMap((template) => template.fields).find((item) => item.id === fieldId);

    return {
      id: fieldId,
      label: field ? getLocalizedText(field.label, locale) : fieldId
    };
  });
}

function buildCsvRow(
  row: CodingRow,
  workspace: WorkspaceState,
  fieldColumns: Array<{ id: string; label: string }>,
  locale: Locale
) {
  const sample = workspace.samples.find((item) => item.id === row.sampleId);
  const template = analysisTemplates.find((item) => item.id === row.templateId);

  const values = [
    row.sampleId,
    sample?.title ?? "",
    row.templateId,
    template ? getLocalizedText(template.name, locale) : ""
  ];

  for (const fieldColumn of fieldColumns) {
    values.push(stringifyCodingValue(row.values[fieldColumn.id] ?? null));
  }

  return values.map((value) => escapeCsvCell(value)).join(",");
}

export function buildCsvExport(workspace: WorkspaceState, locale: Locale) {
  const fieldColumns = buildFieldColumns(locale);
  const headers = [
    locale === "zh-CN" ? "样本ID" : "sampleId",
    locale === "zh-CN" ? "样本标题" : "sampleTitle",
    locale === "zh-CN" ? "模板ID" : "templateId",
    locale === "zh-CN" ? "模板名称" : "templateName",
    ...fieldColumns.map((field) => field.label)
  ];
  const rows = workspace.codingRows.map((row) => buildCsvRow(row, workspace, fieldColumns, locale));

  return [headers.join(","), ...rows].join("\n");
}
