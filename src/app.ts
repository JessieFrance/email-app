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

// In production, CORS is not needed...
if (NODE_ENV === 'development')
  app.use(cors({ origin: ORIGIN, credentials: true }));
app.use(json());
app.use(helmet());

if (NODE_ENV === 'development' || NODE_ENV === 'test') {
  app.use(accountRouter);
}

// If in production, prepend the API version to the route so
// that we don't have to use CORS, and we can just reverse proxy with Caddy.
if (NODE_ENV === 'production') {
  const prodPrepend = `/${APIV}1-api`;
  app.use(prodPrepend, accountRouter);
}

// Set up database pool.
const cfg: PoolConfig = {
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
  host: 'localhost',
  port: 5432,
};

const pool = new Pool(cfg);

// Export stuff.
export { app, NODE_ENV, PORT, ORIGIN, pool, EMAIL_FROM, SENDGRID_KEY };
