import { type LucideIcon } from 'lucide-react';

interface MetricCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    change?: number;
    icon: LucideIcon;
    className?: string;
    loading?: boolean;
}

export function MetricCard({
    title,
    value,
    subtitle,
    change,
    icon: Icon,
    className = '',
    loading = false,
}: MetricCardProps) {
    const formatValue = (val: string | number) => {
        // Si es string, intenta convertir a número
        let numValue: number;

        if (typeof val === 'string') {
            numValue = parseFloat(val);
            // Si no es un número válido, devuelve el string original
            if (isNaN(numValue)) return val;
        } else {
            numValue = val;
        }

        // Formatea con máximo 2 decimales
        if (numValue > 1000) {
            return new Intl.NumberFormat('es-BO', {
                style: 'currency',
                currency: 'BOB',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }).format(numValue);
        }

        return numValue.toFixed(2);
    };

    const formatChange = (change: number) => {
        const sign = change >= 0 ? '+' : '';
        return `${sign}${change.toFixed(1)}%`;
    };

    const getChangeColor = (change: number) => {
        if (change > 0) return 'text-emerald-600 dark:text-emerald-400';
        if (change < 0) return 'text-red-600 dark:text-red-400';
        return 'text-neutral-600 dark:text-neutral-400';
    };

    if (loading) {
        return (
            <div className={`rounded-lg border border-sidebar-border/70 bg-sidebar p-6 dark:border-sidebar-border ${className}`}>
                <div className="animate-pulse">
                    <div className="flex items-center justify-between">
                        <div className="h-4 w-24 rounded bg-neutral-300 dark:bg-neutral-700"></div>
                        <div className="h-6 w-6 rounded bg-neutral-300 dark:bg-neutral-700"></div>
                    </div>
                    <div className="mt-4 h-8 w-32 rounded bg-neutral-300 dark:bg-neutral-700"></div>
                    <div className="mt-2 h-4 w-20 rounded bg-neutral-300 dark:bg-neutral-700"></div>
                </div>
            </div>
        );
    }

    return (
        <div className={`rounded-lg border border-sidebar-border/70 bg-sidebar p-6 transition-all hover:shadow-md dark:border-sidebar-border ${className}`}>
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
                    {title}
                </h3>
                <Icon className="h-5 w-5 text-neutral-400 dark:text-neutral-500" />
            </div>

            <div className="mt-3">
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                    {formatValue(value)}
                </p>

                <div className="mt-1 flex items-center gap-2 text-sm">
                    {subtitle && (
                        <span className="text-neutral-500 dark:text-neutral-400">
                            {subtitle}
                        </span>
                    )}

                    {change !== undefined && (
                        <span className={getChangeColor(change)}>
                            {formatChange(change)}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
