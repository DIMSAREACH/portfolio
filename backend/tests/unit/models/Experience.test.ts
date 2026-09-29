import { describe, it, expect } from '@jest/globals';
import Experience from '../../../src/models/Experience';

describe('Experience Model', () => {
  const validExperienceData = {
    title: {
      en: 'Senior Software Engineer',
      kh: 'វិស្វករកម្មវិធីជាន់ខ្ពស់',
    },
    organization: {
      en: 'Tech Innovations Ltd',
      kh: 'ក្រុមហ៊ុន តិច អ៊ីនណូវ៉េសិន',
    },
    type: 'work' as const,
    startDate: new Date('2023-01-15'),
  };

  it('should validate an experience with required attributes and defaults', async () => {
    const experience = new Experience(validExperienceData);

    await expect(experience.validate()).resolves.toBeUndefined();
    expect(experience.title.en).toBe('Senior Software Engineer');
    expect(experience.organization.en).toBe('Tech Innovations Ltd');
    expect(experience.type).toBe('work');
    expect(experience.startDate).toEqual(new Date('2023-01-15'));
    expect(experience.isCurrent).toBe(false);
    expect(experience.order).toBe(0);
    expect(experience.technologies).toEqual([]);
  });

  it('should reject when required fields are missing', async () => {
    const emptyExperience = new Experience({});

    await expect(emptyExperience.validate()).rejects.toThrow();
  });

  it('should accept all valid experience types (work, volunteer, internship, freelance)', async () => {
    const types = ['work', 'volunteer', 'internship', 'freelance'] as const;

    for (const type of types) {
      const exp = new Experience({ ...validExperienceData, type });
      await expect(exp.validate()).resolves.toBeUndefined();
      expect(exp.type).toBe(type);
    }
  });

  it('should reject invalid experience type', async () => {
    const invalidExp = new Experience({
      ...validExperienceData,
      type: 'invalid-type' as unknown as 'work',
    });

    await expect(invalidExp.validate()).rejects.toThrow(/not a valid experience type/);
  });

  it('should validate all optional fields correctly', async () => {
    const endDate = new Date('2024-05-30');
    const exp = new Experience({
      ...validExperienceData,
      location: {
        en: 'Phnom Penh, Cambodia',
        kh: 'រាជធានីភ្នំពេញ កម្ពុជា',
      },
      endDate,
      isCurrent: true,
      description: {
        en: 'Lead development of cloud applications.',
        kh: 'ដឹកនាំការអភិវឌ្ឍន៍កម្មវិធី cloud។',
      },
      responsibilities: {
        en: ['Architect system', 'Code reviews', 'Sprint planning'],
        kh: ['រៀបចំរចនាសម្ព័ន្ធប្រព័ន្ធ', 'ពិនិត្យកូដ', 'រៀបចំផែនការ Sprint'],
      },
      technologies: ['TypeScript', 'Node.js', 'Docker', 'AWS'],
      order: 5,
    });

    await expect(exp.validate()).resolves.toBeUndefined();
    expect(exp.location?.en).toBe('Phnom Penh, Cambodia');
    expect(exp.endDate).toEqual(endDate);
    expect(exp.isCurrent).toBe(true);
    expect(exp.responsibilities?.en).toHaveLength(3);
    expect(exp.technologies).toHaveLength(4);
    expect(exp.order).toBe(5);
  });

  it('should define compound index on order and startDate per PRD Section 11.7', () => {
    const indexes = Experience.schema.indexes();

    const compoundIndex = indexes.find(
      (idx) => 'order' in idx[0] && 'startDate' in idx[0],
    );
    expect(compoundIndex).toBeDefined();
    expect(compoundIndex?.[0]).toEqual({ order: 1, startDate: -1 });
  });
});
