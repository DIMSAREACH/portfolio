import { describe, it, expect } from '@jest/globals';
import Profile, {
  createBilingualSchema,
  createBilingualArraySchema,
} from '../../../src/models/Profile';

describe('Profile Model', () => {
  const validProfileData = {
    fullName: {
      en: 'Dara Sok',
      kh: 'សុខ តារា',
    },
    title: {
      en: 'Senior Full Stack Developer',
      kh: 'អ្នកអភិវឌ្ឍន៍ Full Stack ជាន់ខ្ពស់',
    },
    introduction: {
      en: 'Building scalable modern web apps.',
      kh: 'បង្កើតគេហទំព័រទំនើបប្រកបដោយគុណភាព។',
    },
    about: {
      en: '## About Me\nExperienced software engineer...',
      kh: '## អំពីខ្ញុំ\nវិស្វករផ្នែកទន់ដែលមានបទពិសោធន៍...',
    },
  };

  it('should validate a profile with all required bilingual fields', async () => {
    const profile = new Profile(validProfileData);

    await expect(profile.validate()).resolves.toBeUndefined();
    expect(profile.fullName.en).toBe('Dara Sok');
    expect(profile.fullName.kh).toBe('សុខ តារា');
    expect(profile.title.en).toBe('Senior Full Stack Developer');
  });

  it('should reject when required fields are missing', async () => {
    const emptyProfile = new Profile({});

    await expect(emptyProfile.validate()).rejects.toThrow();
  });

  it('should reject when bilingual sub-field is missing on required field', async () => {
    const incompleteProfile = new Profile({
      ...validProfileData,
      title: {
        en: 'Developer',
        // missing kh
      },
    });

    await expect(incompleteProfile.validate()).rejects.toThrow();
  });

  it('should validate optional fields including strengths array and contact info', async () => {
    const fullProfile = new Profile({
      ...validProfileData,
      professionalSummary: {
        en: '10+ years of software design',
        kh: 'បទពិសោធន៍ ១០ ឆ្នាំឡើង',
      },
      careerInterests: {
        en: 'Cloud architectures and AI agents',
        kh: 'ស្ថាបត្យកម្ម Cloud និង AI',
      },
      strengths: {
        en: ['TypeScript', 'Angular', 'Node.js'],
        kh: ['TypeScript', 'Angular', 'Node.js'],
      },
      profileImage: 'https://res.cloudinary.com/demo/image/upload/avatar.jpg',
      email: 'dara@example.com',
      phone: '+85512345678',
      location: {
        en: 'Phnom Penh, Cambodia',
        kh: 'ភ្នំពេញ កម្ពុជា',
      },
    });

    await expect(fullProfile.validate()).resolves.toBeUndefined();
    expect(fullProfile.strengths?.en).toHaveLength(3);
    expect(fullProfile.email).toBe('dara@example.com');
  });

  it('should verify reusable bilingual schemas helper', () => {
    const requiredSchema = createBilingualSchema(true);
    const optionalSchema = createBilingualSchema(false);
    const arraySchema = createBilingualArraySchema();

    expect(requiredSchema).toBeDefined();
    expect(optionalSchema).toBeDefined();
    expect(arraySchema).toBeDefined();
  });
});
