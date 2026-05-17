import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { useAuth } from '@/application/hooks/use-auth';

// ✅ Interfaz específica para productos próximos a vencer
interface ProductoProximoVencer {
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
    dias_para_vencer: number;
}

interface PageProps extends InertiaPageProps {
    productos: ProductoProximoVencer[];
}

const breadcrumbs = [
    {
        title: 'Inventario',
        href: '/inventario',
    },
    {
        title: 'Próximos a Vencer',
        href: '/inventario/proximos-vencer',
    },
];

export default function ProximosVencer() {
    const { props } = usePage<PageProps>();
    const { productos: productosRaw } = props;
    const productos = Array.isArray(productosRaw) ? productosRaw : [];
    const { can } = useAuth();

    if (!can('inventario.proximos-vencer')) {
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

    const obtenerEstadoVencimiento = (dias: number) => {
        if (dias <= 7) {
            return {
                color: 'text-red-800 bg-red-100 dark:bg-red-900 dark:text-red-200',
                texto: 'Crítico'
            };
        } else if (dias <= 15) {
            return {
                color: 'text-orange-800 bg-orange-100 dark:bg-orange-900 dark:text-orange-200',
                texto: 'Urgente'
            };
        } else {
            return {
                color: 'text-yellow-800 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200',
                texto: 'Atención'
            };
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Productos Próximos a Vencer" />

            <div className="flex flex-col gap-6 p-4">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                            Productos Próximos a Vencer
                        </h2>
                        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                            Productos que vencen en los próximos 30 días
                        </p>
                    </div>
                </div>

                {/* Alert */}
                {productos.length > 0 && (
                    <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                        <div className="flex items-start">
                            <svg className="w-5 h-5 text-orange-400 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <h3 className="text-sm font-medium text-orange-800 dark:text-orange-200">
                                    {productos.length} producto{productos.length !== 1 ? 's' : ''} próximo{productos.length !== 1 ? 's' : ''} a vencer
                                </h3>
                                <p className="mt-1 text-sm text-orange-700 dark:text-orange-300">
                                    Revisa estos productos para evitar pérdidas por vencimiento.
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
                                ¡Perfecto!
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                No hay productos próximos a vencer en los próximos 30 días.
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
                                            Días Restantes
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Estado
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {productos.map((stockProducto) => {
                                        const estado = obtenerEstadoVencimiento(stockProducto.dias_para_vencer);

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
                                                    <div className="text-sm text-gray-900 dark:text-gray-100">
                                                        {formatearFecha(stockProducto.fecha_vencimiento)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className={`text-sm font-medium ${stockProducto.dias_para_vencer <= 7
                                                        ? 'text-red-600 dark:text-red-400'
                                                        : stockProducto.dias_para_vencer <= 15
                                                            ? 'text-orange-600 dark:text-orange-400'
                                                            : 'text-yellow-600 dark:text-yellow-400'
                                                        }`}>
                                                        {stockProducto.dias_para_vencer} día{stockProducto.dias_para_vencer !== 1 ? 's' : ''}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${estado.color}`}>
                                                        {estado.texto}
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
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Crítico (≤ 7 días)</p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                        {productos.filter(p => p.dias_para_vencer <= 7).length}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                                    <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Urgente (8-15 días)</p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                        {productos.filter(p => p.dias_para_vencer > 7 && p.dias_para_vencer <= 15).length}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                                    <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Atención (16-30 días)</p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                        {productos.filter(p => p.dias_para_vencer > 15).length}
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
