import { NextResponse } from "next/server";
import { getGeminiSuggestions } from "@/features/ai/providers/gemini-provider";
import { getMockSuggestions } from "@/features/ai/providers/mock-provider";
import { getOpenAiSuggestions } from "@/features/ai/providers/openai-provider";
import { analysisTemplates } from "@/features/templates/data/templates";
import { getMessages } from "@/i18n/utils";
import type { Locale } from "@/i18n/types";
import type {
  SuggestionErrorCode,
  SuggestionProvider,
  SuggestionRequestPayload,
  SuggestionResponse,
  SuggestionStatus
} from "@/features/ai/types";
import type { CodingFieldValue } from "@/types/coding";
import type { SampleRecord } from "@/types/sample";
import type { ProviderSuggestionResult } from "@/features/ai/providers/types";

function parseLocale(value: unknown): Locale {
  return value === "zh-CN" ? "zh-CN" : "en";
}

function getConfiguredProvider(): SuggestionProvider {
  const explicitProvider = process.env.AI_PROVIDER?.trim();

  if (explicitProvider === "mock" || explicitProvider === "openai" || explicitProvider === "gemini") {
    return explicitProvider;
  }

  if (process.env.AI_SUGGESTION_MODE === "real") {
    return "openai";
  }

  return "mock";
}

function getProviderModel(provider: SuggestionProvider) {
  if (provider === "openai") {
    return process.env.OPENAI_MODEL?.trim() || "gpt-4.1-mini";
  }

  if (provider === "gemini") {
    return process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";
  }

  return "mock-local";
}

function hasProviderKey(provider: SuggestionProvider) {
  if (provider === "openai") {
    return Boolean(process.env.OPENAI_API_KEY?.trim());
  }

  if (provider === "gemini") {
    return Boolean(process.env.GEMINI_API_KEY?.trim());
  }

  return true;
}

function isEmptyCodingValue(value: CodingFieldValue | undefined) {
  return value === null || value === undefined || value === "" || (Array.isArray(value) && value.length === 0);
}

function getProviderStatus(locale: Locale): SuggestionStatus {
  const messages = getMessages(locale);
  const configuredProvider = getConfiguredProvider();

  if (configuredProvider === "mock") {
    return {
      mode: "mock",
      provider: "mock",
      fallbackUsed: false,
      message: messages.codingForm.mockModeMessage
    };
  }

  if (hasProviderKey(configuredProvider)) {
    return {
      mode: "real",
      provider: configuredProvider,
      fallbackUsed: false,
      message:
        configuredProvider === "gemini"
          ? messages.codingForm.geminiModeMessage
          : messages.codingForm.openAiModeMessage
    };
  }

  return {
    mode: "mock",
    provider: "mock",
    fallbackUsed: true,
    message:
      configuredProvider === "gemini"
        ? messages.codingForm.geminiMissingKeyMessage
        : messages.codingForm.openAiMissingKeyMessage
  };
}

