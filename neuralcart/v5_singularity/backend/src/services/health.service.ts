import { AppDataSource } from '../config/data-source';
import { env } from '../config/env';
import { logger } from '../lib/logger';
import { pingCache } from '../lib/cache';
import { pingSearch, searchService } from '../lib/search';

type DependencyStatus = 'up' | 'down' | 'unknown';

export type HealthReport = {
  status: 'ok' | 'degraded' | 'down';
  timestamp: string;
  dependencies: {
    database: DependencyStatus;
    redis: DependencyStatus;
    elasticsearch: DependencyStatus;
    ollama: DependencyStatus;
  };
};

const checkDatabase = async (): Promise<DependencyStatus> => {
  try {
    if (!AppDataSource.isInitialized) {
      return 'down';
    }
    await AppDataSource.query('SELECT 1');
    return 'up';
  } catch (error) {
    logger.debug({ err: error }, '[HealthCheck] database ping failed');
    return 'down';
  }
};

const checkRedis = async (): Promise<DependencyStatus> => {
  if (!env.REDIS_URL) {
    return 'unknown';
  }

  return (await pingCache()) ? 'up' : 'down';
};

const checkSearch = async (): Promise<DependencyStatus> => {
  if (!env.ELASTICSEARCH_URL) {
    return 'unknown';
  }

  if (!searchService.isEnabled()) {
    return 'down';
  }

  return (await pingSearch()) ? 'up' : 'down';
};

const checkOllama = async (): Promise<DependencyStatus> => {
  if (!env.OLLAMA_URL) {
    return 'unknown';
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);

    const response = await fetch(`${env.OLLAMA_URL}/api/tags`, {
      method: 'GET',
      signal: controller.signal
    });

    clearTimeout(timeout);
    return response.ok ? 'up' : 'down';
  } catch (error) {
    logger.debug({ err: error }, '[HealthCheck] Ollama ping failed');
    return 'down';
  }
};

export const getHealthReport = async (): Promise<HealthReport> => {
  const [dbStatus, redisStatus, searchStatus, ollamaStatus] = await Promise.all([
    checkDatabase(),
    checkRedis(),
    checkSearch(),
    checkOllama()
  ]);

  const dependencies = {
    database: dbStatus,
    redis: redisStatus,
    elasticsearch: searchStatus,
    ollama: ollamaStatus
  };

  const statuses = Object.values(dependencies);
  const criticalDown = statuses.includes('down');
  const status = dbStatus === 'down' ? 'down' : criticalDown ? 'degraded' : 'ok';

  return {
    status,
    timestamp: new Date().toISOString(),
    dependencies
  };
};

