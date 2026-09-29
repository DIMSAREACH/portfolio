import Message, { IMessage } from '../models/Message';
import { NotFoundError } from '../utils/AppError';
import { getPaginationParams, buildPaginationMetadata } from '../utils/pagination';
import { PaginatedData } from '../utils/apiResponse';

export interface MessageListQuery {
  isRead?: boolean | string;
  isArchived?: boolean | string;
  search?: string;
  page?: string | number;
  limit?: string | number;
}

export interface CreateMessageDto {
  name: string;
  email: string;
  subject: string;
  message: string;
  ipAddress?: string;
}

export class MessageService {
  /**
   * List messages with filters (isRead, isArchived, search) and pagination
   */
  async getAll(query: MessageListQuery = {}): Promise<PaginatedData<IMessage>> {
    const { page, limit, skip } = getPaginationParams(query);
    const filter: Record<string, unknown> = {};

    if (query.isRead !== undefined && query.isRead !== '') {
      filter.isRead = String(query.isRead) === 'true';
    }

    if (query.isArchived !== undefined && query.isArchived !== '') {
      filter.isArchived = String(query.isArchived) === 'true';
    }

    if (query.search) {
      const searchRegex = new RegExp(query.search, 'i');
      filter.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { subject: searchRegex },
        { message: searchRegex },
      ];
    }

    const [items, total] = await Promise.all([
      Message.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Message.countDocuments(filter),
    ]);

    const pagination = buildPaginationMetadata(total, page, limit);

    return {
      items,
      pagination,
    };
  }

  /**
   * Get single message by ID
   */
  async getById(id: string): Promise<IMessage> {
    const message = await Message.findById(id);
    if (!message) {
      throw new NotFoundError(`Message with ID ${id} not found`);
    }
    return message;
  }

  /**
   * Mark message as read (sets isRead: true and readAt: new Date())
   */
  async markAsRead(id: string): Promise<IMessage> {
    const message = await Message.findById(id);
    if (!message) {
      throw new NotFoundError(`Message with ID ${id} not found`);
    }

    message.isRead = true;
    message.readAt = new Date();
    return await message.save();
  }

  /**
   * Mark message as unread (sets isRead: false and clears readAt)
   */
  async markAsUnread(id: string): Promise<IMessage> {
    const message = await Message.findById(id);
    if (!message) {
      throw new NotFoundError(`Message with ID ${id} not found`);
    }

    message.isRead = false;
    message.readAt = undefined;
    return await message.save();
  }

  /**
   * Archive message (sets isArchived: true)
   */
  async archive(id: string): Promise<IMessage> {
    const message = await Message.findById(id);
    if (!message) {
      throw new NotFoundError(`Message with ID ${id} not found`);
    }

    message.isArchived = true;
    return await message.save();
  }

  /**
   * Unarchive message (sets isArchived: false)
   */
  async unarchive(id: string): Promise<IMessage> {
    const message = await Message.findById(id);
    if (!message) {
      throw new NotFoundError(`Message with ID ${id} not found`);
    }

    message.isArchived = false;
    return await message.save();
  }

  /**
   * Delete message by ID
   */
  async delete(id: string): Promise<void> {
    const message = await Message.findById(id);
    if (!message) {
      throw new NotFoundError(`Message with ID ${id} not found`);
    }

    await Message.findByIdAndDelete(id);
  }

  /**
   * Create message (used by public contact endpoint and test fixtures)
   */
  async create(data: CreateMessageDto): Promise<IMessage> {
    const message = new Message(data);
    return await message.save();
  }
}

export const messageService = new MessageService();
export default messageService;
