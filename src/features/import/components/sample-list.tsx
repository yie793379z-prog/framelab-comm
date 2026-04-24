"use client";

import { EmptyState } from "@/components/shared/empty-state";
import { useWorkspace } from "@/features/coding/state/workspace-context";
import { useLanguage } from "@/i18n/context";
import { formatMessage } from "@/i18n/utils";

export function SampleList() {
  const { state, dispatch } = useWorkspace();
  const { messages } = useLanguage();

  if (!state.samples.length) {
    return (
      <EmptyState
        title={messages.sampleList.emptyTitle}
        description={messages.sampleList.emptyDescription}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="helper-note">{messages.sampleList.helper}</div>
      <div className="grid gap-4 md:grid-cols-2">
        {state.samples.map((sample, index) => {
          const isSelected = state.selectedSampleId === sample.id;
          const previewText = sample.text.length > 180 ? `${sample.text.slice(0, 177)}...` : sample.text;

          return (
            <button
              key={sample.id}
              type="button"
              onClick={() => dispatch({ type: "SELECT_SAMPLE", payload: sample.id })}
              aria-pressed={isSelected}
              aria-label={formatMessage(messages.sampleList.selectAction, {
                index: index + 1,
                title: sample.title
              })}
              className={`rounded-[1.5rem] border p-5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/15 ${
                isSelected
                  ? "border-ink bg-ink text-white shadow-soft"
                  : "border-line bg-white hover:border-ink/40 hover:bg-[#fffdf8]"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-lg font-semibold tracking-tight">{sample.title}</h3>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      isSelected ? "bg-white/15 text-white" : "bg-paper text-muted"
                    }`}
                  >
                    {formatMessage(messages.sampleList.sampleBadge, { index: index + 1 })}
                  </span>
                </div>
                <p className={`text-sm leading-7 ${isSelected ? "text-white/80" : "text-muted"}`}>{previewText}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
