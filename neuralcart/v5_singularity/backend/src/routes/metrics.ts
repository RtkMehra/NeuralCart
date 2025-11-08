import { Router, type Router as RouterType } from 'express';
import { env } from '../config/env';
import { metricsRegistry } from '../metrics/registry';

export const metricsRouter: RouterType = Router();

metricsRouter.get('/', async (_req, res) => {
  if (!env.METRICS_ENABLED) {
    return res.status(404).json({ message: 'Metrics disabled' });
  }

  res.set('Content-Type', metricsRegistry.contentType);
  res.send(await metricsRegistry.metrics());
});

