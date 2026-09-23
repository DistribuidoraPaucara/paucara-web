import { AlertTriangle, Package, Warehouse, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface AlertasStockProps {
    alertas: {
        stock_bajo: number;
        stock_critico: number;
        productos_afectados: Array<{
            id?: number;
            sku?: string;
            producto: string;
            almacen: string;
            cantidad_actual: number;
            stock_minimo: number;
            cantidad_almacenes: number;
            detalles_almacenes?: Array<{
                almacen: string;
                cantidad: number;
            }>;
        }>;
    };
    loading?: boolean;
    className?: string;
}

const formatearCantidad = (cantidad: number | string): string => {
    const num = typeof cantidad === 'string' ? parseFloat(cantidad) : cantidad;
    return Number.isInteger(num) ? num.toString() : num.toFixed(2).replace(/\.?0+$/, '');
};

export function AlertasStock({ alertas, loading = false, className = '' }: AlertasStockProps) {
    const [mostrarDetalles, setMostrarDetalles] = useState(false);
    const [mostrarTodos, setMostrarTodos] = useState(false);
    const [productosCompletos, setProductosCompletos] = useState<any[]>([]);
    const [cargandoCompleto, setCargandoCompleto] = useState(false);

    const cargarProductosCompletos = async () => {
        if (productosCompletos.length > 0) {
            setMostrarTodos(!mostrarTodos);
            return;
        }

        setCargandoCompleto(true);
        try {
            const response = await fetch('/admin/alertas-stock-completo');
            const data = await response.json();
            setProductosCompletos(data.productos_afectados || []);
            setMostrarTodos(true);
            console.log('✅ Alertas Stock Completo Cargadas:', data);
        } catch (error) {
            console.error('❌ Error cargando alertas completas:', error);
        } finally {
            setCargandoCompleto(false);
        }
    };

    if (loading) {
        return (
            <div className={`rounded-lg border border-sidebar-border/70 bg-sidebar p-6 dark:border-sidebar-border ${className}`}>
                <h3 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">Alertas de Stock</h3>
                <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={`alert-skeleton-${i}`} className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded bg-neutral-300 dark:bg-neutral-700"></div>
                            <div className="flex-1">
                                <div className="h-4 w-32 rounded bg-neutral-300 dark:bg-neutral-700"></div>
                                <div className="mt-1 h-3 w-24 rounded bg-neutral-300 dark:bg-neutral-700"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className={`rounded-lg border border-sidebar-border/70 bg-sidebar p-6 dark:border-sidebar-border ${className}`}>
            <div className="flex items-center justify-between">
                <button
                    onClick={() => setMostrarDetalles(!mostrarDetalles)}
                    className="flex-1 flex items-center justify-between hover:opacity-80 transition-opacity"
                >
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Alertas de Stock</h3>
                    <div className="flex items-center gap-3">
                        <div className="flex gap-2">
                            {alertas.stock_critico > 0 && (
                                <span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
                                    <AlertTriangle className="h-3 w-3" />
                                    {alertas.stock_critico} crítico
                                </span>
                            )}
                            {alertas.stock_bajo > 0 && (
                                <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                    <Package className="h-3 w-3" />
                                    {alertas.stock_bajo} bajo
                                </span>
                            )}
                        </div>
                        <ChevronDown className={`h-5 w-5 text-neutral-500 dark:text-neutral-400 transition-transform ${mostrarDetalles ? 'rotate-180' : ''}`} />
                    </div>
                </button>

                <button
                    onClick={cargarProductosCompletos}
                    disabled={cargandoCompleto}
                    className="ml-2 px-3 py-1 rounded text-xs font-medium bg-neutral-200 text-neutral-800 hover:bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-600 disabled:opacity-50 transition-colors"
                    title={mostrarTodos ? 'Mostrar solo top 5' : 'Ver todos los productos con stock bajo'}
                >
                    {cargandoCompleto ? '⏳ Cargando...' : mostrarTodos ? 'Top 5' : `Ver todos (${alertas.stock_bajo + alertas.stock_critico})`}
                </button>
            </div>

            {(mostrarDetalles || mostrarTodos) && (
                <div className="mt-4">
                    {(mostrarTodos ? productosCompletos : alertas.productos_afectados) && (mostrarTodos ? productosCompletos : alertas.productos_afectados).length > 0 ? (
                        <div className="grid gap-3 sm:grid-cols-2">
                            {(mostrarTodos ? productosCompletos : alertas.productos_afectados).map((producto) => {
                                const esCritico = producto.cantidad_actual <= producto.stock_minimo * 0.5;

                                return (
                                    <div
                                        key={`${producto.producto}-${producto.almacen}`}
                                        className={`flex flex-col gap-2 rounded-lg border p-3 ${
                                            esCritico
                                                ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                                                : 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20'
                                        }`}
                                    >
                                        <div className="flex items-start gap-2">
                                            <div className={`rounded p-1.5 ${esCritico ? 'bg-red-100 dark:bg-red-900/40' : 'bg-amber-100 dark:bg-amber-900/40'}`}>
                                                {esCritico ? (
                                                    <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                                                ) : (
                                                    <Package className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-medium text-neutral-900 dark:text-neutral-100">{producto.producto}</p>
                                                    {producto.sku && (
                                                        <span className="text-xs px-2 py-0.5 rounded bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300">
                                                            {producto.sku}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                                                    {producto.id && <span>ID: {producto.id}</span>}
                                                    <Warehouse className="h-3 w-3" />
                                                    <p>
                                                        {producto.cantidad_almacenes && producto.cantidad_almacenes > 1
                                                            ? `${producto.cantidad_almacenes} almacenes`
                                                            : producto.almacen}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="border-t border-current border-opacity-10 pt-2">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                                                    Stock Total: <span className="font-medium text-neutral-900 dark:text-neutral-100">{formatearCantidad(producto.cantidad_actual)}</span> {producto.stock_minimo > 0 ? `/ ${producto.stock_minimo}` : '(sin mínimo)'}
                                                </p>
                                                <span
                                                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                                                        esCritico ? 'bg-red-200 text-red-700 dark:bg-red-900/40 dark:text-red-400' : 'bg-amber-200 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
                                                    }`}
                                                >
                                                    {esCritico ? 'Crítico' : 'Bajo'}
                                                </span>
                                            </div>

                                            {producto.detalles_almacenes && producto.detalles_almacenes.length > 1 && (
                                                <div className="text-xs space-y-1 mt-2">
                                                    <p className="font-medium text-neutral-700 dark:text-neutral-300">Desglose por almacén:</p>
                                                    {producto.detalles_almacenes?.map((detalle) => (
                                                        <div key={detalle.almacen} className="flex justify-between text-neutral-600 dark:text-neutral-400">
                                                            <span>{detalle.almacen}:</span>
                                                            <span className="font-medium">{formatearCantidad(detalle.cantidad)} u.</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2 py-8 text-center">
                            <Package className="h-12 w-12 text-neutral-400 dark:text-neutral-500" />
                            <p className="text-neutral-600 dark:text-neutral-400">No hay alertas de stock</p>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">Todos los productos tienen stock adecuado</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
