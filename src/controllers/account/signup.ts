import { Request, Response } from 'express';

export const signup = async (req: Request, res: Response) => {
  console.log('you hit signup');
  res.status(201).send({
    message: 'Signup was successful!',
  });
};
