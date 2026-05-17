import { Badge } from '@/presentation/components/ui/badge';
import type { Entrega } from '@/domain/entities/entregas';
import { useMemo } from 'react';

interface EstadoBadgeProps {
    entrega: Entrega;
    className?: string;
}

/**
 * Componente para mostrar el estado de una entrega usando colores dinámicos de la BD
 *
 * Renderiza:
 * - Nombre del estado (estado_entrega_nombre)
 * - Color dinámico desde BD (estado_entrega_color) si está disponible
 * - Fallback a clase Tailwind si no hay color en BD
 * - Emoji/icono opcional (estado_entrega_icono)
 *
 * Ventajas:
 * - ✅ Colores vienen de estados_logistica (fuente de verdad)
 * - ✅ Sin hardcoding - actualizar BD actualiza UI automáticamente
 * - ✅ Compatible con tema claro/oscuro
 * - ✅ Soporta iconos dinámicos
 */
export default function EstadoBadge({ entrega, className = '' }: EstadoBadgeProps) {
    // Determinar qué datos usar: estado_entrega (dinámico) o estado (legacy)
    const estadoNombre = entrega.estado_entrega_nombre || entrega.estado;
    const estadoColor = entrega.estado_entrega_color;
    const estadoIcono = entrega.estado_entrega_icono;

    // Estilos por defecto si no hay color en BD
    const fallbackStyles = getFallbackStyles(entrega.estado);

    // Si hay color en BD, crear estilos inline
    const dynamicStyles = useMemo(() => {
        if (!estadoColor) return {};

        // Convertir color hex a RGB con transparencia
        const rgbColor = hexToRgb(estadoColor);
        if (!rgbColor) return {};

        const { r, g, b } = rgbColor;

        return {
            backgroundColor: `rgba(${r}, ${g}, ${b}, 0.15)`,
            color: estadoColor,
            borderColor: estadoColor,
            border: `1px solid ${estadoColor}`,
        } as React.CSSProperties;
    }, [estadoColor]);

    return (
        <Badge
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-medium transition-colors ${
                estadoColor ? '' : fallbackStyles
            } ${className}`}
            style={dynamicStyles}
        >
            {estadoIcono && <span className="text-lg">{estadoIcono}</span>}
            <span>{estadoNombre}</span>
        </Badge>
    );
}

/**
 * Convertir color HEX a RGB
 * Ej: '#8B5CF6' → { r: 139, g: 92, b: 246 }
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    // Remover '#' si está
    hex = hex.replace(/^#/, '');

    // Validar formato
    if (!/^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex)) {
        return null;
    }

    // Expandir colores cortos (ej: FFF → FFFFFF)
    if (hex.length === 3) {
        hex = hex
            .split('')
            .map((char) => char + char)
            .join('');
    }

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return { r, g, b };
}

/**
 * Estilos por defecto para estados legacy (fallback)
 * Mantiene compatibilidad con el código anterior
 */
function getFallbackStyles(estado: string): string {
    const styleMap: Record<string, string> = {
        PROGRAMADO:
            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200',
        ASIGNADA: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
        PREPARACION_CARGA:
            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200',
        EN_CARGA: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-200',
        LISTO_PARA_ENTREGA:
            'bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-200',
        EN_TRANSITO:
            'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200',
        EN_CAMINO:
            'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200',
        ENTREGADO: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
        LLEGO: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
        RECHAZADO: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200',
        NOVEDAD: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200',
        CANCELADA: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100',
    };

    return styleMap[estado] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
}
