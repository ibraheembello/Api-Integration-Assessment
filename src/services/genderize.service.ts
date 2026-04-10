import { GenderizeResponse, ProcessedData } from "../types";

export class GenderizeService {
  /**
   * Fetches data from external API and applies business logic
   */
  public static async classifyName(name: string): Promise<ProcessedData> {
    const response = await fetch(
      `https://api.genderize.io/?name=${encodeURIComponent(name)}`,
    );

    if (!response.ok) {
      throw new Error("Upstream server failure");
    }

    const data = (await response.json()) as GenderizeResponse;

    // Edge case handling specified in requirements
    if (data.gender === null || data.count === 0) {
      throw new Error("No prediction available for the provided name");
    }

    // Process logic
    const sample_size = data.count;
    const is_confident = data.probability >= 0.7 && sample_size >= 100;

    return {
      name: data.name,
      gender: data.gender,
      probability: data.probability,
      sample_size: sample_size,
      is_confident: is_confident,
      processed_at: new Date().toISOString(),
    };
  }
}
