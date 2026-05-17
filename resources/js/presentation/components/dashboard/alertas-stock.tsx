import { AlertTriangle, Package, Warehouse } from 'lucide-react';

interface AlertasStockProps {
    alertas: {
        stock_bajo: number;
        stock_critico: number;
        productos_afectados: Array<{
            producto: string;
            almacen: string;
            cantidad_actual: number;
            stock_minimo: number;
        }>;
    };
    loading?: boolean;
    className?: string;
}

export function AlertasStock({ alertas, loading = false, className = '' }: AlertasStockProps) {
    if (loading) {
        return (
            <div className={`rounded-lg border border-sidebar-border/70 bg-sidebar p-6 dark:border-sidebar-border ${className}`}>
                <h3 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    Alertas de Stock
                </h3>
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
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    Alertas de Stock
                </h3>
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
            </div>

            {alertas.productos_afectados && alertas.productos_afectados.length > 0 ? (
                <div className="space-y-3">
                    {alertas.productos_afectados.map((producto) => {
                        const esCritico = producto.cantidad_actual <= (producto.stock_minimo * 0.5);

                        return (
                            <div
                                key={`${producto.producto}-${producto.almacen}`}
                                className={`flex items-center gap-3 rounded-lg border p-3 ${esCritico
                                        ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                                        : 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20'
                                    }`}
                            >
                                <div className={`rounded-full p-2 ${esCritico
                                        ? 'bg-red-100 dark:bg-red-900/40'
                                        : 'bg-amber-100 dark:bg-amber-900/40'
                                    }`}>
                                    {esCritico ? (
                                        <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                                    ) : (
                                        <Package className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                    )}
                                </div>

                                <div className="flex-1">
                                    <p className="font-medium text-neutral-900 dark:text-neutral-100">
                                        {producto.producto}
                                    </p>
                                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                                        <Warehouse className="h-3 w-3" />
                                        <span>{producto.almacen}</span>
                                        <span>•</span>
                                        <span>
                                            Stock: {producto.cantidad_actual} / Mín: {producto.stock_minimo}
                                        </span>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className={`text-sm font-medium ${esCritico
                                            ? 'text-red-600 dark:text-red-400'
                                            : 'text-amber-600 dark:text-amber-400'
                                        }`}>
                                        {esCritico ? 'Crítico' : 'Bajo'}
                                    </p>
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                        {producto.cantidad_actual} unidades
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center gap-2 py-8 text-center">
                    <Package className="h-12 w-12 text-neutral-400 dark:text-neutral-500" />
                    <p className="text-neutral-600 dark:text-neutral-400">
                        No hay alertas de stock
                    </p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Todos los productos tienen stock adecuado
                    </p>
                </div>
            )}
        </div>
    );
}
