import { Client } from '@elastic/elasticsearch';
import { env } from '../../config/env';
import { logger } from '../logger';
import {
  searchErrorsCounter,
  searchOperationDurationHistogram
} from '../../metrics/registry';
import { Product } from '../../entities/Product';

const INDEX_NAME = 'neuralcart_products';

let client: Client | null = null;

export const initSearch = async () => {
  if (!env.ELASTICSEARCH_URL) {
    logger.info('Search disabled (ELASTICSEARCH_URL not set)');
    return;
  }

  try {
    client = new Client({
      node: env.ELASTICSEARCH_URL,
      ...(env.ELASTICSEARCH_USERNAME && env.ELASTICSEARCH_PASSWORD
        ? {
          auth: {
            username: env.ELASTICSEARCH_USERNAME,
            password: env.ELASTICSEARCH_PASSWORD
          }
        }
        : {})
    });

    await client.ping();
    await ensureIndex();
    logger.info('Connected to Elasticsearch');
  } catch (error) {
    logger.error({ err: error }, 'Failed to connect to Elasticsearch. Search disabled.');
    await closeSearch();
  }
};

const ensureIndex = async () => {
  if (!client) return;

  const exists = await client.indices.exists({ index: INDEX_NAME });
  if (!exists) {
    await client.indices.create({
      index: INDEX_NAME,
      body: {
        mappings: {
          properties: {
            name: { type: 'text' },
            description: { type: 'text' },
            category: { type: 'keyword' },
            price: { type: 'double' },
            createdAt: { type: 'date' }
          }
        }
      }
    });
    logger.info({ index: INDEX_NAME }, 'Created Elasticsearch index');
  }
};

const ensureClient = () => client !== null;

const serializeProduct = (product: Product) => ({
  name: product.name,
  description: product.description,
  category: product.category.slug,
  price: product.price,
  createdAt: product.createdAt.toISOString()
});

export const searchService = {
  isEnabled: () => ensureClient(),

  async indexProduct(product: Product): Promise<void> {
    if (!client) return;

    const stopTimer = searchOperationDurationHistogram.startTimer({
      operation: 'index'
    });

    try {
      await client.index({
        index: INDEX_NAME,
        id: product.id,
        document: serializeProduct(product),
        refresh: 'wait_for'
      });
    } catch (error) {
      searchErrorsCounter.inc({ operation: 'index' });
      logger.warn({ err: error, productId: product.id }, 'Failed to index product');
    } finally {
      stopTimer();
    }
  },

  async removeProduct(productId: string): Promise<void> {
    if (!client) return;

    const stopTimer = searchOperationDurationHistogram.startTimer({
      operation: 'delete'
    });

    try {
      await client.delete({
        index: INDEX_NAME,
        id: productId,
        refresh: 'wait_for'
      });
    } catch (error) {
      // ignore not found
      if ((error as { statusCode?: number }).statusCode !== 404) {
        searchErrorsCounter.inc({ operation: 'delete' });
        logger.warn({ err: error, productId }, 'Failed to delete product from index');
      }
    } finally {
      stopTimer();
    }
  },

  async searchProducts(query: string, limit: number) {
    if (!client) return [];

    const stopTimer = searchOperationDurationHistogram.startTimer({
      operation: 'search'
    });

    try {
      const response = await client.search<{
        name: string;
        description: string;
        category: string;
        price: number;
        createdAt: string;
      }>({
        index: INDEX_NAME,
        size: limit,
        query: {
          multi_match: {
            query,
            fields: ['name^3', 'description']
          }
        }
      });

      return (
        response.hits.hits.map((hit) => ({
          id: hit._id,
          score: hit._score ?? 0,
          ...hit._source
        })) ?? []
      );
    } catch (error) {
      searchErrorsCounter.inc({ operation: 'search' });
      logger.warn({ err: error, query }, 'Search query failed');
      return [];
    } finally {
      stopTimer();
    }
  },

  async reindexProducts(products: Product[]) {
    if (!client) return;

    const stopTimer = searchOperationDurationHistogram.startTimer({
      operation: 'reindex'
    });

    try {
      const operations = products.flatMap((product) => [
        { index: { _index: INDEX_NAME, _id: product.id } },
        serializeProduct(product)
      ]);

      if (operations.length === 0) {
        return;
      }

      const { errors, items } = await client.bulk({
        refresh: true,
        operations
      });

      if (errors) {
        const failed = items?.filter((item) => item.index && item.index.error);
        logger.warn(
          { failedCount: failed?.length, total: items?.length },
          'Some documents failed to index during bulk operation'
        );
      }
    } catch (error) {
      searchErrorsCounter.inc({ operation: 'reindex' });
      logger.error({ err: error }, 'Bulk reindex failed');
    } finally {
      stopTimer();
    }
  }
};

export const pingSearch = async (): Promise<boolean> => {
  if (!client) {
    return false;
  }

  try {
    await client.ping();
    return true;
  } catch {
    return false;
  }
};

export const closeSearch = async () => {
  if (client) {
    await client.close();
    client = null;
  }
};

