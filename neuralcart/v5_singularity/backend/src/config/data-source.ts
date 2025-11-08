import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { env } from './env';
import { entities } from '../entities';
import { CreateInitialSchema1710150000000 } from '../migrations/1710150000000-CreateInitialSchema';
import { AddProductEmbedding1710151000001 } from '../migrations/1710151000001-AddProductEmbedding';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME,
  ssl: env.DB_SSL
    ? {
        rejectUnauthorized: false
      }
    : false,
  extra: {
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000
  },
  entities,
  migrations: [CreateInitialSchema1710150000000, AddProductEmbedding1710151000001],
  migrationsTableName: 'migrations',
  synchronize: false,
  logging: env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error']
});

