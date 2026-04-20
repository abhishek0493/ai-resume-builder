// ──────────────────────────────────────────────────────────────
// Resume Validators
// ──────────────────────────────────────────────────────────────

import { z } from 'zod';

export const uploadResumeSchema = z.object({
  resumeText: z.string().min(50, 'Resume text must be at least 50 characters'),
  fileName: z.string().optional(),
});

export type UploadResumeInput = z.infer<typeof uploadResumeSchema>;
