import { Request, Response, NextFunction } from 'express';
import multer, { FileFilterCallback } from 'multer';
import { ValidationError } from '../utils/AppError';

export const IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

export const IMAGE_EXTENSIONS = /\.(jpe?g|png|webp)$/i;

export const PDF_MIME_TYPES = ['application/pdf'];
export const PDF_EXTENSIONS = /\.pdf$/i;

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
export const MAX_PDF_SIZE = 10 * 1024 * 1024; // 10 MB

const storage = multer.memoryStorage();

const imageFileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
): void => {
  const isMimeValid = IMAGE_MIME_TYPES.includes(file.mimetype.toLowerCase());
  const isExtValid = IMAGE_EXTENSIONS.test(file.originalname);

  if (isMimeValid && isExtValid) {
    cb(null, true);
  } else {
    cb(
      new ValidationError(
        'Invalid file type. Only JPG, JPEG, PNG, and WebP images are allowed.',
        [
          {
            field: file.fieldname,
            message: 'Only JPG, JPEG, PNG, and WebP images are allowed.',
          },
        ],
      ),
    );
  }
};

const pdfFileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
): void => {
  const isMimeValid = PDF_MIME_TYPES.includes(file.mimetype.toLowerCase());
  const isExtValid = PDF_EXTENSIONS.test(file.originalname);

  if (isMimeValid && isExtValid) {
    cb(null, true);
  } else {
    cb(
      new ValidationError('Invalid file type. Only PDF documents are allowed.', [
        {
          field: file.fieldname,
          message: 'Only PDF documents are allowed.',
        },
      ]),
    );
  }
};

const multerSingleImage = multer({
  storage,
  limits: { fileSize: MAX_IMAGE_SIZE },
  fileFilter: imageFileFilter,
}).single('image');

const multerMultipleImages = multer({
  storage,
  limits: { fileSize: MAX_IMAGE_SIZE },
  fileFilter: imageFileFilter,
}).array('images', 10);

const multerPdf = multer({
  storage,
  limits: { fileSize: MAX_PDF_SIZE },
  fileFilter: pdfFileFilter,
}).single('file');

const wrapMulter = (
  multerMiddleware: (req: Request, res: Response, next: NextFunction) => void,
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    multerMiddleware(req, res, (err: unknown) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(
            new ValidationError('File size exceeds the allowed limit', [
              {
                field: err.field || 'file',
                message: 'File size exceeds the allowed limit',
              },
            ]),
          );
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return next(
            new ValidationError(`Unexpected upload field: ${err.field}`, [
              {
                field: err.field || 'file',
                message: `Unexpected upload field: ${err.field}`,
              },
            ]),
          );
        }
        return next(
          new ValidationError(err.message, [
            {
              field: err.field || 'file',
              message: err.message,
            },
          ]),
        );
      }

      if (err) {
        return next(err);
      }

      next();
    });
  };
};

const multerProjectImages = multer({
  storage,
  limits: { fileSize: MAX_IMAGE_SIZE },
  fileFilter: imageFileFilter,
}).fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'screenshots', maxCount: 10 },
]);

export const uploadSingleImage = wrapMulter(multerSingleImage);
export const uploadMultipleImages = wrapMulter(multerMultipleImages);
export const uploadPdf = wrapMulter(multerPdf);
export const uploadProjectImages = wrapMulter(multerProjectImages);

export default {
  uploadSingleImage,
  uploadMultipleImages,
  uploadPdf,
  uploadProjectImages,
  MAX_IMAGE_SIZE,
  MAX_PDF_SIZE,
};
