import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const jwtHelper = inject(JwtHelperService);
  const router = inject(Router);

  const token = authService.getToken();

  // Check for token existence and expiration
  if (!token || jwtHelper.isTokenExpired(token)) {
    authService.logout();
    router.navigate(['/auth/login']);
    return false;
  }

 


  const email: string | null = authService.getUserEmail();
  const role: string | null = authService.getUserRole();
  const requiredRoles: string[] = route.data?.['roles'] || [];

  // Defensive check: ensure role and email exist before comparing
  if (!email || !role || (requiredRoles.length > 0 && !requiredRoles.includes(role))) {
    router.navigate(['/403']);
     console.log('Guard - Role:', role);
     console.log('Required:', requiredRoles);
    return false;
  }

  return true;
};
