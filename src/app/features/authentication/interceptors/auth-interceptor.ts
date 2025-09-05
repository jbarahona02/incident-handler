// src/app/core/interceptors/auth.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, from } from 'rxjs';
import { catchError, filter, take, switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth-service';
import { HttpRequestService } from '../../../shared/services/http-request/http-request.service';
import { ConstantsEndpoints } from '../../../shared/constants/constants-endpoints';
import { MessageService } from '../../../shared/services/message-service/message.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private authService: AuthService,
    private httpRequestService: HttpRequestService,
    private router: Router,
    private messageService : MessageService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Si es una petición de login o refresh token, no añadir el token
    if (request.url.includes('/auth/login') || request.url.includes('/auth/refresh')) {
      return next.handle(request);
    }

    // Añadir token a la petición si está disponible y no ha expirado
    const accessToken = this.authService.getAccessToken();
    if (accessToken && !this.authService.isAccessTokenExpired()) {
      request = this.addToken(request, accessToken);
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && accessToken) {
          // Token expirado, intentar refrescar
          return this.handle401Error(request, next);
        } else if (error.status === 401) {
          // No autorizado, redirigir a login
          this.redirectToLogin();
          return throwError(() => error);
        } else {
          return throwError(() => error);
        }
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Verificar si el refresh token también ha expirado
    if (this.authService.isRefreshTokenExpired()) {
      this.redirectToLogin();
      return throwError(() => new Error('Refresh token expired'));
    }

    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return from(this.refreshToken()).pipe(
        switchMap((tokens: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(tokens.accessToken);
          
          // Reintentar la petición original con el nuevo token
          return next.handle(this.addToken(request, tokens.accessToken));
        }),
        catchError((error) => {
          this.isRefreshing = false;
          this.redirectToLogin();
          return throwError(() => error);
        })
      );
    } else {
      // Esperar a que el refresh termine y luego reintentar
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(token => {
          return next.handle(this.addToken(request, token));
        })
      );
    }
  }

  private async refreshToken(): Promise<any> {
    const refreshToken = this.authService.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await this.httpRequestService.post<any>(ConstantsEndpoints.AUTH_MICROSERVICE, 'auth/refresh', { 
        refreshToken 
      });

      // Guardar los nuevos tokens
      this.authService.setTokens(
        response.accessToken,
        response.refreshToken,
        response.expiresIn,
        response.refreshExpiresIn
      );

      return response;
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  }

  private redirectToLogin(): void {
    // Limpiar todos los datos de autenticación
    this.authService.clearAuthData();
    
    // Redirigir al login
    this.router.navigate(["authentication"]);
    
    // Opcional: Mostrar mensaje al usuario
    this.messageService.showError('Su sesión ha expirado. Por favor, inicie sesión nuevamente.');
  }
}