/**
 * Production Database Restore Script
 * Restores collections from a JSON backup file to the target MongoDB database.
 * 
 * Usage:
 *   DATABASE_URL="<connection_string>" FILE="backups/portfolio-backup-xxx.json" npm run db:restore
 */
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { connectDatabase, disconnectDatabase } from '../src/config/database';
import logger from '../src/utils/logger';

async function restoreDatabase() {
  const backupFileArg = process.env.FILE || process.argv[2];

  if (!backupFileArg) {
    console.error('Error: Please specify the backup file to restore.');
    console.error('Example: npm run db:restore -- backups/portfolio-backup-2026-10-28.json');
    process.exit(1);
  }

  const filePath = path.isAbsolute(backupFileArg)
    ? backupFileArg
    : path.join(__dirname, '..', backupFileArg);

  if (!fs.existsSync(filePath)) {
    console.error(`Error: Backup file not found at: ${filePath}`);
    process.exit(1);
  }

  try {
    const rawData = fs.readFileSync(filePath, 'utf-8');
    const backupData: Record<string, any[]> = JSON.parse(rawData);

    logger.info('Connecting to database for restore...');
    await connectDatabase();

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection instance not available.');
    }

    const summary: Record<string, number> = {};

    for (const [collectionName, documents] of Object.entries(backupData)) {
      if (!Array.isArray(documents)) continue;

      // Drop existing collection before restoring
      try {
        await db.collection(collectionName).drop();
      } catch (err: any) {
        // Ignore namespace not found error on empty DBs
        if (err.code !== 26) {
          logger.warn(`Could not drop collection ${collectionName}:`, err.message);
        }
      }

      if (documents.length > 0) {
        await db.collection(collectionName).insertMany(documents);
      }
      summary[collectionName] = documents.length;
    }

    console.log('\n=================================================');
    console.log('   DATABASE RESTORE COMPLETED SUCCESSFULLY       ');
    console.log('=================================================');
    console.log(`Restored From: ${filePath}`);
    console.log('Restored Summary:');
    console.table(summary);
    console.log('=================================================\n');
  } catch (error) {
    logger.error('Database restore failed:', error);
    process.exit(1);
  } finally {
    await disconnectDatabase();
  }
}

if (require.main === module) {
  restoreDatabase();
}

export default restoreDatabase;
