import SocialLink, { ISocialLink, SocialPlatform } from '../models/SocialLink';
import { NotFoundError } from '../utils/AppError';

export interface SocialLinkListQuery {
  isVisible?: boolean | string;
}

export interface CreateSocialLinkDto {
  platform: SocialPlatform;
  label: string;
  url: string;
  icon?: string;
  order?: number;
  isVisible?: boolean;
}

export type UpdateSocialLinkDto = Partial<CreateSocialLinkDto>;

export interface ReorderItem {
  id: string;
  order: number;
}

export class SocialLinkService {
  /**
   * List all social links, sorted by order ascending
   */
  async getAll(query: SocialLinkListQuery = {}): Promise<ISocialLink[]> {
    const filter: Record<string, unknown> = {};

    if (query.isVisible !== undefined && query.isVisible !== '') {
      filter.isVisible = String(query.isVisible) === 'true';
    }

    return await SocialLink.find(filter).sort({ order: 1, createdAt: 1 });
  }

  /**
   * Get single social link by ID
   */
  async getById(id: string): Promise<ISocialLink> {
    const link = await SocialLink.findById(id);
    if (!link) {
      throw new NotFoundError(`Social link with ID ${id} not found`);
    }
    return link;
  }

  /**
   * Create a new social link
   */
  async create(data: CreateSocialLinkDto): Promise<ISocialLink> {
    if (data.order === undefined) {
      const highestOrder = await SocialLink.findOne().sort({ order: -1 }).select('order');
      data.order = highestOrder ? highestOrder.order + 1 : 0;
    }

    const socialLink = new SocialLink(data);
    return await socialLink.save();
  }

  /**
   * Update an existing social link
   */
  async update(id: string, data: UpdateSocialLinkDto): Promise<ISocialLink> {
    const socialLink = await SocialLink.findById(id);
    if (!socialLink) {
      throw new NotFoundError(`Social link with ID ${id} not found`);
    }

    if (data.platform !== undefined) socialLink.platform = data.platform;
    if (data.label !== undefined) socialLink.label = data.label;
    if (data.url !== undefined) socialLink.url = data.url;
    if (data.icon !== undefined) socialLink.icon = data.icon;
    if (data.order !== undefined) socialLink.order = data.order;
    if (data.isVisible !== undefined) socialLink.isVisible = data.isVisible;

    return await socialLink.save();
  }

  /**
   * Delete a social link by ID
   */
  async delete(id: string): Promise<void> {
    const socialLink = await SocialLink.findById(id);
    if (!socialLink) {
      throw new NotFoundError(`Social link with ID ${id} not found`);
    }

    await SocialLink.findByIdAndDelete(id);
  }

  /**
   * Reorder social links in batch
   */
  async reorder(items: ReorderItem[]): Promise<ISocialLink[]> {
    if (items.length > 0) {
      const bulkOps = items.map((item) => ({
        updateOne: {
          filter: { _id: item.id },
          update: { $set: { order: item.order } },
        },
      }));
      await SocialLink.bulkWrite(bulkOps);
    }

    return await SocialLink.find().sort({ order: 1, createdAt: 1 });
  }
}

export const socialLinkService = new SocialLinkService();
export default socialLinkService;