function logSuggestionDebug(metadata: {
  requestedProvider: SuggestionProvider;
  provider: SuggestionProvider;
  model: string;
  keyExists: boolean;
  templateId: string;
  requestedFieldKeys: string[];
  acceptedKeys: string[];
  validationDroppedKeys: string[];
  fallbackReason: SuggestionErrorCode | "mock_mode" | null;
  rawProviderReturnedJson: boolean;
}) {
  if (process.env.NODE_ENV === "production") {
    return;
  }

  console.info("[FrameLab AI Debug]", metadata);
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

function getEmptyFieldIds(templateId: string, currentValues: Record<string, CodingFieldValue>) {
  const template = analysisTemplates.find((item) => item.id === templateId);

  if (!template) {
    return [];
  }

  return template.fields.filter((field) => isEmptyCodingValue(currentValues[field.id])).map((field) => field.id);
}

async function buildMockResponse(
  payload: Extract<ReturnType<typeof parseRequestBody>, { success: true }>,
  statusOverride?: SuggestionStatus,
  debugOverride?: Partial<SuggestionResponse>
) {
  const mockResult = await getMockSuggestions({
    sample: payload.sample,
    template: payload.template,
    currentValues: payload.currentValues,
    locale: payload.locale
  });

  const status = statusOverride ?? getProviderStatus(payload.locale);
  const response = {
    ...status,
    suggestions: mockResult.suggestions,
    requestedProvider: debugOverride?.requestedProvider ?? "mock",
    model: debugOverride?.model ?? "mock-local",
    errorCode: debugOverride?.errorCode ?? null,
    validationDroppedKeys: debugOverride?.validationDroppedKeys ?? [],
    acceptedKeys: debugOverride?.acceptedKeys ?? Object.keys(mockResult.suggestions),
    rawProviderReturnedJson: debugOverride?.rawProviderReturnedJson ?? false
  } satisfies SuggestionResponse;

  logSuggestionDebug({
    requestedProvider: response.requestedProvider,
    provider: response.provider,
    model: response.model,
    keyExists: hasProviderKey(response.requestedProvider),
    templateId: payload.template.id,
    requestedFieldKeys: payload.template.fields.map((field) => field.id),
    acceptedKeys: response.acceptedKeys,
    validationDroppedKeys: response.validationDroppedKeys,
    fallbackReason: response.errorCode,
    rawProviderReturnedJson: response.rawProviderReturnedJson
  });

  return NextResponse.json(response);
}

export async function GET(request: Request) {
  const locale = parseLocale(new URL(request.url).searchParams.get("locale"));
  return NextResponse.json(getProviderStatus(locale));
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

  const emptyFieldIds = getEmptyFieldIds(parsedRequest.template.id, parsedRequest.currentValues);
  const requestedProvider = getConfiguredProvider();
  const requestedModel = getProviderModel(requestedProvider);

  if (!emptyFieldIds.length) {
    return NextResponse.json({
      suggestions: {},
      requestedProvider,
      model: requestedModel,
      errorCode: null,
      validationDroppedKeys: [],
      acceptedKeys: [],
      rawProviderReturnedJson: false,
      ...getProviderStatus(locale)
    } satisfies SuggestionResponse);
  }

  const status = getProviderStatus(locale);

  if (status.provider === "mock") {
    return buildMockResponse(parsedRequest, status, {
      requestedProvider,
      model: requestedModel,
      errorCode: requestedProvider === "mock" ? null : "missing_key",
      validationDroppedKeys: [],
      acceptedKeys: [],
      rawProviderReturnedJson: false
    });
  }

  try {
    const providerResult =
      status.provider === "gemini"
        ? await getGeminiSuggestions({
            sample: parsedRequest.sample,
            template: parsedRequest.template,
            currentValues: parsedRequest.currentValues,
            locale: parsedRequest.locale
          })
        : await getOpenAiSuggestions({
            sample: parsedRequest.sample,
            template: parsedRequest.template,
            currentValues: parsedRequest.currentValues,
            locale: parsedRequest.locale
          });

    if (!providerResult.acceptedKeys.length) {
      return buildMockResponse(parsedRequest, {
        mode: "mock",
        provider: "mock",
        fallbackUsed: true,
        message:
          status.provider === "gemini"
            ? messages.codingForm.geminiNoValidFieldsFallbackMessage
            : messages.codingForm.openAiNoValidFieldsFallbackMessage
      }, {
        requestedProvider,
        model: requestedModel,
        errorCode: providerResult.errorCode ?? "no_valid_fields",
        validationDroppedKeys: providerResult.validationDroppedKeys,
        acceptedKeys: providerResult.acceptedKeys,
        rawProviderReturnedJson: providerResult.rawProviderReturnedJson
      });
    }

    const response = {
      suggestions: providerResult.suggestions,
      mode: "real",
      provider: status.provider,
      requestedProvider,
      model: requestedModel,
      fallbackUsed: false,
      message:
        providerResult.validationDroppedKeys.length > 0
          ? status.provider === "gemini"
            ? messages.codingForm.geminiPartialMessage
            : messages.codingForm.openAiPartialMessage
          : status.provider === "gemini"
            ? messages.codingForm.geminiAppliedMessage
            : messages.codingForm.openAiAppliedMessage,
      errorCode: null,
      validationDroppedKeys: providerResult.validationDroppedKeys,
      acceptedKeys: providerResult.acceptedKeys,
      rawProviderReturnedJson: providerResult.rawProviderReturnedJson
    } satisfies SuggestionResponse;

    logSuggestionDebug({
      requestedProvider,
      provider: response.provider,
      model: requestedModel,
      keyExists: hasProviderKey(requestedProvider),
      templateId: parsedRequest.template.id,
      requestedFieldKeys: parsedRequest.template.fields.map((field) => field.id),
      acceptedKeys: response.acceptedKeys,
      validationDroppedKeys: response.validationDroppedKeys,
      fallbackReason: null,
      rawProviderReturnedJson: response.rawProviderReturnedJson
    });

    return NextResponse.json(response);
  } catch {
    return buildMockResponse(parsedRequest, {
      mode: "mock",
      provider: "mock",
      fallbackUsed: true,
      message:
        status.provider === "gemini"
          ? messages.codingForm.geminiErrorFallbackMessage
          : messages.codingForm.openAiErrorFallbackMessage
    }, {
      requestedProvider,
      model: requestedModel,
      errorCode: "provider_request_failed",
      validationDroppedKeys: [],
      acceptedKeys: [],
      rawProviderReturnedJson: false
    });
  }
}
