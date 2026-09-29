import mongoose from 'mongoose';
import config from './environment';
import logger from '../utils/logger';

// Enforce strict query filtering for Mongoose
mongoose.set('strictQuery', true);

// Enable Mongoose debugging in development when log level is debug
if (config.NODE_ENV === 'development' && config.LOG_LEVEL === 'debug') {
  mongoose.set('debug', (collectionName, method, query, doc) => {
    logger.debug(`Mongoose: ${collectionName}.${method}(${JSON.stringify(query)})`, { doc });
  });
}

/**
 * Connect to MongoDB database using DATABASE_URL from environment configuration.
 */
export const connectDatabase = async (): Promise<typeof mongoose> => {
  try {
    const conn = await mongoose.connect(config.DATABASE_URL);
    logger.info(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    logger.error('Failed to connect to MongoDB:', error);
    throw error;
  }
};

/**
 * Cleanly disconnect from MongoDB.
 */
export const disconnectDatabase = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    logger.info('MongoDB connection closed');
  }
};

// Monitor MongoDB connection events
mongoose.connection.on('error', (err) => {
  logger.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  logger.info('MongoDB reconnected');
});

export default connectDatabase;
