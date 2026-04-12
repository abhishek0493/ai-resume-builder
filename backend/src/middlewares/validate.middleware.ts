// ──────────────────────────────────────────────────────────────
// Zod Validation Middleware
// ──────────────────────────────────────────────────────────────
// A generic factory that takes a Zod schema and returns an
// Express middleware.  If validation fails, it returns a 400
// with a structured list of field-level errors.
//
// Usage:
//   router.post("/foo", validate(mySchema), controller.handle)
// ──────────────────────────────────────────────────────────────

import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((e) => ({
          field: e.path.map(String).join("."),
          message: e.message,
        }));

        return res.status(400).json({
          success: false,
          error: "Validation failed",
          details: formattedErrors,
        });
      }
      next(error);
    }
  };
};
