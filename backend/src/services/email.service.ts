import { Transporter } from 'nodemailer';
import { emailTransporter } from '../config/email';
import config from '../config/environment';
import logger from '../utils/logger';
import settingsService from './settings.service';
import { IMessage } from '../models/Message';

export interface ContactMessagePayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt?: Date | string;
}

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  from?: string;
  replyTo?: string;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  skipped?: boolean;
  error?: string;
}

/**
 * Escapes characters for safe inclusion in HTML templates.
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export class EmailService {
  private transporter: Transporter;

  constructor(transporterInstance: Transporter = emailTransporter) {
    this.transporter = transporterInstance;
  }

  /**
   * Set custom transporter (useful for testing or dynamic switching)
   */
  public setTransporter(transporterInstance: Transporter): void {
    this.transporter = transporterInstance;
  }

  /**
   * Get current transporter instance
   */
  public getTransporter(): Transporter {
    return this.transporter;
  }

  /**
   * Generic method to send an email with graceful error handling.
   * Never throws — logs errors and returns an EmailResult object.
   */
  async sendEmail(options: SendEmailOptions): Promise<EmailResult> {
    try {
      if (config.RESEND_API_KEY) {
        const fromAddress = options.from && !options.from.includes('localhost') && !options.from.includes('example.com')
          ? options.from
          : 'Portfolio Notification <onboarding@resend.dev>';

        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${config.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: fromAddress,
            to: options.to,
            subject: options.subject,
            html: options.html || options.text,
            reply_to: options.replyTo,
          }),
        });

        if (!response.ok) {
          const errData = await response.text();
          throw new Error(`Resend API error (${response.status}): ${errData}`);
        }

        const resData = (await response.json()) as { id?: string };
        logger.info('Email sent successfully via Resend HTTP API', {
          messageId: resData.id,
          to: options.to,
          subject: options.subject,
        });

        return {
          success: true,
          messageId: resData.id,
        };
      }

      const mailOptions = {
        from: options.from || config.EMAIL_FROM,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
        replyTo: options.replyTo,
      };

      const info = await this.transporter.sendMail(mailOptions);

      logger.info('Email sent successfully', {
        messageId: info.messageId,
        to: options.to,
        subject: options.subject,
      });

      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      const errorMessage = (error as Error).message;
      logger.error('Failed to send email', {
        error: errorMessage,
        to: options.to,
        subject: options.subject,
      });

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Notify admin about a newly submitted contact message.
   * Reads notification email and active flag from Settings with graceful fallbacks.
   * Catches all errors gracefully to avoid blocking user-facing API responses.
   */
  async sendContactNotification(
    message: IMessage | ContactMessagePayload,
  ): Promise<EmailResult> {
    try {
      let recipientEmail = config.EMAIL_USER || 'dimsareach009@gmail.com';
      let notificationsEnabled = true;

      try {
        const settings = await settingsService.getSettings();
        if (settings) {
          if (settings.emailNotifications === false) {
            notificationsEnabled = false;
          }
          if (settings.notificationEmail && settings.notificationEmail.trim()) {
            recipientEmail = settings.notificationEmail.trim();
          }
        }
      } catch (settingsError) {
        logger.warn('Failed to load settings for email notification, using default recipient', {
          error: (settingsError as Error).message,
        });
      }

      if (!notificationsEnabled) {
        logger.info('Contact notification email skipped: emailNotifications disabled in settings');
        return {
          success: false,
          skipped: true,
        };
      }

      if (!recipientEmail) {
        logger.warn('Contact notification email skipped: no recipient email configured');
        return {
          success: false,
          error: 'No recipient email configured',
        };
      }

      const receivedDate = message.createdAt
        ? new Date(message.createdAt).toUTCString()
        : new Date().toUTCString();

      const safeName = escapeHtml(message.name);
      const safeEmail = escapeHtml(message.email);
      const safeSubject = escapeHtml(message.subject);
      const safeMessage = escapeHtml(message.message);

      const subject = `[Portfolio Contact] ${message.subject}`;

      const textBody = `
You have received a new contact message from your portfolio website.

Sender Name:    ${message.name}
Sender Email:   ${message.email}
Subject:        ${message.subject}
Received:       ${receivedDate}

Message:
--------------------------------------------------
${message.message}
--------------------------------------------------

Reply directly to this email to respond to ${message.name} (${message.email}).
`.trim();

      const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Submission</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; background-color: #f8fafc; margin: 0; padding: 24px; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
    .header { background: #4f46e5; color: #ffffff; padding: 24px; text-align: left; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 600; }
    .content { padding: 24px; }
    .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    .meta-table td { padding: 8px 0; vertical-align: top; font-size: 14px; }
    .meta-table .label { width: 120px; font-weight: 600; color: #64748b; }
    .meta-table .val { color: #0f172a; }
    .meta-table .val a { color: #4f46e5; text-decoration: none; }
    .message-box { background: #f1f5f9; border-left: 4px solid #4f46e5; padding: 16px; border-radius: 4px; font-size: 15px; white-space: pre-wrap; word-break: break-word; color: #334155; }
    .footer { padding: 16px 24px; background: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Contact Submission</h1>
    </div>
    <div class="content">
      <table class="meta-table">
        <tr>
          <td class="label">Sender Name:</td>
          <td class="val"><strong>${safeName}</strong></td>
        </tr>
        <tr>
          <td class="label">Sender Email:</td>
          <td class="val"><a href="mailto:${safeEmail}">${safeEmail}</a></td>
        </tr>
        <tr>
          <td class="label">Subject:</td>
          <td class="val">${safeSubject}</td>
        </tr>
        <tr>
          <td class="label">Received:</td>
          <td class="val">${receivedDate}</td>
        </tr>
      </table>

      <h3 style="margin-top: 16px; margin-bottom: 8px; font-size: 14px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Message</h3>
      <div class="message-box">${safeMessage}</div>
    </div>
    <div class="footer">
      This notification was sent from your Developer Portfolio contact form.
    </div>
  </div>
</body>
</html>
`.trim();

      return await this.sendEmail({
        to: recipientEmail,
        replyTo: `"${message.name}" <${message.email}>`,
        subject,
        text: textBody,
        html: htmlBody,
      });
    } catch (unexpectedError) {
      const errorMessage = (unexpectedError as Error).message;
      logger.error('Unexpected error in sendContactNotification', {
        error: errorMessage,
      });
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Send an optional confirmation email to the user who contacted the portfolio.
   * Fails gracefully without throwing.
   */
  async sendContactConfirmation(
    message: IMessage | ContactMessagePayload,
  ): Promise<EmailResult> {
    try {
      const safeName = escapeHtml(message.name);
      const safeSubject = escapeHtml(message.subject);
      const safeMessage = escapeHtml(message.message);

      const subject = `Message received: ${message.subject}`;

      const textBody = `
Hi ${message.name},

Thank you for reaching out! I have received your message regarding "${message.subject}".

I will review your message and get back to you as soon as possible.

Your message summary:
--------------------------------------------------
${message.message}
--------------------------------------------------

Best regards,
Developer Portfolio
`.trim();

      const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Message Received</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e293b; background-color: #f8fafc; padding: 24px; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; }
    .header { background: #4f46e5; color: #ffffff; padding: 20px; }
    .content { padding: 24px; }
    .message-box { background: #f1f5f9; padding: 16px; border-radius: 4px; font-size: 14px; white-space: pre-wrap; margin-top: 16px; }
    .footer { padding: 16px; background: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2 style="margin: 0; font-size: 18px;">Thank You for Reaching Out</h2>
    </div>
    <div class="content">
      <p>Hi <strong>${safeName}</strong>,</p>
      <p>Thank you for getting in touch! I have received your message regarding <em>"${safeSubject}"</em> and will get back to you shortly.</p>
      <p style="font-size: 13px; color: #64748b; margin-bottom: 4px;">Copy of your message:</p>
      <div class="message-box">${safeMessage}</div>
    </div>
    <div class="footer">
      Developer Portfolio & Content Management
    </div>
  </div>
</body>
</html>
`.trim();

      return await this.sendEmail({
        to: message.email,
        subject,
        text: textBody,
        html: htmlBody,
      });
    } catch (error) {
      const errorMessage = (error as Error).message;
      logger.error('Failed to send contact confirmation email', {
        error: errorMessage,
        to: message.email,
      });
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Send password reset email containing a secure one-time link.
   * Catches errors gracefully and returns an EmailResult.
   */
  async sendPasswordResetEmail(
    to: string,
    resetUrl: string,
    userName = 'Administrator',
  ): Promise<EmailResult> {
    try {
      const safeName = escapeHtml(userName);
      const safeUrl = resetUrl;
      const subject = 'Password Reset Request - Dim Sareach Portfolio CMS';

      const textBody = `
Hello ${userName},

A password reset was requested for your Portfolio CMS administrator account (${to}).

To reset your password, please open the following link in your browser:
${resetUrl}

This link is valid for 1 hour from the time it was requested.

If you did not request a password reset, you can safely ignore this email. Your current password will remain unchanged.

Best regards,
Portfolio Security
`.trim();

      const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; background-color: #f8fafc; margin: 0; padding: 24px; }
    .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
    .header { background: #4f46e5; color: #ffffff; padding: 28px 24px; text-align: center; }
    .header h1 { margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.02em; }
    .content { padding: 32px 24px; }
    .button-wrap { text-align: center; margin: 32px 0; }
    .btn { display: inline-block; background: #4f46e5; color: #ffffff !important; font-weight: 600; font-size: 15px; text-decoration: none; padding: 14px 32px; border-radius: 8px; box-shadow: 0 2px 4px rgba(79, 70, 229, 0.3); }
    .url-fallback { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; font-family: monospace; font-size: 12px; word-break: break-all; color: #64748b; margin-top: 16px; }
    .notice { font-size: 13px; color: #64748b; border-left: 3px solid #f59e0b; padding-left: 12px; margin: 24px 0; }
    .footer { padding: 20px 24px; background: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Portfolio CMS Security</h1>
    </div>
    <div class="content">
      <p style="font-size: 16px; margin-top: 0;">Hello <strong>${safeName}</strong>,</p>
      <p>We received a request to reset the password for your administrator account (<strong style="color: #4f46e5;">${to}</strong>).</p>
      <p>Click the button below to set a new password:</p>
      
      <div class="button-wrap">
        <a href="${safeUrl}" target="_blank" rel="noopener noreferrer" class="btn">Reset Password</a>
      </div>

      <div class="notice">
        <strong>Security Notice:</strong> This link is single-use and will expire in <strong>1 hour</strong>. If you did not request this change, please ignore this email or review your account activity.
      </div>

      <p style="font-size: 13px; color: #64748b; margin-bottom: 4px;">Having trouble with the button? Copy and paste this URL into your browser:</p>
      <div class="url-fallback">${safeUrl}</div>
    </div>
    <div class="footer">
      Developer Portfolio &bull; Automated Security Service
    </div>
  </div>
</body>
</html>
`.trim();

      return await this.sendEmail({
        to,
        subject,
        text: textBody,
        html: htmlBody,
      });
    } catch (unexpectedError) {
      const errorMessage = (unexpectedError as Error).message;
      logger.error('Unexpected error in sendPasswordResetEmail', {
        error: errorMessage,
        to,
      });
      return {
        success: false,
        error: errorMessage,
      };
    }
  }
}

export const emailService = new EmailService();
export default emailService;
