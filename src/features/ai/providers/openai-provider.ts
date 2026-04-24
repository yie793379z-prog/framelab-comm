import OpenAI from "openai";
import { buildProviderSuggestionPrompt } from "@/features/ai/providers/prompt";
import { buildSuggestionJsonSchema, normalizeProviderSuggestions } from "@/features/ai/validate-suggestions";
import type { ProviderSuggestionInput, ProviderSuggestionResult } from "@/features/ai/providers/types";

export async function getOpenAiSuggestions(input: ProviderSuggestionInput): Promise<ProviderSuggestionResult> {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL?.trim() || "gpt-4.1-mini",
    instructions:
      "You are assisting with communication/media studies coding. Provide tentative, editable coding suggestions. Do not claim academic certainty.",
    input: buildProviderSuggestionPrompt(input.sample, input.template, input.currentValues, input.locale),
    temperature: 0.2,
    max_output_tokens: 700,
    text: {
      verbosity: "low",
      format: {
        type: "json_schema",
        name: "coding_suggestions",
        strict: true,
        description: "Tentative coding suggestions for empty template fields only.",
        schema: buildSuggestionJsonSchema(input.template)
      }
    }
  });

  return normalizeProviderSuggestions(input.template, response.output_text || "");
}
