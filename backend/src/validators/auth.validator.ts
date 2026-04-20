// ──────────────────────────────────────────────────────────────
// Auth Validators
// ──────────────────────────────────────────────────────────────
// Zod schemas for every auth endpoint.  Imported by the route
// layer and passed to the validate() middleware — controllers
// receive only already-validated, typed data.
// ──────────────────────────────────────────────────────────────

import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1).max(100).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Inferred types — use these in service/controller signatures
// instead of redeclaring the same shape manually.
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
