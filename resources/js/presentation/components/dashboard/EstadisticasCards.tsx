/**
 * Componente: Tarjetas de Estadísticas del Dashboard
 *
 * Renderiza las 4 tarjetas principales de estadísticas del inventario
 */

import { Link } from '@inertiajs/react';
import type { Estadisticas } from '@/domain/entities/dashboard-inventario';

interface EstadisticasCardsProps {
    estadisticas: Estadisticas;
    canViewStockBajo: boolean;
    canViewProximosVencer: boolean;
    canViewVencidos: boolean;
}

export default function EstadisticasCards({
    estadisticas,
    canViewStockBajo,
    canViewProximosVencer,
    canViewVencidos,
}: EstadisticasCardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Productos */}
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-4.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Productos</p>
                        <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                            {estadisticas.total_productos}
                        </p>
                    </div>
                </div>
            </div>

            {/* Stock Bajo */}
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                    <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                        <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Stock Bajo</p>
                        <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                            {estadisticas.productos_stock_bajo}
                        </p>
                        {canViewStockBajo && (
                            <Link
                                href="/inventario/stock-bajo"
                                className="text-sm text-red-600 hover:text-red-500 dark:text-red-400"
                            >
                                Ver detalles →
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Próximos a Vencer */}
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                        <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Próximos a Vencer</p>
                        <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                            {estadisticas.productos_proximos_vencer}
                        </p>
                        {canViewProximosVencer && (
                            <Link
                                href="/inventario/proximos-vencer"
                                className="text-sm text-orange-600 hover:text-orange-500 dark:text-orange-400"
                            >
                                Ver detalles →
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Productos Vencidos */}
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                    <div className="p-2 bg-gray-100 dark:bg-gray-900 rounded-lg">
                        <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Productos Vencidos</p>
                        <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                            {estadisticas.productos_vencidos}
                        </p>
                        {canViewVencidos && (
                            <Link
                                href="/inventario/vencidos"
                                className="text-sm text-gray-600 hover:text-gray-500 dark:text-gray-400"
                            >
                                Ver detalles →
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
