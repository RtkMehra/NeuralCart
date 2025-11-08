import 'reflect-metadata';
import { app } from './app';
import { env } from './config/env';
import { AppDataSource } from './config/data-source';

const bootstrap = async () => {
  try {
    await AppDataSource.initialize();
    await AppDataSource.runMigrations();

    const server = app.listen(env.PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Backend listening on http://localhost:${env.PORT}`);
    });

    const handleShutdown = async () => {
      // eslint-disable-next-line no-console
      console.log('Received shutdown signal. Closing gracefully...');
      await AppDataSource.destroy();
      server.close(() => process.exit(0));
    };

    process.on('SIGTERM', handleShutdown);
    process.on('SIGINT', handleShutdown);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to bootstrap application', error);
    process.exit(1);
  }
};

void bootstrap();

