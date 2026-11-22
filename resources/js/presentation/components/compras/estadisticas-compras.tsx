import { formatCurrencyExacto } from '@/lib/utils';
import { TrendingUp, TrendingDown, ShoppingCart, DollarSign, Users, FileText } from 'lucide-react';

// Importar tipos del domain
import type { EstadisticasCompras } from '@/domain/entities/compras';

interface Props {
    estadisticas: EstadisticasCompras;
    className?: string;
}

// Color de la barra/punto según el nombre del estado (mismos criterios que la tabla)
const colorEstado = (nombre: string) => {
    switch (nombre.toUpperCase()) {
        case 'APROBADO':
        case 'APROBADA':
            return 'bg-blue-500';
        case 'PENDIENTE':
            return 'bg-yellow-500';
        case 'RECIBIDO':
        case 'RECIBIDA':
            return 'bg-indigo-500';
        case 'PAGADO':
        case 'PAGADA':
        case 'COMPLETADA':
            return 'bg-green-500';
        case 'RECHAZADO':
        case 'RECHAZADA':
            return 'bg-orange-500';
        case 'ANULADO':
        case 'ANULADA':
        case 'CANCELADA':
            return 'bg-red-500';
        case 'BORRADOR':
            return 'bg-gray-400';
        default:
            return 'bg-gray-400';
    }
};

export default function EstadisticasCompras({ estadisticas, className = '' }: Props) {
    const getVariacionColor = (variacion: number) => {
        if (variacion > 0) return 'text-green-600 dark:text-green-400';
        if (variacion < 0) return 'text-red-600 dark:text-red-400';
        return 'text-gray-600 dark:text-gray-400';
    };

    const getVariacionIcon = (variacion: number) => {
        if (variacion > 0) return <TrendingUp className="h-4 w-4" />;
        if (variacion < 0) return <TrendingDown className="h-4 w-4" />;
        return null;
    };

    const estados = estadisticas.compras_por_estado ?? [];
    const totalEstados = estados.reduce((acc, e) => acc + Number(e.cantidad), 0);

    return (
        <div className={`mb-2 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 ${className}`}>
            {/* Total de Compras */}
            <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Compras</p>
                        <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                            {estadisticas.total_compras.toLocaleString()}
                        </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                        <ShoppingCart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                </div>
                {estadisticas.mes_actual.variacion_compras !== 0 && (
                    <div className="mt-1 flex items-center">
                        <div className={`flex items-center ${getVariacionColor(estadisticas.mes_actual.variacion_compras)}`}>
                            {getVariacionIcon(estadisticas.mes_actual.variacion_compras)}
                            <span className="ml-1 text-sm font-medium">
                                {Math.abs(estadisticas.mes_actual.variacion_compras).toFixed(1)}%
                            </span>
                        </div>
                        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">vs mes anterior</span>
                    </div>
                )}
            </div>

            {/* Monto Total (todos los decimales registrados) */}
            <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-center justify-between">
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monto Total</p>
                        <p className="truncate font-mono text-xl font-semibold text-gray-900 dark:text-white">
                            {formatCurrencyExacto(Number(estadisticas.monto_total))}
                        </p>
                    </div>
                    <div className="ml-2 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                        <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                </div>
                {estadisticas.mes_actual.variacion_monto !== 0 && (
                    <div className="mt-1 flex items-center">
                        <div className={`flex items-center ${getVariacionColor(estadisticas.mes_actual.variacion_monto)}`}>
                            {getVariacionIcon(estadisticas.mes_actual.variacion_monto)}
                            <span className="ml-1 text-sm font-medium">
                                {Math.abs(estadisticas.mes_actual.variacion_monto).toFixed(1)}%
                            </span>
                        </div>
                        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">vs mes anterior</span>
                    </div>
                )}
            </div>

            {/* Promedio por Compra */}
            <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-center justify-between">
                    <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Promedio por Compra</p>
                        <p className="truncate font-mono text-xl font-semibold text-gray-900 dark:text-white">
                            {formatCurrencyExacto(Number(estadisticas.promedio_compra))}
                        </p>
                    </div>
                    <div className="ml-2 flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900">
                        <FileText className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                </div>
                <div className="mt-1">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        Compras este mes: {estadisticas.mes_actual.compras.toLocaleString()}
                    </span>
                </div>
            </div>

            {/* Distribución por estado: todos los estados, con cantidad y barra proporcional */}
            <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Por Estado</p>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
                        <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                </div>

                {estados.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">Sin datos</p>
                ) : (
                    <ul className="space-y-2">
                        {estados.map((estado, index) => {
                            const porcentaje = totalEstados > 0 ? (Number(estado.cantidad) / totalEstados) * 100 : 0;
                            return (
                                <li key={`${estado.nombre}-${index}`} className="text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="truncate text-gray-700 dark:text-gray-300">{estado.nombre}</span>
                                        <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                                            {Number(estado.cantidad).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded bg-gray-100 dark:bg-gray-700">
                                        <div className={`h-full ${colorEstado(estado.nombre)}`} style={{ width: `${porcentaje}%` }} />
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
}
