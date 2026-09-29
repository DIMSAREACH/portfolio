import request from 'supertest';
import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import app from '../../src/app';
import messageService from '../../src/services/message.service';
import emailService from '../../src/services/email.service';

describe('Contact Form API Integration Tests (POST /api/v1/contact)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const validPayload = {
    name: 'Sokha Chea',
    email: 'sokha@example.com',
    subject: 'Project inquiry and quote',
    message: 'Hello, I would like to get a quote for a full-stack web development project.',
    honeypot: '',
  };

  it('should process valid submission, store message in DB, trigger email notification, and return 201', async () => {
    const mockCreatedMessage: any = {
      _id: '6abc2f77ed5966aa1b87e299',
      ...validPayload,
      ipAddress: '127.0.0.1',
      isRead: false,
      isArchived: false,
      createdAt: new Date(),
    };

    jest.spyOn(messageService, 'create').mockResolvedValue(mockCreatedMessage);
    jest.spyOn(emailService, 'sendContactNotification').mockResolvedValue({
      success: true,
      messageId: 'mock-msg-id-123',
    });

    const res = await request(app)
      .post('/api/v1/contact')
      .send(validPayload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeNull();
    expect(res.body.message).toBe('Message sent successfully. Thank you for reaching out!');

    expect(messageService.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: validPayload.name,
        email: validPayload.email,
        subject: validPayload.subject,
        message: validPayload.message,
      }),
    );
    expect(emailService.sendContactNotification).toHaveBeenCalledWith(mockCreatedMessage);
  });

  it('should silently reject honeypot submissions (returns 201 but does NOT store or email)', async () => {
    jest.spyOn(messageService, 'create');
    jest.spyOn(emailService, 'sendContactNotification');

    const res = await request(app)
      .post('/api/v1/contact')
      .send({
        ...validPayload,
        honeypot: 'spam-bot-token-12345',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Message sent successfully. Thank you for reaching out!');

    expect(messageService.create).not.toHaveBeenCalled();
    expect(emailService.sendContactNotification).not.toHaveBeenCalled();
  });

  it('should return 400 validation error when required fields are missing or invalid', async () => {
    const res = await request(app)
      .post('/api/v1/contact')
      .send({
        name: 'A', // too short
        email: 'invalid-email',
        subject: 'Hey', // too short
        message: 'Short', // too short
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Validation failed');
    expect(res.body.errors).toBeDefined();

    const fields = res.body.errors.map((e: any) => e.field);
    expect(fields).toContain('name');
    expect(fields).toContain('email');
    expect(fields).toContain('subject');
    expect(fields).toContain('message');
  });

  it('should handle background email failure gracefully without failing the API response', async () => {
    const mockCreatedMessage: any = {
      _id: '6abc2f77ed5966aa1b87e298',
      ...validPayload,
      ipAddress: '127.0.0.1',
    };

    jest.spyOn(messageService, 'create').mockResolvedValue(mockCreatedMessage);
    jest.spyOn(emailService, 'sendContactNotification').mockRejectedValue(new Error('SMTP down'));

    const res = await request(app)
      .post('/api/v1/contact')
      .send(validPayload);

    // API should still succeed with 201
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(messageService.create).toHaveBeenCalled();
  });

  it('should enforce rate limiting and return 429 when max 5 submissions is exceeded', async () => {
    jest.spyOn(messageService, 'create').mockResolvedValue({} as any);
    jest.spyOn(emailService, 'sendContactNotification').mockResolvedValue({ success: true });

    // Since prior tests in this suite have made 3 requests, let's make requests until 429 is hit
    let rateLimitedResponse: any = null;

    for (let i = 0; i < 6; i++) {
      const res = await request(app)
        .post('/api/v1/contact')
        .send(validPayload);

      if (res.status === 429) {
        rateLimitedResponse = res;
        break;
      }
    }

    expect(rateLimitedResponse).not.toBeNull();
    expect(rateLimitedResponse.status).toBe(429);
    expect(rateLimitedResponse.body.success).toBe(false);
    expect(rateLimitedResponse.body.message).toContain('Too many contact requests');
  });
});
