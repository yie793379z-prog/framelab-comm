"use client";

import { useEffect, useState } from "react";
import { EmptyState } from "@/components/shared/empty-state";
import { fetchSuggestionStatus, requestSuggestions } from "@/features/ai/request-suggestions";
import { useWorkspace } from "@/features/coding/state/workspace-context";
import { analysisTemplates } from "@/features/templates/data/templates";
import { useLanguage } from "@/i18n/context";
import { formatMessage, getCountWord, getLocalizedText } from "@/i18n/utils";
import type { SuggestionStatus } from "@/features/ai/types";
import type { CodingFieldValue } from "@/types/coding";
import type { TemplateField } from "@/types/template";

type FieldInputProps = {
  field: TemplateField;
  value: CodingFieldValue;
  inputId: string;
  onChange: (value: CodingFieldValue) => void;
};

function isEmptyCodingValue(value: CodingFieldValue | undefined) {
  return value === null || value === undefined || value === "" || (Array.isArray(value) && value.length === 0);
}

function FieldInput({ field, value, inputId, onChange }: FieldInputProps) {
  const { locale, messages } = useLanguage();

  if (field.type === "text") {
    return (
      <textarea
        id={inputId}
        value={typeof value === "string" ? value : ""}
        onChange={(event) => onChange(event.target.value)}
        placeholder={getLocalizedText(field.placeholder, locale)}
        className="field-textarea"
      />
    );
  }

  if (field.type === "number") {
    return (
      <input
        id={inputId}
        type="number"
        value={typeof value === "number" ? value : ""}
        onChange={(event) => onChange(event.target.value === "" ? null : Number(event.target.value))}
        placeholder={getLocalizedText(field.placeholder, locale)}
        className="field-control"
      />
    );
  }

  if (field.type === "boolean") {
    const currentValue = typeof value === "boolean" ? value : null;

    return (
      <div className="flex flex-wrap gap-3">
        {[
          { label: messages.common.yes, value: true },
          { label: messages.common.no, value: false }
        ].map((option) => (
          <button
            key={option.label}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={currentValue === option.value}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/15 ${
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
          className="button-secondary px-4 py-2"
        >
          {messages.common.clear}
        </button>
      </div>
    );
  }

  if (field.type === "single-select") {
    return (
      <select
        id={inputId}
        value={typeof value === "string" ? value : ""}
        onChange={(event) => onChange(event.target.value)}
        className="field-control"
      >
        <option value="">{messages.common.selectOption}</option>
        {field.options?.map((option) => (
          <option key={option.value} value={option.value}>
            {getLocalizedText(option.label, locale)}
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
              className="flex items-start gap-3 rounded-[1rem] border border-line bg-[#fffdf8] px-4 py-3 text-sm text-ink transition hover:border-ink/20"
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
              <span>{getLocalizedText(option.label, locale)}</span>
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
  const { locale, messages } = useLanguage();
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [suggestionMessage, setSuggestionMessage] = useState<string | null>(null);
  const [suggestionStatus, setSuggestionStatus] = useState<SuggestionStatus>({
    mode: "mock",
    fallbackUsed: false,
    message: messages.codingForm.mockModeMessage
  });

  useEffect(() => {
    let isActive = true;

    async function loadSuggestionStatus() {
      try {
        const status = await fetchSuggestionStatus(locale);

        if (isActive) {
          setSuggestionStatus(status);
        }
      } catch {
        if (isActive) {
          setSuggestionStatus({
            mode: "mock",
            fallbackUsed: true,
            message: messages.codingForm.localFallbackMessage
          });
        }
      }
    }

    void loadSuggestionStatus();

    return () => {
      isActive = false;
    };
  }, [locale, messages.codingForm.localFallbackMessage, messages.codingForm.mockModeMessage]);

  if (!state.selectedTemplateId) {
    return (
      <EmptyState
        title={messages.codingForm.emptyTemplateTitle}
        description={messages.codingForm.emptyTemplateDescription}
      />
    );
  }

  if (!state.selectedSampleId) {
    return (
      <EmptyState
        title={messages.codingForm.emptySampleTitle}
        description={messages.codingForm.emptySampleDescription}
      />
    );
  }

  const template = analysisTemplates.find((item) => item.id === state.selectedTemplateId);
  const sample = state.samples.find((item) => item.id === state.selectedSampleId);

  if (!template || !sample) {
    return (
      <EmptyState
        title={messages.codingForm.unavailableTitle}
        description={messages.codingForm.unavailableDescription}
      />
    );
  }

  const activeTemplate = template;
  const activeSample = sample;

  const codingRow = state.codingRows.find(
    (row) => row.sampleId === activeSample.id && row.templateId === activeTemplate.id
  );
  const currentValues = codingRow?.values ?? {};

  async function handleGenerateSuggestions() {
    setIsGeneratingSuggestions(true);
    setSuggestionMessage(null);

    try {
      const result = await requestSuggestions({
        sample: activeSample,
        template: activeTemplate,
        currentValues,
        locale
      });
      const suggestions = result.suggestions;

      const fillableFieldCount = Object.entries(suggestions).filter(
        ([fieldId, value]) => isEmptyCodingValue(currentValues[fieldId]) && !isEmptyCodingValue(value)
      ).length;

      setSuggestionStatus({
        mode: result.mode,
        fallbackUsed: result.fallbackUsed,
        message: result.message
      });

      dispatch({
        type: "APPLY_SUGGESTIONS",
        payload: {
          sampleId: activeSample.id,
          templateId: activeTemplate.id,
          values: suggestions
        }
      });

      if (!fillableFieldCount) {
        setSuggestionMessage(messages.codingForm.noFieldsUpdated);
        return;
      }

      setSuggestionMessage(
        formatMessage(messages.codingForm.fieldsUpdated, {
          count: fillableFieldCount,
          fieldWord: getCountWord(locale, fillableFieldCount, "field", "fields", "字段")
        })
      );
    } finally {
      setIsGeneratingSuggestions(false);
    }
  }

  return (
    <section className="surface-card space-y-5 p-6 md:p-7">
      <div className="surface-panel p-5">
        <p className="text-sm text-muted">{messages.codingForm.currentlyCoding}</p>
        <h3 className="mt-1 text-xl font-semibold tracking-tight text-ink">{activeSample.title}</h3>
        <p className="mt-2 text-sm leading-7 text-muted">{getLocalizedText(activeTemplate.name, locale)}</p>
      </div>

      <div className="surface-panel p-5">
        <p className="text-sm font-medium text-muted">{messages.codingForm.sampleText}</p>
        <p className="mt-2 text-sm leading-7 text-muted">{messages.codingForm.sampleTextHelper}</p>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-ink">{activeSample.text}</p>
      </div>

      <div className="rounded-[1.25rem] border border-accent/30 bg-accent/10 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">{messages.codingForm.aiEyebrow}</p>
            <p className="text-sm font-medium leading-7 text-ink">
              {messages.codingForm.modeLabel}:{" "}
              {suggestionStatus.mode === "real"
                ? messages.codingForm.realModeTitle
                : messages.codingForm.mockModeTitle}
            </p>
            <p className="text-sm leading-7 text-ink">{messages.codingForm.aiDisclaimer}</p>
            <p className="text-sm leading-7 text-muted">{messages.codingForm.aiHowItWorks}</p>
            <p className="text-sm leading-7 text-muted">{messages.codingForm.aiEditableNote}</p>
            <p className="text-sm leading-7 text-muted">{messages.codingForm.aiOnlyEmptyFields}</p>
            <p className="text-sm leading-7 text-muted">
              {suggestionStatus.mode === "real"
                ? messages.codingForm.realPrivacyNote
                : messages.codingForm.mockPrivacyNote}
            </p>
            <p className="text-sm leading-7 text-muted">{suggestionStatus.message}</p>
          </div>
          <button
            type="button"
            onClick={handleGenerateSuggestions}
            disabled={isGeneratingSuggestions}
            className="button-primary"
          >
            {isGeneratingSuggestions ? messages.codingForm.generating : messages.codingForm.generate}
          </button>
        </div>

        {suggestionMessage && <p className="mt-4 text-sm leading-7 text-muted">{suggestionMessage}</p>}
      </div>

      <div className="space-y-4">
        {activeTemplate.fields.map((field) => {
          const inputId = `${activeTemplate.id}-${activeSample.id}-${field.id}`;

          return (
            <div key={field.id} className="surface-panel p-5">
              <div className="space-y-2">
                <label htmlFor={inputId} className="block text-base font-semibold text-ink">
                  {getLocalizedText(field.label, locale)}
                </label>
                <p className="text-sm leading-7 text-muted">{getLocalizedText(field.description, locale)}</p>
              </div>
              <div className="mt-4">
                <FieldInput
                  field={field}
                  value={currentValues[field.id] ?? null}
                  inputId={inputId}
                  onChange={(value) =>
                    dispatch({
                      type: "UPDATE_CODING_VALUE",
                      payload: {
                        sampleId: activeSample.id,
                        templateId: activeTemplate.id,
                        fieldId: field.id,
                        value
                      }
                    })
                  }
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
