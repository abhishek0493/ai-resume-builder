// ──────────────────────────────────────────────────────────────
// Auth Middleware — JWT Verification
// ──────────────────────────────────────────────────────────────
// Reads the JWT from either:
//   1. A httpOnly cookie named "token"   (browser clients)
//   2. The Authorization: Bearer header  (API / mobile clients)
//
// On success, attaches `req.user` with { userId, email } so
// downstream controllers/services can identify the caller
// without touching the DB again.
// ──────────────────────────────────────────────────────────────

import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest, JwtPayload } from "../types";
import logger from "../utils/logger";

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Try cookie first, then Authorization header
    const token =
      req.cookies?.token ||
      req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Authentication required. Please log in.",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    req.user = decoded;
    next();
  } catch (error) {
    logger.warn("Invalid or expired token", { error });
    return res.status(401).json({
      success: false,
      error: "Invalid or expired token.",
    });
  }
};
