// Type definitions for standardizing data structures
export interface GenderizeResponse {
  count: number;
  name: string;
  gender: string | null;
  probability: number;
}

export interface ProcessedData {
  name: string;
  gender: string;
  probability: number;
  sample_size: number;
  is_confident: boolean;
  processed_at: string;
}
