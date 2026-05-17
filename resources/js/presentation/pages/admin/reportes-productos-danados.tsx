/**
 * Página de Reportes de Productos Dañados
 * Vista administrativa para gestionar reportes de productos dañados
 */

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
    AlertCircle,
    Clock,
    CheckCircle,
    XCircle,
    Filter,
    ChevronRight,
    Search,
    Eye,
    Edit3,
    Trash2,
    Calendar,
    User,
    ShoppingCart,
    MessageSquare,
    Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/presentation/components/ui/select';
import { Badge } from '@/presentation/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/presentation/components/ui/dialog';
import { Skeleton } from '@/presentation/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface ReporteProductoDanado {
    id: number;
    venta_id: number;
    numero_venta: string;
    cliente_id: number;
    nombre_cliente: string;
    observaciones: string;
    estado: 'pendiente' | 'en_revision' | 'aprobado' | 'rechazado';
    estado_descripcion: string;
    notas_respuesta: string | null;
    fecha_reporte: string | null;
    created_at: string;
    updated_at: string;
    imagenes: Array<{
        id: number;
        ruta_imagen: string;
        nombre_archivo: string;
        descripcion: string | null;
    }>;
}

interface ReportesPageProps {
    reportes: {
        data: ReporteProductoDanado[];
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
    };
    estadisticas: {
        total_reportes: number;
        pendientes: number;
        en_revision: number;
        aprobados: number;
        rechazados: number;
    };
}

const estadoConfig: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
    pendiente: {
        color: 'bg-yellow-100 text-yellow-800',
        icon: <Clock className="w-4 h-4" />,
        label: 'Pendiente de Revisión',
    },
    en_revision: {
        color: 'bg-blue-100 text-blue-800',
        icon: <AlertCircle className="w-4 h-4" />,
        label: 'En Revisión',
    },
    aprobado: {
        color: 'bg-green-100 text-green-800',
        icon: <CheckCircle className="w-4 h-4" />,
        label: 'Aprobado',
    },
    rechazado: {
        color: 'bg-red-100 text-red-800',
        icon: <XCircle className="w-4 h-4" />,
        label: 'Rechazado',
    },
};

