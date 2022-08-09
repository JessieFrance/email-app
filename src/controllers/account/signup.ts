import { Request, Response } from 'express';
import { toHash } from 'simple-nodejs-password';
import AccountTable from '../../models/accountTable';

export const signup = async (req: Request, res: Response) => {
  // Get items off request body.
  const { email, password } = req.body;

  // Check if user already exists...
  try {
    // Return with bad request if user exists.
    const existingUser = await AccountTable.getAccount({ email });
    if (existingUser) {
      console.log('user exists!!!');
      res.status(400).send({
        message: 'User already in use',
      });
      return;
    }
  } catch (error) {
    console.error(`unable to lookup user error: ${(error as Error).message}`);
    res.status(500).send({
      message: 'Please try again later.',
    });
    return;
  }

  // Hash password.
  let hashedPassword = '';
  try {
    hashedPassword = await toHash({ password });
  } catch (err) {
    console.error('unable to hash password');
    res.status(500).send({
      message: 'Please try again later.',
    });
    return;
  }

  // Save to db.
  let id = '';
  try {
    id = ((await AccountTable.storeAccount({ email, hashedPassword })) as any)
      .accountId;

    console.log('id is ', id);
  } catch (error) {
    console.error('unable to save user');
    res.status(500).send({
      message: 'Please try again later.',
    });
    return;
  }

  // Send resource created message.
  res.status(201).send({
    message: `${id}`,
  });
};
