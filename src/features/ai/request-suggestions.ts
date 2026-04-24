"use client";

import { generateSuggestions } from "@/features/ai/generate-suggestions";
import { getMessages } from "@/i18n/utils";
import type {
  GenerateSuggestionsInput,
  SuggestionRequestPayload,
  SuggestionProvider,
  SuggestionResponse,
  SuggestionStatus
} from "@/features/ai/types";

function isSuggestionStatus(value: unknown): value is SuggestionStatus {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    (candidate.mode === "mock" || candidate.mode === "real") &&
    (candidate.provider === "mock" || candidate.provider === "openai" || candidate.provider === "gemini") &&
    typeof candidate.fallbackUsed === "boolean" &&
    typeof candidate.message === "string"
  );
}

function isSuggestionResponse(value: unknown): value is SuggestionResponse {
  if (!isSuggestionStatus(value)) {
    return false;
  }

  const candidate = value as unknown as Record<string, unknown>;
  return (
    Boolean(candidate.suggestions) &&
    typeof candidate.suggestions === "object" &&
    !Array.isArray(candidate.suggestions) &&
    (candidate.requestedProvider === "mock" ||
      candidate.requestedProvider === "openai" ||
      candidate.requestedProvider === "gemini") &&
    typeof candidate.model === "string" &&
    Array.isArray(candidate.validationDroppedKeys) &&
    Array.isArray(candidate.acceptedKeys) &&
    typeof candidate.rawProviderReturnedJson === "boolean"
  );
}

export async function fetchSuggestionStatus(locale: GenerateSuggestionsInput["locale"]) {
  const response = await fetch(`/api/suggest-codes?locale=${encodeURIComponent(locale)}`, {
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("Unable to load suggestion mode.");
  }

  const data = (await response.json()) as unknown;

  if (!isSuggestionStatus(data)) {
    throw new Error("Unexpected suggestion status payload.");
  }

  return data;
}

export async function requestSuggestions(input: GenerateSuggestionsInput): Promise<SuggestionResponse> {
  const payload: SuggestionRequestPayload = {
    sample: input.sample,
    templateId: input.template.id,
    currentValues: input.currentValues,
    locale: input.locale
  };
  const fallbackRequestedProvider = "mock" as SuggestionProvider;

  try {
    const response = await fetch("/api/suggest-codes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error("Suggestion request failed.");
    }

    const data = (await response.json()) as unknown;

    if (!isSuggestionResponse(data)) {
      throw new Error("Unexpected suggestion response.");
    }

    return data;
  } catch {
    const messages = getMessages(input.locale);
    const suggestions = await generateSuggestions(input);

    return {
      suggestions,
      mode: "mock",
      provider: "mock",
      requestedProvider: fallbackRequestedProvider,
      model: "mock-local",
      fallbackUsed: true,
      message: messages.codingForm.localFallbackMessage,
      errorCode: "provider_request_failed",
      validationDroppedKeys: [],
      acceptedKeys: Object.keys(suggestions),
      rawProviderReturnedJson: false
    };
  }
}
