import mongoose from 'mongoose';

/**
 * Connect to test database or reuse active connection
 */
export async function connectTestDb(
  uri = process.env.DATABASE_URL || 'mongodb://localhost:27017/portfolio_test',
): Promise<void> {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri);
  }
}

/**
 * Clear all collections in test database
 */
export async function clearTestDb(): Promise<void> {
  if (mongoose.connection.readyState !== 0 && mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) {
      await collection.deleteMany({});
    }
  }
}

/**
 * Disconnect cleanly from test database
 */
export async function closeTestDb(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}
