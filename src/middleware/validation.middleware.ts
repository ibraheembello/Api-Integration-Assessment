import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { UnprocessableEntityError, BadRequestError } from "../errors/app.error";

export const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = error.issues;
        
        // 1. Missing or empty string
        const isMissingOrEmpty = issues.some(e => 
          (e.code === "invalid_type" && e.path.includes("name") && (e as any).received === "undefined") ||
          (e.code === "too_small" && e.path.includes("name"))
        );
        
        if (isMissingOrEmpty || !req.query.name) {
             return next(new BadRequestError("Missing or empty name parameter"));
        }

        // 2. Array instead of string
        const isArray = issues.some(e => 
          e.code === "invalid_type" && e.path.includes("name") && (e as any).received === "array"
        );

        if (isArray) {
            return next(new UnprocessableEntityError("name must be a string"));
        }
        
        return next(new UnprocessableEntityError(issues[0].message));
      }
      next(error);
    }
  };
};
