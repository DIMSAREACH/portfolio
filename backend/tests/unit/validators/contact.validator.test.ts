import { describe, it, expect } from '@jest/globals';
import { Request, Response, NextFunction } from 'express';
import { contactFormValidator } from '../../../src/validators/contact.validator';
import { validate } from '../../../src/middleware/validate.middleware';

describe('Contact Form Validator', () => {
  const createMockReqRes = (body: Record<string, unknown>) => {
    const req = { body } as unknown as Request;
    let statusCode = 200;
    let jsonResponse: any = null;

    const res = {
      status: (code: number) => {
        statusCode = code;
        return res;
      },
      json: (data: any) => {
        jsonResponse = data;
        return res;
      },
    } as unknown as Response;

    const next = (() => {}) as unknown as NextFunction;

    return { req, res, next, getStatus: () => statusCode, getJson: () => jsonResponse };
  };

  const middleware = validate(contactFormValidator);

  it('should pass validation with valid full payload', async () => {
    let nextCalled = false;
    const { req, res } = createMockReqRes({
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Inquiry about Web Dev',
      message: 'Hello, I would like to inquire about your full-stack development services.',
      honeypot: '',
    });

    await middleware(req, res, () => {
      nextCalled = true;
    });

    expect(nextCalled).toBe(true);
  });

  it('should fail when name is missing or too short', async () => {
    let nextCalled = false;
    const { req, res, getStatus, getJson } = createMockReqRes({
      name: 'A',
      email: 'john@example.com',
      subject: 'Valid Subject',
      message: 'Valid message with enough characters.',
    });

    await middleware(req, res, () => {
      nextCalled = true;
    });

    expect(nextCalled).toBe(false);
    expect(getStatus()).toBe(400);
    expect(getJson().errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'name', message: 'Name must be between 2 and 100 characters' }),
      ]),
    );
  });

  it('should fail when name exceeds 100 characters', async () => {
    let nextCalled = false;
    const { req, res, getStatus, getJson } = createMockReqRes({
      name: 'A'.repeat(101),
      email: 'john@example.com',
      subject: 'Valid Subject',
      message: 'Valid message with enough characters.',
    });

    await middleware(req, res, () => {
      nextCalled = true;
    });

    expect(nextCalled).toBe(false);
    expect(getStatus()).toBe(400);
    expect(getJson().errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'name', message: 'Name must be between 2 and 100 characters' }),
      ]),
    );
  });

  it('should fail when email is invalid', async () => {
    let nextCalled = false;
    const { req, res, getStatus, getJson } = createMockReqRes({
      name: 'John Doe',
      email: 'not-an-email',
      subject: 'Valid Subject',
      message: 'Valid message with enough characters.',
    });

    await middleware(req, res, () => {
      nextCalled = true;
    });

    expect(nextCalled).toBe(false);
    expect(getStatus()).toBe(400);
    expect(getJson().errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'email', message: 'Please provide a valid email address' }),
      ]),
    );
  });

  it('should fail when subject is missing or shorter than 5 characters', async () => {
    let nextCalled = false;
    const { req, res, getStatus, getJson } = createMockReqRes({
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Hey',
      message: 'Valid message with enough characters.',
    });

    await middleware(req, res, () => {
      nextCalled = true;
    });

    expect(nextCalled).toBe(false);
    expect(getStatus()).toBe(400);
    expect(getJson().errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'subject', message: 'Subject must be between 5 and 200 characters' }),
      ]),
    );
  });

  it('should fail when message is shorter than 10 characters', async () => {
    let nextCalled = false;
    const { req, res, getStatus, getJson } = createMockReqRes({
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Valid Subject',
      message: 'Short',
    });

    await middleware(req, res, () => {
      nextCalled = true;
    });

    expect(nextCalled).toBe(false);
    expect(getStatus()).toBe(400);
    expect(getJson().errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'message', message: 'Message must be between 10 and 2000 characters' }),
      ]),
    );
  });
});
