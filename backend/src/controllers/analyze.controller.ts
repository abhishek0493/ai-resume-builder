// ──────────────────────────────────────────────────────────────
// Analyze Controller
// ──────────────────────────────────────────────────────────────
// Handles POST /api/analyze — takes a resumeId + JD text,
// delegates to the analysis service which orchestrates the AI
// call and DB persistence.
// ──────────────────────────────────────────────────────────────

import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";
import * as analysisService from "../services/analysis.service";

export const analyze = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;

    const result = await analysisService.runAnalysis(userId, req.body);

    res.status(201).json({
      success: true,
      data: result,
      message: "Analysis complete",
    });
  } catch (error) {
    next(error);
  }
};
