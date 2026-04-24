"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { useWorkspace } from "@/features/coding/state/workspace-context";
import { importProjectJson, type LoadProjectErrorKey } from "@/features/export/utils/import-project-json";
import { buildCsvExport } from "@/features/export/utils/export-csv";
import { buildJsonExport } from "@/features/export/utils/export-json";
import { buildMarkdownExport } from "@/features/export/utils/export-markdown";
import { downloadTextFile } from "@/lib/utils/download-file";
import { analysisTemplates } from "@/features/templates/data/templates";
import { useLanguage } from "@/i18n/context";
import { formatMessage, getLocalizedText } from "@/i18n/utils";
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

export function ExportPanel() {
  const { state, dispatch } = useWorkspace();
  const { locale, messages } = useLanguage();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [projectJsonInput, setProjectJsonInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const pastedJsonId = "project-json-input";
  const selectedTemplate = analysisTemplates.find((template) => template.id === state.selectedTemplateId) ?? null;
  const hasWorkspaceData = state.samples.length > 0;

  function getLoadErrorMessage(errorKey: LoadProjectErrorKey) {
    switch (errorKey) {
      case "empty":
        return messages.exportPanel.emptyError;
      case "invalidJson":
        return messages.exportPanel.invalidJsonError;
      case "invalidRoot":
        return messages.exportPanel.invalidRootError;
      case "invalidSamples":
        return messages.exportPanel.invalidSamplesError;
      case "invalidTemplate":
        return messages.exportPanel.invalidTemplateError;
      case "invalidCodingResults":
        return messages.exportPanel.invalidCodingResultsError;
      case "inconsistentCodingResults":
        return messages.exportPanel.inconsistentCodingResultsError;
      case "wrongFormat":
        return messages.exportPanel.wrongFormatError;
      default:
        return messages.exportPanel.invalidJsonError;
    }
  }

  function handleExport(format: ExportFormat) {
    if (!hasWorkspaceData) {
      return;
    }

    let content = "";

    if (format === "csv") {
      content = buildCsvExport(state, locale);
    }

    if (format === "json") {
      content = buildJsonExport(state, locale);
    }

    if (format === "markdown") {
      content = buildMarkdownExport(state, locale);
    }

    downloadTextFile(EXPORT_FILENAMES[format], content, EXPORT_MIME_TYPES[format]);
    setStatusMessage(formatMessage(messages.exportPanel.downloaded, { filename: EXPORT_FILENAMES[format] }));
  }

  function applyProjectJson(rawInput: string) {
    const result = importProjectJson(rawInput);

    if (!result.success) {
      setStatusMessage(getLoadErrorMessage(result.errorKey));
      return;
    }

    const shouldReplace = window.confirm(messages.exportPanel.replaceConfirm);

    if (!shouldReplace) {
      return;
    }

    dispatch({
      type: "LOAD_PROJECT",
      payload: result.data
    });

    setProjectJsonInput("");
    setStatusMessage(messages.exportPanel.loadSuccess);
  }

  async function handleFileSelection(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const content = await file.text();
    setProjectJsonInput(content);
    applyProjectJson(content);
    event.target.value = "";
  }

  return (
    <section className="surface-card p-6 md:p-7">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold tracking-tight text-ink">{messages.exportPanel.title}</h3>
        <p className="text-sm leading-7 text-muted">{messages.exportPanel.description}</p>
      </div>
      <div className="mt-4 helper-note">{messages.exportPanel.workflowNote}</div>

      {!hasWorkspaceData && (
        <div className="surface-muted mt-5 p-4">
          <p className="text-sm leading-7 text-muted">{messages.exportPanel.noProjectYet}</p>
        </div>
      )}

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <div className="metric-card">
          <p className="text-sm text-muted">{messages.common.samples}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-ink">{state.samples.length}</p>
        </div>
        <div className="metric-card">
          <p className="text-sm text-muted">{messages.common.codedRows}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-ink">{state.codingRows.length}</p>
        </div>
        <div className="metric-card">
          <p className="text-sm text-muted">{messages.common.selectedTemplate}</p>
          <p className="mt-2 text-base font-semibold tracking-tight text-ink">
            {selectedTemplate ? getLocalizedText(selectedTemplate.name, locale) : messages.common.noTemplateSelected}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1fr_1.05fr]">
        <div className="surface-panel p-5">
          <div className="space-y-2">
            <h4 className="text-lg font-semibold tracking-tight text-ink">{messages.exportPanel.title}</h4>
            <p className="text-sm leading-7 text-muted">{messages.exportPanel.description}</p>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-3 xl:grid-cols-1">
            {(["csv", "json", "markdown"] as ExportFormat[]).map((format) => (
              <div key={format} className="surface-card p-4 shadow-none">
                <p className="text-base font-semibold text-ink">
                  {format === "csv" && messages.exportPanel.exportCsv}
                  {format === "json" && messages.exportPanel.exportJson}
                  {format === "markdown" && messages.exportPanel.exportMarkdown}
                </p>
                <p className="mt-2 text-sm leading-7 text-muted">
                  {format === "csv" && messages.exportPanel.csvDescription}
                  {format === "json" && messages.exportPanel.jsonDescription}
                  {format === "markdown" && messages.exportPanel.markdownDescription}
                </p>
                <button
                  type="button"
                  onClick={() => handleExport(format)}
                  disabled={!hasWorkspaceData}
                  className="button-primary mt-4 w-full px-4 py-2.5"
                >
                  {format === "csv" && messages.exportPanel.exportCsv}
                  {format === "json" && messages.exportPanel.exportJson}
                  {format === "markdown" && messages.exportPanel.exportMarkdown}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="surface-panel p-5">
          <div className="space-y-2">
            <h4 className="text-lg font-semibold tracking-tight text-ink">{messages.exportPanel.loadTitle}</h4>
            <p className="text-sm leading-7 text-muted">{messages.exportPanel.loadDescription}</p>
          </div>

          <div className="mt-4 surface-card p-4 shadow-none">
            <p className="text-sm leading-7 text-muted">{messages.exportPanel.chooseFileHelp}</p>
            <div className="mt-3 flex flex-wrap gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json,.json"
                onChange={handleFileSelection}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="button-primary px-4 py-2.5"
              >
                {messages.exportPanel.chooseFile}
              </button>
            </div>
          </div>

          <div className="mt-4 surface-card p-4 shadow-none">
            <label htmlFor={pastedJsonId} className="block text-sm font-medium text-ink">
              {messages.exportPanel.pasteLabel}
            </label>
            <p className="mt-2 text-sm leading-7 text-muted">{messages.exportPanel.pasteHelp}</p>
            <textarea
              id={pastedJsonId}
              value={projectJsonInput}
              onChange={(event) => setProjectJsonInput(event.target.value)}
              placeholder={messages.exportPanel.pastePlaceholder}
              className="field-textarea mt-3 min-h-44 bg-white"
            />
            <button
              type="button"
              onClick={() => applyProjectJson(projectJsonInput)}
              className="button-secondary mt-4 px-4 py-2.5"
            >
              {messages.exportPanel.loadFromPaste}
            </button>
          </div>
        </div>
      </div>

      {statusMessage && <p className="mt-5 text-sm leading-7 text-muted">{statusMessage}</p>}
    </section>
  );
}
