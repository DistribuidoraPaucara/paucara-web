import React, { useState, useEffect } from 'react';
import { AlertTriangle, Package, TrendingDown, X, Eye } from 'lucide-react';
import stockService, { ProductoStockBajo } from '@/infrastructure/services/stock.service';

interface StockBajoAlertsProps {
    className?: string;
    minimized?: boolean;
    onToggleMinimize?: () => void;
}

export default function StockBajoAlerts({
    className = '',
    minimized = false,
    onToggleMinimize
}: StockBajoAlertsProps) {
    const [productos, setProductos] = useState<ProductoStockBajo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        cargarProductosStockBajo();
    }, []);

    const cargarProductosStockBajo = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await stockService.obtenerProductosStockBajo();
            setProductos(data);
        } catch (err) {
            setError('Error al cargar productos con stock bajo');
            console.error('Error cargando productos con stock bajo:', err);
        } finally {
            setLoading(false);
        }
    };

    if (dismissed) {
        return null;
    }

    if (loading) {
        return (
            <div className={`bg-yellow-50 border-l-4 border-yellow-400 p-4 ${className}`}>
                <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin mr-3"></div>
                    <span className="text-yellow-800">Verificando stock de productos...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`bg-red-50 border-l-4 border-red-400 p-4 ${className}`}>
                <div className="flex justify-between items-start">
                    <div className="flex items-center">
                        <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                        <div>
                            <h3 className="text-red-800 font-medium">Error al verificar stock</h3>
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setDismissed(true)}
                        className="text-red-400 hover:text-red-600"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        );
    }

    if (productos.length === 0) {
        return null; // No mostrar nada si no hay productos con stock bajo
    }

    return (
        <div className={`bg-yellow-50 border-l-4 border-yellow-400 p-4 ${className}`}>
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <div className="flex items-center mb-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                        <h3 className="text-yellow-800 font-medium">
                            Stock bajo detectado
                        </h3>
                        {onToggleMinimize && (
                            <button
                                onClick={onToggleMinimize}
                                className="ml-2 text-yellow-600 hover:text-yellow-800"
                            >
                                <Eye className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {!minimized && (
                        <>
                            <p className="text-yellow-700 text-sm mb-3">
                                {productos.length} producto(s) tienen stock por debajo del mínimo recomendado.
                            </p>

                            <div className="space-y-2">
                                {productos.slice(0, 5).map((producto) => (
                                    <div
                                        key={producto.id}
                                        className="bg-white rounded-md p-3 border border-yellow-200"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900 text-sm">
                                                    {producto.nombre}
                                                </h4>
                                                <div className="flex items-center space-x-4 text-xs text-gray-600 mt-1">
                                                    <span className="flex items-center">
                                                        <Package className="w-3 h-3 mr-1" />
                                                        Stock: {producto.stock_actual}
                                                    </span>
                                                    <span className="flex items-center">
                                                        <TrendingDown className="w-3 h-3 mr-1" />
                                                        Mínimo: {producto.stock_minimo}
                                                    </span>
                                                </div>

                                                {producto.almacenes.length > 0 && (
                                                    <div className="mt-2">
                                                        <span className="text-xs text-gray-500">Por almacén:</span>
                                                        <div className="flex flex-wrap gap-1 mt-1">
                                                            {producto.almacenes.map((almacen, index) => (
                                                                <span
                                                                    key={`almacen-${almacen.almacen}-${index}`}
                                                                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                                                                >
                                                                    {almacen.almacen}: {almacen.cantidad}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="ml-4">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${producto.stock_actual === 0
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {producto.stock_actual === 0 ? 'Sin stock' : 'Stock bajo'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {productos.length > 5 && (
                                    <div className="text-center">
                                        <span className="text-yellow-700 text-sm">
                                            Y {productos.length - 5} producto(s) más...
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="mt-3 flex flex-wrap gap-2">
                                <button
                                    onClick={() => stockService.navigateToStockBajo()}
                                    className="text-sm bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700 transition-colors"
                                >
                                    Ver todos los productos
                                </button>
                                <button
                                    onClick={cargarProductosStockBajo}
                                    className="text-sm bg-white text-yellow-800 px-3 py-1 rounded border border-yellow-300 hover:bg-yellow-100 transition-colors"
                                >
                                    Actualizar
                                </button>
                            </div>
                        </>
                    )}

                    {minimized && (
                        <p className="text-yellow-700 text-sm">
                            {productos.length} producto(s) con stock bajo
                        </p>
                    )}
                </div>

                <button
                    onClick={() => setDismissed(true)}
                    className="text-yellow-400 hover:text-yellow-600 ml-4"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
