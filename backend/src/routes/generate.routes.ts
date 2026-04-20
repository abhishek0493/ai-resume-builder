// ──────────────────────────────────────────────────────────────
// Generate Routes
// ──────────────────────────────────────────────────────────────
// POST /cover-letter  — Generate a cover letter from an analysis
// POST /resume        — Generate a tailored resume from an analysis
//
// Both require an analysisResultId — you must run /analyze first.
// ──────────────────────────────────────────────────────────────

import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { generateSchema } from '../validators';
import * as generateController from '../controllers/generate.controller';

const router = Router();

router.post(
  '/cover-letter',
  authMiddleware,
  validate(generateSchema),
  generateController.generateCoverLetter
);

router.post(
  '/resume',
  authMiddleware,
  validate(generateSchema),
  generateController.generateResume
);

export default router;
