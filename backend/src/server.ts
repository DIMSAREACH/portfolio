import { Server } from 'http';
import config from './config/environment';
import app from './app';
import logger from './utils/logger';
import { connectDatabase, disconnectDatabase } from './config/database';

let server: Server | undefined;

/**
 * Connect to database and start the HTTP server.
 */
export const startServer = async (): Promise<Server> => {
  try {
    // 1. Connect to MongoDB database
    await connectDatabase();

    // 2. Start Express server listener
    server = app.listen(config.PORT, () => {
      logger.info(
        `Server running in ${config.NODE_ENV} mode on port ${config.PORT}`,
      );
    });

    return server;
  } catch (error) {
    logger.error('Server startup failed:', error);
    process.exit(1);
  }
};

/**
 * Gracefully shut down the server and database connections.
 */
export const handleGracefulShutdown = async (signal: string): Promise<void> => {
  logger.info(`${signal} received: closing HTTP server and database connections`);

  if (server) {
    server.close(async () => {
      logger.info('HTTP server closed');
      await disconnectDatabase();
      process.exit(0);
    });

    // Fallback force shutdown if connections fail to close within 10s
    setTimeout(() => {
      logger.error('Forced shutdown due to timeout');
      process.exit(1);
    }, 10000).unref();
  } else {
    await disconnectDatabase();
    process.exit(0);
  }
};

// Process termination signal handlers
process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));
process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));

// Unhandled error handlers
process.on('unhandledRejection', (reason: unknown) => {
  logger.error('Unhandled Promise Rejection:', reason);
});

process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  handleGracefulShutdown('UNCAUGHT_EXCEPTION');
});

// Auto-start server in non-test environments
if (config.NODE_ENV !== 'test') {
  startServer();
}

export default server;
