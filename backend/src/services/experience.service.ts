import Experience, { IExperience, ExperienceType } from '../models/Experience';
import { NotFoundError } from '../utils/AppError';
import { getPaginationParams, buildPaginationMetadata } from '../utils/pagination';
import { PaginatedData } from '../utils/apiResponse';

export interface ExperienceListQuery {
  type?: ExperienceType;
  isCurrent?: boolean | string;
  search?: string;
  page?: string | number;
  limit?: string | number;
}

export interface CreateExperienceDto {
  title: { en: string; kh?: string };
  organization: { en: string; kh?: string };
  location?: { en?: string; kh?: string };
  type: ExperienceType;
  startDate: Date | string;
  endDate?: Date | string;
  isCurrent?: boolean;
  description?: { en?: string; kh?: string };
  responsibilities?: { en?: string[]; kh?: string[] };
  technologies?: string[];
  order?: number;
}

export type UpdateExperienceDto = Partial<CreateExperienceDto>;

export class ExperienceService {
  /**
   * List experiences with optional filtering and pagination
   */
  async getAll(query: ExperienceListQuery = {}): Promise<IExperience[] | PaginatedData<IExperience>> {
    const filter: Record<string, unknown> = {};

    if (query.type) {
      filter.type = query.type;
    }

    if (query.isCurrent !== undefined) {
      filter.isCurrent = String(query.isCurrent) === 'true';
    }

    if (query.search) {
      const searchRegex = new RegExp(query.search, 'i');
      filter.$or = [
        { 'title.en': searchRegex },
        { 'title.kh': searchRegex },
        { 'organization.en': searchRegex },
        { 'organization.kh': searchRegex },
        { technologies: { $in: [searchRegex] } },
      ];
    }

    const isPaginationRequested = query.page !== undefined || query.limit !== undefined;

    if (isPaginationRequested) {
      const { page, limit, skip } = getPaginationParams(query);
      const [items, total] = await Promise.all([
        Experience.find(filter)
          .sort({ order: 1, startDate: -1 })
          .skip(skip)
          .limit(limit),
        Experience.countDocuments(filter),
      ]);
      const pagination = buildPaginationMetadata(total, page, limit);
      return { items, pagination };
    }

    return Experience.find(filter).sort({ order: 1, startDate: -1 });
  }

  /**
   * Get single experience by ID
   */
  async getById(id: string): Promise<IExperience> {
    const experience = await Experience.findById(id);
    if (!experience) {
      throw new NotFoundError(`Experience with ID ${id} not found`);
    }
    return experience;
  }

  /**
   * Create a new experience
   */
  async create(data: CreateExperienceDto): Promise<IExperience> {
    data.title.kh = data.title.kh || data.title.en;
    data.organization.kh = data.organization.kh || data.organization.en;

    const experience = new Experience(data);
    await experience.save();
    return experience;
  }

  /**
   * Update experience by ID
   */
  async update(id: string, data: UpdateExperienceDto): Promise<IExperience> {
    const experience = await Experience.findById(id);
    if (!experience) {
      throw new NotFoundError(`Experience with ID ${id} not found`);
    }

    if (data.title) {
      if (data.title.en) experience.title.en = data.title.en;
      if (data.title.kh) experience.title.kh = data.title.kh;
    }

    if (data.organization) {
      if (data.organization.en) experience.organization.en = data.organization.en;
      if (data.organization.kh) experience.organization.kh = data.organization.kh;
    }

    if (data.location) {
      experience.location = {
        en: data.location.en ?? experience.location?.en ?? '',
        kh: data.location.kh ?? experience.location?.kh ?? data.location.en ?? '',
      };
    }

    if (data.type) experience.type = data.type;
    if (data.startDate !== undefined) experience.startDate = new Date(data.startDate);
    if (data.endDate !== undefined) {
      experience.endDate = data.endDate ? new Date(data.endDate) : undefined;
    }
    if (data.isCurrent !== undefined) experience.isCurrent = data.isCurrent;

    if (data.description) {
      experience.description = {
        en: data.description.en ?? experience.description?.en ?? '',
        kh: data.description.kh ?? experience.description?.kh ?? data.description.en ?? '',
      };
    }

    if (data.responsibilities) {
      experience.responsibilities = {
        en: data.responsibilities.en ?? experience.responsibilities?.en ?? [],
        kh: data.responsibilities.kh ?? experience.responsibilities?.kh ?? [],
      };
    }

    if (data.technologies !== undefined) experience.technologies = data.technologies;
    if (data.order !== undefined) experience.order = data.order;

    await experience.save();
    return experience;
  }

  /**
   * Delete experience by ID
   */
  async delete(id: string): Promise<void> {
    const experience = await Experience.findById(id);
    if (!experience) {
      throw new NotFoundError(`Experience with ID ${id} not found`);
    }
    await Experience.findByIdAndDelete(id);
  }
}

export const experienceService = new ExperienceService();
export default experienceService;
