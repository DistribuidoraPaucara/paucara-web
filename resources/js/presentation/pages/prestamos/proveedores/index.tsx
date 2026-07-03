import type { EstadoPrestamo, PrestamoProveedor } from '@/domain/entities/prestamos';
import prestamoProveedorService from '@/infrastructure/services/prestamo-proveedor.service';
import AppLayout from '@/layouts/app-layout';
import { OutputSelectionModal } from '@/presentation/components/impresion/OutputSelectionModal';
import { Button } from '@/presentation/components/ui/button';
import { Card } from '@/presentation/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/presentation/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/presentation/components/ui/table';
import { Head } from '@inertiajs/react';
import { Edit, Eye, History, MoreHorizontal, Plus, Printer, RotateCcw, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function PrestamosProveedoresIndex() {
    const [prestamos, setPrestamos] = useState<PrestamoProveedor[]>([]);
    const [loading, setLoading] = useState(true);
    const [showDevolucionModal, setShowDevolucionModal] = useState(false);
    const [selectedPrestamo, setSelectedPrestamo] = useState<PrestamoProveedor | null>(null);
    const [showOutputModal, setShowOutputModal] = useState(false);
    const [selectedPrestamoForPrint, setSelectedPrestamoForPrint] = useState<PrestamoProveedor | null>(null);
    const [showDetallesModal, setShowDetallesModal] = useState(false);
    const [selectedPrestamoDetalles, setSelectedPrestamoDetalles] = useState<PrestamoProveedor | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedPrestamoEdit, setSelectedPrestamoEdit] = useState<PrestamoProveedor | null>(null);
    const [editData, setEditData] = useState({
        fecha_esperada_devolucion: '',
        monto_garantia: 0,
        observaciones: '',
    });
    const [showAnularModal, setShowAnularModal] = useState(false);
    const [selectedPrestamoAnular, setSelectedPrestamoAnular] = useState<PrestamoProveedor | null>(null);
    const [anularData, setAnularData] = useState({
        razon_anulacion: '',
    });
    const [devolucionData, setDevolucionData] = useState({
        fecha_devolucion: new Date().toISOString().split('T')[0],
        monto_cobrado_daño_total: 0,
        observaciones: '',
        detalles: [] as Array<{
            prestamo_proveedor_detalle_id: number;
            cantidad_devuelta: number;
            cantidad_dañada_parcial: number;
            cantidad_dañada_total: number;
        }>,
    });

    const obtenerPrecioDanioPrestable = (detalle: unknown): number => {
        const detalleRecord = (detalle ?? {}) as Record<string, unknown>;
        const prestable = (detalleRecord.prestable ?? {}) as Record<string, unknown>;
        const precios = Array.isArray(prestable.precios) ? (prestable.precios as Array<Record<string, unknown>>) : [];
        const condiciones = Array.isArray(prestable.condiciones) ? (prestable.condiciones as Array<Record<string, unknown>>) : [];

        const precioDanio = precios.find((p) => Boolean(p?.activo) && p?.tipo_precio === 'DAÑO_TOTAL');
        if (precioDanio?.valor != null) {
            return Number(precioDanio.valor) || 0;
        }

        const condicionActiva = condiciones.find((c) => Boolean(c?.activo)) || condiciones[0];
        if (condicionActiva?.monto_daño_total != null) {
            return Number(condicionActiva.monto_daño_total) || 0;
        }

        return 0;
    };

    const calcularMontoDaniosTotal = (
        detallesDevolucion: Array<{
            prestamo_proveedor_detalle_id: number;
            cantidad_devuelta: number;
            cantidad_dañada_parcial: number;
            cantidad_dañada_total: number;
        }>,
    ): number => {
        const selectedPrestamoRecord = (selectedPrestamo ?? {}) as Record<string, unknown>;
        const detallesPrestamo = Array.isArray(selectedPrestamoRecord.detalles)
            ? (selectedPrestamoRecord.detalles as Array<Record<string, unknown>>)
            : [];
        if (detallesPrestamo.length === 0) return 0;

        const total = detallesDevolucion.reduce((sum, detalleDev) => {
            const detallePrestamo = detallesPrestamo.find((d) => Number(d.id) === detalleDev.prestamo_proveedor_detalle_id);
            if (!detallePrestamo) return sum;

            const precioDanio = obtenerPrecioDanioPrestable(detallePrestamo);
            const cantidadDanada = (detalleDev.cantidad_dañada_parcial || 0) + (detalleDev.cantidad_dañada_total || 0);

            return sum + precioDanio * cantidadDanada;
        }, 0);

        return Number(total.toFixed(2));
    };

    const agregarDetalleADevolucion = (detalleId: number) => {
        const yaExiste = devolucionData.detalles.find((d) => d.prestamo_proveedor_detalle_id === detalleId);
        if (!yaExiste) {
            setDevolucionData({
                ...devolucionData,
                detalles: [
                    ...devolucionData.detalles,
                    {
                        prestamo_proveedor_detalle_id: detalleId,
                        cantidad_devuelta: 0,
                        cantidad_dañada_parcial: 0,
                        cantidad_dañada_total: 0,
                    },
                ],
            });
        }
    };

    const actualizarDetalleDevolucion = (detalleId: number, campo: string, valor: number) => {
        const nuevosDetalles = devolucionData.detalles.map((d) => (d.prestamo_proveedor_detalle_id === detalleId ? { ...d, [campo]: valor } : d));

        setDevolucionData({
            ...devolucionData,
            detalles: nuevosDetalles,
            monto_cobrado_daño_total: calcularMontoDaniosTotal(nuevosDetalles),
        });
    };

    // Filtros
    const [filtroEstado, setFiltroEstado] = useState<string>('');
    const [busquedaProveedor, setBusquedaProveedor] = useState('');
    const [filtroFechaDesde, setFiltroFechaDesde] = useState('');
    const [filtroFechaHasta, setFiltroFechaHasta] = useState('');
    const [mostrarFiltros, setMostrarFiltros] = useState(false);

    useEffect(() => {
        fetchPrestamos();
    }, [filtroEstado, filtroFechaDesde, filtroFechaHasta]);

    const fetchPrestamos = async () => {
        setLoading(true);
        try {
            const params: any = { per_page: 100 };
            if (filtroEstado) params.estado = filtroEstado;
            if (filtroFechaDesde) params.fecha_desde = filtroFechaDesde;
            if (filtroFechaHasta) params.fecha_hasta = filtroFechaHasta;
            const response = await prestamoProveedorService.getAll(params);
            setPrestamos((response as any).data || []);
        } finally {
            setLoading(false);
        }
    };

    const limpiarFiltros = () => {
        setFiltroEstado('');
        setBusquedaProveedor('');
        setFiltroFechaDesde('');
        setFiltroFechaHasta('');
    };

    // Calcular totales para cards
    const calcularTotales = () => {
        const activos = prestamos.filter((p) => p.estado === 'ACTIVO').length;
        const unidadesPendientes = prestamos.reduce((sum, p) => {
            const totalPrestado = (p.detalles || []).reduce((s, d) => s + (Number(d.cantidad) || 0), 0);
            const totalDevuelto = (p.devoluciones || []).reduce((s, d) => s + (Number(d.cantidad_devuelta) || 0), 0);
            return sum + Math.max(0, totalPrestado - totalDevuelto);
        }, 0);
        const deuda = prestamos.reduce((sum, p) => {
            if (p.estado === 'CANCELADO' || p.estado === 'COMPLETAMENTE_DEVUELTO') return sum;
            return sum + Number(p.precio_unitario || 0) * prestamos.indexOf(p);
        }, 0);
        const totalDevuelto = prestamos.filter((p) => p.estado === 'COMPLETAMENTE_DEVUELTO').length;

        return { activos, unidadesPendientes, deuda, totalDevuelto };
    };

    const totales = calcularTotales();

    // ✅ NUEVO: Calcular información de préstamos pendientes
    const calcularPendientes = () => {
        const prestamosPendientes = prestamos.filter((p) => p.estado === 'ACTIVO' || p.estado === 'PARCIALMENTE_DEVUELTO');

        const resumen = {
            totalPrestamos: prestamosPendientes.length,
            canastillas: { prestadas: 0, devueltas: 0, pendientes: 0 },
            embases: { prestadas: 0, devueltas: 0, pendientes: 0 },
            montoGarantia: 0,
        };

        prestamosPendientes.forEach((prestamo) => {
            resumen.montoGarantia += Number(prestamo.monto_garantia || 0);
            (prestamo.detalles || []).forEach((detalle: any) => {
                const totalDetalle = Number(detalle.cantidad_prestada || 0);
                const devueltoDetalle =
                    detalle.devolucion_detalles?.reduce(
                        (s: number, dev: any) => s + ((dev.cantidad_devuelta || 0) + (dev.cantidad_dañada_total || 0)),
                        0,
                    ) || 0;
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
    const calcularPendientesPorPrestamo = (prestamo: PrestamoProveedor) => {
        const resumen = {
            canastillas_prestadas: 0,
            embases_prestadas: 0,
            canastillas: 0,
            embases: 0,
        };
        (prestamo.detalles || []).forEach((detalle: any) => {
            const totalDetalle = Number(detalle.cantidad_prestada || 0);
            const devueltoDetalle =
                detalle.devolucion_detalles?.reduce(
                    (s: number, dev: any) => s + ((dev.cantidad_devuelta || 0) + (dev.cantidad_dañada_total || 0)),
                    0,
                ) || 0;
            const pendienteDetalle = Math.max(0, totalDetalle - devueltoDetalle);

            if (detalle.prestable?.tipo === 'CANASTILLA') {
                resumen.canastillas_prestadas += totalDetalle;
                resumen.canastillas += pendienteDetalle;
            } else if (detalle.prestable?.tipo === 'EMBASES') {
                resumen.embases_prestadas += totalDetalle;
                resumen.embases += pendienteDetalle;
            }
        });
        return resumen;
    };

    const pendientes = calcularPendientes();
    const filtrosActivos = [filtroEstado, busquedaProveedor, filtroFechaDesde, filtroFechaHasta].filter(Boolean).length;

    // ✅ NUEVO: Filtrar prestamos por búsqueda local y ordenar descendente por ID
    const prestamosFiltrados = prestamos
        .filter((p) => {
            if (busquedaProveedor) {
                const proveedor = p.proveedor as any;
                const nombreProveedor = (proveedor?.nombre || proveedor?.razon_social || '').toLowerCase();
                if (!nombreProveedor.includes(busquedaProveedor.toLowerCase())) return false;
            }
            return true;
        })
        .sort((a, b) => b.id - a.id);

    const handleRegistrarDevolucion = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPrestamo || devolucionData.detalles.length === 0) return;

        try {
            await prestamoProveedorService.registrarDevolucion(selectedPrestamo.id, devolucionData);
            toast.success('✅ Devolución registrada exitosamente');
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
            const mensajeError = error?.response?.data?.message || error?.message || 'Error registrando devolución';
            toast.error(`❌ ${mensajeError}`);
        }
    };

    const handleEditarPrestamo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPrestamoEdit) return;

        try {
            const response = await fetch(`/api/prestamos-proveedor/${selectedPrestamoEdit.id}`, {
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
            } else {
                console.error('Error al actualizar préstamo:', response.statusText);
            }
        } catch (error) {
            console.error('Error al editar préstamo:', error);
        }
    };

    const abrirModalEdicion = (prestamo: PrestamoProveedor) => {
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
            const response = await fetch(`/api/prestamos-proveedor/${selectedPrestamoAnular.id}/anular`, {
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
            } else {
                console.error('Error al anular préstamo:', response.statusText);
            }
        } catch (error) {
            console.error('Error al anular préstamo:', error);
        }
    };

    const abrirModalAnular = (prestamo: PrestamoProveedor) => {
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
            <span className={`rounded-full px-1 py-1 text-center text-xs ${styles[estado as string] || styles.ACTIVO}`}>
                {(estado as string).replace(/_/g, ' ')}
            </span>
        );
    };

    return (
        <AppLayout>
            <Head title="Préstamos a Proveedores" />
            <div className="min-h-screen bg-white p-2 dark:bg-gray-950">
                <div className="mb-2 flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">🤝 Préstamos a Proveedores</h1>
                    <div className="flex gap-3">
                        <a href="/prestamos/proveedores/prestamos/crear">
                            <Button className="gap-2 bg-blue-600 text-white hover:bg-blue-700">
                                <Plus size={20} />
                                Nuevo Préstamo
                            </Button>
                        </a>
                        <div className="mb-3 flex gap-2">
                            <Button
                                variant={mostrarFiltros ? 'default' : 'outline'}
                                onClick={() => setMostrarFiltros(!mostrarFiltros)}
                                className="gap-2"
                            >
                                <span>🔍 Filtros{filtrosActivos > 0 ? ` · ${filtrosActivos}` : ''}</span>
                            </Button>
                            {filtrosActivos > 0 && (
                                <Button
                                    variant="ghost"
                                    onClick={limpiarFiltros}
                                    className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20"
                                >
                                    ✕ Limpiar
                                </Button>
                            )}
                        </div>
                        {/* <a href="/prestamos/proveedores/compras/crear">
                            <Button className="gap-2 bg-green-600 hover:bg-green-700">
                                <Plus size={20} />
                                Nueva Compra
                            </Button>
                        </a> */}
                    </div>
                </div>

                {/* ✅ NUEVO: Cards de Resumen Pendiente */}
                <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <Card className="border-red-200 bg-gradient-to-br from-red-50 to-red-100 p-2 dark:border-red-700 dark:from-red-900/30 dark:to-red-800/30">
                        <div className="space-y-2">
                            <p className="mb-3 text-xs font-medium tracking-wider text-gray-600 uppercase dark:text-gray-400">
                                ⚠️ Préstamos Pendientes
                            </p>
                            <div>
                                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{pendientes.totalPrestamos}</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">Préstamos activos</p>
                            </div>
                            <div className="border-t border-red-200 pt-2 dark:border-red-700">
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    <span className="font-semibold">Canastillas:</span> {pendientes.canastillas.pendientes} por devolver
                                </p>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    <span className="font-semibold">Embases:</span> {pendientes.embases.pendientes} por devolver
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 p-2 dark:border-orange-700 dark:from-orange-900/30 dark:to-orange-800/30">
                        <div className="space-y-3">
                            <p className="mb-3 text-xs font-medium tracking-wider text-gray-600 uppercase dark:text-gray-400">
                                📊 Items Pendientes por Tipo
                            </p>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-700 dark:text-gray-300">📦 Canastillas</span>
                                <span className="text-lg font-bold text-orange-600 dark:text-orange-400">{pendientes.canastillas.pendientes}</span>
                            </div>
                            <div className="flex items-center justify-between border-t border-orange-200 pt-2 dark:border-orange-700">
                                <span className="text-sm text-gray-700 dark:text-gray-300">🥫 Embases</span>
                                <span className="text-lg font-bold text-orange-600 dark:text-orange-400">{pendientes.embases.pendientes}</span>
                            </div>
                            <div className="flex items-center justify-between border-t border-orange-200 pt-2 dark:border-orange-700">
                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Total</span>
                                <span className="text-lg font-bold text-orange-700 dark:text-orange-300">
                                    {pendientes.canastillas.pendientes + pendientes.embases.pendientes}
                                </span>
                            </div>
                        </div>
                    </Card>

                    <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-2 dark:border-purple-700 dark:from-purple-900/30 dark:to-purple-800/30">
                        <div className="space-y-2">
                            <p className="mb-3 text-xs font-medium tracking-wider text-gray-600 uppercase dark:text-gray-400">
                                💰 Garantías en Riesgo
                            </p>
                            <div>
                                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                    Bs {pendientes.montoGarantia.toLocaleString('es-ES')}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">Total en garantía</p>
                            </div>
                            <div className="border-t border-purple-200 pt-2 dark:border-purple-700">
                                <p className="text-xs text-purple-700 dark:text-purple-300">💡 Recuperar para liberar garantías</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Panel de Filtros */}
                <div className="mb-6">
                    {mostrarFiltros && (
                        <div className="border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">🔍 Buscar Proveedor</label>
                                    <input
                                        type="text"
                                        placeholder="Nombre o razón social..."
                                        value={busquedaProveedor}
                                        onChange={(e) => setBusquedaProveedor(e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Estado</label>
                                    <select
                                        value={filtroEstado}
                                        onChange={(e) => setFiltroEstado(e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                    >
                                        <option value="">Todos</option>
                                        <option value="ACTIVO">Activo</option>
                                        <option value="PARCIALMENTE_DEVUELTO">Parcialmente Devuelto</option>
                                        <option value="COMPLETAMENTE_DEVUELTO">Completamente Devuelto</option>
                                        <option value="CANCELADO">Cancelado</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Desde</label>
                                    <input
                                        type="date"
                                        value={filtroFechaDesde}
                                        onChange={(e) => setFiltroFechaDesde(e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Hasta</label>
                                    <input
                                        type="date"
                                        value={filtroFechaHasta}
                                        onChange={(e) => setFiltroFechaHasta(e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Tabla de Préstamos */}
                <div className="overflow-hidden border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 rounded-lg">
                    {loading ? (
                        <div className="p-8 text-center text-gray-600 dark:text-gray-400">Cargando...</div>
                    ) : prestamos.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="flex flex-col items-center justify-center">
                                <div className="mb-4 text-5xl">📦</div>
                                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">No existen préstamos registrados</h3>
                                <p className="mb-6 text-gray-600 dark:text-gray-400">
                                    Crea tu primer préstamo haciendo clic en el botón "Nuevo Préstamo"
                                </p>
                                <a href="/prestamos/proveedores/crear">
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
                                <TableHeader className="border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                                    <TableRow className="border-gray-200 dark:border-gray-700">
                                        <TableHead className="w-16 text-center text-gray-900 dark:text-gray-100">Folio</TableHead>
                                        <TableHead className="text-center text-gray-900 dark:text-gray-100">Proveedor</TableHead>
                                        <TableHead className="text-center text-gray-900 dark:text-gray-100">Garantía</TableHead>
                                        <TableHead className="text-center text-gray-900 dark:text-gray-100">Préstamo</TableHead>
                                        <TableHead className="text-center text-gray-900 dark:text-gray-100">Plazo</TableHead>
                                        {/* ✅ NUEVO: Columna de Pendientes */}
                                        <TableHead className="text-center text-gray-900 dark:text-gray-100">Prestado</TableHead>
                                        <TableHead className="text-center text-gray-900 dark:text-gray-100">Pendientes</TableHead>
                                        <TableHead className="text-center text-gray-900 dark:text-gray-100">Estado</TableHead>
                                        <TableHead className="text-center text-gray-900 dark:text-gray-100">-</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {prestamosFiltrados.map((p) => {
                                        const cantidadTotal =
                                            p.detalles?.reduce((sum: number, d: unknown) => {
                                                const detalle = d as Record<string, unknown>;
                                                const cantidadPrestada = Number(detalle.cantidad_prestada || 0);
                                                return sum + cantidadPrestada;
                                            }, 0) || 0;
                                        const cantidadDevuelta =
                                            p.detalles?.reduce((sum: number, d: unknown) => {
                                                const detalle = d as Record<string, unknown>;
                                                const devoluciones = (detalle.devolucion_detalles || detalle.devolucionDetalles || []) as unknown[];
                                                const devueltoDetalle = devoluciones.reduce((subtotal: number, dev: unknown) => {
                                                    const detalleDev = dev as Record<string, number | undefined>;
                                                    return (
                                                        subtotal +
                                                        (detalleDev.cantidad_devuelta || 0) +
                                                        (detalleDev.cantidad_dañada_parcial || 0) +
                                                        (detalleDev.cantidad_dañada_total || 0)
                                                    );
                                                }, 0);

                                                return sum + devueltoDetalle;
                                            }, 0) || 0;
                                        const cantidadPendiente = Math.max(0, cantidadTotal - cantidadDevuelta);

                                        return (
                                            <TableRow
                                                key={p.id}
                                                className="border-gray-200 transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/50"
                                            >
                                                <TableCell className="text-center font-semibold text-gray-900 dark:text-gray-100">#{p.id}</TableCell>
                                                <TableCell className="text-center text-gray-900 dark:text-gray-100">
                                                    {p.proveedor?.nombre || p.proveedor?.razon_social}
                                                </TableCell>
                                                <TableCell className="text-center text-gray-900 dark:text-gray-100">Bs {p.monto_garantia}</TableCell>
                                                <TableCell className="text-center text-gray-900 dark:text-gray-100">
                                                    {new Date(p.fecha_prestamo).toLocaleDateString('es-ES')}
                                                </TableCell>
                                                <TableCell className="text-center text-gray-900 dark:text-gray-100">
                                                    {p.fecha_esperada_devolucion
                                                        ? new Date(p.fecha_esperada_devolucion).toLocaleDateString('es-ES')
                                                        : 'S/P'}
                                                </TableCell>
                                                {/* Prestados y Pendientes - Calculado una sola vez */}
                                                {(() => {
                                                    const pend = calcularPendientesPorPrestamo(p);
                                                    const totalPendiente = pend.canastillas + pend.embases;
                                                    return (
                                                        <>
                                                            {/* Prestados */}
                                                            <td className="text-center">
                                                                <div className="flex flex-col gap-1 text-sm">
                                                                    {pend.canastillas_prestadas > 0 && (
                                                                        <div className="flex items-center justify-center gap-1">
                                                                            <span>📦</span>
                                                                            <span className="font-semibold text-blue-600 dark:text-blue-400">
                                                                                {pend.canastillas_prestadas}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                    {pend.embases_prestadas > 0 && (
                                                                        <div className="flex items-center justify-center gap-1">
                                                                            <span>🥫</span>
                                                                            <span className="font-semibold text-purple-600 dark:text-purple-400">
                                                                                {pend.embases_prestadas}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            {/* ✅ NUEVO: Celda de Pendientes */}
                                                            <td className="text-center">
                                                                {totalPendiente === 0 ? (
                                                                    <span className="font-semibold text-green-600 dark:text-green-400">
                                                                        ✓ Completo
                                                                    </span>
                                                                ) : (
                                                                    <div className="flex flex-col gap-1 text-sm">
                                                                        {pend.canastillas > 0 && (
                                                                            <div className="flex items-center justify-center gap-1">
                                                                                <span>📦</span>
                                                                                <span className="font-semibold text-orange-600 dark:text-orange-400">
                                                                                    {pend.canastillas}
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                        {pend.embases > 0 && (
                                                                            <div className="flex items-center justify-center gap-1">
                                                                                <span>🥫</span>
                                                                                <span className="font-semibold text-pink-600 dark:text-pink-400">
                                                                                    {pend.embases}
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </td>
                                                        </>
                                                    );
                                                })()}
                                                <TableCell className="text-center text-xs">{getEstadoBadge(p.estado)}</TableCell>
                                                <TableCell className="text-center">
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
                                                            {/* <DropdownMenuItem onSelect={() => abrirModalEdicion(p)}>
                                                                <Edit size={16} />
                                                                Editar
                                                            </DropdownMenuItem> */}
                                                            <DropdownMenuItem asChild>
                                                                <a href={`/prestamos/proveedores/${p.id}`}>
                                                                    <Eye size={16} />
                                                                    Ver detalle completo
                                                                </a>
                                                            </DropdownMenuItem>
                                                            {/* <DropdownMenuItem asChild>
                                                                <a href={`/prestamos/proveedores/${p.id}/devoluciones`}>
                                                                    <History size={16} />
                                                                    Ver historial de devoluciones
                                                                </a>
                                                            </DropdownMenuItem> */}
                                                            <DropdownMenuItem
                                                                onSelect={() => {
                                                                    setSelectedPrestamoForPrint(p);
                                                                    setShowOutputModal(true);
                                                                }}
                                                            >
                                                                <Printer size={16} />
                                                                Imprimir
                                                            </DropdownMenuItem>
                                                            {['ACTIVO', 'PARCIALMENTE_DEVUELTO'].includes((p.estado || '').trim()) && (
                                                                <DropdownMenuItem
                                                                    onSelect={() => {
                                                                        window.location.href = `/prestamos/proveedores/${p.id}/registrar-devolucion`;
                                                                    }}
                                                                >
                                                                    <RotateCcw size={16} />
                                                                    Registrar devolución
                                                                </DropdownMenuItem>
                                                            )}
                                                            {p.estado !== 'CANCELADO' && p.estado !== 'COMPLETAMENTE_DEVUELTO' && (
                                                                <DropdownMenuItem variant="destructive" onSelect={() => abrirModalAnular(p)}>
                                                                    <X size={16} />
                                                                    Anular préstamo
                                                                </DropdownMenuItem>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>

                {/* Modal de Edición del Préstamo */}
                {selectedPrestamoEdit && (
                    <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                        <DialogContent className="w-full max-w-sm">
                            <DialogHeader>
                                <DialogTitle>Editar Préstamo #{selectedPrestamoEdit.id}</DialogTitle>
                                <DialogDescription>
                                    {selectedPrestamoEdit.proveedor?.nombre || selectedPrestamoEdit.proveedor?.razon_social}
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleEditarPrestamo} className="space-y-4">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
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
                                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Monto Garantía</label>
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
                                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Observaciones</label>
                                    <textarea
                                        value={editData.observaciones}
                                        onChange={(e) =>
                                            setEditData({
                                                ...editData,
                                                observaciones: e.target.value,
                                            })
                                        }
                                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
                                        rows={3}
                                    />
                                </div>
                                <div className="flex gap-2 pt-4">
                                    <Button type="submit" className="flex-1">
                                        Guardar Cambios
                                    </Button>
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
                            className="max-h-[90vh] overflow-y-auto bg-white p-2 dark:bg-gray-900"
                        >
                            <DialogHeader>
                                <DialogTitle>Detalles del Préstamo #{selectedPrestamoDetalles.id}</DialogTitle>
                                <DialogDescription>
                                    {selectedPrestamoDetalles.proveedor?.nombre || selectedPrestamoDetalles.proveedor?.razon_social}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6">
                                {/* Información General */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Proveedor</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {selectedPrestamoDetalles.proveedor?.nombre || selectedPrestamoDetalles.proveedor?.razon_social}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Estado</p>
                                        <p className="font-semibold">{getEstadoBadge(selectedPrestamoDetalles.estado)}</p>
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
                                            {selectedPrestamoDetalles.es_compra ? 'Compra' : 'Préstamo'}
                                        </p>
                                    </div>
                                </div>

                                {/* Detalles de Prestables */}
                                {selectedPrestamoDetalles.detalles && selectedPrestamoDetalles.detalles.length > 0 && (
                                    <div>
                                        <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">Prestables</h3>
                                        <div className="space-y-2">
                                            {selectedPrestamoDetalles.detalles.map((detalle: any, idx: number) => (
                                                <div
                                                    key={idx}
                                                    className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800"
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                                {detalle.prestable?.nombre || 'Prestable'}
                                                            </p>
                                                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                                                Cantidad:{' '}
                                                                <span className="font-semibold text-gray-900 dark:text-white">
                                                                    {detalle.cantidad_prestada}
                                                                </span>
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <span
                                                                className={`rounded px-2 py-1 text-xs font-medium ${
                                                                    detalle.estado === 'ACTIVO'
                                                                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                                                                        : detalle.estado === 'COMPLETAMENTE_DEVUELTO'
                                                                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                                                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                                                }`}
                                                            >
                                                                {detalle.estado.replace(/_/g, ' ')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {(() => {
                                                        const devoluciones =
                                                            detalle.devoluciones || detalle.devolucion_detalles || detalle.devolucionDetalles || [];
                                                        const totalDevuelto = devoluciones.reduce(
                                                            (sum: number, dev: any) => sum + (Number(dev.cantidad_devuelta) || 0),
                                                            0,
                                                        );
                                                        const totalDaniado = devoluciones.reduce((sum: number, dev: any) => {
                                                            return (
                                                                sum +
                                                                (Number(dev.cantidad_dañada_parcial) || 0) +
                                                                (Number(dev.cantidad_dañada_total) || 0)
                                                            );
                                                        }, 0);
                                                        const pendiente = Math.max(0, Number(detalle.cantidad_prestada || 0) - totalDevuelto);

                                                        return (
                                                            <div className="mt-3 grid grid-cols-1 gap-2 text-sm md:grid-cols-3">
                                                                <div className="rounded-md border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-900">
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Devuelto</p>
                                                                    <p className="font-semibold text-green-700 dark:text-green-400">
                                                                        {totalDevuelto}
                                                                    </p>
                                                                </div>
                                                                <div className="rounded-md border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-900">
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Dañado total</p>
                                                                    <p className="font-semibold text-red-700 dark:text-red-400">{totalDaniado}</p>
                                                                </div>
                                                                <div className="rounded-md border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-900">
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Pendiente</p>
                                                                    <p className="font-semibold text-orange-700 dark:text-orange-400">{pendiente}</p>
                                                                </div>
                                                            </div>
                                                        );
                                                    })()}
                                                    {(detalle.devoluciones || detalle.devolucion_detalles || detalle.devolucionDetalles) &&
                                                        (detalle.devoluciones || detalle.devolucion_detalles || detalle.devolucionDetalles).length >
                                                            0 && (
                                                            <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                                                                {(
                                                                    detalle.devoluciones ||
                                                                    detalle.devolucion_detalles ||
                                                                    detalle.devolucionDetalles
                                                                ).map((dev: any, devIdx: number) => (
                                                                    <div
                                                                        key={devIdx}
                                                                        className="mt-1 rounded border border-gray-200 bg-white px-2 py-1 dark:border-gray-700 dark:bg-gray-900"
                                                                    >
                                                                        <p>
                                                                            Devolución {devIdx + 1}: {Number(dev.cantidad_devuelta) || 0} devueltas
                                                                            {(() => {
                                                                                const totalDaniado =
                                                                                    (Number(dev.cantidad_dañada_parcial) || 0) +
                                                                                    (Number(dev.cantidad_dañada_total) || 0);
                                                                                return totalDaniado > 0 ? ` | Dañado: ${totalDaniado}` : '';
                                                                            })()}{' '}
                                                                            - {new Date(dev.fecha_devolucion).toLocaleDateString('es-ES')}
                                                                        </p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Observaciones */}
                                {selectedPrestamoDetalles.observaciones && (
                                    <div>
                                        <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">Observaciones</h3>
                                        <p className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                                            {selectedPrestamoDetalles.observaciones}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setShowDetallesModal(false)}>
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
                        tipoDocumento="prestamo-proveedor"
                        documentoInfo={{
                            numero: selectedPrestamoForPrint.proveedor?.nombre || selectedPrestamoForPrint.proveedor?.razon_social,
                            fecha: new Date(selectedPrestamoForPrint.fecha_prestamo).toISOString().split('T')[0],
                            monto: Number(selectedPrestamoForPrint.monto_garantia ?? 0),
                        }}
                    />
                )}

                {/* Modal de Anulación del Préstamo */}
                {selectedPrestamoAnular && (
                    <Dialog open={showAnularModal} onOpenChange={setShowAnularModal}>
                        <DialogContent className="w-full max-w-sm">
                            <DialogHeader>
                                <DialogTitle className="text-red-600 dark:text-red-400">Anular Préstamo #{selectedPrestamoAnular.id}</DialogTitle>
                                <DialogDescription>
                                    {selectedPrestamoAnular.proveedor?.nombre || selectedPrestamoAnular.proveedor?.razon_social}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
                                <p className="text-sm text-red-900 dark:text-red-200">
                                    ⚠️ <strong>Advertencia:</strong> Al anular este préstamo, el stock se devolverá automáticamente al almacén.
                                </p>
                            </div>
                            <form onSubmit={handleAnularPrestamo} className="space-y-4">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
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
                                        placeholder="Ej: Proveedor cambió de política, error administrativo, etc."
                                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-red-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
                                        rows={3}
                                    />
                                </div>

                                <div className="flex gap-2 pt-4">
                                    <Button type="submit" className="flex-1 bg-red-600 hover:bg-red-700">
                                        Anular Préstamo
                                    </Button>
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
            </div>
        </AppLayout>
    );
}
