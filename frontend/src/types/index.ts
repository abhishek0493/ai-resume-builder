// ──────────────────────────────────────────────────────────────
// Shared TypeScript Interfaces — Frontend
// ──────────────────────────────────────────────────────────────
// Mirror the API response shapes so every component has strict
// typing.  These are kept separate from the backend types
// because the frontend never sees internal fields like password
// hashes.
// ──────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface Resume {
  id: string;
  fileName: string;
  resumeText: string;
  createdAt: string;
}

export interface JobDescription {
  id: string;
  title?: string;
  company?: string;
  jdText: string;
  createdAt: string;
}

export interface AnalysisResult {
  id: string;
  matchScore: number;
  missingSkills: string[];
  recommendations: string[];
  summary: string;
  createdAt: string;
  resume: Pick<Resume, "id" | "fileName">;
  jobDescription: Pick<JobDescription, "id" | "title" | "company">;
  generatedContent?: GeneratedContent | null;
}

export interface GeneratedContent {
  id: string;
  generatedResume?: string | null;
  coverLetter?: string | null;
  createdAt: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  details?: { field: string; message: string }[];
}

// ─── Request Bodies ──────────────────────────────────────────

export interface UploadResumePayload {
  resumeText: string;
  fileName?: string;
}

export interface AnalyzePayload {
  resumeId: string;
  jdText: string;
  jobTitle?: string;
  company?: string;
}

export interface GeneratePayload {
  analysisResultId: string;
}
