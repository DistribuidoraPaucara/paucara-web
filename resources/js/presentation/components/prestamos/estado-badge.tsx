import React from 'react';
import { CheckCircle2, Clock, RotateCcw, XCircle } from 'lucide-react';

type EstadoPrestamo = 'ACTIVO' | 'PARCIALMENTE_DEVUELTO' | 'COMPLETAMENTE_DEVUELTO' | 'CANCELADO';

interface EstadoBadgeProps {
    estado: EstadoPrestamo;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'badge' | 'inline';
}

const estadoConfig = {
    ACTIVO: {
        label: 'Activo',
        color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
        textColor: 'text-blue-900 dark:text-blue-200',
        icon: '🔄',
        dotColor: 'bg-blue-600 dark:bg-blue-400',
    },
    PARCIALMENTE_DEVUELTO: {
        label: 'Parcialmente Devuelto',
        color: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
        textColor: 'text-yellow-900 dark:text-yellow-200',
        icon: '⚠️',
        dotColor: 'bg-yellow-600 dark:bg-yellow-400',
    },
    COMPLETAMENTE_DEVUELTO: {
        label: 'Completamente Devuelto',
        color: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
        textColor: 'text-green-900 dark:text-green-200',
        icon: '✅',
        dotColor: 'bg-green-600 dark:bg-green-400',
    },
    CANCELADO: {
        label: 'Cancelado',
        color: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
        textColor: 'text-red-900 dark:text-red-200',
        icon: '❌',
        dotColor: 'bg-red-600 dark:bg-red-400',
    },
};

const sizeConfig = {
    sm: { padding: 'px-2 py-1', text: 'text-xs', dot: 'w-2 h-2' },
    md: { padding: 'px-3 py-1.5', text: 'text-sm', dot: 'w-2.5 h-2.5' },
    lg: { padding: 'px-4 py-2', text: 'text-base', dot: 'w-3 h-3' },
};

export function EstadoBadge({
    estado,
    size = 'md',
    variant = 'badge',
}: EstadoBadgeProps) {
    const config = estadoConfig[estado];
    const sizes = sizeConfig[size];

    if (variant === 'inline') {
        return (
            <div className="flex items-center gap-2">
                <span className={`inline-block rounded-full ${sizes.dot} ${config.dotColor}`} />
                <span className={`${sizes.text} font-medium ${config.textColor}`}>{config.label}</span>
            </div>
        );
    }

    return (
        <div className={`inline-flex items-center gap-2 ${sizes.padding} rounded-lg border ${config.color}`}>
            <span className="text-lg">{config.icon}</span>
            <span className={`${sizes.text} font-medium ${config.textColor}`}>{config.label}</span>
        </div>
    );
}
