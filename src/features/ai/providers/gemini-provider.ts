import { GoogleGenAI } from "@google/genai";
import { buildProviderSuggestionPrompt } from "@/features/ai/providers/prompt";
import { normalizeProviderSuggestions } from "@/features/ai/validate-suggestions";
import type { SuggestionErrorCode } from "@/features/ai/types";
import {
  SuggestionProviderError,
  type ProviderSuggestionInput,
  type ProviderSuggestionResult
} from "@/features/ai/providers/types";

function getGeminiModel() {
  return process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";
}

function getErrorString(value: unknown) {
  return typeof value === "string" ? value : undefined;
}

function getErrorNumber(value: unknown) {
  return typeof value === "number" ? value : undefined;
}

function classifyGeminiError(error: unknown): SuggestionErrorCode {
  if (!error || typeof error !== "object") {
    return "unknown_error";
  }

  const candidate = error as Record<string, unknown>;
  const status = getErrorNumber(candidate.status);
  const code = getErrorString(candidate.code)?.toLowerCase();
  const message = getErrorString(candidate.message)?.toLowerCase() ?? "";

  if (status === 401 || status === 403 || code === "unauthenticated" || message.includes("api key")) {
    return "invalid_api_key";
  }

  if (status === 429 || code === "resource_exhausted" || message.includes("rate limit") || message.includes("quota")) {
    return "rate_limited";
  }

  if (
    status === 404 ||
    code === "not_found" ||
    message.includes("model not found") ||
    message.includes("unsupported model") ||
    message.includes("unknown model")
  ) {
    return "model_not_found";
  }

  if (status === 400 || code === "invalid_argument" || message.includes("invalid")) {
    return "provider_config_error";
  }

  if (status && status >= 500) {
    return "provider_request_failed";
  }

  return "unknown_error";
}

function logGeminiProviderError(error: unknown, model: string) {
  if (process.env.NODE_ENV === "production") {
    return;
  }

  const candidate = error && typeof error === "object" ? (error as Record<string, unknown>) : null;

  console.error("[FrameLab Gemini Error]", {
    name: getErrorString(candidate?.name) ?? "UnknownError",
    message: getErrorString(candidate?.message) ?? "Unknown Gemini provider error.",
    status: getErrorNumber(candidate?.status) ?? null,
    code: getErrorString(candidate?.code) ?? null,
    model,
    keyExists: Boolean(process.env.GEMINI_API_KEY?.trim())
  });
}

export async function getGeminiSuggestions(input: ProviderSuggestionInput): Promise<ProviderSuggestionResult> {
  const model = getGeminiModel();
  const client = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
  });

  try {
    const response = await client.models.generateContent({
      model,
      contents: buildProviderSuggestionPrompt(input.sample, input.template, input.currentValues, input.locale),
      config: {
        responseMimeType: "application/json",
        temperature: 0.2
      }
    });

    return normalizeProviderSuggestions(input.template, response.text || "");
  } catch (error) {
    logGeminiProviderError(error, model);
    throw new SuggestionProviderError("Gemini suggestion request failed.", classifyGeminiError(error));
  }
}
