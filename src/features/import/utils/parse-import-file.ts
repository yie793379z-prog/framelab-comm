import { parseCsvImport, type CsvImportErrorKey } from "@/features/import/utils/parse-csv";
import { parseTextInput } from "@/features/import/utils/parse-text-input";
import type { SampleRecord } from "@/types/sample";

export type FileImportErrorKey = "unsupportedType" | "readFailed" | CsvImportErrorKey;

export type FileImportResult =
  | {
      success: true;
      kind: "text" | "csv";
      fileName: string;
      rawText: string;
      samples: SampleRecord[];
      detectedTextColumn?: string;
      skippedRowCount?: number;
    }
  | {
      success: false;
      errorKey: FileImportErrorKey;
    };

function getFileExtension(fileName: string) {
  const parts = fileName.toLowerCase().split(".");
  return parts.length > 1 ? parts.at(-1) : "";
}

export async function parseImportFile(file: File): Promise<FileImportResult> {
  const extension = getFileExtension(file.name);

  if (!["txt", "md", "csv"].includes(extension ?? "")) {
    return {
      success: false,
      errorKey: "unsupportedType"
    };
  }

  let rawText = "";

  try {
    rawText = await file.text();
  } catch {
    return {
      success: false,
      errorKey: "readFailed"
    };
  }

  if (extension === "csv") {
    const csvResult = parseCsvImport(rawText, file.name);

    if (!csvResult.success) {
      return csvResult;
    }

    return {
      success: true,
      kind: "csv",
      fileName: file.name,
      rawText,
      samples: csvResult.samples,
      detectedTextColumn: csvResult.textColumn,
      skippedRowCount: csvResult.skippedRowCount
    };
  }

  return {
    success: true,
    kind: "text",
    fileName: file.name,
    rawText,
    samples: parseTextInput(rawText, {
      source: file.name
    })
  };
}
