// ──────────────────────────────────────────────────────────────
// AI Service — All OpenAI Interactions
// ──────────────────────────────────────────────────────────────
// This is the ONLY file that talks to the OpenAI API.
//
// Why isolate AI here?
//   1. Single place to change models (gpt-4o → gpt-4.1, etc.)
//   2. Easy to add caching, rate-limiting, or cost tracking
//   3. Testable — mock this service in unit tests
//   4. If you swap to Anthropic/Gemini tomorrow, only this file
//      changes
//
// Each method returns a structured, typed response — never raw
// API output — so controllers stay clean.
// ──────────────────────────────────────────────────────────────

import openai from "../utils/openai";
import logger from "../utils/logger";
import { AnalysisOutput } from "../types";

/**
 * Analyse a resume against a job description.
 * Returns a structured match score, missing skills, and recommendations.
 */
export async function analyzeResumeAgainstJD(
  resumeText: string,
  jdText: string
): Promise<AnalysisOutput> {
  logger.info("Starting AI resume analysis");

  const prompt = `You are an expert career coach and ATS (Applicant Tracking System) specialist.

Analyze the following resume against the job description and provide a detailed assessment.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jdText}

Respond in the following JSON format ONLY (no additional text):
{
  "matchScore": <number 0-100>,
  "missingSkills": [<list of skills/qualifications from the JD that are missing in the resume>],
  "recommendations": [<list of specific, actionable suggestions to improve the resume for this role>],
  "summary": "<2-3 paragraph analysis of how well the resume matches, key strengths, and main gaps>"
}

Be honest and precise. The matchScore should reflect real ATS compatibility.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3, // Low temp for consistent, factual analysis
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error("Empty response from OpenAI during analysis");
  }

  const result: AnalysisOutput = JSON.parse(content);
  logger.info("AI analysis complete", { matchScore: result.matchScore });
  return result;
}

/**
 * Generate a tailored cover letter based on the resume, JD, and
 * the prior analysis results.
 */
export async function generateCoverLetter(
  resumeText: string,
  jdText: string,
  matchAnalysis: AnalysisOutput
): Promise<string> {
  logger.info("Generating cover letter via AI");

  const prompt = `You are an expert resume writer and career coach.

Based on the following information, write a compelling, professional cover letter.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jdText}

MATCH ANALYSIS:
- Match Score: ${matchAnalysis.matchScore}/100
- Key Gaps: ${matchAnalysis.missingSkills.join(", ")}
- Recommendations: ${matchAnalysis.recommendations.join("; ")}

INSTRUCTIONS:
1. Address the key strengths shown in the resume that align with the JD
2. Professionally frame any skill gaps as areas of active growth
3. Use a confident but genuine tone
4. Keep it under 400 words
5. Do NOT include placeholder brackets like [Company Name] — use the actual company name from the JD if available, otherwise keep it generic
6. Return ONLY the cover letter text, no JSON wrapping`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7, // Higher temp for more creative writing
  });

  const coverLetter = completion.choices[0]?.message?.content;
  if (!coverLetter) {
    throw new Error("Empty response from OpenAI during cover letter generation");
  }

  logger.info("Cover letter generated successfully");
  return coverLetter;
}

/**
 * Generate a tailored resume rewrite that better matches the JD
 * while preserving the candidate's authentic experience.
 */
export async function generateTailoredResume(
  resumeText: string,
  jdText: string,
  matchAnalysis: AnalysisOutput
): Promise<string> {
  logger.info("Generating tailored resume via AI");

  const prompt = `You are an expert resume writer specialising in ATS optimisation.

ORIGINAL RESUME:
${resumeText}

TARGET JOB DESCRIPTION:
${jdText}

MATCH ANALYSIS:
- Current Match Score: ${matchAnalysis.matchScore}/100
- Missing Skills: ${matchAnalysis.missingSkills.join(", ")}
- Recommendations: ${matchAnalysis.recommendations.join("; ")}

INSTRUCTIONS:
1. Rewrite the resume to maximise ATS compatibility with the target JD
2. Incorporate relevant keywords from the JD naturally
3. Reframe existing experience to highlight relevance
4. Do NOT fabricate experience — only rephrase and emphasise what's already there
5. Maintain professional formatting (use clear section headers)
6. Keep it concise (max 2 pages worth of content)
7. Return ONLY the resume text, no JSON wrapping or commentary`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.5,
  });

  const tailoredResume = completion.choices[0]?.message?.content;
  if (!tailoredResume) {
    throw new Error("Empty response from OpenAI during resume generation");
  }

  logger.info("Tailored resume generated successfully");
  return tailoredResume;
}
