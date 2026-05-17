import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { DollarSign, Package, CheckCircle, AlertCircle } from 'lucide-react';

interface ChoferStats {
    chofer_id: number;
    chofer_nombre: string;
    total_confirmaciones: number;
    completas: number;
    con_novedad: number;
    con_problemas: number;
    dinero_recibido: number;
}

interface User {
    id: number;
    name: string;
}

interface EntregasPorChoferProps {
    choferes: ChoferStats[];
    totales: {
        total_confirmaciones: number;
        total_completas: number;
        total_novedad: number;
        total_dinero: number;
    };
    filtros: {
        fecha_desde?: string;
        fecha_hasta?: string;
        chofer_id?: number;
    };
    choferesList: User[];
    fecha_desde: string;
    fecha_hasta: string;
    error?: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Reportes', href: '#' },
    { title: 'Entregas por Chofer', href: '#' },
];

const getProgressColor = (porcentaje: number): string => {
    if (porcentaje >= 90) return 'bg-green-500';
    if (porcentaje >= 70) return 'bg-blue-500';
    if (porcentaje >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
};

export default function EntregasPorChofer({
    choferes,
    totales,
    filtros,
    choferesList,
    fecha_desde,
    fecha_hasta,
    error,
}: EntregasPorChoferProps) {
    const [fechaDesde, setFechaDesde] = useState(filtros.fecha_desde || fecha_desde);
    const [fechaHasta, setFechaHasta] = useState(filtros.fecha_hasta || fecha_hasta);
    const [choferIdSeleccionado, setChoferIdSeleccionado] = useState(
        filtros.chofer_id?.toString() || ''
    );

    const handleFiltrar = () => {
        const params: Record<string, any> = {
            fecha_desde: fechaDesde,
            fecha_hasta: fechaHasta,
        };
        if (choferIdSeleccionado) {
            params.chofer_id = parseInt(choferIdSeleccionado);
        }
        router.get('/reportes/ventas/entregas-por-chofer', params);
    };

    const calcularPorcentaje = (parte: number, total: number): number => {
        return total === 0 ? 0 : (parte / total) * 100;
    };

    return (
        <>
            <Head title="Entregas por Chofer" />

            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="px-4 py-6 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Entregas por Chofer</h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Reporte detallado de entregas realizadas por cada chofer
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 rounded-lg bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-800 dark:text-red-200">
                            {error}
                        </div>
                    )}

                    {/* Panel de Filtros */}
                    <div className="mb-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
                        <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Filtros</h3>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Desde</label>
                                <input
                                    type="date"
                                    value={fechaDesde}
                                    onChange={(e) => setFechaDesde(e.target.value)}
                                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Hasta</label>
                                <input
                                    type="date"
                                    value={fechaHasta}
                                    onChange={(e) => setFechaHasta(e.target.value)}
                                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Chofer</label>
                                <select
                                    value={choferIdSeleccionado}
                                    onChange={(e) => setChoferIdSeleccionado(e.target.value)}
                                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-white"
                                >
                                    <option value="">Todos los choferes</option>
                                    {choferesList.map((chofer) => (
                                        <option key={chofer.id} value={chofer.id.toString()}>
                                            {chofer.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-end">
                                <button
                                    onClick={handleFiltrar}
                                    className="w-full rounded-md bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm font-medium text-white transition-colors"
                                >
                                    Buscar
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Tarjetas de Resumen */}
                    <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-lg border border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-900/20 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-blue-600 dark:text-blue-400">Total Entregas</p>
                                    <p className="mt-2 text-2xl font-bold text-blue-900 dark:text-blue-200">
                                        {totales.total_confirmaciones}
                                    </p>
                                </div>
                                <Package className="h-8 w-8 text-blue-600 dark:text-blue-400 opacity-50" />
                            </div>
                        </div>

                        <div className="rounded-lg border border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-900/20 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-green-600 dark:text-green-400">Completas</p>
                                    <p className="mt-2 text-2xl font-bold text-green-900 dark:text-green-200">
                                        {totales.total_completas}
                                    </p>
                                    <p className="text-xs text-green-600 dark:text-green-400">
                                        {calcularPorcentaje(
                                            totales.total_completas,
                                            totales.total_confirmaciones
                                        ).toFixed(1)}
                                        %
                                    </p>
                                </div>
                                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400 opacity-50" />
                            </div>
                        </div>

                        <div className="rounded-lg border border-yellow-200 dark:border-yellow-900/50 bg-yellow-50 dark:bg-yellow-900/20 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-yellow-600 dark:text-yellow-400">Con Novedad</p>
                                    <p className="mt-2 text-2xl font-bold text-yellow-900 dark:text-yellow-200">
                                        {totales.total_novedad}
                                    </p>
                                    <p className="text-xs text-yellow-600 dark:text-yellow-400">
                                        {calcularPorcentaje(
                                            totales.total_novedad,
                                            totales.total_confirmaciones
                                        ).toFixed(1)}
                                        %
                                    </p>
                                </div>
                                <AlertCircle className="h-8 w-8 text-yellow-600 dark:text-yellow-400 opacity-50" />
                            </div>
                        </div>

                        <div className="rounded-lg border border-purple-200 dark:border-purple-900/50 bg-purple-50 dark:bg-purple-900/20 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-purple-600 dark:text-purple-400">Dinero Recibido</p>
                                    <p className="mt-2 text-2xl font-bold text-purple-900 dark:text-purple-200">
                                        Bs. {totales.total_dinero.toFixed(2)}
                                    </p>
                                </div>
                                <DollarSign className="h-8 w-8 text-purple-600 dark:text-purple-400 opacity-50" />
                            </div>
                        </div>
                    </div>

                    {/* Tabla de Choferes */}
                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
                        {choferes.length === 0 ? (
                            <div className="py-12 px-6 text-center">
                                <Package className="mx-auto h-12 w-12 text-gray-400" />
                                <p className="mt-4 text-gray-500 dark:text-gray-400">No hay datos disponibles</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-900/50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                                Chofer
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                                Total
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                                Completas
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                                Con Novedad
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                                Problemas
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                                Dinero Recibido
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                                Progreso
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {choferes.map((chofer) => {
                                            const porcentajeCompletas = calcularPorcentaje(
                                                chofer.completas,
                                                chofer.total_confirmaciones
                                            );

                                            return (
                                                <tr
                                                    key={chofer.chofer_id}
                                                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <p className="font-medium text-gray-900 dark:text-white">
                                                            {chofer.chofer_nombre}
                                                        </p>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center font-medium">
                                                        {chofer.total_confirmaciones}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                                        <span className="inline-flex items-center rounded-md bg-green-50 dark:bg-green-900/20 px-2 py-1 text-xs font-medium text-green-700 dark:text-green-200">
                                                            {chofer.completas}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                                        <span className="inline-flex items-center rounded-md bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 text-xs font-medium text-yellow-700 dark:text-yellow-200">
                                                            {chofer.con_novedad}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                                        <span className="inline-flex items-center rounded-md bg-red-50 dark:bg-red-900/20 px-2 py-1 text-xs font-medium text-red-700 dark:text-red-200">
                                                            {chofer.con_problemas}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right font-semibold">
                                                        Bs. {chofer.dinero_recibido.toFixed(2)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-2 w-20 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                                                                <div
                                                                    className={`h-full transition-all ${getProgressColor(
                                                                        porcentajeCompletas
                                                                    )}`}
                                                                    style={{
                                                                        width: `${porcentajeCompletas}%`,
                                                                    }}
                                                                />
                                                            </div>
                                                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 w-10">
                                                                {porcentajeCompletas.toFixed(0)}%
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </AppLayout>
        </>
    );
}
