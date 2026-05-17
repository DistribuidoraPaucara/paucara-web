/**
 * Utilidad de Cache en localStorage para Estados Logísticos
 *
 * Implementa un sistema de cache con TTL (Time To Live)
 * para almacenar estados localmente y reducir llamadas a API.
 *
 * TTL por defecto: 7 días (604,800,000 ms)
 *
 * @module infrastructure/utils/estados-cache
 */

import type {
    CategoriaEstado,
    Estado,
    EstadosCache,
} from '@/domain/entities/estados-centralizados';

/**
 * Clave para acceder al cache en localStorage
 */
const CACHE_KEY = 'paucara_estados_logistica_cache';

/**
 * TTL por defecto: 7 días en milisegundos
 */
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Verifica si el cache en localStorage es válido (no ha expirado)
 * @returns true si existe cache y es válido, false en caso contrario
 */
export function isCacheValid(): boolean {
    try {
        const cached = localStorage.getItem(CACHE_KEY);

        if (!cached) {
            console.log('[EstadosCache] Cache miss: no data in localStorage');
            return false;
        }

        const cache: EstadosCache = JSON.parse(cached);
        const now = Date.now();
        const isValid = now < cache.timestamp + cache.ttl;

        if (!isValid) {
            console.log('[EstadosCache] Cache expired');
            clearEstadosCache();
            return false;
        }

        console.log('[EstadosCache] Cache hit: valid cache found');
        return true;
    } catch (error) {
        console.error('[EstadosCache] Error checking cache validity:', error);
        return false;
    }
}

/**
 * Obtiene estados cacheados de una categoría específica
 * @param categoria - Categoría de estados a recuperar
 * @returns Array de estados o null si no está cacheado o el cache no es válido
 */
export function getCachedEstados(
    categoria: CategoriaEstado
): Estado[] | null {
    try {
        if (!isCacheValid()) {
            return null;
        }

        const cached = localStorage.getItem(CACHE_KEY);
        if (!cached) {
            return null;
        }

        const cache: EstadosCache = JSON.parse(cached);
        const estados = cache.categorias[categoria];

        if (!estados || estados.length === 0) {
            console.log(
                `[EstadosCache] No cached data for category: ${categoria}`
            );
            return null;
        }

        console.log(
            `[EstadosCache] Retrieved ${estados.length} estados for ${categoria}`
        );
        return estados;
    } catch (error) {
        console.error('[EstadosCache] Error getting cached estados:', error);
        return null;
    }
}

/**
 * Obtiene todos los estados cacheados de todas las categorías
 * @returns Objeto con estados por categoría, o null si el cache no es válido
 */
export function getAllCachedEstados(): Partial<
    Record<CategoriaEstado, Estado[]>
> | null {
    try {
        if (!isCacheValid()) {
            return null;
        }

        const cached = localStorage.getItem(CACHE_KEY);
        if (!cached) {
            return null;
        }

        const cache: EstadosCache = JSON.parse(cached);
        const categoriaKeys = Object.keys(cache.categorias);

        console.log(
            `[EstadosCache] Retrieved all cached datos: ${categoriaKeys.length} categories`
        );
        return cache.categorias;
    } catch (error) {
        console.error('[EstadosCache] Error getting all cached estados:', error);
        return null;
    }
}

/**
 * Actualiza el cache con nuevos estados para una categoría
 * Si ya existe cache válido, solo actualiza la categoría especificada
 * Si no existe cache o ha expirado, crea uno nuevo
 *
 * @param categoria - Categoría de estados a actualizar
 * @param estados - Array de estados para cachear
 */
