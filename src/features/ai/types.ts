import type { CodingFieldValue } from "@/types/coding";
import type { SampleRecord } from "@/types/sample";
import type { AnalysisTemplate } from "@/types/template";

export interface GenerateSuggestionsInput {
  sample: SampleRecord;
  template: AnalysisTemplate;
  currentValues: Record<string, CodingFieldValue>;
}

export type SuggestedCodingValues = Record<string, CodingFieldValue>;
