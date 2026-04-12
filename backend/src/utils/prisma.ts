// ──────────────────────────────────────────────────────────────
// Prisma Client Singleton
// ──────────────────────────────────────────────────────────────
// Why a singleton?  In development, hot-reloading can create
// multiple PrismaClient instances, exhausting the database
// connection pool.  This pattern ensures only one client exists
// across the entire process lifetime.
// ──────────────────────────────────────────────────────────────

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
