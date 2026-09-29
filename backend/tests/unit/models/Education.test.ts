import { describe, it, expect } from '@jest/globals';
import Education from '../../../src/models/Education';

describe('Education Model', () => {
  const validEducationData = {
    institution: {
      en: 'Royal University of Phnom Penh',
      kh: 'សាកលវិទ្យាល័យភូមិន្ទភ្នំពេញ',
    },
    degree: {
      en: "Bachelor's Degree",
      kh: 'បរិញ្ញាបត្រ',
    },
    field: {
      en: 'Computer Science',
      kh: 'វិទ្យាសាស្ត្រកុំព្យូទ័រ',
    },
    startYear: 2022,
  };

  it('should validate an education entry with required attributes and default order', async () => {
    const education = new Education(validEducationData);

    await expect(education.validate()).resolves.toBeUndefined();
    expect(education.institution.en).toBe('Royal University of Phnom Penh');
    expect(education.degree.en).toBe("Bachelor's Degree");
    expect(education.field.en).toBe('Computer Science');
    expect(education.startYear).toBe(2022);
    expect(education.order).toBe(0);
  });

  it('should reject when required fields are missing', async () => {
    const emptyEducation = new Education({});

    await expect(emptyEducation.validate()).rejects.toThrow();
  });

  it('should reject when bilingual fields are incomplete', async () => {
    const incomplete = new Education({
      ...validEducationData,
      institution: { en: 'Incomplete University' },
    });

    await expect(incomplete.validate()).rejects.toThrow(/Khmer text is required/);
  });

  it('should validate all optional fields correctly', async () => {
    const education = new Education({
      ...validEducationData,
      endYear: 2026,
      description: {
        en: 'Focused on distributed systems and software engineering.',
        kh: 'ផ្តោតលើប្រព័ន្ធចែកចាយ និងវិស្វកម្មកម្មវិធី។',
      },
      activities: {
        en: ['IT Club President', 'Hackathon Winner 2024'],
        kh: ['ប្រធានក្លឹប IT', 'ជ័យលាភីការប្រកួត Hackathon ឆ្នាំ២០២៤'],
      },
      gpa: '3.85',
      order: 1,
    });

    await expect(education.validate()).resolves.toBeUndefined();
    expect(education.endYear).toBe(2026);
    expect(education.gpa).toBe('3.85');
    expect(education.order).toBe(1);
    expect(education.activities?.en).toHaveLength(2);
  });

  it('should define compound index on order and startYear per PRD Section 11.8', () => {
    const indexes = Education.schema.indexes();

    const compoundIndex = indexes.find(
      (idx) => 'order' in idx[0] && 'startYear' in idx[0],
    );
    expect(compoundIndex).toBeDefined();
    expect(compoundIndex?.[0]).toEqual({ order: 1, startYear: -1 });
  });
});
