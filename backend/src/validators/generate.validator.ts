// ──────────────────────────────────────────────────────────────
// Generate Validators
// ──────────────────────────────────────────────────────────────

import { z } from 'zod';

export const generateSchema = z.object({
  analysisResultId: z.string().uuid('Invalid analysis result ID'),
});

export type GenerateInput = z.infer<typeof generateSchema>;
