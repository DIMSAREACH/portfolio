/**
 * User and Authentication Models
 * Aligned with PRD Section 10 and 11.2
 */

export interface User {
  _id: string;
  email: string;
  fullName: string;
  role: 'admin';
  avatar?: string;
  lastLogin?: string | Date;
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
