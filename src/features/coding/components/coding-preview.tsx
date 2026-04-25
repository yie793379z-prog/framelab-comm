"use client";

import { EmptyState } from "@/components/shared/empty-state";
import { useWorkspace } from "@/features/coding/state/workspace-context";
import { getProjectTemplateById } from "@/features/templates/utils/project-codebooks";
import { useLanguage } from "@/i18n/context";
import { getLocalizedText } from "@/i18n/utils";
import type { CodingFieldValue } from "@/types/coding";
import type { TemplateField } from "@/types/template";

function formatFieldValue(field: TemplateField, value: CodingFieldValue, locale: "en" | "zh-CN", notCodedText: string) {
  if (value === null || value === undefined || value === "") {
    return notCodedText;
  }

  if (field.type === "single-select" && typeof value === "string") {
    return getLocalizedText(field.options?.find((option) => option.value === value)?.label, locale) ?? value;
  }

  if (field.type === "multi-select" && Array.isArray(value)) {
    if (!value.length) {
      return notCodedText;
    }

    return value
      .map((item) => getLocalizedText(field.options?.find((option) => option.value === item)?.label, locale) ?? item)
      .join(", ");
  }

  return String(value);
}

export function CodingPreview() {
  const { state } = useWorkspace();
  const { locale, messages } = useLanguage();

  if (!state.selectedTemplateId) {
    return (
      <EmptyState
        title={messages.codingPreview.emptyTemplateTitle}
        description={messages.codingPreview.emptyTemplateDescription}
      />
    );
  }

  if (!state.selectedSampleId) {
    return (
      <EmptyState
        title={messages.codingPreview.emptySampleTitle}
        description={messages.codingPreview.emptySampleDescription}
      />
    );
  }

  const template = getProjectTemplateById(state.selectedTemplateId, state.customProjectCodebooks);
  const sample = state.samples.find((item) => item.id === state.selectedSampleId);

  if (!template || !sample) {
    return (
      <EmptyState
        title={messages.codingPreview.unavailableTitle}
        description={messages.codingPreview.unavailableDescription}
      />
    );
  }

  const codingRow = state.codingRows.find(
    (row) => row.sampleId === sample.id && row.templateId === template.id
  );

  return (
    <div className="surface-card space-y-5 p-6 md:p-7">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold tracking-tight text-ink">{messages.codingPreview.title}</h3>
        <p className="text-sm leading-7 text-muted">{messages.codingPreview.description}</p>
      </div>
      <div className="helper-note">{messages.codingPreview.helper}</div>

      <div className="surface-panel p-5">
        <p className="text-sm text-muted">{messages.common.sample}</p>
        <p className="mt-1 text-base font-semibold text-ink">{sample.title}</p>
        <p className="mt-4 text-sm text-muted">{messages.common.template}</p>
        <p className="mt-1 text-base font-semibold text-ink">{getLocalizedText(template.name, locale)}</p>
      </div>

      <div className="grid gap-3">
        {template.fields.map((field) => {
          const rawValue = codingRow?.values[field.id];
          const displayValue = formatFieldValue(field, rawValue ?? null, locale, messages.common.notCodedYet);

          return (
            <div key={field.id} className="surface-panel p-4">
              <p className="text-sm font-medium text-muted">{getLocalizedText(field.label, locale)}</p>
              <p className="mt-2 whitespace-pre-wrap text-[15px] leading-7 text-ink">{displayValue}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
