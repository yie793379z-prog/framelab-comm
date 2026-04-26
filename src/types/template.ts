import type { LocalizedText } from "@/i18n/types";

export type TemplateFieldType = "single-select" | "multi-select" | "text" | "number" | "boolean";
export type CodebookDiscoveryGoal =
  | "problem_definitions"
  | "suggested_remedies"
  | "frames"
  | "actors"
  | "discourse_themes"
  | "custom";

export interface GeneratedTemplateFieldMetadata {
  source: "ai-codebook-builder";
  discoveryGoal: CodebookDiscoveryGoal;
}

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
  generated?: GeneratedTemplateFieldMetadata;
}

export interface AnalysisTemplate {
  id: string;
  name: LocalizedText;
  shortDescription: LocalizedText;
  researchUseCase: LocalizedText;
  fields: TemplateField[];
}

export type ProjectCodebook = AnalysisTemplate;

export type ProjectCodebookMap = Record<string, ProjectCodebook>;
