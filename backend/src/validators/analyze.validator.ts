// ──────────────────────────────────────────────────────────────
// Analyze Validators
// ──────────────────────────────────────────────────────────────

import { z } from 'zod';

export const analyzeSchema = z.object({
  resumeId: z.string().uuid('Invalid resume ID'),
  jdText: z.string().min(50, 'Job description must be at least 50 characters'),
  jobTitle: z.string().optional(),
  company: z.string().optional(),
});

export type AnalyzeInput = z.infer<typeof analyzeSchema>;
