import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { tap, catchError } from "rxjs/operators";
import { jwtDecode } from "jwt-decode";
import { CookieService } from '../services/cookie.service';

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = "https://localhost:8444/api/v1/auth";

  constructor(
    private http: HttpClient, 
    private router: Router,
    private cookieService: CookieService
  ) {}

  /**
   * Méthode login principale
   */
  login(email: string, password: string): Observable<any> {
    const loginRequest = { email, password };

    console.log('%c='.repeat(60), 'color: blue; font-weight: bold');
    console.log('%c📤 SENDING LOGIN REQUEST', 'color: blue; font-weight: bold');
    console.log('Endpoint:', `${this.apiUrl}/signin`);
    console.log('Email:', email);
    console.log('%c='.repeat(60), 'color: blue; font-weight: bold');

    return this.http.post(`${this.apiUrl}/signin`, loginRequest).pipe(
      tap((response: any) => {
        console.log('%c='.repeat(60), 'color: green; font-weight: bold');
        console.log('%c🎉 LOGIN RESPONSE RECEIVED', 'color: green; font-weight: bold; font-size: 16px');
        console.log('%c='.repeat(60), 'color: green; font-weight: bold');
        
        console.log('%cFull Response Object:', 'color: orange; font-weight: bold');
        console.log(response);
        
        const accessToken = response.accessToken;
        const refreshToken = response.refreshToken;
        const userId = response.userId;
        const role = response.role;
        const isVerified = response.isVerified;

        if (!accessToken) {
          console.error('%c❌ No access token!', 'color: red; font-weight: bold');
          throw new Error("No access token received");
        }

        const decodedToken: any = jwtDecode(accessToken);
        console.log('%cDecoded Token:', 'color: cyan');
        console.log(decodedToken);

        // Store tokens in cookies instead of localStorage
        console.log('%c🍪 Storing tokens in COOKIES', 'color: purple; font-weight: bold');
        
        // Store access token (expires in 1 day)
        this.cookieService.set('access_token', accessToken, {
          expires: 1,
          path: '/',
          secure: false,
          sameSite: 'Lax'
        });

        // Store refresh token (expires in 7 days)
        this.cookieService.set('refresh_token', refreshToken, {
          expires: 7,
          path: '/',
          secure: false,
          sameSite: 'Lax'
        });

        // Store user info in cookies
        this.cookieService.set('user_id', userId.toString(), {
          expires: 7,
          path: '/',
          secure: false,
          sameSite: 'Lax'
        });

        this.cookieService.set('user_email', email, {
          expires: 7,
          path: '/',
          secure: false,
          sameSite: 'Lax'
        });

        this.cookieService.set('user_role', role, {
          expires: 7,
          path: '/',
          secure: false,
          sameSite: 'Lax'
        });

        this.cookieService.set('is_verified', isVerified.toString(), {
          expires: 7,
          path: '/',
          secure: false,
          sameSite: 'Lax'
        });

        this.cookieService.set('username', decodedToken.sub || email, {
          expires: 7,
          path: '/',
          secure: false,
          sameSite: 'Lax'
        });

        console.log('%c✅ Tokens stored in cookies', 'color: green; font-weight: bold');

        // Verify cookies were set
        console.log('%cVerifying cookies:', 'color: purple');
        console.log('access_token:', this.cookieService.check('access_token') ? '✅' : '❌');
        console.log('refresh_token:', this.cookieService.check('refresh_token') ? '✅' : '❌');

        console.log('%c='.repeat(60), 'color: yellow; font-weight: bold');
        console.log('%c🔍 CHECKING VERIFICATION STATUS', 'color: yellow; font-weight: bold; font-size: 16px');
        console.log('%c='.repeat(60), 'color: yellow; font-weight: bold');
        
        if (isVerified === false) {
          console.log('%c⚠️ ACCOUNT NOT VERIFIED - REDIRECTING TO OTP', 'color: orange; font-weight: bold');
          
          // Store pending email in cookie instead of localStorage
          this.cookieService.set('pending_verification_email', email, {
            expires: 1,
            path: '/',
            secure: false,
            sameSite: 'Lax'
          });
          
          this.router.navigate(['/pages/otp-verification']);
        } else {
          console.log('%c✅ ACCOUNT IS VERIFIED - REDIRECTING TO DASHBOARD', 'color: green; font-weight: bold');
          this.router.navigate(["/dashboard/dashboard1"]);
        }
      }),
      catchError((error) => {
        console.log('%c='.repeat(60), 'color: red; font-weight: bold');
        console.error("%c❌ LOGIN ERROR", 'color: red; font-weight: bold; font-size: 16px');
        console.log('%c='.repeat(60), 'color: red; font-weight: bold');
        console.error("Error:", error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Méthode signinUser pour compatibilité
   */
  signinUser(email: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.login(email, password).subscribe({
        next: (response) => resolve(response),
        error: (error) => reject(error),
      });
    });
  }

  /**
   * Méthode d'inscription
   */
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, userData);
  }

  /**
   * Forgot Password - Send OTP to email
   */
  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email }, { responseType: 'text' }).pipe(
      catchError((error) => {
        console.error('Forgot password error:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Verify OTP
   */
  verifyOTP(email: string, otp: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-otp?email=${email}&otp=${otp}`, {}, { responseType: 'text' }).pipe(
      catchError((error) => {
        console.error('Verify OTP error:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Reset Password with OTP
   */
  resetPassword(request: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, request, { responseType: 'text' }).pipe(
      catchError((error) => {
        console.error('Reset password error:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Resend OTP for email verification
   */
  resendVerificationOTP(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/resend-otp`, { email }, { responseType: 'text' }).pipe(
      catchError((error) => {
        console.error('Resend OTP error:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get email from cookies
   */
  getEmail(): string | null {
    return this.cookieService.get('user_email');
  }

  /**
   * Get username from cookies
   */
  getUsername(): string | null {
    return this.cookieService.get('username') || this.getEmail();
  }

  /**
   * Get access token from cookies
   */
  getAccessToken(): string | null {
    return this.cookieService.get('access_token');
  }

  /**
   * Get refresh token from cookies
   */
  getRefreshToken(): string | null {
    return this.cookieService.get('refresh_token');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  /**
   * Secure logout - Clear all cookies and redirect
   */
  logout(): void {
    console.log('%c='.repeat(60), 'color: red; font-weight: bold');
    console.log('%c🚪 LOGOUT INITIATED', 'color: red; font-weight: bold; font-size: 16px');
    console.log('%c='.repeat(60), 'color: red; font-weight: bold');

    const refreshToken = this.getRefreshToken();

    // Call backend logout endpoint if refresh token exists
    if (refreshToken) {
      console.log('📡 Calling backend logout endpoint...');
      this.http
        .post(`${this.apiUrl}/logout`, { refresh_token: refreshToken })
        .subscribe({
          next: () => {
            console.log('✅ Backend logout successful');
            this.clearAllAuthData();
          },
          error: (err) => {
            console.error('❌ Backend logout error:', err);
            this.clearAllAuthData();
          }
        });
    } else {
      console.log('ℹ️ No refresh token found, clearing cookies only');
      this.clearAllAuthData();
    }
  }

  /**
   * Clear all authentication cookies
   */
  private clearAllAuthData(): void {
    console.log('%c🗑️ CLEARING ALL AUTHENTICATION COOKIES', 'color: orange; font-weight: bold');
    
    // Delete all auth-related cookies
    this.cookieService.delete('access_token');
    this.cookieService.delete('refresh_token');
    this.cookieService.delete('user_id');
    this.cookieService.delete('user_email');
    this.cookieService.delete('user_role');
    this.cookieService.delete('is_verified');
    this.cookieService.delete('username');
    this.cookieService.delete('pending_verification_email');
    
    console.log('✅ All authentication cookies cleared');
    console.log('%c='.repeat(60), 'color: green; font-weight: bold');
    console.log('%c🎉 LOGOUT COMPLETED - REDIRECTING TO LOGIN', 'color: green; font-weight: bold; font-size: 16px');
    console.log('%c='.repeat(60), 'color: green; font-weight: bold');
    
    // Redirect to login page
    this.router.navigate(['/pages/login']);
  }

  /**
   * Get user roles from cookies
   */
  getRoles(): string[] {
    const role = this.cookieService.get('user_role');
    return role ? [role] : [];
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }

  /**
   * Check if user is verified
   */
  isVerified(): boolean {
    const verified = this.cookieService.get('is_verified');
    return verified === 'true';
  }

  /**
   * Get user ID from cookies
   */
  getUserId(): number | null {
    const userId = this.cookieService.get('user_id');
    return userId ? parseInt(userId) : null;
  }
}
