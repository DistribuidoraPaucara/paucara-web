import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { useAuth } from '@/application/hooks/use-auth';

// ✅ Interfaz específica para productos vencidos
interface ProductoVencido {
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
    stock_actual: number;
    fecha_vencimiento: string;
    dias_vencido: number;
}

interface PageProps extends InertiaPageProps {
    productos: ProductoVencido[];
}

const breadcrumbs = [
    {
        title: 'Inventario',
        href: '/inventario',
    },
    {
        title: 'Productos Vencidos',
        href: '/inventario/vencidos',
    },
];

export default function ProductosVencidos() {
    const { props } = usePage<PageProps>();
    const { productos: productosRaw } = props;
    const productos = Array.isArray(productosRaw) ? productosRaw : [];
    const { can } = useAuth();

    if (!can('inventario.vencidos')) {
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

    const formatearFecha = (fecha: string) => {
        return new Date(fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const obtenerSeveridadVencimiento = (dias: number) => {
        if (dias <= 30) {
            return {
                color: 'text-red-800 bg-red-100 dark:bg-red-900 dark:text-red-200',
                texto: 'Recientemente'
            };
        } else if (dias <= 90) {
            return {
                color: 'text-orange-800 bg-orange-100 dark:bg-orange-900 dark:text-orange-200',
                texto: 'Moderado'
            };
        } else {
            return {
                color: 'text-gray-800 bg-gray-100 dark:bg-gray-700 dark:text-gray-200',
                texto: 'Antiguo'
            };
        }
    };

    const calcularValorPerdida = (stock: number) => {
        // Estimación simple del valor perdido (se puede personalizar)
        return stock * 10; // Asumiendo un valor promedio de 10 por unidad
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Productos Vencidos" />

            <div className="flex flex-col gap-6 p-4">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                            Productos Vencidos
                        </h2>
                        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                            Productos que ya han superado su fecha de vencimiento
                        </p>
                    </div>
                </div>

                {/* Alert crítico */}
                {productos.length > 0 && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <div className="flex items-start">
                            <svg className="w-5 h-5 text-red-400 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <div>
                                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                                    {productos.length} producto{productos.length !== 1 ? 's' : ''} vencido{productos.length !== 1 ? 's' : ''}
                                </h3>
                                <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                                    Estos productos deben ser retirados del inventario inmediatamente por razones de seguridad.
                                </p>
                                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                                    <strong>Valor estimado perdido:</strong> ${productos.reduce((total, producto) => total + calcularValorPerdida(producto.stock_actual), 0).toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tabla de productos vencidos */}
                <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
                    {productos.length === 0 ? (
                        <div className="p-12 text-center">
                            <svg className="w-12 h-12 text-green-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                ¡Excelente!
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                No hay productos vencidos en el inventario.
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
                                            Stock
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Fecha Vencimiento
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Días Vencido
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Valor Perdido
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Estado
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {productos.map((stockProducto) => {
                                        const severidad = obtenerSeveridadVencimiento(stockProducto.dias_vencido);
                                        const valorPerdido = calcularValorPerdida(stockProducto.stock_actual);

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
                                                    <div className="text-sm font-semibold text-red-600 dark:text-red-400">
                                                        {stockProducto.stock_actual}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900 dark:text-gray-100">
                                                        {formatearFecha(stockProducto.fecha_vencimiento)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-red-600 dark:text-red-400">
                                                        {stockProducto.dias_vencido} día{stockProducto.dias_vencido !== 1 ? 's' : ''}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-semibold text-red-600 dark:text-red-400">
                                                        ${valorPerdido.toLocaleString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${severidad.color}`}>
                                                        {severidad.texto}
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

                {/* Estadísticas de pérdidas */}
                {productos.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                                    <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Valor Total Perdido</p>
                                    <p className="text-2xl font-semibold text-red-600 dark:text-red-400">
                                        ${productos.reduce((total, producto) => total + calcularValorPerdida(producto.stock_actual), 0).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                                    <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Unidades Vencidas</p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                        {productos.reduce((total, producto) => total + producto.stock_actual, 0)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                                    <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Reciente (≤30 días)</p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                        {productos.filter(p => p.dias_vencido <= 30).length}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                    <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Antiguo (&gt;90 días)</p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                        {productos.filter(p => p.dias_vencido > 90).length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Acciones recomendadas */}
                {productos.length > 0 && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                        <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-3">
                            Acciones Recomendadas
                        </h3>
                        <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                            <li className="flex items-start">
                                <svg className="w-4 h-4 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Retirar inmediatamente los productos vencidos del inventario
                            </li>
                            <li className="flex items-start">
                                <svg className="w-4 h-4 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Documentar las pérdidas para análisis futuro
                            </li>
                            <li className="flex items-start">
                                <svg className="w-4 h-4 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Revisar y mejorar las políticas de rotación de inventario
                            </li>
                            <li className="flex items-start">
                                <svg className="w-4 h-4 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Implementar alertas más tempranas para productos próximos a vencer
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
