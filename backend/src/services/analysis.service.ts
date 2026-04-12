// ──────────────────────────────────────────────────────────────
// Analysis Service — Orchestrates the Analyze + Generate Flow
// ──────────────────────────────────────────────────────────────
// This service coordinates between:
//   1. The database (read resume, store JD, persist results)
//   2. The AI service (call OpenAI for scoring / generation)
//
// Controllers call this service's high-level methods; this
// service calls ai.service.ts for AI and Prisma for DB.
// ──────────────────────────────────────────────────────────────

import prisma from "../utils/prisma";
import logger from "../utils/logger";
import * as aiService from "./ai.service";
import { AnalyzeBody } from "../types";

/**
 * Full analysis flow:
 *   1. Fetch the resume from DB
 *   2. Create a JobDescription record
 *   3. Call OpenAI for analysis
 *   4. Persist the AnalysisResult
 *   5. Return the saved result
 */
export async function runAnalysis(userId: string, body: AnalyzeBody) {
  logger.info("Running analysis", { userId, resumeId: body.resumeId });

  // 1. Fetch resume
  const resume = await prisma.resume.findFirst({
    where: { id: body.resumeId, userId },
  });

  if (!resume) {
    const err = new Error("Resume not found") as Error & { statusCode?: number };
    err.statusCode = 404;
    throw err;
  }

  // 2. Create JD record
  const jobDescription = await prisma.jobDescription.create({
    data: {
      userId,
      title: body.jobTitle || null,
      company: body.company || null,
      jdText: body.jdText,
    },
  });

  // 3. Call AI
  const analysis = await aiService.analyzeResumeAgainstJD(
    resume.resumeText,
    body.jdText
  );

  // 4. Persist result
  const analysisResult = await prisma.analysisResult.create({
    data: {
      userId,
      resumeId: resume.id,
      jobDescriptionId: jobDescription.id,
      matchScore: analysis.matchScore,
      missingSkills: analysis.missingSkills,
      recommendations: analysis.recommendations,
      summary: analysis.summary,
    },
    include: {
      resume: { select: { id: true, fileName: true } },
      jobDescription: { select: { id: true, title: true, company: true } },
    },
  });

  logger.info("Analysis persisted", {
    analysisId: analysisResult.id,
    matchScore: analysis.matchScore,
  });

  return analysisResult;
}

/**
 * Generate a cover letter for an existing analysis result.
 */
export async function generateCoverLetter(
  userId: string,
  analysisResultId: string
) {
  logger.info("Generating cover letter", { userId, analysisResultId });

  // Fetch analysis + related resume & JD
  const analysis = await prisma.analysisResult.findFirst({
    where: { id: analysisResultId, userId },
    include: {
      resume: true,
      jobDescription: true,
    },
  });

  if (!analysis) {
    const err = new Error("Analysis result not found") as Error & { statusCode?: number };
    err.statusCode = 404;
    throw err;
  }

  const coverLetter = await aiService.generateCoverLetter(
    analysis.resume.resumeText,
    analysis.jobDescription.jdText,
    {
      matchScore: analysis.matchScore,
      missingSkills: analysis.missingSkills as string[],
      recommendations: (analysis.recommendations as string[]) || [],
      summary: analysis.summary || "",
    }
  );

  // Upsert generated content (create or update)
  const generatedContent = await prisma.generatedContent.upsert({
    where: { analysisResultId },
    create: {
      analysisResultId,
      coverLetter,
    },
    update: {
      coverLetter,
    },
  });

  return generatedContent;
}

/**
 * Generate a tailored resume for an existing analysis result.
 */
export async function generateTailoredResume(
  userId: string,
  analysisResultId: string
) {
  logger.info("Generating tailored resume", { userId, analysisResultId });

  const analysis = await prisma.analysisResult.findFirst({
    where: { id: analysisResultId, userId },
    include: {
      resume: true,
      jobDescription: true,
    },
  });

  if (!analysis) {
    const err = new Error("Analysis result not found") as Error & { statusCode?: number };
    err.statusCode = 404;
    throw err;
  }

  const tailoredResume = await aiService.generateTailoredResume(
    analysis.resume.resumeText,
    analysis.jobDescription.jdText,
    {
      matchScore: analysis.matchScore,
      missingSkills: analysis.missingSkills as string[],
      recommendations: (analysis.recommendations as string[]) || [],
      summary: analysis.summary || "",
    }
  );

  const generatedContent = await prisma.generatedContent.upsert({
    where: { analysisResultId },
    create: {
      analysisResultId,
      generatedResume: tailoredResume,
    },
    update: {
      generatedResume: tailoredResume,
    },
  });

  return generatedContent;
}

/**
 * Get the full analysis history for a user, with all related data.
 */
export async function getHistory(userId: string) {
  return prisma.analysisResult.findMany({
    where: { userId },
    include: {
      resume: { select: { id: true, fileName: true } },
      jobDescription: { select: { id: true, title: true, company: true } },
      generatedContent: true,
    },
    orderBy: { createdAt: "desc" },
  });
}
