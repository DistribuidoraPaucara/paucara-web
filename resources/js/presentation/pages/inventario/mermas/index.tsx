import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { useAuth } from '@/application/hooks/use-auth';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import type {
    MermaInventario,
    FiltrosMermas,
    TipoMerma,
    EstadoMerma
} from '@/domain/entities/mermas-inventario';
import type { Almacen } from '@/domain/entities/almacenes';
import { useTipoMermas } from '@/stores/useTipoMermas';
import { useEstadoMermas } from '@/stores/useEstadoMermas';
import { TipoMermaCrudModal } from '@/presentation/components/Inventario/TipoMermaCrudModal';
import { EstadoMermaCrudModal } from '@/presentation/components/Inventario/EstadoMermaCrudModal';
import {
    Plus,
    Filter,
    Eye,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Package,
    Calendar,
    User,
    Printer
} from 'lucide-react';
import { NotificationService } from '@/infrastructure/services/notification.service';
import { OutputSelectionModal } from '@/presentation/components/impresion/OutputSelectionModal';

interface PageProps extends InertiaPageProps {
    mermas: {
        data: MermaInventario[];
        total: number;
        per_page: number;
        current_page: number;
        last_page: number;
    };
    filtros: FiltrosMermas;
    almacenes: Almacen[];
    estadisticas: {
        total_mermas: number;
        total_pendientes: number;
        total_aprobadas: number;
        total_rechazadas: number;
        costo_total_mes: number;
    };
}

