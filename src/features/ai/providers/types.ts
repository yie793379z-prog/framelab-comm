import type { GenerateSuggestionsInput, SuggestedCodingValues, SuggestionErrorCode } from "@/features/ai/types";

export type ProviderSuggestionInput = GenerateSuggestionsInput;

export class SuggestionProviderError extends Error {
  readonly errorCode: SuggestionErrorCode;

  constructor(message: string, errorCode: SuggestionErrorCode) {
    super(message);
    this.name = "SuggestionProviderError";
    this.errorCode = errorCode;
  }
}

export function isSuggestionProviderError(error: unknown): error is SuggestionProviderError {
  return error instanceof SuggestionProviderError;
}

export interface ProviderSuggestionResult {
  suggestions: SuggestedCodingValues;
  acceptedKeys: string[];
  validationDroppedKeys: string[];
  rawProviderReturnedJson: boolean;
  errorCode: SuggestionErrorCode | null;
}
