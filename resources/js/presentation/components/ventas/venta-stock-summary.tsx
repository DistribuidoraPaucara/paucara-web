import React, { useState, useEffect, useCallback } from 'react';
import { Package, TrendingDown, TrendingUp, AlertTriangle, Eye } from 'lucide-react';
import stockService, { ResumenStock } from '@/infrastructure/services/stock.service';
import { formatCurrency } from '@/lib/utils';
import type { Id } from '@/domain/entities/shared';

interface VentaStockSummaryProps {
    ventaId: Id;
    className?: string;
}

export default function VentaStockSummary({ ventaId, className = '' }: VentaStockSummaryProps) {
    const [resumen, setResumen] = useState<ResumenStock | null>(null);
    const [loading, setLoading] = useState(true);
    const [showDetails, setShowDetails] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const cargarResumenStock = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await stockService.obtenerResumenStock(ventaId);
            setResumen(data);
        } catch (err) {
            setError('Error al cargar el resumen de stock');
            console.error('Error cargando resumen de stock:', err);
        } finally {
            setLoading(false);
        }
    }, [ventaId]);

    useEffect(() => {
        // Comentado: endpoint /ventas/{id}/stock/resumen no implementado
        // cargarResumenStock();
        setLoading(false);
    }, [cargarResumenStock]);

    if (loading) {
        return (
            <div className={`bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 p-6 ${className}`}>
                <div className="flex items-center justify-center py-8">
                    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="ml-3 text-gray-600 dark:text-gray-400">Cargando resumen de stock...</span>
                </div>
            </div>
        );
    }

    if (error || !resumen) {
        return (
            <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
                <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <span className="text-red-800 font-medium">Error</span>
                </div>
                <p className="text-red-700 text-sm mt-1">
                    {error || 'No se pudo cargar el resumen de stock'}
                </p>
                <button
                    onClick={cargarResumenStock}
                    className="text-red-600 hover:text-red-800 text-sm underline mt-2"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    const getStockStatusColor = (productos_sin_stock: number) => {
        if (productos_sin_stock === 0) return 'text-green-600';
        if (productos_sin_stock <= 2) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getStockStatusIcon = (productos_sin_stock: number) => {
        if (productos_sin_stock === 0) return <TrendingUp className="w-5 h-5 text-green-600" />;
        if (productos_sin_stock <= 2) return <TrendingDown className="w-5 h-5 text-yellow-600" />;
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
    };

    return (
        <div className={`bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 ${className}`}>
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <Package className="w-6 h-6 text-blue-600" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            Resumen de Stock
                        </h3>
                    </div>
                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800"
                    >
                        <Eye className="w-4 h-4" />
                        <span>{showDetails ? 'Ocultar' : 'Ver'} detalles</span>
                    </button>
                </div>

                {/* Métricas principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                            <Package className="w-5 h-5 text-blue-600" />
                            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                Total Productos
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-2">
                            {resumen.total_productos}
                        </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                            {getStockStatusIcon(resumen.productos_sin_stock)}
                            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                Sin Stock
                            </span>
                        </div>
                        <p className={`text-2xl font-bold mt-2 ${getStockStatusColor(resumen.productos_sin_stock)}`}>
                            {resumen.productos_sin_stock}
                        </p>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                            <AlertTriangle className="w-5 h-5 text-yellow-600" />
                            <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                Stock Bajo
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100 mt-2">
                            {resumen.productos_stock_bajo}
                        </p>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                            <span className="text-sm font-medium text-green-800 dark:text-green-200">
                                Valor Total
                            </span>
                        </div>
                        <p className="text-lg font-bold text-green-900 dark:text-green-100 mt-2">
                            {formatCurrency(resumen.valor_total_stock)}
                        </p>
                    </div>
                </div>

                {/* Estado general */}
                <div className={`p-4 rounded-lg border ${resumen.productos_sin_stock === 0
                        ? 'bg-green-50 border-green-200 text-green-800'
                        : resumen.productos_sin_stock <= 2
                            ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
                            : 'bg-red-50 border-red-200 text-red-800'
                    }`}>
                    <div className="flex items-center space-x-2">
                        {getStockStatusIcon(resumen.productos_sin_stock)}
                        <span className="font-medium">
                            {resumen.productos_sin_stock === 0
                                ? 'Todos los productos tienen stock disponible'
                                : resumen.productos_sin_stock <= 2
                                    ? `Atención: ${resumen.productos_sin_stock} producto(s) sin stock`
                                    : `Alerta: ${resumen.productos_sin_stock} productos sin stock`
                            }
                        </span>
                    </div>

                    {resumen.productos_stock_bajo > 0 && (
                        <p className="text-sm mt-2">
                            También hay {resumen.productos_stock_bajo} producto(s) con stock bajo.
                        </p>
                    )}
                </div>

                {/* Acciones rápidas */}
                {(resumen.productos_sin_stock > 0 || resumen.productos_stock_bajo > 0) && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {resumen.productos_sin_stock > 0 && (
                            <button
                                onClick={() => stockService.navigateToStockBajo()}
                                className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded-full hover:bg-red-200 transition-colors"
                            >
                                Ver productos sin stock
                            </button>
                        )}
                        {resumen.productos_stock_bajo > 0 && (
                            <button
                                onClick={() => stockService.navigateToStockBajo()}
                                className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full hover:bg-yellow-200 transition-colors"
                            >
                                Ver productos con stock bajo
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Modal de detalles expandidos */}
            {showDetails && (
                <div className="border-t border-gray-200 dark:border-zinc-700 p-6 bg-gray-50 dark:bg-zinc-800">
                    <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                        Análisis Detallado
                    </h4>

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Distribución del Stock
                                </h5>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Con stock:</span>
                                        <span className="text-sm font-medium text-green-600">
                                            {resumen.total_productos - resumen.productos_sin_stock} productos
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Sin stock:</span>
                                        <span className="text-sm font-medium text-red-600">
                                            {resumen.productos_sin_stock} productos
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Stock bajo:</span>
                                        <span className="text-sm font-medium text-yellow-600">
                                            {resumen.productos_stock_bajo} productos
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Porcentajes
                                </h5>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Disponibilidad:</span>
                                        <span className="text-sm font-medium text-green-600">
                                            {((resumen.total_productos - resumen.productos_sin_stock) / resumen.total_productos * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Sin stock:</span>
                                        <span className="text-sm font-medium text-red-600">
                                            {(resumen.productos_sin_stock / resumen.total_productos * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Stock bajo:</span>
                                        <span className="text-sm font-medium text-yellow-600">
                                            {(resumen.productos_stock_bajo / resumen.total_productos * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
