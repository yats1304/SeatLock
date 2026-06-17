import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import sanitize from "mongo-sanitize";
import ErrorHandler from "../utils/errorHandler.js";

export const validate =
  <T>(schema: ZodSchema<T>) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const sanitizedBody = sanitize(req.body);

    const result = schema.safeParse(sanitizedBody);

    if (!result.success) {
      const firstError = result.error.issues[0];

      return next(
        new ErrorHandler(400, firstError?.message ?? "Validation failed"),
      );
    }

    req.body = result.data;

    next();
  };
