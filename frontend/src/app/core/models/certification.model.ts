import { BilingualField } from './api-response.model';

/**
 * Certification & Award Model
 * Aligned with PRD Section 11.9
 */

export type CertificationType = 'certification' | 'award' | 'achievement';

export interface Certification {
  _id: string;
  name: BilingualField;
  type: CertificationType;
  organization: BilingualField;
  issueDate: string | Date;
  expirationDate?: string | Date;
  credentialId?: string;
  credentialUrl?: string;
  image?: string;
  description?: BilingualField;
  isVisible: boolean;
  order: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
