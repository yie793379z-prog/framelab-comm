import { appDictionary } from "@/i18n/dictionary";
import type { Locale, LocalizedText } from "@/i18n/types";
import type { AnalysisTemplate, TemplateField, TemplateFieldOption } from "@/types/template";

export function getLocalizedText(text: LocalizedText | undefined, locale: Locale) {
  if (!text) {
    return "";
  }

  const localizedValue = text[locale]?.trim();

  if (localizedValue) {
    return text[locale];
  }

  const fallbackLocale: Locale = locale === "zh-CN" ? "en" : "zh-CN";
  return text[fallbackLocale] ?? "";
}

export function formatMessage(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce((message, [key, value]) => {
    return message.replaceAll(`{${key}}`, String(value));
  }, template);
}

export function getCountWord(
  locale: Locale,
  count: number,
  singular: string,
  plural: string,
  localizedWord?: string
) {
  if (locale === "zh-CN") {
    return localizedWord ?? singular;
  }

  return count === 1 ? singular : plural;
}

export function localizeTemplateOption(option: TemplateFieldOption, locale: Locale) {
  return {
    ...option,
    label: getLocalizedText(option.label, locale),
    description: option.description ? getLocalizedText(option.description, locale) : undefined
  };
}

export function localizeTemplateField(field: TemplateField, locale: Locale) {
  return {
    ...field,
    label: getLocalizedText(field.label, locale),
    description: getLocalizedText(field.description, locale),
    placeholder: field.placeholder ? getLocalizedText(field.placeholder, locale) : undefined,
    options: field.options?.map((option) => localizeTemplateOption(option, locale))
  };
}

export function localizeTemplate(template: AnalysisTemplate, locale: Locale) {
  return {
    ...template,
    name: getLocalizedText(template.name, locale),
    shortDescription: getLocalizedText(template.shortDescription, locale),
    researchUseCase: getLocalizedText(template.researchUseCase, locale),
    fields: template.fields.map((field) => localizeTemplateField(field, locale))
  };
}

export function getMessages(locale: Locale) {
  return appDictionary[locale];
}

export function formatLocaleDate(value: Date, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "zh-CN" ? "zh-CN" : "en", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(value);
}
