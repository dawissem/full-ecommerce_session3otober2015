export interface User {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  role: string;
  isVerified: boolean;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  isVerified?: boolean;
  isEnabled?: boolean;
}

export interface UserStats {
  totalUsers: number;
  verifiedUsers: number;
  unverifiedUsers: number;
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}
