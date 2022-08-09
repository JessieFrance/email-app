import express from 'express';
import { signup } from '../../controllers';
import { lowerCaseEmail } from '../../middleware';

const router = express.Router();

router.post('/signup', lowerCaseEmail, signup);

export { router as accountRouter };
