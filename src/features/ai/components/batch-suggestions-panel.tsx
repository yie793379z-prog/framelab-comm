"use client";

import { useEffect, useRef, useState } from "react";
import { fetchSuggestionStatus, requestSuggestions } from "@/features/ai/request-suggestions";
import { useWorkspace } from "@/features/coding/state/workspace-context";
import { getProjectTemplateById } from "@/features/templates/utils/project-codebooks";
import { useLanguage } from "@/i18n/context";
import { getLocalizedText } from "@/i18n/utils";
import type { SuggestionStatus } from "@/features/ai/types";
import type { CodingFieldValue } from "@/types/coding";
import type { SampleRecord } from "@/types/sample";
import type { AnalysisTemplate } from "@/types/template";

const MAX_BATCH_SIZE = 10;

type BatchRunState = {
  isRunning: boolean;
  stopRequested: boolean;
  currentIndex: number;
  targetCount: number;
  currentSampleTitle: string | null;
  processed: number;
  updated: number;
  skipped: number;
  failed: number;
  fallbackCount: number;
  statusMessage: string | null;
};

function isEmptyCodingValue(value: CodingFieldValue | undefined) {
  return value === null || value === undefined || value === "" || (Array.isArray(value) && value.length === 0);
}

function hasAnyFilledValues(values: Record<string, CodingFieldValue> | undefined) {
  if (!values) {
    return false;
  }

  return Object.values(values).some((value) => !isEmptyCodingValue(value));
}

function countFillableFields(template: AnalysisTemplate, values: Record<string, CodingFieldValue> | undefined) {
  const currentValues = values ?? {};

  return template.fields.filter((field) => isEmptyCodingValue(currentValues[field.id])).length;
}

function getCodingValuesForSample(
  sampleId: string,
  templateId: string,
  codingRows: { sampleId: string; templateId: string; values: Record<string, CodingFieldValue> }[]
) {
  return codingRows.find((row) => row.sampleId === sampleId && row.templateId === templateId)?.values;
}

function getEligibleUncodedSamples(
  samples: SampleRecord[],
  codingRows: { sampleId: string; templateId: string; values: Record<string, CodingFieldValue> }[],
  template: AnalysisTemplate
) {
  return samples.filter((sample) => {
    const values = getCodingValuesForSample(sample.id, template.id, codingRows);

    return !hasAnyFilledValues(values) && countFillableFields(template, values) > 0;
  });
}

function getProviderLabel(status: SuggestionStatus, messages: ReturnType<typeof useLanguage>["messages"]) {
  if (status.provider === "openai") {
    return messages.codingForm.openAiModeTitle;
  }

  if (status.provider === "gemini") {
    return messages.codingForm.geminiModeTitle;
  }

  return messages.codingForm.mockModeTitle;
}

