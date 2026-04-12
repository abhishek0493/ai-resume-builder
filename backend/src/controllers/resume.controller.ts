// ──────────────────────────────────────────────────────────────
// Resume Controller
// ──────────────────────────────────────────────────────────────
// Handles the POST /api/resume/upload endpoint.
// Controllers are intentionally thin — they parse the request,
// delegate to a service, and format the response.  No business
// logic belongs here.
// ──────────────────────────────────────────────────────────────

import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";
import * as resumeService from "../services/resume.service";

export const uploadResume = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { resumeText, fileName } = req.body;
    const userId = req.user!.userId;

    const resume = await resumeService.createResume(userId, resumeText, fileName);

    res.status(201).json({
      success: true,
      data: resume,
      message: "Resume uploaded successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getResumes = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const resumes = await resumeService.getResumesByUser(userId);

    res.json({
      success: true,
      data: resumes,
    });
  } catch (error) {
    next(error);
  }
};
