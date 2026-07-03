import type { EstadoPrestamo, PrestamoCliente } from '@/domain/entities/prestamos';
import prestamoClienteService from '@/infrastructure/services/prestamo-cliente.service';
import AppLayout from '@/layouts/app-layout';
import { OutputSelectionModal } from '@/presentation/components/impresion/OutputSelectionModal';
import { Button } from '@/presentation/components/ui/button';
import { Card } from '@/presentation/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/presentation/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/presentation/components/ui/table';
import ToastContainer from '@/presentation/components/ui/toast-container';
import { Head } from '@inertiajs/react';
import { Edit, Eye, History, MoreHorizontal, Plus, Printer, RotateCcw, X } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';

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
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), duration);
    };

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
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
            return sum + Number(det.cantidad_dañada_total || 0) * montoDanioUnitario;
        }, 0);

        if (Number(devolucionData.monto_cobrado_daño_total) !== Number(montoTotalDanios)) {
            setDevolucionData((prev) => ({
                ...prev,
                monto_cobrado_daño_total: Number(montoTotalDanios.toFixed(2)),
            }));
        }
    }, [devolucionData.detalles, devolucionData.monto_cobrado_daño_total, selectedPrestamo]);

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
            const data = (response as any).data || [];

            // ✅ Log detallado de los datos que llegan del backend
            console.log('%c📥 DATOS DEL BACKEND - PRÉSTAMOS CLIENTES', 'color: #0066cc; font-weight: bold; font-size: 14px');
            console.log('%c═════════════════════════════════════════', 'color: #0066cc; font-weight: bold');
            console.log('%c📊 Estructura del primer préstamo:', 'color: #00aa00; font-weight: bold; font-size: 12px');
            if (data.length > 0) {
                console.log(data[data.length - 1]);
                console.log('%c📋 Claves disponibles:', 'color: #ff9900; font-weight: bold; font-size: 11px');
                console.log(Object.keys(data[0]).join(', '));
            }
            console.log('%c📈 Total de préstamos:', 'color: #00aa00; font-weight: bold; font-size: 12px', data.length);
            console.log('%c═════════════════════════════════════════', 'color: #0066cc; font-weight: bold');

            setPrestamos(data);
        } catch (error: any) {
            console.error('Error cargando préstamos:', error);
            addToast('Error cargando préstamos', 'error');
        } finally {
            setLoading(false);
        }
    };

    const toggleExpandedRow = (prestamoId: number) => {
        setExpandedRows((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(prestamoId)) {
                newSet.delete(prestamoId);
            } else {
                newSet.add(prestamoId);
            }
            return newSet;
        });
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

    // Calcular totales para cards
    const calcularTotales = () => {
        const activos = prestamos.filter((p) => p.estado === 'ACTIVO').length;
        const activosOParciales = prestamos.filter((p) => p.estado === 'ACTIVO' || p.estado === 'PARCIALMENTE_DEVUELTO').length;

        const garantiasEnJuego = prestamos
            .filter((p) => p.estado === 'ACTIVO' || p.estado === 'PARCIALMENTE_DEVUELTO')
            .reduce((sum, p) => sum + (Number(p.monto_garantia) || 0), 0);

        // Calcular totales de prestables
        let totalCanastillasPrestadas = 0;
        let totalCanastillasDevueltas = 0;
        let totalCanastillasDañadas = 0;
        let totalEmbasesPrestadas = 0;
        let totalEmbassesDevueltos = 0;
        let totalEmbasesDañados = 0;
        let totalItemsPrestados = 0;
        let totalItemsDevueltos = 0;
        let totalItemsDañados = 0;

        prestamos.forEach((prestamo) => {
            // Contar por tipo de prestable
            (prestamo.detalles || []).forEach((detalle) => {
                const cantidad = Number(detalle.cantidad_prestada) || 0;
                totalItemsPrestados += cantidad;

                const prestableType = detalle.prestable?.tipo;
                if (prestableType === 'CANASTILLA') {
                    totalCanastillasPrestadas += cantidad;
                } else if (prestableType === 'EMBASES') {
                    totalEmbasesPrestadas += cantidad;
                }
            });

            // Contar devoluciones
            (prestamo.devoluciones || []).forEach((devolucion) => {
                (devolucion.detalles || []).forEach((detalleDevol) => {
                    const cantidadDevuelta = Number(detalleDevol.cantidad_devuelta) || 0;
                    const cantidadDañada = Number(detalleDevol.cantidad_dañada_total) || 0;
                    totalItemsDevueltos += cantidadDevuelta;
                    totalItemsDañados += cantidadDañada;

                    // ✅ CORREGIDO: Acceder al prestable a través de detallePrestamoCliente
                    const prestableType = detalleDevol.detallePrestamoCliente?.prestable?.tipo;
                    if (prestableType === 'CANASTILLA') {
                        totalCanastillasDevueltas += cantidadDevuelta;
                        totalCanastillasDañadas += cantidadDañada;
                    } else if (prestableType === 'EMBASES') {
                        totalEmbassesDevueltos += cantidadDevuelta;
                        totalEmbasesDañados += cantidadDañada;
                    }
                });
            });
        });

        const pendienteDevolución = prestamos.reduce((sum, p) => {
            const totalPrestado = (p.detalles || []).reduce((s, d) => s + (Number(d.cantidad_prestada) || 0), 0);
            const totalDevuelto = (p.devoluciones || []).reduce((s, d) => {
                const detalles = d.detalles || [];
                return s + detalles.reduce((sd, dd) => sd + (Number(dd.cantidad_devuelta) || 0), 0);
            }, 0);
            return sum + Math.max(0, totalPrestado - totalDevuelto);
        }, 0);

        const vencidos = prestamos.filter((p) => {
            if (p.estado === 'COMPLETAMENTE_DEVUELTO' || p.estado === 'CANCELADO') return false;
            if (!p.fecha_esperada_devolucion) return false;
            return new Date(p.fecha_esperada_devolucion) < new Date();
        }).length;

        return {
            activos,
            activosOParciales,
            garantiasEnJuego,
            pendienteDevolución,
            vencidos,
            canastillas: {
                prestadas: totalCanastillasPrestadas,
                devueltas: totalCanastillasDevueltas,
                dañadas: totalCanastillasDañadas,
                pendientes: totalCanastillasPrestadas - totalCanastillasDevueltas,
            },
            embases: {
                prestadas: totalEmbasesPrestadas,
                devueltos: totalEmbassesDevueltos,
                dañados: totalEmbasesDañados,
                pendientes: totalEmbasesPrestadas - totalEmbassesDevueltos,
            },
            itemsTotales: {
                prestados: totalItemsPrestados,
                devueltos: totalItemsDevueltos,
                dañados: totalItemsDañados,
                pendientes: totalItemsPrestados - totalItemsDevueltos,
            },
        };
    };

    const totales = calcularTotales();

    // ✅ NUEVO: Calcular información de préstamos pendientes (ACTIVO + PARCIALMENTE_DEVUELTO)
    const calcularPendientes = () => {
        const prestamosPendientes = prestamos.filter((p) => p.estado === 'ACTIVO' || p.estado === 'PARCIALMENTE_DEVUELTO');

        const resumen = {
            totalPrestamos: prestamosPendientes.length,
            canastillas: {
                prestadas: 0,
                devueltas: 0,
                pendientes: 0,
            },
            embases: {
                prestadas: 0,
                devueltas: 0,
                pendientes: 0,
            },
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

    const pendientes = calcularPendientes();

    // ✅ NUEVO: Calcular prestados y pendientes por préstamo individual
    const calcularPendientesPorPrestamo = (prestamo: PrestamoCliente) => {
        const resumen = {
            canastillas: 0,
            canastillas_prestadas: 0,
            embases: 0,
            embases_prestadas: 0,
        };

        (prestamo.detalles || []).forEach((detalle: any) => {
            const totalDetalle = Number(detalle.cantidad_prestada || 0);

            // ✅ CORREGIDO: Filtrar devoluciones por estado ACTIVA
            // Solo contar devoluciones ACTIVAS, ignorar ANULADAS
            const devueltoDetalle = (prestamo.devoluciones || [])
                .filter((dev: any) => dev.estado === 'ACTIVA') // Filtrar por estado
                .flatMap((dev: any) => dev.detalles || [])
                .filter((devDet: any) => devDet.prestamo_cliente_detalle_id === detalle.id)
                .reduce(
                    (s: number, dev: any) => s + ((dev.cantidad_devuelta || 0) + (dev.cantidad_dañada_total || 0)),
                    0,
                ) || 0;

            const pendienteDetalle = Math.max(0, totalDetalle - devueltoDetalle);

            if (detalle.prestable?.tipo === 'CANASTILLA') {
                resumen.canastillas += pendienteDetalle;
                resumen.canastillas_prestadas += totalDetalle;
            } else if (detalle.prestable?.tipo === 'EMBASES') {
                resumen.embases += pendienteDetalle;
                resumen.embases_prestadas += totalDetalle;
            }
        });

        return resumen;
    };

    const getEstadoBadge = (estado: EstadoPrestamo | string) => {
        const styles: Record<string, string> = {
            ACTIVO: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
            COMPLETAMENTE_DEVUELTO: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
            PARCIALMENTE_DEVUELTO: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
            CANCELADO: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
        };
        return (
            <span className={`rounded-full px-3 py-1 text-xs ${styles[estado as string] || styles.ACTIVO}`}>
                {(estado as string).replace(/_/g, ' ')}
            </span>
        );
    };

    const calcularDiasVencidos = (fecha_esperada: string | undefined) => {
        if (!fecha_esperada) return null;
        const hoy = new Date();
        const fechaEsperada = new Date(fecha_esperada);
        const diasVencidos = Math.floor((hoy.getTime() - fechaEsperada.getTime()) / (1000 * 60 * 60 * 24));
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
            resultado = resultado.filter(
                (p) => (p.cliente?.nombre || '').toLowerCase().includes(busqueda) || (p.cliente?.razon_social || '').toLowerCase().includes(busqueda),
            );
        }

        if (filtroVencimientoDesde) {
            resultado = resultado.filter((p) => p.fecha_esperada_devolucion && p.fecha_esperada_devolucion >= filtroVencimientoDesde);
        }

        if (filtroVencimientoHasta) {
            resultado = resultado.filter((p) => p.fecha_esperada_devolucion && p.fecha_esperada_devolucion <= filtroVencimientoHasta);
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
            <div className="min-h-screen bg-white p-4 dark:bg-gray-950">
                <div className="mb-2 flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">👥 Préstamos a Clientes</h1>
                    <div>
                        <a href="/prestamos/clientes/crear">
                            <Button className="gap-2">
                                <Plus size={20} />
                                Nuevo Préstamo
                            </Button>
                        </a>
                        <Button variant={mostrarFiltros ? 'default' : 'outline'} onClick={() => setMostrarFiltros(!mostrarFiltros)} className="ml-2 gap-2">
                            <span>🔍 Filtros{filtrosActivos > 0 ? ` · ${filtrosActivos}` : ''}</span> 
                        </Button>
                    </div>
                </div>

                {/* ✅ NUEVO: Card de Resumen Pendiente */}
                <div className="mb-2 grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <Card className="border-red-200 bg-gradient-to-br from-red-50 to-red-100 p-4 dark:border-red-700 dark:from-red-900/30 dark:to-red-800/30">
                        <p className="text-xs font-medium tracking-wider text-gray-600 uppercase dark:text-gray-400">⚠️ Préstamos Pendientes</p>
                        <div className="space-y-1">
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

                    <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 p-4 dark:border-orange-700 dark:from-orange-900/30 dark:to-orange-800/30">
                        <p className="text-xs font-medium tracking-wider text-gray-600 uppercase dark:text-gray-400">📊 Items Pendientes por Tipo</p>
                        <div className="space-y-1">
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

                    <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-4 dark:border-purple-700 dark:from-purple-900/30 dark:to-purple-800/30">
                        <p className="text-xs font-medium tracking-wider text-gray-600 uppercase dark:text-gray-400">💰 Garantías en Riesgo</p>
                        <div className="space-y-1">
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
                <div className="mb-2">
                    <div className="mb-3 flex gap-2">
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

                    {mostrarFiltros && (
                        <Card className="border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-950/20">
                            <div className="space-y-4">
                                {/* Fila 1: Búsqueda, Estado, Prestable y Venta */}
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">🔍 Buscar Cliente</label>
                                        <input
                                            type="text"
                                            placeholder="Nombre o razón social..."
                                            value={busquedaCliente}
                                            onChange={(e) => setBusquedaCliente(e.target.value)}
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
                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Prestable ID</label>
                                        <input
                                            type="text"
                                            placeholder="ID..."
                                            value={filtroPrestableId}
                                            onChange={(e) => setFiltroPrestableId(e.target.value)}
                                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">🛒 Venta ID</label>
                                        <input
                                            type="text"
                                            placeholder="ID de venta..."
                                            value={filtroVentaId}
                                            onChange={(e) => setFiltroVentaId(e.target.value)}
                                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
                                        />
                                    </div>
                                </div>

                                {/* Fila 2: Fechas Préstamo */}
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            📅 Fecha Préstamo Desde
                                        </label>
                                        <input
                                            type="date"
                                            value={filtroFechaDesde}
                                            onChange={(e) => setFiltroFechaDesde(e.target.value)}
                                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            📅 Fecha Préstamo Hasta
                                        </label>
                                        <input
                                            type="date"
                                            value={filtroFechaHasta}
                                            onChange={(e) => setFiltroFechaHasta(e.target.value)}
                                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            ⏰ Fecha Vencimiento Desde
                                        </label>
                                        <input
                                            type="date"
                                            value={filtroVencimientoDesde}
                                            onChange={(e) => setFiltroVencimientoDesde(e.target.value)}
                                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            ⏰ Fecha Vencimiento Hasta
                                        </label>
                                        <input
                                            type="date"
                                            value={filtroVencimientoHasta}
                                            onChange={(e) => setFiltroVencimientoHasta(e.target.value)}
                                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                                        />
                                    </div>
                                </div>

                                {/* Resultados */}
                                <div className="border-t border-blue-200 pt-3 dark:border-blue-800">
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        📊 <strong>{prestamosFiltrados.length}</strong> préstamo{prestamosFiltrados.length !== 1 ? 's' : ''}{' '}
                                        encontrado{prestamosFiltrados.length !== 1 ? 's' : ''}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>

                {/* Tabla de Préstamos */}
                <Card className="overflow-hidden border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
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
                                <TableHeader className="border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                                    <TableRow className="border-gray-200 dark:border-gray-700">
                                        <TableHead className="w-16 text-gray-900 dark:text-gray-100">Folio</TableHead>
                                        <TableHead className="text-gray-900 dark:text-gray-100">Cliente</TableHead>
                                        <TableHead className="text-center text-gray-900 dark:text-gray-100">Venta ID</TableHead>
                                        <TableHead className="text-gray-900 dark:text-gray-100 text-center">Garantía</TableHead>
                                        <TableHead className="text-gray-900 dark:text-gray-100 text-center">Fecha Préstamo</TableHead>
                                        <TableHead className="text-gray-900 dark:text-gray-100 text-center">Plazo</TableHead>
                                        <TableHead className="text-center text-gray-900 dark:text-gray-100">Prestados</TableHead>
                                        <TableHead className="text-center text-gray-900 dark:text-gray-100">Pendientes</TableHead>
                                        <TableHead className="text-gray-900 dark:text-gray-100 text-center">Estado</TableHead>
                                        <TableHead className="text-right text-gray-900 dark:text-gray-100 text-center">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {prestamosFiltrados.map((p) => {
                                        const diasVencidos = calcularDiasVencidos(p.fecha_esperada_devolucion);
                                        // Mostrar resumen de detalles para la nueva estructura
                                        const cantidadTotal = p.detalles?.reduce((sum: number, d: any) => sum + (d.cantidad_prestada || 0), 0) || 0;
                                        // Sumar devoluciones de cada detalle usando devolucion_detalles
                                        const cantidadDevuelta =
                                            p.detalles?.reduce((sum: number, detalle: any) => {
                                                const devueltoDetalle =
                                                    detalle.devolucion_detalles?.reduce(
                                                        (s: number, dev: any) =>
                                                            s + ((dev.cantidad_devuelta || 0) + (dev.cantidad_dañada_total || 0)),
                                                        0,
                                                    ) || 0;
                                                return sum + devueltoDetalle;
                                            }, 0) || 0;
                                        const cantidadFaltante = p.estado === 'CANCELADO' ? 0 : Math.max(0, cantidadTotal - cantidadDevuelta);
                                        const prestabesNombres =
                                            p.detalles?.map((d: any) => d.prestable?.nombre).join(', ') || p.prestable?.nombre || 'N/D';
                                        const isExpanded = expandedRows.has(p.id);

                                        return (
                                            <React.Fragment key={p.id}>
                                                <TableRow
                                                    key={`${p.id}-main`}
                                                    className="border-gray-200 transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/50"
                                                >
                                                    <TableCell
                                                        className="cursor-pointer font-semibold text-gray-900 dark:text-gray-100"
                                                        onClick={() => toggleExpandedRow(p.id)}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <span className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                                                                ▶
                                                            </span>
                                                            #{p.id}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-gray-900 dark:text-gray-100">
                                                        {p.cliente?.nombre || p.cliente?.razon_social}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {p.venta_id ? (
                                                            <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                                                #{p.venta_id}
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-400 dark:text-gray-500">-</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-gray-900 dark:text-gray-100 text-center">Bs {p.monto_garantia}</TableCell>
                                                    <TableCell className="texto-xs text-gray-900 dark:text-gray-100 text-center">
                                                        {new Date(p.fecha_prestamo).toLocaleDateString('es-ES')}
                                                    </TableCell>
                                                    <TableCell className="texto-xs text-gray-900 dark:text-gray-100 text-center">
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
                                                                <TableCell className="text-center">
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
                                                                </TableCell>
                                                                {/* ✅ NUEVO: Celda de Pendientes */}
                                                                <TableCell className="text-center">
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
                                                                </TableCell>
                                                            </>
                                                        );
                                                    })()}
                                                    <TableCell className="text-xs text-center">{getEstadoBadge(p.estado)}</TableCell>
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
                                                                {/* <DropdownMenuItem onSelect={() => abrirModalEdicion(p)}>
                                                                    <Edit size={16} />
                                                                    Editar
                                                                </DropdownMenuItem> */}
                                                                <DropdownMenuItem asChild>
                                                                    <a href={`/prestamos/clientes/${p.id}`}>
                                                                        <Eye size={16} />
                                                                        Ver detalles
                                                                    </a>
                                                                </DropdownMenuItem>
                                                                {/* <DropdownMenuItem asChild>
                                                                    <a href={`/prestamos/clientes/${p.id}/devoluciones`}>
                                                                        <History size={16} />
                                                                        Ver devoluciones
                                                                    </a>
                                                                </DropdownMenuItem> */}
                                                                {/* <DropdownMenuItem
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
                                                                {(p.estado === 'ACTIVO' || p.estado === 'PARCIALMENTE_DEVUELTO') && (
                                                                    <DropdownMenuItem
                                                                        onSelect={async () => {
                                                                            try {
                                                                                console.group(`📥 Abrir modal devolución - préstamo #${p.id}`);
                                                                                console.log('📋 préstamo desde listado (getAll):', p);
                                                                                console.log('📋 detalles desde listado (getAll):', p.detalles);

                                                                                const prestamoActualizado = await prestamoClienteService.getById(
                                                                                    Number(p.id),
                                                                                );
                                                                                console.log('✅ préstamo recargado (getById):', prestamoActualizado);
                                                                                console.log(
                                                                                    '✅ detalles recargados (getById):',
                                                                                    (prestamoActualizado as any)?.detalles,
                                                                                );
                                                                                console.groupEnd();

                                                                                window.location.href = `/prestamos/clientes/${p.id}/registrar-devolucion`;
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
                                                                    <DropdownMenuItem variant="destructive" onSelect={() => abrirModalAnular(p)}>
                                                                        <X size={16} />
                                                                        Anular préstamo
                                                                    </DropdownMenuItem>
                                                                )}
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>

                                                {/* ✅ MEJORADO: Expandable detail rows */}
                                                {isExpanded &&
                                                    p.detalles &&
                                                    p.detalles.map((detalle: any, detalleIdx: number) => {
                                                        const totalDetalle = detalle.cantidad_prestada || 0;
                                                        const devueltoDetalle =
                                                            detalle.devolucion_detalles?.reduce(
                                                                (s: number, dev: any) =>
                                                                    s + ((dev.cantidad_devuelta || 0) + (dev.cantidad_dañada_total || 0)),
                                                                0,
                                                            ) || 0;
                                                        const dañadoDetalle =
                                                            detalle.devolucion_detalles?.reduce(
                                                                (s: number, dev: any) => s + (dev.cantidad_dañada_total || 0),
                                                                0,
                                                            ) || 0;
                                                        const faltanteDetalle =
                                                            p.estado === 'CANCELADO' ? 0 : Math.max(0, totalDetalle - devueltoDetalle);
                                                        const nombreDetalle = detalle.prestable?.nombre || 'N/D';
                                                        const tipoDetalle = detalle.prestable?.tipo || 'N/D';
                                                        const iconoTipo = tipoDetalle === 'CANASTILLA' ? '📦' : '🥫';
                                                        const porcentajeDev =
                                                            totalDetalle > 0 ? Math.round((devueltoDetalle / totalDetalle) * 100) : 0;

                                                        return (
                                                            <TableRow
                                                                key={`${p.id}-detail-${detalleIdx}`}
                                                                className="border-gray-200 bg-gray-50 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900/30 dark:hover:bg-gray-900/50"
                                                            >
                                                                <TableCell className="pl-8 text-sm text-gray-700 dark:text-gray-300">
                                                                    <span>
                                                                        {iconoTipo} {tipoDetalle}
                                                                    </span>
                                                                </TableCell>
                                                                <TableCell className="pl-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                                                                    {nombreDetalle}
                                                                </TableCell>
                                                                <TableCell className="text-center text-sm text-gray-700 dark:text-gray-300">
                                                                    <div className="flex flex-col gap-1">
                                                                        <span className="font-semibold">{totalDetalle}</span>
                                                                        <span className="text-xs text-gray-500">Total</span>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="text-center">
                                                                    <div className="flex flex-col gap-1">
                                                                        <span className="font-semibold text-green-600 dark:text-green-400">
                                                                            {devueltoDetalle}
                                                                        </span>
                                                                        <span className="text-xs text-gray-500">{porcentajeDev}%</span>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="text-center text-sm text-gray-700 dark:text-gray-300">
                                                                    <div className="flex flex-col gap-1">
                                                                        <span
                                                                            className={`font-semibold ${faltanteDetalle === 0 ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}
                                                                        >
                                                                            {faltanteDetalle}
                                                                        </span>
                                                                        <span className="text-xs text-gray-500">Pendiente</span>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="text-center text-sm text-gray-700 dark:text-gray-300">
                                                                    {dañadoDetalle > 0 && (
                                                                        <div className="flex flex-col gap-1">
                                                                            <span className="font-semibold text-red-600 dark:text-red-400">
                                                                                {dañadoDetalle}
                                                                            </span>
                                                                            <span className="text-xs text-gray-500">Dañados</span>
                                                                        </div>
                                                                    )}
                                                                </TableCell>
                                                                <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                                                                    {detalle.estado && (
                                                                        <span
                                                                            className={`rounded px-2 py-1 text-xs font-medium ${
                                                                                detalle.estado === 'COMPLETAMENTE_DEVUELTO'
                                                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                                                                    : detalle.estado === 'PARCIALMENTE_DEVUELTO'
                                                                                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                                                                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                                                                            }`}
                                                                        >
                                                                            {detalle.estado.replace(/_/g, ' ')}
                                                                        </span>
                                                                    )}
                                                                </TableCell>
                                                                <TableCell></TableCell>
                                                            </TableRow>
                                                        );
                                                    })}
                                            </React.Fragment>
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
                        <DialogContent className="w-full max-w-sm">
                            <DialogHeader>
                                <DialogTitle>Editar Préstamo #{selectedPrestamoEdit.id}</DialogTitle>
                                <DialogDescription>
                                    {selectedPrestamoEdit.cliente?.nombre || selectedPrestamoEdit.cliente?.razon_social}
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
                                        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Prestables y Devoluciones</h3>
                                        <div className="space-y-6">
                                            {selectedPrestamoDetalles.detalles.map((detalle: any, idx: number) => {
                                                const totalPrestado = detalle.cantidad_prestada || 0;
                                                const totalDevuelto =
                                                    detalle.devolucion_detalles?.reduce(
                                                        (sum: number, dev: any) => sum + (dev.cantidad_devuelta || 0),
                                                        0,
                                                    ) || 0;
                                                const totalDañadoParcial =
                                                    detalle.devolucion_detalles?.reduce(
                                                        (sum: number, dev: any) => sum + (dev.cantidad_dañada_parcial || 0),
                                                        0,
                                                    ) || 0;
                                                const totalDañadoTotal =
                                                    detalle.devolucion_detalles?.reduce(
                                                        (sum: number, dev: any) => sum + (dev.cantidad_dañada_total || 0),
                                                        0,
                                                    ) || 0;
                                                const totalFaltante = Math.max(0, totalPrestado - totalDevuelto - totalDañadoTotal);
                                                const porcentajeDevolución =
                                                    totalPrestado > 0 ? Math.round((totalDevuelto / totalPrestado) * 100) : 0;

                                                return (
                                                    <div
                                                        key={idx}
                                                        className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800"
                                                    >
                                                        {/* Encabezado */}
                                                        <div className="mb-4 flex items-start justify-between">
                                                            <div>
                                                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                                                    {detalle.prestable?.nombre || 'Prestable'}
                                                                </p>
                                                            </div>
                                                            <span
                                                                className={`rounded-full px-3 py-1 text-xs font-medium ${
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

                                                        {/* Resumen de Devoluciones */}
                                                        <div className="mb-4 rounded-lg bg-white p-3 dark:bg-gray-900">
                                                            <div className="mb-3 grid grid-cols-4 gap-3">
                                                                <div>
                                                                    <p className="mb-1 text-xs text-gray-600 dark:text-gray-400">Total Prestado</p>
                                                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                                                        {totalPrestado}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p className="mb-1 text-xs text-gray-600 dark:text-gray-400">Devuelto</p>
                                                                    <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                                                                        {totalDevuelto}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p className="mb-1 text-xs text-gray-600 dark:text-gray-400">Faltante</p>
                                                                    <p className="text-lg font-semibold text-orange-600 dark:text-orange-400">
                                                                        {totalFaltante}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p className="mb-1 text-xs text-gray-600 dark:text-gray-400">% Devuelto</p>
                                                                    <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                                                                        {porcentajeDevolución}%
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            {/* Barra de progreso */}
                                                            <div className="h-2 w-full rounded-full bg-gray-300 dark:bg-gray-700">
                                                                <div
                                                                    className="h-2 rounded-full bg-green-600 transition-all dark:bg-green-500"
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
                                                                            <th className="px-2 py-2 text-left font-semibold text-gray-900 dark:text-white">
                                                                                Fecha
                                                                            </th>
                                                                            <th className="px-2 py-2 text-center font-semibold text-gray-900 dark:text-white">
                                                                                Devuelto
                                                                            </th>
                                                                            <th className="px-2 py-2 text-center font-semibold text-gray-900 dark:text-white">
                                                                                Dañado Parcial
                                                                            </th>
                                                                            <th className="px-2 py-2 text-center font-semibold text-gray-900 dark:text-white">
                                                                                Dañado Total
                                                                            </th>
                                                                            <th className="px-2 py-2 text-left font-semibold text-gray-900 dark:text-white">
                                                                                Observaciones
                                                                            </th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {detalle.devolucion_detalles.map((dev: any, devIdx: number) => (
                                                                            <tr
                                                                                key={devIdx}
                                                                                className="border-b border-gray-200 hover:bg-white dark:border-gray-700 dark:hover:bg-gray-700/50"
                                                                            >
                                                                                <td className="px-2 py-2 text-gray-600 dark:text-gray-400">
                                                                                    {new Date(dev.created_at).toLocaleDateString('es-ES')}
                                                                                </td>
                                                                                <td className="px-2 py-2 text-center font-medium text-green-600 dark:text-green-400">
                                                                                    {dev.cantidad_devuelta || 0}
                                                                                </td>
                                                                                <td className="px-2 py-2 text-center font-medium text-yellow-600 dark:text-yellow-400">
                                                                                    {dev.cantidad_dañada_parcial || 0}
                                                                                </td>
                                                                                <td className="px-2 py-2 text-center font-medium text-red-600 dark:text-red-400">
                                                                                    {dev.cantidad_dañada_total || 0}
                                                                                </td>
                                                                                <td className="px-2 py-2 text-xs text-gray-600 dark:text-gray-400">
                                                                                    {dev.observaciones || '-'}
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                        {/* Fila de Totales */}
                                                                        <tr className="bg-gray-100 font-semibold dark:bg-gray-700/50">
                                                                            <td className="px-2 py-2 text-gray-900 dark:text-white">Total</td>
                                                                            <td className="px-2 py-2 text-center text-green-600 dark:text-green-400">
                                                                                {totalDevuelto}
                                                                            </td>
                                                                            <td className="px-2 py-2 text-center text-yellow-600 dark:text-yellow-400">
                                                                                {totalDañadoParcial}
                                                                            </td>
                                                                            <td className="px-2 py-2 text-center text-red-600 dark:text-red-400">
                                                                                {totalDañadoTotal}
                                                                            </td>
                                                                            <td className="px-2 py-2"></td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        ) : (
                                                            <p className="text-sm text-gray-600 italic dark:text-gray-400">
                                                                Sin devoluciones registradas
                                                            </p>
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
                        <DialogContent className="w-full max-w-sm">
                            <DialogHeader>
                                <DialogTitle className="text-red-600 dark:text-red-400">Anular Préstamo #{selectedPrestamoAnular.id}</DialogTitle>
                                <DialogDescription>
                                    {selectedPrestamoAnular.cliente?.nombre || selectedPrestamoAnular.cliente?.razon_social}
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
                                        placeholder="Ej: Cliente cambió de proveedor, error administrativo, etc."
                                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-red-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
                                        rows={3}
                                    />
                                </div>

                                <div className="flex gap-2 pt-4">
                                    <Button type="submit" className="text-white flex-1 bg-red-600 hover:bg-red-700">
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

                {/* Toast Container */}
                <ToastContainer toasts={toasts} onClose={removeToast} />
            </div>
        </AppLayout>
    );
}
