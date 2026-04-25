export interface SampleMetadata {
  platform?: string;
  date?: string;
  author?: string;
  url?: string;
}

export interface SampleRecord {
  id: string;
  title: string;
  text: string;
  source?: string;
  metadata?: SampleMetadata;
}
