// src/app/core/services/http-request.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse, HttpContext } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { lastValueFrom } from 'rxjs';
import { MessageService } from '../message-service/message.service';

// Interface para la respuesta estandarizada
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: number;
  timestamp?: string;
}

export type RequestOptions = {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  context?: HttpContext;
  observe?: 'body';
  params?: HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> };
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
  transferCache?: { includeHeaders?: string[] } | boolean;
};

@Injectable({
  providedIn: 'root'
})
export class HttpRequestService {
  private userUrlBase: string = environment.apiUserMicroService;
  private authUrlBase: string = environment.apiAuthMicroService;
  private incidentUrlBase : string = environment.apiIncidentMicroService;
  private equipmentUrlBase : string = environment.apiEquipmentMicroService;

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  /**
   * Realiza una petición GET
   */
  async get<T>(microService: string, endpoint: string, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(microService,endpoint);
    const requestOptions = options || {};
    
    try {
      const response$ = this.http.get<ApiResponse<T>>(url, { ...requestOptions, observe: 'body' as const });
      const response = await lastValueFrom(response$);
      return response.data;
    } catch (error) {
      return this.handleError(error as HttpErrorResponse);
    }
  }

  /**
   * Realiza una petición POST
   */
  async post<T>(microService: string,endpoint: string, body: any, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(microService,endpoint);
    const requestOptions = options || {};

    try {
      const response$ = this.http.post<ApiResponse<T>>(url, body, { ...requestOptions, observe: 'body' as const });
      const response = await lastValueFrom(response$);
      return response.data;
    } catch (error) {
      return this.handleError(error as HttpErrorResponse);
    }
  }

  /**
   * Realiza una petición PUT
   */
  async put<T>(microService: string, endpoint: string, body: any, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(microService,endpoint);
    const requestOptions = options || {};
    
    try {
      const response$ = this.http.put<ApiResponse<T>>(url, body, { ...requestOptions, observe: 'body' as const });
      const response = await lastValueFrom(response$);
      return response.data;
    } catch (error) {
      return this.handleError(error as HttpErrorResponse);
    }
  }

  /**
   * Realiza una petición PATCH
   */
  async patch<T>(microService: string, endpoint: string, body?: any, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(microService, endpoint);
    const requestOptions = options || {};
    
    try {
      const response$ = this.http.patch<ApiResponse<T>>(url, body, { ...requestOptions, observe: 'body' as const });
      const response = await lastValueFrom(response$);
      return response.data;
    } catch (error) {
      return this.handleError(error as HttpErrorResponse);
    }
  }

  /**
   * Realiza una petición DELETE
   */
  async delete<T>(microService: string, endpoint: string, options?: RequestOptions): Promise<T> {
    const url = this.buildUrl(microService, endpoint);
    const requestOptions = options || {};
    
    try {
      const response$ = this.http.delete<ApiResponse<T>>(url, { ...requestOptions, observe: 'body' as const });
      const response = await lastValueFrom(response$);
      return response.data;
    } catch (error) {
      return this.handleError(error as HttpErrorResponse);
    }
  }

  /**
   * Extrae los datos de la respuesta estandarizada
   */
  private extractData<T>(response: ApiResponse<T>): T {
    // Puedes agregar validaciones adicionales aquí
    if (response && response.data !== undefined) {
      return response.data;
    }
    throw new Error('Formato de respuesta inválido: falta propiedad data');
  }

  /**
   * Construye la URL completa
   */
  private buildUrl(microServe: string, endpoint: string): string {
    let url : string  ="";

    switch (microServe){
      case 
        'user': url = `${this.userUrlBase.replace(/\/$/, '')}/${endpoint}`;
      break;
      case 
        'auth': url = `${this.authUrlBase.replace(/\/$/, '')}/${endpoint}`;
      break;
      case 
        'incident': url = `${this.incidentUrlBase.replace(/\/$/, '')}/${endpoint}`;
      break;
      case
        'equipment': url= `${this.equipmentUrlBase.replace(/\/$/, '')}/${endpoint}`;
      break;
    } 
    return url;
  }

  /**
   * Maneja errores de las peticiones HTTP
   */
  private handleError(error: HttpErrorResponse): never {
    let errorMessage = 'Ha ocurrido un error inesperado';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = this.getServerErrorMessage(error);
    }

    console.error('Error en petición HTTP:', errorMessage);
    
    // Muestra el diálogo de error - usa setTimeout para evitar problemas de detección de cambios
     // No mostrar diálogo de error para errores 401 (manejados por el interceptor)
    if (error.status !== 401) {
      setTimeout(() => {
        this.messageService.showError(errorMessage).subscribe();
      }, 0);
    }
    
    // console.error('Error en petición HTTP:', errorMessage);
    throw new Error(errorMessage);
  }

  /**
   * Obtiene mensajes de error específicos
   */
  private getServerErrorMessage(error: HttpErrorResponse): string {
    // Si el error viene en el formato estandarizado
    if (error.error && typeof error.error === 'object' && 'message' in error.error) {
      return error.error.message;
    }

    switch (error.status) {
      case 400:
        return 'Solicitud incorrecta. Verifique los datos enviados.';
      case 401:
        return 'No autorizado. Por favor, inicie sesión nuevamente.';
      case 403:
        return 'Acceso denegado. No tiene permisos para realizar esta acción.';
      case 404:
        return 'Recurso no encontrado.';
      case 500:
        return 'Error interno del servidor. Por favor, intente más tarde.';
      case 0:
        return 'No se pudo conectar con el servidor. Verifique su conexión a internet.';
      default:
        return `Error ${error.status}: ${error.message}`;
    }
  }

  /**
   * Crea headers por defecto con Content-Type application/json
   */
  getDefaultHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  /**
   * Crea headers con token de autorización
   */
  getAuthHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }
}