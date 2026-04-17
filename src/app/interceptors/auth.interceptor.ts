import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

/**
 * Functional Interceptor — Angular 18+
 *
 * 1. Inyecta JWT del backend (localStorage) en cada request HttpClient.
 * 2. Maneja 401 → logout + redirect a /auth/login.
 * 3. Maneja 429 → Rate Limit logging.
 *
 * Todas las requests del frontend van al API Gateway (:3000).
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  // Leer token desde localStorage
  const token = localStorage.getItem('auth_token');

  // Clonar request con Authorization header si hay token
  const authReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // ── 401 Unauthorized → sesión expirada ──────────────────────────
      if (error.status === 401) {
        console.warn('[AuthInterceptor] 401 — Sesión expirada. Redirigiendo a login...');
        localStorage.removeItem('auth_token');
        router.navigate(['/login']);
      }

      // ── 429 Rate Limit → log + notificar al usuario ────────────────
      if (error.status === 429) {
        console.error('[AuthInterceptor] 429 — Rate limit alcanzado.');
      }

      return throwError(() => error);
    })
  );
};
