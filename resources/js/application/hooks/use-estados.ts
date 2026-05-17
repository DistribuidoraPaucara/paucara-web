/**
 * Hook genérico para acceder a estados de cualquier categoría
 *
 * Proporciona acceso a estados con fallback automático,
 * filtrado por activos, y utilidades para acceder a datos.
 *
 * Uso:
 * const { estados, getEstadoLabel, getEstadoColor } = useEstados('entrega');
 * const estado = getEstadoPorCodigo('ENTREGADA');
 *
 * @module application/hooks/use-estados
 */

import { useMemo } from 'react';
import { useEstadosContext } from '@/application/contexts/EstadosContext';
import type {
    CategoriaEstado,
    Estado,
    UseEstadosOptions,
    UseEstadosReturn,
} from '@/domain/entities/estados-centralizados';

/**
 * Hook para acceder a estados de una categoría específica
 *
 * @param categoria - Categoría de estados a obtener
 * @param options - Opciones del hook (fallback, filtros, etc.)
 * @returns Objeto con estados y utilidades
 *
 * @example
 * const { estados, getEstadoLabel, isEstadoFinal } = useEstados('entrega');
 * const label = getEstadoLabel('ENTREGADA'); // → 'Entregada'
 */
export function useEstados(
    categoria: CategoriaEstado,
    options: UseEstadosOptions = {}
): UseEstadosReturn {
    const { estados: allEstados, isLoading, error, getEstadosPorCategoria } =
        useEstadosContext();
    const { fallback = [], onlyActive = false } = options;

    /**
     * Estados para esta categoría, con fallback si es necesario
     */
    const estados = useMemo(() => {
        const categEstados = getEstadosPorCategoria(categoria);

        // Si no hay estados y tenemos fallback, usar fallback
        if (categEstados.length === 0 && fallback.length > 0) {
            console.warn(
                `[useEstados] No estados for ${categoria}, using fallback (${fallback.length} items)`
            );
            return fallback;
        }

        // Filtrar solo activos si se especifica
        if (onlyActive) {
            return categEstados.filter((e) => {
                // Asumir que está activo si no tiene propiedad 'activo'
                const activo = (e as any).activo !== false;
                return activo;
            });
        }

        return categEstados;
    }, [categoria, getEstadosPorCategoria, fallback, onlyActive]);

    /**
     * Obtiene un estado por su código
     */
    const getEstadoPorCodigo = useMemo(
        () => (codigo: string): Estado | undefined => {
            return estados.find((e) => e.codigo === codigo);
        },
        [estados]
    );

    /**
     * Obtiene el nombre/label de un estado
     */
    const getEstadoLabel = useMemo(
        () => (codigo: string): string => {
            const estado = getEstadoPorCodigo(codigo);
            return estado?.nombre || codigo;
        },
        [getEstadoPorCodigo]
    );

    /**
     * Obtiene el color de un estado
     */
    const getEstadoColor = useMemo(
        () => (codigo: string): string | undefined => {
            const estado = getEstadoPorCodigo(codigo);
            return estado?.color;
        },
        [getEstadoPorCodigo]
    );

    /**
     * Verifica si un estado es final (no permite más transiciones)
     */
    const isEstadoFinal = useMemo(
        () => (codigo: string): boolean => {
            const estado = getEstadoPorCodigo(codigo);
            return estado?.es_estado_final || false;
        },
        [getEstadoPorCodigo]
    );

    return {
        estados,
        isLoading,
        error,
        getEstadoPorCodigo,
        getEstadoLabel,
        getEstadoColor,
        isEstadoFinal,
    };
}

/**
 * Export default para mayor conveniencia
 */
export default useEstados;
