import { Injectable } from '@angular/core';

export interface CookieOptions {
  expires?: number | Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
}

@Injectable({
  providedIn: 'root'
})
export class CookieService {

  /**
   * Set a cookie
   * @param name Cookie name
   * @param value Cookie value
   * @param options Cookie options
   */
  set(name: string, value: string, options?: CookieOptions): void {
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    if (options) {
      if (options.expires) {
        if (typeof options.expires === 'number') {
          const date = new Date();
          date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
          cookieString += `; expires=${date.toUTCString()}`;
        } else {
          cookieString += `; expires=${options.expires.toUTCString()}`;
        }
      }

      if (options.path) {
        cookieString += `; path=${options.path}`;
      } else {
        cookieString += `; path=/`;
      }

      if (options.domain) {
        cookieString += `; domain=${options.domain}`;
      }

      if (options.secure || window.location.protocol === 'https:') {
        cookieString += `; Secure`;
      }

      if (options.sameSite) {
        cookieString += `; SameSite=${options.sameSite}`;
      } else {
        cookieString += `; SameSite=Strict`;
      }
    } else {
      cookieString += `; path=/; SameSite=Strict`;
    }

    document.cookie = cookieString;
  }

  /**
   * Get a cookie value
   * @param name Cookie name
   * @returns Cookie value or null if not found
   */
  get(name: string): string | null {
    const nameEQ = `${encodeURIComponent(name)}=`;
    const cookies = document.cookie.split(';');

    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.indexOf(nameEQ) === 0) {
        const value = cookie.substring(nameEQ.length);
        return decodeURIComponent(value);
      }
    }

    return null;
  }

  /**
   * Check if a cookie exists
   * @param name Cookie name
   * @returns True if cookie exists
   */
  check(name: string): boolean {
    return this.get(name) !== null;
  }

  /**
   * Delete a cookie
   * @param name Cookie name
   * @param path Cookie path
   * @param domain Cookie domain
   */
  delete(name: string, path?: string, domain?: string): void {
    let cookieString = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 UTC`;

    if (path) {
      cookieString += `; path=${path}`;
    } else {
      cookieString += `; path=/`;
    }

    if (domain) {
      cookieString += `; domain=${domain}`;
    }

    document.cookie = cookieString;
  }

  /**
   * Get all cookies
   * @returns Object with all cookies
   */
  getAll(): { [key: string]: string } {
    const cookies: { [key: string]: string } = {};
    
    if (document.cookie && document.cookie !== '') {
      const cookieArray = document.cookie.split(';');
      
      for (let cookie of cookieArray) {
        cookie = cookie.trim();
        const eqPos = cookie.indexOf('=');
        
        if (eqPos > -1) {
          const name = decodeURIComponent(cookie.substring(0, eqPos));
          const value = decodeURIComponent(cookie.substring(eqPos + 1));
          cookies[name] = value;
        }
      }
    }

    return cookies;
  }

  /**
   * Delete all cookies
   */
  deleteAll(path?: string, domain?: string): void {
    const cookies = this.getAll();
    
    for (const name in cookies) {
      if (cookies.hasOwnProperty(name)) {
        this.delete(name, path, domain);
      }
    }
  }
}
