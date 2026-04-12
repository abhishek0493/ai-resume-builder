// ──────────────────────────────────────────────────────────────
// History Routes
// ──────────────────────────────────────────────────────────────
// GET /  — Fetch all past analyses for the authenticated user
// ──────────────────────────────────────────────────────────────

import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import * as historyController from "../controllers/history.controller";

const router = Router();

router.get("/", authMiddleware, historyController.getHistory);

export default router;
