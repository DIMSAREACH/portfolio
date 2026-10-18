import dotenv from 'dotenv';
dotenv.config();

import { r2Service } from '../src/services/r2.service';
import logger from '../src/utils/logger';

async function testR2() {
  logger.info('=== Cloudflare R2 Connection Test ===');

  if (!r2Service.isAvailable()) {
    logger.error('R2 is not properly configured. Check your environment variables.');
    process.exit(1);
  }

  try {
    const testBuffer = Buffer.from('Hello from Dim Sareach Portfolio Cloudflare R2 Storage Test!');
    const testFileName = `test_${Date.now()}.txt`;
    
    logger.info(`1. Uploading test file: ${testFileName}`);
    const uploadRes = await r2Service.uploadBuffer(
      testBuffer,
      'portfolio/test',
      testFileName,
      'text/plain',
      'raw',
    );

    logger.info(` Upload successful!`);
    logger.info(`   - Public URL: ${uploadRes.secureUrl}`);
    logger.info(`   - Object Key: ${uploadRes.publicId}`);
    logger.info(`   - Size: ${uploadRes.bytes} bytes`);

    logger.info('2. Checking if object exists...');
    const exists = await r2Service.fileExists(uploadRes.publicId);
    logger.info(`   - Exists in bucket: ${exists}`);

    logger.info('3. Cleaning up test file...');
    await r2Service.deleteFile(uploadRes.publicId);
    logger.info(' Test file deleted successfully!');

    logger.info('=== ALL R2 TESTS PASSED! CLOUDFLARE R2 IS OPERATIONAL ===');
    process.exit(0);
  } catch (err) {
    logger.error('R2 Test Failed:', err);
    process.exit(1);
  }
}

testR2();
