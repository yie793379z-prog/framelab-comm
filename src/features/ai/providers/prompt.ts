import { getLocalizedText } from "@/i18n/utils";
import type { Locale } from "@/i18n/types";
import type { CodingFieldValue } from "@/types/coding";
import type { SampleRecord } from "@/types/sample";
import type { AnalysisTemplate } from "@/types/template";

export function buildProviderSuggestionPrompt(
  sample: SampleRecord,
  template: AnalysisTemplate,
  currentValues: Record<string, CodingFieldValue>,
  locale: Locale
) {
  const fieldKeys = template.fields.map((field) => field.id);
  const localizedTemplate = {
    templateId: template.id,
    templateName: getLocalizedText(template.name, locale),
    templateDescription: getLocalizedText(template.shortDescription, locale),
    templateUseCase: getLocalizedText(template.researchUseCase, locale),
    allowedFieldKeys: fieldKeys,
    fields: template.fields.map((field) => ({
      key: field.id,
      label: getLocalizedText(field.label, locale),
      helpText: getLocalizedText(field.description, locale),
      fieldType: field.type,
      allowedOptionValues: field.options?.map((option) => option.value) ?? [],
      allowedOptions: field.options?.map((option) => ({
        value: option.value,
        label: getLocalizedText(option.label, locale)
      }))
    }))
  };

  return [
    locale === "zh-CN"
      ? "请根据下面的文本和编码模板，给出谨慎、可编辑的初步编码建议。"
      : "Based on the sample and coding template below, provide cautious, editable first-pass coding suggestions.",
    locale === "zh-CN"
      ? "只为当前为空的字段提供建议；已填写字段只作为上下文参考。"
      : "Only suggest values for fields that are currently empty; treat existing values as context only.",
    locale === "zh-CN"
      ? "不要声称学术确定性，不要把建议当作最终研究判断。"
      : "Do not claim academic certainty or present the suggestions as final research judgments.",
    locale === "zh-CN"
      ? '输出必须是 JSON，并且只能使用如下结构：{"suggestions": {"field-key": value}}。'
      : 'Output must be JSON and must use this exact shape: {"suggestions": {"field-key": value}}.',
    locale === "zh-CN"
      ? "对于 single-select 和 multi-select 字段，只能返回内部 option value，绝不能返回显示标签。"
      : "For single-select and multi-select fields, return only internal option values, never display labels.",
    locale === "zh-CN"
      ? "不要返回模板中不存在的字段 key。"
      : "Do not return any field keys outside the active template.",
    "",
    `Locale: ${locale}`,
    "",
    "Template:",
    JSON.stringify(localizedTemplate, null, 2),
    "",
    "Current values:",
    JSON.stringify(currentValues, null, 2),
    "",
    "Sample:",
    JSON.stringify(
      {
        title: sample.title,
        source: sample.source ?? null,
        text: sample.text
      },
      null,
      2
    ),
    "",
    locale === "zh-CN"
      ? `再次提醒：只允许这些字段 key：${fieldKeys.join(", ")}`
      : `Reminder: only these field keys are allowed: ${fieldKeys.join(", ")}`
  ].join("\n");
}
