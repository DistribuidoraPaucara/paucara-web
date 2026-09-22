import { TrendingUp, Package, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface ProductosMasVendidosProps {
    productos: Array<{
        nombre: string;
        total_vendido: number;
        ingresos_total: number;
    }>;
    loading?: boolean;
    className?: string;
}

export function ProductosMasVendidos({ productos, loading = false, className = '' }: ProductosMasVendidosProps) {
    const [mostrarTodos, setMostrarTodos] = useState(false);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-BO', {
            style: 'currency',
            currency: 'BOB',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const productosVisibles = mostrarTodos ? productos : productos.slice(0, 3);

    if (loading) {
        return (
            <div className={`rounded-lg border border-sidebar-border/70 bg-sidebar p-6 dark:border-sidebar-border ${className}`}>
                <h3 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    Productos Más Vendidos
                </h3>
                <div className="animate-pulse space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={`product-skeleton-${i}`} className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded bg-neutral-300 dark:bg-neutral-700"></div>
                            <div className="flex-1">
                                <div className="h-4 w-32 rounded bg-neutral-300 dark:bg-neutral-700"></div>
                                <div className="mt-1 h-3 w-24 rounded bg-neutral-300 dark:bg-neutral-700"></div>
                            </div>
                            <div className="h-4 w-16 rounded bg-neutral-300 dark:bg-neutral-700"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!productos || productos.length === 0) {
        return (
            <div className={`rounded-lg border border-sidebar-border/70 bg-sidebar p-6 dark:border-sidebar-border ${className}`}>
                <h3 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    Productos Más Vendidos
                </h3>
                <div className="flex flex-col items-center gap-2 py-8 text-center">
                    <Package className="h-12 w-12 text-neutral-400 dark:text-neutral-500" />
                    <p className="text-neutral-600 dark:text-neutral-400">
                        No hay datos de ventas
                    </p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Los productos más vendidos aparecerán aquí
                    </p>
                </div>
            </div>
        );
    }

    const maxVendido = Math.max(...productos.map(p => p.total_vendido));

    return (
        <div className={`rounded-lg border border-sidebar-border/70 bg-sidebar p-6 dark:border-sidebar-border ${className}`}>
            <div className="mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    Productos Más Vendidos
                </h3>
            </div>

            <div className="space-y-4">
                {productosVisibles.map((producto, index) => {
                    const porcentaje = (producto.total_vendido / maxVendido) * 100;

                    return (
                        <div key={`${producto.nombre}-${producto.total_vendido}`} className="group relative">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                        #{index + 1}
                                    </div>
                                    <div>
                                        <p className="font-medium text-neutral-900 dark:text-neutral-100">
                                            {producto.nombre}
                                        </p>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                            {producto.total_vendido} unidades vendidas
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium text-neutral-900 dark:text-neutral-100">
                                        {formatCurrency(producto.ingresos_total)}
                                    </p>
                                </div>
                            </div>

                            {/* Barra de progreso */}
                            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500 ease-out"
                                    style={{ width: `${porcentaje}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {productos.length > 3 && (
                <button
                    onClick={() => setMostrarTodos(!mostrarTodos)}
                    className="mt-4 w-full flex items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100 transition-colors dark:border-emerald-900/30 dark:bg-emerald-900/20 dark:text-emerald-300 dark:hover:bg-emerald-900/30"
                >
                    {mostrarTodos ? (
                        <>
                            <span>Ver menos</span>
                            <ChevronDown className="h-4 w-4 rotate-180" />
                        </>
                    ) : (
                        <>
                            <span>Ver más productos ({productos.length - 3})</span>
                            <ChevronDown className="h-4 w-4" />
                        </>
                    )}
                </button>
            )}

            <div className="mt-4 rounded-lg bg-neutral-50 p-3 dark:bg-neutral-800/50">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    📊 Datos de los últimos 30 días
                </p>
            </div>
        </div>
    );
}
