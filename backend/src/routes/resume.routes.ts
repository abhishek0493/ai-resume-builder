// ──────────────────────────────────────────────────────────────
// Resume Routes
// ──────────────────────────────────────────────────────────────
// POST /upload   — Save resume text
// GET  /         — List user's resumes
// ──────────────────────────────────────────────────────────────

import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { uploadResumeSchema } from '../validators';
import * as resumeController from '../controllers/resume.controller';

const router = Router();

router.post(
  '/upload',
  authMiddleware,
  validate(uploadResumeSchema),
  resumeController.uploadResume
);

router.get('/', authMiddleware, resumeController.getResumes);

export default router;
