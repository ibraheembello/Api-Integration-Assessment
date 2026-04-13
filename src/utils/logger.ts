import winston from "winston";
import { config } from "../config";

const { combine, timestamp, printf, colorize, json } = winston.format;

const logFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message} `;
  if (Object.keys(metadata).length > 0) {
    msg += JSON.stringify(metadata);
  }
  return msg;
});

// On Vercel, we only use the Console transport because the filesystem is read-only
const transports: winston.transport[] = [
  new winston.transports.Console(),
];

// Only add file transports if we are NOT on Vercel
if (!process.env.VERCEL) {
  transports.push(
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  );
}

export const logger = winston.createLogger({
  level: config.env === "development" ? "debug" : "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    config.env === "development" ? colorize() : json(),
    config.env === "development" ? logFormat : json(),
  ),
  transports: transports,
});
