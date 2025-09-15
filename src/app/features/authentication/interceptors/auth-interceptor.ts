// src/app/core/interceptors/auth.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, from } from 'rxjs';
import { catchError, filter, take, switchMap, tap, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth-service';
import { HttpRequestService } from '../../../shared/services/http-request/http-request.service';
import { ConstantsEndpoints } from '../../../shared/constants/constants-endpoints';
import { MessageService } from '../../../shared/services/message-service/message.service';
import { LoaderService } from '../../../shared/services/loader/loader.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private authService: AuthService,
    private httpRequestService: HttpRequestService,
    private router: Router,
    private messageService: MessageService,
    private loaderService: LoaderService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Determinar si es una petición de auth (no mostrar loader para estas)
    const isAuthRequest = request.url.includes('/auth/login') || request.url.includes('/auth/refresh');
    
    // Mostrar loader solo para peticiones que no son de autenticación
    if (!isAuthRequest) {
      this.loaderService.show();
    }

    // Si es una petición de auth, no añadir el token y manejar sin loader
    if (isAuthRequest) {
      return next.handle(request).pipe(
        finalize(() => {
          // Ocultar loader si por alguna razón se mostró
          if (!isAuthRequest) {
            this.loaderService.hide();
          }
        })
      );
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
      }),
      finalize(() => {
        // Ocultar loader cuando la petición termine (éxito o error)
        if (!isAuthRequest) {
          this.loaderService.hide();
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
          
          // Verificar si es el error específico de refresh token expirado
          if (this.isRefreshTokenExpiredError(error)) {
            // Convertir a 401 y cerrar sesión
            this.redirectToLogin();
            return throwError(() => new HttpErrorResponse({
              error: error.error,
              status: 401,
              statusText: 'Unauthorized',
              url: error.url
            }));
          }
          
          this.redirectToLogin();
          return throwError(() => error);
        }),
        finalize(() => {
          // Asegurarse de ocultar el loader incluso en errores de refresh
          this.loaderService.hide();
        })
      );
    } else {
      // Esperar a que el refresh termine y luego reintentar
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(token => {
          return next.handle(this.addToken(request, token));
        }),
        finalize(() => {
          this.loaderService.hide();
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
      
      // Si es el error específico de refresh token expirado, lanzar un error con status 401
      if (this.isRefreshTokenExpiredError(error as ErrorApi)) {
        throw new HttpErrorResponse({
          error: error,
          status: 401,
          statusText: 'Unauthorized',
          url:""
        });
      }
      
      throw error;
    }
  }

  private isRefreshTokenExpiredError(error: ErrorApi): boolean {
    // Verificar si el error es específicamente de refresh token expirado
    return error && 
           error.error && 
           error.error.type === 'AUTH.RefreshTokenHasExpired';
  }

  private redirectToLogin(): void {
    // Limpiar todos los datos de autenticación
    this.authService.clearAuthData();
    
    // Redirigir al login
    this.router.navigate(["authentication"]);
    
    // Opcional: Mostrar mensaje al usuario
    this.messageService.showError('Su sesión ha expirado. Por favor, inicie sesión nuevamente.');
    
    // Asegurarse de ocultar el loader al redirigir
    this.loaderService.hide();
  }
}

interface ErrorApi {
  error : {
    type: string,
    message: string,
    timestamp: string,
    path: string,
    method: string
  }
}