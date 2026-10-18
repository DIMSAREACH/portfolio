import { S3Client } from '@aws-sdk/client-s3';
import config from './environment';
import logger from '../utils/logger';

export const isR2Configured = (): boolean => {
  if (config.NODE_ENV === 'test') {
    return false;
  }
  return Boolean(
    config.R2_ACCESS_KEY_ID &&
      config.R2_SECRET_ACCESS_KEY &&
      (config.R2_ENDPOINT || config.R2_ACCOUNT_ID) &&
      config.R2_BUCKET_NAME,
  );
};

export const getR2Endpoint = (): string => {
  if (config.R2_ENDPOINT) {
    return config.R2_ENDPOINT;
  }
  if (config.R2_ACCOUNT_ID) {
    return `https://${config.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
  }
  return '';
};

let clientInstance: S3Client | null = null;

export const getR2Client = (): S3Client => {
  if (!clientInstance) {
    const endpoint = getR2Endpoint();
    logger.info(`Initializing Cloudflare R2 client (endpoint: ${endpoint || 'not set'})`);

    clientInstance = new S3Client({
      region: 'auto',
      endpoint: endpoint || undefined,
      credentials: {
        accessKeyId: config.R2_ACCESS_KEY_ID || '',
        secretAccessKey: config.R2_SECRET_ACCESS_KEY || '',
      },
    });
  }
  return clientInstance;
};

export default getR2Client;
