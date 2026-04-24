import type { SampleRecord } from "@/types/sample";

function buildSampleId(seed: number, index: number) {
  return `sample-${seed}-${index + 1}`;
}

function buildSampleTitle(text: string, index: number) {
  const firstLine = text.split("\n")[0]?.trim() ?? "";

  if (!firstLine) {
    return `Sample ${index + 1}`;
  }

  return firstLine.length > 72 ? `${firstLine.slice(0, 69)}...` : firstLine;
}

export function parseTextInput(input: string): SampleRecord[] {
  const seed = Date.now();
  const blocks = input
    .split(/\n\s*\n/g)
    .map((item) => item.trim())
    .filter(Boolean);

  return blocks.map((text, index) => ({
    id: buildSampleId(seed, index),
    title: buildSampleTitle(text, index),
    text,
    source: "Manual paste"
  }));
}
