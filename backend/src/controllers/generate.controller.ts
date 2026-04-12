// ──────────────────────────────────────────────────────────────
// Generate Controller
// ──────────────────────────────────────────────────────────────
// Handles cover letter and tailored resume generation endpoints.
// Both require an existing analysisResultId — you must run an
// analysis first before generating content.
// ──────────────────────────────────────────────────────────────

import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";
import * as analysisService from "../services/analysis.service";

export const generateCoverLetter = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const { analysisResultId } = req.body;

    const result = await analysisService.generateCoverLetter(
      userId,
      analysisResultId
    );

    res.status(201).json({
      success: true,
      data: result,
      message: "Cover letter generated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const generateResume = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const { analysisResultId } = req.body;

    const result = await analysisService.generateTailoredResume(
      userId,
      analysisResultId
    );

    res.status(201).json({
      success: true,
      data: result,
      message: "Tailored resume generated successfully",
    });
  } catch (error) {
    next(error);
  }
};
