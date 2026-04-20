// ──────────────────────────────────────────────────────────────
// API Client — Centralised HTTP Layer
// ──────────────────────────────────────────────────────────────
// Every component imports from here instead of calling fetch
// directly.  Benefits:
//   • Base URL configured once
//   • Credentials (cookies) sent automatically
//   • Consistent error handling & typing
//   • Easy to add request/response interceptors later
// ──────────────────────────────────────────────────────────────

import {
  ApiResponse,
  User,
  AnalysisResult,
  Resume,
  GeneratedContent,
  UploadResumePayload,
  AnalyzePayload,
  GeneratePayload,
} from '@/types';

// ─── Auth Payload Types ──────────────────────────────────────

export interface RegisterPayload {
  email: string;
  password: string;
  name?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

type AuthResponse = ApiResponse<{ user: User }>;

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// ─── Generic fetch wrapper ───────────────────────────────────

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const url = `${BASE_URL}${endpoint}`;

  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // send httpOnly cookies
    ...options,
  });

  const data: ApiResponse<T> = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `API error: ${res.status}`);
  }

  return data;
}

// ─── Resume Endpoints ────────────────────────────────────────

export async function uploadResume(payload: UploadResumePayload) {
  return apiRequest<Resume>('/resume/upload', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getResumes() {
  return apiRequest<Resume[]>('/resume');
}

// ─── Analysis Endpoints ──────────────────────────────────────

export async function analyzeResume(payload: AnalyzePayload) {
  return apiRequest<AnalysisResult>('/analyze', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ─── Generation Endpoints ────────────────────────────────────

export async function generateCoverLetter(payload: GeneratePayload) {
  return apiRequest<GeneratedContent>('/generate/cover-letter', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function generateTailoredResume(payload: GeneratePayload) {
  return apiRequest<GeneratedContent>('/generate/resume', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ─── History Endpoints ───────────────────────────────────────

export async function getHistory() {
  return apiRequest<AnalysisResult[]>('/history');
}

// ─── Health Check ────────────────────────────────────────────

export async function healthCheck() {
  return apiRequest<{ message: string; timestamp: string }>('/health');
}

// ─── Auth Endpoints ──────────────────────────────────────────

export async function authRegister(payload: RegisterPayload): Promise<AuthResponse> {
  return apiRequest<{ user: User }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function authLogin(payload: LoginPayload): Promise<AuthResponse> {
  return apiRequest<{ user: User }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function authLogout(): Promise<ApiResponse> {
  return apiRequest('/auth/logout', { method: 'POST' });
}

export async function authMe(): Promise<AuthResponse> {
  return apiRequest<{ user: User }>('/auth/me');
}
