"use client";

import { useState } from "react";
import { EmptyState } from "@/components/shared/empty-state";
import { generateSuggestions } from "@/features/ai/generate-suggestions";
import { useWorkspace } from "@/features/coding/state/workspace-context";
import { analysisTemplates } from "@/features/templates/data/templates";
import type { CodingFieldValue } from "@/types/coding";
import type { TemplateField } from "@/types/template";

type FieldInputProps = {
  field: TemplateField;
  value: CodingFieldValue;
  onChange: (value: CodingFieldValue) => void;
};

function isEmptyCodingValue(value: CodingFieldValue | undefined) {
  return value === null || value === undefined || value === "" || (Array.isArray(value) && value.length === 0);
}

function FieldInput({ field, value, onChange }: FieldInputProps) {
  if (field.type === "text") {
    return (
      <textarea
        value={typeof value === "string" ? value : ""}
        onChange={(event) => onChange(event.target.value)}
        placeholder={field.placeholder}
        className="min-h-28 w-full rounded-[1rem] border border-line bg-[#fffdf8] px-4 py-3 text-sm text-ink outline-none focus:border-ink/40"
      />
    );
  }

  if (field.type === "number") {
    return (
      <input
        type="number"
        value={typeof value === "number" ? value : ""}
        onChange={(event) => onChange(event.target.value === "" ? null : Number(event.target.value))}
        placeholder={field.placeholder}
        className="w-full rounded-[1rem] border border-line bg-[#fffdf8] px-4 py-3 text-sm text-ink outline-none focus:border-ink/40"
      />
    );
  }

  if (field.type === "boolean") {
    const currentValue = typeof value === "boolean" ? value : null;

    return (
      <div className="flex flex-wrap gap-3">
        {[
          { label: "Yes", value: true },
          { label: "No", value: false }
        ].map((option) => (
          <button
            key={option.label}
            type="button"
            onClick={() => onChange(option.value)}
            className={`rounded-full border px-4 py-2 text-sm font-medium ${
              currentValue === option.value
                ? "border-ink bg-ink text-white"
                : "border-line bg-white text-ink hover:border-ink/40"
            }`}
          >
            {option.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onChange(null)}
          className="rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-ink hover:border-ink/40"
        >
          Clear
        </button>
      </div>
    );
  }

  if (field.type === "single-select") {
    return (
      <select
        value={typeof value === "string" ? value : ""}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-[1rem] border border-line bg-[#fffdf8] px-4 py-3 text-sm text-ink outline-none focus:border-ink/40"
      >
        <option value="">Select an option</option>
        {field.options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === "multi-select") {
    const currentValue = Array.isArray(value) ? value : [];

    return (
      <div className="space-y-3">
        {field.options?.map((option) => {
          const isChecked = currentValue.includes(option.value);

          return (
            <label
              key={option.value}
              className="flex items-start gap-3 rounded-[1rem] border border-line bg-[#fffdf8] px-4 py-3 text-sm text-ink"
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() =>
                  onChange(
                    isChecked
                      ? currentValue.filter((item) => item !== option.value)
                      : [...currentValue, option.value]
                  )
                }
                className="mt-1 h-4 w-4 rounded border-line text-ink focus:ring-ink"
              />
              <span>{option.label}</span>
            </label>
          );
        })}
      </div>
    );
  }

  return null;
}

export function CodingForm() {
  const { state, dispatch } = useWorkspace();
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [suggestionMessage, setSuggestionMessage] = useState<string | null>(null);

  if (!state.selectedTemplateId) {
    return (
      <EmptyState
        title="Choose a template first"
        description="The coding form is generated from the active template, so select a template before editing any sample."
      />
    );
  }

  if (!state.selectedSampleId) {
    return (
      <EmptyState
        title="Choose a sample first"
        description="Load and select a sample to open the coding form for that text item."
      />
    );
  }

  const template = analysisTemplates.find((item) => item.id === state.selectedTemplateId);
  const sample = state.samples.find((item) => item.id === state.selectedSampleId);

  if (!template || !sample) {
    return (
      <EmptyState
        title="Coding form unavailable"
        description="The current sample or template could not be loaded. Re-select them to continue."
      />
    );
  }

  const codingRow = state.codingRows.find(
    (row) => row.sampleId === sample.id && row.templateId === template.id
  );
  const currentValues = codingRow?.values ?? {};

  async function handleGenerateSuggestions() {
    setIsGeneratingSuggestions(true);
    setSuggestionMessage(null);

    try {
      const suggestions = await generateSuggestions({
        sample,
        template,
        currentValues
      });

      const fillableFieldCount = Object.entries(suggestions).filter(
        ([fieldId, value]) => isEmptyCodingValue(currentValues[fieldId]) && !isEmptyCodingValue(value)
      ).length;

      dispatch({
        type: "APPLY_SUGGESTIONS",
        payload: {
          sampleId: sample.id,
          templateId: template.id,
          values: suggestions
        }
      });

      if (!fillableFieldCount) {
        setSuggestionMessage("No empty fields were updated. Existing edits were left unchanged.");
        return;
      }

      setSuggestionMessage(
        `Filled ${fillableFieldCount} empty field${fillableFieldCount === 1 ? "" : "s"}. Existing edits were left unchanged.`
      );
    } finally {
      setIsGeneratingSuggestions(false);
    }
  }

  return (
    <section className="space-y-5 rounded-[1.5rem] border border-line bg-white p-6 shadow-soft">
      <div className="rounded-[1.25rem] border border-line bg-[#fffdf8] p-5">
        <p className="text-sm text-muted">Currently coding</p>
        <h3 className="mt-1 text-xl font-semibold tracking-tight text-ink">{sample.title}</h3>
        <p className="mt-2 text-sm leading-7 text-muted">{template.name}</p>
      </div>

      <div className="rounded-[1.25rem] border border-line bg-[#fffdf8] p-5">
        <p className="text-sm text-muted">Sample text</p>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-ink">{sample.text}</p>
      </div>

      <div className="rounded-[1.25rem] border border-accent/30 bg-accent/10 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Mock AI suggestions</p>
            <p className="text-sm leading-7 text-ink">
              Suggestions are editable starting points, not final research judgments.
            </p>
            <p className="text-sm leading-7 text-muted">Only empty fields are filled. Existing edits stay unchanged.</p>
          </div>
          <button
            type="button"
            onClick={handleGenerateSuggestions}
            disabled={isGeneratingSuggestions}
            className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-white hover:bg-ink/90 disabled:cursor-not-allowed disabled:bg-ink/40"
          >
            {isGeneratingSuggestions ? "Generating suggestions..." : "Generate Suggestions"}
          </button>
        </div>

        {suggestionMessage && <p className="mt-4 text-sm text-muted">{suggestionMessage}</p>}
      </div>

      <div className="space-y-4">
        {template.fields.map((field) => (
          <div key={field.id} className="rounded-[1.25rem] border border-line bg-white p-5">
            <div className="space-y-2">
              <label className="block text-base font-semibold text-ink">{field.label}</label>
              <p className="text-sm leading-7 text-muted">{field.description}</p>
            </div>
            <div className="mt-4">
              <FieldInput
                field={field}
                value={currentValues[field.id] ?? null}
                onChange={(value) =>
                  dispatch({
                    type: "UPDATE_CODING_VALUE",
                    payload: {
                      sampleId: sample.id,
                      templateId: template.id,
                      fieldId: field.id,
                      value
                    }
                  })
                }
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
