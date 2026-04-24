export type CodingFieldValue = string | string[] | number | boolean | null;

export interface CodingRow {
  sampleId: string;
  values: Record<string, CodingFieldValue>;
}
