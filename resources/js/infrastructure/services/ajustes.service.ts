/**
 * Infrastructure Service: Ajustes de Inventario
 *
 * Maneja todas las operaciones de API para ajustes masivos y individuales
 * Encapsula las llamadas HTTP y transformación de datos
 */

import { router } from '@inertiajs/react';
import type {
    Id,
    TipoOperacion,
    DatosAjusteMasivo,
    ResultadoAjusteMasivo,
    FiltrosAjustesMasivos,
    PaginatedAjustesMasivos,
    AjusteMasivoHistorico,
} from '@/domain/entities/ajustes-masivos';

interface BaseServiceMethods<T, FormData> {
    obtener(id: Id): Promise<T>;
    listar(filtros?: any): Promise<T[]>;
    crear(datos: FormData): Promise<T>;
    actualizar(id: Id, datos: Partial<FormData>): Promise<T>;
    eliminar(id: Id): Promise<void>;
}

/**
 * Servicio de Ajustes de Inventario (Infrastructure Layer)
 *
 * Responsabilidades:
 * - Comunicación con API
 * - Transformación de datos
 * - Normalización de respuestas
 * - Manejo de errores
 */
class AjustesService implements BaseServiceMethods<AjusteMasivoHistorico, any> {
    private readonly baseUrl = '/api/inventario';

    /**
     * URL para operaciones de tipos de operación
     */
    private getTiposOperacionUrl = (): string => `${this.baseUrl}/tipos-operacion`;

    /**
     * URL para operaciones de ajustes masivos
     */
    private getAjustesMasivosUrl = (): string => `${this.baseUrl}/ajustes-masivos`;

    /**
     * URL para operaciones de ajuste individual
     */
    private getAjustesUrl = (): string => `${this.baseUrl}/ajustes`;

    /**
     * URL para descargar plantilla
     */
    private getPlantillaUrl = (): string => `${this.baseUrl}/ajustes-masivos/plantilla`;

    /**
     * Carga tipos de operación disponibles
     * Retorna un array vacío si el endpoint no existe
     */
    async obtenerTiposOperacion(): Promise<TipoOperacion[]> {
        try {
            const response = await fetch(this.getTiposOperacionUrl());
            if (!response.ok) {
                console.warn(`Endpoint ${this.getTiposOperacionUrl()} not found (${response.status})`);
                return [];
            }
            const data = await response.json();
            return data.data || data || [];
        } catch (error) {
            console.warn('Error fetching operation types:', error);
            // Retornar array vacío en lugar de lanzar error
            return [];
        }
    }

    /**
     * Procesa ajustes masivos - envía los datos validados al servidor
     */
    async procesarAjustesMasivos(datos: DatosAjusteMasivo): Promise<ResultadoAjusteMasivo> {
        try {
            return new Promise((resolve, reject) => {
                router.post(
                    `${this.getAjustesMasivosUrl()}/procesar`,
                    datos,
                    {
                        preserveScroll: true,
                        onSuccess: (props: any) => {
                            resolve(props.resultado || { procesados: 0, errores: 0, mensaje: 'Success' });
                        },
                        onError: (errors: any) => {
                            reject(new Error(errors.message || 'Error processing bulk adjustments'));
                        },
                    }
                );
            });
        } catch (error) {
            console.error('Error processing bulk adjustments:', error);
            throw error;
        }
    }

    /**
     * Obtiene ajustes masivos con filtros y paginación
     */
    async obtenerAjustesMasivos(
        page: number = 1,
        filtros?: FiltrosAjustesMasivos
    ): Promise<PaginatedAjustesMasivos> {
        try {
            const params = new URLSearchParams({
                page: String(page),
                ...Object.entries(filtros || {}).reduce((acc, [key, value]) => {
                    if (value !== undefined && value !== null) {
                        acc[key] = String(value);
                    }
                    return acc;
                }, {} as Record<string, string>),
            });

            const response = await fetch(`${this.getAjustesMasivosUrl()}?${params}`);
            if (!response.ok) throw new Error('Error loading bulk adjustments');
            return await response.json();
        } catch (error) {
            console.error('Error fetching bulk adjustments:', error);
            throw error;
        }
    }

    /**
     * Obtiene un ajuste masivo específico
     */
    async obtenerAjusteMasivo(id: Id): Promise<AjusteMasivoHistorico> {
        try {
            const response = await fetch(`${this.getAjustesMasivosUrl()}/${id}`);
            if (!response.ok) throw new Error('Error loading bulk adjustment');
            return await response.json();
        } catch (error) {
            console.error(`Error fetching bulk adjustment ${id}:`, error);
            throw error;
        }
    }

