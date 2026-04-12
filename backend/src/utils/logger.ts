// ──────────────────────────────────────────────────────────────
// Winston Logger
// ──────────────────────────────────────────────────────────────
// Structured logging with different transports per environment.
// In production you'd pipe the JSON transport to a log
// aggregation service (Datadog, Grafana Loki, etc.).
// ──────────────────────────────────────────────────────────────

import winston from "winston";

const { combine, timestamp, printf, colorize, json } = winston.format;

const devFormat = combine(
  colorize(),
  timestamp({ format: "HH:mm:ss" }),
  printf(({ level, message, timestamp, ...meta }) => {
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : "";
    return `${timestamp} [${level}]: ${message} ${metaStr}`;
  })
);

const prodFormat = combine(timestamp(), json());

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: process.env.NODE_ENV === "production" ? prodFormat : devFormat,
  transports: [new winston.transports.Console()],
  // In production, add file / remote transports here
});

export default logger;
