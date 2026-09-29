import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { EmailService, escapeHtml } from '../../../src/services/email.service';
import settingsService from '../../../src/services/settings.service';
import config from '../../../src/config/environment';

jest.mock('../../../src/utils/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
}));

describe('EmailService', () => {
  let mockTransporter: any;
  let emailService: EmailService;

  beforeEach(() => {
    jest.clearAllMocks();

    mockTransporter = {
      sendMail: (jest.fn() as any).mockResolvedValue({
        messageId: 'mock-message-id-12345',
        response: '250 OK',
      }),
    };

    emailService = new EmailService(mockTransporter);
  });

  describe('escapeHtml', () => {
    it('should escape HTML characters correctly', () => {
      const input = '<script>alert("XSS" & \'test\')</script>';
      const expected = '&lt;script&gt;alert(&quot;XSS&quot; &amp; &#039;test&#039;)&lt;/script&gt;';
      expect(escapeHtml(input)).toBe(expected);
    });

    it('should leave strings without special characters unchanged', () => {
      const input = 'Hello World 123';
      expect(escapeHtml(input)).toBe('Hello World 123');
    });
  });

  describe('setTransporter & getTransporter', () => {
    it('should allow setting and retrieving a custom transporter', () => {
      const newTransporter: any = { sendMail: jest.fn() };
      emailService.setTransporter(newTransporter);
      expect(emailService.getTransporter()).toBe(newTransporter);
    });
  });

  describe('sendEmail', () => {
    it('should send email successfully and return success result', async () => {
      const options = {
        to: 'recipient@example.com',
        subject: 'Test Subject',
        text: 'Hello test',
        html: '<p>Hello test</p>',
      };

      const result = await emailService.sendEmail(options);

      expect(result.success).toBe(true);
      expect(result.messageId).toBe('mock-message-id-12345');
      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          from: config.EMAIL_FROM,
          to: 'recipient@example.com',
          subject: 'Test Subject',
          text: 'Hello test',
          html: '<p>Hello test</p>',
        }),
      );
    });

    it('should use custom from if provided in options', async () => {
      const options = {
        from: 'custom@example.com',
        to: 'recipient@example.com',
        subject: 'Custom From',
      };

      await emailService.sendEmail(options);

      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 'custom@example.com',
        }),
      );
    });

    it('should catch errors gracefully and return success false without throwing', async () => {
      mockTransporter.sendMail.mockRejectedValue(new Error('SMTP Auth Error'));

      const result = await emailService.sendEmail({
        to: 'fail@example.com',
        subject: 'Fail Test',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('SMTP Auth Error');
    });
  });

  describe('sendContactNotification', () => {
    const sampleMessage = {
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Inquiry about project',
      message: 'Hello, I would like to discuss a web project.',
      createdAt: new Date('2026-09-30T10:00:00Z'),
    };

    it('should send contact notification to notificationEmail from settings', async () => {
      jest.spyOn(settingsService, 'getSettings').mockResolvedValue({
        emailNotifications: true,
        notificationEmail: 'admin.custom@portfolio.dev',
      } as any);

      const result = await emailService.sendContactNotification(sampleMessage);

      expect(result.success).toBe(true);
      expect(result.messageId).toBe('mock-message-id-12345');
      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'admin.custom@portfolio.dev',
          replyTo: '"John Doe" <john@example.com>',
          subject: '[Portfolio Contact] Inquiry about project',
          text: expect.stringContaining('John Doe'),
          html: expect.stringContaining('John Doe'),
        }),
      );
    });

    it('should skip notification when emailNotifications is false in settings', async () => {
      jest.spyOn(settingsService, 'getSettings').mockResolvedValue({
        emailNotifications: false,
        notificationEmail: 'admin@portfolio.dev',
      } as any);

      const result = await emailService.sendContactNotification(sampleMessage);

      expect(result.success).toBe(false);
      expect(result.skipped).toBe(true);
      expect(mockTransporter.sendMail).not.toHaveBeenCalled();
    });

    it('should fallback to default email if notificationEmail is not set', async () => {
      jest.spyOn(settingsService, 'getSettings').mockResolvedValue({
        emailNotifications: true,
        notificationEmail: '',
      } as any);

      const result = await emailService.sendContactNotification(sampleMessage);

      expect(result.success).toBe(true);
      const expectedTo = config.EMAIL_USER || 'admin@portfolio.dev';
      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: expectedTo,
        }),
      );
    });

    it('should handle settingsService failure gracefully and fallback to default recipient', async () => {
      jest.spyOn(settingsService, 'getSettings').mockRejectedValue(new Error('DB Error'));

      const result = await emailService.sendContactNotification(sampleMessage);

      expect(result.success).toBe(true);
      expect(mockTransporter.sendMail).toHaveBeenCalled();
    });

    it('should catch sendMail errors gracefully and return success: false without throwing', async () => {
      jest.spyOn(settingsService, 'getSettings').mockResolvedValue({
        emailNotifications: true,
        notificationEmail: 'admin@portfolio.dev',
      } as any);

      mockTransporter.sendMail.mockRejectedValue(new Error('Connection dropped'));

      const result = await emailService.sendContactNotification(sampleMessage);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Connection dropped');
    });

    it('should sanitize HTML in user inputs to prevent XSS in email clients', async () => {
      jest.spyOn(settingsService, 'getSettings').mockResolvedValue({
        emailNotifications: true,
        notificationEmail: 'admin@portfolio.dev',
      } as any);

      const maliciousMessage = {
        name: '<script>alert("name")</script>',
        email: 'malicious@example.com',
        subject: '<img src=x onerror=alert(1)>',
        message: '<b onmouseover="evil()">Click</b>',
      };

      await emailService.sendContactNotification(maliciousMessage);

      const sendMailArgs = mockTransporter.sendMail.mock.calls[0][0];
      expect(sendMailArgs.html).not.toContain('<script>');
      expect(sendMailArgs.html).toContain('&lt;script&gt;');
      expect(sendMailArgs.html).not.toContain('<img src=x');
      expect(sendMailArgs.html).toContain('&lt;img src=x');
    });
  });

  describe('sendContactConfirmation', () => {
    const sampleMessage = {
      name: 'Alice',
      email: 'alice@example.com',
      subject: 'Collaboration opportunity',
      message: 'Interested in working together!',
    };

    it('should send confirmation email to the sender', async () => {
      const result = await emailService.sendContactConfirmation(sampleMessage);

      expect(result.success).toBe(true);
      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'alice@example.com',
          subject: 'Message received: Collaboration opportunity',
          text: expect.stringContaining('Alice'),
          html: expect.stringContaining('Alice'),
        }),
      );
    });

    it('should handle errors gracefully without throwing', async () => {
      mockTransporter.sendMail.mockRejectedValue(new Error('Delivery failed'));

      const result = await emailService.sendContactConfirmation(sampleMessage);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Delivery failed');
    });
  });
});
