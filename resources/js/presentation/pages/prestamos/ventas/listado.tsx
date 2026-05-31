import { Head } from '@inertiajs/react';
import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Badge } from '@/presentation/components/ui/badge';
import { Card } from '@/presentation/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/presentation/components/ui/dialog';
import { OutputSelectionModal } from '@/presentation/components/impresion/OutputSelectionModal';
import toast from 'react-hot-toast';

interface Cliente {
    id: number;
    nombre: string;
}

interface Usuario {
    id: number;
    name: string;
}

interface Venta {
    id: number;
    numero_venta: string;
    cliente_id: number | null;
    usuario_id: number;
    estado: 'BORRADOR' | 'CONFIRMADA' | 'CANCELADA';
    subtotal: number;
    total: number;
    cliente?: Cliente;
    usuario: Usuario;
    detalles_count?: number;
    fecha_venta: string;
    fecha_confirmacion?: string;
}

interface PaginationData {
    data: Venta[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

const getEstadoBadgeStyle = (estado: string) => {
    const styles: Record<string, { bg: string; text: string }> = {
        BORRADOR: { bg: 'bg-amber-100', text: 'text-amber-700' },
        CONFIRMADA: { bg: 'bg-green-100', text: 'text-green-700' },
        CANCELADA: { bg: 'bg-red-100', text: 'text-red-700' },
    };
    return styles[estado] || { bg: 'bg-gray-100', text: 'text-gray-700' };
};

export default function ListadoVentas() {
    const [ventas, setVentas] = useState<PaginationData | null>(null);
    const [loading, setLoading] = useState(false);
    const [buscar, setBuscar] = useState('');
    const [estadoFiltro, setEstadoFiltro] = useState('');
    const [filtroCliente, setFiltroCliente] = useState('');
    const [filtroFechaDesde, setFiltroFechaDesde] = useState('');
    const [filtroFechaHasta, setFiltroFechaHasta] = useState('');
    const [mostrarFiltros, setMostrarFiltros] = useState(false);
    const [page, setPage] = useState(1);

    // Modal de impresión
    const [showOutputModal, setShowOutputModal] = useState(false);
    const [ventaSeleccionada, setVentaSeleccionada] = useState<Venta | null>(null);

    // Modal de cancelación
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [ventaCancelar, setVentaCancelar] = useState<Venta | null>(null);
    const [motivoCancelacion, setMotivoCancelacion] = useState('');

    React.useEffect(() => {
        cargarVentas();
    }, [page, buscar, estadoFiltro, filtroCliente, filtroFechaDesde, filtroFechaHasta]);

    const cargarVentas = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (buscar) params.append('buscar', buscar);
            if (estadoFiltro) params.append('estado', estadoFiltro);
            if (filtroCliente) params.append('cliente', filtroCliente);
            if (filtroFechaDesde) params.append('fecha_desde', filtroFechaDesde);
            if (filtroFechaHasta) params.append('fecha_hasta', filtroFechaHasta);
            params.append('page', page.toString());

            const response = await fetch(`/api/prestamos-vendidos?${params}`, {
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            const result = await response.json();
            if (result.success) {
                setVentas(result.data);
            }
        } catch (error) {
            console.error('Error cargando ventas:', error);
        } finally {
            setLoading(false);
        }
    };

    const abrirModalImpresion = (venta: Venta) => {
        setVentaSeleccionada(venta);
        setShowOutputModal(true);
    };

    const verDetalle = (ventaId: number) => {
        window.location.href = `/prestamos/ventas/${ventaId}`;
    };

    const abrirModalCancelacion = (venta: Venta) => {
        setVentaCancelar(venta);
        setMotivoCancelacion('');
        setShowCancelModal(true);
    };

    const cancelarVenta = async () => {
        if (!ventaCancelar || !motivoCancelacion.trim()) {
            toast.error('Por favor ingresa un motivo de cancelación');
            return;
        }

        try {
            const response = await fetch(`/api/prestamos-vendidos/${ventaCancelar.id}/cancelar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ motivo: motivoCancelacion }),
            });

            const result = await response.json();
            if (result.success) {
                toast.success('✅ Venta cancelada exitosamente');
                setShowCancelModal(false);
                setVentaCancelar(null);
                setMotivoCancelacion('');
                cargarVentas();
            } else {
                toast.error('Error: ' + result.message);
            }
        } catch (error) {
            console.error('Error cancelando venta:', error);
            toast.error('Error cancelando la venta');
        }
    };

    // Calcular totales para cards
    const calcularTotales = () => {
        if (!ventas) return { total: 0, confirmadas: 0, borrador: 0, canceladas: 0 };
        const data = ventas.data;
        return {
            total: data.length,
            confirmadas: data.filter(v => v.estado === 'CONFIRMADA').reduce((sum, v) => sum + v.total, 0),
            borrador: data.filter(v => v.estado === 'BORRADOR').reduce((sum, v) => sum + v.total, 0),
            canceladas: data.filter(v => v.estado === 'CANCELADA').length,
        };
    };

    const totales = calcularTotales();

    const limpiarFiltros = () => {
        setBuscar('');
        setEstadoFiltro('');
        setFiltroCliente('');
        setFiltroFechaDesde('');
        setFiltroFechaHasta('');
        setPage(1);
    };

    const filtrosActivos = [buscar, estadoFiltro, filtroCliente, filtroFechaDesde, filtroFechaHasta].filter(Boolean).length;

    return (
        <AppLayout breadcrumbs={[{ label: 'Préstamos', href: '/prestamos' }, { label: 'Ventas de Prestables' }]}>
            <Head title="Listado de Ventas de Prestables" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">🛒 Ventas de Prestables</h1>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Listado de todas las ventas registradas
                        </p>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => (window.location.href = '/prestamos/ventas/crear')}>
                        ➕ Nueva Venta
                    </Button>
                </div>

                {/* Cards de Resumen */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-blue-200 dark:border-blue-700">
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">Total Ventas</p>
                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-1">{totales.total}</p>
                    </Card>
                    <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border-green-200 dark:border-green-700">
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">Confirmadas</p>
                        <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">Bs {totales.confirmadas.toFixed(2)}</p>
                    </Card>
                    <Card className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 border-amber-200 dark:border-amber-700">
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">En Borrador</p>
                        <p className="text-3xl font-bold text-amber-600 dark:text-amber-400 mt-1">Bs {totales.borrador.toFixed(2)}</p>
                    </Card>
                    <Card className="p-4 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 border-red-200 dark:border-red-700">
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">Canceladas</p>
                        <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-1">{totales.canceladas}</p>
                    </Card>
                </div>

                {/* Panel de Filtros */}
                <div className="mb-6">
                    <div className="flex gap-2 mb-3">
                        <Button
                            variant={mostrarFiltros ? 'default' : 'outline'}
                            onClick={() => setMostrarFiltros(!mostrarFiltros)}
                            className="gap-2"
                        >
                            <span>🔍 Filtros{filtrosActivos > 0 ? ` · ${filtrosActivos}` : ''}</span>
                        </Button>
                        {filtrosActivos > 0 && (
                            <Button variant="ghost" onClick={limpiarFiltros} className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
                                ✕ Limpiar
                            </Button>
                        )}
                    </div>

                    {mostrarFiltros && (
                        <Card className="p-6 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                            <div className="space-y-4">
                                {/* Fila 1: Búsqueda, Estado, Cliente */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            🔍 Búsqueda
                                        </label>
                                        <Input
                                            type="text"
                                            placeholder="Número venta..."
                                            value={buscar}
                                            onChange={(e) => {
                                                setBuscar(e.target.value);
                                                setPage(1);
                                            }}
                                            className="w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Estado
                                        </label>
                                        <select
                                            value={estadoFiltro}
                                            onChange={(e) => {
                                                setEstadoFiltro(e.target.value);
                                                setPage(1);
                                            }}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="">Todos</option>
                                            <option value="BORRADOR">Borrador</option>
                                            <option value="CONFIRMADA">Confirmada</option>
                                            <option value="CANCELADA">Cancelada</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            👤 Cliente
                                        </label>
                                        <Input
                                            type="text"
                                            placeholder="Nombre cliente..."
                                            value={filtroCliente}
                                            onChange={(e) => {
                                                setFiltroCliente(e.target.value);
                                                setPage(1);
                                            }}
                                            className="w-full"
                                        />
                                    </div>
                                </div>

                                {/* Fila 2: Fechas */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            📅 Fecha Desde
                                        </label>
                                        <input
                                            type="date"
                                            value={filtroFechaDesde}
                                            onChange={(e) => {
                                                setFiltroFechaDesde(e.target.value);
                                                setPage(1);
                                            }}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            📅 Fecha Hasta
                                        </label>
                                        <input
                                            type="date"
                                            value={filtroFechaHasta}
                                            onChange={(e) => {
                                                setFiltroFechaHasta(e.target.value);
                                                setPage(1);
                                            }}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                {/* Resultados */}
                                <div className="pt-3 border-t border-blue-200 dark:border-blue-800">
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        📊 Filtros activos: <strong>{filtrosActivos}</strong>
                                    </p>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>

                {/* Tabla de Ventas */}
                <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                                <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">
                                    Folio
                                </th>
                                <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">
                                    Cliente
                                </th>
                                <th className="px-4 py-3 text-right font-semibold text-slate-900 dark:text-slate-100">
                                    Total
                                </th>
                                <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">
                                    Estado
                                </th>
                                <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">
                                    Fecha
                                </th>
                                <th className="px-4 py-3 text-left font-semibold text-slate-900 dark:text-slate-100">
                                    Usuario
                                </th>
                                <th className="px-4 py-3 text-center font-semibold text-slate-900 dark:text-slate-100">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="px-4 py-8 text-center">
                                        <span className="text-slate-500 dark:text-slate-400">Cargando...</span>
                                    </td>
                                </tr>
                            ) : ventas?.data && ventas.data.length > 0 ? (
                                ventas.data.map((venta) => {
                                    const estilo = getEstadoBadgeStyle(venta.estado);

                                    return (
                                        <tr
                                            key={venta.id}
                                            className={`border-b border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/50 ${
                                                venta.estado === 'CANCELADA' ? 'bg-red-50 opacity-60 dark:bg-red-900/10' : ''
                                            }`}
                                        >
                                            <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">
                                                {venta.id}
                                            </td>
                                            <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                                                {venta.cliente?.nombre || '(Sin cliente)'}
                                            </td>
                                            {/* <td className="px-4 py-3 text-center text-slate-700 dark:text-slate-300">
                                                {venta.detalles_count || 0}
                                            </td> */}
                                            <td className="px-4 py-3 text-right font-semibold text-slate-900 dark:text-slate-100">
                                                {(Number(venta.total) || 0).toFixed(2)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge className={`${estilo.bg} ${estilo.text}`}>
                                                    {venta.estado}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                                                {new Date(venta.fecha_venta).toLocaleDateString('es-ES')}
                                            </td>
                                            <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                                                {venta.usuario.name}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <div className="flex justify-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => verDetalle(venta.id)}
                                                        title="Ver detalle"
                                                    >
                                                        👁️
                                                    </Button>

                                                    {venta.estado === 'CONFIRMADA' && (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => abrirModalImpresion(venta)}
                                                            title="Imprimir / Descargar"
                                                        >
                                                            🖨️
                                                        </Button>
                                                    )}

                                                    {venta.estado !== 'CANCELADA' && (
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => abrirModalCancelacion(venta)}
                                                            title="Cancelar venta"
                                                        >
                                                            ⛔
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={8} className="px-4 py-8 text-center">
                                        <span className="text-slate-500 dark:text-slate-400">No hay ventas registradas</span>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Paginación */}
                {ventas && ventas.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                            Mostrando página {ventas.current_page} de {ventas.last_page}
                            {' '} ({ventas.total} ventas totales)
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setPage(page - 1)}
                                disabled={page === 1}
                            >
                                ← Anterior
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setPage(page + 1)}
                                disabled={page === ventas.last_page}
                            >
                                Siguiente →
                            </Button>
                        </div>
                    </div>
                )}

                {/* Modal de selección de formato de impresión */}
                {ventaSeleccionada && (
                    <OutputSelectionModal
                        isOpen={showOutputModal}
                        onClose={() => {
                            setShowOutputModal(false);
                            setVentaSeleccionada(null);
                        }}
                        documentoId={ventaSeleccionada.id}
                        tipoDocumento="prestamos-vendidos"
                        documentoInfo={{
                            numero: ventaSeleccionada.numero_venta,
                            fecha: new Date(ventaSeleccionada.fecha_venta).toLocaleDateString('es-ES'),
                            monto: ventaSeleccionada.total,
                        }}
                    />
                )}

                {/* Modal de Cancelación */}
                <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
                    <DialogContent className="bg-white dark:bg-gray-900">
                        <DialogHeader>
                            <DialogTitle>Cancelar Venta</DialogTitle>
                        </DialogHeader>
                        {ventaCancelar && (
                            <div className="space-y-4">
                                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                                    <p className="text-sm text-red-900 dark:text-red-100">
                                        <span className="font-semibold">Venta #{ventaCancelar.numero_venta}</span> - {ventaCancelar.cliente?.nombre || '(Sin cliente)'}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Motivo de cancelación *
                                    </label>
                                    <textarea
                                        value={motivoCancelacion}
                                        onChange={(e) => setMotivoCancelacion(e.target.value)}
                                        placeholder="Describe el motivo de la cancelación..."
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        rows={3}
                                    />
                                </div>
                            </div>
                        )}
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowCancelModal(false)}>
                                Cancelar
                            </Button>
                            <Button variant="destructive" onClick={cancelarVenta}>
                                Confirmar Cancelación
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
