/**
 * Servicio API para Estados Logísticos Centralizados
 *
 * Consume los endpoints de la API Laravel para obtener,
 * validar y gestionar estados logísticos centralizados.
 *
 * Endpoints:
 * - GET  /api/estados/categorias
 * - GET  /api/estados/{categoria}
 * - GET  /api/estados/{categoria}/{codigo}
 * - GET  /api/estados/{categoria}/transiciones-disponibles
 * - GET  /api/mapeos/{categoria}/destino/{categDestino}
 *
 * @module infrastructure/services/estados-api.service
 */

import { httpClient } from './http-client';
import type {
    CategoriaEstado,
    Estado,
    EstadosCategoriaResponse,
    ValidarTransicionResponse,
} from '@/domain/entities/estados-centralizados';

/**
 * Respuesta de la API para obtener categorías
 */
interface CategoriasResponse {
    data: Array<{ codigo: CategoriaEstado; nombre: string }>;
}

/**
 * Respuesta de la API para obtener mapeos entre categorías
 */
interface MapeoResponse {
    data: {
        estado_origen: string;
        estado_destino: string;
        categoria_origen: CategoriaEstado;
        categoria_destino: CategoriaEstado;
    };
}

/**
 * Servicio para consumir API de estados logísticos
 */
export class EstadosApiService {
    private baseUrl = '/estados';
    private mapeosUrl = '/mapeos';

    /**
     * Obtiene todas las categorías disponibles
     * @returns Array de códigos de categorías
     */
    async getCategorias(): Promise<CategoriaEstado[]> {
        try {
            console.log('[EstadosApiService] Fetching categorias...');

            const response = await httpClient.get<CategoriasResponse>(
                `${this.baseUrl}/categorias`,
                {
                    skipErrorNotification: true,
                }
            );

            const categorias = response.data.map(
                (c) => c.codigo as CategoriaEstado
            );

            console.log(`[EstadosApiService] Found ${categorias.length} categorias`);
            return categorias;
        } catch (error) {
            console.error('[EstadosApiService] Error fetching categorias:', error);
            throw error;
        }
    }

    /**
     * Obtiene todos los estados de una categoría específica
     * @param categoria - Categoría de estados a obtener
     * @returns Array de estados
     */
    async getEstadosPorCategoria(
        categoria: CategoriaEstado
    ): Promise<Estado[]> {
        try {
            console.log(
                `[EstadosApiService] Fetching estados for category: ${categoria}`
            );

            const response = await httpClient.get<EstadosCategoriaResponse>(
                `${this.baseUrl}/${categoria}`,
                {
                    skipErrorNotification: true,
                }
            );

            console.log(
                `[EstadosApiService] Retrieved ${response.data.length} estados for ${categoria}`
            );

            return response.data;
        } catch (error) {
            console.error(
                `[EstadosApiService] Error fetching estados for ${categoria}:`,
                error
            );
            throw error;
        }
    }

    /**
     * Obtiene un estado específico por su código
     * @param categoria - Categoría del estado
     * @param codigo - Código único del estado
     * @returns Estado encontrado
     */
    async getEstadoPorCodigo(
        categoria: CategoriaEstado,
        codigo: string
    ): Promise<Estado> {
        try {
            console.log(
                `[EstadosApiService] Fetching estado ${codigo} from ${categoria}`
            );

            const response = await httpClient.get<Estado>(
                `${this.baseUrl}/${categoria}/${codigo}`,
                {
                    skipErrorNotification: true,
                }
            );

            console.log(
                `[EstadosApiService] Estado ${codigo} retrieved successfully`
            );
            return response;
        } catch (error) {
            console.error(
                `[EstadosApiService] Error fetching estado ${codigo}:`,
                error
            );
            throw error;
        }
    }

    /**
     * Obtiene las transiciones disponibles para un estado
     * @param categoria - Categoría del estado actual
     * @param estadoActual - Código del estado actual
     * @returns Array de códigos de estados a los que se puede transicionar
     */
    async getTransicionesDisponibles(
        categoria: CategoriaEstado,
        estadoActual: string
    ): Promise<string[]> {
        try {
            console.log(
                `[EstadosApiService] Fetching available transitions from ${estadoActual}`
            );

            const response = await httpClient.get<{ data: string[] }>(
                `${this.baseUrl}/${categoria}/${estadoActual}/transiciones-disponibles`,
                {
                    skipErrorNotification: true,
                }
            );

            return response.data;
        } catch (error) {
            console.error(
                '[EstadosApiService] Error fetching transitions:',
                error
            );
            throw error;
        }
    }

