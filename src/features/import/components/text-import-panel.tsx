"use client";

import { useWorkspace } from "@/features/coding/state/workspace-context";
import { useLanguage } from "@/i18n/context";
import { formatMessage, getCountWord } from "@/i18n/utils";

export function TextImportPanel() {
  const { state, dispatch } = useWorkspace();
  const { locale, messages } = useLanguage();
  const textareaId = "workspace-import-text";

  const previewCount = state.importText
    .split(/\n\s*\n/g)
    .map((item) => item.trim())
    .filter(Boolean).length;

  const sampleWord = getCountWord(locale, previewCount, "sample", "samples", "样本");
  const loadedSampleWord = getCountWord(locale, state.samples.length, "sample", "samples", "样本");

  return (
    <section className="surface-card p-6 md:p-7">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold tracking-tight text-ink">{messages.importPanel.title}</h3>
        <p className="text-sm leading-7 text-muted">{messages.importPanel.description}</p>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-[1.4fr_0.6fr]">
        <div className="space-y-4">
          <label htmlFor={textareaId} className="block text-sm font-semibold text-ink">
            {messages.importPanel.textareaLabel}
          </label>
          <textarea
            id={textareaId}
            value={state.importText}
            onChange={(event) => dispatch({ type: "SET_IMPORT_TEXT", payload: event.target.value })}
            placeholder={messages.importPanel.placeholder}
            className="field-textarea min-h-56"
          />
        </div>

        <div className="space-y-3">
          <div className="surface-panel p-4">
            <p className="text-sm font-semibold text-ink">{messages.importPanel.helperBlankLines}</p>
          </div>
          <div className="surface-panel p-4">
            <p className="text-sm leading-7 text-muted">{messages.importPanel.helperLoad}</p>
          </div>
          <div className="surface-panel p-4">
            <p className="text-sm leading-7 text-muted">{messages.importPanel.helperFormats}</p>
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-muted">
            {formatMessage(messages.importPanel.samplesDetected, { count: previewCount, sampleWord })}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => dispatch({ type: "LOAD_SAMPLES_FROM_IMPORT" })}
              disabled={!previewCount}
              className="button-primary px-4 py-2.5"
            >
              {messages.importPanel.load}
            </button>
            <button
              type="button"
              onClick={() => dispatch({ type: "RESET_IMPORT_TEXT" })}
              className="button-secondary px-4 py-2.5"
            >
              {messages.importPanel.clear}
            </button>
          </div>
        </div>

        {!!state.samples.length && (
          <div className="surface-panel px-4 py-3">
            <p className="text-sm text-muted">
              {formatMessage(messages.importPanel.samplesLoaded, {
                count: state.samples.length,
                sampleWord: loadedSampleWord
              })}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
