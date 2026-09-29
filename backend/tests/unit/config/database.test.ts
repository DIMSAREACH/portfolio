import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import mongoose from 'mongoose';
import { connectDatabase, disconnectDatabase } from '../../../src/config/database';
import config from '../../../src/config/environment';
import logger from '../../../src/utils/logger';

describe('Database Configuration Module', () => {
  let loggerInfoSpy: ReturnType<typeof jest.spyOn>;
  let loggerErrorSpy: ReturnType<typeof jest.spyOn>;

  beforeEach(() => {
    loggerInfoSpy = jest.spyOn(logger, 'info').mockImplementation(() => logger);
    loggerErrorSpy = jest.spyOn(logger, 'error').mockImplementation(() => logger);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    (mongoose.connection as unknown as { readyState: number }).readyState = 0;
  });

  it('should connect to MongoDB using DATABASE_URL from config', async () => {
    const mockMongoose = {
      connection: { host: 'localhost:27017' },
    } as unknown as typeof mongoose;

    const connectSpy = jest
      .spyOn(mongoose, 'connect')
      .mockResolvedValue(mockMongoose);

    const result = await connectDatabase();

    expect(connectSpy).toHaveBeenCalledWith(config.DATABASE_URL);
    expect(loggerInfoSpy).toHaveBeenCalledWith('MongoDB connected: localhost:27017');
    expect(result).toBe(mockMongoose);

    connectSpy.mockRestore();
  });

  it('should log and rethrow error when mongoose.connect fails', async () => {
    const connectionError = new Error('Connection timeout');
    const connectSpy = jest
      .spyOn(mongoose, 'connect')
      .mockRejectedValue(connectionError);

    await expect(connectDatabase()).rejects.toThrow('Connection timeout');
    expect(loggerErrorSpy).toHaveBeenCalledWith(
      'Failed to connect to MongoDB:',
      connectionError,
    );

    connectSpy.mockRestore();
  });

  it('should disconnect cleanly when readyState is not disconnected', async () => {
    (mongoose.connection as unknown as { readyState: number }).readyState = 1;
    const disconnectSpy = jest
      .spyOn(mongoose, 'disconnect')
      .mockResolvedValue(undefined as never);

    await disconnectDatabase();

    expect(disconnectSpy).toHaveBeenCalledTimes(1);
    expect(loggerInfoSpy).toHaveBeenCalledWith('MongoDB connection closed');

    disconnectSpy.mockRestore();
  });

  it('should not attempt to disconnect when readyState is already 0', async () => {
    (mongoose.connection as unknown as { readyState: number }).readyState = 0;
    const disconnectSpy = jest
      .spyOn(mongoose, 'disconnect')
      .mockResolvedValue(undefined as never);

    await disconnectDatabase();

    expect(disconnectSpy).not.toHaveBeenCalled();

    disconnectSpy.mockRestore();
  });
});
