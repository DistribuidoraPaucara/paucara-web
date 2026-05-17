import React from 'react';
import { Card } from '@/presentation/components/ui/card';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface KPICardProps {
    title: string;
    value: number | string;
    icon: string;
    color: 'green' | 'blue' | 'red' | 'yellow' | 'orange';
    trend?: { value: number; direction: 'up' | 'down' };
    subtitle?: string;
    onClick?: () => void;
    className?: string;
}

const colorMap = {
    green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    red: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    yellow: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    orange: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
};

const iconColorMap = {
    green: 'text-green-600 dark:text-green-400',
    blue: 'text-blue-600 dark:text-blue-400',
    red: 'text-red-600 dark:text-red-400',
    yellow: 'text-yellow-600 dark:text-yellow-400',
    orange: 'text-orange-600 dark:text-orange-400',
};

const textColorMap = {
    green: 'text-green-900 dark:text-green-200',
    blue: 'text-blue-900 dark:text-blue-200',
    red: 'text-red-900 dark:text-red-200',
    yellow: 'text-yellow-900 dark:text-yellow-200',
    orange: 'text-orange-900 dark:text-orange-200',
};

export function KPICard({
    title,
    value,
    icon,
    color,
    trend,
    subtitle,
    onClick,
    className,
}: KPICardProps) {
    return (
        <Card
            className={`${colorMap[color]} border p-6 cursor-pointer transition-all hover:shadow-lg ${className}`}
            onClick={onClick}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className={`text-sm font-medium ${textColorMap[color]} mb-1`}>
                        {title}
                    </p>
                    <div className="flex items-baseline gap-2">
                        <h3 className={`text-3xl font-bold ${textColorMap[color]}`}>
                            {value}
                        </h3>
                        {trend && (
                            <div className={`flex items-center gap-1 text-sm font-semibold ${
                                trend.direction === 'up'
                                    ? 'text-green-600 dark:text-green-400'
                                    : 'text-red-600 dark:text-red-400'
                            }`}>
                                {trend.direction === 'up' ? (
                                    <ArrowUp size={16} />
                                ) : (
                                    <ArrowDown size={16} />
                                )}
                                {trend.value}%
                            </div>
                        )}
                    </div>
                    {subtitle && (
                        <p className={`text-xs mt-2 ${textColorMap[color]}`}>
                            {subtitle}
                        </p>
                    )}
                </div>
                <div className={`text-4xl ${iconColorMap[color]}`}>
                    {icon}
                </div>
            </div>
        </Card>
    );
}
