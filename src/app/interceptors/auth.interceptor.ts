import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Skip adding Authorization header for authentication endpoints
  // Check if the URL ends with /login or /register (more precise than includes)
  const isAuthEndpoint = req.url.endsWith('/login') || req.url.endsWith('/register');

  console.log('Interceptor:', { url: req.url, hasToken: !!token, isAuthEndpoint });

  if (token && !isAuthEndpoint) {
    console.log('Adding Authorization header to request');
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('Request error:', { url: req.url, status: error.status, isAuthEndpoint });
      if (error.status === 401 && !isAuthEndpoint) {
        console.error('401 Unauthorized - Token may be invalid or expired. Logging out user.');
        authService.logout();
      }
      return throwError(() => error);
    })
  );
};
