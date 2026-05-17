import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Calendar } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { EstadisticasVentas } from '@/domain/entities/ventas';

interface EstadisticasVentasProps {
    estadisticas: EstadisticasVentas;
}

export default function EstadisticasVentasComponent({ estadisticas }: EstadisticasVentasProps) {
    const stats = [
        {
            name: 'Total Ventas',
            value: estadisticas.total_ventas.toLocaleString(),
            icon: ShoppingCart,
            color: 'text-blue-600 dark:text-blue-400',
            bgColor: 'bg-blue-100 dark:bg-blue-900/20',
        },
        {
            name: 'Ventas Hoy',
            value: estadisticas.ventas_hoy.toLocaleString(),
            icon: Calendar,
            color: 'text-green-600 dark:text-green-400',
            bgColor: 'bg-green-100 dark:bg-green-900/20',
        },
        {
            name: 'Monto Total',
            value: formatCurrency(estadisticas.monto_total),
            icon: DollarSign,
            color: 'text-purple-600 dark:text-purple-400',
            bgColor: 'bg-purple-100 dark:bg-purple-900/20',
        },
        {
            name: 'Monto Hoy',
            value: formatCurrency(estadisticas.monto_hoy),
            icon: TrendingUp,
            color: 'text-emerald-600 dark:text-emerald-400',
            bgColor: 'bg-emerald-100 dark:bg-emerald-900/20',
        },
        {
            name: 'Promedio por Venta',
            value: formatCurrency(estadisticas.promedio_venta),
            icon: TrendingDown,
            color: 'text-amber-600 dark:text-amber-400',
            bgColor: 'bg-amber-100 dark:bg-amber-900/20',
        },
        {
            name: 'Clientes Activos',
            value: estadisticas.clientes_activos.toLocaleString(),
            icon: Users,
            color: 'text-pink-600 dark:text-pink-400',
            bgColor: 'bg-pink-100 dark:bg-pink-900/20',
        },
    ];

    return (
        <div className="space-y-6">
            {/* Estadísticas principales */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {stats.map((stat) => {
                    const IconComponent = stat.icon;
                    return (
                        <div
                            key={stat.name}
                            className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 p-4"
                        >
                            <div className="flex items-center">
                                <div className={`flex-shrink-0 p-2 rounded-md ${stat.bgColor}`}>
                                    <IconComponent className={`h-5 w-5 ${stat.color}`} />
                                </div>
                                <div className="ml-3 flex-1">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                                        {stat.name}
                                    </p>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {stat.value}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Gráficos y estadísticas adicionales */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Ventas por estado */}
                <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 p-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Ventas por Estado
                    </h3>
                    <div className="space-y-3">
                        {estadisticas.ventas_por_estado.map((item, index) => (
                            <div key={`estado-${item.estado}`} className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div
                                        className="w-3 h-3 rounded-full mr-3"
                                        style={{
                                            backgroundColor: getEstadoColor(item.estado)
                                        }}
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        {item.estado}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {item.cantidad}
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        ({item.porcentaje.toFixed(1)}%)
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top productos */}
                <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 p-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Productos Más Vendidos
                    </h3>
                    <div className="space-y-3">
                        {estadisticas.top_productos.slice(0, 5).map((item, index) => (
                            <div key={`producto-${item.producto}`} className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                        {item.producto}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {item.cantidad_vendida} unidades
                                    </p>
                                </div>
                                <div className="ml-4 text-right">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {formatCurrency(item.monto_total)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top clientes */}
                <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 p-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Mejores Clientes
                    </h3>
                    <div className="space-y-3">
                        {estadisticas.top_clientes.slice(0, 5).map((item, index) => (
                            <div key={`cliente-${item.cliente}`} className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                        {item.cliente}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {item.total_compras} compras
                                    </p>
                                </div>
                                <div className="ml-4 text-right">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {formatCurrency(item.monto_total)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Ventas por mes */}
                <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 p-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Ventas por Mes
                    </h3>
                    <div className="space-y-3">
                        {estadisticas.ventas_por_mes.slice(0, 6).map((item, index) => (
                            <div key={`mes-${item.mes}`} className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {item.mes}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {item.cantidad} ventas
                                    </p>
                                </div>
                                <div className="ml-4 text-right">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {formatCurrency(item.monto)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Métricas adicionales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 p-4">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {estadisticas.productos_vendidos.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Productos Vendidos
                        </p>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 p-4">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {formatCurrency(estadisticas.monto_mes)}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Ventas este Mes
                        </p>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 p-4">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {estadisticas.ventas_mes.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Ventas este Mes
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Función helper para obtener colores de estado
function getEstadoColor(estado: string): string {
    switch (estado.toLowerCase()) {
        case 'pendiente':
            return '#f59e0b'; // yellow
        case 'completada':
        case 'pagada':
            return '#10b981'; // green
        case 'cancelada':
            return '#ef4444'; // red
        case 'facturada':
            return '#3b82f6'; // blue
        default:
            return '#6b7280'; // gray
    }
}
