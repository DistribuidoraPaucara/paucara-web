/**
 * Página: Detalles del Análisis ABC
 *
 * Página para visualizar los detalles completos de un análisis ABC específico
 * Incluye histórico y recomendaciones automáticas
 */

import { Head, usePage, Link } from '@inertiajs/react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import AppLayout from '@/layouts/app-layout';
import { useAuth } from '@/application/hooks/use-auth';

interface AnalisisItem {
    id: number;
    producto_id: number;
    almacen_id: number;
    periodo_ano: number;
    periodo_mes: number | null;
    clasificacion_abc: string;
    clasificacion_xyz: string;
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
    analisis: AnalisisItem;
    historico: AnalisisItem[];
    recomendaciones: string[];
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

export default function AnalisisAbcShow() {
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

    const { analisis, historico, recomendaciones } = props;

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
            <Head title={`Análisis ABC - ${analisis.producto?.nombre}`} />

            <div className="p-6">
                {/* Header */}
                <div className="mb-8 flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            {analisis.producto?.nombre}
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Código: {analisis.producto?.codigo} | SKU: {analisis.producto?.sku}
                        </p>
                    </div>
                    <Link
                        href="/inventario/analisis-abc"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                        ← Volver
                    </Link>
                </div>

                {/* Información Principal */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {/* Clasificación ABC */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                            Clasificación ABC
                        </h3>
                        <div className="flex items-center gap-4">
                            <span
                                className={`inline-flex items-center justify-center w-16 h-16 rounded-full text-2xl font-bold ${getClasificacionColor(
                                    analisis.clasificacion_abc
                                )}`}
                            >
                                {analisis.clasificacion_abc}
                            </span>
                            <div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                    Ranking de Ventas
                                </p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    #{analisis.ranking_ventas}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Clasificación XYZ */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                            Rotación (XYZ)
                        </h3>
                        <div className="flex items-center gap-4">
                            <span
                                className={`inline-flex items-center justify-center w-16 h-16 rounded-full text-2xl font-bold ${getRotacionColor(
                                    analisis.clasificacion_xyz
                                )}`}
                            >
                                {analisis.clasificacion_xyz}
                            </span>
                            <div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                    Rotación Anual
                                </p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    {(analisis.rotacion_inventario || 0).toFixed(2)}x
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Almacén */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                            Almacén
                        </h3>
                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {analisis.almacen?.nombre}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                            Período: {analisis.periodo_ano}
                            {analisis.periodo_mes ? `-${String(analisis.periodo_mes).padStart(2, '0')}` : ''}
                        </p>
                    </div>
                </div>

                {/* Métricas Detalladas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                            Stock Promedio
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                            {(analisis.stock_promedio || 0).toFixed(2)}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                            Cantidad Vendida
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                            {(analisis.ventas_cantidad || 0).toFixed(2)}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                            Valor Total Ventas
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                            ${(analisis.ventas_valor || 0)?.toLocaleString('es-ES', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                            Precio de Venta
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                            ${analisis.producto?.precio_venta?.toLocaleString('es-ES', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recomendaciones */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                            Recomendaciones Automáticas
                        </h2>

                        {recomendaciones ? (
                            <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                {recomendaciones}
                            </div>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                No hay recomendaciones disponibles
                            </p>
                        )}
                    </div>

                    {/* Histórico */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                            Histórico (Últimos 5 Años)
                        </h2>

                        {historico && historico.length > 0 ? (
                            <div className="space-y-2">
                                {historico.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded text-sm"
                                    >
                                        <span className="text-gray-700 dark:text-gray-300">
                                            {item.periodo_ano}
                                        </span>
                                        <div className="flex gap-2">
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-medium ${getClasificacionColor(
                                                    item.clasificacion_abc
                                                )}`}
                                            >
                                                {item.clasificacion_abc}
                                            </span>
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-medium ${getRotacionColor(
                                                    item.clasificacion_xyz
                                                )}`}
                                            >
                                                {item.clasificacion_xyz}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                Sin datos históricos disponibles
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
