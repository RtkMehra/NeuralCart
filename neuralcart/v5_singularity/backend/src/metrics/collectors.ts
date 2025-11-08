import { setInterval } from 'node:timers';
import { AppDataSource } from '../config/data-source';
import { logger } from '../lib/logger';
import { dbPoolConnectionsGauge, domainTotalGauge } from './registry';
import { Product } from '../entities/Product';
import { Order } from '../entities/Order';
import { User } from '../entities/User';
import { Category } from '../entities/Category';

let collectorInterval: NodeJS.Timeout | null = null;

const updateDatabaseMetrics = () => {
  if (!AppDataSource.isInitialized) {
    return;
  }

  try {
    // TypeORM's Postgres driver exposes underlying pool on master connection.
    const driver = AppDataSource.driver as unknown as {
      master?: { pool?: { totalCount?: number; idleCount?: number; waitingCount?: number } };
    };

    const pool = driver?.master?.pool;

    if (pool) {
      dbPoolConnectionsGauge.set({ state: 'total' }, pool.totalCount ?? 0);
      dbPoolConnectionsGauge.set({ state: 'idle' }, pool.idleCount ?? 0);
      dbPoolConnectionsGauge.set({ state: 'waiting' }, pool.waitingCount ?? 0);
    }
  } catch (error) {
    logger.debug({ err: error }, 'Failed to update DB pool metrics');
  }
};

const updateDomainMetrics = async () => {
  if (!AppDataSource.isInitialized) {
    return;
  }

  try {
    const [productCount, orderCount, userCount, categoryCount] = await Promise.all([
      AppDataSource.getRepository(Product).count(),
      AppDataSource.getRepository(Order).count(),
      AppDataSource.getRepository(User).count(),
      AppDataSource.getRepository(Category).count()
    ]);

    domainTotalGauge.set({ entity: 'products' }, productCount);
    domainTotalGauge.set({ entity: 'orders' }, orderCount);
    domainTotalGauge.set({ entity: 'users' }, userCount);
    domainTotalGauge.set({ entity: 'categories' }, categoryCount);
  } catch (error) {
    logger.debug({ err: error }, 'Failed to update domain metrics');
  }
};

export const initializeMetricCollectors = () => {
  if (collectorInterval) {
    return;
  }

  collectorInterval = setInterval(async () => {
    updateDatabaseMetrics();
    await updateDomainMetrics();
  }, 30_000);

  collectorInterval.unref();
};

export const stopMetricCollectors = () => {
  if (collectorInterval) {
    clearInterval(collectorInterval);
    collectorInterval = null;
  }
};


