/**
 * Filter Service
 *
 * Abstracts filter navigation and API calls for list pages.
 * Separates router concerns from business logic (Application Layer)
 *
 * This service handles:
 * - URL navigation with filter parameters
 * - Query string building
 * - Router configuration (preserveState, replace, etc.)
 */

import { router } from '@inertiajs/react';
import type { Filters } from '@/domain/entities/shared';

export interface FilterOptions {
    preserveState?: boolean;
    preserveScroll?: boolean;
    replace?: boolean;
    only?: string[];
}

export interface ProformaFilterParams extends Filters {
    estado?: string;
    search?: string;
    solo_vencidas?: string;
    page?: number;
}

export interface EnvioFilterParams extends Filters {
    estado?: string;
    search?: string;
    page?: number;
}

/**
 * FilterService: Centraliza la lógica de navegación y filtros
 *
 * Responsabilidades:
 * - Navegar a rutas con parámetros de filtro
 * - Construir query strings
 * - Manejar la configuración del router
 */
export class FilterService {
    /**
     * Navegar al dashboard de logística con filtros de proformas
     */
    static navigateProformaFilters(params: ProformaFilterParams, options: FilterOptions = {}): void {
        const {
            preserveState = true,
            preserveScroll = true,
            replace = true,
            only = ['proformasRecientes'],
        } = options;

        const cleanParams = this.cleanFilters(params);

        router.get('/logistica/dashboard', cleanParams, {
            preserveState,
            preserveScroll,
            replace,
            only,
        });
    }

    /**
     * Navegar a entregas asignadas con filtros
     */
    static navigateEntregasAsignadas(params: EnvioFilterParams, options: FilterOptions = {}): void {
        const {
            preserveState = true,
            preserveScroll = true,
            replace = true,
        } = options;

        const cleanParams = this.cleanFilters(params);

        router.get('/logistica/entregas-asignadas', cleanParams, {
            preserveState,
            preserveScroll,
            replace,
        });
    }

    /**
     * Navegar a entregas en tránsito con filtros
     */
    static navigateEntregasEnTransito(params: EnvioFilterParams, options: FilterOptions = {}): void {
        const {
            preserveState = true,
            preserveScroll = true,
            replace = true,
        } = options;

        const cleanParams = this.cleanFilters(params);

        router.get('/logistica/entregas-en-transito', cleanParams, {
            preserveState,
            preserveScroll,
            replace,
        });
    }

    /**
     * Limpiar filtros, removiendo valores vacíos
     */
    private static cleanFilters(filters: any): any {
        return Object.fromEntries(
            Object.entries(filters).filter(([, value]) =>
                value !== '' && value != null && value !== undefined
            )
        );
    }

    /**
     * Construir URL con parámetros de filtro
     */
    static buildFilterUrl(baseUrl: string, params: any): string {
        const cleanParams = this.cleanFilters(params);
        const queryString = new URLSearchParams(
            Object.entries(cleanParams).map(([k, v]) => [k, String(v)])
        ).toString();

        return queryString ? `${baseUrl}?${queryString}` : baseUrl;
    }
}

// Export singleton instance
export default FilterService;
