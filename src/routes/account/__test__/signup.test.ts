/* eslint-env jest */
import request from 'supertest';
import { app } from '../../../app';

const email = 'test_user@test.com';
const password = 'password';

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
