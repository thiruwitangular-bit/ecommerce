import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

export const adminGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);

  const role = localStorage.getItem('role');

  if (role === 'admin') return true;

  router.navigate(['/products'])
  return false;
};

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);

  const token = localStorage.getItem('token');

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  try {
    const decoded:any = jwtDecode(token);
    if(decoded.role === 'admin') return true;
    alert('Access denied, Admin Only');
    router.navigate(['/']);
    return false;
  } catch (err) {
    router.navigate(['/login']);
    return false
  }

};