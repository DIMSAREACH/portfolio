import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import mongoose from 'mongoose';
import Project from '../../../src/models/Project';

describe('Project Model', () => {
  const dummyCategoryId = new mongoose.Types.ObjectId();

  const validProjectData = {
    title: {
      en: 'Developer Portfolio',
      kh: 'គេហទំព័រផ្ទាល់ខ្លួន',
    },
    shortDescription: {
      en: 'Modern portfolio platform',
      kh: 'វេទិកាផលប័ត្រទំនើប',
    },
    fullDescription: {
      en: 'Comprehensive full-stack developer portfolio and CMS.',
      kh: 'ផលប័ត្រអ្នកអភិវឌ្ឍន៍ពេញលេញ និង CMS។',
    },
    technologies: ['Angular', 'Node.js', 'Express', 'MongoDB'],
    category: dummyCategoryId,
    mainImage: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
  };

  it('should validate a project with all required attributes', async () => {
    const project = new Project(validProjectData);

    await expect(project.validate()).resolves.toBeUndefined();
    expect(project.title.en).toBe('Developer Portfolio');
    expect(project.slug).toBe('developer-portfolio');
    expect(project.status).toBe('draft');
    expect(project.featured).toBe(false);
    expect(project.order).toBe(0);
    expect(project.viewCount).toBe(0);
    expect(project.screenshots).toEqual([]);
    expect(project.category.toString()).toBe(dummyCategoryId.toString());
  });

  it('should reject when required fields are missing', async () => {
    const emptyProject = new Project({});

    await expect(emptyProject.validate()).rejects.toThrow();
  });

  it('should auto-generate slug from English title on validate', async () => {
    const project = new Project({
      ...validProjectData,
      title: {
        en: 'AI Task Automation System 2026!',
        kh: 'ប្រព័ន្ធស្វ័យប្រវត្តិកម្មកិច្ចការ AI',
      },
    });

    expect(project.slug).toBeUndefined();
    await project.validate();
    expect(project.slug).toBe('ai-task-automation-system-2026');
  });

  it('should format a custom slug with slugify on validate', async () => {
    const project = new Project({
      ...validProjectData,
      slug: 'Custom-Slug FOR Project!!',
    });

    await project.validate();
    expect(project.slug).toBe('custom-slug-for-project');
  });

  it('should accept valid status enums (draft, published)', async () => {
    for (const status of ['draft', 'published'] as const) {
      const project = new Project({ ...validProjectData, status });
      await expect(project.validate()).resolves.toBeUndefined();
      expect(project.status).toBe(status);
    }
  });

  it('should reject an invalid status value', async () => {
    const invalidProject = new Project({
      ...validProjectData,
      status: 'archived' as unknown as 'draft',
    });

    await expect(invalidProject.validate()).rejects.toThrow(/not a valid project status/);
  });

  it('should reject when technologies array is empty', async () => {
    const project = new Project({
      ...validProjectData,
      technologies: [],
    });

    await expect(project.validate()).rejects.toThrow(/At least one technology is required/);
  });

  it('should reject invalid category ObjectId', async () => {
    const project = new Project({
      ...validProjectData,
      category: 'invalid-object-id' as unknown as mongoose.Types.ObjectId,
    });

    await expect(project.validate()).rejects.toThrow();
  });

  it('should validate all optional fields correctly', async () => {
    const startDate = new Date('2025-01-01');
    const completionDate = new Date('2025-06-01');

    const project = new Project({
      ...validProjectData,
      problem: {
        en: 'Complex portfolio maintenance',
        kh: 'ការថែទាំផលប័ត្រស្មុគស្មាញ',
      },
      solution: {
        en: 'Custom dynamic CMS solution',
        kh: 'ដំណោះស្រាយ CMS ផ្ទាល់ខ្លួន',
      },
      features: {
        en: ['Bilingual', 'Dark mode', 'Admin dashboard'],
        kh: ['ពីរបាសា', 'មុខងារងងឹត', 'ផ្ទាំងគ្រប់គ្រង'],
      },
      challenges: {
        en: 'High traffic scaling',
        kh: 'ការពង្រីកចរាចរណ៍ខ្ពស់',
      },
      lessonsLearned: {
        en: 'Use caching effectively',
        kh: 'ប្រើប្រាស់ caching ឲ្យមានប្រសិទ្ធភាព',
      },
      screenshots: [
        'https://res.cloudinary.com/demo/image/upload/screenshot1.jpg',
        'https://res.cloudinary.com/demo/image/upload/screenshot2.jpg',
      ],
      githubUrl: 'https://github.com/developer/portfolio',
      liveUrl: 'https://portfolio.dev',
      videoUrl: 'https://youtube.com/watch?v=demo',
      startDate,
      completionDate,
      featured: true,
      order: 10,
      viewCount: 150,
    });

    await expect(project.validate()).resolves.toBeUndefined();
    expect(project.featured).toBe(true);
    expect(project.order).toBe(10);
    expect(project.viewCount).toBe(150);
    expect(project.screenshots).toHaveLength(2);
    expect(project.features?.en).toHaveLength(3);
    expect(project.startDate).toEqual(startDate);
    expect(project.completionDate).toEqual(completionDate);
  });

  it('should define all 4 required indexes per PRD Section 11.5', () => {
    const indexes = Project.schema.indexes();

    const slugIndex = indexes.find((idx) => 'slug' in idx[0]);
    expect(slugIndex).toBeDefined();
    expect(slugIndex?.[1]).toHaveProperty('unique', true);

    const compoundIndex = indexes.find(
      (idx) => 'status' in idx[0] && 'featured' in idx[0] && 'order' in idx[0],
    );
    expect(compoundIndex).toBeDefined();
    expect(compoundIndex?.[0]).toEqual({ status: 1, featured: -1, order: 1 });

    const categoryIndex = indexes.find((idx) => 'category' in idx[0]);
    expect(categoryIndex).toBeDefined();

    const techIndex = indexes.find((idx) => 'technologies' in idx[0]);
    expect(techIndex).toBeDefined();
  });

  describe('Pre-save slug collision handling', () => {
    let originalReadyState: number;

    beforeEach(() => {
      originalReadyState = mongoose.connection.readyState;
    });

    afterEach(() => {
      (mongoose.connection as unknown as { readyState: number }).readyState = originalReadyState;
      jest.restoreAllMocks();
    });

    it('should append random suffix on slug collision when connected to MongoDB', async () => {
      (mongoose.connection as unknown as { readyState: number }).readyState = 1;

      const project = new Project({
        ...validProjectData,
        title: { en: 'Unique Project', kh: 'គម្រោងពិសេស' },
      });

      // Mock Project.findOne to simulate existing collision
      jest.spyOn(Project, 'findOne').mockResolvedValueOnce({
        _id: new mongoose.Types.ObjectId(),
        slug: 'unique-project',
      } as any);

      // Trigger pre-save middleware by directly calling save hooks or using a simulated hook call
      // Mongoose save without DB would fail, but we can verify the pre-save hook behavior
      // by inspecting the registered pre hooks
      const saveHooks = (Project.schema as any).s.hooks._pres.get('save');
      expect(saveHooks).toBeDefined();

      // Execute each pre-save hook on the project instance
      for (const hook of saveHooks) {
        await hook.fn.call(project);
      }

      expect(project.slug).toMatch(/^unique-project-[a-z0-9]+$/);
    });
  });
});
