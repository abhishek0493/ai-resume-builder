// ──────────────────────────────────────────────────────────────
// Validators — Barrel Export
// ──────────────────────────────────────────────────────────────
// Single import point for all Zod schemas.
//
// Usage in routes:
//   import { registerSchema } from '@/validators';
//   router.post('/register', validate(registerSchema), handler);
// ──────────────────────────────────────────────────────────────

export * from './auth.validator';
export * from './resume.validator';
export * from './analyze.validator';
export * from './generate.validator';
