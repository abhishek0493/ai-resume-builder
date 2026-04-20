// ──────────────────────────────────────────────────────────────
// Route Aggregator
// ──────────────────────────────────────────────────────────────
// Single point of registration for all route modules.
// server.ts imports this file, and this file imports every
// feature's routes.  Keeps server.ts clean and makes it
// trivial to add new route modules.
//
// Route map:
//   /api/auth/*        → auth.routes
//   /api/resume/*      → resume.routes
//   /api/analyze       → analyze.routes
//   /api/generate/*    → generate.routes
//   /api/history       → history.routes
//   /api/health        → inline health check
// ──────────────────────────────────────────────────────────────

import { Router, Request, Response } from 'express';

import authRoutes from './auth.routes';
import resumeRoutes from './resume.routes';
import analyzeRoutes from './analyze.routes';
import generateRoutes from './generate.routes';
import historyRoutes from './history.routes';

const router = Router();

// Health check — no auth needed, used by load balancers / uptime monitors
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'AI Resume Tailor API is running',
    timestamp: new Date().toISOString(),
  });
});

// Feature routes
router.use('/auth', authRoutes);
router.use('/resume', resumeRoutes);
router.use('/analyze', analyzeRoutes);
router.use('/generate', generateRoutes);
router.use('/history', historyRoutes);

export default router;
