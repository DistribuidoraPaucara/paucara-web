/**
 * Hook especializado para estados de ENTREGAS
 *
 * Proporciona acceso a los estados de entregas con fallbacks
 * y utilidades específicas para la gestión de entregas.
 *
 * Estados disponibles:
 * - PROGRAMADA
 * - EN_PREPARACION
 * - EN_TRANSITO
 * - ENTREGADA
 * - CANCELADA
 *
 * @module application/hooks/use-estados-entregas
 */

import { useMemo } from 'react';
import { useEstados } from './use-estados';
import { FALLBACK_ESTADOS_ENTREGA } from '@/domain/entities/estados-centralizados';
import type { Estado } from '@/domain/entities/estados-centralizados';

/**
 * Variant types para badges de estado
 */
type BadgeVariant = 'default' | 'destructive' | 'secondary' | 'outline';

/**
 * Hook para acceder a estados de entregas
 *
 * @returns Hook return con estados de entregas
 *
 * @example
 * const { estados, getEstadoLabel } = useEstadosEntregas();
 * const label = getEstadoLabel('ENTREGADA'); // → 'Entregada'
 */
export function useEstadosEntregas() {
    return useEstados('entrega', {
        fallback: FALLBACK_ESTADOS_ENTREGA,
        onlyActive: true,
    });
}

/**
 * Hook para obtener información de badge de estado de entrega
 *
 * Mapea un código de estado a label y variant para mostrar en un badge UI.
 *
 * @returns Función que mapea código a badge info
 *
 * @example
 * const getBadgeInfo = useEntregaEstadoBadge();
 * const { label, variant } = getBadgeInfo('ENTREGADA');
 * // → { label: 'Entregada', variant: 'default' }
 */
export function useEntregaEstadoBadge() {
    const { getEstadoPorCodigo } = useEstadosEntregas();

    return useMemo(
        () => (codigo: string): { label: string; variant: BadgeVariant } => {
            const estado = getEstadoPorCodigo(codigo);

            if (!estado) {
                return { label: 'Desconocido', variant: 'secondary' };
            }

            // Mapear código a variant
            let variant: BadgeVariant = 'default';

            // Estados finales destructivos
            if (['CANCELADA'].includes(codigo)) {
                variant = 'destructive';
            }
            // Estados en progreso
            else if (
                [
                    'PROGRAMADA',
                    'EN_PREPARACION',
                    'EN_TRANSITO',
                ].includes(codigo)
            ) {
                variant = 'outline';
            }
            // Estados completados positivos
            else if (['ENTREGADA'].includes(codigo)) {
                variant = 'default';
            }

            return { label: estado.nombre, variant };
        },
        [getEstadoPorCodigo]
    );
}

/**
 * Hook para obtener estados válidos según flujo de entrega
 *
 * Retorna los estados en el orden correcto del flujo de una entrega.
 *
 * @returns Array de estados en orden de flujo
 *
 * @example
 * const flujoEstados = useEntregaFlujoEstados();
 * // → [{ codigo: 'PROGRAMADA', ... }, { codigo: 'EN_PREPARACION', ... }, ...]
 */
export function useEntregaFlujoEstados(): Estado[] {
    const { estados } = useEstadosEntregas();

    return useMemo(() => {
        // Ordenar por campo 'orden' si existe, si no por índice
        return [...estados].sort((a, b) => a.orden - b.orden);
    }, [estados]);
}

/**
 * Hook para verificar si un estado de entrega es transitable
 *
 * @returns Función que verifica si se puede hacer una transición
 *
 * @example
 * const canTransition = useEntregaCanTransition();
 * if (canTransition('EN_TRANSITO', 'ENTREGADA')) {
 *   // Transición permitida
 * }
 */
export function useEntregaCanTransition() {
    const { getEstadoPorCodigo } = useEstadosEntregas();

    return useMemo(
        () => (estadoActual: string, estadoDestino: string): boolean => {
            const actual = getEstadoPorCodigo(estadoActual);
            const destino = getEstadoPorCodigo(estadoDestino);

            if (!actual || !destino) {
                return false;
            }

            // No se puede transicionar desde estado final
            if (actual.es_estado_final && estadoActual !== estadoDestino) {
                return false;
            }

            // El orden debe ser ascendente o igual (para reintento)
            return destino.orden >= actual.orden;
        },
        [getEstadoPorCodigo]
    );
}
