import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

/**
 * This middleware check for validation errors, and sends a 400
 * bad request status with an array of error messages.
 *
 * @param req  - Express request object.
 * @param res  - Express response object (unused).
 * @param next - Express next object.
 * @returns - next(). It calls the next middleware having now made
 *                    any email field on the body lowercase.
 *
 */
const validation = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Could extract more info here, but for now just create an
    // array of messages.
    const messages = errors.array().map((item) => item.msg);
    return res.status(400).json({ message: messages });
  }
  return next();
};

export default validation;
