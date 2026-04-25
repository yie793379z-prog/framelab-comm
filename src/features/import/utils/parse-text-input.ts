import type { SampleMetadata, SampleRecord } from "@/types/sample";

export function buildSampleId(seed: number, index: number) {
  return `sample-${seed}-${index + 1}`;
}

export function buildSampleTitle(text: string, index: number) {
  const firstLine = text.split("\n")[0]?.trim() ?? "";

  if (!firstLine) {
    return `Sample ${index + 1}`;
  }

  return firstLine.length > 72 ? `${firstLine.slice(0, 69)}...` : firstLine;
}

export function splitTextIntoBlocks(input: string) {
  return input
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split(/\n\s*\n/g)
    .map((item) => item.trim())
    .filter(Boolean);
}

type ParseTextInputOptions = {
  source?: string | ((text: string, index: number) => string | undefined);
  metadata?: SampleMetadata | ((text: string, index: number) => SampleMetadata | undefined);
  seed?: number;
};

export function parseTextInput(input: string, options?: ParseTextInputOptions): SampleRecord[] {
  const seed = options?.seed ?? Date.now();
  const blocks = splitTextIntoBlocks(input);

  return blocks.map((text, index) => ({
    id: buildSampleId(seed, index),
    title: buildSampleTitle(text, index),
    text,
    source:
      typeof options?.source === "function"
        ? options.source(text, index)
        : options?.source ?? "Manual paste",
    metadata:
      typeof options?.metadata === "function"
        ? options.metadata(text, index)
        : options?.metadata
  }));
}
