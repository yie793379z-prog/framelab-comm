"use client";

import { useState } from "react";
import { EmptyState } from "@/components/shared/empty-state";
import { useWorkspace } from "@/features/coding/state/workspace-context";
import { buildCsvExport } from "@/features/export/utils/export-csv";
import { buildJsonExport } from "@/features/export/utils/export-json";
import { buildMarkdownExport } from "@/features/export/utils/export-markdown";
import { downloadTextFile } from "@/lib/utils/download-file";
import { analysisTemplates } from "@/features/templates/data/templates";
import type { ExportFormat } from "@/types/export";

const EXPORT_FILENAMES: Record<ExportFormat, string> = {
  csv: "framelab-coded-data.csv",
  json: "framelab-project.json",
  markdown: "framelab-analysis-report.md"
};

const EXPORT_MIME_TYPES: Record<ExportFormat, string> = {
  csv: "text/csv;charset=utf-8",
  json: "application/json;charset=utf-8",
  markdown: "text/markdown;charset=utf-8"
};

const EXPORT_LABELS: Record<ExportFormat, string> = {
  csv: "Export CSV",
  json: "Export JSON",
  markdown: "Export Markdown"
};

export function ExportPanel() {
  const { state } = useWorkspace();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const selectedTemplate = analysisTemplates.find((template) => template.id === state.selectedTemplateId) ?? null;

  if (!state.samples.length) {
    return (
      <EmptyState
        title="Export actions will appear here"
        description="Once samples are loaded and coding results exist, CSV, JSON, and Markdown export actions can be added without changing the overall architecture."
      />
    );
  }

  function handleExport(format: ExportFormat) {
    let content = "";

    if (format === "csv") {
      content = buildCsvExport(state);
    }

    if (format === "json") {
      content = buildJsonExport(state);
    }

    if (format === "markdown") {
      content = buildMarkdownExport(state);
    }

    downloadTextFile(EXPORT_FILENAMES[format], content, EXPORT_MIME_TYPES[format]);
    setStatusMessage(`Downloaded ${EXPORT_FILENAMES[format]}.`);
  }

  return (
    <section className="rounded-[1.5rem] border border-line bg-white p-6 shadow-soft">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold tracking-tight text-ink">Export workspace analysis</h3>
        <p className="text-sm leading-7 text-muted">
          Export stays entirely in the browser for v0.1. CSV flattens coded rows, JSON preserves workspace structure,
          and Markdown creates a classroom-ready analysis summary.
        </p>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <div className="rounded-[1.25rem] border border-line bg-[#fffdf8] p-4">
          <p className="text-sm text-muted">Samples</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-ink">{state.samples.length}</p>
        </div>
        <div className="rounded-[1.25rem] border border-line bg-[#fffdf8] p-4">
          <p className="text-sm text-muted">Coded rows</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-ink">{state.codingRows.length}</p>
        </div>
        <div className="rounded-[1.25rem] border border-line bg-[#fffdf8] p-4">
          <p className="text-sm text-muted">Selected template</p>
          <p className="mt-2 text-base font-semibold tracking-tight text-ink">
            {selectedTemplate?.name ?? "No template selected"}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {(Object.keys(EXPORT_LABELS) as ExportFormat[]).map((format) => (
          <div key={format} className="rounded-[1.25rem] border border-line bg-[#fffdf8] p-4">
            <p className="text-base font-semibold text-ink">{EXPORT_LABELS[format]}</p>
            <p className="mt-2 text-sm leading-7 text-muted">
              {format === "csv" && "Flatten coded rows by sample, template, and field values."}
              {format === "json" && "Preserve samples, selected template, coding results, and export metadata."}
              {format === "markdown" && "Build a readable report with methodology note, AI disclaimer, and per-sample summary."}
            </p>
            <button
              type="button"
              onClick={() => handleExport(format)}
              className="mt-4 rounded-full bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-ink/90"
            >
              {EXPORT_LABELS[format]}
            </button>
          </div>
        ))}
      </div>

      {statusMessage && <p className="mt-5 text-sm text-muted">{statusMessage}</p>}
    </section>
  );
}
