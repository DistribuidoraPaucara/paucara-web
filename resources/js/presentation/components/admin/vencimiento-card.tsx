import { Link } from '@inertiajs/react';
import { differenceInDays, parseISO } from 'date-fns';

interface Vencimiento {
    id: number;
    tipo: 'prestamo_cliente' | 'prestamo_evento' | 'prestamo_proveedor' | 'cuenta_por_cobrar';
    categoria: string;
    fecha: string;
    nombre: string;
    estado: string;
    monto: number;
    cantidad_items: number;
    referencia: string;
    observaciones?: string;
    link: string;
}

interface VencimientoCardProps {
    vencimiento: Vencimiento;
    compact?: boolean;
}

const obtenerColorProximidad = (fecha: string): string => {
    try {
        const fechaVencimiento = parseISO(fecha);
        const hoy = new Date();
        const diasRestantes = differenceInDays(fechaVencimiento, hoy);

        if (diasRestantes < 0) {
            return 'border-red-500 bg-red-50 dark:border-red-700 dark:bg-red-900';
        } else if (diasRestantes <= 3) {
            return 'border-red-400 bg-red-50 dark:border-red-600 dark:bg-red-900';
        } else if (diasRestantes <= 7) {
            return 'border-orange-400 bg-orange-50 dark:border-orange-600 dark:bg-orange-900';
        } else if (diasRestantes <= 14) {
            return 'border-yellow-400 bg-yellow-50 dark:border-yellow-600 dark:bg-yellow-900';
        } else if (diasRestantes <= 30) {
            return 'border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900';
        } else {
            return 'border-green-200 bg-white dark:border-green-800 dark:bg-zinc-800';
        }
    } catch {
        return 'border-gray-200 bg-white dark:border-zinc-700 dark:bg-zinc-800';
    }
};

const obtenerBadgeDiasRestantes = (fecha: string): { texto: string; color: string } => {
    try {
        const fechaVencimiento = parseISO(fecha);
        const hoy = new Date();
        const diasRestantes = differenceInDays(fechaVencimiento, hoy);

        if (diasRestantes < 0) {
            return {
                texto: `⚠️ Vencido ${Math.abs(diasRestantes)}d`,
                color: 'bg-red-600 text-white text-xs',
            };
        } else if (diasRestantes === 0) {
            return {
                texto: '🔴 HOY',
                color: 'bg-red-600 text-white text-xs',
            };
        } else if (diasRestantes <= 7) {
            return {
                texto: `⏰ ${diasRestantes}d`,
                color: 'bg-orange-500 text-white text-xs',
            };
        } else if (diasRestantes <= 30) {
            return {
                texto: `📅 ${diasRestantes}d`,
                color: 'bg-yellow-600 text-white text-xs',
            };
        }
        return { texto: '', color: '' };
    } catch {
        return { texto: '', color: '' };
    }
};

export default function VencimientoCard({ vencimiento, compact = false }: VencimientoCardProps) {
    const colorClase = obtenerColorProximidad(vencimiento.fecha);
    const badge = obtenerBadgeDiasRestantes(vencimiento.fecha);

    if (compact) {
        return (
            <Link href={vencimiento.link}>
                <div className={`rounded border-2 p-1.5 text-xs transition-all cursor-pointer hover:shadow-md ${colorClase}`}>
                    {badge.texto && (
                        <div className={`${badge.color} rounded px-2 py-0.5 mb-1 text-center font-bold`}>
                            {badge.texto}
                        </div>
                    )}

                    <div className="flex items-start justify-between gap-1">
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 dark:text-white truncate text-xs">
                                {vencimiento.categoria}
                            </p>
                            <p className="text-gray-700 dark:text-gray-300 truncate text-xs">
                                {vencimiento.nombre}
                            </p>
                        </div>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                        Bs {Number(vencimiento.monto).toFixed(2)}
                    </p>
                </div>
            </Link>
        );
    }

    return (
        <Link href={vencimiento.link}>
            <div className={`rounded-lg border-2 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer ${colorClase}`}>
                {badge.texto && (
                    <div className={`${badge.color} rounded px-3 py-2 text-sm font-bold mb-3 text-center`}>
                        {badge.texto}
                    </div>
                )}

                <div className="flex items-start justify-between mb-2">
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                            {vencimiento.categoria}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {vencimiento.nombre}
                        </p>
                    </div>
                </div>

                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Monto:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                            Bs {Number(vencimiento.monto).toFixed(2)}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Referencia:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{vencimiento.referencia}</span>
                    </div>
                    {vencimiento.observaciones && (
                        <p className="text-gray-600 dark:text-gray-400 italic mt-2">
                            "{vencimiento.observaciones}"
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
}
