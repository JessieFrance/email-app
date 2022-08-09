import { Request, Response, NextFunction } from 'express';

/**
 * This middleware takes the email field from the request body
 * and makes it lowercase.
 *
 *
 * @remarks
 * We might need to add other places that could have email, like
 * parmas, query, etc. in the future.
 *
 * @param req  - Express request object.
 * @param _  - Express response object (unused).
 * @param next - Express next object.
 * @returns - next(). It calls the next middleware having now made
 *                    any email field on the body lowercase.
 *
 */
export const lowerCaseEmail = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const { email } = req.body;
  if (!email) {
    return next();
  }
  req.body.email = email.toLowerCase();
  return next();
};
