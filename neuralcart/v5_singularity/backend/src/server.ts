import 'reflect-metadata';
import { app } from './app';
import { env } from './config/env';
import { AppDataSource } from './config/data-source';
import { logger } from './lib/logger';
import {
  initializeMetricCollectors,
  stopMetricCollectors
} from './metrics/collectors';
import { initCache, closeCache } from './lib/cache';
import { initSearch, closeSearch, searchService } from './lib/search';
import { recommendationService } from './lib/recommendation';
import { Product } from './entities/Product';

const BATCH_SIZE = 500;

const reindexSearchInBatches = async () => {
  if (!searchService.isEnabled()) {
    logger.info('Search service disabled; skipping reindex.');
    return;
  }

  const repository = AppDataSource.getRepository(Product);
  let lastId: string | null = null;

  while (true) {
    const batch = await repository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where(lastId ? 'product.id > :lastId' : '1=1', { lastId })
      .orderBy('product.id', 'ASC')
      .take(BATCH_SIZE)
      .getMany();

    if (!batch.length) {
      break;
    }

    await searchService.reindexProducts(batch);
    lastId = batch[batch.length - 1].id;
    logger.debug({ lastId, count: batch.length }, 'Reindexed product batch for search');
  }
};

const refreshEmbeddingsInBatches = async () => {
  const repository = AppDataSource.getRepository(Product);
  let lastId: string | null = null;

  while (true) {
    const batch = await repository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where(lastId ? 'product.id > :lastId' : '1=1', { lastId })
      .orderBy('product.id', 'ASC')
      .take(BATCH_SIZE)
      .getMany();

    if (!batch.length) {
      break;
    }

    for (const product of batch) {
      await recommendationService.updateEmbedding(product);
    }

    lastId = batch[batch.length - 1].id;
    logger.debug({ lastId, count: batch.length }, 'Updated embedding batch');
  }
};

const bootstrap = async () => {
  try {
    await AppDataSource.initialize();
    await AppDataSource.runMigrations();

    await initCache();
    await initSearch();
    initializeMetricCollectors();

    void reindexSearchInBatches().catch((error) => {
      logger.warn({ err: error }, 'Failed to trigger search reindex on startup');
    });

    void refreshEmbeddingsInBatches().catch((error) => {
      logger.warn({ err: error }, 'Failed to refresh embeddings on startup');
    });

    const server = app.listen(env.PORT, () => {
      logger.info({ port: env.PORT }, 'Singularity backend listening');
    });

    const handleShutdown = async () => {
      logger.info('Received shutdown signal. Closing gracefully...');
      stopMetricCollectors();
      await closeCache();
      await closeSearch();
      if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
      }
      server.close(() => process.exit(0));
    };

    process.on('SIGTERM', handleShutdown);
    process.on('SIGINT', handleShutdown);
  } catch (error) {
    logger.error({ err: error }, 'Failed to bootstrap Singularity backend');
    process.exit(1);
  }
};

void bootstrap();

