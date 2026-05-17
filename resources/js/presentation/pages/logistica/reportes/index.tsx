import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/presentation/components/ui/button';
import { Badge } from '@/presentation/components/ui/badge';
import {
    Search,
    Filter,
    Download,
    Printer,
    Eye,
    ArrowLeft,
    CheckSquare,
    Square,
    Archive,
} from 'lucide-react';
import { useState } from 'react';
import { ReporteCarga } from '@/domain/entities/entregas';
import { Empleado } from '@/domain/entities/empleados';
import { Vehiculo } from '@/domain/entities/vehiculos';
import type { Id } from '@/domain/entities/shared';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationMeta {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
}

interface Props {
    reportes: {
        data: ReporteCarga[];
        links: PaginationLink[];
        meta: PaginationMeta;
    };
    choferes: Empleado[];
    vehiculos: Vehiculo[];
    estados: Record<string, string>;
    estadisticas: {
        total_reportes: number;
        pendientes: number;
        confirmados: number;
        entregados: number;
        peso_total: number;
        entregas_total: number;
    };
    filtros: {
        estado?: string;
        fecha_desde?: string;
        fecha_hasta?: string;
        chofer_id?: number;
        vehiculo_id?: number;
        search?: string;
    };
}

const estadoColorMap: Record<string, string> = {
    PENDIENTE: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200',
    CONFIRMADO: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
    ENTREGADO: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
    CANCELADO: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100',
};

