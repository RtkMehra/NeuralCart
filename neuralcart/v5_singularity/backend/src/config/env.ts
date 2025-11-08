import { config as loadEnv } from 'dotenv';
import { z } from 'zod';

loadEnv();

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  DB_HOST: z.string().min(1, 'DB_HOST is required'),
  DB_PORT: z.coerce.number().default(5432),
  DB_USER: z.string().min(1, 'DB_USER is required'),
  DB_PASS: z.string().min(1, 'DB_PASS is required'),
  DB_NAME: z.string().min(1, 'DB_NAME is required'),
  DB_SSL: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((value) => {
      if (typeof value === 'boolean') return value;
      if (typeof value === 'string') return value.toLowerCase() === 'true';
      return false;
    }),
  REDIS_URL: z.string().url().optional(),
  ELASTICSEARCH_URL: z.string().url().optional(),
  ELASTICSEARCH_USERNAME: z.string().optional(),
  ELASTICSEARCH_PASSWORD: z.string().optional(),
  OLLAMA_URL: z.string().url().optional(),
  EMBEDDINGS_MODE: z.enum(['live', 'mock']).default('mock'),
  EMBEDDINGS_MODEL: z.string().default('all-minilm'),
  METRICS_ENABLED: z
    .union([z.boolean(), z.string()])
    .default(true)
    .transform((value) => {
      if (typeof value === 'boolean') return value;
      return value.toLowerCase() === 'true';
    }),
  // New optional CORS whitelist (comma‑separated origins). If omitted, all origins are allowed.
  CORS_ORIGINS: z.string().optional(),
  // Rate‑limiting configuration – defaults to 100 requests per minute.
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60_000),
  RATE_LIMIT_MAX: z.coerce.number().default(100),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  const formatted = parsed.error.flatten().fieldErrors;
  throw new Error(
    `Invalid environment configuration: ${JSON.stringify(formatted, null, 2)}`
  );
}

export const env = parsed.data;

