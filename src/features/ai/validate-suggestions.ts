import type { CodingFieldValue } from "@/types/coding";
import type { AnalysisTemplate, TemplateField } from "@/types/template";
import type { SuggestionErrorCode, SuggestedCodingValues } from "@/features/ai/types";

const MAX_TEXT_LENGTH = 600;

type NormalizedSuggestionPayload = {
  rawProviderReturnedJson: boolean;
  suggestions: Record<string, unknown> | null;
  errorCode: SuggestionErrorCode | null;
};

export type NormalizedSuggestionResult = {
  suggestions: SuggestedCodingValues;
  acceptedKeys: string[];
  validationDroppedKeys: string[];
  rawProviderReturnedJson: boolean;
  errorCode: SuggestionErrorCode | null;
};

function normalizeMatchToken(value: string) {
  return value
    .trim()
    .replace(/^`+|`+$/g, "")
    .replace(/^["']+|["']+$/g, "")
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(/[\s_-]+/g, "-");
}

function unwrapMarkdownJson(rawValue: string) {
  const trimmed = rawValue.trim();
  const fencedMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return fencedMatch ? fencedMatch[1].trim() : trimmed;
}

function coerceBoolean(value: unknown) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (["true", "yes", "y", "是"].includes(normalized)) {
      return true;
    }

    if (["false", "no", "n", "否"].includes(normalized)) {
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
    const parsed = Number(value.trim());

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

function buildOptionLookup(field: TemplateField) {
  const optionLookup = new Map<string, string>();

  for (const option of field.options ?? []) {
    optionLookup.set(normalizeMatchToken(option.value), option.value);
    optionLookup.set(normalizeMatchToken(option.label.en), option.value);
    optionLookup.set(normalizeMatchToken(option.label["zh-CN"]), option.value);
  }

  return optionLookup;
}

function sanitizeSingleSelect(field: TemplateField, value: unknown) {
  if (typeof value !== "string") {
    return undefined;
  }

  const optionLookup = buildOptionLookup(field);
  return optionLookup.get(normalizeMatchToken(value));
}

function parseMultiSelectTokens(value: unknown) {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }

  if (typeof value === "string") {
    const trimmed = value.trim();

    if (!trimmed) {
      return [];
    }

    return trimmed.split(/[,\n;，；]+/).map((item) => item.trim()).filter(Boolean);
  }

  return [];
}

function sanitizeMultiSelect(field: TemplateField, value: unknown) {
  const optionLookup = buildOptionLookup(field);
  const normalizedValues = parseMultiSelectTokens(value)
    .map((item) => optionLookup.get(normalizeMatchToken(item)))
    .filter((item): item is string => Boolean(item));

  if (!normalizedValues.length) {
    return undefined;
  }

  return Array.from(new Set(normalizedValues));
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

function extractSuggestionObject(rawValue: unknown): NormalizedSuggestionPayload {
  if (rawValue && typeof rawValue === "object" && !Array.isArray(rawValue)) {
    const candidate = rawValue as Record<string, unknown>;

    if (candidate.suggestions && typeof candidate.suggestions === "object" && !Array.isArray(candidate.suggestions)) {
      return {
        rawProviderReturnedJson: true,
        suggestions: candidate.suggestions as Record<string, unknown>,
        errorCode: null
      };
    }

    return {
      rawProviderReturnedJson: true,
      suggestions: candidate,
      errorCode: null
    };
  }

  if (typeof rawValue === "string") {
    const cleanedText = unwrapMarkdownJson(rawValue);

    if (!cleanedText) {
      return {
        rawProviderReturnedJson: false,
        suggestions: null,
        errorCode: "parse_failed"
      };
    }

    try {
      const parsed = JSON.parse(cleanedText) as unknown;
      return extractSuggestionObject(parsed);
    } catch {
      return {
        rawProviderReturnedJson: false,
        suggestions: null,
        errorCode: "parse_failed"
      };
    }
  }

  return {
    rawProviderReturnedJson: false,
    suggestions: null,
    errorCode: "parse_failed"
  };
}

export function normalizeProviderSuggestions(template: AnalysisTemplate, rawValue: unknown): NormalizedSuggestionResult {
  const extracted = extractSuggestionObject(rawValue);

  if (!extracted.suggestions) {
    return {
      suggestions: {},
      acceptedKeys: [],
      validationDroppedKeys: [],
      rawProviderReturnedJson: extracted.rawProviderReturnedJson,
      errorCode: extracted.errorCode
    };
  }

  const allowedFieldIds = new Set(template.fields.map((field) => field.id));
  const candidateValues = extracted.suggestions;
  const suggestions: SuggestedCodingValues = {};
  const acceptedKeys: string[] = [];
  const validationDroppedKeys: string[] = [];

  for (const key of Object.keys(candidateValues)) {
    if (!allowedFieldIds.has(key)) {
      validationDroppedKeys.push(key);
    }
  }

  for (const field of template.fields) {
    if (!(field.id in candidateValues)) {
      continue;
    }

    const cleanedValue = sanitizeFieldValue(field, candidateValues[field.id]);

    if (cleanedValue === undefined) {
      validationDroppedKeys.push(field.id);
      continue;
    }

    suggestions[field.id] = cleanedValue;
    acceptedKeys.push(field.id);
  }

  return {
    suggestions,
    acceptedKeys,
    validationDroppedKeys: Array.from(new Set(validationDroppedKeys)),
    rawProviderReturnedJson: extracted.rawProviderReturnedJson,
    errorCode: acceptedKeys.length ? null : extracted.errorCode ?? "no_valid_fields"
  };
}

export function buildSuggestionJsonSchema(template: AnalysisTemplate) {
  const fieldProperties = Object.fromEntries(
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
    required: ["suggestions"],
    properties: {
      suggestions: {
        type: "object",
        additionalProperties: false,
        properties: fieldProperties
      }
    }
  };
}
