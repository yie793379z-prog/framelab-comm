export type TemplateFieldType = "single-select" | "multi-select" | "text" | "number" | "boolean";

export interface TemplateFieldOption {
  value: string;
  label: string;
  description?: string;
}

export interface TemplateField {
  id: string;
  label: string;
  description: string;
  type: TemplateFieldType;
  options?: TemplateFieldOption[];
  placeholder?: string;
}

export interface AnalysisTemplate {
  id: string;
  name: string;
  shortDescription: string;
  researchUseCase: string;
  fields: TemplateField[];
}
