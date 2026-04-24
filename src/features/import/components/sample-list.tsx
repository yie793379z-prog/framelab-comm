"use client";

import { EmptyState } from "@/components/shared/empty-state";
import { useWorkspace } from "@/features/coding/state/workspace-context";

export function SampleList() {
  const { state, dispatch } = useWorkspace();

  if (!state.samples.length) {
    return (
      <EmptyState
        title="No samples loaded yet"
        description="Paste text into the import panel and load it into the workspace to start selecting and coding samples."
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {state.samples.map((sample, index) => {
        const isSelected = state.selectedSampleId === sample.id;
        const previewText = sample.text.length > 180 ? `${sample.text.slice(0, 177)}...` : sample.text;

        return (
          <button
            key={sample.id}
            type="button"
            onClick={() => dispatch({ type: "SELECT_SAMPLE", payload: sample.id })}
            className={`rounded-[1.5rem] border p-5 text-left transition ${
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
                  Sample {index + 1}
                </span>
              </div>
              <p className={`text-sm leading-7 ${isSelected ? "text-white/80" : "text-muted"}`}>{previewText}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
