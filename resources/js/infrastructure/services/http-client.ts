/**
 * HTTP Client - Cliente HTTP centralizado para llamadas API
 *
 * Propósito: Centralizar lógica de llamadas HTTP, manejo de errores,
 * transformación de datos, y notificaciones
 *
 * Características:
 * - Métodos GET, POST, PUT, DELETE simplificados
 * - Interceptores automáticos (auth, errores, etc.)
 * - Manejo consistente de respuestas
 * - Notificaciones integradas
 * - Transformación de datos
 *
 * Uso:
 * const client = new HttpClient('https://api.example.com');
 * const data = await client.get('/usuarios/1');
 * const created = await client.post('/usuarios', { nombre: 'Juan' });
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import NotificationService from '@/infrastructure/services/notification.service';

export interface HttpClientOptions {
  baseURL?: string;
  timeout?: number;
  showErrors?: boolean;
  showSuccess?: boolean;
}

export interface RequestConfig<T = any> extends AxiosRequestConfig<T> {
  skipErrorNotification?: boolean;
  skipSuccessNotification?: boolean;
  transformResponse?: (data: any) => any;
}

export class HttpClient {
  private axiosInstance: AxiosInstance;
  private options: HttpClientOptions;

  constructor(options: HttpClientOptions = {}) {
    this.options = {
      baseURL: options.baseURL || '/api',
      timeout: options.timeout || 30000,
      showErrors: options.showErrors !== false,
      showSuccess: options.showSuccess !== false,
    };

    this.axiosInstance = axios.create({
      baseURL: this.options.baseURL,
      timeout: this.options.timeout,
    });

    // Interceptor de respuesta para manejo de errores
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => this.handleError(error)
    );
  }

  /**
   * GET - Obtener datos
   */
  async get<T = any>(url: string, config?: RequestConfig): Promise<T> {
    try {
      const response = await this.axiosInstance.get<T>(url, config);
      return config?.transformResponse ? config.transformResponse(response.data) : response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * POST - Crear recurso
   */
  async post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    try {
      const response = await this.axiosInstance.post<T>(url, data, config);

      if (this.options.showSuccess && !config?.skipSuccessNotification) {
        NotificationService.success('Recurso creado correctamente');
      }

      return config?.transformResponse ? config.transformResponse(response.data) : response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * PUT - Actualizar recurso
   */
  async put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    try {
      const response = await this.axiosInstance.put<T>(url, data, config);

      if (this.options.showSuccess && !config?.skipSuccessNotification) {
        NotificationService.success('Recurso actualizado correctamente');
      }

      return config?.transformResponse ? config.transformResponse(response.data) : response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * PATCH - Actualización parcial
   */
  async patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    try {
      const response = await this.axiosInstance.patch<T>(url, data, config);

      if (this.options.showSuccess && !config?.skipSuccessNotification) {
        NotificationService.success('Recurso actualizado correctamente');
      }

      return config?.transformResponse ? config.transformResponse(response.data) : response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * DELETE - Eliminar recurso
   */
  async delete<T = any>(url: string, config?: RequestConfig): Promise<T> {
    try {
      const response = await this.axiosInstance.delete<T>(url, config);

      if (this.options.showSuccess && !config?.skipSuccessNotification) {
        NotificationService.success('Recurso eliminado correctamente');
      }

      return config?.transformResponse ? config.transformResponse(response.data) : response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Manejo centralizado de errores
   */
  private handleError(error: AxiosError) {
    if (this.options.showErrors) {
      const message = this.getErrorMessage(error);
      NotificationService.error(message);
    }

    console.error('[HttpClient Error]', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    throw error;
  }

  /**
   * Extraer mensaje de error amigable
   */
  private getErrorMessage(error: AxiosError): string {
    // Si hay respuesta del servidor
    if (error.response?.data) {
      const data = error.response.data as any;
      if (data.message) return data.message;
      if (data.error) return data.error;
    }

    // Por defecto según código HTTP
    const status = error.response?.status;
    switch (status) {
      case 400:
        return 'Solicitud inválida. Por favor, revisa los datos.';
      case 401:
        return 'No autorizado. Por favor, inicia sesión nuevamente.';
      case 403:
        return 'No tienes permiso para realizar esta acción.';
      case 404:
        return 'El recurso no fue encontrado.';
      case 409:
        return 'Hay un conflicto. El recurso puede haber sido modificado.';
      case 422:
        return 'Los datos enviados no son válidos.';
      case 500:
        return 'Error del servidor. Intenta más tarde.';
      case 503:
        return 'Servicio no disponible. Intenta más tarde.';
      default:
        return error.message || 'Error desconocido. Intenta de nuevo.';
    }
  }

  /**
   * Agregar interceptor personalizado
   */
  use(config: AxiosRequestConfig) {
    this.axiosInstance.defaults = { ...this.axiosInstance.defaults, ...config };
    return this;
  }

  /**
   * Obtener instancia axios directa (para casos especiales)
   */
  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

// ========================================
// CLIENTE HTTP POR DEFECTO
// ========================================

export const httpClient = new HttpClient({
  baseURL: '/api',
  showErrors: true,
  showSuccess: false, // Las operaciones CRUD manejan sus propios mensajes
});
