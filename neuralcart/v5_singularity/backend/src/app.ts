import express, { type Express } from 'express';
import { randomUUID } from 'node:crypto';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { apiRouter } from './routes';
import { errorHandler } from './middleware/error-handler';
import pinoHttp from 'pino-http';
import { logger } from './lib/logger';

const app: Express = express();

app.disable('x-powered-by');

app.use(helmet());
// CORS configuration – honour whitelist if provided via ENV, otherwise allow all.
const corsOrigins = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',').map((o) => o.trim()) : '*';
app.use(
  cors({
    origin: corsOrigins
  })
);

// Global rate limiting – protects the service from abuse.
app.use(
  rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'),
    max: parseInt(process.env.RATE_LIMIT_MAX || '100'),
    standardHeaders: true,
    legacyHeaders: false
  })
);
app.use(express.json());
app.use(
  pinoHttp({
    logger,
    genReqId: (req, res) => {
      const existing = req.headers['x-request-id'];
      if (typeof existing === 'string') {
        res.setHeader('x-request-id', existing);
        return existing;
      }
      const id = randomUUID();
      res.setHeader('x-request-id', id);
      return id;
    },
    customProps: (req, res) => ({
      requestId: req.id,
      route: req.route?.path,
      statusCode: res.statusCode
    })
  })
);

app.use(
  rateLimit({
    windowMs: 60_000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.get('/', (_req, res) => {
  res.status(200).json({
    name: 'NeuralCart Singularity',
    status: 'online',
    version: 'v5'
  });
});

app.use('/api/v1', apiRouter);

app.use(errorHandler);

export { app };
