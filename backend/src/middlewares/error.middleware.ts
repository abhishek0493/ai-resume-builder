// ──────────────────────────────────────────────────────────────
// Global Error Handler Middleware
// ──────────────────────────────────────────────────────────────
// Catches any error that propagates out of a route/controller.
// In dev, returns the full stack trace; in prod, returns a
// generic message so we don't leak internals.
// ──────────────────────────────────────────────────────────────

import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

export const errorMiddleware = (
  err: Error & { statusCode?: number },
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  logger.error(`[${statusCode}] ${message}`, {
    stack: err.stack,
  });

  res.status(statusCode).json({
    success: false,
    error:
      process.env.NODE_ENV === "production"
        ? "Something went wrong"
        : message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};
