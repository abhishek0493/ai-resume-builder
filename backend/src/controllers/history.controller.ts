// ──────────────────────────────────────────────────────────────
// History Controller
// ──────────────────────────────────────────────────────────────
// GET /api/history — returns all analysis results for the
// authenticated user, including related resume metadata, JD
// info, and any generated content.
// ──────────────────────────────────────────────────────────────

import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";
import * as analysisService from "../services/analysis.service";

export const getHistory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const history = await analysisService.getHistory(userId);

    res.json({
      success: true,
      data: history,
    });
  } catch (error) {
    next(error);
  }
};
