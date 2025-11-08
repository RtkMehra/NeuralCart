import Redis from 'ioredis';
import { env } from '../../config/env';
import { logger } from '../logger';
import {
  cacheHitsCounter,
  cacheMissesCounter,
  cacheOperationDurationHistogram
} from '../../metrics/registry';

const NAMESPACE_DEFAULT = 'default';

let client: Redis | null = null;

export const initCache = async () => {
  if (!env.REDIS_URL) {
    logger.info('Redis cache disabled (REDIS_URL not set)');
    return;
  }

  try {
    client = new Redis(env.REDIS_URL, {
      lazyConnect: true,
      enableAutoPipelining: true,
      maxRetriesPerRequest: 2,
      reconnectOnError: () => true
    });

    client.on('error', (error) => {
      logger.warn({ err: error }, 'Redis client error');
    });

    await client.connect();
    logger.info('Connected to Redis');
  } catch (error) {
    logger.error({ err: error }, 'Failed to connect to Redis. Cache disabled.');
    if (client) {
      client.disconnect();
    }
    client = null;
  }
};

const ensureClient = () => client !== null;

export const cache = {
  isEnabled: () => ensureClient(),

  async get<T>(key: string, namespace = NAMESPACE_DEFAULT): Promise<T | null> {
    if (!client) {
      return null;
    }

    const stopTimer = cacheOperationDurationHistogram.startTimer({
      operation: 'get',
      namespace
    });

    try {
      const raw = await client.get(key);
      stopTimer();

      if (!raw) {
        cacheMissesCounter.inc({ namespace });
        return null;
      }

      cacheHitsCounter.inc({ namespace });
      return JSON.parse(raw) as T;
    } catch (error) {
      stopTimer();
      logger.debug({ err: error, key }, 'Cache get failed');
      return null;
    }
  },

  async set<T>(
    key: string,
    value: T,
    ttlSeconds: number,
    namespace = NAMESPACE_DEFAULT
  ): Promise<void> {
    if (!client) {
      return;
    }

    const stopTimer = cacheOperationDurationHistogram.startTimer({
      operation: 'set',
      namespace
    });

    try {
      await client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    } catch (error) {
      logger.debug({ err: error, key }, 'Cache set failed');
    } finally {
      stopTimer();
    }
  },

  async del(key: string, namespace = NAMESPACE_DEFAULT): Promise<void> {
    if (!client) {
      return;
    }

    const stopTimer = cacheOperationDurationHistogram.startTimer({
      operation: 'del',
      namespace
    });

    try {
      await client.del(key);
    } catch (error) {
      logger.debug({ err: error, key }, 'Cache delete failed');
    } finally {
      stopTimer();
    }
  },

  async invalidateNamespace(namespace: string): Promise<void> {
    if (!client) {
      return;
    }

    const stopTimer = cacheOperationDurationHistogram.startTimer({
      operation: 'invalidate',
      namespace
    });

    const pattern = `${namespace}:*`;

    try {
      let cursor = '0';
      do {
        const [next, keys] = await client.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
        if (keys.length) {
          await client.del(keys);
        }
        cursor = next;
      } while (cursor !== '0');
    } catch (error) {
      logger.debug({ err: error, pattern }, 'Cache namespace invalidation failed');
    } finally {
      stopTimer();
    }
  }
};

export const pingCache = async (): Promise<boolean> => {
  if (!client || client.status !== 'ready') {
    return false;
  }

  try {
    const response = await client.ping();
    return response === 'PONG';
  } catch (error) {
    logger.debug({ err: error }, 'Redis ping failed');
    return false;
  }
};

export const closeCache = async (): Promise<void> => {
  if (client) {
    await client.quit();
    client = null;
  }
};

