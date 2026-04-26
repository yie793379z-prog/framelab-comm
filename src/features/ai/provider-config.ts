import { getMessages } from "@/i18n/utils";
import type { Locale } from "@/i18n/types";
import type { SuggestionProvider, SuggestionStatus } from "@/features/ai/types";

export function getConfiguredProvider(): SuggestionProvider {
  const explicitProvider = process.env.AI_PROVIDER?.trim();

  if (explicitProvider === "mock" || explicitProvider === "openai" || explicitProvider === "gemini") {
    return explicitProvider;
  }

  if (process.env.AI_SUGGESTION_MODE === "real") {
    return "openai";
  }

  return "mock";
}

export function getProviderModel(provider: SuggestionProvider) {
  if (provider === "openai") {
    return process.env.OPENAI_MODEL?.trim() || "gpt-4.1-mini";
  }

  if (provider === "gemini") {
    return process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash-lite";
  }

  return "mock-local";
}

export function hasProviderKey(provider: SuggestionProvider) {
  if (provider === "openai") {
    return Boolean(process.env.OPENAI_API_KEY?.trim());
  }

  if (provider === "gemini") {
    return Boolean(process.env.GEMINI_API_KEY?.trim());
  }

  return true;
}

export function getProviderStatus(locale: Locale): SuggestionStatus {
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
