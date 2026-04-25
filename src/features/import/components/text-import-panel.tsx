"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { useWorkspace } from "@/features/coding/state/workspace-context";
import { parseImportFile, type FileImportErrorKey } from "@/features/import/utils/parse-import-file";
import { splitTextIntoBlocks } from "@/features/import/utils/parse-text-input";
import { useLanguage } from "@/i18n/context";
import { formatMessage, getCountWord } from "@/i18n/utils";
import type { SampleRecord } from "@/types/sample";

export function TextImportPanel() {
  const { state, dispatch } = useWorkspace();
  const { locale, messages } = useLanguage();
  const textareaId = "workspace-import-text";
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [selectedFileKind, setSelectedFileKind] = useState<"text" | "csv" | null>(null);
  const [parsedFileSamples, setParsedFileSamples] = useState<SampleRecord[]>([]);
  const [detectedTextColumn, setDetectedTextColumn] = useState<string | null>(null);
  const [skippedRowCount, setSkippedRowCount] = useState(0);
  const [fileError, setFileError] = useState<string | null>(null);

  const previewCount =
    selectedFileKind === "csv" ? parsedFileSamples.length : splitTextIntoBlocks(state.importText).length;

  const sampleWord = getCountWord(locale, previewCount, "sample", "samples", "样本");
  const loadedSampleWord = getCountWord(locale, state.samples.length, "sample", "samples", "样本");

  function clearFileSelection() {
    setSelectedFileName(null);
    setSelectedFileKind(null);
    setParsedFileSamples([]);
    setDetectedTextColumn(null);
    setSkippedRowCount(0);
    setFileError(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function getFileErrorMessage(errorKey: FileImportErrorKey) {
    switch (errorKey) {
      case "unsupportedType":
        return messages.importPanel.unsupportedFileTypeError;
      case "readFailed":
        return messages.importPanel.readFileError;
      case "noTextColumn":
        return messages.importPanel.noKnownTextColumnError;
      case "invalidCsv":
        return messages.importPanel.invalidCsvError;
      case "empty":
        return messages.importPanel.emptyFileError;
      default:
        return messages.importPanel.readFileError;
    }
  }

  async function handleFileSelection(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const result = await parseImportFile(file);

    if (!result.success) {
      clearFileSelection();
      setFileError(getFileErrorMessage(result.errorKey));
      return;
    }

    setSelectedFileName(result.fileName);
    setFileError(null);

    if (result.kind === "text") {
      setSelectedFileKind("text");
      setParsedFileSamples([]);
      setDetectedTextColumn(null);
      setSkippedRowCount(0);
      dispatch({ type: "SET_IMPORT_TEXT", payload: result.rawText });
      return;
    }

    setSelectedFileKind("csv");
    setParsedFileSamples(result.samples);
    setDetectedTextColumn(result.detectedTextColumn ?? null);
    setSkippedRowCount(result.skippedRowCount ?? 0);
  }

  function handleLoadSamples() {
    if (selectedFileKind === "csv") {
      dispatch({
        type: "LOAD_SAMPLES",
        payload: parsedFileSamples
      });
      return;
    }

    dispatch({ type: "LOAD_SAMPLES_FROM_IMPORT" });
  }

  function handleClearImport() {
    dispatch({ type: "RESET_IMPORT_TEXT" });
    clearFileSelection();
  }

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
            <p className="text-sm font-semibold text-ink">{messages.importPanel.fileTypesTitle}</p>
            <p className="mt-2 text-sm leading-7 text-muted">{messages.importPanel.fileTypesDescription}</p>
            <p className="mt-2 text-sm leading-7 text-muted">{messages.importPanel.localFileNote}</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md,.csv,text/plain,text/markdown,text/csv"
              onChange={handleFileSelection}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="button-secondary mt-3 px-4 py-2.5"
            >
              {messages.importPanel.chooseFile}
            </button>
          </div>
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
        {selectedFileName && (
          <div className="surface-panel px-4 py-3">
            <p className="text-sm font-medium text-ink">
              {formatMessage(messages.importPanel.fileSelected, { filename: selectedFileName })}
            </p>
            {selectedFileKind === "csv" && detectedTextColumn && (
              <p className="mt-2 text-sm leading-7 text-muted">
                {formatMessage(messages.importPanel.csvColumnDetected, { column: detectedTextColumn })}
              </p>
            )}
            {selectedFileKind === "csv" && skippedRowCount > 0 && (
              <p className="mt-2 text-sm leading-7 text-muted">
                {formatMessage(messages.importPanel.skippedEmptyRows, { count: skippedRowCount })}
              </p>
            )}
          </div>
        )}

        {fileError && (
          <div className="rounded-[1.25rem] border border-[#d7a18d] bg-[#fff6f1] px-4 py-3">
            <p className="text-sm leading-7 text-ink">{fileError}</p>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-muted">
            {formatMessage(messages.importPanel.samplesDetected, { count: previewCount, sampleWord })}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleLoadSamples}
              disabled={!previewCount}
              className="button-primary px-4 py-2.5"
            >
              {messages.importPanel.load}
            </button>
            <button
              type="button"
              onClick={handleClearImport}
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
