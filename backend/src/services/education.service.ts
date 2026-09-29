import Education, { IEducation } from '../models/Education';
import { NotFoundError } from '../utils/AppError';
import { getPaginationParams, buildPaginationMetadata } from '../utils/pagination';
import { PaginatedData } from '../utils/apiResponse';

export interface EducationListQuery {
  search?: string;
  page?: string | number;
  limit?: string | number;
}

export interface CreateEducationDto {
  institution: { en: string; kh?: string };
  degree: { en: string; kh?: string };
  field: { en: string; kh?: string };
  startYear: number;
  endYear?: number;
  description?: { en?: string; kh?: string };
  activities?: { en?: string[]; kh?: string[] };
  gpa?: string;
  order?: number;
}

export type UpdateEducationDto = Partial<CreateEducationDto>;

export class EducationService {
  /**
   * List education entries with optional search and pagination
   */
  async getAll(query: EducationListQuery = {}): Promise<IEducation[] | PaginatedData<IEducation>> {
    const filter: Record<string, unknown> = {};

    if (query.search) {
      const searchRegex = new RegExp(query.search, 'i');
      filter.$or = [
        { 'institution.en': searchRegex },
        { 'institution.kh': searchRegex },
        { 'degree.en': searchRegex },
        { 'degree.kh': searchRegex },
        { 'field.en': searchRegex },
        { 'field.kh': searchRegex },
      ];
    }

    const isPaginationRequested = query.page !== undefined || query.limit !== undefined;

    if (isPaginationRequested) {
      const { page, limit, skip } = getPaginationParams(query);
      const [items, total] = await Promise.all([
        Education.find(filter)
          .sort({ order: 1, startYear: -1 })
          .skip(skip)
          .limit(limit),
        Education.countDocuments(filter),
      ]);
      const pagination = buildPaginationMetadata(total, page, limit);
      return { items, pagination };
    }

    return Education.find(filter).sort({ order: 1, startYear: -1 });
  }

  /**
   * Get single education entry by ID
   */
  async getById(id: string): Promise<IEducation> {
    const education = await Education.findById(id);
    if (!education) {
      throw new NotFoundError(`Education with ID ${id} not found`);
    }
    return education;
  }

  /**
   * Create a new education entry
   */
  async create(data: CreateEducationDto): Promise<IEducation> {
    data.institution.kh = data.institution.kh || data.institution.en;
    data.degree.kh = data.degree.kh || data.degree.en;
    data.field.kh = data.field.kh || data.field.en;

    const education = new Education(data);
    await education.save();
    return education;
  }

  /**
   * Update education entry by ID
   */
  async update(id: string, data: UpdateEducationDto): Promise<IEducation> {
    const education = await Education.findById(id);
    if (!education) {
      throw new NotFoundError(`Education with ID ${id} not found`);
    }

    if (data.institution) {
      if (data.institution.en) education.institution.en = data.institution.en;
      if (data.institution.kh) education.institution.kh = data.institution.kh;
    }

    if (data.degree) {
      if (data.degree.en) education.degree.en = data.degree.en;
      if (data.degree.kh) education.degree.kh = data.degree.kh;
    }

    if (data.field) {
      if (data.field.en) education.field.en = data.field.en;
      if (data.field.kh) education.field.kh = data.field.kh;
    }

    if (data.startYear !== undefined) education.startYear = data.startYear;
    if (data.endYear !== undefined) education.endYear = data.endYear;

    if (data.description) {
      education.description = {
        en: data.description.en ?? education.description?.en ?? '',
        kh: data.description.kh ?? education.description?.kh ?? data.description.en ?? '',
      };
    }

    if (data.activities) {
      education.activities = {
        en: data.activities.en ?? education.activities?.en ?? [],
        kh: data.activities.kh ?? education.activities?.kh ?? [],
      };
    }

    if (data.gpa !== undefined) education.gpa = data.gpa;
    if (data.order !== undefined) education.order = data.order;

    await education.save();
    return education;
  }

  /**
   * Delete education entry by ID
   */
  async delete(id: string): Promise<void> {
    const education = await Education.findById(id);
    if (!education) {
      throw new NotFoundError(`Education with ID ${id} not found`);
    }
    await Education.findByIdAndDelete(id);
  }
}

export const educationService = new EducationService();
export default educationService;
