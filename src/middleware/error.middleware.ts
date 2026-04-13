import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app.error";
import { logger } from "../utils/logger";
import { config } from "../config";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = 500;
  let message = "Internal Server Error";
  let isOperational = false;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    isOperational = err.isOperational;
  }

  // Log errors
  if (!isOperational) {
    logger.error(`[Unexpected Error] ${err.message}`, {
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
    });
  } else {
    logger.warn(`[Operational Error] ${message}`, {
      url: req.originalUrl,
      method: req.method,
    });
  }

  res.status(statusCode).json({
    status: "error",
    message: message,
    ...(config.env === "development" && { stack: err.stack }),
  });
};
