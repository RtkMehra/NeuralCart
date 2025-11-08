import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProductEmbedding1710151000001 implements MigrationInterface {
  name = 'AddProductEmbedding1710151000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "embedding_json" jsonb`);

    const result = (await queryRunner.query(
      `SELECT EXISTS (
          SELECT 1
          FROM pg_available_extensions
          WHERE name = 'vector'
        ) AS available`
    )) as Array<{ available?: boolean }>;

    const vectorAvailable = Array.isArray(result) && result[0]?.available === true;

    if (vectorAvailable) {
      await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS vector`);
      await queryRunner.query(
        `ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "embedding" vector(768)`
      );
    } else {
      // eslint-disable-next-line no-console
      console.warn('pgvector extension not available; skipping vector column creation.');
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN IF EXISTS "embedding"`);
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN IF EXISTS "embedding_json"`);
  }
}

