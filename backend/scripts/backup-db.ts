/**
 * Production Database Backup Script
 * Exports all collections from the active MongoDB database to a timestamped JSON file.
 * Requires no external MongoDB command-line tools.
 * 
 * Usage:
 *   DATABASE_URL="<connection_string>" npm run db:backup
 */
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import config from '../src/config/environment';
import { connectDatabase, disconnectDatabase } from '../src/config/database';
import logger from '../src/utils/logger';

async function backupDatabase() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(__dirname, '../backups');

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const backupFilePath = path.join(backupDir, `portfolio-backup-${timestamp}.json`);

  try {
    logger.info('Connecting to database for backup...');
    await connectDatabase();

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection instance not available.');
    }

    const collections = await db.listCollections().toArray();
    const backupData: Record<string, any[]> = {};
    const summary: Record<string, number> = {};

    for (const col of collections) {
      const name = col.name;
      // Skip system indexes/collections
      if (name.startsWith('system.')) continue;

      const documents = await db.collection(name).find({}).toArray();
      backupData[name] = documents;
      summary[name] = documents.length;
    }

    fs.writeFileSync(backupFilePath, JSON.stringify(backupData, null, 2), 'utf-8');

    console.log('\n=================================================');
    console.log('   DATABASE BACKUP COMPLETED SUCCESSFULLY        ');
    console.log('=================================================');
    console.log(`Saved To: ${backupFilePath}`);
    console.log('Collection Summary:');
    console.table(summary);
    console.log('=================================================\n');
  } catch (error) {
    logger.error('Database backup failed:', error);
    process.exit(1);
  } finally {
    await disconnectDatabase();
  }
}

if (require.main === module) {
  backupDatabase();
}

export default backupDatabase;