export default function ReportesIndex({
    reportes: initialReportes,
    choferes,
    vehiculos,
    estados,
    estadisticas,
    filtros: initialFiltros,
}: Props) {
    const [selectedReportes, setSelectedReportes] = useState<Id[]>([]);
    const [filtros, setFiltros] = useState(initialFiltros);
    const [loadingExport, setLoadingExport] = useState(false);
    const [loadingPrint, setLoadingPrint] = useState<Id | null>(null);
    const [showFilters, setShowFilters] = useState(false);

    // Aplicar filtros
    const handleFiltroChange = (key: string, value: string | number | undefined) => {
        const newFiltros = { ...filtros, [key]: value };
        if (!value) delete newFiltros[key as keyof typeof newFiltros];
        setFiltros(newFiltros);

        // Actualizar URL con filtros
        router.get('/logistica/reportes', newFiltros, {
            preserveScroll: true,
            replace: true,
        });
    };

    // Resetear filtros
    const handleResetFiltros = () => {
        setFiltros({});
        setSelectedReportes([]);
        router.get('/logistica/reportes', {}, {
            preserveScroll: true,
            replace: true,
        });
    };

    // Seleccionar/deseleccionar reportes
    const toggleSelectReporte = (id: Id) => {
        if (selectedReportes.includes(id)) {
            setSelectedReportes(selectedReportes.filter(r => r !== id));
        } else {
            setSelectedReportes([...selectedReportes, id]);
        }
    };

    // Seleccionar todos en la página actual
    const toggleSelectAll = () => {
        if (selectedReportes.length === initialReportes.data.length) {
            setSelectedReportes([]);
        } else {
            setSelectedReportes(initialReportes.data.map(r => r.id));
        }
    };

    // Exportar a ZIP
    const handleExportarZip = async () => {
        if (selectedReportes.length === 0) {
            alert('Selecciona al menos un reporte');
            return;
        }

        try {
            setLoadingExport(true);
            const response = await fetch('/api/reportes/exportar-zip', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    reporte_ids: selectedReportes,
                }),
            });

            if (!response.ok) {
                throw new Error('Error exportando reportes');
            }

            // Descargar ZIP
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `reportes-${new Date().getTime()}.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            setSelectedReportes([]);
        } catch (error) {
            console.error('Error exportando:', error);
            alert('Error exportando reportes');
        } finally {
            setLoadingExport(false);
        }
    };

    // Imprimir reporte
    const handleImprimirReporte = (reporteId: Id) => {
        try {
            setLoadingPrint(reporteId);
            const popup = window.open(
                `/api/reportes-carga/${reporteId}/pdf-preview`,
                'printWindow',
                'width=1000,height=700'
            );
            if (popup) {
                setTimeout(() => {
                    popup.print();
                }, 1500);
            }
        } catch (error) {
            console.error('Error imprimiendo:', error);
            alert('Error imprimiendo reporte');
        } finally {
            setLoadingPrint(null);
        }
    };

    return (
        <AppLayout>
            <Head title="Reportes de Carga" />

            <div className="min-h-screen bg-gray-50 dark:bg-slate-950 p-4 md:p-6">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.visit('/logistica/entregas')}
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Reportes de Carga
                        </h1>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                        Gestión centralizada de reportes de carga
                    </p>
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
                    <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {estadisticas.total_reportes}
                        </p>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
                        <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-1">Pendientes</p>
                        <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                            {estadisticas.pendientes}
                        </p>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-blue-700 dark:text-blue-300 mb-1">Confirmados</p>
                        <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                            {estadisticas.confirmados}
                        </p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                        <p className="text-sm text-green-700 dark:text-green-300 mb-1">Entregados</p>
                        <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                            {estadisticas.entregados}
                        </p>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                        <p className="text-sm text-purple-700 dark:text-purple-300 mb-1">Peso Total</p>
                        <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                            {(estadisticas.peso_total / 1000).toFixed(1)}T
                        </p>
                    </div>
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 border border-indigo-200 dark:border-indigo-800">
                        <p className="text-sm text-indigo-700 dark:text-indigo-300 mb-1">Entregas</p>
                        <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                            {estadisticas.entregas_total}
                        </p>
                    </div>
                </div>

                {/* Filtros y Búsqueda */}
                <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-3 mb-4">
                        {/* Búsqueda */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar por número de reporte, descripción o cliente..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                value={filtros.search || ''}
                                onChange={(e) =>
                                    handleFiltroChange('search', e.target.value || undefined)
                                }
                            />
                        </div>

                        {/* Botones de acción */}
                        <Button
                            variant="outline"
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2"
                        >
                            <Filter className="w-4 h-4" />
                            Filtros
                        </Button>

                        {selectedReportes.length > 0 && (
                            <>
                                <Button
                                    variant="default"
                                    onClick={handleExportarZip}
                                    disabled={loadingExport}
                                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                                >
                                    <Archive className="w-4 h-4" />
                                    {loadingExport ? 'Exportando...' : `ZIP (${selectedReportes.length})`}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleResetFiltros}
                                >
                                    Limpiar
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Filtros Expandibles */}
                    {showFilters && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                            <select
                                className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                                value={filtros.estado || ''}
                                onChange={(e) => handleFiltroChange('estado', e.target.value || undefined)}
                            >
                                <option value="">Todos los estados</option>
                                {Object.entries(estados).map(([key, label]) => (
                                    <option key={key} value={key}>
                                        {label}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="date"
                                className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                                value={filtros.fecha_desde || ''}
                                onChange={(e) =>
                                    handleFiltroChange('fecha_desde', e.target.value || undefined)
                                }
                                placeholder="Fecha desde"
                            />

                            <input
                                type="date"
                                className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                                value={filtros.fecha_hasta || ''}
                                onChange={(e) =>
                                    handleFiltroChange('fecha_hasta', e.target.value || undefined)
                                }
                                placeholder="Fecha hasta"
                            />

                            <select
                                className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                                value={filtros.chofer_id || ''}
                                onChange={(e) =>
                                    handleFiltroChange('chofer_id', e.target.value ? parseInt(e.target.value) : undefined)
                                }
                            >
                                <option value="">Todos los choferes</option>
                                {choferes.map((chofer) => (
                                    <option key={chofer.id} value={chofer.id}>
                                        {chofer.name}
                                    </option>
                                ))}
                            </select>

                            <select
                                className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
                                value={filtros.vehiculo_id || ''}
                                onChange={(e) =>
                                    handleFiltroChange('vehiculo_id', e.target.value ? parseInt(e.target.value) : undefined)
                                }
                            >
                                <option value="">Todos los vehículos</option>
                                {vehiculos.map((vehiculo) => (
                                    <option key={vehiculo.id} value={vehiculo.id}>
                                        {vehiculo.placa}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {/* Tabla de Reportes */}
                <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
                    {/* Header con selección */}
                    {initialReportes.data.length > 0 && (
                        <div className="px-6 py-3 bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 flex items-center gap-3">
                            <button
                                onClick={toggleSelectAll}
                                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                            >
                                {selectedReportes.length === initialReportes.data.length ? (
                                    <CheckSquare className="w-5 h-5 text-blue-600" />
                                ) : (
                                    <Square className="w-5 h-5" />
                                )}
                            </button>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                {selectedReportes.length > 0
                                    ? `${selectedReportes.length} seleccionados`
                                    : `${initialReportes.meta?.total ?? 0} reportes`}
                            </span>
                        </div>
                    )}

                    {initialReportes.data.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white w-8"></th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                            Reporte
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                            Estado
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                            Entregas
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                            Vehículo
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                            Peso
                                        </th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                            Fecha
                                        </th>
                                        <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                                    {initialReportes.data.map((reporte) => (
                                        <tr
                                            key={reporte.id}
                                            className="hover:bg-gray-50 dark:hover:bg-slate-800 transition"
                                        >
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => toggleSelectReporte(reporte.id)}
                                                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                                >
                                                    {selectedReportes.includes(reporte.id) ? (
                                                        <CheckSquare className="w-5 h-5 text-blue-600" />
                                                    ) : (
                                                        <Square className="w-5 h-5" />
                                                    )}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {reporte.numero_reporte}
                                                    </p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {reporte.descripcion || 'Sin descripción'}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge className={estadoColorMap[reporte.estado] || ''}>
                                                    {reporte.estado}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-gray-900 dark:text-white">
                                                {reporte.entregas_count || 0}
                                            </td>
                                            <td className="px-6 py-4 text-gray-900 dark:text-white">
                                                {reporte.vehiculo?.placa || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-gray-900 dark:text-white">
                                                {(reporte.peso_total_kg / 1000).toFixed(2)} T
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(reporte.fecha_generacion).toLocaleDateString('es-ES')}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex gap-2 justify-end">
                                                    <button
                                                        onClick={() => handleImprimirReporte(reporte.id)}
                                                        disabled={loadingPrint === reporte.id}
                                                        title="Imprimir"
                                                        className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50"
                                                    >
                                                        <Printer className="w-4 h-4" />
                                                    </button>
                                                    <a
                                                        href={`/api/reportes-carga/${reporte.id}/pdf`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        title="Descargar PDF"
                                                        className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                    </a>
                                                    <a
                                                        href={`/api/reportes-carga/${reporte.id}/pdf-preview`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        title="Ver PDF"
                                                        className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </a>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-500 dark:text-gray-400">
                                No hay reportes que coincidan con los filtros
                            </p>
                        </div>
                    )}
                </div>

                {/* Paginación */}
                {initialReportes.data.length > 0 && (
                    <div className="mt-6 flex justify-center gap-2">
                        {initialReportes.links?.map((link, idx) => (
                            link.url ? (
                                <button
                                    key={idx}
                                    onClick={() => router.visit(link.url!)}
                                    className={`px-3 py-2 rounded-lg text-sm ${link.active
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700'
                                        }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ) : (
                                <span
                                    key={idx}
                                    className="px-3 py-2 text-sm text-gray-400 dark:text-gray-600"
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            )
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
