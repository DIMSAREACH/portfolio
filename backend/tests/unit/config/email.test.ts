import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import nodemailer from 'nodemailer';
import {
  getEmailConfig,
  createTransporter,
  verifyEmailConnection,
  emailTransporter,
} from '../../../src/config/email';
import config from '../../../src/config/environment';

jest.mock('../../../src/utils/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
}));

describe('Email Configuration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getEmailConfig', () => {
    it('should return config matching environment settings', () => {
      const emailConfig = getEmailConfig();

      expect(emailConfig.host).toBe(config.EMAIL_HOST || 'localhost');
      expect(emailConfig.port).toBe(config.EMAIL_PORT);
      expect(emailConfig.secure).toBe(config.EMAIL_PORT === 465);

      if (config.EMAIL_USER && config.EMAIL_PASS) {
        expect(emailConfig.auth).toEqual({
          user: config.EMAIL_USER,
          pass: config.EMAIL_PASS,
        });
      }
    });
  });

  describe('createTransporter', () => {
    it('should instantiate a nodemailer transporter', () => {
      const transporter = createTransporter();
      expect(transporter).toBeDefined();
      expect(typeof transporter.sendMail).toBe('function');
    });

    it('should accept custom transport options', () => {
      const spy = jest.spyOn(nodemailer, 'createTransport');
      const customOptions = { host: 'custom.smtp.com', port: 2525, secure: false };
      createTransporter(customOptions as any);

      expect(spy).toHaveBeenCalledWith(customOptions);
      spy.mockRestore();
    });
  });

  describe('emailTransporter', () => {
    it('should be initialized with a default transporter', () => {
      expect(emailTransporter).toBeDefined();
      expect(typeof emailTransporter.sendMail).toBe('function');
    });
  });

  describe('verifyEmailConnection', () => {
    it('should return true when verify resolves successfully', async () => {
      const mockTransporter: any = {
        verify: (jest.fn() as any).mockResolvedValue(true),
      };

      const result = await verifyEmailConnection(mockTransporter);
      expect(result).toBe(true);
      expect(mockTransporter.verify).toHaveBeenCalled();
    });

    it('should return false and log warning when verify fails', async () => {
      const mockTransporter: any = {
        verify: (jest.fn() as any).mockRejectedValue(new Error('SMTP Connection timeout')),
      };

      const result = await verifyEmailConnection(mockTransporter);
      expect(result).toBe(false);
      expect(mockTransporter.verify).toHaveBeenCalled();
    });
  });
});
