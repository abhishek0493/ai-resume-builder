// ──────────────────────────────────────────────────────────────
// Express Server Entry Point
// ──────────────────────────────────────────────────────────────
// Bootstraps the Express application with:
//   • dotenv config (loaded first, before anything reads env)
//   • CORS (locked to FRONTEND_URL)
//   • JSON + cookie parsing
//   • All API routes under /api
//   • Global error handler (must be registered LAST)
//
// In production, you'd add helmet, compression, rate-limiting,
// and HTTPS here.
// ──────────────────────────────────────────────────────────────

import dotenv from "dotenv";
dotenv.config(); // Must be first — other modules read process.env at import time

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes";
import { errorMiddleware } from "./middlewares/error.middleware";
import logger from "./utils/logger";

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Global Middleware ───────────────────────────────────────

// CORS — only allow the frontend origin
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true, // needed for httpOnly cookie auth
  })
);

// Parse JSON bodies (limit to 10MB for large resume text)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Parse cookies (for JWT stored in httpOnly cookie)
app.use(cookieParser());

// ─── Routes ──────────────────────────────────────────────────

app.use("/api", routes);

// ─── Error Handler (must be last) ────────────────────────────

app.use(errorMiddleware);

// ─── Start Server ────────────────────────────────────────────

app.listen(PORT, () => {
  logger.info(`🚀 Server running on http://localhost:${PORT}`);
  logger.info(`📋 Health check: http://localhost:${PORT}/api/health`);
  logger.info(`🌐 CORS origin: ${process.env.FRONTEND_URL || "http://localhost:3000"}`);
});

export default app;
