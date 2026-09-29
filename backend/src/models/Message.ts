import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IMessage extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  isArchived: boolean;
  readAt?: Date;
  ipAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type MessageModel = Model<IMessage>;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const messageSchema = new Schema<IMessage>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [emailRegex, 'Please provide a valid email address'],
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      required: [true, 'isRead flag is required'],
    },
    isArchived: {
      type: Boolean,
      default: false,
      required: [true, 'isArchived flag is required'],
    },
    readAt: {
      type: Date,
    },
    ipAddress: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: 'messages',
  },
);

// Indexes matching PRD Section 11.12
messageSchema.index({ isRead: 1, createdAt: -1 });
messageSchema.index({ isArchived: 1 });

export const Message: MessageModel =
  (mongoose.models.Message as MessageModel) ||
  mongoose.model<IMessage>('Message', messageSchema);

export default Message;
