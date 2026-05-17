import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { FileText, Printer } from 'lucide-react';

interface VentaVendedorEstadoPago {
    usuario_id: number;
    vendedor_nombre: string;
    estado_pago: string;
    total_ventas: number;
    monto_total: number;
    monto_pagado: number;
    monto_pendiente: number;
}

interface Estadisticas {
    total_ventas: number;
    monto_total: number;
    descuentos_totales: number;
    ticket_promedio: number;
    clientes_unicos: number;
    vendedores: number;
}

interface Vendedor {
    id: number;
    name: string;
}

interface PorVendedorEstadoPagoProps {
    ventasPorVendedorEstadoPago: VentaVendedorEstadoPago[];
    estadisticas: Estadisticas;
    filtros: {
        fecha_inicio: string;
        fecha_fin: string;
        usuario_id?: number;
        estado_pago?: string;
    };
    vendedores: Vendedor[];
    estadosPago: string[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Reportes', href: '#' },
    { label: 'Ventas por Vendedor y Estado de Pago', href: '#' },
];

export default function PorVendedorEstadoPago({
    ventasPorVendedorEstadoPago,
    estadisticas,
    filtros,
    vendedores,
    estadosPago
}: PorVendedorEstadoPagoProps) {
    const [fechaInicio, setFechaInicio] = useState(filtros.fecha_inicio);
    const [fechaFin, setFechaFin] = useState(filtros.fecha_fin);
    const [usuarioId, setUsuarioId] = useState(filtros.usuario_id?.toString() || '');
    const [estadoPago, setEstadoPago] = useState(filtros.estado_pago || '');
    const [exportando, setExportando] = useState(false);

    const handleFiltrar = () => {
        router.get('/reportes/ventas/por-vendedor-estado-pago', {
            fecha_inicio: fechaInicio,
            fecha_fin: fechaFin,
            usuario_id: usuarioId || undefined,
            estado_pago: estadoPago || undefined,
        });
    };

    const handleExportar = async (formato: string) => {
        setExportando(true);
        router.post('/reportes/ventas/export', {
            tipo: 'por-vendedor-estado-pago',
            formato: formato,
            fecha_inicio: fechaInicio,
            fecha_fin: fechaFin,
            usuario_id: usuarioId || undefined,
            estado_pago: estadoPago || undefined,
        });
        setTimeout(() => setExportando(false), 2000);
    };

    const getEstadoColor = (estado: string) => {
        switch (estado) {
            case 'PAGADA':
                return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400';
            case 'PENDIENTE':
                return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400';
            case 'PARCIAL':
                return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400';
            default:
                return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
        }
    };

    return (
        <>
            <Head title="Reporte de Ventas por Vendedor y Estado de Pago" />

            <AppLayout breadcrumbs={breadcrumbs}>
                <div className="px-4 py-6 sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reporte de Ventas por Vendedor y Estado de Pago</h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Análisis de ventas por vendedor agrupadas por estado de pago</p>
                    </div>

                    {/* Estadísticas */}
                    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm dark:shadow-slate-900/50">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Ventas</p>
                            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{estadisticas.total_ventas}</p>
                        </div>
                        <div className="rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm dark:shadow-slate-900/50">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monto Total</p>
                            <p className="mt-2 text-2xl font-bold text-green-600 dark:text-green-400">
                                ${estadisticas.monto_total.toFixed(2)}
                            </p>
                        </div>
                        <div className="rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm dark:shadow-slate-900/50">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Vendedores</p>
                            <p className="mt-2 text-2xl font-bold text-indigo-600 dark:text-indigo-400">{estadisticas.vendedores}</p>
                        </div>
                        <div className="rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm dark:shadow-slate-900/50">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Clientes Únicos</p>
                            <p className="mt-2 text-2xl font-bold text-purple-600 dark:text-purple-400">{estadisticas.clientes_unicos}</p>
                        </div>
                    </div>

                    {/* Filtros */}
                    <div className="mb-6 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm dark:shadow-slate-900/50">
                        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Filtros</h2>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fecha Inicio</label>
                                <input
                                    type="date"
                                    value={fechaInicio}
                                    onChange={(e) => setFechaInicio(e.target.value)}
                                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fecha Fin</label>
                                <input
                                    type="date"
                                    value={fechaFin}
                                    onChange={(e) => setFechaFin(e.target.value)}
                                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Vendedor</label>
                                <select
                                    value={usuarioId}
                                    onChange={(e) => setUsuarioId(e.target.value)}
                                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400 sm:text-sm"
                                >
                                    <option value="">Todos</option>
                                    {vendedores.map(v => (
                                        <option key={v.id} value={v.id}>{v.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Estado de Pago</label>
                                <select
                                    value={estadoPago}
                                    onChange={(e) => setEstadoPago(e.target.value)}
                                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400 sm:text-sm"
                                >
                                    <option value="">Todos</option>
                                    {estadosPago.map(e => (
                                        <option key={e} value={e}>{e}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <button
                            onClick={handleFiltrar}
                            className="mt-4 inline-flex items-center rounded-md bg-blue-600 dark:bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                        >
                            Aplicar Filtros
                        </button>
                    </div>

                    {/* Tabla de Datos */}
                    <div className="mb-6 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm dark:shadow-slate-900/50 overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Vendedor</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Estado de Pago</th>
                                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">Total Ventas</th>
                                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">Monto Total</th>
                                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">Monto Pagado</th>
                                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">Monto Pendiente</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                                {ventasPorVendedorEstadoPago.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{item.vendedor_nombre}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getEstadoColor(item.estado_pago)}`}>
                                                {item.estado_pago}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm text-gray-900 dark:text-gray-100">{item.total_ventas}</td>
                                        <td className="px-6 py-4 text-right text-sm font-medium text-green-600 dark:text-green-400">
                                            ${item.monto_total.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm text-green-600 dark:text-green-400">
                                            ${item.monto_pagado.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm text-red-600 dark:text-red-400">
                                            ${item.monto_pendiente.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Botones de Exportación */}
                    <div className="rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm dark:shadow-slate-900/50">
                        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Descargar Reporte</h2>
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => handleExportar('excel')}
                                disabled={exportando}
                                className="inline-flex items-center gap-2 rounded-md bg-green-600 dark:bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 dark:hover:bg-green-600 disabled:opacity-50 transition-colors"
                            >
                                <FileText size={16} />
                                Excel
                            </button>
                            <button
                                onClick={() => handleExportar('pdf-a4')}
                                disabled={exportando}
                                className="inline-flex items-center gap-2 rounded-md bg-red-600 dark:bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 dark:hover:bg-red-600 disabled:opacity-50 transition-colors"
                            >
                                <FileText size={16} />
                                PDF A4
                            </button>
                            <button
                                onClick={() => handleExportar('pdf-80')}
                                disabled={exportando}
                                className="inline-flex items-center gap-2 rounded-md bg-orange-600 dark:bg-orange-700 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 dark:hover:bg-orange-600 disabled:opacity-50 transition-colors"
                            >
                                <Printer size={16} />
                                PDF 80mm
                            </button>
                            <button
                                onClick={() => handleExportar('pdf-58')}
                                disabled={exportando}
                                className="inline-flex items-center gap-2 rounded-md bg-amber-600 dark:bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 dark:hover:bg-amber-600 disabled:opacity-50 transition-colors"
                            >
                                <Printer size={16} />
                                PDF 58mm
                            </button>
                        </div>
                    </div>
                </div>
            </AppLayout>
        </>
    );
}
