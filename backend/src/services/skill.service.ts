import Skill, { ISkill } from '../models/Skill';
import { NotFoundError } from '../utils/AppError';
import { getPaginationParams, buildPaginationMetadata } from '../utils/pagination';
import { PaginatedData } from '../utils/apiResponse';

export interface SkillListQuery {
  category?: string;
  isVisible?: boolean | string;
  search?: string;
  page?: string | number;
  limit?: string | number;
}

export interface CreateSkillDto {
  name: string;
  category: { en: string; kh?: string };
  icon?: string;
  order?: number;
  isVisible?: boolean;
}

export type UpdateSkillDto = Partial<CreateSkillDto>;

export class SkillService {
  /**
   * List all skills with optional filters and pagination
   */
  async getAll(query: SkillListQuery = {}): Promise<ISkill[] | PaginatedData<ISkill>> {
    const filter: Record<string, unknown> = {};

    if (query.isVisible !== undefined) {
      filter.isVisible = String(query.isVisible) === 'true';
    }

    if (query.category) {
      const categoryRegex = new RegExp(query.category, 'i');
      filter.$or = [
        { 'category.en': categoryRegex },
        { 'category.kh': categoryRegex },
      ];
    }

    if (query.search) {
      const searchRegex = new RegExp(query.search, 'i');
      filter.$or = [
        { name: searchRegex },
        { 'category.en': searchRegex },
        { 'category.kh': searchRegex },
      ];
    }

    // Check if pagination was explicitly requested
    const isPaginationRequested = query.page !== undefined || query.limit !== undefined;

    if (isPaginationRequested) {
      const { page, limit, skip } = getPaginationParams(query);
      const [items, total] = await Promise.all([
        Skill.find(filter)
          .sort({ order: 1, createdAt: 1 })
          .skip(skip)
          .limit(limit),
        Skill.countDocuments(filter),
      ]);
      const pagination = buildPaginationMetadata(total, page, limit);
      return { items, pagination };
    }

    return Skill.find(filter).sort({ order: 1, createdAt: 1 });
  }

  /**
   * Get single skill by ID
   */
  async getById(id: string): Promise<ISkill> {
    const skill = await Skill.findById(id);
    if (!skill) {
      throw new NotFoundError(`Skill with ID ${id} not found`);
    }
    return skill;
  }

  /**
   * Create a new skill
   */
  async create(data: CreateSkillDto): Promise<ISkill> {
    data.category.kh = data.category.kh || data.category.en;
    const skill = new Skill(data);
    await skill.save();
    return skill;
  }

  /**
   * Update skill by ID
   */
  async update(id: string, data: UpdateSkillDto): Promise<ISkill> {
    const skill = await Skill.findById(id);
    if (!skill) {
      throw new NotFoundError(`Skill with ID ${id} not found`);
    }

    if (data.name !== undefined) {
      skill.name = data.name;
    }

    if (data.category) {
      if (data.category.en) skill.category.en = data.category.en;
      if (data.category.kh) skill.category.kh = data.category.kh;
    }

    if (data.icon !== undefined) {
      skill.icon = data.icon;
    }

    if (data.order !== undefined) {
      skill.order = data.order;
    }

    if (data.isVisible !== undefined) {
      skill.isVisible = data.isVisible;
    }

    await skill.save();
    return skill;
  }

  /**
   * Delete skill by ID
   */
  async delete(id: string): Promise<void> {
    const skill = await Skill.findById(id);
    if (!skill) {
      throw new NotFoundError(`Skill with ID ${id} not found`);
    }
    await Skill.findByIdAndDelete(id);
  }
}

export const skillService = new SkillService();
export default skillService;
