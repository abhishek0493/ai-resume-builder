// ──────────────────────────────────────────────────────────────
// Resume Routes
// ──────────────────────────────────────────────────────────────
// POST /upload   — Save resume text
// GET  /         — List user's resumes
//
// Validation: Zod ensures resumeText is present and non-empty
// before the controller ever runs.
// ──────────────────────────────────────────────────────────────

import { Router } from "express";
import { z } from "zod";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import * as resumeController from "../controllers/resume.controller";

const router = Router();

const uploadResumeSchema = z.object({
  resumeText: z
    .string()
    .min(50, "Resume text must be at least 50 characters"),
  fileName: z.string().optional(),
});

router.post(
  "/upload",
  authMiddleware,
  validate(uploadResumeSchema),
  resumeController.uploadResume
);

router.get("/", authMiddleware, resumeController.getResumes);

export default router;
