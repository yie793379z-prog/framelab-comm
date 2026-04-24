import type { SampleRecord } from "@/types/sample";

function buildSampleId(index: number) {
  return `sample-${index + 1}`;
}

export function parseTextInput(input: string): SampleRecord[] {
  const blocks = input
    .split(/\n\s*\n/g)
    .map((item) => item.trim())
    .filter(Boolean);

  return blocks.map((text, index) => ({
    id: buildSampleId(index),
    title: `Sample ${index + 1}`,
    text,
    source: "Manual paste"
  }));
}
