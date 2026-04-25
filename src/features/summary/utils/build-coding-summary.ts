import type { CodingFieldValue, CodingRow } from "@/types/coding";
import type { SampleRecord } from "@/types/sample";
import type { AnalysisTemplate, TemplateField } from "@/types/template";

type BaseFieldSummary = {
  field: TemplateField;
};

type OptionCount = {
  value: string;
  count: number;
};

export type SingleSelectFieldSummary = BaseFieldSummary & {
  type: "single-select";
  filledCount: number;
  options: OptionCount[];
};

export type MultiSelectFieldSummary = BaseFieldSummary & {
  type: "multi-select";
  filledCount: number;
  options: OptionCount[];
};

export type BooleanFieldSummary = BaseFieldSummary & {
  type: "boolean";
  filledCount: number;
  trueCount: number;
  falseCount: number;
};

export type TextFieldSummary = BaseFieldSummary & {
  type: "text";
  filledCount: number;
};

export type NumberFieldSummary = BaseFieldSummary & {
  type: "number";
  count: number;
  min: number | null;
  max: number | null;
  average: number | null;
};

export type CodingFieldSummary =
  | SingleSelectFieldSummary
  | MultiSelectFieldSummary
  | BooleanFieldSummary
  | TextFieldSummary
  | NumberFieldSummary;

export type CodingSummary = {
  template: AnalysisTemplate;
  totalSamples: number;
  codedSamples: number;
  uncodedSamples: number;
  completionPercent: number;
  selectedSampleCount: number;
  hasAnyCodedValues: boolean;
  fieldSummaries: CodingFieldSummary[];
};

function isEmptyCodingValue(value: CodingFieldValue | undefined) {
  return value === null || value === undefined || value === "" || (Array.isArray(value) && value.length === 0);
}

function getTemplateRows(codingRows: CodingRow[], templateId: string) {
  return codingRows.filter((row) => row.templateId === templateId);
}

function getFilledSampleIds(rows: CodingRow[]) {
  return new Set(
    rows
      .filter((row) => Object.values(row.values).some((value) => !isEmptyCodingValue(value)))
      .map((row) => row.sampleId)
  );
}

function buildSingleSelectSummary(field: TemplateField, rows: CodingRow[]): SingleSelectFieldSummary {
  const options = (field.options ?? []).map((option) => ({
    value: option.value,
    count: 0
  }));
  const optionLookup = new Map(options.map((option) => [option.value, option]));
  let filledCount = 0;

  for (const row of rows) {
    const value = row.values[field.id];

    if (typeof value !== "string" || !value) {
      continue;
    }

    const option = optionLookup.get(value);

    if (!option) {
      continue;
    }

    option.count += 1;
    filledCount += 1;
  }

  return {
    field,
    type: "single-select",
    filledCount,
    options
  };
}

function buildMultiSelectSummary(field: TemplateField, rows: CodingRow[]): MultiSelectFieldSummary {
  const options = (field.options ?? []).map((option) => ({
    value: option.value,
    count: 0
  }));
  const optionLookup = new Map(options.map((option) => [option.value, option]));
  let filledCount = 0;

  for (const row of rows) {
    const value = row.values[field.id];

    if (!Array.isArray(value) || !value.length) {
      continue;
    }

    filledCount += 1;

    for (const item of value) {
      const option = optionLookup.get(item);

      if (option) {
        option.count += 1;
      }
    }
  }

  return {
    field,
    type: "multi-select",
    filledCount,
    options
  };
}

function buildBooleanSummary(field: TemplateField, rows: CodingRow[]): BooleanFieldSummary {
  let trueCount = 0;
  let falseCount = 0;

  for (const row of rows) {
    const value = row.values[field.id];

    if (typeof value !== "boolean") {
      continue;
    }

    if (value) {
      trueCount += 1;
    } else {
      falseCount += 1;
    }
  }

  return {
    field,
    type: "boolean",
    filledCount: trueCount + falseCount,
    trueCount,
    falseCount
  };
}

function buildTextSummary(field: TemplateField, rows: CodingRow[]): TextFieldSummary {
  const filledCount = rows.filter((row) => {
    const value = row.values[field.id];
    return typeof value === "string" && value.trim().length > 0;
  }).length;

  return {
    field,
    type: "text",
    filledCount
  };
}

function buildNumberSummary(field: TemplateField, rows: CodingRow[]): NumberFieldSummary {
  const values = rows
    .map((row) => row.values[field.id])
    .filter((value): value is number => typeof value === "number" && Number.isFinite(value));

  if (!values.length) {
    return {
      field,
      type: "number",
      count: 0,
      min: null,
      max: null,
      average: null
    };
  }

  const total = values.reduce((sum, value) => sum + value, 0);

  return {
    field,
    type: "number",
    count: values.length,
    min: Math.min(...values),
    max: Math.max(...values),
    average: total / values.length
  };
}

function buildFieldSummary(field: TemplateField, rows: CodingRow[]): CodingFieldSummary {
  if (field.type === "single-select") {
    return buildSingleSelectSummary(field, rows);
  }

  if (field.type === "multi-select") {
    return buildMultiSelectSummary(field, rows);
  }

  if (field.type === "boolean") {
    return buildBooleanSummary(field, rows);
  }

  if (field.type === "number") {
    return buildNumberSummary(field, rows);
  }

  return buildTextSummary(field, rows);
}

export function buildCodingSummary(
  samples: SampleRecord[],
  codingRows: CodingRow[],
  template: AnalysisTemplate,
  selectedSampleId: string | null
): CodingSummary {
  const templateRows = getTemplateRows(codingRows, template.id);
  const filledSampleIds = getFilledSampleIds(templateRows);
  const codedSamples = samples.filter((sample) => filledSampleIds.has(sample.id)).length;
  const totalSamples = samples.length;

  return {
    template,
    totalSamples,
    codedSamples,
    uncodedSamples: Math.max(totalSamples - codedSamples, 0),
    completionPercent: totalSamples ? Math.round((codedSamples / totalSamples) * 100) : 0,
    selectedSampleCount: selectedSampleId && samples.some((sample) => sample.id === selectedSampleId) ? 1 : 0,
    hasAnyCodedValues: codedSamples > 0,
    fieldSummaries: template.fields.map((field) => buildFieldSummary(field, templateRows))
  };
}
