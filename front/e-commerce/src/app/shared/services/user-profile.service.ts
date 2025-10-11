import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from '../services/cookie.service';
import { jwtDecode } from 'jwt-decode';

export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  role: string;
  isVerified: boolean;
  phone?: string;
  bio?: string;
  birthDate?: string;
  website?: string;
  country?: string;
  avatar?: string;
  company?: string;
  socialLinks?: {
    twitter?: string;
    facebook?: string;
    linkedin?: string;
    instagram?: string;
    googlePlus?: string;
    quora?: string;
  };
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  phone?: string;
  bio?: string;
  birthDate?: string;
  website?: string;
  country?: string;
  company?: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private apiUrl = 'https://localhost:8444/api/v1/users';

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) {}

  /**
   * Get user data from token (cookies)
   */
  getUserFromToken(): Partial<UserProfile> {
    const accessToken = this.cookieService.get('access_token');
    const email = this.cookieService.get('user_email');
    const role = this.cookieService.get('user_role');
    const userId = this.cookieService.get('user_id');
    const username = this.cookieService.get('username');
    const isVerified = this.cookieService.get('is_verified') === 'true';

    if (accessToken) {
      try {
        const decodedToken: any = jwtDecode(accessToken);
        
        return {
          id: userId ? parseInt(userId) : undefined,
          email: email || undefined,
          username: username || decodedToken.sub || undefined,
          role: role || undefined,
          isVerified: isVerified,
          firstName: decodedToken.firstName || '',
          lastName: decodedToken.lastName || ''
        };
      } catch (error) {
        console.error('Error decoding token:', error);
        return {};
      }
    }

    return {};
  }

  /**
   * Get full user profile from backend
   */
  getUserProfile(userId: number): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/${userId}`);
  }

  /**
   * Update user profile
   */
  updateProfile(userId: number, profile: UpdateProfileRequest): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.apiUrl}/${userId}`, profile);
  }

  /**
   * Change password
   */
  changePassword(userId: number, request: ChangePasswordRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/${userId}/change-password`, request, { responseType: 'text' });
  }

  /**
   * Upload avatar/profile picture
   */
  uploadAvatar(userId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('avatar', file);
    return this.http.post(`${this.apiUrl}/${userId}/avatar`, formData);
  }
}
