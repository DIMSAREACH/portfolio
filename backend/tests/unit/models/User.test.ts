import { describe, it, expect } from '@jest/globals';
import bcrypt from 'bcryptjs';
import User from '../../../src/models/User';

describe('User Model', () => {
  it('should validate valid user attributes successfully', async () => {
    const validUser = new User({
      email: 'admin@portfolio.example.com',
      password: 'SecurePassword123!',
      fullName: 'Portfolio Admin',
    });

    await expect(validUser.validate()).resolves.toBeUndefined();
    expect(validUser.role).toBe('admin');
    expect(validUser.isActive).toBe(true);
    expect(validUser.email).toBe('admin@portfolio.example.com');
  });

  it('should require email, password, and fullName', async () => {
    const emptyUser = new User({});
    await expect(emptyUser.validate()).rejects.toThrow();
  });

  it('should reject invalid email format', async () => {
    const invalidEmailUser = new User({
      email: 'invalid-email-format',
      password: 'ValidPassword123',
      fullName: 'Test User',
    });

    await expect(invalidEmailUser.validate()).rejects.toThrow(
      'Please provide a valid email address',
    );
  });

  it('should reject password with length less than 8 characters', async () => {
    const shortPasswordUser = new User({
      email: 'test@example.com',
      password: 'short',
      fullName: 'Test User',
    });

    await expect(shortPasswordUser.validate()).rejects.toThrow(
      /at least 8 characters/,
    );
  });

  it('should reject roles other than admin', async () => {
    const invalidRoleUser = new User({
      email: 'test@example.com',
      password: 'ValidPassword123',
      fullName: 'Test User',
      role: 'superadmin' as unknown as 'admin',
    });

    await expect(invalidRoleUser.validate()).rejects.toThrow();
  });

  it('should compare candidate password correctly via comparePassword()', async () => {
    const plainPassword = 'SuperSecretPassword!';
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    const user = new User({
      email: 'admin@example.com',
      password: hashedPassword,
      fullName: 'Admin',
    });

    // Valid password
    const isMatch = await user.comparePassword(plainPassword);
    expect(isMatch).toBe(true);

    // Incorrect password
    const isNotMatch = await user.comparePassword('WrongPassword123');
    expect(isNotMatch).toBe(false);
  });

  it('should have a unique index on email in schema definition', () => {
    const emailIndex = User.schema.indexes().find((idx) => {
      const keys = idx[0];
      return 'email' in keys;
    });

    expect(emailIndex).toBeDefined();
    expect(emailIndex?.[1]).toHaveProperty('unique', true);
  });
});
