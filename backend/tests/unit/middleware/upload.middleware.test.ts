import express, { Request, Response } from 'express';
import request from 'supertest';
import { describe, it, expect } from '@jest/globals';
import {
  uploadSingleImage,
  uploadMultipleImages,
  uploadPdf,
} from '../../../src/middleware/upload.middleware';
import errorHandler from '../../../src/middleware/errorHandler.middleware';

describe('Upload Middleware', () => {
  const createApp = () => {
    const app = express();

    app.post('/test/single-image', uploadSingleImage, (req: Request, res: Response) => {
      res.status(200).json({
        success: true,
        file: {
          originalname: req.file?.originalname,
          mimetype: req.file?.mimetype,
          size: req.file?.size,
          isBuffer: Buffer.isBuffer(req.file?.buffer),
        },
      });
    });

    app.post('/test/multiple-images', uploadMultipleImages, (req: Request, res: Response) => {
      const files = (req.files as Express.Multer.File[]) || [];
      res.status(200).json({
        success: true,
        count: files.length,
        files: files.map((f) => ({
          originalname: f.originalname,
          mimetype: f.mimetype,
          size: f.size,
        })),
      });
    });

    app.post('/test/pdf', uploadPdf, (req: Request, res: Response) => {
      res.status(200).json({
        success: true,
        file: {
          originalname: req.file?.originalname,
          mimetype: req.file?.mimetype,
          size: req.file?.size,
          isBuffer: Buffer.isBuffer(req.file?.buffer),
        },
      });
    });

    app.use(errorHandler);
    return app;
  };

  const app = createApp();

  describe('uploadSingleImage', () => {
    it('should accept valid PNG image and store in memory buffer', async () => {
      const dummyPng = Buffer.from('fake-png-content');

      const res = await request(app)
        .post('/test/single-image')
        .attach('image', dummyPng, {
          filename: 'photo.png',
          contentType: 'image/png',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.file.originalname).toBe('photo.png');
      expect(res.body.file.mimetype).toBe('image/png');
      expect(res.body.file.isBuffer).toBe(true);
    });

    it('should accept valid JPG and WebP images', async () => {
      const dummyJpg = Buffer.from('fake-jpg-content');
      const dummyWebp = Buffer.from('fake-webp-content');

      const resJpg = await request(app)
        .post('/test/single-image')
        .attach('image', dummyJpg, {
          filename: 'photo.jpg',
          contentType: 'image/jpeg',
        });
      expect(resJpg.status).toBe(200);

      const resWebp = await request(app)
        .post('/test/single-image')
        .attach('image', dummyWebp, {
          filename: 'graphic.webp',
          contentType: 'image/webp',
        });
      expect(resWebp.status).toBe(200);
    });

    it('should reject unsupported file types with 400', async () => {
      const dummyText = Buffer.from('plain-text-content');

      const res = await request(app)
        .post('/test/single-image')
        .attach('image', dummyText, {
          filename: 'notes.txt',
          contentType: 'text/plain',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Only JPG, JPEG, PNG, and WebP');
    });

    it('should reject file when MIME type and extension do not match image rules', async () => {
      const dummyFile = Buffer.from('fake-file');

      const res = await request(app)
        .post('/test/single-image')
        .attach('image', dummyFile, {
          filename: 'executable.exe',
          contentType: 'image/png',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject image exceeding 5MB limit', async () => {
      // 5MB + 10KB
      const largeImage = Buffer.alloc(5 * 1024 * 1024 + 10240, 'a');

      const res = await request(app)
        .post('/test/single-image')
        .attach('image', largeImage, {
          filename: 'huge.jpg',
          contentType: 'image/jpeg',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('File size exceeds the allowed limit');
    });
  });

  describe('uploadMultipleImages', () => {
    it('should accept up to 10 images simultaneously', async () => {
      const img1 = Buffer.from('img-1');
      const img2 = Buffer.from('img-2');

      const res = await request(app)
        .post('/test/multiple-images')
        .attach('images', img1, { filename: '1.jpg', contentType: 'image/jpeg' })
        .attach('images', img2, { filename: '2.png', contentType: 'image/png' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(2);
    });

    it('should reject when more than 10 images are uploaded', async () => {
      let req = request(app).post('/test/multiple-images');
      for (let i = 0; i < 11; i++) {
        req = req.attach('images', Buffer.from(`img-${i}`), {
          filename: `photo${i}.jpg`,
          contentType: 'image/jpeg',
        });
      }

      const res = await req;
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('uploadPdf', () => {
    it('should accept valid PDF under 10MB', async () => {
      const dummyPdf = Buffer.from('%PDF-1.4 sample pdf content');

      const res = await request(app)
        .post('/test/pdf')
        .attach('file', dummyPdf, {
          filename: 'resume.pdf',
          contentType: 'application/pdf',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.file.originalname).toBe('resume.pdf');
      expect(res.body.file.mimetype).toBe('application/pdf');
    });

    it('should reject non-PDF file uploaded to PDF endpoint', async () => {
      const dummyImg = Buffer.from('fake-image');

      const res = await request(app)
        .post('/test/pdf')
        .attach('file', dummyImg, {
          filename: 'photo.jpg',
          contentType: 'image/jpeg',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Only PDF documents are allowed');
    });

    it('should reject PDF exceeding 10MB limit', async () => {
      // 10MB + 10KB
      const largePdf = Buffer.alloc(10 * 1024 * 1024 + 10240, 'p');

      const res = await request(app)
        .post('/test/pdf')
        .attach('file', largePdf, {
          filename: 'heavy.pdf',
          contentType: 'application/pdf',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('File size exceeds the allowed limit');
    });
  });
});
