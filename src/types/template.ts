import type { LocalizedText } from "@/i18n/types";

export type TemplateFieldType = "single-select" | "multi-select" | "text" | "number" | "boolean";

export interface TemplateFieldOption {
  value: string;
  label: LocalizedText;
  description?: LocalizedText;
}

export interface TemplateField {
  id: string;
  label: LocalizedText;
  description: LocalizedText;
  type: TemplateFieldType;
  options?: TemplateFieldOption[];
  placeholder?: LocalizedText;
}

export interface AnalysisTemplate {
  id: string;
  name: LocalizedText;
  shortDescription: LocalizedText;
  researchUseCase: LocalizedText;
  fields: TemplateField[];
}
