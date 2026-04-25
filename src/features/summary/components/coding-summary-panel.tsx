"use client";

import { EmptyState } from "@/components/shared/empty-state";
import { buildCodingSummary } from "@/features/summary/utils/build-coding-summary";
import { useWorkspace } from "@/features/coding/state/workspace-context";
import { analysisTemplates } from "@/features/templates/data/templates";
import { useLanguage } from "@/i18n/context";
import { formatMessage, getLocalizedText } from "@/i18n/utils";

function formatPercent(value: number) {
  return `${value}%`;
}

function formatNumberValue(value: number, locale: "en" | "zh-CN") {
  return new Intl.NumberFormat(locale === "zh-CN" ? "zh-CN" : "en", {
    maximumFractionDigits: 2
  }).format(value);
}

export function CodingSummaryPanel() {
  const { state } = useWorkspace();
  const { locale, messages } = useLanguage();

  if (!state.selectedTemplateId) {
    return (
      <EmptyState
        title={messages.codingSummary.emptyTemplateTitle}
        description={messages.codingSummary.emptyTemplateDescription}
      />
    );
  }

  const template = analysisTemplates.find((item) => item.id === state.selectedTemplateId);

  if (!template) {
    return (
      <EmptyState
        title={messages.codingSummary.emptyTemplateTitle}
        description={messages.codingSummary.emptyTemplateDescription}
      />
    );
  }

  if (!state.samples.length) {
    return (
      <EmptyState
        title={messages.codingSummary.emptyWorkspaceTitle}
        description={messages.codingSummary.emptyWorkspaceDescription}
      />
    );
  }

  const summary = buildCodingSummary(state.samples, state.codingRows, template, state.selectedSampleId);

  return (
    <section className="surface-card space-y-5 p-6 md:p-7">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold tracking-tight text-ink">{messages.codingSummary.title}</h3>
        <p className="text-sm leading-7 text-muted">{messages.codingSummary.description}</p>
      </div>
      <div className="helper-note">
        {formatMessage(messages.codingSummary.activeTemplate, {
          template: getLocalizedText(summary.template.name, locale)
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <div className="metric-card">
          <p className="text-sm text-muted">{messages.codingSummary.totalSamples}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-ink">{summary.totalSamples}</p>
        </div>
        <div className="metric-card">
          <p className="text-sm text-muted">{messages.codingSummary.codedSamples}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-ink">{summary.codedSamples}</p>
        </div>
        <div className="metric-card">
          <p className="text-sm text-muted">{messages.codingSummary.uncodedSamples}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-ink">{summary.uncodedSamples}</p>
        </div>
        <div className="metric-card">
          <p className="text-sm text-muted">{messages.codingSummary.completion}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-ink">
            {formatPercent(summary.completionPercent)}
          </p>
        </div>
        <div className="metric-card">
          <p className="text-sm text-muted">{messages.codingSummary.selectedSampleCount}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-ink">{summary.selectedSampleCount}</p>
        </div>
      </div>

      {!summary.hasAnyCodedValues && (
        <div className="surface-muted p-4">
          <p className="text-sm leading-7 text-muted">{messages.codingSummary.noCodedValuesYet}</p>
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-1">
          <h4 className="text-lg font-semibold tracking-tight text-ink">{messages.codingSummary.fieldDistributions}</h4>
          <p className="text-sm leading-7 text-muted">{messages.codingSummary.fieldDistributionsDescription}</p>
        </div>

        <div className="grid gap-4">
          {summary.fieldSummaries.map((fieldSummary) => {
            const localizedFieldLabel = getLocalizedText(fieldSummary.field.label, locale);

            return (
              <div key={fieldSummary.field.id} className="surface-panel p-5">
                <div className="space-y-1">
                  <h5 className="text-base font-semibold text-ink">{localizedFieldLabel}</h5>
                  <p className="text-sm leading-7 text-muted">
                    {getLocalizedText(fieldSummary.field.description, locale)}
                  </p>
                </div>

                {fieldSummary.type === "single-select" && (
                  <div className="mt-4 space-y-3">
                    {fieldSummary.options.map((option) => {
                      const optionLabel =
                        getLocalizedText(
                          fieldSummary.field.options?.find((item) => item.value === option.value)?.label,
                          locale
                        ) ?? option.value;
                      const width = summary.totalSamples ? (option.count / summary.totalSamples) * 100 : 0;

                      return (
                        <div key={option.value} className="space-y-2">
                          <div className="flex items-center justify-between gap-4">
                            <p className="text-sm text-ink">{optionLabel}</p>
                            <p className="text-sm text-muted">{option.count}</p>
                          </div>
                          <div className="h-2 rounded-full bg-paper">
                            <div className="h-2 rounded-full bg-accent" style={{ width: `${width}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {fieldSummary.type === "multi-select" && (
                  <div className="mt-4 space-y-3">
                    {fieldSummary.options.map((option) => {
                      const optionLabel =
                        getLocalizedText(
                          fieldSummary.field.options?.find((item) => item.value === option.value)?.label,
                          locale
                        ) ?? option.value;
                      const width = summary.totalSamples ? (option.count / summary.totalSamples) * 100 : 0;

                      return (
                        <div key={option.value} className="space-y-2">
                          <div className="flex items-center justify-between gap-4">
                            <p className="text-sm text-ink">{optionLabel}</p>
                            <p className="text-sm text-muted">{option.count}</p>
                          </div>
                          <div className="h-2 rounded-full bg-paper">
                            <div className="h-2 rounded-full bg-ink/75" style={{ width: `${width}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {fieldSummary.type === "boolean" && (
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div className="surface-card p-4 shadow-none">
                      <p className="text-sm text-muted">{messages.common.yes}</p>
                      <p className="mt-2 text-xl font-semibold tracking-tight text-ink">{fieldSummary.trueCount}</p>
                    </div>
                    <div className="surface-card p-4 shadow-none">
                      <p className="text-sm text-muted">{messages.common.no}</p>
                      <p className="mt-2 text-xl font-semibold tracking-tight text-ink">{fieldSummary.falseCount}</p>
                    </div>
                  </div>
                )}

                {fieldSummary.type === "text" && (
                  <div className="mt-4 surface-card p-4 shadow-none">
                    <p className="text-sm text-muted">{messages.codingSummary.textFieldsCompleted}</p>
                    <p className="mt-2 text-base font-semibold text-ink">
                      {formatMessage(messages.codingSummary.completedOutOfTotal, {
                        count: fieldSummary.filledCount,
                        total: summary.totalSamples
                      })}
                    </p>
                  </div>
                )}

                {fieldSummary.type === "number" && (
                  <div className="mt-4">
                    {fieldSummary.count === 0 ? (
                      <div className="surface-muted p-4">
                        <p className="text-sm leading-7 text-muted">{messages.codingSummary.noCodedValuesYet}</p>
                      </div>
                    ) : (
                      <div className="grid gap-3 md:grid-cols-4">
                        <div className="surface-card p-4 shadow-none">
                          <p className="text-sm text-muted">{messages.codingSummary.numberSummary}</p>
                          <p className="mt-2 text-xl font-semibold tracking-tight text-ink">{fieldSummary.count}</p>
                        </div>
                        <div className="surface-card p-4 shadow-none">
                          <p className="text-sm text-muted">{messages.codingSummary.min}</p>
                          <p className="mt-2 text-xl font-semibold tracking-tight text-ink">
                            {fieldSummary.min === null ? "—" : formatNumberValue(fieldSummary.min, locale)}
                          </p>
                        </div>
                        <div className="surface-card p-4 shadow-none">
                          <p className="text-sm text-muted">{messages.codingSummary.max}</p>
                          <p className="mt-2 text-xl font-semibold tracking-tight text-ink">
                            {fieldSummary.max === null ? "—" : formatNumberValue(fieldSummary.max, locale)}
                          </p>
                        </div>
                        <div className="surface-card p-4 shadow-none">
                          <p className="text-sm text-muted">{messages.codingSummary.average}</p>
                          <p className="mt-2 text-xl font-semibold tracking-tight text-ink">
                            {fieldSummary.average === null ? "—" : formatNumberValue(fieldSummary.average, locale)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
