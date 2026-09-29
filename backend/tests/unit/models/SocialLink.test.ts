import { describe, it, expect } from '@jest/globals';
import SocialLink from '../../../src/models/SocialLink';

describe('SocialLink Model', () => {
  const validSocialData = {
    platform: 'github' as const,
    label: 'GitHub Profile',
    url: 'https://github.com/developer',
  };

  it('should validate a social link with required attributes and defaults', async () => {
    const link = new SocialLink(validSocialData);

    await expect(link.validate()).resolves.toBeUndefined();
    expect(link.platform).toBe('github');
    expect(link.label).toBe('GitHub Profile');
    expect(link.url).toBe('https://github.com/developer');
    expect(link.isVisible).toBe(true);
    expect(link.order).toBe(0);
  });

  it('should reject when required fields are missing', async () => {
    const emptyLink = new SocialLink({});

    await expect(emptyLink.validate()).rejects.toThrow();
  });

  it('should accept all valid platforms', async () => {
    const platforms = [
      'github',
      'linkedin',
      'facebook',
      'email',
      'twitter',
      'youtube',
      'other',
    ] as const;

    for (const platform of platforms) {
      const link = new SocialLink({ ...validSocialData, platform });
      await expect(link.validate()).resolves.toBeUndefined();
      expect(link.platform).toBe(platform);
    }
  });

  it('should reject invalid platform', async () => {
    const invalidLink = new SocialLink({
      ...validSocialData,
      platform: 'invalid-platform' as unknown as 'github',
    });

    await expect(invalidLink.validate()).rejects.toThrow(/not a valid social platform/);
  });

  it('should validate optional fields correctly', async () => {
    const link = new SocialLink({
      ...validSocialData,
      icon: 'fab fa-github',
      order: 3,
      isVisible: false,
    });

    await expect(link.validate()).resolves.toBeUndefined();
    expect(link.icon).toBe('fab fa-github');
    expect(link.order).toBe(3);
    expect(link.isVisible).toBe(false);
  });

  it('should define order index matching PRD Section 11.14', () => {
    const indexes = SocialLink.schema.indexes();

    const orderIndex = indexes.find(
      (idx) => 'order' in idx[0] && Object.keys(idx[0]).length === 1,
    );
    expect(orderIndex).toBeDefined();
    expect(orderIndex?.[0]).toEqual({ order: 1 });
  });
});
