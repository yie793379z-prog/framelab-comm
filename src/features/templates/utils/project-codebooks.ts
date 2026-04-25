import { analysisTemplates } from "@/features/templates/data/templates";
import type { Locale, LocalizedText } from "@/i18n/types";
import type {
  AnalysisTemplate,
  ProjectCodebook,
  ProjectCodebookMap,
  TemplateField,
  TemplateFieldOption
} from "@/types/template";

export const emptyProjectCodebooks: ProjectCodebookMap = {};

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
    options: field.options?.map((option) => cloneOption(option))
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

function sanitizeLocalizedTextAgainstBase(input: unknown, base: LocalizedText): LocalizedText {
  if (!isRecord(input)) {
    return cloneLocalizedText(base);
  }

  return {
    en: typeof input.en === "string" ? input.en : base.en,
    "zh-CN": typeof input["zh-CN"] === "string" ? input["zh-CN"] : base["zh-CN"]
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

  const inputFields = Array.isArray(input.fields) ? input.fields : null;

  if (inputFields && inputFields.length === baseTemplate.fields.length) {
    nextTemplate.fields = baseTemplate.fields.map((baseField, fieldIndex) =>
      sanitizeFieldAgainstBase(inputFields[fieldIndex], baseField)
    );
  }

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
  templateId: string,
  customProjectCodebooks: ProjectCodebookMap
) {
  const sourceTemplate = getProjectTemplateById(templateId, customProjectCodebooks);

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
