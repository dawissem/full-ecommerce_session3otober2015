import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UpdateUserRequest, UserStats, PagedResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  private apiUrl = 'https://localhost:8444/api/v1/users';

  constructor(private http: HttpClient) {}

  /**
   * Get all users (simple list)
   */
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  /**
   * Get users with pagination
   */
  getUsersPaginated(page: number = 0, size: number = 10, sortBy: string = 'id', sortDir: string = 'asc'): Observable<PagedResponse<User>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    return this.http.get<PagedResponse<User>>(`${this.apiUrl}/paginated`, { params });
  }

  /**
   * Get user by ID
   */
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  /**
   * Update user
   */
  updateUser(id: number, request: UpdateUserRequest): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, request);
  }

  /**
   * Delete user
   */
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  /**
   * Toggle user status (enabled/disabled)
   */
  toggleUserStatus(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/toggle-status`, {});
  }

  /**
   * Get user statistics
   */
  getUserStats(): Observable<UserStats> {
    return this.http.get<UserStats>(`${this.apiUrl}/stats`);
  }
}
