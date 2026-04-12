// ──────────────────────────────────────────────────────────────
// Shared TypeScript Types
// ──────────────────────────────────────────────────────────────
// These interfaces are _not_ Prisma-generated — they represent
// the shapes flowing through our API layer (request bodies,
// response payloads, service return types).  Prisma types are
// used for DB access, these for everything else.
// ──────────────────────────────────────────────────────────────

import { Request } from "express";

// ─── Auth ────────────────────────────────────────────────────

export interface JwtPayload {
  userId: string;
  email: string;
}

/** Express Request with authenticated user attached by auth middleware */
export interface AuthRequest extends Request {
  user?: JwtPayload;
}

// ─── Resume Upload ───────────────────────────────────────────

export interface UploadResumeBody {
  resumeText: string;
  fileName?: string;
}

// ─── Analysis ────────────────────────────────────────────────

export interface AnalyzeBody {
  resumeId: string;
  jdText: string;
  jobTitle?: string;
  company?: string;
}

export interface AnalysisOutput {
  matchScore: number;
  missingSkills: string[];
  recommendations: string[];
  summary: string;
}

// ─── Generation ──────────────────────────────────────────────

export interface GenerateCoverLetterBody {
  analysisResultId: string;
}

export interface GenerateResumeBody {
  analysisResultId: string;
}

// ─── API Responses ───────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
