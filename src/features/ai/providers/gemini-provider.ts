import { GoogleGenAI } from "@google/genai";
import { buildProviderSuggestionPrompt } from "@/features/ai/providers/prompt";
import { buildSuggestionJsonSchema, normalizeProviderSuggestions } from "@/features/ai/validate-suggestions";
import type { ProviderSuggestionInput, ProviderSuggestionResult } from "@/features/ai/providers/types";

export async function getGeminiSuggestions(input: ProviderSuggestionInput): Promise<ProviderSuggestionResult> {
  const client = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
  });

  const response = await client.models.generateContent({
    model: process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash",
    contents: buildProviderSuggestionPrompt(input.sample, input.template, input.currentValues, input.locale),
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: buildSuggestionJsonSchema(input.template),
      temperature: 0.2,
      maxOutputTokens: 700,
      systemInstruction:
        "You are assisting with communication/media studies coding. Provide tentative, editable coding suggestions. Do not claim academic certainty."
    }
  });

  return normalizeProviderSuggestions(input.template, response.text || "");
}
