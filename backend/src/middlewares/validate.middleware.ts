import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import sanitize from "mongo-sanitize";
import ErrorHandler from "../utils/errorHandler.js";

type ValidateSource = "body" | "query" | "params";

export const validate =
  <T>(schema: ZodSchema<T>, source: ValidateSource = "body") =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      let raw = req[source];

      if (source === "body" && raw) {
        raw = sanitize(JSON.parse(JSON.stringify(raw)));
      }

      const result = schema.safeParse(raw);

      if (!result.success) {
        const errors = result.error.issues.map((issue) => ({
          field: issue.path.join(".") || "unknown",
          message: issue.message,
        }));

        return next(new ErrorHandler(400, errors[0].message));
      }

      if (source === "body") req.body = result.data;
      if (source === "query") {
        Object.defineProperty(req, "query", {
          value: result.data,
          writable: true,
          configurable: true,
          enumerable: true,
        });
      }
      if (source === "params") {
        Object.defineProperty(req, "params", {
          value: result.data,
          writable: true,
          configurable: true,
          enumerable: true,
        });
      }

      next();
    } catch (err) {
      console.error("Validation error details:", err);
      next(new ErrorHandler(500, "Validation error"));
    }
  };
