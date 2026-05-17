/**
 * Hook especializado para estados de PROFORMAS
 *
 * Proporciona acceso a los estados de proformas con fallbacks
 * y utilidades específicas para la gestión de proformas.
 *
 * Estados disponibles:
 * - PENDIENTE
 * - APROBADA
 * - RECHAZADA
 * - CONVERTIDA
 * - VENCIDA
 *
 * @module application/hooks/use-estados-proformas
 */

import { useMemo } from 'react';
import { useEstados } from './use-estados';
import { FALLBACK_ESTADOS_PROFORMA } from '@/domain/entities/estados-centralizados';
import type { Estado } from '@/domain/entities/estados-centralizados';

/**
 * Variant types para badges de estado
 */
type BadgeVariant = 'default' | 'destructive' | 'secondary' | 'outline';

/**
 * Hook para acceder a estados de proformas
 *
 * @returns Hook return con estados de proformas
 *
 * @example
 * const { estados, getEstadoLabel } = useEstadosProformas();
 * const label = getEstadoLabel('APROBADA'); // → 'Aprobada'
 */
export function useEstadosProformas() {
    return useEstados('proforma', {
        fallback: FALLBACK_ESTADOS_PROFORMA,
        onlyActive: true,
    });
}

/**
 * Hook para obtener información de badge de estado de proforma
 *
 * Mapea un código de estado a label y variant para mostrar en un badge UI.
 *
 * @returns Función que mapea código a badge info
 *
 * @example
 * const getBadgeInfo = useProformaEstadoBadge();
 * const { label, variant } = getBadgeInfo('RECHAZADA');
 * // → { label: 'Rechazada', variant: 'destructive' }
 */
export function useProformaEstadoBadge() {
    const { getEstadoPorCodigo } = useEstadosProformas();

    return useMemo(
        () => (codigo: string): { label: string; variant: BadgeVariant } => {
            const estado = getEstadoPorCodigo(codigo);

            if (!estado) {
                return { label: 'Desconocido', variant: 'secondary' };
            }

            // Mapear código a variant
            let variant: BadgeVariant = 'default';

            // Estados rechazados/fallidos
            if (['RECHAZADA', 'VENCIDA'].includes(codigo)) {
                variant = 'destructive';
            }
            // Estados en progreso
            else if (['PENDIENTE'].includes(codigo)) {
                variant = 'outline';
            }
            // Estados completados positivos
            else if (['APROBADA', 'CONVERTIDA'].includes(codigo)) {
                variant = 'default';
            }

            return { label: estado.nombre, variant };
        },
        [getEstadoPorCodigo]
    );
}

/**
 * Hook para obtener el estado de una proforma basado en reglas de negocio
 *
 * Determina el estado derivado de una proforma según sus propiedades.
 *
 * @returns Función que calcula el estado
 *
 * @example
 * const getEstadoCalculado = useProformaEstadoCalculado();
 * const estado = getEstadoCalculado({ estado: 'APROBADA', vencida: true });
 * // → 'VENCIDA'
 */
export function useProformaEstadoCalculado() {
    const { getEstadoPorCodigo } = useEstadosProformas();

    return useMemo(
        () => (proforma: { estado: string; fecha_vencimiento?: string }): string => {
            // Si está marcada como vencida
            if (proforma.estado === 'VENCIDA') {
                return 'VENCIDA';
            }

            // Si tiene fecha de vencimiento, verificar si venció
            if (proforma.fecha_vencimiento) {
                const fechaVencimiento = new Date(
                    proforma.fecha_vencimiento
                );
                const ahora = new Date();

                if (ahora > fechaVencimiento) {
                    return 'VENCIDA';
                }
            }

            // Retornar estado actual
            return proforma.estado;
        },
        [getEstadoPorCodigo]
    );
}

/**
 * Hook para obtener estados válidos según flujo de proforma
 *
 * Retorna los estados en el orden correcto del flujo de una proforma.
 *
 * @returns Array de estados en orden de flujo
 *
 * @example
 * const flujoEstados = useProformaFlujoEstados();
 * // → [{ codigo: 'PENDIENTE', ... }, { codigo: 'APROBADA', ... }, ...]
 */
export function useProformaFlujoEstados(): Estado[] {
    const { estados } = useEstadosProformas();

    return useMemo(() => {
        // Ordenar por campo 'orden' si existe
        return [...estados].sort((a, b) => a.orden - b.orden);
    }, [estados]);
}

/**
 * Hook para obtener transiciones permitidas desde un estado
 *
 * Calcula qué estados pueden ser alcanzados desde el estado actual
 * según reglas de negocio.
 *
 * @returns Función que retorna estados destino válidos
 *
 * @example
 * const getTransicionesValidas = useProformaTransicionesValidas();
 * const proximos = getTransicionesValidas('PENDIENTE');
 * // → ['APROBADA', 'RECHAZADA']
 */
export function useProformaTransicionesValidas() {
    const { getEstadoPorCodigo, estados } = useEstadosProformas();

    return useMemo(
        () => (estadoActual: string): string[] => {
            const actual = getEstadoPorCodigo(estadoActual);

            if (!actual) {
                return [];
            }

            // Estados finales no tienen transiciones
            if (actual.es_estado_final) {
                return [];
            }

            // Retornar estados que pueden seguir en orden
            return estados
                .filter((e) => e.orden > actual.orden && !e.es_estado_final)
                .map((e) => e.codigo);
        },
        [getEstadoPorCodigo, estados]
    );
}

/**
 * Hook para verificar si una proforma puede ser aprobada
 *
 * @returns Función que verifica si el estado permite aprobación
 *
 * @example
 * const canApprove = useProformaCanApprove();
 * if (canApprove('PENDIENTE')) {
 *   // Mostrar botón de aprobación
 * }
 */
export function useProformaCanApprove() {
    const { getEstadoPorCodigo } = useEstadosProformas();

    return useMemo(
        () => (estado: string): boolean => {
            // Solo se pueden aprobar proformas pendientes
            return estado === 'PENDIENTE';
        },
        [getEstadoPorCodigo]
    );
}

/**
 * Hook para verificar si una proforma puede ser rechazada
 *
 * @returns Función que verifica si el estado permite rechazo
 *
 * @example
 * const canReject = useProformaCanReject();
 * if (canReject('PENDIENTE')) {
 *   // Mostrar botón de rechazo
 * }
 */
export function useProformaCanReject() {
    const { getEstadoPorCodigo } = useEstadosProformas();

    return useMemo(
        () => (estado: string): boolean => {
            // Solo se pueden rechazar proformas pendientes
            return estado === 'PENDIENTE';
        },
        [getEstadoPorCodigo]
    );
}
