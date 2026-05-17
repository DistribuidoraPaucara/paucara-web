import React from 'react';
import { AlertCircle, Clock, CheckCircle2 } from 'lucide-react';

interface VencimientoIndicatorProps {
    fechaEsperada: Date | string;
    showLabel?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

type StatusType = 'vigente' | 'urgent' | 'vencido';

function getStatus(fechaEsperada: Date | string): StatusType {
    const fecha = typeof fechaEsperada === 'string' ? new Date(fechaEsperada) : fechaEsperada;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const diasRestantes = Math.floor((fecha.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));

    if (diasRestantes < 0) return 'vencido';
    if (diasRestantes <= 7) return 'urgent';
    return 'vigente';
}

function getDiasRestantes(fechaEsperada: Date | string): number {
    const fecha = typeof fechaEsperada === 'string' ? new Date(fechaEsperada) : fechaEsperada;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    return Math.ceil((fecha.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
}

const statusConfig = {
    vigente: {
        color: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
        icon: CheckCircle2,
        label: 'Vigente',
    },
    urgent: {
        color: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
        icon: Clock,
        label: 'Próximo a vencer',
    },
    vencido: {
        color: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
        icon: AlertCircle,
        label: 'Vencido',
    },
};

const sizeConfig = {
    sm: { padding: 'px-2 py-1', text: 'text-xs', iconSize: 14 },
    md: { padding: 'px-3 py-1.5', text: 'text-sm', iconSize: 16 },
    lg: { padding: 'px-4 py-2', text: 'text-base', iconSize: 18 },
};

export function VencimientoIndicator({
    fechaEsperada,
    showLabel = true,
    size = 'md',
}: VencimientoIndicatorProps) {
    const status = getStatus(fechaEsperada);
    const diasRestantes = getDiasRestantes(fechaEsperada);
    const config = statusConfig[status];
    const sizes = sizeConfig[size];
    const Icon = config.icon;

    const diasLabel = status === 'vencido'
        ? `${Math.abs(diasRestantes)} día${Math.abs(diasRestantes) !== 1 ? 's' : ''} vencido`
        : `${diasRestantes} día${diasRestantes !== 1 ? 's' : ''} restante${diasRestantes !== 1 ? 's' : ''}`;

    return (
        <div className={`inline-flex items-center gap-1.5 ${sizes.padding} rounded-lg border ${config.color}`}>
            <Icon size={sizes.iconSize} className="flex-shrink-0" />
            <div className={`flex flex-col ${sizes.text} font-medium`}>
                {showLabel && <span>{config.label}</span>}
                <span className="text-xs opacity-75">{diasLabel}</span>
            </div>
        </div>
    );
}
