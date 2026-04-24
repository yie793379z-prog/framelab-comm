import type { CodingFieldValue } from "@/types/coding";
import type { AnalysisTemplate, TemplateField } from "@/types/template";

const MAX_TEXT_LENGTH = 600;

function coerceBoolean(value: unknown) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (normalized === "true") {
      return true;
    }

    if (normalized === "false") {
      return false;
    }
  }

  return undefined;
}

function coerceNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return undefined;
}

function coerceText(value: unknown) {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return undefined;
  }

  return trimmed.slice(0, MAX_TEXT_LENGTH);
}

function sanitizeSingleSelect(field: TemplateField, value: unknown) {
  if (typeof value !== "string") {
    return undefined;
  }

  const allowedValues = new Set(field.options?.map((option) => option.value) ?? []);
  return allowedValues.has(value) ? value : undefined;
}

function sanitizeMultiSelect(field: TemplateField, value: unknown) {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const allowedValues = new Set(field.options?.map((option) => option.value) ?? []);
  const cleanedValues = value.filter((item): item is string => typeof item === "string" && allowedValues.has(item));

  if (!cleanedValues.length) {
    return undefined;
  }

  return Array.from(new Set(cleanedValues));
}

function sanitizeFieldValue(field: TemplateField, value: unknown): CodingFieldValue | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }

  if (field.type === "text") {
    return coerceText(value);
  }

  if (field.type === "number") {
    return coerceNumber(value);
  }

  if (field.type === "boolean") {
    return coerceBoolean(value);
  }

  if (field.type === "single-select") {
    return sanitizeSingleSelect(field, value);
  }

  if (field.type === "multi-select") {
    return sanitizeMultiSelect(field, value);
  }

  return undefined;
}

export function sanitizeSuggestedValues(template: AnalysisTemplate, rawValues: unknown) {
  if (!rawValues || typeof rawValues !== "object" || Array.isArray(rawValues)) {
    return {};
  }

  const candidateValues = rawValues as Record<string, unknown>;
  const cleanedValues: Record<string, CodingFieldValue> = {};

  for (const field of template.fields) {
    const cleanedValue = sanitizeFieldValue(field, candidateValues[field.id]);

    if (cleanedValue !== undefined) {
      cleanedValues[field.id] = cleanedValue;
    }
  }

  return cleanedValues;
}

export function buildSuggestionJsonSchema(template: AnalysisTemplate) {
  const properties = Object.fromEntries(
    template.fields.map((field) => {
      if (field.type === "text") {
        return [
          field.id,
          {
            type: "string",
            maxLength: MAX_TEXT_LENGTH
          }
        ];
      }

      if (field.type === "number") {
        return [field.id, { type: "number" }];
      }

      if (field.type === "boolean") {
        return [field.id, { type: "boolean" }];
      }

      if (field.type === "single-select") {
        return [
          field.id,
          {
            type: "string",
            enum: field.options?.map((option) => option.value) ?? []
          }
        ];
      }

      return [
        field.id,
        {
          type: "array",
          items: {
            type: "string",
            enum: field.options?.map((option) => option.value) ?? []
          },
          uniqueItems: true
        }
      ];
    })
  );

  return {
    type: "object",
    additionalProperties: false,
    properties
  };
}
