// ──────────────────────────────────────────────────────────────
// Resume Service — Resume CRUD Operations
// ──────────────────────────────────────────────────────────────
// Handles persistence for uploaded resumes.  Keeps data-access
// logic out of controllers, making both layers easier to test.
// ──────────────────────────────────────────────────────────────

import prisma from "../utils/prisma";
import logger from "../utils/logger";

/**
 * Save a new resume for the given user.
 */
export async function createResume(
  userId: string,
  resumeText: string,
  fileName?: string
) {
  logger.info("Saving resume", { userId, fileName });

  const resume = await prisma.resume.create({
    data: {
      userId,
      resumeText,
      fileName: fileName || "Untitled Resume",
    },
  });

  return resume;
}

/**
 * Get a single resume by ID (with ownership check).
 */
export async function getResumeById(resumeId: string, userId: string) {
  const resume = await prisma.resume.findFirst({
    where: { id: resumeId, userId },
  });

  if (!resume) {
    const err = new Error("Resume not found") as Error & { statusCode?: number };
    err.statusCode = 404;
    throw err;
  }

  return resume;
}

/**
 * List all resumes for a user, newest first.
 */
export async function getResumesByUser(userId: string) {
  return prisma.resume.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}