export default function ReportesProductosDanadosPage({
    reportes,
    estadisticas,
}: ReportesPageProps) {
    const [filtroEstado, setFiltroEstado] = useState<string | null>(null);
    const [busqueda, setBusqueda] = useState('');
    const [reporteSeleccionado, setReporteSeleccionado] = useState<ReporteProductoDanado | null>(null);
    const [isDetalleOpen, setIsDetalleOpen] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { label: 'Admin', href: '/admin' },
        { label: 'Reportes de Productos Dañados', href: '/admin/reportes-productos-danados' },
    ];

    const reportesFiltrados = reportes.data.filter((reporte) => {
        const cumpleFiltro = !filtroEstado || reporte.estado === filtroEstado;
        const cumpleBusqueda =
            busqueda === '' ||
            reporte.nombre_cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
            reporte.numero_venta.toLowerCase().includes(busqueda.toLowerCase()) ||
            reporte.observaciones.toLowerCase().includes(busqueda.toLowerCase());

        return cumpleFiltro && cumpleBusqueda;
    });

    const formatearFecha = (fecha: string) => {
        return new Date(fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleEditarEstado = (reporte: ReporteProductoDanado) => {
        setReporteSeleccionado(reporte);
        setIsDetalleOpen(true);
    };

    const handleActualizarEstado = (nuevoEstado: string) => {
        if (reporteSeleccionado) {
            router.patch(
                `/api/reportes-productos-danados/${reporteSeleccionado.id}`,
                {
                    estado: nuevoEstado,
                    notas_respuesta: reporteSeleccionado.notas_respuesta,
                },
                {
                    onSuccess: () => {
                        setIsDetalleOpen(false);
                        router.reload();
                    },
                }
            );
        }
    };

    const handleEliminar = (reporteId: number) => {
        if (confirm('¿Estás seguro de que deseas eliminar este reporte?')) {
            router.delete(`/api/reportes-productos-danados/${reporteId}`, {
                onSuccess: () => {
                    router.reload();
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reportes de Productos Dañados" />

            <div className="space-y-6 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Reportes de Productos Dañados
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Gestiona los reportes de productos dañados reportados por los clientes
                        </p>
                    </div>
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <StatCard
                        label="Total"
                        value={estadisticas.total_reportes}
                        color="bg-gray-100 dark:bg-gray-800"
                    />
                    <StatCard
                        label="Pendientes"
                        value={estadisticas.pendientes}
                        color="bg-yellow-100 dark:bg-yellow-900"
                    />
                    <StatCard
                        label="En Revisión"
                        value={estadisticas.en_revision}
                        color="bg-blue-100 dark:bg-blue-900"
                    />
                    <StatCard
                        label="Aprobados"
                        value={estadisticas.aprobados}
                        color="bg-green-100 dark:bg-green-900"
                    />
                    <StatCard
                        label="Rechazados"
                        value={estadisticas.rechazados}
                        color="bg-red-100 dark:bg-red-900"
                    />
                </div>

                {/* Filtros */}
                <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <Input
                                placeholder="Buscar por cliente, venta o descripción..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                className="w-full"
                            />
                        </div>
                        <Select value={filtroEstado || 'todos'} onValueChange={(value) => setFiltroEstado(value === 'todos' ? null : value)}>
                            <SelectTrigger className="w-full md:w-48">
                                <SelectValue placeholder="Filtrar por estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todos">Todos</SelectItem>
                                <SelectItem value="pendiente">Pendiente</SelectItem>
                                <SelectItem value="en_revision">En Revisión</SelectItem>
                                <SelectItem value="aprobado">Aprobado</SelectItem>
                                <SelectItem value="rechazado">Rechazado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Lista de Reportes */}
                <div className="bg-white dark:bg-gray-900 shadow rounded-lg overflow-hidden">
                    {reportesFiltrados.length === 0 ? (
                        <div className="text-center py-12">
                            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 dark:text-gray-400">
                                No hay reportes que coincidan con los filtros
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200 dark:divide-gray-800">
                            {reportesFiltrados.map((reporte) => {
                                const config = estadoConfig[reporte.estado];
                                return (
                                    <div
                                        key={reporte.id}
                                        className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 space-y-2">
                                                {/* Encabezado */}
                                                <div className="flex items-center gap-3">
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                                            Venta #{reporte.numero_venta}
                                                        </h3>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            {reporte.nombre_cliente}
                                                        </p>
                                                    </div>
                                                    <Badge className={cn('ml-auto', config.color)}>
                                                        {config.icon}
                                                        <span className="ml-1">{config.label}</span>
                                                    </Badge>
                                                </div>

                                                {/* Información detallada */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600 dark:text-gray-400 mt-3">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>{formatearFecha(reporte.created_at)}</span>
                                                    </div>
                                                    {reporte.imagenes.length > 0 && (
                                                        <div className="flex items-center gap-2">
                                                            <ImageIcon className="w-4 h-4" />
                                                            <span>{reporte.imagenes.length} imagen{reporte.imagenes.length !== 1 ? 'es' : ''}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Observaciones */}
                                                <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded text-sm text-gray-700 dark:text-gray-300">
                                                    <p className="font-medium mb-1 flex items-center gap-2">
                                                        <MessageSquare className="w-4 h-4" />
                                                        Descripción del defecto
                                                    </p>
                                                    <p className="line-clamp-2">{reporte.observaciones}</p>
                                                </div>

                                                {/* Notas de respuesta (si existen) */}
                                                {reporte.notas_respuesta && (
                                                    <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded text-sm text-blue-700 dark:text-blue-300">
                                                        <p className="font-medium mb-1">Respuesta del admin:</p>
                                                        <p>{reporte.notas_respuesta}</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Acciones */}
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleEditarEstado(reporte)}
                                                    title="Editar estado"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleEliminar(reporte.id)}
                                                    title="Eliminar reporte"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Paginación */}
                {reportes.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {Array.from({ length: reportes.last_page }, (_, i) => i + 1).map((page) => (
                            <Button
                                key={page}
                                variant={page === reportes.current_page ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => router.get(`?page=${page}`)}
                            >
                                {page}
                            </Button>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal de Detalle y Edición */}
            <Dialog open={isDetalleOpen} onOpenChange={setIsDetalleOpen}>
                <DialogContent className="max-w-2xl max-h-96 overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Editar Reporte - Venta #{reporteSeleccionado?.numero_venta}</DialogTitle>
                    </DialogHeader>

                    {reporteSeleccionado && (
                        <div className="space-y-6">
                            {/* Información básica */}
                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Cliente
                                    </label>
                                    <p className="text-gray-900 dark:text-white">{reporteSeleccionado.nombre_cliente}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Descripción del defecto
                                    </label>
                                    <p className="text-gray-900 dark:text-white text-sm leading-relaxed">
                                        {reporteSeleccionado.observaciones}
                                    </p>
                                </div>

                                {/* Galería de imágenes */}
                                {reporteSeleccionado.imagenes.length > 0 && (
                                    <div>
                                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                                            Fotos ({reporteSeleccionado.imagenes.length})
                                        </label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {reporteSeleccionado.imagenes.map((img) => (
                                                <a
                                                    key={img.id}
                                                    href={`/storage/${img.ruta_imagen}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="aspect-square rounded bg-gray-100 dark:bg-gray-800 overflow-hidden hover:opacity-80 transition"
                                                >
                                                    <img
                                                        src={`/storage/${img.ruta_imagen}`}
                                                        alt={img.nombre_archivo}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Cambiar estado */}
                            <div className="border-t pt-4">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-2">
                                    Estado
                                </label>
                                <Select
                                    value={reporteSeleccionado.estado}
                                    onValueChange={handleActualizarEstado}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pendiente">Pendiente de Revisión</SelectItem>
                                        <SelectItem value="en_revision">En Revisión</SelectItem>
                                        <SelectItem value="aprobado">Aprobado</SelectItem>
                                        <SelectItem value="rechazado">Rechazado</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Notas de respuesta */}
                            <div className="border-t pt-4">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-2">
                                    Respuesta / Notas
                                </label>
                                <textarea
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                    rows={3}
                                    value={reporteSeleccionado.notas_respuesta || ''}
                                    onChange={(e) =>
                                        setReporteSeleccionado({
                                            ...reporteSeleccionado,
                                            notas_respuesta: e.target.value,
                                        })
                                    }
                                    placeholder="Agrega notas sobre la revisión del reporte..."
                                />
                            </div>

                            {/* Botones de acción */}
                            <div className="flex gap-2 border-t pt-4">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setIsDetalleOpen(false)}
                                >
                                    Cerrar
                                </Button>
                                <Button
                                    className="flex-1"
                                    onClick={() => handleActualizarEstado(reporteSeleccionado.estado)}
                                >
                                    Guardar Cambios
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}

/**
 * Componente de tarjeta de estadística
 */
function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
    return (
        <div className={cn('p-4 rounded-lg', color)}>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{label}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
    );
}