export function updateCachedEstados(
    categoria: CategoriaEstado,
    estados: Estado[]
): void {
    try {
        let cache: EstadosCache;
        const existing = localStorage.getItem(CACHE_KEY);

        if (existing && isCacheValid()) {
            // Usar cache existente y actualizar solo esta categoría
            cache = JSON.parse(existing);
            cache.categorias[categoria] = estados;

            console.log(
                `[EstadosCache] Updated category ${categoria} in existing cache`
            );
        } else {
            // Crear cache nuevo
            cache = {
                categorias: {
                    [categoria]: estados,
                },
                timestamp: Date.now(),
                ttl: CACHE_TTL_MS,
            };

            console.log(
                `[EstadosCache] Created new cache with category ${categoria}`
            );
        }

        localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
        console.log(
            `[EstadosCache] Cache updated for ${categoria} (${estados.length} estados)`
        );
    } catch (error) {
        console.error('[EstadosCache] Error updating cache:', error);
    }
}

/**
 * Actualiza el cache con múltiples categorías a la vez
 * Más eficiente que llamar updateCachedEstados() múltiples veces
 *
 * @param estatusByCategoria - Objeto con categoría como clave y array de estados como valor
 */
export function updateMultipleCachedEstados(
    estatusByCategoria: Partial<Record<CategoriaEstado, Estado[]>>
): void {
    try {
        const cache: EstadosCache = {
            categorias: estatusByCategoria,
            timestamp: Date.now(),
            ttl: CACHE_TTL_MS,
        };

        localStorage.setItem(CACHE_KEY, JSON.stringify(cache));

        const categoriaCount = Object.keys(estatusByCategoria).length;
        console.log(
            `[EstadosCache] Updated cache with ${categoriaCount} categories`
        );
    } catch (error) {
        console.error('[EstadosCache] Error updating multiple cached estados:', error);
    }
}

/**
 * Limpia completamente el cache de estados
 */
export function clearEstadosCache(): void {
    try {
        localStorage.removeItem(CACHE_KEY);
        console.log('[EstadosCache] Cache cleared');
    } catch (error) {
        console.error('[EstadosCache] Error clearing cache:', error);
    }
}

/**
 * Obtiene estadísticas sobre el cache actual
 * @returns Objeto con información del estado del cache
 */
export function getCacheStats(): {
    isValid: boolean;
    timestamp: number | null;
    expiresAt: number | null;
    categorias: number;
    totalEstados: number;
    hoursRemaining: number | null;
} {
    try {
        const cached = localStorage.getItem(CACHE_KEY);

        if (!cached) {
            return {
                isValid: false,
                timestamp: null,
                expiresAt: null,
                categorias: 0,
                totalEstados: 0,
                hoursRemaining: null,
            };
        }

        const cache: EstadosCache = JSON.parse(cached);
        const now = Date.now();
        const expiresAt = cache.timestamp + cache.ttl;
        const isValid = now < expiresAt;
        const hoursRemaining = isValid
            ? Math.floor((expiresAt - now) / (1000 * 60 * 60))
            : null;

        const categoriaCount = Object.keys(cache.categorias).length;
        const totalEstados = Object.values(cache.categorias).reduce(
            (sum: number, estados: any) => sum + (Array.isArray(estados) ? estados.length : 0),
            0
        );

        return {
            isValid,
            timestamp: cache.timestamp,
            expiresAt,
            categorias: categoriaCount,
            totalEstados,
            hoursRemaining,
        };
    } catch (error) {
        console.error('[EstadosCache] Error getting cache stats:', error);
        return {
            isValid: false,
            timestamp: null,
            expiresAt: null,
            categorias: 0,
            totalEstados: 0,
            hoursRemaining: null,
        };
    }
}

/**
 * Formatea las estadísticas del cache para logging
 * @returns String con estadísticas formateadas
 */
export function getCacheSummary(): string {
    const stats = getCacheStats();

    if (!stats.isValid) {
        return '⚠️  Cache inválido o vacío';
    }

    const date = new Date(stats.timestamp || Date.now());
    return (
        `✅ Cache válido | ` +
        `${stats.totalEstados} estados en ${stats.categorias} categorías | ` +
        `Expira en ${stats.hoursRemaining} horas | ` +
        `Timestamp: ${date.toLocaleString()}`
    );
}
