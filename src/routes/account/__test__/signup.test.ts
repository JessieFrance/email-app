/* eslint-env jest */
import request from 'supertest';
import { app } from '../../../app';
import AccountMessageTable from '../../../models/accountMessageTable';
import AccountTable from '../../../models/accountTable';

// Test user.
const email = 'test_user@test.com';
const password = 'password';
let id: string;

// Cleanup the created user after tests, but be sure to delete
// the account messages first since this uses foreign keys.
afterAll(async () => {
  await AccountMessageTable.deleteByAccountId({ accountId: id });
  await AccountTable.deleteById({ id });
});

describe('it handles signup', () => {
  it('lets a user signup with a valid email and password', async () => {
    // Simulate a signup.

    const response = await request(app)
      .post('/signup')
      .send({
        email,
        password,
      })
      .expect(201);

    expect(response.body).toBeDefined();
    expect(response.body.message).toBeDefined();
    expect(typeof response.body.message === 'string').toBeTruthy();
    id = response.body.message;
  });

  it('prevents a user from signing up with the same email', async () => {
    await request(app)
      .post('/signup')
      .send({
        email,
        password,
      })
      .expect(400);
  });

  it('considers email as case insensitive', async () => {
    await request(app)
      .post('/signup')
      .send({
        email: email.toUpperCase(),
        password,
      })
      .expect(400);
  });
});
