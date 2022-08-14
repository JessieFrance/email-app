import express from 'express';
import { Pool, PoolConfig } from 'pg';
import 'express-async-errors';
import cors from 'cors';
import { json } from 'body-parser';
import helmet from 'helmet';
import { accountRouter } from './routes';

// Initialize.
const app = express();

// Extact environment variables.
const {
  APIV,
  NODE_ENV,
  PORT,
  ORIGIN,
  SENDGRID_KEY,
  EMAIL_FROM,
  POSTGRES_USER,
  POSTGRES_DB,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
  POSTGRES_TEST_PORT,
  POSTGRES_TEST_USER,
  POSTGRES_TEST_PASSWORD,
  POSTGRES_TEST_DB,
} = process.env;

// Check environment variables.
if (!SENDGRID_KEY) {
  console.error('Please set the SENDGRID_KEY.');
  process.exit(1);
}
if (!EMAIL_FROM) {
  console.error('Please set the EMAIL_FROM.');
  process.exit(1);
}
if (!POSTGRES_USER) {
  console.error('Please set the POSTGRES_USER.');
  process.exit(1);
}
if (!POSTGRES_DB) {
  console.error('Please set the POSTGRES_DB.');
  process.exit(1);
}
if (!POSTGRES_PASSWORD) {
  console.error('Please set the POSTGRES_PASSWORD.');
  process.exit(1);
}
if (!NODE_ENV) {
  // Todo(JessieFrance): validate 'test', 'development', or 'production'.
  console.error('Please set the NODE_ENV.');
  process.exit(1);
}
if (!POSTGRES_PORT) {
  console.error('Please set the POSTGRES_PORT.');
  process.exit(1);
}
if (!POSTGRES_TEST_PORT) {
  console.error('Please set the POSTGRES_TEST_PORT.');
  process.exit(1);
}
if (!POSTGRES_TEST_USER) {
  console.error('Please set the POSTGRES_TEST_USER.');
  process.exit(1);
}
if (!POSTGRES_TEST_PASSWORD) {
  console.error('Please set the POSTGRES_TEST_PASSWORD.');
  process.exit(1);
}
if (!POSTGRES_TEST_DB) {
  console.error('Please set the POSTGRES_TEST_DB.');
  process.exit(1);
}

// In production, CORS is not needed...
if (NODE_ENV === 'development')
  app.use(cors({ origin: ORIGIN, credentials: true }));
app.use(json());
app.use(helmet());

// Use routers.
app.use(accountRouter);

// If in production, prepend the API version to the route so
// that we don't have to use CORS, and we can just reverse proxy with Caddy.
if (NODE_ENV === 'production') {
  const prodPrepend = `/${APIV}1-api`;
  app.use(prodPrepend, accountRouter);
}

const DB_PORT =
  NODE_ENV === 'test' ? Number(POSTGRES_TEST_PORT) : Number(POSTGRES_PORT);

const DB_USER = NODE_ENV === 'test' ? POSTGRES_TEST_USER : POSTGRES_USER;
const DB_PASSWORD =
  NODE_ENV === 'test' ? POSTGRES_TEST_PASSWORD : POSTGRES_PASSWORD;
const DB = NODE_ENV === 'test' ? POSTGRES_TEST_DB : POSTGRES_DB;

// Set up database pool.
const cfg: PoolConfig = {
  user: DB_USER,
  password: DB_PASSWORD, // POSTGRES_PASSWORD,
  database: DB, // POSTGRES_DB,
  host: 'localhost',
  port: DB_PORT,
};

const pool = new Pool(cfg);

// Export stuff.
export { app, NODE_ENV, PORT, ORIGIN, pool, EMAIL_FROM, SENDGRID_KEY, DB_PORT };
