import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import mongoose from 'mongoose';
import BlogPost from '../../../src/models/BlogPost';

describe('BlogPost Model', () => {
  const dummyCategoryId = new mongoose.Types.ObjectId();
  const dummyAuthorId = new mongoose.Types.ObjectId();

  const validBlogPostData = {
    title: {
      en: 'Building Scalable Web Apps with Angular',
      kh: 'ការបង្កើតកម្មវិធីគេហទំព័រដែលអាចពង្រីកបានជាមួយ Angular',
    },
    excerpt: {
      en: 'A guide to architecture and performance optimization.',
      kh: 'ការណែនាំអំពីរចនាសម្ព័ន្ធ និងការបង្កើនប្រសិទ្ធភាព។',
    },
    content: {
      en: 'Angular provides comprehensive tooling for enterprise applications... '.repeat(10),
      kh: 'Angular ផ្តល់នូវឧបករណ៍ទូលំទូលាយសម្រាប់កម្មវិធីកម្រិតសហគ្រាស... ',
    },
    category: dummyCategoryId,
    author: dummyAuthorId,
  };

  it('should validate a blog post with required attributes and defaults', async () => {
    const post = new BlogPost(validBlogPostData);

    await expect(post.validate()).resolves.toBeUndefined();
    expect(post.title.en).toBe('Building Scalable Web Apps with Angular');
    expect(post.slug).toBe('building-scalable-web-apps-with-angular');
    expect(post.status).toBe('draft');
    expect(post.featured).toBe(false);
    expect(post.viewCount).toBe(0);
    expect(post.tags).toEqual([]);
    expect(post.category.toString()).toBe(dummyCategoryId.toString());
    expect(post.author.toString()).toBe(dummyAuthorId.toString());
    expect(post.readingTime).toBeGreaterThanOrEqual(1);
  });

  it('should reject when required fields are missing', async () => {
    const emptyPost = new BlogPost({});

    await expect(emptyPost.validate()).rejects.toThrow();
  });

  it('should auto-generate slug from English title upon validation', async () => {
    const post = new BlogPost({
      ...validBlogPostData,
      title: {
        en: 'Deep Dive: Micro-Frontends in 2026!',
        kh: 'ការស្វែងយល់ស៊ីជម្រៅ៖ Micro-Frontends ក្នុងឆ្នាំ២០២៦',
      },
    });

    expect(post.slug).toBeUndefined();
    await post.validate();
    expect(post.slug).toBe('deep-dive-micro-frontends-in-2026');
  });

  it('should format a custom provided slug via slugify', async () => {
    const post = new BlogPost({
      ...validBlogPostData,
      slug: 'Custom Post Slug Here!!',
    });

    await post.validate();
    expect(post.slug).toBe('custom-post-slug-here');
  });

  it('should automatically calculate reading time from English content', async () => {
    // 400 words should equal 2 minutes (400 / 200 = 2)
    const fourHundredWords = Array(400).fill('word').join(' ');
    const post = new BlogPost({
      ...validBlogPostData,
      content: {
        en: fourHundredWords,
        kh: 'ខ្លឹមសារ',
      },
    });

    await post.validate();
    expect(post.readingTime).toBe(2);
  });

  it('should accept valid status enums (draft, published)', async () => {
    for (const status of ['draft', 'published'] as const) {
      const post = new BlogPost({ ...validBlogPostData, status });
      await expect(post.validate()).resolves.toBeUndefined();
      expect(post.status).toBe(status);
    }
  });

  it('should reject invalid status value', async () => {
    const invalidPost = new BlogPost({
      ...validBlogPostData,
      status: 'archived' as unknown as 'draft',
    });

    await expect(invalidPost.validate()).rejects.toThrow(/not a valid blog post status/);
  });

  it('should validate optional fields correctly', async () => {
    const post = new BlogPost({
      ...validBlogPostData,
      coverImage: 'https://res.cloudinary.com/demo/image/upload/cover.jpg',
      tags: ['Angular', 'TypeScript', 'WebDev'],
      featured: true,
      publishedAt: new Date('2026-01-01'),
      viewCount: 1500,
    });

    await expect(post.validate()).resolves.toBeUndefined();
    expect(post.coverImage).toBe('https://res.cloudinary.com/demo/image/upload/cover.jpg');
    expect(post.tags).toEqual(['Angular', 'TypeScript', 'WebDev']);
    expect(post.featured).toBe(true);
    expect(post.viewCount).toBe(1500);
  });

  it('should define all 4 required indexes per PRD Section 11.10', () => {
    const indexes = BlogPost.schema.indexes();

    const slugIndex = indexes.find((idx) => 'slug' in idx[0]);
    expect(slugIndex).toBeDefined();
    expect(slugIndex?.[1]).toHaveProperty('unique', true);

    const statusPublishedIndex = indexes.find(
      (idx) => 'status' in idx[0] && 'publishedAt' in idx[0],
    );
    expect(statusPublishedIndex).toBeDefined();
    expect(statusPublishedIndex?.[0]).toEqual({ status: 1, publishedAt: -1 });

    const categoryIndex = indexes.find((idx) => 'category' in idx[0]);
    expect(categoryIndex).toBeDefined();

    const tagsIndex = indexes.find((idx) => 'tags' in idx[0]);
    expect(tagsIndex).toBeDefined();
  });

  describe('Pre-save hooks execution', () => {
    let originalReadyState: number;

    beforeEach(() => {
      originalReadyState = mongoose.connection.readyState;
    });

    afterEach(() => {
      (mongoose.connection as unknown as { readyState: number }).readyState = originalReadyState;
      jest.restoreAllMocks();
    });

    it('should set publishedAt when published if not set', async () => {
      const post = new BlogPost({
        ...validBlogPostData,
        status: 'published',
      });

      expect(post.publishedAt).toBeUndefined();

      const saveHooks = (BlogPost.schema as any).s.hooks._pres.get('save');
      for (const hook of saveHooks) {
        await hook.fn.call(post);
      }

      expect(post.publishedAt).toBeInstanceOf(Date);
    });

    it('should append random suffix on slug collision when connected to MongoDB', async () => {
      (mongoose.connection as unknown as { readyState: number }).readyState = 1;

      const post = new BlogPost(validBlogPostData);

      jest.spyOn(BlogPost, 'findOne').mockResolvedValueOnce({
        _id: new mongoose.Types.ObjectId(),
        slug: 'building-scalable-web-apps-with-angular',
      } as any);

      const saveHooks = (BlogPost.schema as any).s.hooks._pres.get('save');
      for (const hook of saveHooks) {
        await hook.fn.call(post);
      }

      expect(post.slug).toMatch(/^building-scalable-web-apps-with-angular-[a-z0-9]+$/);
    });
  });
});
