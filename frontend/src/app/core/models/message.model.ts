/**
 * Contact Message Model
 * Aligned with PRD Section 11.12
 */

export interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  isArchived: boolean;
  readAt?: string | Date;
  ipAddress?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ContactFormPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  honeypot?: string;
}
