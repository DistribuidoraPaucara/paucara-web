import { formatCurrency } from '@/lib/utils';
import { TrendingUp, TrendingDown, ShoppingCart, DollarSign, Users, FileText } from 'lucide-react';

// Importar tipos del domain
import type { EstadisticasCompras } from '@/domain/entities/compras';

interface Props {
    estadisticas: EstadisticasCompras;
    className?: string;
}

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

    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 ${className}`}>
            {/* Total de Compras */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Compras</p>
                        <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                            {estadisticas.total_compras.toLocaleString()}
                        </p>
                    </div>
                    <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                        <ShoppingCart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                </div>
                {estadisticas.mes_actual.variacion_compras !== 0 && (
                    <div className="mt-2 flex items-center">
                        <div className={`flex items-center ${getVariacionColor(estadisticas.mes_actual.variacion_compras)}`}>
                            {getVariacionIcon(estadisticas.mes_actual.variacion_compras)}
                            <span className="text-sm font-medium ml-1">
                                {Math.abs(estadisticas.mes_actual.variacion_compras).toFixed(1)}%
                            </span>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">vs mes anterior</span>
                    </div>
                )}
            </div>

            {/* Monto Total */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monto Total</p>
                        <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(estadisticas.monto_total)}
                        </p>
                    </div>
                    <div className="h-12 w-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                        <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                </div>
                {estadisticas.mes_actual.variacion_monto !== 0 && (
                    <div className="mt-2 flex items-center">
                        <div className={`flex items-center ${getVariacionColor(estadisticas.mes_actual.variacion_monto)}`}>
                            {getVariacionIcon(estadisticas.mes_actual.variacion_monto)}
                            <span className="text-sm font-medium ml-1">
                                {Math.abs(estadisticas.mes_actual.variacion_monto).toFixed(1)}%
                            </span>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">vs mes anterior</span>
                    </div>
                )}
            </div>

            {/* Promedio por Compra */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Promedio por Compra</p>
                        <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(estadisticas.promedio_compra)}
                        </p>
                    </div>
                    <div className="h-12 w-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                        <FileText className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                </div>
                <div className="mt-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        Compras este mes: {estadisticas.mes_actual.compras.toLocaleString()}
                    </span>
                </div>
            </div>

            {/* Estados */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Por Estado</p>
                    </div>
                    <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                        <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                </div>
                <div className="space-y-2">
                    {estadisticas.compras_por_estado.slice(0, 3).map((estado, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                            <span className="text-gray-600 dark:text-gray-400 truncate">
                                {estado.nombre}
                            </span>
                            <span className="font-medium text-gray-900 dark:text-white">
                                {estado.cantidad}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Detalle de Estados (span completo en móvil) */}
            {/* {estadisticas.compras_por_estado.length > 0 && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 md:col-span-2 lg:col-span-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Distribución por Estados
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {estadisticas.compras_por_estado.map((estado, index) => (
                            <div key={index} className="text-center">
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                        {estado.nombre}
                                    </p>
                                    <p className="text-xl font-semibold text-gray-900 dark:text-white">
                                        {estado.cantidad}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {formatCurrency(estado.monto_total)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )} */}
        </div>
    );
}
