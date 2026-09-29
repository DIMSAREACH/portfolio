import nodemailer, { Transporter } from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import config from './environment';
import logger from '../utils/logger';

export interface EmailConfigOptions {
  host: string;
  port: number;
  secure: boolean;
  auth?: {
    user: string;
    pass: string;
  };
}

/**
 * Build Nodemailer transport options based on current environment configuration.
 */
export const getEmailConfig = (): EmailConfigOptions => {
  const isSecure = config.EMAIL_PORT === 465;

  const emailOptions: EmailConfigOptions = {
    host: config.EMAIL_HOST || 'localhost',
    port: config.EMAIL_PORT || 587,
    secure: isSecure,
  };

  if (config.EMAIL_USER && config.EMAIL_PASS) {
    emailOptions.auth = {
      user: config.EMAIL_USER,
      pass: config.EMAIL_PASS,
    };
  }

  return emailOptions;
};

/**
 * Creates and returns a Nodemailer Transporter instance.
 */
export const createTransporter = (
  customConfig?: SMTPTransport.Options,
): Transporter => {
  const defaultOptions: SMTPTransport.Options = getEmailConfig();
  return nodemailer.createTransport(customConfig || defaultOptions);
};

/**
 * Default transporter instance singleton.
 */
export const emailTransporter: Transporter = createTransporter();

/**
 * Helper to test SMTP connection verify callback / promise.
 */
export const verifyEmailConnection = async (
  transporter: Transporter = emailTransporter,
): Promise<boolean> => {
  try {
    await transporter.verify();
    logger.info('SMTP connection established successfully');
    return true;
  } catch (error) {
    logger.warn('Failed to establish SMTP connection', {
      error: (error as Error).message,
    });
    return false;
  }
};

export default emailTransporter;
