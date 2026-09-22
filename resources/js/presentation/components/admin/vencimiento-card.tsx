import { Link } from '@inertiajs/react';
import { differenceInDays, parseISO } from 'date-fns';
import TooltipVencimiento from './tooltip-vencimiento';

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

const obtenerColorPorTipo = (tipo: string): { acento: string; icono: string } => {
    switch (tipo) {
        case 'prestamo_cliente':
            return { acento: 'border-l-blue-500 bg-blue-50/30 dark:border-l-blue-400 dark:bg-blue-950/30', icono: '📦' };
        case 'prestamo_evento':
            return { acento: 'border-l-purple-500 bg-purple-50/30 dark:border-l-purple-400 dark:bg-purple-950/30', icono: '🎉' };
        case 'prestamo_proveedor':
            return { acento: 'border-l-indigo-500 bg-indigo-50/30 dark:border-l-indigo-400 dark:bg-indigo-950/30', icono: '🏭' };
        case 'cuenta_por_cobrar':
            return { acento: 'border-l-green-500 bg-green-50/30 dark:border-l-green-400 dark:bg-green-950/30', icono: '💰' };
        default:
            return { acento: 'border-l-gray-500 bg-gray-50/30 dark:border-l-gray-400 dark:bg-gray-950/30', icono: '📋' };
    }
};

const obtenerColorEstado = (estado: string): string => {
    const estadoNorm = (estado || '').toUpperCase();
    if (estadoNorm === 'ACTIVO') {
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200';
    } else if (estadoNorm === 'PAGADO') {
        return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200';
    } else if (estadoNorm === 'PARCIAL') {
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200';
    } else if (estadoNorm === 'PENDIENTE') {
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200';
    } else if (estadoNorm === 'ANULADO') {
        return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200';
    }
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-200';
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
    const { acento: tipoAcento } = obtenerColorPorTipo(vencimiento.tipo);
    const colorEstado = obtenerColorEstado(vencimiento.estado);

    if (compact) {
        return (
            <TooltipVencimiento
                nombre={vencimiento.nombre}
                monto={vencimiento.monto}
                referencia={vencimiento.referencia}
                estado={vencimiento.estado}
                fecha={vencimiento.fecha}
                observaciones={vencimiento.observaciones}
            >
                <Link href={vencimiento.link}>
                    <div className={`rounded border-2 border-l-4 p-1.5 text-xs transition-all cursor-pointer hover:shadow-md ${colorClase} ${tipoAcento}`}>
                        {badge.texto && (
                            <div className={`${badge.color} rounded px-2 py-0.5 mb-1 text-center font-bold`}>
                                {badge.texto}
                            </div>
                        )}

                        <div className="flex items-start justify-between gap-1 mb-1">
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 dark:text-white truncate text-xs">
                                    {vencimiento.categoria}
                                </p>
                                <p className="text-gray-700 dark:text-gray-300 truncate text-xs">
                                    {vencimiento.nombre}
                                </p>
                            </div>
                        </div>
                        <span className={`inline-block rounded px-1.5 py-0.5 text-xs font-medium ${colorEstado}`}>
                            {vencimiento.estado}
                        </span>
                    </div>
                </Link>
            </TooltipVencimiento>
        );
    }

    return (
        <TooltipVencimiento
            nombre={vencimiento.nombre}
            monto={vencimiento.monto}
            referencia={vencimiento.referencia}
            estado={vencimiento.estado}
            fecha={vencimiento.fecha}
            observaciones={vencimiento.observaciones}
        >
            <Link href={vencimiento.link}>
                <div className={`rounded-lg border-2 border-l-4 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer ${colorClase} ${tipoAcento}`}>
                    {badge.texto && (
                        <div className={`${badge.color} rounded px-3 py-2 text-sm font-bold mb-3 text-center`}>
                            {badge.texto}
                        </div>
                    )}

                    <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                {vencimiento.categoria}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {vencimiento.nombre}
                            </p>
                        </div>
                        <span className={`ml-2 rounded px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${colorEstado}`}>
                            {vencimiento.estado}
                        </span>
                    </div>

                    <div className="space-y-2 text-sm border-t border-gray-200 dark:border-zinc-700 pt-2">
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
        </TooltipVencimiento>
    );
}
