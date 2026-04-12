// ──────────────────────────────────────────────────────────────
// Analyze Routes
// ──────────────────────────────────────────────────────────────
// POST /  — Run AI analysis on a resume + job description pair
//
// Requires an existing resumeId (upload first) and the raw JD
// text.  jobTitle and company are optional metadata.
// ──────────────────────────────────────────────────────────────

import { Router } from "express";
import { z } from "zod";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import * as analyzeController from "../controllers/analyze.controller";

const router = Router();

const analyzeSchema = z.object({
  resumeId: z.string().uuid("Invalid resume ID"),
  jdText: z
    .string()
    .min(50, "Job description must be at least 50 characters"),
  jobTitle: z.string().optional(),
  company: z.string().optional(),
});

router.post(
  "/",
  authMiddleware,
  validate(analyzeSchema),
  analyzeController.analyze
);

export default router;
