/**
 * Badge de Estado para Proformas
 *
 * Componente con integración completa a estados centralizados (Fase 3.7).
 * Usa hooks dinámicos para obtener datos desde la API.
 * Fallback automático a datos hardcodeados si el hook no está disponible.
 *
 * @phase Fase 3.7: Refactorización con hooks dinámicos
 */

import { useMemo } from 'react';
import { Badge } from '@/presentation/components/ui/badge';
import { useProformaEstadoBadge } from '@/application/hooks';
import { getEstadoBadge } from '@/domain/entities/proformas';

interface ProformaEstadoBadgeProps {
    estado: string;
    className?: string;
}

/**
 * Componente Badge para mostrar el estado de una proforma
 *
 * Usa hook dinámico para obtener información del estado desde la API.
 * Fallback automático a datos hardcodeados si los datos no están disponibles.
 *
 * @example
 * <ProformaEstadoBadge estado="APROBADA" />
 *
 * @example
 * // Con clases Tailwind personalizadas
 * <ProformaEstadoBadge estado="PENDIENTE" className="text-lg" />
 *
 * @example
 * // Dentro de EstadosProvider (Fase 3.7)
 * <EstadosProvider>
 *   <ProformaEstadoBadge estado="RECHAZADA" />
 * </EstadosProvider>
 */
export function ProformaEstadoBadge({ estado, className }: ProformaEstadoBadgeProps) {
    // Fase 3.7: Integración con hook dinámico
    const getEstadoBadgeInfo = useProformaEstadoBadge();

    // Obtener información dinámica del estado
    const badgeInfo = useMemo(() => {
        const info = getEstadoBadgeInfo(estado);

        if (info) {
            return info;
        }

        // Fallback a función hardcodeada si no hay información dinámica
        return getEstadoBadge(estado);
    }, [estado, getEstadoBadgeInfo]);

    return (
        <Badge variant={badgeInfo.variant} className={className}>
            {badgeInfo.label}
        </Badge>
    );
}
