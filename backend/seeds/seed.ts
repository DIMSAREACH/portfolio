import { connectDatabase, disconnectDatabase } from '../src/config/database';
import User from '../src/models/User';
import logger from '../src/utils/logger';

export const ADMIN_DEFAULTS = {
  email: 'admin@portfolio.dev',
  password: 'Admin@123456',
  fullName: 'Portfolio Admin',
  role: 'admin' as const,
};

/**
 * Seed database with initial admin user if not already present.
 */
export async function seedDatabase(): Promise<void> {
  try {
    await connectDatabase();

    const existingAdmin = await User.findOne({ email: ADMIN_DEFAULTS.email });
    if (existingAdmin) {
      logger.info(`Admin user already exists (${ADMIN_DEFAULTS.email}). Skipping creation.`);
    } else {
      await User.create({
        email: ADMIN_DEFAULTS.email,
        password: ADMIN_DEFAULTS.password,
        fullName: ADMIN_DEFAULTS.fullName,
        role: ADMIN_DEFAULTS.role,
      });
      logger.info(`Initial admin user successfully seeded (${ADMIN_DEFAULTS.email}).`);
    }
  } catch (error) {
    logger.error('Error seeding database:', error);
    throw error;
  } finally {
    await disconnectDatabase();
  }
}

// Execute when run directly from command line (e.g. npm run seed)
if (require.main === module) {
  seedDatabase()
    .then(() => {
      logger.info('Database seeding completed successfully.');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Database seeding failed:', error);
      process.exit(1);
    });
}

export default seedDatabase;
