import type { GenerateSuggestionsInput, SuggestedCodingValues, SuggestionErrorCode } from "@/features/ai/types";

export type ProviderSuggestionInput = GenerateSuggestionsInput;

export interface ProviderSuggestionResult {
  suggestions: SuggestedCodingValues;
  acceptedKeys: string[];
  validationDroppedKeys: string[];
  rawProviderReturnedJson: boolean;
  errorCode: SuggestionErrorCode | null;
}
