import { useMemo } from 'react';
import type { ModuloSidebar, FiltrosModulo } from '@/domain/entities/admin-permisos';

/**
 * INFRASTRUCTURE LAYER - Hooks de Transformación de Datos para Módulos
 *
 * Estos hooks encapsulan la lógica de transformación y filtrado de datos.
 * Son funciones puras que no tienen efectos secundarios ni llamadas a API.
 *
 * Utilizan useMemo para optimizar el rendimiento y evitar recálculos innecesarios.
 *
 * NOTA: Estos hooks se diferencian de los servicios en que:
 * - Hooks: Lógica pura de transformación de datos (sin side effects)
 * - Servicios: Lógica de negocio con efectos secundarios (llamadas a API)
 */

/**
 * Hook para filtrar módulos según criterios especificados
 * @param modulos - Array de módulos a filtrar
 * @param filtros - Criterios de filtrado
 * @returns Array de módulos filtrados
 */
export function useFiltrarModulos(modulos: ModuloSidebar[], filtros: FiltrosModulo): ModuloSidebar[] {
    return useMemo(() => {
        return modulos.filter(modulo => {
            // Filtro por búsqueda (título o ruta)
            if (filtros.busqueda) {
                const busquedaLower = filtros.busqueda.toLowerCase();
                if (
                    !modulo.titulo.toLowerCase().includes(busquedaLower) &&
                    !modulo.ruta.toLowerCase().includes(busquedaLower)
                ) {
                    return false;
                }
            }

            // Filtro por tipo
            if (filtros.tipo !== 'todos') {
                if (filtros.tipo === 'principal' && modulo.es_submenu) {
                    return false;
                }
                if (filtros.tipo === 'submenu' && !modulo.es_submenu) {
                    return false;
                }
            }

            // Filtro por estado
            if (filtros.estado !== 'todos') {
                if (filtros.estado === 'activo' && !modulo.activo) {
                    return false;
                }
                if (filtros.estado === 'inactivo' && modulo.activo) {
                    return false;
                }
            }

            // Filtro por categoría
            if (filtros.categoria) {
                if (modulo.categoria !== filtros.categoria) {
                    return false;
                }
            }

            // Filtro por rol requerido
            if (filtros.rolRequerido) {
                const permisos = Array.isArray(modulo.permisos) ? modulo.permisos : [];
                if (!permisos.includes(filtros.rolRequerido)) {
                    return false;
                }
            }

            return true;
        });
    }, [modulos, filtros]);
}

/**
 * Hook para extraer datos únicos de los módulos
 * @param modulos - Array de módulos
 * @returns Objeto con categorías y roles disponibles
 */
export function useExtraerDatos(modulos: ModuloSidebar[]) {
    const categorias = useMemo(() => {
        return Array.from(
            new Set(modulos.filter(m => m.categoria).map(m => m.categoria as string))
        ).sort();
    }, [modulos]);

    const rolesDisponibles = useMemo(() => {
        return Array.from(
            new Set(
                modulos
                    .flatMap(m => m.permisos || [])
                    .filter(p => typeof p === 'string')
            )
        ).sort();
    }, [modulos]);

    return { categorias, rolesDisponibles };
}

/**
 * Hook para obtener módulos padre (no submenús)
 * @param modulos - Array de módulos
 * @returns Array de módulos padre
 */
export function useModulosPadre(modulos: ModuloSidebar[]): ModuloSidebar[] {
    return useMemo(() => {
        return modulos.filter(m => !m.es_submenu);
    }, [modulos]);
}
