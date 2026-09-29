import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import * as dbModule from '../../../src/config/database';
import User from '../../../src/models/User';
import logger from '../../../src/utils/logger';
import { seedDatabase, ADMIN_DEFAULTS } from '../../../seeds/seed';

describe('Admin Seed Script (seedDatabase)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(dbModule, 'connectDatabase').mockImplementation(() => Promise.resolve({} as any));
    jest.spyOn(dbModule, 'disconnectDatabase').mockImplementation(() => Promise.resolve());
    jest.spyOn(logger, 'info').mockImplementation(() => logger);
    jest.spyOn(logger, 'error').mockImplementation(() => logger);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should seed admin user when no admin exists', async () => {
    jest.spyOn(User, 'findOne').mockResolvedValue(null);
    const createSpy = jest.spyOn(User, 'create').mockImplementation(() =>
      Promise.resolve({
        email: ADMIN_DEFAULTS.email,
        fullName: ADMIN_DEFAULTS.fullName,
        role: ADMIN_DEFAULTS.role,
      } as any),
    );

    await seedDatabase();

    expect(dbModule.connectDatabase).toHaveBeenCalledTimes(1);
    expect(User.findOne).toHaveBeenCalledWith({ email: ADMIN_DEFAULTS.email });
    expect(createSpy).toHaveBeenCalledWith({
      email: ADMIN_DEFAULTS.email,
      password: ADMIN_DEFAULTS.password,
      fullName: ADMIN_DEFAULTS.fullName,
      role: ADMIN_DEFAULTS.role,
    });
    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining('Initial admin user successfully seeded'),
    );
    expect(dbModule.disconnectDatabase).toHaveBeenCalledTimes(1);
  });

  it('should skip creation if admin user already exists (idempotency)', async () => {
    jest.spyOn(User, 'findOne').mockResolvedValue({
      email: ADMIN_DEFAULTS.email,
      role: 'admin',
    } as any);
    const createSpy = jest.spyOn(User, 'create');

    await seedDatabase();

    expect(dbModule.connectDatabase).toHaveBeenCalledTimes(1);
    expect(User.findOne).toHaveBeenCalledWith({ email: ADMIN_DEFAULTS.email });
    expect(createSpy).not.toHaveBeenCalled();
    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining('Admin user already exists'),
    );
    expect(dbModule.disconnectDatabase).toHaveBeenCalledTimes(1);
  });

  it('should disconnect from database even if an error is thrown', async () => {
    jest.spyOn(User, 'findOne').mockRejectedValue(new Error('DB Query Failure'));

    await expect(seedDatabase()).rejects.toThrow('DB Query Failure');

    expect(dbModule.connectDatabase).toHaveBeenCalledTimes(1);
    expect(logger.error).toHaveBeenCalledWith('Error seeding database:', expect.any(Error));
    expect(dbModule.disconnectDatabase).toHaveBeenCalledTimes(1);
  });
});
