import './lib/env';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { prisma } from './lib/prisma';

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  ...(process.env.WEB_URL ? [process.env.WEB_URL] : []),
];

app.use(helmet());
app.use(cors({ origin: allowedOrigins }));
app.use(morgan('dev'));
app.use(express.json());

app.get('/health', async (_req, res) => {
  let dbStatus = 'disconnected';
  let dbError: string | undefined;
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'connected';
  } catch (err) {
    dbError = err instanceof Error ? err.message : String(err);
  }
  res.json({ status: 'ok', timestamp: new Date().toISOString(), database: dbStatus, dbError });
});

export default app;
