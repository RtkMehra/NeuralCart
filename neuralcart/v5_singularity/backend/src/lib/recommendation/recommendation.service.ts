import { AppDataSource } from '../../config/data-source';
import { env } from '../../config/env';
import { Product } from '../../entities/Product';
import { logger } from '../logger';
import {
  embeddingDurationHistogram,
  embeddingErrorsCounter,
  recommendationQueryDurationHistogram
} from '../../metrics/registry';
import { Not, IsNull } from 'typeorm';

const EMBEDDING_DIMENSION = 768;

let vectorSupported: boolean | null = null;

const detectVectorSupport = async (): Promise<boolean> => {
  if (vectorSupported !== null) {
    return vectorSupported;
  }

  try {
    const result = await AppDataSource.query<{ exists: boolean }[]>(
      `SELECT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'products'
            AND column_name = 'embedding'
        ) AS exists`
    );

    vectorSupported = result[0]?.exists ?? false;
  } catch (error) {
    logger.debug({ err: error }, 'Failed to detect pgvector support');
    vectorSupported = false;
  }

  return vectorSupported;
};

const toVectorLiteral = (vector: number[]) => `[${vector.join(',')}]`;

const normalizeVector = (vector: number[]) => {
  const magnitude = Math.sqrt(vector.reduce((sum, component) => sum + component * component, 0));
  if (magnitude === 0) {
    return vector;
  }
  return vector.map((component) => component / magnitude);
};

const cosineSimilarity = (a: number[], b: number[]) => {
  const dot = a.reduce((sum, value, idx) => sum + value * b[idx], 0);
  return dot;
};

const mockEmbedding = (text: string): number[] => {
  const vector = Array.from({ length: EMBEDDING_DIMENSION }, (_, idx) => {
    const char = text.charCodeAt(idx % text.length);
    return ((char + idx) % 100) / 100;
  });
  return normalizeVector(vector);
};

const fetchEmbedding = async (input: string): Promise<number[] | null> => {
  if (!env.OLLAMA_URL || env.EMBEDDINGS_MODE === 'mock') {
    return mockEmbedding(input);
  }

  const stopTimer = embeddingDurationHistogram.startTimer({
    mode: env.EMBEDDINGS_MODE
  });

  try {
    const response = await fetch(`${env.OLLAMA_URL}/api/embeddings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: env.EMBEDDINGS_MODEL,
        input
      })
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Embedding request failed: ${response.status} ${body}`);
    }

    const json = (await response.json()) as { embedding?: number[] };
    const normalized = json.embedding ? normalizeVector(json.embedding) : null;
    stopTimer();
    return normalized;
  } catch (error) {
    stopTimer();
    embeddingErrorsCounter.inc({ mode: env.EMBEDDINGS_MODE });
    logger.warn({ err: error }, 'Failed to generate embedding via Ollama');
    return null;
  }
};

export const recommendationService = {
  async updateEmbedding(product: Product): Promise<void> {
    const text = `${product.name}. ${product.description}`;
    const embedding = await fetchEmbedding(text);

    if (!embedding) {
      return;
    }

    const isVector = await detectVectorSupport();

    if (isVector) {
      await AppDataSource.query('UPDATE products SET embedding = $1, embedding_json = $2 WHERE id = $3', [
        toVectorLiteral(embedding),
        JSON.stringify(embedding),
        product.id
      ]);
    } else {
      await AppDataSource.query('UPDATE products SET embedding_json = $1 WHERE id = $2', [
        JSON.stringify(embedding),
        product.id
      ]);
    }
  },

  async getRecommendations(productId: string, limit: number) {
    const stopTimer = recommendationQueryDurationHistogram.startTimer();

    try {
      const isVector = await detectVectorSupport();

      if (isVector) {
        const result = await AppDataSource.query<
          Array<{
            id: string;
            name: string;
            description: string;
            price: number;
            image_url: string | null;
            category_id: string;
            category_name: string;
            category_slug: string;
            score: number;
          }>
        >(
          `
          WITH target AS (
            SELECT embedding
            FROM products
            WHERE id = $1 AND embedding IS NOT NULL
          )
          SELECT
            p.id,
            p.name,
            p.description,
            p.price,
            p.image_url,
            c.id AS category_id,
            c.name AS category_name,
            c.slug AS category_slug,
            1 - (p.embedding <=> target.embedding) AS score
          FROM products p
          INNER JOIN categories c ON c.id = p."categoryId"
          CROSS JOIN target
          WHERE p.id <> $1
            AND p.embedding IS NOT NULL
          ORDER BY p.embedding <=> target.embedding
          LIMIT $2
        `,
          [productId, limit]
        );

        return (
          result.map((row) => ({
            id: row.id,
            name: row.name,
            description: row.description,
            price: Number(row.price),
            imageUrl: row.image_url,
            category: {
              id: row.category_id,
              name: row.category_name,
              slug: row.category_slug
            },
            score: Number(row.score)
          })) ?? []
        );
      }

      const products = await AppDataSource.getRepository(Product).find({
        where: {
          embeddingJson: Not(IsNull())
        },
        relations: { category: true }
      });

      const targetProduct = products.find((product) => product.id === productId);
      if (!targetProduct || !targetProduct.embeddingJson) {
        return [];
      }

      const targetEmbedding = normalizeVector(targetProduct.embeddingJson);

      return products
        .filter((product) => product.id !== productId)
        .map((product) => {
          const embeddingRaw = product.embeddingJson;
          const embeddingVector = embeddingRaw ? normalizeVector(embeddingRaw) : null;
          const score = embeddingVector ? cosineSimilarity(targetEmbedding, embeddingVector) : 0;

          return {
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            imageUrl: product.imageUrl,
            category: product.category,
            score
          };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
    } catch (error) {
      logger.warn({ err: error, productId }, 'Failed to query recommendations');
      return [];
    } finally {
      stopTimer();
    }
  },

  async ensureProductEmbedding(productId: string): Promise<void> {
    const repository = AppDataSource.getRepository(Product);
    const product = await repository.findOne({
      where: { id: productId },
      relations: { category: true }
    });

    if (product) {
      await recommendationService.updateEmbedding(product);
    }
  },

  async reindexEmbeddings(): Promise<void> {
    const repository = AppDataSource.getRepository(Product);
    const products = await repository.find({ relations: { category: true } });

    for (const product of products) {
      await recommendationService.updateEmbedding(product);
    }
  }
};

