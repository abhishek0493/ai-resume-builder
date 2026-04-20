// ──────────────────────────────────────────────────────────────
// Auth Routes
// ──────────────────────────────────────────────────────────────
// POST /api/auth/register   — create account + set cookie
// POST /api/auth/login      — sign in + set cookie
// POST /api/auth/logout     — clear cookie
// GET  /api/auth/me         — return current user (auth-gated)
//
// Validation is handled by the validate() middleware using schemas
// defined in src/validators/auth.validator.ts — controllers
// receive only already-validated data.
// ──────────────────────────────────────────────────────────────

import { Router } from 'express';
import { register, login, logout, me } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { registerSchema, loginSchema } from '../validators';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);
router.get('/me', authMiddleware, me);

export default router;
