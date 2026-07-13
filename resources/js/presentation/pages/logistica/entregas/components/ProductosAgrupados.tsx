import { AlertCircle, ChevronDown, ChevronUp, Loader, Package } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface ProductoAgrupado {
    producto_id: number;
    producto_nombre: string;
    sku: string;
    codigo_producto: string;
    cantidad_total: number;
    precio_unitario: number;
    subtotal: string;
    unidad_medida: string;
    ventas: Array<{
        venta_id: number;
        venta_numero: string;
        cantidad: number;
        cliente_id: number;
        cliente_nombre: string;
    }>;
}

interface ProductosAgrupadsResponse {
    entrega_id: number;
    numero_entrega: string;
    productos: ProductoAgrupado[];
    total_items: number;
    cantidad_total: number;
}

interface ProductosAgrupadsProps {
    entregaId: number;
    mostrarDetalleVentas?: boolean;
}

export default function ProductosAgrupados({ entregaId, mostrarDetalleVentas = true }: ProductosAgrupadsProps) {
    const [productos, setProductos] = useState<ProductosAgrupadsResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

    useEffect(() => {
        const cargarProductos = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await fetch(`/api/entregas/${entregaId}/productos-agrupados`);

                if (!response.ok) {
                    throw new Error(`Error al cargar productos: ${response.status}`);
                }

                const data = await response.json();

                if (!data.success) {
                    throw new Error(data.message || 'Error al cargar productos');
                }

                setProductos(data.data);
                console.log('✅ [PRODUCTOS_AGRUPADOS] Cargados:', data.data);
            } catch (err) {
                const mensaje = err instanceof Error ? err.message : 'Error desconocido';
                setError(mensaje);
                console.error('❌ [PRODUCTOS_AGRUPADOS] Error:', err);
            } finally {
                setIsLoading(false);
            }
        };

        cargarProductos();
    }, [entregaId]);

    const toggleExpanded = (productoId: number) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(productoId)) {
            newExpanded.delete(productoId);
        } else {
            newExpanded.add(productoId);
        }
        setExpandedRows(newExpanded);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader className="mr-2 h-6 w-6 animate-spin text-blue-500" />
                <span className="text-gray-600 dark:text-gray-400">Cargando productos...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
        );
    }

    if (!productos || productos.productos.length === 0) {
        return (
            <div className="flex items-center gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-yellow-600 dark:text-yellow-400" />
                <p className="text-sm text-yellow-800 dark:text-yellow-200">No hay productos en esta entrega</p>
            </div>
        );
    }

    // Calcular total general
    const totalGeneral = productos.productos.reduce((sum, p) => sum + parseFloat(p.subtotal), 0);

    return (
        <div className="space-y-6">
            {/* Header con resumen */}
            <div>
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                    <Package className="h-5 w-5 text-blue-500" />
                    Lista Generica de Productos en la Entrega # {productos.numero_entrega}
                </h2>

                {/* Tarjetas de resumen */}
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-50/50 p-4 dark:border-blue-800 dark:from-blue-900/20 dark:to-blue-900/10">
                        <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Tipos de Productos</p>
                        <p className="mt-1 text-3xl font-bold text-blue-900 dark:text-blue-100">{productos.total_items}</p>
                    </div>

                    <div className="rounded-lg border border-green-200 bg-gradient-to-br from-green-50 to-green-50/50 p-4 dark:border-green-800 dark:from-green-900/20 dark:to-green-900/10">
                        <p className="text-sm font-medium text-green-700 dark:text-green-300">Cantidad Total</p>
                        <p className="mt-1 text-3xl font-bold text-green-900 dark:text-green-100">{Math.floor(productos.cantidad_total)} unidades</p>
                    </div>

                    <div className="rounded-lg border border-orange-200 bg-gradient-to-br from-orange-50 to-orange-50/50 p-4 dark:border-orange-800 dark:from-orange-900/20 dark:to-orange-900/10">
                        <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Total General</p>
                        <p className="mt-1 text-3xl font-bold text-orange-900 dark:text-orange-100">Bs. {totalGeneral.toFixed(2)}</p>
                    </div>
                </div>
            </div>

            {/* Tabla de productos */}
            <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        {/* Header de tabla */}
                        <thead>
                            <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
                                <th className="w-12 px-4 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">#</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Producto</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">SKU</th>
                                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">Cantidad</th>
                                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">Precio Unitario</th>
                                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">Subtotal</th>
                                {mostrarDetalleVentas && (
                                    <th className="w-12 px-6 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">Detalles</th>
                                )}
                            </tr>
                        </thead>

                        {/* Body de tabla */}
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {/* Filas de productos */}
                            {productos.productos.map((producto, index) => (
                                <React.Fragment key={`producto-${producto.producto_id}`}>
                                    {/* Fila principal del producto */}
                                    <tr className="transition hover:bg-gray-50 dark:hover:bg-gray-800/30">
                                        <td className="px-4 py-4 text-center font-semibold text-gray-900 dark:text-white">{index + 1}</td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">{producto.producto_nombre}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-left text-gray-900 dark:text-white">
                                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{producto.sku}</p>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <span className="font-semibold text-gray-900 dark:text-white">
                                                    {producto.cantidad_total.toFixed(2)}
                                                </span>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{producto.unidad_medida}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right text-gray-900 dark:text-white">
                                            Bs. {producto.precio_unitario.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="font-semibold text-orange-600 dark:text-orange-400">Bs. {producto.subtotal}</span>
                                        </td>
                                        {mostrarDetalleVentas && (
                                            <td className="px-6 py-4 text-center">
                                                {producto.ventas.length > 0 && (
                                                    <button
                                                        onClick={() => toggleExpanded(producto.producto_id)}
                                                        className="rounded p-1 transition hover:bg-gray-200 dark:hover:bg-gray-700"
                                                        title={expandedRows.has(producto.producto_id) ? 'Ocultar' : 'Ver detalles'}
                                                    >
                                                        {expandedRows.has(producto.producto_id) ? (
                                                            <ChevronUp className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                                        ) : (
                                                            <ChevronDown className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                                        )}
                                                    </button>
                                                )}
                                            </td>
                                        )}
                                    </tr>

                                    {/* Fila expandible - Detalles de ventas */}
                                    {mostrarDetalleVentas && expandedRows.has(producto.producto_id) && producto.ventas.length > 0 && (
                                        <tr className="bg-gray-50 dark:bg-gray-800/20">
                                            <td colSpan={7} className="px-6 py-4">
                                                <div className="space-y-2">
                                                    <p className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                        Ventas ({producto.ventas.length}):
                                                    </p>
                                                    <div className="space-y-2">
                                                        {producto.ventas.map((venta, idx) => (
                                                            <div
                                                                key={`${venta.venta_id}-${idx}`}
                                                                className="grid grid-cols-6 gap-4 rounded border border-gray-200 bg-white p-3 text-sm dark:border-gray-700 dark:bg-gray-800/50"
                                                            >
                                                                <div>
                                                                    <p className="font-medium text-gray-900 dark:text-white">{venta.venta_id}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium text-gray-900 dark:text-white">{venta.venta_numero}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium text-gray-600 dark:text-gray-400">{venta.cliente_nombre}</p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="font-semibold text-gray-900 dark:text-white">
                                                                        {venta.cantidad.toFixed(2)} | {producto.unidad_medida}
                                                                    </p>
                                                                </div>
                                                                <div className="text-right">
                                                                    {/* <p className="text-xs text-gray-500">Cliente ID: {venta.cliente_id}</p> */}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}

                            {/* Fila de totales */}
                            <tr className="border-t-2 border-gray-200 bg-gray-100 font-semibold dark:border-gray-700 dark:bg-gray-800">
                                <td></td>
                                <td className="px-6 py-4 text-gray-900 dark:text-white">TOTAL</td>
                                <td></td>
                                <td className="px-6 py-4 text-right text-gray-900 dark:text-white">{productos.cantidad_total.toFixed(2)}</td>
                                <td className="px-6 py-4"></td>
                                <td className="px-6 py-4 text-right text-orange-600 dark:text-orange-400">Bs. {totalGeneral.toFixed(2)}</td>
                                {mostrarDetalleVentas && <td></td>}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
