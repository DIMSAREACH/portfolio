import { Request, Response, NextFunction } from 'express';
import { ContextRunner, ValidationChain, validationResult } from 'express-validator';
import { FieldError } from '../utils/AppError';

export type ValidationRunnable = ValidationChain | ContextRunner;

/**
 * Middleware factory that accepts an array of express-validator ValidationChain/ContextRunner,
 * executes them on the incoming request, and returns a 400 Bad Request error response
 * with field-level error details if validation fails, or calls next() if validation passes.
 *
 * @param validations Single validation chain or array of validation chains
 */
export const validate = (
  validations: ValidationRunnable | ValidationRunnable[],
) => {
  const chainList = Array.isArray(validations) ? validations : [validations];

  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | Response> => {
    for (const validation of chainList) {
      await validation.run(req);
    }

    const result = validationResult(req);
    if (result.isEmpty()) {
      return next();
    }

    const errors: FieldError[] = result.array().map((err) => {
      let field = 'unknown';
      if ('path' in err && typeof err.path === 'string') {
        field = err.path;
      } else if (
        'param' in err &&
        typeof (err as { param?: string }).param === 'string'
      ) {
        field = (err as { param: string }).param;
      }

      return {
        field,
        message: String(err.msg),
      };
    });

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  };
};

export default validate;
