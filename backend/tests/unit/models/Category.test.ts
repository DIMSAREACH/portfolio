import { describe, it, expect } from '@jest/globals';
import Category from '../../../src/models/Category';

describe('Category Model', () => {
  const validCategoryData = {
    name: {
      en: 'Web Development',
      kh: 'ការអភិវឌ្ឍន៍គេហទំព័រ',
    },
    type: 'project' as const,
  };

  it('should validate a category with valid attributes', async () => {
    const category = new Category(validCategoryData);

    await expect(category.validate()).resolves.toBeUndefined();
    expect(category.name.en).toBe('Web Development');
    expect(category.type).toBe('project');
    expect(category.order).toBe(0);
    expect(category.slug).toBe('web-development');
  });

  it('should reject when name or type is missing', async () => {
    const emptyCategory = new Category({});

    await expect(emptyCategory.validate()).rejects.toThrow();
  });

  it('should accept valid category types (project, blog, both)', async () => {
    for (const type of ['project', 'blog', 'both'] as const) {
      const cat = new Category({ ...validCategoryData, type });
      await expect(cat.validate()).resolves.toBeUndefined();
      expect(cat.type).toBe(type);
    }
  });

  it('should reject invalid category type', async () => {
    const invalidCat = new Category({
      ...validCategoryData,
      type: 'invalid-type' as unknown as 'project',
    });

    await expect(invalidCat.validate()).rejects.toThrow(/not a valid category type/);
  });

  it('should auto-generate slug from English name upon validation', async () => {
    const category = new Category({
      name: {
        en: 'Mobile App Development',
        kh: 'ការអភិវឌ្ឍន៍កម្មវិធីទូរស័ព្ទ',
      },
      type: 'both',
    });

    expect(category.slug).toBeUndefined();
    await category.validate();
    expect(category.slug).toBe('mobile-app-development');
  });

  it('should format custom provided slug via slugify', async () => {
    const category = new Category({
      name: {
        en: 'Cloud Services',
        kh: 'សេវាកម្ម Cloud',
      },
      slug: 'Custom Cloud Slug!!',
      type: 'project',
    });

    await category.validate();
    expect(category.slug).toBe('custom-cloud-slug');
  });

  it('should define indexes on slug (unique) and type', () => {
    const indexes = Category.schema.indexes();

    const slugIndex = indexes.find((idx) => 'slug' in idx[0]);
    expect(slugIndex).toBeDefined();
    expect(slugIndex?.[1]).toHaveProperty('unique', true);

    const typeIndex = indexes.find((idx) => 'type' in idx[0]);
    expect(typeIndex).toBeDefined();
  });
});
