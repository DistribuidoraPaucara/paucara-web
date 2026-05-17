/**
 * Servicio de Precios
 * Maneja todas las operaciones relacionadas con precios de productos
 */

import type { PrecioProducto, FiltrosPrecio, PreciosListaResponse, HistorialPrecio } from '@/domain/entities/precios';

export class PreciosService {
    private readonly baseUrl = '/api/precios';

    /**
     * Obtiene el token CSRF del documento
     */
    private getCsrfToken(): string {
        const meta = document.querySelector('meta[name="csrf-token"]');
        return meta?.getAttribute('content') || '';
    }

    /**
     * Obtener lista de precios con filtros y paginación
     */
    async obtenerListaPrecios(filtros?: FiltrosPrecio, page: number = 1): Promise<PreciosListaResponse> {
        try {
            const params = new URLSearchParams();
            if (filtros?.q) params.append('q', filtros.q);
            if (filtros?.tipo_precio_id) params.append('tipo_precio_id', String(filtros.tipo_precio_id));
            if (filtros?.ordenar_por) params.append('ordenar_por', filtros.ordenar_por);
            if (filtros?.per_page) params.append('per_page', String(filtros.per_page));
            params.append('page', String(page));

            const queryString = params.toString();
            const url = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': this.getCsrfToken(),
                },
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error al obtener lista de precios:', error);
            throw error;
        }
    }

    /**
     * Obtener precios de un producto específico
     */
    async obtenerPreciosProducto(productoId: number | string): Promise<PrecioProducto[]> {
        try {
            const response = await fetch(`${this.baseUrl}/producto/${productoId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': this.getCsrfToken(),
                },
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return data.precios;
        } catch (error) {
            console.error('Error al obtener precios del producto:', error);
            throw error;
        }
    }

    /**
     * Obtener historial de cambios de un precio
     */
    async obtenerHistorialPrecio(precioId: number | string): Promise<HistorialPrecio[]> {
        try {
            const response = await fetch(`${this.baseUrl}/${precioId}/historial`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': this.getCsrfToken(),
                },
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return data.historial;
        } catch (error) {
            console.error('Error al obtener historial de precio:', error);
            throw error;
        }
    }

    /**
     * Actualizar precio
     */
    async actualizarPrecio(
        precioId: number | string,
        precioNuevo: number,
        motivo: string
    ): Promise<{ success: boolean; message: string; precio: PrecioProducto }> {
        try {
            const response = await fetch(`${this.baseUrl}/${precioId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': this.getCsrfToken(),
                },
                body: JSON.stringify({
                    precio_nuevo: precioNuevo,
                    motivo: motivo,
                }),
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error al actualizar precio:', error);
            throw error;
        }
    }

    /**
     * Obtener cambios recientes de precios
     */
    async obtenerCambiosRecientes(dias: number = 7): Promise<HistorialPrecio[]> {
        try {
            const response = await fetch(`${this.baseUrl}/resumen/cambios-recientes?dias=${dias}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': this.getCsrfToken(),
                },
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return data.cambios;
        } catch (error) {
            console.error('Error al obtener cambios recientes:', error);
            throw error;
        }
    }

    /**
     * Obtener resumen de precios
     */
    async obtenerResumen(): Promise<{
        total_cambios_7dias: number;
        cambios_recientes: HistorialPrecio[];
        productos_alerta: any[];
    }> {
        try {
            const response = await fetch(`${this.baseUrl}/resumen`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': this.getCsrfToken(),
                },
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error al obtener resumen de precios:', error);
            throw error;
        }
    }

    /**
     * Obtener compras donde el precio de COSTO es diferente al registrado
     */
    async obtenerComprasConDiferenciaCosto(productoId: number | string): Promise<any> {
        try {
            const response = await fetch(`${this.baseUrl}/producto/${productoId}/compras-diferencia-costo`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': this.getCsrfToken(),
                },
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error al obtener compras con diferencia de costo:', error);
            throw error;
        }
    }

    /**
     * Actualizar múltiples precios en lote
     */
    async actualizarLote(precios: Array<{
        precio_id: number;
        precio_nuevo: number;
        porcentaje_ganancia?: number;
        motivo: string;
    }>): Promise<{
        success: boolean;
        message: string;
        actualizados: number[];
        errores: any[];
    }> {
        try {
            const payload = { precios };

            console.log('🚀 Iniciando petición POST a:', `${this.baseUrl}/actualizar-lote`);
            console.log('📦 Payload enviado:', JSON.stringify(payload, null, 2));

            const response = await fetch(`${this.baseUrl}/actualizar-lote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': this.getCsrfToken(),
                },
                body: JSON.stringify(payload),
            });

            console.log('📊 Response Status:', response.status, response.statusText);

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const resultado = await response.json();
            console.log('✅ Respuesta del backend:', resultado);

            return resultado;
        } catch (error) {
            console.error('❌ Error al actualizar precios en lote:', error);
            throw error;
        }
    }
}

// Instancia única del servicio
export const preciosService = new PreciosService();
