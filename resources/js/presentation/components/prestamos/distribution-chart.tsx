import React from 'react';

interface DistributionChartProps {
    disponible: number;
    enPrestamo: number;
    vendido: number;
    deuda: number;
    title?: string;
    size?: 'sm' | 'md' | 'lg';
}

const sizeConfig = {
    sm: { container: 'h-32', barHeight: 'h-4', textSmall: 'text-xs', textBase: 'text-sm' },
    md: { container: 'h-40', barHeight: 'h-6', textSmall: 'text-sm', textBase: 'text-base' },
    lg: { container: 'h-48', barHeight: 'h-8', textSmall: 'text-base', textBase: 'text-lg' },
};

const categories = [
    {
        key: 'disponible',
        label: 'Disponible',
        color: 'bg-green-500 dark:bg-green-600',
        lightColor: 'bg-green-100 dark:bg-green-900/30',
    },
    {
        key: 'enPrestamo',
        label: 'En Préstamo',
        color: 'bg-blue-500 dark:bg-blue-600',
        lightColor: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
        key: 'vendido',
        label: 'Vendido',
        color: 'bg-purple-500 dark:bg-purple-600',
        lightColor: 'bg-purple-100 dark:bg-purple-900/30',
    },
    {
        key: 'deuda',
        label: 'Deuda Proveedor',
        color: 'bg-red-500 dark:bg-red-600',
        lightColor: 'bg-red-100 dark:bg-red-900/30',
    },
];

export function DistributionChart({
    disponible,
    enPrestamo,
    vendido,
    deuda,
    title,
    size = 'md',
}: DistributionChartProps) {
    const total = disponible + enPrestamo + vendido + deuda;
    const sizes = sizeConfig[size];

    const data = [
        { value: disponible, key: 'disponible' },
        { value: enPrestamo, key: 'enPrestamo' },
        { value: vendido, key: 'vendido' },
        { value: deuda, key: 'deuda' },
    ];

    const getPercentage = (value: number) => (total > 0 ? (value / total) * 100 : 0);
    const getCategory = (key: string) => categories.find((c) => c.key === key)!;

    return (
        <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            {title && (
                <h3 className={`${sizes.textBase} font-semibold mb-4 text-slate-900 dark:text-slate-100`}>
                    {title}
                </h3>
            )}

            {/* Stacked Bar Chart */}
            <div className={`${sizes.container} flex flex-col justify-between`}>
                <div className={`${sizes.barHeight} rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 flex shadow-sm`}>
                    {data.map((item) => {
                        const category = getCategory(item.key);
                        const percentage = getPercentage(item.value);

                        return percentage > 0 ? (
                            <div
                                key={item.key}
                                className={`${category.color} transition-all duration-300`}
                                style={{ width: `${percentage}%` }}
                                title={`${category.label}: ${item.value} (${percentage.toFixed(1)}%)`}
                            />
                        ) : null;
                    })}
                </div>

                {/* Legend with values */}
                <div className="mt-4 space-y-2">
                    {data.map((item) => {
                        const category = getCategory(item.key);
                        const percentage = getPercentage(item.value);

                        return (
                            <div key={item.key} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className={`w-3 h-3 rounded-full ${category.color}`} />
                                    <span className={`${sizes.textSmall} text-slate-700 dark:text-slate-300`}>
                                        {category.label}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`${sizes.textSmall} font-semibold text-slate-900 dark:text-slate-100`}>
                                        {item.value}
                                    </span>
                                    <span className={`${sizes.textSmall} text-slate-500 dark:text-slate-400 w-10 text-right`}>
                                        {percentage.toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Total */}
                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between">
                    <span className={`${sizes.textSmall} font-semibold text-slate-700 dark:text-slate-300`}>Total</span>
                    <span className={`${sizes.textSmall} font-bold text-slate-900 dark:text-slate-100`}>{total}</span>
                </div>
            </div>
        </div>
    );
}
