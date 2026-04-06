import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from './auth';

export const adminGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAdmin()) return true;  

  router.navigate(['/products'])
  return false;
};

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (!token) {
    return router.createUrlTree(['/login'],{
      queryParams: {returnUrl:router.url}
    })
  }

  try {
    jwtDecode(token); return true
  } catch (err) {
    return router.createUrlTree(['/login'],{
      queryParams: {returnUrl:router.url}

    })
  }

};