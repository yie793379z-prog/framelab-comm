"use client";

import { useWorkspace } from "@/features/coding/state/workspace-context";
import { useLanguage } from "@/i18n/context";
import { formatMessage, getCountWord } from "@/i18n/utils";

export function TextImportPanel() {
  const { state, dispatch } = useWorkspace();
  const { locale, messages } = useLanguage();

  const previewCount = state.importText
    .split(/\n\s*\n/g)
    .map((item) => item.trim())
    .filter(Boolean).length;

  const sampleWord = getCountWord(locale, previewCount, "sample", "samples", "样本");
  const loadedSampleWord = getCountWord(locale, state.samples.length, "sample", "samples", "样本");

  return (
    <section className="rounded-[1.5rem] border border-line bg-white p-6 shadow-soft">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold tracking-tight text-ink">{messages.importPanel.title}</h3>
        <p className="text-sm leading-7 text-muted">{messages.importPanel.description}</p>
      </div>

      <div className="mt-5 space-y-4">
        <textarea
          value={state.importText}
          onChange={(event) => dispatch({ type: "SET_IMPORT_TEXT", payload: event.target.value })}
          placeholder={messages.importPanel.placeholder}
          className="min-h-48 w-full rounded-[1.25rem] border border-line bg-[#fffdf8] px-4 py-3 text-sm text-ink outline-none ring-0 placeholder:text-muted focus:border-ink/40"
        />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-muted">
            {formatMessage(messages.importPanel.samplesDetected, { count: previewCount, sampleWord })}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => dispatch({ type: "LOAD_SAMPLES_FROM_IMPORT" })}
              disabled={!previewCount}
              className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-ink/90 disabled:cursor-not-allowed disabled:bg-ink/40"
            >
              {messages.importPanel.load}
            </button>
            <button
              type="button"
              onClick={() => dispatch({ type: "RESET_IMPORT_TEXT" })}
              className="rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-ink hover:border-ink/40"
            >
              {messages.importPanel.clear}
            </button>
          </div>
        </div>

        {!!state.samples.length && (
          <p className="text-sm text-muted">
            {formatMessage(messages.importPanel.samplesLoaded, {
              count: state.samples.length,
              sampleWord: loadedSampleWord
            })}
          </p>
        )}
      </div>
    </section>
  );
}
