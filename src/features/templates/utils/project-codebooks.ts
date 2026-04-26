import { analysisTemplates } from "@/features/templates/data/templates";
import type { Locale, LocalizedText } from "@/i18n/types";
import type {
  AnalysisTemplate,
  CodebookDiscoveryGoal,
  ProjectCodebook,
  ProjectCodebookMap,
  TemplateField,
  TemplateFieldOption
} from "@/types/template";

export const emptyProjectCodebooks: ProjectCodebookMap = {};
const emptyLocalizedText = { en: "", "zh-CN": "" } as const;

function cloneLocalizedText(text: LocalizedText): LocalizedText {
  return {
    en: text.en,
    "zh-CN": text["zh-CN"]
  };
}

function cloneOption(option: TemplateFieldOption): TemplateFieldOption {
  return {
    ...option,
    label: cloneLocalizedText(option.label),
    description: option.description ? cloneLocalizedText(option.description) : undefined
  };
}

function cloneField(field: TemplateField): TemplateField {
  return {
    ...field,
    label: cloneLocalizedText(field.label),
    description: cloneLocalizedText(field.description),
    placeholder: field.placeholder ? cloneLocalizedText(field.placeholder) : undefined,
    options: field.options?.map((option) => cloneOption(option)),
    generated: field.generated ? { ...field.generated } : undefined
  };
}

