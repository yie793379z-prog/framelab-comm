import { generateSuggestions } from "@/features/ai/generate-suggestions";
import { normalizeProviderSuggestions } from "@/features/ai/validate-suggestions";
import type { ProviderSuggestionInput, ProviderSuggestionResult } from "@/features/ai/providers/types";

export async function getMockSuggestions(input: ProviderSuggestionInput): Promise<ProviderSuggestionResult> {
  return normalizeProviderSuggestions(
    input.template,
    await generateSuggestions(input)
  );
}
