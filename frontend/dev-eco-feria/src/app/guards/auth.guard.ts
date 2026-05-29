import { inject, PLATFORM_ID } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { isPlatformServer } from '@angular/common';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // If on server, allow the route. The client will handle the actual guard logic after hydration.
  if (isPlatformServer(platformId)) {
    return true;
  }

  if (authService.isLoggedIn()) {
    return true;
  }

  // Redirect to login with return url
  return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};
