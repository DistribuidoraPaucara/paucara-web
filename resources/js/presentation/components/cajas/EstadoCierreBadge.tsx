import React from 'react';

interface EstadoCierreBadgeProps {
    estado?: 'PENDIENTE' | 'CONSOLIDADA' | 'RECHAZADA' | 'CORREGIDA' | null;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

/**
 * Componente para mostrar el estado de un cierre de caja con color y icono
 *
 * Estados soportados:
 * - PENDIENTE: Amarillo, pendiente de verificación por admin
 * - CONSOLIDADA: Verde, aprobado por admin
 * - RECHAZADA: Rojo, rechazado por admin, requiere corrección
 * - CORREGIDA: Azul, rechazado que fue corregido
 */
export function EstadoCierreBadge({
    estado = null,
    size = 'md',
    className = ''
}: EstadoCierreBadgeProps) {
    const config: Record<string, { color: string; icon: string; label: string; bgClass: string; textClass: string }> = {
        PENDIENTE: {
            color: 'yellow',
            icon: '⏳',
            label: 'Pendiente',
            bgClass: 'bg-yellow-100',
            textClass: 'text-yellow-800'
        },
        CONSOLIDADA: {
            color: 'green',
            icon: '✅',
            label: 'Consolidada',
            bgClass: 'bg-green-100',
            textClass: 'text-green-800'
        },
        RECHAZADA: {
            color: 'red',
            icon: '❌',
            label: 'Rechazada',
            bgClass: 'bg-red-100',
            textClass: 'text-red-800'
        },
        CORREGIDA: {
            color: 'blue',
            icon: '🔄',
            label: 'Corregida',
            bgClass: 'bg-blue-100',
            textClass: 'text-blue-800'
        },
    };

    if (!estado || !config[estado]) {
        return <span className={`inline-block px-3 py-1 rounded-full text-gray-800 bg-gray-100 text-sm font-medium ${className}`}>
            Desconocido
        </span>;
    }

    const { icon, label, bgClass, textClass } = config[estado];

    const sizeClasses = {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-1 text-sm',
        lg: 'px-4 py-2 text-base',
    };

    return (
        <span className={`inline-flex items-center gap-2 ${sizeClasses[size]} rounded-full font-medium ${bgClass} ${textClass} ${className}`}>
            <span>{icon}</span>
            <span>{label}</span>
        </span>
    );
}

export default EstadoCierreBadge;
