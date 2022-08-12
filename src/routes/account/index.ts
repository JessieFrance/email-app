import express from 'express';
import { body } from 'express-validator';
import { signup } from '../../controllers';
import { lowerCaseEmail } from '../../middleware';
import validation from '../../middleware/validation';

const router = express.Router();

router.post(
  '/signup',
  [
    body('email')
      .isLength({ max: 30 })
      .isEmail()
      .escape()
      .withMessage('Invalid email'),
    body('password')
      .isLength({ min: 2, max: 20 })
      .escape()
      .withMessage('Invalid password'),
  ],
  validation,
  lowerCaseEmail,
  signup
);

export { router as accountRouter };
