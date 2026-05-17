import { Calendar, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface PeriodSelectorProps {
    value: string;
    onChange: (period: string) => void;
    className?: string;
}

export function PeriodSelector({ value, onChange, className = '' }: PeriodSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);

    const periods = [
        { value: 'hoy', label: 'Hoy' },
        { value: 'semana_actual', label: 'Esta semana' },
        { value: 'ultimos_30_dias', label: 'Últimos 30 días' },
        { value: 'mes_actual', label: 'Este mes' },
        { value: 'año_actual', label: 'Este año' },
    ];

    const currentPeriod = periods.find(p => p.value === value)?.label || 'Últimos 30 días';

    return (
        <div className={`relative ${className}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 rounded-lg border border-sidebar-border/70 bg-sidebar px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-sidebar-border dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
                <Calendar className="h-4 w-4" />
                <span>{currentPeriod}</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 top-full z-20 mt-1 w-40 rounded-lg border border-sidebar-border/70 bg-sidebar shadow-lg dark:border-sidebar-border">
                        <div className="py-1">
                            {periods.map((period) => (
                                <button
                                    key={period.value}
                                    onClick={() => {
                                        onChange(period.value);
                                        setIsOpen(false);
                                    }}
                                    className={`block w-full px-3 py-2 text-left text-sm transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 ${value === period.value
                                            ? 'bg-neutral-100 font-medium text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100'
                                            : 'text-neutral-700 dark:text-neutral-300'
                                        }`}
                                >
                                    {period.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
