import { analysisTemplates } from "@/features/templates/data/templates";
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

function buildFieldColumns() {
  const fieldIds = Array.from(
    new Set(analysisTemplates.flatMap((template) => template.fields.map((field) => field.id)))
  );

  return fieldIds;
}

function buildCsvRow(
  row: CodingRow,
  workspace: WorkspaceState,
  fieldIds: string[]
) {
  const sample = workspace.samples.find((item) => item.id === row.sampleId);
  const template = analysisTemplates.find((item) => item.id === row.templateId);

  const values = [
    row.sampleId,
    sample?.title ?? "",
    row.templateId,
    template?.name ?? ""
  ];

  for (const fieldId of fieldIds) {
    values.push(stringifyCodingValue(row.values[fieldId] ?? null));
  }

  return values.map((value) => escapeCsvCell(value)).join(",");
}

export function buildCsvExport(workspace: WorkspaceState) {
  const fieldIds = buildFieldColumns();
  const headers = ["sampleId", "sampleTitle", "templateId", "templateName", ...fieldIds];
  const rows = workspace.codingRows.map((row) => buildCsvRow(row, workspace, fieldIds));

  return [headers.join(","), ...rows].join("\n");
}
