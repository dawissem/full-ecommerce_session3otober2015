// import { Injectable } from '@angular/core';
// import {
//   HttpRequest,
//   HttpHandler,
//   HttpEvent,
//   HttpInterceptor,
//   HttpErrorResponse
// } from '@angular/common/http';
// import { Observable, throwError, BehaviorSubject } from 'rxjs';
// import { catchError, filter, take, switchMap } from 'rxjs/operators';
// import { AuthService } from './auth.service';

// @Injectable()
// export class AuthInterceptor implements HttpInterceptor {
//   private isRefreshing = false;
//   private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

//   constructor(private authService: AuthService) {}

//   intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
//     // Add token to request if available
//     const token = this.authService.getAccessToken();

//     if (token) {
//       request = this.addToken(request, token);
//     }

//     return next.handle(request).pipe(
//       catchError(error => {
//         if (error instanceof HttpErrorResponse && error.status === 401) {
//           return this.handle401Error(request, next);
//         }
//         return throwError(() => error);
//       })
//     );
//   }

//   /**
//    * Add authorization token to request
//    */
//   private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
//     return request.clone({
//       setHeaders: {
//         Authorization: `Bearer ${token}`
//       }
//     });
//   }

//   /**
//    * Handle 401 errors by refreshing token
//    */
//   private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     if (!this.isRefreshing) {
//       this.isRefreshing = true;
//       this.refreshTokenSubject.next(null);

//       return this.authService.refreshToken().pipe(
//         switchMap((response: any) => {
//           this.isRefreshing = false;
//           this.refreshTokenSubject.next(response.accessToken);
//           return next.handle(this.addToken(request, response.accessToken));
//         }),
//         catchError((err) => {
//           this.isRefreshing = false;
//           this.authService.logout();
//           return throwError(() => err);
//         })
//       );
//     } else {
//       // Wait for token refresh
//       return this.refreshTokenSubject.pipe(
//         filter(token => token != null),
//         take(1),
//         switchMap(token => {
//           return next.handle(this.addToken(request, token));
//         })
//       );
//     }
//   }
// }
import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { AuthService } from "./auth.service";
import { Router } from "@angular/router";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const accessToken = this.authService.getAccessToken();

    // Ajouter le token seulement pour les requêtes vers notre API
    if (accessToken && (request.url.includes("localhost:8444") || request.url.includes("localhost:8087"))) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Token expiré ou invalide - déconnecter l'utilisateur
          this.authService.logout();
          this.router.navigate(["/pages/login"]);
        }
        return throwError(() => error);
      })
    );
  }
}
