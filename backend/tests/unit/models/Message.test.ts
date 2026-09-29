import { describe, it, expect } from '@jest/globals';
import Message from '../../../src/models/Message';

describe('Message Model', () => {
  const validMessageData = {
    name: 'Sokha Chan',
    email: 'sokha.chan@example.com',
    subject: 'Project Inquiry - Full Stack Dev',
    message: 'Hello, I would like to discuss building an enterprise web platform with you.',
  };

  it('should validate a message with required attributes and defaults', async () => {
    const msg = new Message(validMessageData);

    await expect(msg.validate()).resolves.toBeUndefined();
    expect(msg.name).toBe('Sokha Chan');
    expect(msg.email).toBe('sokha.chan@example.com');
    expect(msg.subject).toBe('Project Inquiry - Full Stack Dev');
    expect(msg.message).toContain('enterprise web platform');
    expect(msg.isRead).toBe(false);
    expect(msg.isArchived).toBe(false);
  });

  it('should reject when required fields are missing', async () => {
    const emptyMsg = new Message({});

    await expect(emptyMsg.validate()).rejects.toThrow();
  });

  it('should reject an invalid email address', async () => {
    const invalidEmails = ['invalid-email', 'sokha@', '@example.com', 'sokha @example.com'];

    for (const email of invalidEmails) {
      const msg = new Message({
        ...validMessageData,
        email,
      });

      await expect(msg.validate()).rejects.toThrow(/Please provide a valid email address/);
    }
  });

  it('should lowercase email address', async () => {
    const msg = new Message({
      ...validMessageData,
      email: 'SOKHA.CHAN@EXAMPLE.COM',
    });

    await msg.validate();
    expect(msg.email).toBe('sokha.chan@example.com');
  });

  it('should validate optional fields correctly', async () => {
    const readAt = new Date('2026-02-15T10:00:00Z');
    const msg = new Message({
      ...validMessageData,
      isRead: true,
      isArchived: true,
      readAt,
      ipAddress: '192.168.1.100',
    });

    await expect(msg.validate()).resolves.toBeUndefined();
    expect(msg.isRead).toBe(true);
    expect(msg.isArchived).toBe(true);
    expect(msg.readAt).toEqual(readAt);
    expect(msg.ipAddress).toBe('192.168.1.100');
  });

  it('should define both indexes matching PRD Section 11.12', () => {
    const indexes = Message.schema.indexes();

    const isReadCreatedIndex = indexes.find(
      (idx) => 'isRead' in idx[0] && 'createdAt' in idx[0],
    );
    expect(isReadCreatedIndex).toBeDefined();
    expect(isReadCreatedIndex?.[0]).toEqual({ isRead: 1, createdAt: -1 });

    const isArchivedIndex = indexes.find(
      (idx) => 'isArchived' in idx[0] && Object.keys(idx[0]).length === 1,
    );
    expect(isArchivedIndex).toBeDefined();
    expect(isArchivedIndex?.[0]).toEqual({ isArchived: 1 });
  });
});
