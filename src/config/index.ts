import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || "development",
  genderizeApiUrl: process.env.GENDERIZE_API_URL || "https://api.genderize.io",
  cacheTtl: parseInt(process.env.CACHE_TTL || "3600", 10),
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10), // 15 minutes
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || "100", 10),
};