    /**
     * Obtiene el mapeo (equivalente) de un estado en otra categoría
     * Por ejemplo: 'ENTREGADA' en 'entrega' → 'COMPLETADA' en 'venta_logistica'
     *
     * @param categoriaOrigen - Categoría del estado original
     * @param estadoOrigen - Código del estado original
     * @param categDestino - Categoría destino para el mapeo
     * @returns Estado equivalente en la categoría destino
     */
    async obtenerMapeo(
        categoriaOrigen: CategoriaEstado,
        estadoOrigen: string,
        categDestino: CategoriaEstado
    ): Promise<string | null> {
        try {
            console.log(
                `[EstadosApiService] Fetching mapeo from ${categoriaOrigen}.${estadoOrigen} to ${categDestino}`
            );

            const response = await httpClient.get<MapeoResponse>(
                `${this.mapeosUrl}/${categoriaOrigen}/${estadoOrigen}/destino/${categDestino}`,
                {
                    skipErrorNotification: true,
                }
            );

            const estadoDestino = response.data.estado_destino;

            console.log(
                `[EstadosApiService] Mapeo found: ${estadoOrigen} → ${estadoDestino}`
            );
            return estadoDestino;
        } catch (error) {
            console.error('[EstadosApiService] Error fetching mapeo:', error);
            // No es un error crítico si el mapeo no existe
            return null;
        }
    }

    /**
     * Busca estados por término de búsqueda
     * Busca en nombre y descripción
     *
     * @param termino - Término de búsqueda
     * @param categoria - Opcional: filtrar por categoría específica
     * @returns Array de estados que coinciden
     */
    async buscar(
        termino: string,
        categoria?: CategoriaEstado
    ): Promise<Estado[]> {
        try {
            const params = new URLSearchParams();
            params.append('q', termino);

            if (categoria) {
                params.append('categoria', categoria);
            }

            console.log(
                `[EstadosApiService] Searching: "${termino}"${
                    categoria ? ` in ${categoria}` : ''
                }`
            );

            const response = await httpClient.get<Estado[]>(
                `${this.baseUrl}/buscar?${params.toString()}`,
                {
                    skipErrorNotification: true,
                }
            );

            console.log(
                `[EstadosApiService] Found ${response.length} results`
            );
            return response;
        } catch (error) {
            console.error('[EstadosApiService] Error searching:', error);
            throw error;
        }
    }

    /**
     * Obtiene todos los estados de todas las categorías en una sola llamada
     * Realiza peticiones en paralelo para optimizar rendimiento
     *
     * @returns Objeto con estados organizados por categoría
     */
    async getAllEstados(): Promise<Partial<Record<CategoriaEstado, Estado[]>>> {
        try {
            console.log('[EstadosApiService] Fetching all estados...');

            const categorias = await this.getCategorias();
            const result: Partial<Record<CategoriaEstado, Estado[]>> = {};

            // Fetch en paralelo para optimizar rendimiento
            const promesas = categorias.map(async (categoria) => {
                try {
                    const estados = await this.getEstadosPorCategoria(
                        categoria
                    );
                    result[categoria] = estados;

                    console.log(
                        `[EstadosApiService] ✅ ${categoria}: ${estados.length} estados`
                    );
                } catch (error) {
                    console.error(
                        `[EstadosApiService] ❌ Failed to fetch ${categoria}:`,
                        error
                    );
                    result[categoria] = [];
                }
            });

            await Promise.all(promesas);

            const totalEstados = Object.values(result).reduce(
                (sum, estados) => sum + (estados?.length || 0),
                0
            );

            console.log(
                `[EstadosApiService] ✅ All estados loaded: ${totalEstados} total`
            );
            return result;
        } catch (error) {
            console.error('[EstadosApiService] Error fetching all estados:', error);
            throw error;
        }
    }

    /**
     * Valida si es posible hacer una transición de estado
     * @param categoria - Categoría del estado
     * @param estadoActual - Estado actual
     * @param estadoDestino - Estado destino propuesto
     * @returns true si la transición es válida
     */
    async validarTransicion(
        categoria: CategoriaEstado,
        estadoActual: string,
        estadoDestino: string
    ): Promise<boolean> {
        try {
            const transiciones = await this.getTransicionesDisponibles(
                categoria,
                estadoActual
            );

            return transiciones.includes(estadoDestino);
        } catch (error) {
            console.error('[EstadosApiService] Error validating transition:', error);
            return false;
        }
    }

    /**
     * Obtiene el cliente HTTP subyacente (para casos especiales)
     * @returns Instancia de HttpClient
     */
    getHttpClient() {
        return httpClient;
    }
}

/**
 * Instancia singleton del servicio
 */
export const estadosApiService = new EstadosApiService();

/**
 * Export por defecto para mayor conveniencia
 */
export default estadosApiService;
