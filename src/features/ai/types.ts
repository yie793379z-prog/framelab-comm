import type { Locale } from "@/i18n/types";
import type { CodingFieldValue } from "@/types/coding";
import type { SampleRecord } from "@/types/sample";
import type { AnalysisTemplate } from "@/types/template";

export type SuggestionMode = "mock" | "real";
export type SuggestionProvider = "mock" | "openai" | "gemini";
export type SuggestionErrorCode =
  | "missing_key"
  | "provider_request_failed"
  | "parse_failed"
  | "no_valid_fields"
  | "invalid_request";

export interface GenerateSuggestionsInput {
  sample: SampleRecord;
  template: AnalysisTemplate;
  currentValues: Record<string, CodingFieldValue>;
  locale: Locale;
}

export type SuggestedCodingValues = Record<string, CodingFieldValue>;

export interface SuggestionStatus {
  mode: SuggestionMode;
  provider: SuggestionProvider;
  fallbackUsed: boolean;
  message: string;
}

export interface SuggestionRequestPayload {
  sample: SampleRecord;
  templateId: string;
  currentValues: Record<string, CodingFieldValue>;
  locale: Locale;
}

export interface SuggestionResponse extends SuggestionStatus {
  suggestions: SuggestedCodingValues;
  requestedProvider: SuggestionProvider;
  model: string;
  errorCode: SuggestionErrorCode | null;
  validationDroppedKeys: string[];
  acceptedKeys: string[];
  rawProviderReturnedJson: boolean;
}
