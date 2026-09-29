import { describe, it, expect } from '@jest/globals';
import Skill from '../../../src/models/Skill';

describe('Skill Model', () => {
  const validSkillData = {
    name: 'TypeScript',
    category: {
      en: 'Programming Languages',
      kh: 'ភាសាសរសេរកូដ',
    },
    icon: 'https://cdn.example.com/icons/typescript.svg',
    order: 1,
  };

  it('should validate a skill with all valid attributes', async () => {
    const skill = new Skill(validSkillData);

    await expect(skill.validate()).resolves.toBeUndefined();
    expect(skill.name).toBe('TypeScript');
    expect(skill.category.en).toBe('Programming Languages');
    expect(skill.category.kh).toBe('ភាសាសរសេរកូដ');
    expect(skill.icon).toBe('https://cdn.example.com/icons/typescript.svg');
    expect(skill.order).toBe(1);
    expect(skill.isVisible).toBe(true);
  });

  it('should validate with default values when optional fields are omitted', async () => {
    const skill = new Skill({
      name: 'Angular',
      category: {
        en: 'Frontend',
        kh: 'ផ្នែកខាងមុខ',
      },
    });

    await expect(skill.validate()).resolves.toBeUndefined();
    expect(skill.order).toBe(0);
    expect(skill.isVisible).toBe(true);
    expect(skill.icon).toBeUndefined();
  });

  it('should reject when name is missing', async () => {
    const skill = new Skill({
      category: {
        en: 'Frontend',
        kh: 'ផ្នែកខាងមុខ',
      },
    });

    await expect(skill.validate()).rejects.toThrow(/Skill name is required/);
  });

  it('should reject when category is missing or incomplete', async () => {
    const missingCategory = new Skill({ name: 'Node.js' });
    await expect(missingCategory.validate()).rejects.toThrow(/Skill category is required/);

    const incompleteCategory = new Skill({
      name: 'Node.js',
      category: { en: 'Backend' },
    });
    await expect(incompleteCategory.validate()).rejects.toThrow(/Khmer text is required/);
  });

  it('should allow setting isVisible to false', async () => {
    const skill = new Skill({
      ...validSkillData,
      isVisible: false,
    });

    await expect(skill.validate()).resolves.toBeUndefined();
    expect(skill.isVisible).toBe(false);
  });

  it('should define the index on category and order per PRD Section 11.6', () => {
    const indexes = Skill.schema.indexes();

    const categoryOrderIndex = indexes.find(
      (idx) => 'category' in idx[0] && 'order' in idx[0],
    );
    expect(categoryOrderIndex).toBeDefined();
    expect(categoryOrderIndex?.[0]).toEqual({ category: 1, order: 1 });
  });
});
