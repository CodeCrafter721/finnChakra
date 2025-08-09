import { provideRouter } from '@angular/router';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';

import { appRoutes } from './app.routes';
import { authInterceptor } from './interceptors/auth-interceptor';         // ✅ must be a HttpInterceptorFn
import { spinnerInterceptor } from './interceptors/spinner.interceptor';  // ✅ must also be a HttpInterceptorFn

export const appConfig = [
  importProvidersFrom(HttpClientModule),
  provideHttpClient(withInterceptors([
    authInterceptor,
    spinnerInterceptor
  ])),
  provideRouter(appRoutes),
  provideAnimations(),
  { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
  { provide: JwtHelperService, useClass: JwtHelperService },
  importProvidersFrom([]) 
];
