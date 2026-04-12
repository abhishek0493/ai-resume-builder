// ──────────────────────────────────────────────────────────────
// Constants
// ──────────────────────────────────────────────────────────────

export const APP_NAME = "ResumeAI";
export const APP_DESCRIPTION =
  "AI-powered resume tailoring and job matching platform";

export const NAV_LINKS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Analyze", href: "/analyze" },
] as const;

export const SCORE_LABELS: Record<string, string> = {
  excellent: "Excellent Match",
  good: "Good Match",
  fair: "Fair Match",
  poor: "Needs Work",
};

export function getScoreLabel(score: number): string {
  if (score >= 80) return SCORE_LABELS.excellent;
  if (score >= 60) return SCORE_LABELS.good;
  if (score >= 40) return SCORE_LABELS.fair;
  return SCORE_LABELS.poor;
}
