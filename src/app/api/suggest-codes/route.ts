import OpenAI from "openai";
import { NextResponse } from "next/server";
import { generateSuggestions } from "@/features/ai/generate-suggestions";
import { buildSuggestionJsonSchema, sanitizeSuggestedValues } from "@/features/ai/validate-suggestions";
import { analysisTemplates } from "@/features/templates/data/templates";
import { getMessages, getLocalizedText } from "@/i18n/utils";
import type { Locale } from "@/i18n/types";
import type { CodingFieldValue } from "@/types/coding";
import type { SampleRecord } from "@/types/sample";
import type { AnalysisTemplate } from "@/types/template";
import type { SuggestionRequestPayload, SuggestionResponse, SuggestionStatus } from "@/features/ai/types";

function parseLocale(value: unknown): Locale {
  return value === "zh-CN" ? "zh-CN" : "en";
}

function parseSuggestionMode() {
  return process.env.AI_SUGGESTION_MODE === "real" ? "real" : "mock";
}

function hasOpenAiKey() {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

function isEmptyCodingValue(value: CodingFieldValue | undefined) {
  return value === null || value === undefined || value === "" || (Array.isArray(value) && value.length === 0);
}

function getModeStatus(locale: Locale): SuggestionStatus {
  const messages = getMessages(locale);
  const configuredMode = parseSuggestionMode();

  if (configuredMode === "mock") {
    return {
      mode: "mock",
      fallbackUsed: false,
      message: messages.codingForm.mockModeMessage
    };
  }

  if (hasOpenAiKey()) {
    return {
      mode: "real",
      fallbackUsed: false,
      message: messages.codingForm.realModeMessage
    };
  }

  return {
    mode: "mock",
    fallbackUsed: true,
    message: messages.codingForm.realModeMissingKeyMessage
  };
}

function isSampleRecord(value: unknown): value is SampleRecord {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return typeof candidate.id === "string" && typeof candidate.title === "string" && typeof candidate.text === "string";
}

function isCodingValueMap(value: unknown): value is Record<string, CodingFieldValue> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function parseRequestBody(body: unknown) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { success: false as const };
  }

  const candidate = body as Partial<SuggestionRequestPayload>;
  const locale = parseLocale(candidate.locale);

  if (!isSampleRecord(candidate.sample) || typeof candidate.templateId !== "string" || !isCodingValueMap(candidate.currentValues)) {
    return { success: false as const, locale };
  }

  const template = analysisTemplates.find((item) => item.id === candidate.templateId);

  if (!template) {
    return { success: false as const, locale };
  }

  return {
    success: true as const,
    locale,
    sample: candidate.sample,
    template,
    currentValues: candidate.currentValues
  };
}

function getEmptyFieldIds(template: AnalysisTemplate, currentValues: Record<string, CodingFieldValue>) {
  return template.fields.filter((field) => isEmptyCodingValue(currentValues[field.id])).map((field) => field.id);
}

function buildRealSuggestionPrompt(
  sample: SampleRecord,
  template: AnalysisTemplate,
  currentValues: Record<string, CodingFieldValue>,
  locale: Locale
) {
  const localizedTemplate = {
    id: template.id,
    name: getLocalizedText(template.name, locale),
    shortDescription: getLocalizedText(template.shortDescription, locale),
    researchUseCase: getLocalizedText(template.researchUseCase, locale),
    fields: template.fields.map((field) => ({
      id: field.id,
      label: getLocalizedText(field.label, locale),
      description: getLocalizedText(field.description, locale),
      type: field.type,
      options: field.options?.map((option) => ({
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
      ? "如果文本不足以支持明确判断，请保持建议简短、保守，不要声称学术确定性。"
      : "If the text does not support a strong judgment, keep suggestions brief and conservative and do not claim academic certainty.",
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
    )
  ].join("\n");
}

async function buildMockResponse(
  sample: SampleRecord,
  template: AnalysisTemplate,
  currentValues: Record<string, CodingFieldValue>,
  locale: Locale,
  statusOverride?: SuggestionStatus
) {
  const suggestions = sanitizeSuggestedValues(
    template,
    await generateSuggestions({
      sample,
      template,
      currentValues,
      locale
    })
  );

  const status = statusOverride ?? getModeStatus(locale);

  return NextResponse.json({
    suggestions,
    ...status
  } satisfies SuggestionResponse);
}

async function generateRealSuggestions(
  sample: SampleRecord,
  template: AnalysisTemplate,
  currentValues: Record<string, CodingFieldValue>,
  locale: Locale
) {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL?.trim() || "gpt-4.1-mini",
    instructions:
      "You are assisting with communication/media studies coding. Provide tentative, editable coding suggestions. Do not claim academic certainty.",
    input: buildRealSuggestionPrompt(sample, template, currentValues, locale),
    temperature: 0.2,
    max_output_tokens: 700,
    text: {
      verbosity: "low",
      format: {
        type: "json_schema",
        name: "coding_suggestions",
        strict: true,
        description: "Tentative coding suggestions for empty template fields only.",
        schema: buildSuggestionJsonSchema(template)
      }
    }
  });

  const parsed = JSON.parse(response.output_text || "{}") as unknown;
  return sanitizeSuggestedValues(template, parsed);
}

export async function GET(request: Request) {
  const locale = parseLocale(new URL(request.url).searchParams.get("locale"));
  return NextResponse.json(getModeStatus(locale));
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsedRequest = parseRequestBody(body);
  const locale = parsedRequest.locale ?? "en";
  const messages = getMessages(locale);

  if (!parsedRequest.success) {
    return NextResponse.json({ error: messages.codingForm.invalidRequestMessage }, { status: 400 });
  }

  const { sample, template, currentValues } = parsedRequest;
  const emptyFieldIds = getEmptyFieldIds(template, currentValues);

  if (!emptyFieldIds.length) {
    return NextResponse.json({
      suggestions: {},
      ...getModeStatus(locale)
    } satisfies SuggestionResponse);
  }

  const modeStatus = getModeStatus(locale);

  if (modeStatus.mode === "mock") {
    return buildMockResponse(sample, template, currentValues, locale, modeStatus);
  }

  try {
    const suggestions = await generateRealSuggestions(sample, template, currentValues, locale);

    if (!Object.keys(suggestions).length) {
      return buildMockResponse(sample, template, currentValues, locale, {
        mode: "mock",
        fallbackUsed: true,
        message: messages.codingForm.realModeMalformedFallbackMessage
      });
    }

    return NextResponse.json({
      suggestions,
      mode: "real",
      fallbackUsed: false,
      message: messages.codingForm.realModeMessage
    } satisfies SuggestionResponse);
  } catch {
    return buildMockResponse(sample, template, currentValues, locale, {
      mode: "mock",
      fallbackUsed: true,
      message: messages.codingForm.realModeErrorFallbackMessage
    });
  }
}
