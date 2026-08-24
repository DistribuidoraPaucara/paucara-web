import { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import { Calendar, ArrowRight } from 'lucide-react';
import { differenceInDays, parseISO } from 'date-fns';

interface Vencimiento {
    id: number;
    tipo: string;
    categoria: string;
    fecha: string;
    nombre: string;
    estado: string;
    monto: number;
    referencia: string;
    link: string;
}

export default function WidgetVencimientosProximos() {
    const [vencimientos, setVencimientos] = useState<Vencimiento[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarVencimientos();
    }, []);

    const cargarVencimientos = async () => {
        try {
            const mes = new Date().toISOString().slice(0, 7);
            const params = new URLSearchParams();
            params.append('mes', mes);
            params.append('tipo', 'prestamos,cuentas');

            const response = await fetch(`/api/calendario-vencimientos?${params}`);
            const data = await response.json();

            if (data.success) {
                // Ordenar por fecha y tomar los próximos 5
                const vencimientosOrdenados = data.data
                    .sort((a: Vencimiento, b: Vencimiento) => a.fecha.localeCompare(b.fecha))
                    .slice(0, 5);
                setVencimientos(vencimientosOrdenados);
            }
        } catch (error) {
            console.error('Error cargando vencimientos:', error);
        } finally {
            setLoading(false);
        }
    };

    const obtenerColorDias = (fecha: string): string => {
        const diasRestantes = differenceInDays(parseISO(fecha), new Date());
        if (diasRestantes < 0) return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900';
        if (diasRestantes <= 3) return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900';
        if (diasRestantes <= 7) return 'text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-900';
        if (diasRestantes <= 14) return 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900';
        return 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900';
    };

    const obtenerBadgeDias = (fecha: string): string => {
        const diasRestantes = differenceInDays(parseISO(fecha), new Date());
        if (diasRestantes < 0) return `Vencido ${Math.abs(diasRestantes)}d`;
        if (diasRestantes === 0) return 'Hoy';
        if (diasRestantes === 1) return 'Mañana';
        return `${diasRestantes}d`;
    };

    if (loading) {
        return (
            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
                <div className="animate-pulse space-y-3">
                    <div className="h-6 w-32 bg-gray-200 rounded dark:bg-zinc-700"></div>
                    <div className="h-4 w-full bg-gray-200 rounded dark:bg-zinc-700"></div>
                    <div className="h-4 w-3/4 bg-gray-200 rounded dark:bg-zinc-700"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-lg border border-gray-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
            {/* Header */}
            <div className="border-b border-gray-200 px-6 py-4 dark:border-zinc-700">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Próximos Vencimientos
                        </h3>
                    </div>
                    <Link
                        href="/admin/calendario-vencimientos"
                        className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                    >
                        Ver todo
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>

            {/* Contenido */}
            {vencimientos.length === 0 ? (
                <div className="px-6 py-8 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                        No hay vencimientos próximos este mes
                    </p>
                </div>
            ) : (
                <div className="divide-y divide-gray-200 dark:divide-zinc-700">
                    {vencimientos.map((v) => (
                        <Link key={`${v.tipo}-${v.id}`} href={v.link}>
                            <div className="px-6 py-3 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                            {v.categoria}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                                            {v.nombre}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            Bs {Number(v.monto).toFixed(2)}
                                        </p>
                                    </div>

                                    <div className="flex flex-col items-end gap-2">
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-bold whitespace-nowrap ${obtenerColorDias(
                                                v.fecha
                                            )}`}
                                        >
                                            {obtenerBadgeDias(v.fecha)}
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {new Date(v.fecha).toLocaleDateString('es-ES', {
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Footer */}
            <div className="border-t border-gray-200 px-6 py-3 dark:border-zinc-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    Total del mes: {vencimientos.length} vencimientos
                </p>
            </div>
        </div>
    );
}
