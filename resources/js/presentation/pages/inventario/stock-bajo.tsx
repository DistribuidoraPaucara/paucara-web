import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { useAuth } from '@/application/hooks/use-auth';

// ✅ Interfaz específica para productos con stock bajo
interface ProductoStockBajo {
    id: number;
    producto: {
        id: number;
        nombre: string;
        categoria: {
            nombre: string;
        };
    };
    almacen: {
        id: number;
        nombre: string;
    };
    stock_minimo: number;
    stock_actual: number;
    fecha_vencimiento?: string;
}

interface PageProps extends InertiaPageProps {
    productos: ProductoStockBajo[];
}

const breadcrumbs = [
    {
        title: 'Inventario',
        href: '/inventario',
    },
    {
        title: 'Stock Bajo',
        href: '/inventario/stock-bajo',
    },
];

export default function StockBajo() {
    const { props } = usePage<PageProps>();
    const { productos: productosRaw } = props;
    const productos = Array.isArray(productosRaw) ? productosRaw : [];
    const { can } = useAuth();

    if (!can('inventario.stock-bajo')) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Acceso Denegado" />
                <div className="text-center py-12">
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                        No tienes permisos para acceder a esta página
                    </h3>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Productos con Stock Bajo" />

            <div className="flex flex-col gap-6 p-4">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                            Productos con Stock Bajo
                        </h2>
                        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                            Productos que han alcanzado o están por debajo de su stock mínimo
                        </p>
                    </div>
                </div>

                {/* Alert */}
                {productos.length > 0 && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <div className="flex items-start">
                            <svg className="w-5 h-5 text-red-400 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <div>
                                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                                    ¡Atención! {productos.length} producto{productos.length !== 1 ? 's' : ''} con stock bajo
                                </h3>
                                <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                                    Es recomendable realizar pedidos para estos productos lo antes posible.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tabla de productos */}
                <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
                    {productos.length === 0 ? (
                        <div className="p-12 text-center">
                            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                ¡Excelente!
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                No hay productos con stock bajo en este momento.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Producto
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Categoría
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Almacén
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Stock Actual
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Stock Mínimo
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Diferencia
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Estado
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {productos.map((stockProducto) => {
                                        const diferencia = stockProducto.stock_actual - stockProducto.stock_minimo;
                                        const porcentaje = ((stockProducto.stock_actual / stockProducto.stock_minimo) * 100);

                                        return (
                                            <tr key={stockProducto.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        {stockProducto.producto.nombre}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {stockProducto.producto.categoria.nombre}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {stockProducto.almacen.nombre}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                        {stockProducto.stock_actual}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {stockProducto.stock_minimo}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className={`text-sm font-medium ${diferencia < 0
                                                        ? 'text-red-600 dark:text-red-400'
                                                        : 'text-orange-600 dark:text-orange-400'
                                                        }`}>
                                                        {diferencia > 0 ? '+' : ''}{diferencia}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${stockProducto.stock_actual === 0
                                                        ? 'text-red-800 bg-red-100 dark:bg-red-900 dark:text-red-200'
                                                        : diferencia < 0
                                                            ? 'text-red-800 bg-red-100 dark:bg-red-900 dark:text-red-200'
                                                            : porcentaje <= 50
                                                                ? 'text-orange-800 bg-orange-100 dark:bg-orange-900 dark:text-orange-200'
                                                                : 'text-yellow-800 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200'
                                                        }`}>
                                                        {stockProducto.stock_actual === 0
                                                            ? 'Sin Stock'
                                                            : diferencia < 0
                                                                ? 'Crítico'
                                                                : porcentaje <= 50
                                                                    ? 'Muy Bajo'
                                                                    : 'Bajo'
                                                        }
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Estadísticas resumidas */}
                {productos.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                                    <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Sin Stock</p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                        {productos.filter(p => p.stock_actual === 0).length}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                                    <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Crítico</p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                        {productos.filter(p => p.stock_actual > 0 && (p.stock_actual - p.stock_minimo) < 0).length}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                                    <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Bajo</p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                        {productos.filter(p => (p.stock_actual - p.stock_minimo) >= 0 && ((p.stock_actual / p.stock_minimo) * 100) <= 100).length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