export function BatchSuggestionsPanel() {
  const { state, dispatch } = useWorkspace();
  const { locale, messages } = useLanguage();
  const [batchState, setBatchState] = useState<BatchRunState | null>(null);
  const [suggestionStatus, setSuggestionStatus] = useState<SuggestionStatus>({
    mode: "mock",
    provider: "mock",
    fallbackUsed: false,
    message: messages.codingForm.mockModeMessage
  });
  const latestStateRef = useRef(state);
  const stopRequestedRef = useRef(false);

  useEffect(() => {
    latestStateRef.current = state;
  }, [state]);

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
            provider: "mock",
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

  const activeTemplate =
    getProjectTemplateById(state.selectedTemplateId, state.customProjectCodebooks) ?? null;
  const eligibleSamples = activeTemplate
    ? getEligibleUncodedSamples(state.samples, state.codingRows, activeTemplate)
    : [];
  const batchSamples = eligibleSamples.slice(0, MAX_BATCH_SIZE);
  const helperMessage = !activeTemplate
    ? messages.batchSuggestions.noTemplateMessage
    : !state.samples.length
      ? messages.batchSuggestions.noSamplesMessage
      : !eligibleSamples.length
        ? messages.batchSuggestions.noEligibleSamplesMessage
        : null;

  async function handleGenerateBatchSuggestions() {
    if (!activeTemplate) {
      setBatchState({
        isRunning: false,
        stopRequested: false,
        currentIndex: 0,
        targetCount: 0,
        currentSampleTitle: null,
        processed: 0,
        updated: 0,
        skipped: 0,
        failed: 0,
        fallbackCount: 0,
        statusMessage: messages.batchSuggestions.noTemplateMessage
      });
      return;
    }

    if (!batchSamples.length) {
      setBatchState({
        isRunning: false,
        stopRequested: false,
        currentIndex: 0,
        targetCount: 0,
        currentSampleTitle: null,
        processed: 0,
        updated: 0,
        skipped: 0,
        failed: 0,
        fallbackCount: 0,
        statusMessage: state.samples.length
          ? messages.batchSuggestions.noEligibleSamplesMessage
          : messages.batchSuggestions.noSamplesMessage
      });
      return;
    }

    stopRequestedRef.current = false;

    const nextState: BatchRunState = {
      isRunning: true,
      stopRequested: false,
      currentIndex: 0,
      targetCount: batchSamples.length,
      currentSampleTitle: null,
      processed: 0,
      updated: 0,
      skipped: 0,
      failed: 0,
      fallbackCount: 0,
      statusMessage: null
    };

    setBatchState(nextState);

    for (const [index, sample] of batchSamples.entries()) {
      setBatchState((previous) =>
        previous
          ? {
              ...previous,
              currentIndex: index + 1,
              currentSampleTitle: sample.title
            }
          : previous
      );

      const currentState = latestStateRef.current;
      const currentValues =
        getCodingValuesForSample(sample.id, activeTemplate.id, currentState.codingRows) ?? {};

      if (hasAnyFilledValues(currentValues) || countFillableFields(activeTemplate, currentValues) === 0) {
        nextState.processed += 1;
        nextState.skipped += 1;

        setBatchState({
          ...nextState,
          currentIndex: index + 1,
          currentSampleTitle: sample.title
        });

        if (stopRequestedRef.current) {
          break;
        }

        continue;
      }

      try {
        const result = await requestSuggestions({
          sample,
          template: activeTemplate,
          currentValues,
          locale
        });

        const fillableFieldCount = Object.entries(result.suggestions).filter(
          ([fieldId, value]) => isEmptyCodingValue(currentValues[fieldId]) && !isEmptyCodingValue(value)
        ).length;

        dispatch({
          type: "APPLY_SUGGESTIONS",
          payload: {
            sampleId: sample.id,
            templateId: activeTemplate.id,
            values: result.suggestions
          }
        });

        nextState.processed += 1;

        if (result.fallbackUsed) {
          nextState.fallbackCount += 1;
        }

        if (fillableFieldCount > 0) {
          nextState.updated += 1;
        } else {
          nextState.skipped += 1;
        }
      } catch {
        nextState.processed += 1;
        nextState.failed += 1;
      }

      setBatchState({
        ...nextState,
        currentIndex: index + 1,
        currentSampleTitle: sample.title
      });

      if (stopRequestedRef.current) {
        break;
      }
    }

    const stoppedEarly = stopRequestedRef.current && nextState.processed < nextState.targetCount;

    stopRequestedRef.current = false;
    setBatchState({
      ...nextState,
      isRunning: false,
      stopRequested: false,
      currentSampleTitle: null,
      statusMessage: stoppedEarly
        ? messages.batchSuggestions.batchStopped
        : messages.batchSuggestions.batchComplete
    });
  }

  function handleStopAfterCurrentSample() {
    stopRequestedRef.current = true;
    setBatchState((previous) =>
      previous
        ? {
            ...previous,
            stopRequested: true
          }
        : previous
    );
  }

  return (
    <section className="surface-card space-y-5 p-6 md:p-7">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold tracking-tight text-ink">{messages.batchSuggestions.title}</h3>
        <p className="text-sm leading-7 text-muted">{messages.batchSuggestions.description}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="surface-panel p-5">
          <p className="text-sm text-muted">{messages.batchSuggestions.eligibleSamples}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-ink">{eligibleSamples.length}</p>
        </div>
        <div className="surface-panel p-5">
          <p className="text-sm text-muted">{messages.batchSuggestions.maxPerBatch}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-ink">{MAX_BATCH_SIZE}</p>
        </div>
      </div>

      <div className="rounded-[1.25rem] border border-accent/30 bg-accent/10 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
              {messages.codingForm.aiEyebrow}
            </p>
            <p className="text-sm font-medium leading-7 text-ink">
              {messages.codingForm.modeLabel}: {getProviderLabel(suggestionStatus, messages)}
            </p>
            <p className="text-sm leading-7 text-muted">{suggestionStatus.message}</p>
            <p className="text-sm leading-7 text-muted">
              {suggestionStatus.provider === "mock"
                ? messages.batchSuggestions.mockPrivacyNote
                : messages.batchSuggestions.realPrivacyCostNote}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <button
              type="button"
              onClick={handleGenerateBatchSuggestions}
              disabled={(batchState?.isRunning ?? false) || !activeTemplate || batchSamples.length === 0}
              className="button-primary"
            >
              {batchState?.isRunning
                ? messages.batchSuggestions.processing
                : messages.batchSuggestions.generateForUncoded}
            </button>
            <button
              type="button"
              onClick={handleStopAfterCurrentSample}
              disabled={!(batchState?.isRunning) || Boolean(batchState?.stopRequested)}
              className="button-secondary"
            >
              {messages.batchSuggestions.stopAfterCurrentSample}
            </button>
          </div>
        </div>
      </div>

      {helperMessage && <p className="text-sm leading-7 text-muted">{helperMessage}</p>}

      {batchState && (
        <div className="surface-panel space-y-4 p-5">
          {batchState.targetCount > 0 && (
            <p className="text-sm font-medium text-ink">
              {messages.batchSuggestions.processing}: {Math.min(batchState.currentIndex || batchState.processed, batchState.targetCount)} /{" "}
              {batchState.targetCount}
            </p>
          )}

          {batchState.currentSampleTitle && (
            <p className="text-sm leading-7 text-muted">
              {messages.batchSuggestions.currentSample}: {batchState.currentSampleTitle}
            </p>
          )}

          {batchState.statusMessage && <p className="text-sm leading-7 text-muted">{batchState.statusMessage}</p>}

          {batchState.stopRequested && (
            <p className="text-sm leading-7 text-muted">{messages.batchSuggestions.stopRequestedMessage}</p>
          )}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <div className="rounded-[1rem] border border-line bg-white px-4 py-3">
              <p className="text-xs uppercase tracking-[0.14em] text-muted">{messages.batchSuggestions.processed}</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-ink">{batchState.processed}</p>
            </div>
            <div className="rounded-[1rem] border border-line bg-white px-4 py-3">
              <p className="text-xs uppercase tracking-[0.14em] text-muted">{messages.batchSuggestions.updated}</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-ink">{batchState.updated}</p>
            </div>
            <div className="rounded-[1rem] border border-line bg-white px-4 py-3">
              <p className="text-xs uppercase tracking-[0.14em] text-muted">{messages.batchSuggestions.skipped}</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-ink">{batchState.skipped}</p>
            </div>
            <div className="rounded-[1rem] border border-line bg-white px-4 py-3">
              <p className="text-xs uppercase tracking-[0.14em] text-muted">{messages.batchSuggestions.failed}</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-ink">{batchState.failed}</p>
            </div>
            <div className="rounded-[1rem] border border-line bg-white px-4 py-3">
              <p className="text-xs uppercase tracking-[0.14em] text-muted">{messages.batchSuggestions.fallbackCount}</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-ink">{batchState.fallbackCount}</p>
            </div>
          </div>
        </div>
      )}

      {activeTemplate && (
        <p className="text-sm leading-7 text-muted">
          {messages.codingSummary.activeTemplate}: {getLocalizedText(activeTemplate.name, locale)}
        </p>
      )}
    </section>
  );
}
