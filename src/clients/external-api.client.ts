import { UpstreamError } from "../errors/app.error";
import { logger } from "../utils/logger";

export class ExternalApiClient {
  public static async fetch<T>(
    url: string,
    options: RequestInit = {},
    timeoutMs: number = 5000,
  ): Promise<T> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(id);

      if (!response.ok) {
        logger.error(`Upstream API error: ${response.status} ${response.statusText}`, { url });
        throw new UpstreamError();
      }

      return (await response.json()) as T;
    } catch (error: any) {
      clearTimeout(id);
      if (error.name === "AbortError") {
        logger.error(`Upstream API timeout: ${url}`);
        throw new UpstreamError("Upstream service timed out");
      }
      throw error;
    }
  }
}
