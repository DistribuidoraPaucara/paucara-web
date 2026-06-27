import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/presentation/components/ui/button';
import { Card } from '@/presentation/components/ui/card';
import ToastContainer from '@/presentation/components/ui/toast-container';
import { useToast } from '@/presentation/hooks/useToast';
import { Printer, MoreVertical, Eye, RotateCcw, Edit3 } from 'lucide-react';
import type { PrestamoEvento } from '@/domain/entities/prestamos';
import { prestamoEventoService } from '@/infrastructure/services/prestamo-evento.service';
import DynamicSearchSelect from '@/presentation/components/form-sections/DynamicSearchSelect';
import { OutputSelectionModal } from '@/presentation/components/impresion/OutputSelectionModal';

interface Props {
    choferes?: Array<{ id: number; name: string; nombre?: string }>;
    vehiculos?: Array<{ id: number; placa: string; marca: string; modelo: string; anho: number }>;
}

export default function PrestamosEventosIndex({ choferes = [], vehiculos = [] }: Props) {
    const { toasts, removeToast, error: toastError, success: toastSuccess, warning: toastWarning } = useToast();

    const [prestamos, setPrestamos] = useState<PrestamoEvento[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filtroEstado, setFiltroEstado] = useState<string>('');
    const [filtroId, setFiltroId] = useState<string>('');
    const [mostrarFiltros, setMostrarFiltros] = useState(false);

    // Filtros con DynamicSearchSelect
    const [nombreEventoSearch, setNombreEventoSearch] = useState<string>('');
    const [encargadoSearch, setEncargadoSearch] = useState<string>('');
    const [encargadoSeleccionado, setEncargadoSeleccionado] = useState<any>(null);

    const [choferesList, setChoferesList] = useState<any[]>([]);
    const [chofersSearch, setChofersSearch] = useState<string>('');
    const [chofersResults, setChofersResults] = useState<any[]>([]);
    const [chofersLoading, setChofersLoading] = useState(false);
    const [chofersSeleccionado, setChofersSeleccionado] = useState<any>(null);

    const [vehiculosList, setVehiculosList] = useState<any[]>([]);
    const [vehiculosSearch, setVehiculosSearch] = useState<string>('');
    const [vehiculosResults, setVehiculosResults] = useState<any[]>([]);
    const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState<any>(null);

    const [filtroFechaDesde, setFiltroFechaDesde] = useState<string>('');
    const [filtroFechaHasta, setFiltroFechaHasta] = useState<string>('');

    // Paginación
    const [paginaActual, setPaginaActual] = useState(1);
    const [paginacion, setPaginacion] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0,
        from: 1,
        to: 0,
    });

    // Modal de impresión
    const [showOutputModal, setShowOutputModal] = useState(false);
    const [prestamoParaImprimir, setPrestamoParaImprimir] = useState<PrestamoEvento | null>(null);

    // Dropdown abierto
    const [openDropdown, setOpenDropdown] = useState<number | null>(null);

    // Cargar datos iniciales
    useEffect(() => {
        cargarDatosIniciales();
    }, []);

    // Cerrar dropdown cuando se hace click fuera
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('[data-dropdown-trigger]') && !target.closest('[data-dropdown-menu]')) {
                setOpenDropdown(null);
            }
        };

        if (openDropdown !== null) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [openDropdown]);

    // Buscar cuando cambian los filtros
    useEffect(() => {
        cargarPrestamos();
    }, [
        filtroEstado,
        filtroId,
        nombreEventoSearch,
        encargadoSeleccionado,
        chofersSeleccionado,
        vehiculoSeleccionado,
        filtroFechaDesde,
        filtroFechaHasta,
        paginaActual,
    ]);

    const cargarDatosIniciales = () => {
        // Usar los datos pasados como props (precargados desde el controlador)
        setChoferesList(choferes);
        setChofersResults(choferes);
        setVehiculosList(vehiculos);
        setVehiculosResults(vehiculos);
    };

    const handleSearchChoferes = (query: string) => {
        setChofersSearch(query);
        if (query.trim().length === 0) {
            setChofersResults(choferesList);
        } else {
            const filtered = choferesList.filter((chofer) =>
                chofer.name?.toLowerCase().includes(query.toLowerCase())
            );
            setChofersResults(filtered);
        }
    };

    const handleSearchVehiculos = (query: string) => {
        setVehiculosSearch(query);
        if (query.trim().length === 0) {
            setVehiculosResults(vehiculosList);
        } else {
            const filtered = vehiculosList.filter(
                (vehiculo) =>
                    vehiculo.placa?.toLowerCase().includes(query.toLowerCase()) ||
                    vehiculo.marca?.toLowerCase().includes(query.toLowerCase()) ||
                    vehiculo.modelo?.toLowerCase().includes(query.toLowerCase())
            );
            setVehiculosResults(filtered);
        }
    };

    const handleImprimir = (prestamo: PrestamoEvento) => {
        setPrestamoParaImprimir(prestamo);
        setShowOutputModal(true);
    };

    const cargarPrestamos = async () => {
        setLoading(true);
        setError('');
        try {
            const filtros: any = {};
            if (filtroEstado) filtros.estado = filtroEstado;
            if (filtroId) filtros.id = filtroId;
            if (nombreEventoSearch) filtros.nombre_evento = nombreEventoSearch;
            if (encargadoSeleccionado) filtros.encargado_evento = encargadoSeleccionado;
            if (chofersSeleccionado) filtros.nombre_chofer = chofersSeleccionado.name;
            if (vehiculoSeleccionado) filtros.vehiculo_asignado = vehiculoSeleccionado.placa;
            if (filtroFechaDesde) filtros.fecha_desde = filtroFechaDesde;
            if (filtroFechaHasta) filtros.fecha_hasta = filtroFechaHasta;
            filtros.page = paginaActual;
            filtros.per_page = 15;

            const resultado = await prestamoEventoService.listar(filtros);
            // ✅ NUEVO: Log para debugging
            console.group('📥 DATOS DEL BACKEND - EVENTOS');
            console.log('Total prestamos:', resultado.data?.length);
            resultado.data?.forEach((prestamo: any) => {
                console.group(`🎉 Préstamo #${prestamo.id} - ${prestamo.nombre_evento}`);
                console.log('Estado:', prestamo.estado);
                console.log('Detalles:', prestamo.detalles);
                console.log('Devoluciones:', prestamo.devoluciones);
                if (prestamo.detalles) {
                    prestamo.detalles.forEach((detalle: any, idx: number) => {
                        const totalPrestado = detalle.cantidad_prestada || 0;
                        const totalDevuelto = detalle.devolucion_detalles?.reduce((s: number, dev: any) => s + ((dev.cantidad_devuelta || 0) + (dev.cantidad_dañada_total || 0)), 0) || 0;
                        const falta = totalPrestado - totalDevuelto;
                        console.log(`  Detalle ${idx + 1}: ${detalle.prestable?.nombre} | Prestado: ${totalPrestado} | Devuelto: ${totalDevuelto} | Falta: ${falta} | Estado: ${detalle.estado}`);
                    });
                }
                console.groupEnd();
            });
            console.groupEnd();
            setPrestamos(resultado.data || []);
            setPaginacion(resultado.pagination);
        } catch (err: any) {
            const msg = err.message || 'Error cargando préstamos';
            setError(msg);
            toastError(msg);
            setPrestamos([]);
        } finally {
            setLoading(false);
        }
    };

    const limpiarFiltros = () => {
        setFiltroId('');
        setFiltroEstado('');
        setNombreEventoSearch('');
        setEncargadoSearch('');
        setEncargadoSeleccionado(null);
        setChofersSeleccionado(null);
        setChofersSearch('');
        setVehiculoSeleccionado(null);
        setVehiculosSearch('');
        setFiltroFechaDesde('');
        setFiltroFechaHasta('');
        setPaginaActual(1);
    };

    const getEstadoBadge = (estado: string) => {
        const estilos: Record<string, string> = {
            ACTIVO: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
            PARCIALMENTE_DEVUELTO: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
            COMPLETAMENTE_DEVUELTO: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
            CANCELADO: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
        };

        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${estilos[estado] || 'bg-gray-100 text-gray-800'}`}>
                {estado}
            </span>
        );
    };

    const formatDate = (date: string | undefined) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // ✅ NUEVO: Calcular información de préstamos pendientes
    const calcularPendientes = () => {
        const prestamosPendientes = prestamos.filter(p =>
            p.estado === 'ACTIVO' || p.estado === 'PARCIALMENTE_DEVUELTO'
        );

        const resumen = {
            totalPrestamos: prestamosPendientes.length,
            canastillas: { prestadas: 0, devueltas: 0, pendientes: 0 },
            embases: { prestadas: 0, devueltas: 0, pendientes: 0 },
            montoGarantia: 0,
        };

        prestamosPendientes.forEach(prestamo => {
            resumen.montoGarantia += Number(prestamo.monto_garantia || 0);
            (prestamo.detalles || []).forEach((detalle: any) => {
                const totalDetalle = Number(detalle.cantidad_prestada || 0);
                const devueltoDetalle = detalle.devolucion_detalles?.reduce((s: number, dev: any) => s + ((dev.cantidad_devuelta || 0) + (dev.cantidad_dañada_total || 0)), 0) || 0;
                const pendienteDetalle = Math.max(0, totalDetalle - devueltoDetalle);

                if (detalle.prestable?.tipo === 'CANASTILLA') {
                    resumen.canastillas.prestadas += totalDetalle;
                    resumen.canastillas.devueltas += devueltoDetalle;
                    resumen.canastillas.pendientes += pendienteDetalle;
                } else if (detalle.prestable?.tipo === 'EMBASES') {
                    resumen.embases.prestadas += totalDetalle;
                    resumen.embases.devueltas += devueltoDetalle;
                    resumen.embases.pendientes += pendienteDetalle;
                }
            });
        });

        return resumen;
    };

    // ✅ NUEVO: Calcular pendientes por préstamo individual
    const calcularPendientesPorPrestamo = (prestamo: PrestamoEvento) => {
        const resumen = { canastillas: 0, embases: 0 };
        (prestamo.detalles || []).forEach((detalle: any) => {
            const totalDetalle = Number(detalle.cantidad_prestada || 0);
            const devueltoDetalle = detalle.devolucion_detalles?.reduce((s: number, dev: any) => s + ((dev.cantidad_devuelta || 0) + (dev.cantidad_dañada_total || 0)), 0) || 0;
            const pendienteDetalle = Math.max(0, totalDetalle - devueltoDetalle);

            if (detalle.prestable?.tipo === 'CANASTILLA') {
                resumen.canastillas += pendienteDetalle;
            } else if (detalle.prestable?.tipo === 'EMBASES') {
                resumen.embases += pendienteDetalle;
            }
        });
        return resumen;
    };

    const pendientes = calcularPendientes();

    return (
        <AppLayout>
            <Head title="Préstamos a Eventos" />
            <div className="p-4 bg-white dark:bg-gray-950 min-h-screen">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        🎉 Préstamos a Eventos
                    </h1>
                    <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => window.location.href = '/prestamos/eventos/crear'}
                    >
                        ➕ Nuevo Préstamo
                    </Button>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-lg border border-red-300 dark:border-red-700">
                        {error}
                    </div>
                )}

                {/* ✅ NUEVO: Cards de Resumen Pendiente */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                    <Card className="p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 border-red-200 dark:border-red-700">
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3">
                            ⚠️ Préstamos Pendientes
                        </p>
                        <div className="space-y-2">
                            <div>
                                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{pendientes.totalPrestamos}</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">Préstamos activos</p>
                            </div>
                            <div className="pt-2 border-t border-red-200 dark:border-red-700">
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    <span className="font-semibold">Canastillas:</span> {pendientes.canastillas.pendientes} por devolver
                                </p>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    <span className="font-semibold">Embases:</span> {pendientes.embases.pendientes} por devolver
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 border-orange-200 dark:border-orange-700">
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3">
                            📊 Items Pendientes por Tipo
                        </p>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-700 dark:text-gray-300">📦 Canastillas</span>
                                <span className="text-lg font-bold text-orange-600 dark:text-orange-400">{pendientes.canastillas.pendientes}</span>
                            </div>
                            <div className="flex justify-between items-center border-t border-orange-200 dark:border-orange-700 pt-2">
                                <span className="text-sm text-gray-700 dark:text-gray-300">🥫 Embases</span>
                                <span className="text-lg font-bold text-orange-600 dark:text-orange-400">{pendientes.embases.pendientes}</span>
                            </div>
                            <div className="flex justify-between items-center border-t border-orange-200 dark:border-orange-700 pt-2">
                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Total</span>
                                <span className="text-lg font-bold text-orange-700 dark:text-orange-300">
                                    {pendientes.canastillas.pendientes + pendientes.embases.pendientes}
                                </span>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 border-purple-200 dark:border-purple-700">
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3">
                            💰 Garantías en Riesgo
                        </p>
                        <div className="space-y-2">
                            <div>
                                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                    Bs {pendientes.montoGarantia.toLocaleString('es-ES')}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">Total en garantía</p>
                            </div>
                            <div className="pt-2 border-t border-purple-200 dark:border-purple-700">
                                <p className="text-xs text-purple-700 dark:text-purple-300">
                                    💡 Recuperar para liberar garantías
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Botón para mostrar/ocultar filtros */}
                <div className="mb-6">
                    <button
                        onClick={() => setMostrarFiltros(!mostrarFiltros)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center gap-2"
                    >
                        <span>{mostrarFiltros ? '▼' : '▶'}</span>
                        {mostrarFiltros ? 'Ocultar Filtros' : 'Mostrar Filtros'}
                    </button>
                </div>

                {/* Filtros */}
                {mostrarFiltros && (
                    <Card className="p-4 mb-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                        <div className="space-y-4">
                            {/* Primera fila de filtros */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                        ID Préstamo
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Buscar por ID..."
                                        value={filtroId}
                                        onChange={(e) => setFiltroId(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                        Nombre Evento
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Buscar por nombre de evento..."
                                        value={nombreEventoSearch}
                                        onChange={(e) => setNombreEventoSearch(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <DynamicSearchSelect
                                        label="Chofer"
                                        placeholder="Buscar chofer..."
                                        selectedItem={chofersSeleccionado}
                                        items={chofersResults}
                                        isLoading={chofersLoading}
                                        searchValue={chofersSearch}
                                        onSearch={handleSearchChoferes}
                                        onSelect={(chofer) => setChofersSeleccionado(chofer)}
                                        onClear={() => {
                                            setChofersSeleccionado(null);
                                            setChofersSearch('');
                                        }}
                                        renderItem={(chofer) => <p className="font-medium">{chofer.name}</p>}
                                        getItemId={(chofer) => chofer.id}
                                        getDisplayValue={(chofer) => chofer.name}
                                    />
                                </div>
                                <div>
                                    <DynamicSearchSelect
                                        label="Vehículo"
                                        placeholder="Buscar por placa, marca, modelo..."
                                        selectedItem={vehiculoSeleccionado}
                                        items={vehiculosResults}
                                        isLoading={false}
                                        searchValue={vehiculosSearch}
                                        onSearch={handleSearchVehiculos}
                                        onSelect={(vehiculo) => setVehiculoSeleccionado(vehiculo)}
                                        onClear={() => {
                                            setVehiculoSeleccionado(null);
                                            setVehiculosSearch('');
                                        }}
                                        renderItem={(vehiculo) => (
                                            <div>
                                                <p className="font-medium">{vehiculo.placa}</p>
                                                <p className="text-xs text-gray-500">{vehiculo.marca} {vehiculo.modelo}</p>
                                            </div>
                                        )}
                                        getItemId={(vehiculo) => vehiculo.id}
                                        getDisplayValue={(vehiculo) => vehiculo.placa}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                        Encargado Evento
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Buscar por encargado..."
                                        value={encargadoSearch}
                                        onChange={(e) => {
                                            setEncargadoSearch(e.target.value);
                                            setEncargadoSeleccionado(e.target.value);
                                        }}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                        Desde (Fecha Préstamo)
                                    </label>
                                    <input
                                        type="date"
                                        value={filtroFechaDesde}
                                        onChange={(e) => setFiltroFechaDesde(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                        Hasta (Fecha Devolución)
                                    </label>
                                    <input
                                        type="date"
                                        value={filtroFechaHasta}
                                        onChange={(e) => setFiltroFechaHasta(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                        Estado
                                    </label>
                                    <select
                                        value={filtroEstado}
                                        onChange={(e) => setFiltroEstado(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                    >
                                        <option value="">Todos</option>
                                        <option value="ACTIVO">Activos</option>
                                        <option value="PARCIALMENTE_DEVUELTO">Parcialmente Devueltos</option>
                                        <option value="COMPLETAMENTE_DEVUELTO">Completamente Devueltos</option>
                                        <option value="CANCELADO">Cancelados</option>
                                    </select>
                                </div>
                                <div className="flex gap-2 items-end">
                                    <Button
                                        variant="outline"
                                        onClick={() => cargarPrestamos()}
                                        className="flex-1"
                                    >
                                        🔄 Buscar
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={limpiarFiltros}
                                        className="flex-1"
                                    >
                                        ✖️ Limpiar
                                    </Button>
                                </div>
                            </div>

                            {/* Segunda fila de filtros */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                            </div>

                            {/* Cuarta fila: Estado y botones */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">


                            </div>
                        </div>
                    </Card>
                )}


                {/* Tabla de Préstamos */}
                <Card className="overflow-x-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                            Cargando préstamos...
                        </div>
                    ) : prestamos.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                            No hay préstamos a eventos
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                                <tr>
                                    <th className="px-2 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Folio</th>
                                    <th className="px-2 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Evento/Encargado</th>
                                    <th className="px-2 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Chofer/Vehiculo</th>
                                    <th className="px-2 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Garantía</th>
                                    <th className="px-2 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Fecha Préstamo</th>
                                    <th className="px-2 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Fecha Devolución</th>
                                    {/* ✅ NUEVO: Columna de Pendientes */}
                                    <th className="px-2 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">Pendientes</th>
                                    <th className="px-2 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Estado</th>
                                    <th className="px-2 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {prestamos.map((prestamo) => (
                                    <tr key={prestamo.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                        <td className="px-2 py-4 text-sm text-gray-600 dark:text-gray-300">
                                            {prestamo.id}
                                        </td>
                                        <td className="px-1 py-4 text-gray-900 dark:text-white">
                                            <p>{prestamo.nombre_evento}</p>
                                            {/* <p>{prestamo.cliente?.nombre || prestamo.cliente?.razon_social || '-'}</p> */}
                                            <p className="text-xs text-gray-600 dark:text-gray-300">
                                                Encargado: <b> {prestamo.encargado_evento || '-'}</b>
                                            </p>
                                        </td>
                                        <td className="px-1 py-4 text-sm text-gray-600 dark:text-gray-300">
                                            <p>{prestamo.chofer?.name || prestamo.chofer?.nombre || '-'}</p>
                                            <p className='text-xs'><b>Vehículo:</b> {prestamo.vehiculo_asignado || '-'}</p>
                                        </td>
                                        {/* <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                            {prestamo.cantidad}
                                        </td> */}
                                        <td className="px-1 py-4 text-sm text-gray-600 dark:text-gray-300">
                                            Bs {Number(prestamo.monto_garantia).toFixed(2)}
                                        </td>
                                        <td className="px-1 py-4 text-sm text-gray-600 dark:text-gray-300">
                                            {formatDate(prestamo.fecha_prestamo)}
                                        </td>
                                        <td className="px-1 py-4 text-sm text-gray-600 dark:text-gray-300">
                                            {formatDate(prestamo.fecha_esperada_devolucion)}
                                        </td>
                                        {/* ✅ NUEVO: Celda de Pendientes */}
                                        <td className="px-1 py-4 text-center">
                                            {(() => {
                                                const pend = calcularPendientesPorPrestamo(prestamo);
                                                const totalPendiente = pend.canastillas + pend.embases;
                                                if (totalPendiente === 0) {
                                                    return <span className="text-green-600 dark:text-green-400 font-semibold">✓ Completo</span>;
                                                }
                                                return (
                                                    <div className="flex flex-col gap-1 text-sm">
                                                        {pend.canastillas > 0 && (
                                                            <div className="flex items-center justify-center gap-1">
                                                                <span>📦</span>
                                                                <span className="font-semibold text-orange-600 dark:text-orange-400">{pend.canastillas}</span>
                                                            </div>
                                                        )}
                                                        {pend.embases > 0 && (
                                                            <div className="flex items-center justify-center gap-1">
                                                                <span>🥫</span>
                                                                <span className="font-semibold text-pink-600 dark:text-pink-400">{pend.embases}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })()}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {getEstadoBadge(prestamo.estado)}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="relative">
                                                <button
                                                    data-dropdown-trigger
                                                    onClick={() => setOpenDropdown(openDropdown === prestamo.id ? null : prestamo.id)}
                                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                                    title="Acciones"
                                                >
                                                    <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                                </button>

                                                {/* Dropdown Menu */}
                                                {openDropdown === prestamo.id && (
                                                    <div data-dropdown-menu className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                                                        {(prestamo.estado === 'ACTIVO' || prestamo.estado === 'PARCIALMENTE_DEVUELTO') && (
                                                            <button
                                                                onClick={() => {
                                                                    window.location.href = `/prestamos/eventos/${prestamo.id}/devoluciones`;
                                                                    setOpenDropdown(null);
                                                                }}
                                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 flex items-center gap-2 border-b border-gray-200 dark:border-gray-700"
                                                            >
                                                                <RotateCcw className="w-4 h-4 text-green-600" />
                                                                Registrar Devolución
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => {
                                                                handleImprimir(prestamo);
                                                                setOpenDropdown(null);
                                                            }}
                                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 flex items-center gap-2 border-b border-gray-200 dark:border-gray-700"
                                                        >
                                                            <Printer className="w-4 h-4 text-purple-600" />
                                                            Imprimir
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                window.open(`/prestamos/eventos/${prestamo.id}`, '_blank');
                                                                setOpenDropdown(null);
                                                            }}
                                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center gap-2"
                                                        >
                                                            <Eye className="w-4 h-4 text-blue-600" />
                                                            Ver Detalle
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {/* Controles de Paginación */}
                    {prestamos.length > 0 && (
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                            {/* Información de resultados */}
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Mostrando <span className="font-semibold text-gray-900 dark:text-white">{paginacion.from}</span> a{' '}
                                <span className="font-semibold text-gray-900 dark:text-white">{paginacion.to}</span> de{' '}
                                <span className="font-semibold text-gray-900 dark:text-white">{paginacion.total}</span> resultados
                            </div>

                            {/* Controles de navegación */}
                            <div className="flex gap-2 items-center">
                                <Button
                                    variant="outline"
                                    onClick={() => setPaginaActual(Math.max(1, paginaActual - 1))}
                                    disabled={paginaActual === 1}
                                    className="text-sm"
                                >
                                    ← Anterior
                                </Button>

                                {/* Números de página */}
                                <div className="flex gap-1">
                                    {Array.from({ length: Math.min(5, paginacion.last_page) }, (_, i) => {
                                        const numeroPagina = paginacion.current_page <= 3
                                            ? i + 1
                                            : Math.max(1, paginacion.current_page - 2 + i);

                                        if (numeroPagina > paginacion.last_page) return null;

                                        return (
                                            <Button
                                                key={numeroPagina}
                                                onClick={() => setPaginaActual(numeroPagina)}
                                                variant={numeroPagina === paginacion.current_page ? 'default' : 'outline'}
                                                className="w-10 h-10 p-0 text-sm"
                                            >
                                                {numeroPagina}
                                            </Button>
                                        );
                                    })}
                                </div>

                                <Button
                                    variant="outline"
                                    onClick={() => setPaginaActual(Math.min(paginacion.last_page, paginaActual + 1))}
                                    disabled={paginaActual === paginacion.last_page}
                                    className="text-sm"
                                >
                                    Siguiente →
                                </Button>
                            </div>

                            {/* Información de página */}
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Página <span className="font-semibold text-gray-900 dark:text-white">{paginacion.current_page}</span> de{' '}
                                <span className="font-semibold text-gray-900 dark:text-white">{paginacion.last_page}</span>
                            </div>
                        </div>
                    )}
                </Card>

                <ToastContainer toasts={toasts} onClose={removeToast} />

                {prestamoParaImprimir && (
                    <OutputSelectionModal
                        isOpen={showOutputModal}
                        onClose={() => {
                            setShowOutputModal(false);
                            setPrestamoParaImprimir(null);
                        }}
                        documentoId={prestamoParaImprimir.id}
                        tipoDocumento="prestamo-evento"
                        documentoInfo={prestamoParaImprimir}
                    />
                )}
            </div>
        </AppLayout>
    );
}
