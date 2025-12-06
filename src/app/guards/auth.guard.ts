import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated = authService.isAuthenticated();
  
  if (isAuthenticated) {
    console.log('Auth guard: User is authenticated, allowing access');
    return true;
  }

  console.warn('Auth guard: User is not authenticated, redirecting to login');
  router.navigate(['/login']);
  return false;
};

export const publicGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuth = authService.isAuthenticated();
  console.log('Public guard: checking authentication', {
    isAuthenticated: isAuth,
    hasToken: !!authService.getToken(),
    hasUser: !!authService.currentUser()
  });

  if (!isAuth) {
    console.log('Public guard: User is not authenticated, allowing access to public route');
    return true;
  }

  console.log('Public guard: User is authenticated, redirecting to home');
  router.navigate(['/home']);
  return false;
};