export default function MermasIndex() {
    const { props } = usePage<PageProps>();
    const { mermas, filtros, almacenes, estadisticas } = props;
    const { can } = useAuth();
    const { tipos, fetchTipos } = useTipoMermas();
    const { estados, fetchEstados } = useEstadoMermas();
    React.useEffect(() => {
        fetchTipos();
        fetchEstados();
    }, [fetchTipos, fetchEstados]);

    // Validación defensiva para estadísticas
    const estadisticasSeguras = estadisticas || {
        total_mermas: 0,
        total_pendientes: 0,
        total_aprobadas: 0,
        total_rechazadas: 0,
        costo_total_mes: 0
    };

    const [filtrosLocales, setFiltrosLocales] = useState<FiltrosMermas>(filtros);
    const [mostrarFiltros, setMostrarFiltros] = useState(false);
    const [modalTipoMermaOpen, setModalTipoMermaOpen] = useState(false);
    const [modalEstadoMermaOpen, setModalEstadoMermaOpen] = useState(false);
    const [mermaParaImprimir, setMermaParaImprimir] = useState<MermaInventario | null>(null);
    const [mostrarModalImpresion, setMostrarModalImpresion] = useState(false);

    const breadcrumbs = [
        {
            title: 'Inventario',
            href: '/inventario',
        },
        {
            title: 'Mermas',
            href: '/inventario/mermas',
        },
    ];

    const aplicarFiltros = () => {
        router.get('/inventario/mermas', filtrosLocales as Record<string, string | number | undefined>, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const limpiarFiltros = () => {
        const filtrosVacios: FiltrosMermas = {};
        setFiltrosLocales(filtrosVacios);
        router.get('/inventario/mermas', filtrosVacios as Record<string, string | number | undefined>);
    };

    const aprobarMerma = async (merma: MermaInventario) => {
        if (!confirm(`¿Confirmas la aprobación de la merma ${merma.numero}?`)) return;

        try {
            const response = await fetch(`/inventario/mermas/${merma.id}/aprobar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            const result = await response.json();

            if (result.success) {
                NotificationService.success('Merma aprobada exitosamente');
                router.reload();
            } else {
                NotificationService.error(result.message || 'Error al aprobar merma');
            }
        } catch {
            NotificationService.error('Error al procesar la solicitud');
        }
    };

    const rechazarMerma = async (merma: MermaInventario) => {
        const motivo = prompt('Motivo del rechazo:');
        if (!motivo || motivo.trim() === '') return;

        try {
            const response = await fetch(`/inventario/mermas/${merma.id}/rechazar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ motivo_rechazo: motivo }),
            });

            const result = await response.json();

            if (result.success) {
                NotificationService.success('Merma rechazada exitosamente');
                router.reload();
            } else {
                NotificationService.error(result.message || 'Error al rechazar merma');
            }
        } catch {
            NotificationService.error('Error al procesar la solicitud');
        }
    };

    const TipoMermaBadge = ({ tipo }: { tipo: TipoMerma }) => {
        const config = tipos.find(t => t.clave === tipo);
        if (!config) return null;
        return (
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.bg_color} ${config.text_color}`}>
                {config.label}
            </span>
        );
    };

    const EstadoMermaBadge = ({ estado }: { estado: EstadoMerma }) => {
        const config = estados.find(e => e.clave === estado);
        if (!config) return null;
        return (
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.bg_color} ${config.text_color}`}>
                {config.label}
            </span>
        );
    };

    if (!can('inventario.mermas.index')) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Acceso Denegado" />
                <div className="text-center py-8">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Acceso Denegado
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                        No tienes permisos para ver las mermas de inventario.
                    </p>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mermas de Inventario" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                            Mermas de Inventario
                        </h2>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            Gestión de productos perdidos, dañados o vencidos
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setMostrarFiltros(!mostrarFiltros)}
                        >
                            <Filter className="w-4 h-4" />
                            <span className="ml-2">Filtros</span>
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setModalTipoMermaOpen(true)}
                        >
                            <span className="ml-2">Tipos de Merma</span>
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setModalEstadoMermaOpen(true)}
                        >
                            <span className="ml-2">Estados de Merma</span>
                        </Button>
                        {can('inventario.mermas.registrar') && (
                            <Link href="/inventario/mermas/registrar">
                                <Button>
                                    <Plus className="w-4 h-4" />
                                    <span className="ml-2">Nueva Merma</span>
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                            <Package className="w-8 h-8 text-blue-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Mermas</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    {estadisticasSeguras.total_mermas}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                            <AlertTriangle className="w-8 h-8 text-yellow-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pendientes</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    {estadisticasSeguras.total_pendientes}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Aprobadas</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    {estadisticasSeguras.total_aprobadas}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                            <XCircle className="w-8 h-8 text-red-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Rechazadas</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    {estadisticasSeguras.total_rechazadas}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-800 rounded-lg flex items-center justify-center">
                                <span className="text-purple-600 dark:text-purple-300 font-bold">Bs</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Costo Mes</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    {new Intl.NumberFormat('es-BO', {
                                        style: 'currency',
                                        currency: 'BOB'
                                    }).format(estadisticasSeguras.costo_total_mes)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filtros */}
                {mostrarFiltros && (
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                            Filtros de Búsqueda
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Tipo de Merma
                                </label>
                                <select
                                    value={filtrosLocales.tipo_merma || ''}
                                    onChange={(e) => setFiltrosLocales(prev => ({
                                        ...prev,
                                        tipo_merma: e.target.value as TipoMerma || undefined
                                    }))}
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="">Todos los tipos</option>
                                    {tipos.map(tipo => (
                                        <option key={tipo.clave} value={tipo.clave}>{tipo.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Estado
                                </label>
                                <select
                                    value={filtrosLocales.estado || ''}
                                    onChange={(e) => setFiltrosLocales(prev => ({
                                        ...prev,
                                        estado: e.target.value as EstadoMerma || undefined
                                    }))}
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="">Todos los estados</option>
                                    {estados.map(estado => (
                                        <option key={estado.clave} value={estado.clave}>{estado.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Almacén
                                </label>
                                <select
                                    value={filtrosLocales.almacen_id || ''}
                                    onChange={(e) => setFiltrosLocales(prev => ({
                                        ...prev,
                                        almacen_id: e.target.value ? parseInt(e.target.value) : undefined
                                    }))}
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="">Todos los almacenes</option>
                                    {almacenes.map(almacen => (
                                        <option key={almacen.id} value={almacen.id}>
                                            {almacen.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Fecha Desde
                                </label>
                                <Input
                                    type="date"
                                    value={filtrosLocales.fecha_desde || ''}
                                    onChange={(e) => setFiltrosLocales(prev => ({
                                        ...prev,
                                        fecha_desde: e.target.value || undefined
                                    }))}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mt-4">
                            <Button onClick={aplicarFiltros}>
                                Aplicar Filtros
                            </Button>
                            <Button variant="outline" onClick={limpiarFiltros}>
                                Limpiar
                            </Button>
                        </div>
                    </div>
                )}

                {/* Tabla de Mermas */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Merma
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Tipo
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Almacén
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Productos
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Fecha
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {mermas.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center">
                                            <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                            <p className="text-gray-500 dark:text-gray-400">
                                                No se encontraron mermas
                                            </p>
                                            {can('inventario.mermas.registrar') && (
                                                <Link href="/inventario/mermas/registrar">
                                                    <Button className="mt-4">
                                                        <Plus className="w-4 h-4 mr-2" />
                                                        Registrar Primera Merma
                                                    </Button>
                                                </Link>
                                            )}
                                        </td>
                                    </tr>
                                ) : (
                                    mermas.data.map((merma) => (
                                        <tr key={merma.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        {merma.numero}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {merma.observacion || '-'}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <TipoMermaBadge tipo={merma.tipo_merma} />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                                {merma.almacen?.nombre || 'Sin almacén'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 dark:text-gray-100">
                                                    {merma.cantidad_productos ?? 0} productos
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {merma.movimientos?.reduce((sum: number, mov: any) => sum + Math.abs(mov.cantidad ?? 0), 0) ?? 0} unidades
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <EstadoMermaBadge estado={merma.estado} />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                    <Calendar className="w-4 h-4 mr-1" />
                                                    {merma.created_at ? new Date(merma.created_at).toLocaleDateString() : '-'}
                                                </div>
                                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                    <User className="w-4 h-4 mr-1" />
                                                    {merma.user?.name || 'Sistema'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="flex items-center space-x-2">
                                                    <Link
                                                        href={`/inventario/mermas/${merma.id}`}
                                                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Link>

                                                    <button
                                                        onClick={() => {
                                                            setMermaParaImprimir(merma);
                                                            setMostrarModalImpresion(true);
                                                        }}
                                                        className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                                                        title="Imprimir merma"
                                                    >
                                                        <Printer className="w-4 h-4" />
                                                    </button>

                                                    {merma.estado === 'PENDIENTE' && can('inventario.mermas.aprobar') && (
                                                        <button
                                                            onClick={() => aprobarMerma(merma)}
                                                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 ml-2"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </button>
                                                    )}

                                                    {merma.estado === 'PENDIENTE' && can('inventario.mermas.rechazar') && (
                                                        <button
                                                            onClick={() => rechazarMerma(merma)}
                                                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 ml-2"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Paginación */}
                    {mermas.last_page > 1 && (
                        <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-700 dark:text-gray-300">
                                    Mostrando {(mermas.current_page - 1) * mermas.per_page + 1} a {' '}
                                    {Math.min(mermas.current_page * mermas.per_page, mermas.total)} de {mermas.total} resultados
                                </div>
                                <div className="flex items-center space-x-2">
                                    {mermas.current_page > 1 && (
                                        <Link
                                            href={`/inventario/mermas?page=${mermas.current_page - 1}`}
                                            preserveState
                                            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                        >
                                            Anterior
                                        </Link>
                                    )}
                                    {mermas.current_page < mermas.last_page && (
                                        <Link
                                            href={`/inventario/mermas?page=${mermas.current_page + 1}`}
                                            preserveState
                                            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                        >
                                            Siguiente
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de Impresión */}
            {mermaParaImprimir && (
                <OutputSelectionModal
                    isOpen={mostrarModalImpresion}
                    onClose={() => {
                        setMostrarModalImpresion(false);
                        setMermaParaImprimir(null);
                    }}
                    documentoId={mermaParaImprimir.id}
                    tipoDocumento="merma"
                    documentoInfo={{
                        numero: mermaParaImprimir.numero,
                        fecha: mermaParaImprimir.created_at
                            ? new Date(mermaParaImprimir.created_at).toLocaleDateString()
                            : undefined,
                    }}
                />
            )}

            {/* Modales CRUD */}
            <TipoMermaCrudModal
                open={modalTipoMermaOpen}
                onOpenChange={setModalTipoMermaOpen}
            />
            <EstadoMermaCrudModal
                open={modalEstadoMermaOpen}
                onOpenChange={setModalEstadoMermaOpen}
            />
        </AppLayout>
    );
}
