"use client";

import { EmptyState } from "@/components/shared/empty-state";
import { analysisTemplates } from "@/features/templates/data/templates";
import { useWorkspace } from "@/features/coding/state/workspace-context";
import type { CodingFieldValue } from "@/types/coding";
import type { TemplateField } from "@/types/template";

function formatFieldValue(field: TemplateField, value: CodingFieldValue) {
  if (value === null || value === undefined || value === "") {
    return "Not coded yet";
  }

  if (field.type === "single-select" && typeof value === "string") {
    return field.options?.find((option) => option.value === value)?.label ?? value;
  }

  if (field.type === "multi-select" && Array.isArray(value)) {
    if (!value.length) {
      return "Not coded yet";
    }

    return value
      .map((item) => field.options?.find((option) => option.value === item)?.label ?? item)
      .join(", ");
  }

  return String(value);
}

export function CodingPreview() {
  const { state } = useWorkspace();

  if (!state.selectedTemplateId) {
    return (
      <EmptyState
        title="Choose a template to start coding"
        description="The coding workspace will render editable rows after a template is selected."
      />
    );
  }

  if (!state.selectedSampleId) {
    return (
      <EmptyState
        title="Select a sample to review coded values"
        description="Once a sample is selected, its current coding values will appear here in a simple live preview."
      />
    );
  }

  const template = analysisTemplates.find((item) => item.id === state.selectedTemplateId);
  const sample = state.samples.find((item) => item.id === state.selectedSampleId);

  if (!template || !sample) {
    return (
      <EmptyState
        title="Preview unavailable"
        description="The selected sample or template could not be loaded. Re-select them to continue."
      />
    );
  }

  const codingRow = state.codingRows.find(
    (row) => row.sampleId === sample.id && row.templateId === template.id
  );

  return (
    <div className="space-y-4 rounded-[1.5rem] border border-line bg-white p-6 shadow-soft">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold tracking-tight text-ink">Live coding preview</h3>
        <p className="text-sm leading-7 text-muted">
          Current values for the selected sample update as you edit the form.
        </p>
      </div>

      <div className="rounded-[1.25rem] border border-line bg-[#fffdf8] p-5">
        <p className="text-sm text-muted">Sample</p>
        <p className="mt-1 text-base font-semibold text-ink">{sample.title}</p>
        <p className="mt-4 text-sm text-muted">Template</p>
        <p className="mt-1 text-base font-semibold text-ink">{template.name}</p>
      </div>

      <div className="space-y-3">
        {template.fields.map((field) => {
          const rawValue = codingRow?.values[field.id];
          const displayValue = formatFieldValue(field, rawValue ?? null);

          return (
            <div key={field.id} className="rounded-[1.25rem] border border-line bg-[#fffdf8] p-4">
              <p className="text-sm font-medium text-muted">{field.label}</p>
              <p className="mt-2 text-base text-ink">{displayValue}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
