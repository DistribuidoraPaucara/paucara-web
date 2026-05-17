import React, { useEffect, useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/presentation/components/ui/button';
import { Card } from '@/presentation/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/presentation/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/presentation/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/presentation/components/ui/dropdown-menu';
import ToastContainer from '@/presentation/components/ui/toast-container';
import prestamoClienteService from '@/infrastructure/services/prestamo-cliente.service';
import type { PrestamoCliente, EstadoPrestamo, DatosDevolucionCliente } from '@/domain/entities/prestamos';
import { Plus, RotateCcw, Printer, Eye, Edit, X, History, MoreHorizontal } from 'lucide-react';
import { OutputSelectionModal } from '@/presentation/components/impresion/OutputSelectionModal';

export default function PrestamosClientesIndex() {
    const [prestamos, setPrestamos] = useState<PrestamoCliente[]>([]);
    const [loading, setLoading] = useState(true);
    const [showDevolucionModal, setShowDevolucionModal] = useState(false);
    const [selectedPrestamo, setSelectedPrestamo] = useState<PrestamoCliente | null>(null);
    const [showOutputModal, setShowOutputModal] = useState(false);
    const [selectedPrestamoForPrint, setSelectedPrestamoForPrint] = useState<PrestamoCliente | null>(null);
    const [showDetallesModal, setShowDetallesModal] = useState(false);
    const [selectedPrestamoDetalles, setSelectedPrestamoDetalles] = useState<PrestamoCliente | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedPrestamoEdit, setSelectedPrestamoEdit] = useState<PrestamoCliente | null>(null);
    const [editData, setEditData] = useState({
        fecha_esperada_devolucion: '',
        monto_garantia: 0,
        observaciones: '',
    });
    const [showAnularModal, setShowAnularModal] = useState(false);
    const [selectedPrestamoAnular, setSelectedPrestamoAnular] = useState<PrestamoCliente | null>(null);
    const [anularData, setAnularData] = useState({
        razon_anulacion: '',
    });

    // Expandable rows
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

    // Toasts
    const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'success' | 'error' | 'warning' | 'info' }>>([]);

    const addToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration = 4000) => {
        const id = Date.now().toString();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), duration);
    };

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    // Filtros
    const [filtroEstado, setFiltroEstado] = useState<string>('');
    const [filtroPrestableId, setFiltroPrestableId] = useState<string>('');
    const [filtroVentaId, setFiltroVentaId] = useState<string>('');
    const [filtroFechaDesde, setFiltroFechaDesde] = useState('');
    const [filtroFechaHasta, setFiltroFechaHasta] = useState('');
    const [busquedaCliente, setBusquedaCliente] = useState('');
    const [filtroVencimientoDesde, setFiltroVencimientoDesde] = useState('');
    const [filtroVencimientoHasta, setFiltroVencimientoHasta] = useState('');
    const [mostrarFiltros, setMostrarFiltros] = useState(false);

    const [devolucionData, setDevolucionData] = useState({
        fecha_devolucion: new Date().toISOString().split('T')[0],
        monto_cobrado_daño_total: 0,
        observaciones: '',
        detalles: [] as Array<{
            prestamo_cliente_detalle_id: number;
            cantidad_devuelta: number;
            cantidad_dañada_total: number;
        }>,
    });

    const obtenerMontoGarantia = (detalle: any): number => {
        const condiciones = detalle?.prestable?.condiciones;
        if (!condiciones) return 0;

        if (Array.isArray(condiciones)) {
            return Number(condiciones?.[0]?.monto_garantia || 0);
        }

        return Number(condiciones?.monto_garantia || 0);
    };

    const obtenerMontoDanioTotal = (detalle: any): number => {
        const normalizarTipoPrecio = (tipo: unknown): string => {
            return String(tipo || '')
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .toUpperCase()
                .replace(/\s+/g, '_')
                .trim();
        };

        const precios = Array.isArray(detalle?.prestable?.precios) ? detalle.prestable.precios : [];
        const precioDanio = precios.find((p: any) => {
            const tipoPrecio = normalizarTipoPrecio(p?.tipo_precio);
            return tipoPrecio === 'DANO_TOTAL' || (tipoPrecio.includes('DANO') && tipoPrecio.includes('TOTAL'));
        });
        if (precioDanio?.valor != null) {
            return Number(precioDanio.valor) || 0;
        }

        const condiciones = detalle?.prestable?.condiciones;
        if (!condiciones) return 0;

        if (Array.isArray(condiciones)) {
            const condicionActiva = condiciones.find((c: any) => Boolean(c?.activo)) || condiciones?.[0];
            return Number(condicionActiva?.monto_daño_total || 0);
        }

        return Number(condiciones?.monto_daño_total || 0);
    };

    useEffect(() => {
        if (!selectedPrestamo) return;

        console.group(`🧪 Modal Devolución - Préstamo #${selectedPrestamo.id}`);
        console.log('📦 selectedPrestamo completo:', selectedPrestamo);
        console.log('📦 detalles recibidos:', selectedPrestamo.detalles);
        (selectedPrestamo.detalles || []).forEach((detalle: any, index: number) => {
            const condiciones = detalle?.prestable?.condiciones;
            const montoDanio = Array.isArray(condiciones)
                ? Number(condiciones?.[0]?.monto_daño_total || 0)
                : Number(condiciones?.monto_daño_total || 0);
            const montoDanioFallbackPrecios = obtenerMontoDanioTotal(detalle);

            console.log(`🔎 Detalle[${index}]`, {
                detalle_id: detalle?.id,
                prestable_id: detalle?.prestable?.id,
                prestable_nombre: detalle?.prestable?.nombre,
                condiciones,
                monto_danio_total_detectado: montoDanio,
                monto_danio_total_final_usado: montoDanioFallbackPrecios,
            });
        });
        console.groupEnd();

        const montoTotalDanios = devolucionData.detalles.reduce((sum, det) => {
            const detallePrestamo = selectedPrestamo.detalles?.find((d: any) => d.id === det.prestamo_cliente_detalle_id);
            const montoDanioUnitario = obtenerMontoDanioTotal(detallePrestamo);
            return sum + (Number(det.cantidad_dañada_total || 0) * montoDanioUnitario);
        }, 0);

        if (Number(devolucionData.monto_cobrado_daño_total) !== Number(montoTotalDanios)) {
            setDevolucionData(prev => ({
                ...prev,
                monto_cobrado_daño_total: Number(montoTotalDanios.toFixed(2)),
            }));
        }
    }, [devolucionData.detalles, devolucionData.monto_cobrado_daño_total, selectedPrestamo]);

    const agregarDetalleADevolucion = (detalleId: number) => {
        const yaExiste = devolucionData.detalles.find(d => d.prestamo_cliente_detalle_id === detalleId);
        if (!yaExiste) {
            setDevolucionData({
                ...devolucionData,
                detalles: [...devolucionData.detalles, {
                    prestamo_cliente_detalle_id: detalleId,
                    cantidad_devuelta: 0,
                    cantidad_dañada_total: 0,
                }],
            });
        }
    };

    const actualizarDetalleDevolucion = (detalleId: number, campo: string, valor: number) => {
        setDevolucionData({
            ...devolucionData,
            detalles: devolucionData.detalles.map(d =>
                d.prestamo_cliente_detalle_id === detalleId
                    ? { ...d, [campo]: valor }
                    : d
            ),
        });
    };

    useEffect(() => {
        fetchPrestamos();
    }, [filtroEstado, filtroPrestableId, filtroVentaId, filtroFechaDesde, filtroFechaHasta]);

    const fetchPrestamos = async () => {
        setLoading(true);
        try {
            const params: any = { per_page: 100 };
            if (filtroEstado) params.estado = filtroEstado;
            if (filtroPrestableId) params.prestable_id = filtroPrestableId;
            if (filtroVentaId) params.venta_id = filtroVentaId;
            if (filtroFechaDesde) params.fecha_desde = filtroFechaDesde;
            if (filtroFechaHasta) params.fecha_hasta = filtroFechaHasta;
            const response = await prestamoClienteService.getAll(params);
            setPrestamos((response as any).data || []);
        } catch (error: any) {
            console.error('Error cargando préstamos:', error);
            addToast('Error cargando préstamos', 'error');
        } finally {
            setLoading(false);
        }
    };

    const toggleExpandedRow = (prestamoId: number) => {
        setExpandedRows(prev => {
            const newSet = new Set(prev);
            if (newSet.has(prestamoId)) {
                newSet.delete(prestamoId);
            } else {
                newSet.add(prestamoId);
            }
            return newSet;
        });
    };

    const handleRegistrarDevolucion = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPrestamo || devolucionData.detalles.length === 0) return;

        try {
            const payload = {
                fecha_devolucion: devolucionData.fecha_devolucion,
                monto_cobrado_daño_total: devolucionData.monto_cobrado_daño_total,
                observaciones: devolucionData.observaciones,
                detalles: devolucionData.detalles.map((d) => ({
                    prestamo_cliente_detalle_id: d.prestamo_cliente_detalle_id,
                    // El backend suma devuelta + dañada_total, por eso enviamos devuelta neta (sin dañados)
                    cantidad_devuelta: Math.max(0, Number(d.cantidad_devuelta || 0) - Number(d.cantidad_dañada_total || 0)),
                    cantidad_dañada_parcial: 0,
                    cantidad_dañada_total: Number(d.cantidad_dañada_total || 0),
                })),
            };

            console.log('📤 Enviando devolución:', payload);
            await prestamoClienteService.registrarDevolucion(selectedPrestamo.id, payload as any);

            addToast('✅ Devolución registrada exitosamente', 'success');
            setShowDevolucionModal(false);
            setDevolucionData({
                fecha_devolucion: new Date().toISOString().split('T')[0],
                monto_cobrado_daño_total: 0,
                observaciones: '',
                detalles: [],
            });
            await fetchPrestamos();

            // Abrir modal de impresión después de registrar devolución
            setSelectedPrestamoForPrint(selectedPrestamo);
            setShowOutputModal(true);
            setSelectedPrestamo(null);
        } catch (error: any) {
            console.error('Error al registrar devolución:', error);
            const mensajeError = error?.response?.data?.message || 'Error al registrar devolución';
            addToast(`❌ ${mensajeError}`, 'error', 6000);
        }
    };

    const handleEditarPrestamo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPrestamoEdit) return;

        try {
            // Realizar solicitud PATCH/PUT para actualizar el préstamo
            const response = await fetch(`/api/prestamos-cliente/${selectedPrestamoEdit.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify(editData),
            });

            if (response.ok) {
                setShowEditModal(false);
                setSelectedPrestamoEdit(null);
                await fetchPrestamos();
                addToast('Préstamo actualizado exitosamente', 'success');
            } else {
                const data = await response.json();
                addToast(data.message || 'Error al actualizar préstamo', 'error');
            }
        } catch (error: any) {
            console.error('Error al editar préstamo:', error);
            addToast(error.message || 'Error al editar préstamo', 'error');
        }
    };

    const abrirModalEdicion = (prestamo: PrestamoCliente) => {
        setSelectedPrestamoEdit(prestamo);
        setEditData({
            fecha_esperada_devolucion: prestamo.fecha_esperada_devolucion || '',
            monto_garantia: Number(prestamo.monto_garantia) || 0,
            observaciones: prestamo.observaciones || '',
        });
        setShowEditModal(true);
    };

    const handleAnularPrestamo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPrestamoAnular) return;

        try {
            const response = await fetch(`/api/prestamos-cliente/${selectedPrestamoAnular.id}/anular`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify(anularData),
            });

            if (response.ok) {
                setShowAnularModal(false);
                setSelectedPrestamoAnular(null);
                setAnularData({ razon_anulacion: '' });
                await fetchPrestamos();
                addToast('Préstamo anulado exitosamente', 'success');
            } else {
                const data = await response.json();
                addToast(data.message || 'Error al anular préstamo', 'error');
            }
        } catch (error: any) {
            console.error('Error al anular préstamo:', error);
            addToast(error.message || 'Error al anular préstamo', 'error');
        }
    };

    const abrirModalAnular = (prestamo: PrestamoCliente) => {
        setSelectedPrestamoAnular(prestamo);
        setAnularData({ razon_anulacion: '' });
        setShowAnularModal(true);
    };

    const getEstadoBadge = (estado: EstadoPrestamo | string) => {
        const styles: Record<string, string> = {
            ACTIVO: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
            COMPLETAMENTE_DEVUELTO: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
            PARCIALMENTE_DEVUELTO: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
            CANCELADO: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
        };
        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[estado as string] || styles.ACTIVO}`}>
                {(estado as string).replace(/_/g, ' ')}
            </span>
        );
    };

    const calcularDiasVencidos = (fecha_esperada: string | undefined) => {
        if (!fecha_esperada) return null;
        const hoy = new Date();
        const fechaEsperada = new Date(fecha_esperada);
        const diasVencidos = Math.floor(
            (hoy.getTime() - fechaEsperada.getTime()) / (1000 * 60 * 60 * 24)
        );
        return diasVencidos > 0 ? diasVencidos : null;
    };

    const limpiarFiltros = () => {
        setFiltroEstado('');
        setFiltroPrestableId('');
        setFiltroVentaId('');
        setFiltroFechaDesde('');
        setFiltroFechaHasta('');
        setBusquedaCliente('');
        setFiltroVencimientoDesde('');
        setFiltroVencimientoHasta('');
    };

    const prestamosFiltrados = useMemo(() => {
        let resultado = prestamos;

        if (busquedaCliente.trim()) {
            const busqueda = busquedaCliente.toLowerCase();
            resultado = resultado.filter(p =>
                (p.cliente?.nombre || '').toLowerCase().includes(busqueda) ||
                (p.cliente?.razon_social || '').toLowerCase().includes(busqueda)
            );
        }

        if (filtroVencimientoDesde) {
            resultado = resultado.filter(p =>
                p.fecha_esperada_devolucion && p.fecha_esperada_devolucion >= filtroVencimientoDesde
            );
        }

        if (filtroVencimientoHasta) {
            resultado = resultado.filter(p =>
                p.fecha_esperada_devolucion && p.fecha_esperada_devolucion <= filtroVencimientoHasta
            );
        }

        // Ordenar descendente por ID (IDs mayores primero)
        return resultado.sort((a, b) => b.id - a.id);
    }, [prestamos, busquedaCliente, filtroVencimientoDesde, filtroVencimientoHasta]);

    const filtrosActivos = [
        filtroEstado,
        filtroPrestableId,
        filtroVentaId,
        filtroFechaDesde,
        filtroFechaHasta,
        busquedaCliente,
        filtroVencimientoDesde,
        filtroVencimientoHasta,
    ].filter(Boolean).length;

    return (
        <AppLayout>
            <Head title="Préstamos a Clientes" />
            <div className="p-8 bg-white dark:bg-gray-950 min-h-screen">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">👥 Préstamos a Clientes</h1>
                    <a href="/prestamos/clientes/crear">
                        <Button className="gap-2">
                            <Plus size={20} />
                            Nuevo Préstamo
                        </Button>
                    </a>
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
                                {/* Fila 1: Búsqueda, Estado, Prestable y Venta */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            🔍 Buscar Cliente
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Nombre o razón social..."
                                            value={busquedaCliente}
                                            onChange={(e) => setBusquedaCliente(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Estado
                                        </label>
                                        <select
                                            value={filtroEstado}
                                            onChange={(e) => setFiltroEstado(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="">Todos</option>
                                            <option value="ACTIVO">Activo</option>
                                            <option value="PARCIALMENTE_DEVUELTO">Parcialmente Devuelto</option>
                                            <option value="COMPLETAMENTE_DEVUELTO">Completamente Devuelto</option>
                                            <option value="CANCELADO">Cancelado</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Prestable ID
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="ID..."
                                            value={filtroPrestableId}
                                            onChange={(e) => setFiltroPrestableId(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            🛒 Venta ID
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="ID de venta..."
                                            value={filtroVentaId}
                                            onChange={(e) => setFiltroVentaId(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                {/* Fila 2: Fechas Préstamo */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            📅 Fecha Préstamo Desde
                                        </label>
                                        <input
                                            type="date"
                                            value={filtroFechaDesde}
                                            onChange={(e) => setFiltroFechaDesde(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            📅 Fecha Préstamo Hasta
                                        </label>
                                        <input
                                            type="date"
                                            value={filtroFechaHasta}
                                            onChange={(e) => setFiltroFechaHasta(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                {/* Fila 3: Fechas Vencimiento */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            ⏰ Fecha Vencimiento Desde
                                        </label>
                                        <input
                                            type="date"
                                            value={filtroVencimientoDesde}
                                            onChange={(e) => setFiltroVencimientoDesde(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            ⏰ Fecha Vencimiento Hasta
                                        </label>
                                        <input
                                            type="date"
                                            value={filtroVencimientoHasta}
                                            onChange={(e) => setFiltroVencimientoHasta(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                {/* Resultados */}
                                <div className="pt-3 border-t border-blue-200 dark:border-blue-800">
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        📊 <strong>{prestamosFiltrados.length}</strong> préstamo{prestamosFiltrados.length !== 1 ? 's' : ''} encontrado{prestamosFiltrados.length !== 1 ? 's' : ''}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>

                {/* Modal de Devolución Flotante */}
                {selectedPrestamo && (() => {
                    const cantidadTotal = selectedPrestamo.detalles?.reduce((sum: number, d: any) => sum + (d.cantidad_prestada || 0), 0) || 0;
                    const prestabesNombres = selectedPrestamo.detalles?.map((d: any) => d.prestable?.nombre).join(', ') || selectedPrestamo.prestable?.nombre || 'N/D';

                    // Debug: Log de datos para verificar capacidad
                    if (selectedPrestamo.detalles && selectedPrestamo.detalles.length > 0) {
                    }

                    return (
                        <Dialog open={showDevolucionModal} onOpenChange={setShowDevolucionModal}>
                            <DialogContent
                                style={{ width: '90vw', maxWidth: '90vw' }}
                                className="max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 p-2"
                            >
                                <DialogHeader>
                                    <DialogTitle>Registrar Devolución</DialogTitle>
                                    <DialogDescription>
                                        {prestabesNombres} - {selectedPrestamo.cliente?.nombre || selectedPrestamo.cliente?.razon_social}
                                    </DialogDescription>
                                </DialogHeader>
                                {/* <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-4">
                                    <p className="text-sm text-blue-900 dark:text-blue-200 mb-3">
                                        <strong>📦 Prestables a Devolver:</strong>
                                    </p>
                                    {selectedPrestamo.detalles?.map((detalle: any) => {
                                        // Calcular cantidad ya devuelta para este detalle
                                        const cantidadYaDevuelta = detalle.devolucion_detalles?.reduce((sum: number, d: any) =>
                                            sum + (d.cantidad_devuelta + d.cantidad_dañada_parcial + d.cantidad_dañada_total), 0) || 0;
                                        const cantidadFaltante = detalle.cantidad_prestada - cantidadYaDevuelta;
                                        const estado = cantidadFaltante === 0 ? '✅ Completa' :
                                                     cantidadFaltante === detalle.cantidad_prestada ? '⏳ Pendiente' :
                                                     '⚠️ Parcial';

                                        return (
                                            <div key={detalle.id} className="mb-2 bg-white dark:bg-gray-800 rounded border border-blue-200 dark:border-blue-700 overflow-hidden">
                                                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-700">
                                                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                                                        {detalle.prestable?.nombre} {estado}
                                                    </p>
                                                </div>
                                                <table className="w-full text-sm">
                                                    <tbody>
                                                        <tr className="border-b border-gray-200 dark:border-gray-700">
                                                            <td className="px-3 py-2 text-gray-600 dark:text-gray-400">📤 Prestado</td>
                                                            <td className="px-3 py-2 font-bold text-gray-800 dark:text-gray-200">{detalle.cantidad_prestada}</td>
                                                            <td className="px-3 py-2 text-gray-600 dark:text-gray-400">📥 Devuelto</td>
                                                            <td className="px-3 py-2 font-bold text-green-600 dark:text-green-400">{cantidadYaDevuelta}</td>
                                                            <td className="px-3 py-2 text-gray-600 dark:text-gray-400">⏳ Faltante</td>
                                                            <td className="px-3 py-2 font-bold text-orange-600 dark:text-orange-400">{cantidadFaltante}</td>
                                                        </tr>
                                                        {detalle.prestable?.capacidad && (
                                                            <tr className="bg-gray-50 dark:bg-gray-700/50">
                                                                <td colSpan={6} className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400">
                                                                    📦 Capacidad: {detalle.prestable.capacidad} embases/canastilla
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        );
                                    })}
                                </div> */}
                                <form onSubmit={handleRegistrarDevolucion} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div className="p-3 rounded-lg border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20">
                                        <p className="text-xs text-emerald-700 dark:text-emerald-300">Garantía del préstamo</p>
                                        <p className="text-lg font-bold text-emerald-800 dark:text-emerald-200">
                                            Bs {Number(selectedPrestamo?.monto_garantia || 0).toFixed(2)}
                                        </p>
                                    </div>
                                </div>

                                {/* Tabla Editable de Devoluciones */}
                                <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600">
                                                <th className="px-3 py-2 text-left font-semibold text-gray-900 dark:text-white">📦 Prestable</th>
                                                <th className="px-3 py-2 text-center font-semibold text-gray-900 dark:text-white">📤 Prestado</th>
                                                <th className="px-3 py-2 text-center font-semibold text-gray-900 dark:text-white">📥 Devuelto</th>
                                                <th className="px-3 py-2 text-center font-semibold text-gray-900 dark:text-white">⏳ Faltante</th>
                                                <th className="px-3 py-2 text-center font-semibold text-gray-900 dark:text-white">✏️ Devolviendo</th>
                                                <th className="px-3 py-2 text-center font-semibold text-gray-900 dark:text-white">⚫ D.Total</th>
                                                {/* <th className="px-3 py-2 text-center font-semibold text-gray-900 dark:text-white">🔐 Garantía</th> */}
                                                <th className="px-3 py-2 text-center font-semibold text-gray-900 dark:text-white">💸 Daño unit.</th>
                                                <th className="px-3 py-2 text-center font-semibold text-gray-900 dark:text-white">🧮 Subtotal daño</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedPrestamo.detalles?.map((detalle: any) => {
                                                const cantidadYaDevuelta = (detalle.devolucion_detalles || detalle.devolucionDetalles)?.reduce((sum: number, d: any) =>
                                                    sum + (d.cantidad_devuelta + d.cantidad_dañada_parcial + d.cantidad_dañada_total), 0) || 0;
                                                const cantidadFaltante = detalle.cantidad_prestada - cantidadYaDevuelta;
                                                const detalleAct = devolucionData.detalles.find(d => d.prestamo_cliente_detalle_id === detalle.id);
                                                const montoGarantia = obtenerMontoGarantia(detalle);
                                                const montoDanioUnitario = obtenerMontoDanioTotal(detalle);
                                                const montoDanioFila = Number(detalleAct?.cantidad_dañada_total || 0) * montoDanioUnitario;

                                                return (
                                                    <tr key={detalle.id} className={`border-b border-gray-200 dark:border-gray-700 ${cantidadFaltante > 0 ? 'hover:bg-gray-50 dark:hover:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900 opacity-60'}`}>
                                                        <td className="px-3 py-2 text-gray-900 dark:text-white font-medium">{detalle.prestable?.nombre}</td>
                                                        <td className="px-3 py-2 text-center text-gray-700 dark:text-gray-300">{detalle.cantidad_prestada}</td>
                                                        <td className="px-3 py-2 text-center text-green-600 dark:text-green-400 font-bold">{cantidadYaDevuelta}</td>
                                                        <td className="px-3 py-2 text-center text-orange-600 dark:text-orange-400 font-bold">{cantidadFaltante}</td>
                                                        <td className="px-3 py-2 text-center">
                                                            {cantidadFaltante > 0 ? (
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    max={cantidadFaltante}
                                                                    value={detalleAct?.cantidad_devuelta || ''}
                                                                    placeholder="0"
                                                                    onChange={(e) => {
                                                                        const cantidad = e.target.value === '' ? 0 : Number(e.target.value);
                                                                        const detailExists = devolucionData.detalles.some(d => d.prestamo_cliente_detalle_id === detalle.id);

                                                                        // Si es canastilla, auto-calcular embases
                                                                        let detallesActualizados = devolucionData.detalles;
                                                                        if (detalle.prestable?.tipo === 'CANASTILLA') {
                                                                            const capacidad = detalle.prestable?.capacidad || 0;
                                                                            const cantidadEmbases = cantidad * capacidad;
                                                                            const detalleEmbases = selectedPrestamo.detalles?.find((d: any) => d.prestable?.tipo === 'EMBASE' || d.prestable?.tipo === 'EMBASES');

                                                                            if (detalleEmbases) {
                                                                                const embasesExiste = devolucionData.detalles.some(d => d.prestamo_cliente_detalle_id === detalleEmbases.id);
                                                                                if (embasesExiste) {
                                                                                    detallesActualizados = detallesActualizados.map(d =>
                                                                                        d.prestamo_cliente_detalle_id === detalleEmbases.id
                                                                                            ? { ...d, cantidad_devuelta: cantidadEmbases }
                                                                                            : d
                                                                                    );
                                                                                } else if (cantidadEmbases > 0) {
                                                                                    detallesActualizados = [...detallesActualizados, {
                                                                                        prestamo_cliente_detalle_id: Number(detalleEmbases.id),
                                                                                        cantidad_devuelta: cantidadEmbases,
                                                                                        cantidad_dañada_total: 0,
                                                                                    }];
                                                                                }
                                                                            }
                                                                        }

                                                                        setDevolucionData({
                                                                            ...devolucionData,
                                                                            detalles: detailExists
                                                                                ? detallesActualizados.map(d =>
                                                                                    d.prestamo_cliente_detalle_id === detalle.id
                                                                                        ? { ...d, cantidad_devuelta: cantidad }
                                                                                        : d
                                                                                  )
                                                                                : [...detallesActualizados, {
                                                                                    prestamo_cliente_detalle_id: detalle.id,
                                                                                    cantidad_devuelta: cantidad,
                                                                                    cantidad_dañada_total: 0,
                                                                                  }],
                                                                        });
                                                                    }}
                                                                    className="w-full px-2 py-1 border border-blue-400 dark:border-blue-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center font-bold focus:ring-2 focus:ring-blue-500"
                                                                />
                                                            ) : (
                                                                <span className="text-gray-400">-</span>
                                                            )}
                                                        </td>
                                                        <td className="px-3 py-2 text-center">
                                                            {detalleAct ? (
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    max={detalleAct.cantidad_devuelta || 0}
                                                                    value={detalleAct.cantidad_dañada_total || 0}
                                                                    onChange={(e) => {
                                                                        setDevolucionData({
                                                                            ...devolucionData,
                                                                            detalles: devolucionData.detalles.map(d =>
                                                                                d.prestamo_cliente_detalle_id === detalle.id
                                                                                    ? { ...d, cantidad_dañada_total: Number(e.target.value) }
                                                                                    : d
                                                                            ),
                                                                        });
                                                                    }}
                                                                    className="w-full px-2 py-1 border border-red-400 dark:border-red-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center focus:ring-2 focus:ring-red-500"
                                                                />
                                                            ) : (
                                                                <span className="text-gray-400">-</span>
                                                            )}
                                                        </td>
                                                        {/* <td className="px-3 py-2 text-center text-emerald-700 dark:text-emerald-300 font-semibold">
                                                            Bs {montoGarantia.toFixed(2)}
                                                        </td> */}
                                                        <td className="px-3 py-2 text-center text-blue-700 dark:text-blue-300 font-semibold">
                                                            Bs {montoDanioUnitario.toFixed(2)}
                                                        </td>
                                                        <td className="px-3 py-2 text-center text-red-700 dark:text-red-300 font-semibold">
                                                            Bs {montoDanioFila.toFixed(2)}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Monto a Pagar */}
                                        <div>
                                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                                💰 Monto Total a Pagar por Daños
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={devolucionData.monto_cobrado_daño_total}
                                                readOnly
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 text-lg font-semibold"
                                            />
                                        </div>

                                        {/* Fecha Devolución */}
                                        <div>
                                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                                Fecha Devolución *
                                            </label>
                                            <input
                                                type="date"
                                                required
                                                value={devolucionData.fecha_devolucion}
                                                onChange={(e) =>
                                                    setDevolucionData({
                                                        ...devolucionData,
                                                        fecha_devolucion: e.target.value,
                                                    })
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        {/* Observaciones */}
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                                Observaciones
                                            </label>
                                            <textarea
                                                value={devolucionData.observaciones}
                                                onChange={(e) =>
                                                    setDevolucionData({
                                                        ...devolucionData,
                                                        observaciones: e.target.value,
                                                    })
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                                rows={3}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-2 pt-4">
                                        <Button type="submit" className="flex-1" disabled={devolucionData.detalles.length === 0}>
                                            Registrar Devolución
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="flex-1"
                                            onClick={() => {
                                                setShowDevolucionModal(false);
                                                setSelectedPrestamo(null);
                                                setDevolucionData({
                                                    fecha_devolucion: new Date().toISOString().split('T')[0],
                                                    monto_cobrado_daño_total: 0,
                                                    observaciones: '',
                                                    detalles: [],
                                                });
                                            }}
                                        >
                                            Cancelar
                                        </Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                    );
                })()}

                {/* Tabla de Préstamos */}
                <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-gray-600 dark:text-gray-400">Cargando...</div>
                    ) : prestamos.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="flex flex-col items-center justify-center">
                                <div className="text-5xl mb-4">📦</div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    No existen préstamos registrados
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                    Crea tu primer préstamo haciendo clic en el botón "Nuevo Préstamo"
                                </p>
                                <a href="/prestamos/clientes/crear">
                                    <Button className="gap-2">
                                        <Plus size={20} />
                                        Crear Préstamo
                                    </Button>
                                </a>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                    <TableRow className="border-gray-200 dark:border-gray-700">
                                        <TableHead className="text-gray-900 dark:text-gray-100 w-16">Folio</TableHead>
                                        <TableHead className="text-gray-900 dark:text-gray-100">Cliente</TableHead>
                                        <TableHead className="text-center text-gray-900 dark:text-gray-100">Venta ID</TableHead>
                                        {/* <TableHead className="text-gray-900 dark:text-gray-100">Prestable</TableHead> */}
                                        {/* <TableHead className="text-center text-gray-900 dark:text-gray-100">Cantidad</TableHead> */}
                                        <TableHead className="text-gray-900 dark:text-gray-100">Garantía</TableHead>
                                        <TableHead className="text-center text-gray-900 dark:text-gray-100">Total</TableHead>
                                        <TableHead className="text-center text-gray-900 dark:text-gray-100">Devuelto</TableHead>
                                        <TableHead className="text-center text-gray-900 dark:text-gray-100">Faltante</TableHead>
                                        <TableHead className="text-gray-900 dark:text-gray-100">Fecha Préstamo</TableHead>
                                        <TableHead className="text-gray-900 dark:text-gray-100">Plazo</TableHead>
                                        {/* <TableHead className="text-gray-900 dark:text-gray-100">Vencido</TableHead> */}
                                        <TableHead className="text-gray-900 dark:text-gray-100">Estado</TableHead>
                                        <TableHead className="text-right text-gray-900 dark:text-gray-100">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {prestamosFiltrados.map((p) => {
                                        const diasVencidos = calcularDiasVencidos(p.fecha_esperada_devolucion);
                                        // Mostrar resumen de detalles para la nueva estructura
                                        const cantidadTotal = p.detalles?.reduce((sum: number, d: any) => sum + (d.cantidad_prestada || 0), 0) || 0;
                                        // Sumar devoluciones de cada detalle usando devolucion_detalles
                                        const cantidadDevuelta = p.detalles?.reduce((sum: number, detalle: any) => {
                                            const devueltoDetalle = detalle.devolucion_detalles?.reduce((s: number, dev: any) => s + (dev.cantidad_devuelta || 0), 0) || 0;
                                            return sum + devueltoDetalle;
                                        }, 0) || 0;
                                        const cantidadFaltante = p.estado === 'CANCELADO' ? 0 : Math.max(0, cantidadTotal - cantidadDevuelta);
                                        const prestabesNombres = p.detalles?.map((d: any) => d.prestable?.nombre).join(', ') || p.prestable?.nombre || 'N/D';
                                        const isExpanded = expandedRows.has(p.id);

                                        return (
                                            <>
                                                <TableRow key={p.id} className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                                                <TableCell className="text-gray-900 dark:text-gray-100 font-semibold cursor-pointer" onClick={() => toggleExpandedRow(p.id)}>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}>▶</span>
                                                        #{p.id}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-gray-900 dark:text-gray-100">{p.cliente?.nombre || p.cliente?.razon_social}</TableCell>
                                                <TableCell className="text-center">
                                                    {p.venta_id ? (
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                                                            #{p.venta_id}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400 dark:text-gray-500">-</span>
                                                    )}
                                                </TableCell>
                                                {/* <TableCell className="text-gray-900 dark:text-gray-100 text-sm">{prestabesNombres}</TableCell> */}
                                                {/* <TableCell className="text-center text-gray-900 dark:text-gray-100">{cantidadTotal || p.cantidad || 0}</TableCell> */}
                                                <TableCell className="text-gray-900 dark:text-gray-100">Bs {p.monto_garantia}</TableCell>
                                                <TableCell className="text-center text-gray-900 dark:text-gray-100 font-semibold">{cantidadTotal}</TableCell>
                                                <TableCell className="text-center text-gray-900 dark:text-gray-100 font-semibold text-green-600 dark:text-green-400">{cantidadDevuelta}</TableCell>
                                                <TableCell className="text-center">
                                                    <span className={`font-semibold ${cantidadFaltante === 0 ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                                                        {cantidadFaltante}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-gray-900 dark:text-gray-100">
                                                    {new Date(p.fecha_prestamo).toLocaleDateString('es-ES')}
                                                </TableCell>
                                                <TableCell className="text-gray-900 dark:text-gray-100">
                                                    {p.fecha_esperada_devolucion
                                                        ? new Date(p.fecha_esperada_devolucion).toLocaleDateString(
                                                            'es-ES'
                                                        )
                                                        : 'S/P'}
                                                </TableCell>
                                                {/* <TableCell className="text-gray-900 dark:text-gray-100">
                                                    {diasVencidos !== null ? (
                                                        <span className="text-red-600 dark:text-red-400 font-semibold">
                                                            {diasVencidos}d
                                                        </span>
                                                    ) : (
                                                        '-'
                                                    )}
                                                </TableCell> */}
                                                <TableCell>{getEstadoBadge(p.estado)}</TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="h-8 w-8 p-0"
                                                                aria-label="Abrir menú de acciones"
                                                            >
                                                                <MoreHorizontal size={16} />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-56">
                                                            <DropdownMenuItem onSelect={() => abrirModalEdicion(p)}>
                                                                <Edit size={16} />
                                                                Editar
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild>
                                                                <a href={`/prestamos/clientes/${p.id}/devoluciones`}>
                                                                    <History size={16} />
                                                                    Ver devoluciones
                                                                </a>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onSelect={async () => {
                                                                    try {
                                                                        const prestamoActualizado = await prestamoClienteService.getById(p.id);
                                                                        setSelectedPrestamoDetalles(prestamoActualizado);
                                                                        setShowDetallesModal(true);
                                                                    } catch (error) {
                                                                        console.error('Error cargando detalles:', error);
                                                                        addToast('Error cargando detalles del préstamo', 'error');
                                                                    }
                                                                }}
                                                            >
                                                                <Eye size={16} />
                                                                Ver detalles
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onSelect={() => {
                                                                    setSelectedPrestamoForPrint(p);
                                                                    setShowOutputModal(true);
                                                                }}
                                                            >
                                                                <Printer size={16} />
                                                                Imprimir
                                                            </DropdownMenuItem>
                                                            {(p.estado === 'ACTIVO' || p.estado === 'PARCIALMENTE_DEVUELTO') && (
                                                                <DropdownMenuItem
                                                                    onSelect={async () => {
                                                                        try {
                                                                            console.group(`📥 Abrir modal devolución - préstamo #${p.id}`);
                                                                            console.log('📋 préstamo desde listado (getAll):', p);
                                                                            console.log('📋 detalles desde listado (getAll):', p.detalles);

                                                                            const prestamoActualizado = await prestamoClienteService.getById(Number(p.id));
                                                                            console.log('✅ préstamo recargado (getById):', prestamoActualizado);
                                                                            console.log('✅ detalles recargados (getById):', (prestamoActualizado as any)?.detalles);
                                                                            console.groupEnd();

                                                                            setSelectedPrestamo(prestamoActualizado as PrestamoCliente);
                                                                            setShowDevolucionModal(true);
                                                                        } catch (error) {
                                                                            console.error('❌ Error recargando préstamo para devolución:', error);
                                                                            addToast('Error cargando datos completos del préstamo', 'error');
                                                                        }
                                                                    }}
                                                                >
                                                                    <RotateCcw size={16} />
                                                                    Registrar devolución
                                                                </DropdownMenuItem>
                                                            )}
                                                            {p.estado !== 'CANCELADO' && (
                                                                <DropdownMenuItem
                                                                    variant="destructive"
                                                                    onSelect={() => abrirModalAnular(p)}
                                                                >
                                                                    <X size={16} />
                                                                    Anular préstamo
                                                                </DropdownMenuItem>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>

                                            {/* Expandable detail rows */}
                                            {isExpanded && p.detalles && p.detalles.map((detalle: any, detalleIdx: number) => {
                                                const totalDetalle = detalle.cantidad_prestada || 0;
                                                const devueltoDetalle = detalle.devolucion_detalles?.reduce((s: number, dev: any) => s + (dev.cantidad_devuelta || 0), 0) || 0;
                                                const faltanteDetalle = p.estado === 'CANCELADO' ? 0 : Math.max(0, totalDetalle - devueltoDetalle);
                                                const nombreDetalle = detalle.prestable?.nombre || 'N/D';

                                                return (
                                                    <TableRow key={`${p.id}-detail-${detalleIdx}`} className="bg-gray-50 dark:bg-gray-900/30 border-gray-200 dark:border-gray-700">
                                                        <TableCell className="pl-4 text-gray-700 dark:text-gray-300 text-sm">{nombreDetalle}</TableCell>
                                                        <TableCell></TableCell>
                                                        <TableCell></TableCell>
                                                        <TableCell></TableCell>
                                                        <TableCell className="text-center text-gray-700 dark:text-gray-300 text-sm font-medium">{totalDetalle}</TableCell>
                                                        <TableCell className="text-center text-green-600 dark:text-green-400 text-sm font-medium">{devueltoDetalle}</TableCell>
                                                        <TableCell className="text-center">
                                                            <span className={`text-sm font-medium ${faltanteDetalle === 0 ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                                                                {faltanteDetalle}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="text-gray-700 dark:text-gray-300 text-sm"></TableCell>
                                                        <TableCell className="text-gray-700 dark:text-gray-300 text-sm"></TableCell>
                                                        <TableCell></TableCell>
                                                        <TableCell></TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                            </>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </Card>

                {/* Modal de Edición del Préstamo */}
                {selectedPrestamoEdit && (
                    <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                        <DialogContent className="max-w-sm w-full">
                            <DialogHeader>
                                <DialogTitle>Editar Préstamo #{selectedPrestamoEdit.id}</DialogTitle>
                                <DialogDescription>
                                    {selectedPrestamoEdit.cliente?.nombre || selectedPrestamoEdit.cliente?.razon_social}
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleEditarPrestamo} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                        Fecha Esperada de Devolución
                                    </label>
                                    <input
                                        type="date"
                                        value={editData.fecha_esperada_devolucion}
                                        onChange={(e) =>
                                            setEditData({
                                                ...editData,
                                                fecha_esperada_devolucion: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                        Monto Garantía
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={editData.monto_garantia}
                                        onChange={(e) =>
                                            setEditData({
                                                ...editData,
                                                monto_garantia: Number(e.target.value),
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                        Observaciones
                                    </label>
                                    <textarea
                                        value={editData.observaciones}
                                        onChange={(e) =>
                                            setEditData({
                                                ...editData,
                                                observaciones: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        rows={3}
                                    />
                                </div>
                                <div className="flex gap-2 pt-4">
                                    <Button type="submit" className="flex-1">Guardar Cambios</Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => {
                                            setShowEditModal(false);
                                            setSelectedPrestamoEdit(null);
                                        }}
                                    >
                                        Cancelar
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                )}

                {/* Modal de Detalles del Préstamo */}
                {selectedPrestamoDetalles && (
                    <Dialog open={showDetallesModal} onOpenChange={setShowDetallesModal}>
                        <DialogContent
                                style={{ width: '90vw', maxWidth: '90vw' }}
                                className="max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 p-2"
                            >
                            <DialogHeader>
                                <DialogTitle>Detalles del Préstamo #{selectedPrestamoDetalles.id}</DialogTitle>
                                <DialogDescription>
                                    {selectedPrestamoDetalles.cliente?.nombre || selectedPrestamoDetalles.cliente?.razon_social}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6">
                                {/* Información General */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Cliente</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {selectedPrestamoDetalles.cliente?.nombre || selectedPrestamoDetalles.cliente?.razon_social}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Estado</p>
                                        <p className="font-semibold">{getEstadoBadge(selectedPrestamoDetalles.estado)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Chofer</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {selectedPrestamoDetalles.chofer?.nombre || 'No asignado'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Venta Relacionada</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {selectedPrestamoDetalles.venta_id ? `#${selectedPrestamoDetalles.venta_id}` : 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Fecha Préstamo</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {new Date(selectedPrestamoDetalles.fecha_prestamo).toLocaleDateString('es-ES')}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Vencimiento</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {selectedPrestamoDetalles.fecha_esperada_devolucion
                                                ? new Date(selectedPrestamoDetalles.fecha_esperada_devolucion).toLocaleDateString('es-ES')
                                                : 'No especificado'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Garantía</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">Bs {selectedPrestamoDetalles.monto_garantia}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Tipo</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {selectedPrestamoDetalles.es_venta ? 'Venta' : 'Préstamo'}
                                        </p>
                                    </div>
                                </div>

                                {/* Detalles de Prestables */}
                                {selectedPrestamoDetalles.detalles && selectedPrestamoDetalles.detalles.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">Prestables y Devoluciones</h3>
                                        <div className="space-y-6">
                                            {selectedPrestamoDetalles.detalles.map((detalle: any, idx: number) => {
                                                const totalPrestado = detalle.cantidad_prestada || 0;
                                                const totalDevuelto = detalle.devolucion_detalles?.reduce((sum: number, dev: any) => sum + (dev.cantidad_devuelta || 0), 0) || 0;
                                                const totalDañadoParcial = detalle.devolucion_detalles?.reduce((sum: number, dev: any) => sum + (dev.cantidad_dañada_parcial || 0), 0) || 0;
                                                const totalDañadoTotal = detalle.devolucion_detalles?.reduce((sum: number, dev: any) => sum + (dev.cantidad_dañada_total || 0), 0) || 0;
                                                const totalFaltante = Math.max(0, totalPrestado - totalDevuelto - totalDañadoTotal);
                                                const porcentajeDevolución = totalPrestado > 0 ? Math.round((totalDevuelto / totalPrestado) * 100) : 0;

                                                return (
                                                    <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                                        {/* Encabezado */}
                                                        <div className="flex justify-between items-start mb-4">
                                                            <div>
                                                                <p className="font-semibold text-lg text-gray-900 dark:text-white">
                                                                    {detalle.prestable?.nombre || 'Prestable'}
                                                                </p>
                                                            </div>
                                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${detalle.estado === 'ACTIVO'
                                                                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                                                                    : detalle.estado === 'COMPLETAMENTE_DEVUELTO'
                                                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                                                                        : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                                                                }`}>
                                                                {detalle.estado.replace(/_/g, ' ')}
                                                            </span>
                                                        </div>

                                                        {/* Resumen de Devoluciones */}
                                                        <div className="mb-4 p-3 bg-white dark:bg-gray-900 rounded-lg">
                                                            <div className="grid grid-cols-4 gap-3 mb-3">
                                                                <div>
                                                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Prestado</p>
                                                                    <p className="font-semibold text-lg text-gray-900 dark:text-white">{totalPrestado}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Devuelto</p>
                                                                    <p className="font-semibold text-lg text-green-600 dark:text-green-400">{totalDevuelto}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Faltante</p>
                                                                    <p className="font-semibold text-lg text-orange-600 dark:text-orange-400">{totalFaltante}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">% Devuelto</p>
                                                                    <p className="font-semibold text-lg text-blue-600 dark:text-blue-400">{porcentajeDevolución}%</p>
                                                                </div>
                                                            </div>
                                                            {/* Barra de progreso */}
                                                            <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2">
                                                                <div
                                                                    className="bg-green-600 dark:bg-green-500 h-2 rounded-full transition-all"
                                                                    style={{ width: `${porcentajeDevolución}%` }}
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Tabla de Devoluciones Detalladas */}
                                                        {detalle.devolucion_detalles && detalle.devolucion_detalles.length > 0 ? (
                                                            <div className="overflow-x-auto">
                                                                    <table className="w-full text-xs">
                                                                        <thead>
                                                                            <tr className="border-b border-gray-300 dark:border-gray-600">
                                                                                <th className="text-left py-2 px-2 font-semibold text-gray-900 dark:text-white">Fecha</th>
                                                                            <th className="text-center py-2 px-2 font-semibold text-gray-900 dark:text-white">Devuelto</th>
                                                                            <th className="text-center py-2 px-2 font-semibold text-gray-900 dark:text-white">Dañado Parcial</th>
                                                                            <th className="text-center py-2 px-2 font-semibold text-gray-900 dark:text-white">Dañado Total</th>
                                                                            <th className="text-left py-2 px-2 font-semibold text-gray-900 dark:text-white">Observaciones</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {detalle.devolucion_detalles.map((dev: any, devIdx: number) => (
                                                                            <tr key={devIdx} className="border-b border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-700/50">
                                                                                <td className="py-2 px-2 text-gray-600 dark:text-gray-400">
                                                                                    {new Date(dev.created_at).toLocaleDateString('es-ES')}
                                                                                </td>
                                                                                <td className="text-center py-2 px-2 text-green-600 dark:text-green-400 font-medium">
                                                                                    {dev.cantidad_devuelta || 0}
                                                                                </td>
                                                                                <td className="text-center py-2 px-2 text-yellow-600 dark:text-yellow-400 font-medium">
                                                                                    {dev.cantidad_dañada_parcial || 0}
                                                                                </td>
                                                                                <td className="text-center py-2 px-2 text-red-600 dark:text-red-400 font-medium">
                                                                                    {dev.cantidad_dañada_total || 0}
                                                                                </td>
                                                                                <td className="py-2 px-2 text-gray-600 dark:text-gray-400 text-xs">
                                                                                    {dev.observaciones || '-'}
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                        {/* Fila de Totales */}
                                                                        <tr className="bg-gray-100 dark:bg-gray-700/50 font-semibold">
                                                                            <td className="py-2 px-2 text-gray-900 dark:text-white">Total</td>
                                                                            <td className="text-center py-2 px-2 text-green-600 dark:text-green-400">{totalDevuelto}</td>
                                                                            <td className="text-center py-2 px-2 text-yellow-600 dark:text-yellow-400">{totalDañadoParcial}</td>
                                                                            <td className="text-center py-2 px-2 text-red-600 dark:text-red-400">{totalDañadoTotal}</td>
                                                                            <td className="py-2 px-2"></td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        ) : (
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 italic">Sin devoluciones registradas</p>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Observaciones */}
                                {selectedPrestamoDetalles.observaciones && (
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Observaciones</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                            {selectedPrestamoDetalles.observaciones}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2 justify-end mt-6">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowDetallesModal(false)}
                                >
                                    Cerrar
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}

                {selectedPrestamoForPrint && (
                    <OutputSelectionModal
                        isOpen={showOutputModal}
                        onClose={() => {
                            setShowOutputModal(false);
                            setSelectedPrestamoForPrint(null);
                        }}
                        documentoId={selectedPrestamoForPrint.id}
                        tipoDocumento="prestamo-cliente"
                        documentoInfo={{
                            numero: selectedPrestamoForPrint.cliente?.nombre || selectedPrestamoForPrint.cliente?.razon_social,
                            fecha: new Date(selectedPrestamoForPrint.fecha_prestamo).toISOString().split('T')[0],
                            monto: Number(selectedPrestamoForPrint.monto_garantia ?? 0),
                        }}
                    />
                )}

                {/* Modal de Anulación del Préstamo */}
                {selectedPrestamoAnular && (
                    <Dialog open={showAnularModal} onOpenChange={setShowAnularModal}>
                        <DialogContent className="max-w-sm w-full">
                            <DialogHeader>
                                <DialogTitle className="text-red-600 dark:text-red-400">Anular Préstamo #{selectedPrestamoAnular.id}</DialogTitle>
                                <DialogDescription>
                                    {selectedPrestamoAnular.cliente?.nombre || selectedPrestamoAnular.cliente?.razon_social}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg mb-4 border border-red-200 dark:border-red-800">
                                <p className="text-sm text-red-900 dark:text-red-200">
                                    ⚠️ <strong>Advertencia:</strong> Al anular este préstamo, el stock se devolverá automáticamente al almacén.
                                </p>
                            </div>
                            <form onSubmit={handleAnularPrestamo} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                        Razón de Anulación (opcional)
                                    </label>
                                    <textarea
                                        value={anularData.razon_anulacion}
                                        onChange={(e) =>
                                            setAnularData({
                                                ...anularData,
                                                razon_anulacion: e.target.value,
                                            })
                                        }
                                        placeholder="Ej: Cliente cambió de proveedor, error administrativo, etc."
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        rows={3}
                                    />
                                </div>

                                <div className="flex gap-2 pt-4">
                                    <Button type="submit" className="flex-1 bg-red-600 hover:bg-red-700">Anular Préstamo</Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => {
                                            setShowAnularModal(false);
                                            setSelectedPrestamoAnular(null);
                                            setAnularData({ razon_anulacion: '' });
                                        }}
                                    >
                                        Cancelar
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                )}

                {/* Toast Container */}
                <ToastContainer
                    toasts={toasts}
                    onClose={removeToast}
                />
            </div>
        </AppLayout>
    );
}