    /**
     * Descarga la plantilla CSV de ejemplo
     */
    async descargarPlantilla(): Promise<Blob> {
        try {
            const response = await fetch(this.getPlantillaUrl());
            if (!response.ok) throw new Error('Error downloading template');
            return await response.blob();
        } catch (error) {
            console.error('Error downloading template:', error);
            throw error;
        }
    }

    /**
     * Cancela un ajuste masivo
     */
    async cancelarAjusteMasivo(id: Id): Promise<void> {
        try {
            return new Promise((resolve, reject) => {
                router.delete(`${this.getAjustesMasivosUrl()}/${id}`, {
                    onSuccess: () => {
                        resolve();
                    },
                    onError: (errors: any) => {
                        reject(new Error(errors.message || 'Error canceling bulk adjustment'));
                    },
                });
            });
        } catch (error) {
            console.error(`Error canceling bulk adjustment ${id}:`, error);
            throw error;
        }
    }

    /**
     * Crea un ajuste individual (Implementation requerida en BE)
     */
    async crear(datos: any): Promise<AjusteMasivoHistorico> {
        try {
            return new Promise((resolve, reject) => {
                router.post(`${this.getAjustesUrl()}`, datos, {
                    onSuccess: (props: any) => {
                        resolve(props.ajuste);
                    },
                    onError: (errors: any) => {
                        reject(new Error(errors.message || 'Error creating adjustment'));
                    },
                });
            });
        } catch (error) {
            console.error('Error creating adjustment:', error);
            throw error;
        }
    }

    /**
     * Obtiene un ajuste individual
     */
    async obtener(id: Id): Promise<AjusteMasivoHistorico> {
        try {
            return this.obtenerAjusteMasivo(id);
        } catch (error) {
            console.error(`Error fetching adjustment ${id}:`, error);
            throw error;
        }
    }

    /**
     * Lista ajustes (Implementation requerida en BE)
     */
    async listar(filtros?: any): Promise<AjusteMasivoHistorico[]> {
        try {
            const resultado = await this.obtenerAjustesMasivos(1, filtros);
            return resultado.data;
        } catch (error) {
            console.error('Error listing adjustments:', error);
            throw error;
        }
    }

    /**
     * Actualiza un ajuste (Implementation requerida en BE)
     */
    async actualizar(id: Id, datos: any): Promise<AjusteMasivoHistorico> {
        try {
            return new Promise((resolve, reject) => {
                router.put(`${this.getAjustesUrl()}/${id}`, datos, {
                    onSuccess: (props: any) => {
                        resolve(props.ajuste);
                    },
                    onError: (errors: any) => {
                        reject(new Error(errors.message || 'Error updating adjustment'));
                    },
                });
            });
        } catch (error) {
            console.error(`Error updating adjustment ${id}:`, error);
            throw error;
        }
    }

    /**
     * Elimina un ajuste (Implementation requerida en BE)
     */
    async eliminar(id: Id): Promise<void> {
        try {
            return new Promise((resolve, reject) => {
                router.delete(`${this.getAjustesUrl()}/${id}`, {
                    onSuccess: () => {
                        resolve();
                    },
                    onError: (errors: any) => {
                        reject(new Error(errors.message || 'Error deleting adjustment'));
                    },
                });
            });
        } catch (error) {
            console.error(`Error deleting adjustment ${id}:`, error);
            throw error;
        }
    }

    /**
     * Exporta ajustes a CSV
     */
    async exportarAjustes(filtros?: FiltrosAjustesMasivos): Promise<Blob> {
        try {
            const params = new URLSearchParams({
                ...Object.entries(filtros || {}).reduce((acc, [key, value]) => {
                    if (value !== undefined && value !== null) {
                        acc[key] = String(value);
                    }
                    return acc;
                }, {} as Record<string, string>),
            });

            const response = await fetch(`${this.getAjustesMasivosUrl()}/exportar?${params}`);
            if (!response.ok) throw new Error('Error exporting adjustments');
            return await response.blob();
        } catch (error) {
            console.error('Error exporting adjustments:', error);
            throw error;
        }
    }

    /**
     * URL para aprobar/procesar ajuste masivo
     */
    private getProcesarUrl = (id: Id): string => `${this.getAjustesMasivosUrl()}/${id}/procesar`;
}

export default new AjustesService();
