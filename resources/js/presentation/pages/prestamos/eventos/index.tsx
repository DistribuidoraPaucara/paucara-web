import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/presentation/components/ui/button';
import { Card } from '@/presentation/components/ui/card';
import ToastContainer from '@/presentation/components/ui/toast-container';
import { useToast } from '@/presentation/hooks/useToast';
import { Printer } from 'lucide-react';
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

    // Modal de impresión
    const [showOutputModal, setShowOutputModal] = useState(false);
    const [prestamoParaImprimir, setPrestamoParaImprimir] = useState<PrestamoEvento | null>(null);

    // Cargar datos iniciales
    useEffect(() => {
        cargarDatosIniciales();
    }, []);

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

            const datos = await prestamoEventoService.listar(filtros);
            setPrestamos(Array.isArray(datos) ? datos : []);
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

                {/* Filtros */}
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
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">ID</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Nombre</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Cliente</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Encargado</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Chofer</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Vehiculo</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Cantidad</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Garantía</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Fecha Préstamo</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Esperada Devolución</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Estado</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {prestamos.map((prestamo) => (
                                    <tr key={prestamo.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                            {prestamo.id}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                            {prestamo.nombre_evento}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-blue-600 dark:text-blue-400">
                                            {prestamo.cliente?.nombre || prestamo.cliente?.razon_social || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                            {prestamo.encargado_evento || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                            {prestamo.chofer?.name || prestamo.chofer?.nombre || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                            {prestamo.vehiculo_asignado || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                                            {prestamo.cantidad}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                            Bs {Number(prestamo.monto_garantia).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                            {formatDate(prestamo.fecha_prestamo)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                            {formatDate(prestamo.fecha_esperada_devolucion)}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {getEstadoBadge(prestamo.estado)}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex gap-2">
                                                {prestamo.estado === 'ACTIVO' && (
                                                    <button
                                                        onClick={() => window.location.href = `/prestamos/eventos/${prestamo.id}/devoluciones`}
                                                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-medium"
                                                    >
                                                        Devolver
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleImprimir(prestamo)}
                                                    className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-medium flex items-center gap-1"
                                                    title="Imprimir"
                                                >
                                                    <Printer className="w-3 h-3" />
                                                    Imprimir
                                                </button>
                                                <button
                                                    onClick={() => window.open(`/prestamos/eventos/${prestamo.id}`, '_blank')}
                                                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium"
                                                >
                                                    Ver
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </Card>

                <ToastContainer toasts={toasts} removeToast={removeToast} />

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
