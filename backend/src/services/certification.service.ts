import Certification, { ICertification, CertificationType } from '../models/Certification';
import cloudinaryService from './cloudinary.service';
import { NotFoundError } from '../utils/AppError';
import { getPaginationParams, buildPaginationMetadata } from '../utils/pagination';
import { PaginatedData } from '../utils/apiResponse';
import logger from '../utils/logger';

export interface CertificationListQuery {
  type?: CertificationType;
  isVisible?: boolean | string;
  search?: string;
  page?: string | number;
  limit?: string | number;
}

export interface CreateCertificationDto {
  name: { en: string; kh?: string };
  type: CertificationType;
  organization: { en: string; kh?: string };
  issueDate: Date | string;
  expirationDate?: Date | string;
  credentialId?: string;
  credentialUrl?: string;
  image?: string;
  description?: { en?: string; kh?: string };
  isVisible?: boolean;
  order?: number;
}

export type UpdateCertificationDto = Partial<CreateCertificationDto>;

export function extractPublicId(url: string): string | null {
  if (!url || !url.includes('cloudinary.com')) return null;
  const parts = url.split('/upload/');
  if (parts.length < 2) return null;
  const afterUpload = parts[1];
  const withoutVersion = afterUpload.replace(/^v\d+\//, '');
  const lastDotIndex = withoutVersion.lastIndexOf('.');
  return lastDotIndex !== -1 ? withoutVersion.substring(0, lastDotIndex) : withoutVersion;
}

async function safeDeleteCloudinaryFile(url: string): Promise<void> {
  const publicId = extractPublicId(url);
  if (publicId) {
    try {
      await cloudinaryService.deleteFile(publicId);
    } catch (err) {
      logger.warn(`Could not delete Cloudinary file (${publicId}):`, err);
    }
  }
}

export class CertificationService {
  /**
   * List certifications with optional filtering and pagination
   */
  async getAll(query: CertificationListQuery = {}): Promise<ICertification[] | PaginatedData<ICertification>> {
    const filter: Record<string, unknown> = {};

    if (query.type) {
      filter.type = query.type;
    }

    if (query.isVisible !== undefined) {
      filter.isVisible = String(query.isVisible) === 'true';
    }

    if (query.search) {
      const searchRegex = new RegExp(query.search, 'i');
      filter.$or = [
        { 'name.en': searchRegex },
        { 'name.kh': searchRegex },
        { 'organization.en': searchRegex },
        { 'organization.kh': searchRegex },
        { credentialId: searchRegex },
      ];
    }

    const isPaginationRequested = query.page !== undefined || query.limit !== undefined;

    if (isPaginationRequested) {
      const { page, limit, skip } = getPaginationParams(query);
      const [items, total] = await Promise.all([
        Certification.find(filter)
          .sort({ type: 1, order: 1, createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Certification.countDocuments(filter),
      ]);
      const pagination = buildPaginationMetadata(total, page, limit);
      return { items, pagination };
    }

    return Certification.find(filter).sort({ type: 1, order: 1, createdAt: -1 });
  }

  /**
   * Get single certification by ID
   */
  async getById(id: string): Promise<ICertification> {
    const cert = await Certification.findById(id);
    if (!cert) {
      throw new NotFoundError(`Certification with ID ${id} not found`);
    }
    return cert;
  }

  /**
   * Create a new certification with optional image upload
   */
  async create(data: CreateCertificationDto, file?: Express.Multer.File): Promise<ICertification> {
    if (file) {
      const uploaded = await cloudinaryService.uploadImage(file.buffer, 'portfolio/certifications');
      data.image = uploaded.secureUrl;
    }

    data.name.kh = data.name.kh || data.name.en;
    data.organization.kh = data.organization.kh || data.organization.en;

    const cert = new Certification(data);
    await cert.save();
    return cert;
  }

  /**
   * Update certification by ID with optional new image upload
   */
  async update(id: string, data: UpdateCertificationDto, file?: Express.Multer.File): Promise<ICertification> {
    const cert = await Certification.findById(id);
    if (!cert) {
      throw new NotFoundError(`Certification with ID ${id} not found`);
    }

    if (file) {
      const oldImage = cert.image;
      const uploaded = await cloudinaryService.uploadImage(file.buffer, 'portfolio/certifications');
      cert.image = uploaded.secureUrl;
      if (oldImage && oldImage !== uploaded.secureUrl) {
        await safeDeleteCloudinaryFile(oldImage);
      }
    } else if (data.image !== undefined) {
      cert.image = data.image;
    }

    if (data.name) {
      if (data.name.en) cert.name.en = data.name.en;
      if (data.name.kh) cert.name.kh = data.name.kh;
    }

    if (data.organization) {
      if (data.organization.en) cert.organization.en = data.organization.en;
      if (data.organization.kh) cert.organization.kh = data.organization.kh;
    }

    if (data.type) cert.type = data.type;
    if (data.issueDate !== undefined) cert.issueDate = new Date(data.issueDate);
    if (data.expirationDate !== undefined) {
      cert.expirationDate = data.expirationDate ? new Date(data.expirationDate) : undefined;
    }
    if (data.credentialId !== undefined) cert.credentialId = data.credentialId;
    if (data.credentialUrl !== undefined) cert.credentialUrl = data.credentialUrl;

    if (data.description) {
      cert.description = {
        en: data.description.en ?? cert.description?.en ?? '',
        kh: data.description.kh ?? cert.description?.kh ?? data.description.en ?? '',
      };
    }

    if (data.isVisible !== undefined) cert.isVisible = data.isVisible;
    if (data.order !== undefined) cert.order = data.order;

    await cert.save();
    return cert;
  }

  /**
   * Delete certification by ID and clean up Cloudinary image
   */
  async delete(id: string): Promise<void> {
    const cert = await Certification.findById(id);
    if (!cert) {
      throw new NotFoundError(`Certification with ID ${id} not found`);
    }

    if (cert.image) {
      await safeDeleteCloudinaryFile(cert.image);
    }

    await Certification.findByIdAndDelete(id);
  }
}

export const certificationService = new CertificationService();
export default certificationService;
