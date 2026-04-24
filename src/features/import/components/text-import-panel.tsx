"use client";

import { useWorkspace } from "@/features/coding/state/workspace-context";

export function TextImportPanel() {
  const { state, dispatch } = useWorkspace();

  const previewCount = state.importText
    .split(/\n\s*\n/g)
    .map((item) => item.trim())
    .filter(Boolean).length;

  return (
    <section className="rounded-[1.5rem] border border-line bg-white p-6 shadow-soft">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold tracking-tight text-ink">Import text samples</h3>
        <p className="text-sm leading-7 text-muted">
          Paste one or more text samples. Separate items with a blank line to create multiple entries.
        </p>
      </div>

      <div className="mt-5 space-y-4">
        <textarea
          value={state.importText}
          onChange={(event) => dispatch({ type: "SET_IMPORT_TEXT", payload: event.target.value })}
          placeholder="Paste article excerpts, posts, or interview passages here..."
          className="min-h-48 w-full rounded-[1.25rem] border border-line bg-[#fffdf8] px-4 py-3 text-sm text-ink outline-none ring-0 placeholder:text-muted focus:border-ink/40"
        />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-muted">
            {previewCount} sample{previewCount === 1 ? "" : "s"} detected
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => dispatch({ type: "LOAD_SAMPLES_FROM_IMPORT" })}
              disabled={!previewCount}
              className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-ink/90 disabled:cursor-not-allowed disabled:bg-ink/40"
            >
              Load into workspace
            </button>
            <button
              type="button"
              onClick={() => dispatch({ type: "RESET_IMPORT_TEXT" })}
              className="rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-ink hover:border-ink/40"
            >
              Clear
            </button>
          </div>
        </div>

        {!!state.samples.length && (
          <p className="text-sm text-muted">
            {state.samples.length} sample{state.samples.length === 1 ? "" : "s"} currently loaded into the workspace.
          </p>
        )}
      </div>
    </section>
  );
}
