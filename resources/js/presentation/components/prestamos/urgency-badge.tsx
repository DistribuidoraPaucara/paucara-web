import React from 'react';
import { AlertTriangle, AlertCircle, Zap } from 'lucide-react';

interface UrgencyBadgeProps {
    diasVencidos: number;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'badge' | 'dot';
}

type UrgencyLevel = 'critico' | 'urgente' | 'vencido' | 'normal';

function getUrgencyLevel(diasVencidos: number): UrgencyLevel {
    if (diasVencidos > 30) return 'critico';
    if (diasVencidos >= 14) return 'urgente';
    if (diasVencidos >= 0) return 'vencido';
    return 'normal';
}

const urgencyConfig = {
    critico: {
        label: 'Crítico',
        icon: '🔴',
        color: 'bg-red-100 dark:bg-red-900/30 text-red-900 dark:text-red-200 border-red-300 dark:border-red-700',
        dotColor: 'bg-red-600',
        description: '> 30 días',
    },
    urgente: {
        label: 'Urgente',
        icon: '🟠',
        color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-900 dark:text-orange-200 border-orange-300 dark:border-orange-700',
        dotColor: 'bg-orange-600',
        description: '14-30 días',
    },
    vencido: {
        label: 'Vencido',
        icon: '🟡',
        color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700',
        dotColor: 'bg-yellow-600',
        description: '0-14 días',
    },
    normal: {
        label: 'Normal',
        icon: '🟢',
        color: 'bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-200 border-green-300 dark:border-green-700',
        dotColor: 'bg-green-600',
        description: 'Sin atrasos',
    },
};

const sizeConfig = {
    sm: { padding: 'px-2 py-1', text: 'text-xs', dot: 'w-2 h-2' },
    md: { padding: 'px-3 py-1.5', text: 'text-sm', dot: 'w-2.5 h-2.5' },
    lg: { padding: 'px-4 py-2', text: 'text-base', dot: 'w-3 h-3' },
};

export function UrgencyBadge({
    diasVencidos,
    size = 'md',
    variant = 'badge',
}: UrgencyBadgeProps) {
    const urgency = getUrgencyLevel(diasVencidos);
    const config = urgencyConfig[urgency];
    const sizes = sizeConfig[size];

    if (variant === 'dot') {
        return (
            <div className="flex items-center gap-2">
                <span className={`inline-block rounded-full ${sizes.dot} ${config.dotColor}`} />
                <span className={`${sizes.text} font-medium`}>{config.label}</span>
            </div>
        );
    }

    return (
        <div className={`inline-flex items-center gap-2 ${sizes.padding} rounded-lg border ${config.color}`}>
            <span className="text-lg">{config.icon}</span>
            <div className="flex flex-col gap-0.5">
                <span className={`${sizes.text} font-semibold`}>{config.label}</span>
                <span className={`${sizes.text} opacity-75`}>{config.description}</span>
            </div>
        </div>
    );
}