export function cloneTemplate(template: AnalysisTemplate): AnalysisTemplate {
  return {
    ...template,
    name: cloneLocalizedText(template.name),
    shortDescription: cloneLocalizedText(template.shortDescription),
    researchUseCase: cloneLocalizedText(template.researchUseCase),
    fields: template.fields.map((field) => cloneField(field))
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function sanitizeLocalizedText(input: unknown, fallback: LocalizedText = emptyLocalizedText): LocalizedText {
  if (!isRecord(input)) {
    return cloneLocalizedText(fallback);
  }

  const en = typeof input.en === "string" ? input.en : fallback.en;
  const zhCn = typeof input["zh-CN"] === "string" ? input["zh-CN"] : fallback["zh-CN"];

  if (en.trim() || zhCn.trim()) {
    return {
      en: en.trim() ? en : zhCn,
      "zh-CN": zhCn.trim() ? zhCn : en
    };
  }

  return cloneLocalizedText(fallback);
}

function sanitizeLocalizedTextAgainstBase(input: unknown, base: LocalizedText): LocalizedText {
  return sanitizeLocalizedText(input, base);
}

function isGeneratedDiscoveryGoal(value: unknown): value is CodebookDiscoveryGoal {
  return (
    value === "problem_definitions" ||
    value === "suggested_remedies" ||
    value === "frames" ||
    value === "actors" ||
    value === "discourse_themes" ||
    value === "custom"
  );
}

function sanitizeGeneratedFieldOption(input: unknown): TemplateFieldOption | null {
  if (!isRecord(input) || typeof input.value !== "string" || !input.value.trim()) {
    return null;
  }

  const label = sanitizeLocalizedText(input.label, {
    en: input.value,
    "zh-CN": input.value
  });
  const description = sanitizeLocalizedText(input.description);

  return {
    value: input.value,
    label,
    description: description.en.trim() || description["zh-CN"].trim() ? description : undefined
  };
}

function sanitizeGeneratedField(input: unknown): TemplateField | null {
  if (!isRecord(input) || typeof input.id !== "string" || !input.id.trim()) {
    return null;
  }

  if (input.type !== "single-select" && input.type !== "multi-select") {
    return null;
  }

  if (!isRecord(input.generated) || input.generated.source !== "ai-codebook-builder") {
    return null;
  }

  if (!isGeneratedDiscoveryGoal(input.generated.discoveryGoal)) {
    return null;
  }

  const optionsInput = Array.isArray(input.options) ? input.options : [];
  const options: TemplateFieldOption[] = [];
  const seenOptionValues = new Set<string>();

  for (const option of optionsInput) {
    const sanitizedOption = sanitizeGeneratedFieldOption(option);

    if (!sanitizedOption || seenOptionValues.has(sanitizedOption.value)) {
      continue;
    }

    seenOptionValues.add(sanitizedOption.value);
    options.push(sanitizedOption);
  }

  if (!options.length) {
    return null;
  }

  const label = sanitizeLocalizedText(input.label, {
    en: input.id,
    "zh-CN": input.id
  });
  const description = sanitizeLocalizedText(input.description, {
    en: "Data-driven categories generated from the imported samples. Review before use.",
    "zh-CN": "根据导入样本归纳出的数据驱动分类。使用前请人工复核。"
  });
  const placeholder = sanitizeLocalizedText(input.placeholder);

  return {
    id: input.id,
    type: input.type,
    label,
    description,
    placeholder: placeholder.en.trim() || placeholder["zh-CN"].trim() ? placeholder : undefined,
    options,
    generated: {
      source: "ai-codebook-builder",
      discoveryGoal: input.generated.discoveryGoal
    }
  };
}

function sanitizeFieldAgainstBase(input: unknown, baseField: TemplateField): TemplateField {
  if (!isRecord(input)) {
    return cloneField(baseField);
  }

  const nextField = cloneField(baseField);

  if (input.id !== baseField.id || input.type !== baseField.type) {
    return nextField;
  }

  nextField.label = sanitizeLocalizedTextAgainstBase(input.label, baseField.label);
  nextField.description = sanitizeLocalizedTextAgainstBase(input.description, baseField.description);

  if (baseField.placeholder) {
    nextField.placeholder = sanitizeLocalizedTextAgainstBase(input.placeholder, baseField.placeholder);
  }

  if (baseField.options?.length) {
    const inputOptions = Array.isArray(input.options) ? input.options : null;

    if (inputOptions && inputOptions.length === baseField.options.length) {
      nextField.options = baseField.options.map((baseOption, optionIndex) => {
        const inputOption = inputOptions[optionIndex];

        if (!isRecord(inputOption) || inputOption.value !== baseOption.value) {
          return cloneOption(baseOption);
        }

        return {
          ...cloneOption(baseOption),
          label: sanitizeLocalizedTextAgainstBase(inputOption.label, baseOption.label)
        };
      });
    } else {
      nextField.options = baseField.options.map((option) => cloneOption(option));
    }
  }

  return nextField;
}

export function sanitizeProjectCodebookAgainstBase(
  input: unknown,
  baseTemplate: AnalysisTemplate
): ProjectCodebook | null {
  if (!isRecord(input)) {
    return null;
  }

  if (input.id !== baseTemplate.id) {
    return null;
  }

  const nextTemplate = cloneTemplate(baseTemplate);

  nextTemplate.name = sanitizeLocalizedTextAgainstBase(input.name, baseTemplate.name);
  nextTemplate.shortDescription = sanitizeLocalizedTextAgainstBase(
    input.shortDescription,
    baseTemplate.shortDescription
  );
  nextTemplate.researchUseCase = sanitizeLocalizedTextAgainstBase(
    input.researchUseCase,
    baseTemplate.researchUseCase
  );

  const inputFields = Array.isArray(input.fields) ? input.fields : [];
  const inputFieldById = new Map<string, unknown>();

  for (const candidateField of inputFields) {
    if (isRecord(candidateField) && typeof candidateField.id === "string") {
      inputFieldById.set(candidateField.id, candidateField);
    }
  }

  const sanitizedBaseFields = baseTemplate.fields.map((baseField) =>
    sanitizeFieldAgainstBase(inputFieldById.get(baseField.id), baseField)
  );

  const baseFieldIds = new Set(baseTemplate.fields.map((field) => field.id));
  const generatedFields: TemplateField[] = [];
  const seenGeneratedFieldIds = new Set<string>();

  for (const candidateField of inputFields) {
    if (!isRecord(candidateField) || typeof candidateField.id !== "string" || baseFieldIds.has(candidateField.id)) {
      continue;
    }

    const sanitizedGeneratedField = sanitizeGeneratedField(candidateField);

    if (!sanitizedGeneratedField || seenGeneratedFieldIds.has(sanitizedGeneratedField.id)) {
      continue;
    }

    seenGeneratedFieldIds.add(sanitizedGeneratedField.id);
    generatedFields.push(sanitizedGeneratedField);
  }

  nextTemplate.fields = [...sanitizedBaseFields, ...generatedFields];

  return nextTemplate;
}

export function sanitizeProjectCodebooks(input: unknown): ProjectCodebookMap {
  if (!isRecord(input)) {
    return {};
  }

  const sanitized: ProjectCodebookMap = {};

  for (const baseTemplate of analysisTemplates) {
    const candidate = input[baseTemplate.id];
    const projectCodebook = sanitizeProjectCodebookAgainstBase(candidate, baseTemplate);

    if (projectCodebook) {
      sanitized[baseTemplate.id] = projectCodebook;
    }
  }

  return sanitized;
}

export function getBuiltInTemplateById(templateId: string | null) {
  if (!templateId) {
    return null;
  }

  return analysisTemplates.find((template) => template.id === templateId) ?? null;
}

export function getProjectTemplateById(
  templateId: string | null,
  customProjectCodebooks: ProjectCodebookMap
) {
  if (!templateId) {
    return null;
  }

  return customProjectCodebooks[templateId] ?? getBuiltInTemplateById(templateId);
}

export function getProjectTemplates(customProjectCodebooks: ProjectCodebookMap) {
  return analysisTemplates.map((template) => customProjectCodebooks[template.id] ?? template);
}

export function hasCustomProjectCodebook(
  templateId: string | null,
  customProjectCodebooks: ProjectCodebookMap
) {
  if (!templateId) {
    return false;
  }

  return Boolean(customProjectCodebooks[templateId]);
}

export function createCustomProjectCodebook(
  templateId: string
) {
  const sourceTemplate = getBuiltInTemplateById(templateId);

  return sourceTemplate ? cloneTemplate(sourceTemplate) : null;
}

export function updateLocalizedTextValue(
  currentValue: LocalizedText,
  locale: Locale,
  nextValue: string
): LocalizedText {
  return {
    ...currentValue,
    [locale]: nextValue
  };
}

function mergeGeneratedField(existingField: TemplateField, incomingField: TemplateField): TemplateField {
  const existingOptions = existingField.options ?? [];
  const incomingOptions = incomingField.options ?? [];
  const mergedOptions = [...existingOptions];
  const seenValues = new Set(existingOptions.map((option) => option.value));

  for (const option of incomingOptions) {
    if (seenValues.has(option.value)) {
      continue;
    }

    seenValues.add(option.value);
    mergedOptions.push(cloneOption(option));
  }

  return {
    ...existingField,
    options: mergedOptions
  };
}

export function upsertGeneratedFieldIntoProjectCodebook(
  template: ProjectCodebook,
  generatedField: TemplateField
): ProjectCodebook {
  const existingField = template.fields.find((field) => field.id === generatedField.id);

  if (!existingField) {
    return {
      ...template,
      fields: [...template.fields, cloneField(generatedField)]
    };
  }

  return {
    ...template,
    fields: template.fields.map((field) => {
      if (field.id !== generatedField.id) {
        return field;
      }

      return mergeGeneratedField(field, generatedField);
    })
  };
}

export function resetProjectCodebookToBuiltIn(
  templateId: string,
  customProjectCodebooks: ProjectCodebookMap
) {
  const builtInTemplate = createCustomProjectCodebook(templateId);

  if (!builtInTemplate) {
    return null;
  }

  const currentProjectCodebook = customProjectCodebooks[templateId];

  if (!currentProjectCodebook) {
    return builtInTemplate;
  }

  const generatedFields = currentProjectCodebook.fields
    .filter((field) => field.generated?.source === "ai-codebook-builder")
    .map((field) => cloneField(field));

  return {
    ...builtInTemplate,
    fields: [...builtInTemplate.fields, ...generatedFields]
  };
}
