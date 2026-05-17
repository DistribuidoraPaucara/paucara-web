/**
 * Página: Análisis ABC de Inventario
 *
 * Página para visualizar y gestionar el análisis ABC de productos en inventario
 * Clasifica productos según su importancia (A, B, C) y rotación (X, Y, Z)
 */

import { Head, usePage, Link } from '@inertiajs/react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import AppLayout from '@/layouts/app-layout';
import { useAuth } from '@/application/hooks/use-auth';
import type { Paginator } from '@/domain/types/pagination';

interface AnalisisItem {
    id: number;
    producto_id: number;
    almacen_id: number;
    periodo_ano: number;
    periodo_mes: number | null;
    clasificacion_abc: string; // 'A', 'B', 'C'
    clasificacion_xyz: string; // 'X', 'Y', 'Z'
    ranking_ventas: number;
    ventas_cantidad: number;
    ventas_valor: number;
    stock_promedio: number;
    rotacion_inventario: number;
    dias_cobertura: number;
    tiene_movimientos: boolean;
    recomendaciones?: string;
    producto?: {
        id: number;
        nombre: string;
        codigo: string;
        sku: string;
        precio_venta?: number;
    };
    almacen?: {
        id: number;
        nombre: string;
    };
}

interface PageProps extends InertiaPageProps {
    analisis: Paginator<AnalisisItem>;
    resumen: {
        total_productos: number;
        productos_clase_a: number;
        productos_clase_b: number;
        productos_clase_c: number;
        valor_total_ventas: number;
        valor_clase_a: number;
        porcentaje_clase_a: number;
    };
    filtros: {
        ano: number;
        mes?: number;
        almacen_id?: number;
        clasificacion_abc?: string;
        clasificacion_xyz?: string;
        buscar?: string;
        order_by?: string;
        order_direction?: string;
    };
    almacenes: Array<{
        id: number;
        nombre: string;
    }>;
}

const breadcrumbs = [
    {
        title: 'Inventario',
        href: '/inventario',
    },
    {
        title: 'Análisis ABC',
        href: '/inventario/analisis-abc',
    },
];

export default function AnalisisAbcIndex() {
    const { props } = usePage<PageProps>();
    const { can } = useAuth();

    if (!can('inventario.analisis.manage')) {
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

    const { analisis, resumen, filtros, almacenes } = props;

    const getClasificacionColor = (clasificacion: string) => {
        switch (clasificacion) {
            case 'A':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case 'B':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'C':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    const getRotacionColor = (clasificacion: string) => {
        switch (clasificacion) {
            case 'X':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'Y':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
            case 'Z':
                return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Análisis ABC de Inventario" />

            <div className="p-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        Análisis ABC de Inventario
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Clasificación de productos según su importancia en ventas y rotación
                    </p>
                </div>

                {/* Resumen de Estadísticas */}
                {resumen && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="flex-1">
                                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                                        Total de Productos
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                                        {resumen.total_productos || 0}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="flex-1">
                                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                                        Productos Clase A
                                    </p>
                                    <p className="text-2xl font-bold text-red-600 mt-2">
                                        {resumen.productos_clase_a || 0}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {(resumen.porcentaje_clase_a || 0).toFixed(1)}% de valor
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="flex-1">
                                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                                        Productos Clase B
                                    </p>
                                    <p className="text-2xl font-bold text-yellow-600 mt-2">
                                        {resumen.productos_clase_b || 0}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="flex-1">
                                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                                        Productos Clase C
                                    </p>
                                    <p className="text-2xl font-bold text-green-600 mt-2">
                                        {resumen.productos_clase_c || 0}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tabla de Análisis */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Producto
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Almacén
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Clasificación
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Rotación
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Stock
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Valor Ventas
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {analisis.data.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {item.producto?.nombre}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {item.producto?.codigo}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-900 dark:text-gray-100">
                                                {item.almacen?.nombre}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex gap-2">
                                                <span
                                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getClasificacionColor(
                                                        item.clasificacion_abc
                                                    )}`}
                                                >
                                                    {item.clasificacion_abc}
                                                </span>
                                                <span
                                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRotacionColor(
                                                        item.clasificacion_xyz
                                                    )}`}
                                                >
                                                    {item.clasificacion_xyz}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-900 dark:text-gray-100">
                                                {(item.rotacion_inventario || 0).toFixed(2)}x
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-900 dark:text-gray-100">
                                                {(item.stock_promedio || 0).toFixed(2)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                ${(item.ventas_valor || 0)?.toLocaleString('es-ES', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Link
                                                href={`/inventario/analisis-abc/${item.id}`}
                                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                                            >
                                                Ver detalles
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {analisis.data.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500 dark:text-gray-400">
                                No hay datos de análisis ABC disponibles
                            </p>
                        </div>
                    )}

                    {/* Paginación */}
                    {analisis.last_page > 1 && (
                        <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
                            <div className="flex-1 flex justify-between sm:hidden">
                                {analisis.current_page > 1 && (
                                    <Link
                                        href={`/inventario/analisis-abc?page=${analisis.current_page - 1}`}
                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                                    >
                                        Anterior
                                    </Link>
                                )}
                                {analisis.current_page < analisis.last_page && (
                                    <Link
                                        href={`/inventario/analisis-abc?page=${analisis.current_page + 1}`}
                                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                                    >
                                        Siguiente
                                    </Link>
                                )}
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        Mostrando página{' '}
                                        <span className="font-medium">{analisis.current_page}</span> de{' '}
                                        <span className="font-medium">{analisis.last_page}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
