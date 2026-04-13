import NodeCache from "node-cache";
import { ExternalApiClient } from "../clients/external-api.client";
import { config } from "../config";
import { NotFoundError } from "../errors/app.error";
import { GenderizeResponse, ProcessedData } from "../types";

export class GenderizeService {
  private cache: NodeCache;

  constructor() {
    this.cache = new NodeCache({ stdTTL: config.cacheTtl });
  }

  /**
   * Fetches data from external API and applies business logic
   */
  public async classifyName(name: string): Promise<ProcessedData> {
    const cacheKey = `name_${name.toLowerCase()}`;
    const cachedData = this.cache.get<ProcessedData>(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const data = await ExternalApiClient.fetch<GenderizeResponse>(
      `${config.genderizeApiUrl}/?name=${encodeURIComponent(name)}`,
    );

    // Edge case handling specified in requirements
    if (data.gender === null || data.count === 0) {
      throw new NotFoundError("No prediction available for the provided name");
    }

    // Process logic
    const sample_size = data.count;
    const is_confident = data.probability >= 0.7 && sample_size >= 100;

    const processedData: ProcessedData = {
      name: data.name,
      gender: data.gender,
      probability: data.probability,
      sample_size: sample_size,
      is_confident: is_confident,
      processed_at: new Date().toISOString(),
    };

    this.cache.set(cacheKey, processedData);

    return processedData;
  }
}
