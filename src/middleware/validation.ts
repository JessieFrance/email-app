import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

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
