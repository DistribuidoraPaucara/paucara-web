import React, { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/presentation/components/ui/card';
import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/presentation/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/presentation/components/ui/tabs';
import { ChevronDown, ChevronUp, User, Calendar, AlertCircle, CheckCircle, Trash2 } from 'lucide-react';
import axios from 'axios';
import AnularDevolucionModal from '@/presentation/components/modals/AnularDevolucionModal';

interface PrestamoEventoShow {
    id: number;
    prestamo_evento_id?: number;
    nombre_evento: string;
    almacenes_prestables_id: number;
    cantidad: number;
    monto_garantia: string;
    fecha_prestamo: string;
    fecha_esperada_devolucion: string;
    estado: string;
    observaciones?: string;
    created_by?: number;
    vehiculo_asignado?: string;
    almacen?: any;
    chofer?: any;
    creador?: any;
    detalles?: any[];
    devoluciones?: any[];
}

export default function PrestamosEventosShow() {
    const { url } = usePage();
    const prestamoId = url.split('/').pop();
    const [prestamo, setPrestamo] = useState<PrestamoEventoShow | null>(null);
    const [loading, setLoading] = useState(true);
    const [expandedDetalles, setExpandedDetalles] = useState<number[]>([]);
    const [expandedDevoluciones, setExpandedDevoluciones] = useState<number[]>([]);
    const [modalAnularOpen, setModalAnularOpen] = useState(false);
    const [devolucionSeleccionada, setDevolucionSeleccionada] = useState<{ id: number; numero: number } | null>(null);

    useEffect(() => {
        if (prestamoId) {
            cargarPrestamo(prestamoId);
        }
    }, [prestamoId]);

    const cargarPrestamo = async (id: string | number) => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/prestamos-evento/${id}`);
            const prestamo = response.data.data;

            // 🔍 DEBUG: Ver qué datos llegan del backend
            console.group('📥 DATOS DEL BACKEND - EVENTO #' + id);
            console.log('✅ Préstamo completo:', prestamo);
            console.log('👤 Creador del préstamo:', prestamo.creador);
            console.log('📦 Detalles:', {
                cantidad: prestamo.detalles?.length,
                prestables: prestamo.detalles?.map((d: any) => ({
                    nombre: d.prestable?.nombre,
                    cantidad_prestada: d.cantidad_prestada,
                    almacenes: d.almacenes?.length,
                })),
            });
            console.log('🔄 Devoluciones:', {
                cantidad: prestamo.devoluciones?.length,
                items: prestamo.devoluciones?.map((dev: any) => ({
                    id: dev.id,
                    fecha: dev.fecha_devolucion,
                    estado: dev.estado,
                    creador: dev.creador?.name,
                    anulador: dev.anulador?.name,
                    detalles: dev.detalles?.length,
                    almacenes_por_detalle: dev.detalles?.map((det: any) => ({
                        prestable: det.prestamoEventoDetalle?.prestable?.nombre,
                        almacenes: det.devolucionesAlmacenes?.length,
                    })),
                })),
            });
            console.log('🏢 Almacén:', prestamo.almacen);
            console.log('👨‍✈️ Chofer:', prestamo.chofer);
            console.groupEnd();

            setPrestamo(prestamo);
        } catch (err: any) {
            console.error('❌ Error cargando préstamo:', err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleDetalle = (detalleId: number) => {
        setExpandedDetalles(prev =>
            prev.includes(detalleId)
                ? prev.filter(id => id !== detalleId)
                : [...prev, detalleId]
        );
    };

    const toggleDevolucion = (devolucionId: number) => {
        setExpandedDevoluciones(prev =>
            prev.includes(devolucionId)
                ? prev.filter(id => id !== devolucionId)
                : [...prev, devolucionId]
        );
    };

    const getEstadoBadge = (estado: string) => {
        const variants: Record<string, any> = {
            ACTIVO: { bg: 'bg-blue-100', text: 'text-blue-800', label: '🟦 Activo' },
            PARCIALMENTE_DEVUELTO: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: '🟨 Parcialmente Devuelto' },
            COMPLETAMENTE_DEVUELTO: { bg: 'bg-green-100', text: 'text-green-800', label: '🟩 Completamente Devuelto' },
            CANCELADO: { bg: 'bg-gray-100', text: 'text-gray-800', label: '⬜ Cancelado' },
        };
        const variant = variants[estado] || variants.ACTIVO;
        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${variant.bg} ${variant.text}`}>
                {variant.label}
            </span>
        );
    };

    const getEstadoDevolucionBadge = (estado: string) => {
        const variants: Record<string, any> = {
            ACTIVA: { bg: 'bg-green-100', text: 'text-green-800', label: '✅ Activa' },
            ANULADA: { bg: 'bg-red-100', text: 'text-red-800', label: '❌ Anulada' },
        };
        const variant = variants[estado] || variants.ACTIVA;
        return (
            <span className={`px-2 py-1 rounded text-xs font-medium ${variant.bg} ${variant.text}`}>
                {variant.label}
            </span>
        );
    };

    const calcularTotalDevueltoDetalle = (detalle: any) => {
        return detalle.devolucion_detalles?.reduce(
            (sum: number, dev: any) => sum + ((dev.cantidad_devuelta || 0) + (dev.cantidad_dañada_total || 0)),
            0
        ) || 0;
    };

    const calcularResumenPrestamo = () => {
        if (!prestamo?.detalles) return { total: 0, devuelto: 0, faltante: 0, tasa: 0 };

        const total = prestamo.detalles.reduce((sum: number, d: any) => sum + (d.cantidad_prestada || 0), 0);
        const devuelto = prestamo.detalles.reduce((sum: number, d: any) => sum + calcularTotalDevueltoDetalle(d), 0);
        const faltante = Math.max(0, total - devuelto);
        const tasa = total > 0 ? Math.round((devuelto / total) * 100) : 0;

        return { total, devuelto, faltante, tasa };
    };

    if (loading) {
        return (
            <AppLayout>
                <div className="flex justify-center items-center h-screen">
                    <div className="text-lg text-gray-600 dark:text-gray-300">Cargando préstamo...</div>
                </div>
            </AppLayout>
        );
    }

    if (!prestamo) {
        return (
            <AppLayout>
                <div className="text-center text-red-600">Préstamo no encontrado</div>
            </AppLayout>
        );
    }

    const resumen = calcularResumenPrestamo();

    return (
        <AppLayout>
            <div className="py-6 px-4 space-y-6">
                {/* ENCABEZADO PRINCIPAL */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4">
                        <h3 className="text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wide">Evento</h3>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {prestamo.nombre_evento || 'N/D'}
                        </p>
                    </Card>

                    <Card className="p-4">
                        <h3 className="text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wide">Estado</h3>
                        <div className="mt-2">
                            {getEstadoBadge(prestamo.estado)}
                        </div>
                    </Card>

                    <Card className="p-4">
                        <h3 className="text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wide">Fechas</h3>
                        <div className="space-y-2">
                            <p className="text-sm">
                                <span className="text-gray-600 dark:text-gray-300">Préstamo:</span>
                                <span className="font-medium ml-2">
                                    {new Date(prestamo.fecha_prestamo).toLocaleDateString('es-ES')}
                                </span>
                            </p>
                            <p className="text-sm">
                                <span className="text-gray-600 dark:text-gray-300">Devolución esperada:</span>
                                <span className="font-medium ml-2">
                                    {new Date(prestamo.fecha_esperada_devolucion).toLocaleDateString('es-ES')}
                                </span>
                            </p>
                        </div>
                    </Card>
                </div>

                {/* AUDITORÍA DEL PRÉSTAMO */}
                <Card className="p-4 border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-900/20">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Auditoría del Préstamo
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Creado por</p>
                            <p className="font-bold text-lg">
                                {prestamo.creador?.name || 'Sistema'}
                            </p>
                            <p className="text-xs text-gray-500">
                                {new Date(prestamo.fecha_prestamo).toLocaleString('es-ES')}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Estado</p>
                            <p className="font-bold text-lg">{prestamo.estado}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Observaciones Generales</p>
                            <p className="font-bold text-sm text-gray-700 dark:text-gray-300">
                                {prestamo.observaciones || 'Ninguna'}
                            </p>
                        </div>
                    </div>
                </Card>

                {/* RESUMEN DE PRÉSTAMO (KPIs) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200">
                        <p className="text-sm text-gray-600 dark:text-gray-300">Total Prestado</p>
                        <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{resumen.total}</p>
                    </Card>
                    <Card className="p-4 bg-green-50 dark:bg-green-900/20 border-green-200">
                        <p className="text-sm text-gray-600 dark:text-gray-300">Devuelto</p>
                        <p className="text-3xl font-bold text-green-700 dark:text-green-300">{resumen.devuelto}</p>
                    </Card>
                    <Card className="p-4 bg-red-50 dark:bg-red-900/20 border-red-200">
                        <p className="text-sm text-gray-600 dark:text-gray-300">Faltante</p>
                        <p className="text-3xl font-bold text-red-700 dark:text-red-300">{resumen.faltante}</p>
                    </Card>
                    <Card className="p-4 bg-purple-50 dark:bg-purple-900/20 border-purple-200">
                        <p className="text-sm text-gray-600 dark:text-gray-300">Tasa Devolución</p>
                        <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">{resumen.tasa}%</p>
                    </Card>
                </div>

                {/* INFORMACIÓN GENERAL */}
                <Card className="p-4">
                    <h2 className="text-xl font-bold mb-4">Información General</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <div>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">Almacén</p>
                                <p className="font-bold">{prestamo.almacen?.nombre || 'N/D'}</p>
                            </div>
                            <div>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">Chofer</p>
                                <p className="font-bold">{prestamo.chofer?.name || 'N/D'}</p>
                            </div>
                            <div>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">Vehículo Asignado</p>
                                <p className="font-bold">{prestamo.vehiculo_asignado || 'N/D'}</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">Garantía Total</p>
                                <p className="font-bold text-lg">Bs {Number(prestamo.monto_garantia || 0).toFixed(2)}</p>
                            </div>
                            {prestamo.observaciones && (
                                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200">
                                    <p className="text-sm">
                                        <span className="font-semibold">Observaciones:</span> {prestamo.observaciones}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </Card>

                {/* TABS */}
                <Tabs defaultValue="detalles" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="detalles">
                            Artículos Prestados ({prestamo.detalles?.length || 0})
                        </TabsTrigger>
                        <TabsTrigger value="devoluciones">
                            Devoluciones ({prestamo.devoluciones?.length || 0})
                        </TabsTrigger>
                    </TabsList>

                    {/* TAB: DETALLES */}
                    <TabsContent value="detalles" className="space-y-4">
                        {prestamo.detalles && prestamo.detalles.length > 0 ? (
                            prestamo.detalles.map((detalle: any) => {
                                const totalDevuelto = calcularTotalDevueltoDetalle(detalle);
                                const faltante = Math.max(0, detalle.cantidad_prestada - totalDevuelto);
                                const isExpanded = expandedDetalles.includes(detalle.id);

                                return (
                                    <Card key={detalle.id} className="p-0 overflow-hidden">
                                        {/* HEADER */}
                                        <div
                                            className="p-4 bg-gray-50 dark:bg-gray-700 border-b cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                                            onClick={() => toggleDetalle(detalle.id)}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        {isExpanded ? (
                                                            <ChevronUp className="w-4 h-4" />
                                                        ) : (
                                                            <ChevronDown className="w-4 h-4" />
                                                        )}
                                                        <h3 className="font-bold">
                                                            {detalle.prestable?.nombre || 'N/D'}
                                                        </h3>
                                                        <Badge variant="outline">
                                                            {detalle.prestable?.tipo}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                                        Prestado: <span className="font-bold">{detalle.cantidad_prestada}</span>
                                                        {' | '}
                                                        Devuelto: <span className="font-bold text-green-600">{totalDevuelto}</span>
                                                        {' | '}
                                                        Falta: <span className={`font-bold ${faltante > 0 ? 'text-red-600' : 'text-green-600'}`}>{faltante}</span>
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    {getEstadoBadge(detalle.estado)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* DETALLES EXPANDIDOS */}
                                        {isExpanded && (
                                            <div className="p-4 space-y-4">
                                                {/* POR ALMACÉN */}
                                                {detalle.almacenes && detalle.almacenes.length > 0 && (
                                                    <div>
                                                        <h4 className="font-bold text-sm mb-2">📦 Distribución por Almacén</h4>
                                                        <div className="bg-gray-50 dark:bg-gray-700 rounded overflow-x-auto">
                                                            <Table>
                                                                <TableHeader>
                                                                    <TableRow>
                                                                        <TableHead>Almacén</TableHead>
                                                                        <TableHead className="text-right">Cantidad</TableHead>
                                                                    </TableRow>
                                                                </TableHeader>
                                                                <TableBody>
                                                                    {detalle.almacenes.map((almacen: any, idx: number) => (
                                                                        <TableRow key={idx}>
                                                                            <TableCell>
                                                                                {almacen.almacen?.nombre || `Almacén ${almacen.almacenes_prestables_id}`}
                                                                            </TableCell>
                                                                            <TableCell className="text-right">
                                                                                {almacen.cantidad}
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                                </TableBody>
                                                            </Table>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* GARANTÍA */}
                                                <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded">
                                                    <p className="text-sm">
                                                        <span className="text-gray-700 dark:text-gray-300">Garantía por unidad:</span>
                                                        <span className="font-bold ml-2 text-blue-700 dark:text-blue-300">
                                                            Bs {Number(detalle.prestable?.condiciones?.[0]?.monto_garantia || 0).toFixed(2)}
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </Card>
                                );
                            })
                        ) : (
                            <Card className="p-6 text-center text-gray-600 dark:text-gray-300">
                                Sin artículos
                            </Card>
                        )}
                    </TabsContent>

                    {/* TAB: DEVOLUCIONES */}
                    <TabsContent value="devoluciones" className="space-y-4">
                        {prestamo.devoluciones && prestamo.devoluciones.length > 0 ? (
                            prestamo.devoluciones.map((devolucion: any) => {
                                const isExpanded = expandedDevoluciones.includes(devolucion.id);

                                return (
                                    <Card key={devolucion.id} className="p-0 overflow-hidden">
                                        {/* HEADER */}
                                        <div
                                            className={`p-4 border-b cursor-pointer transition ${
                                                devolucion.estado === 'ANULADA'
                                                    ? 'bg-red-50 dark:bg-red-900/20 hover:bg-red-100'
                                                    : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between" onClick={() => toggleDevolucion(devolucion.id)}>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        {isExpanded ? (
                                                            <ChevronUp className="w-4 h-4" />
                                                        ) : (
                                                            <ChevronDown className="w-4 h-4" />
                                                        )}
                                                        <h3 className="font-bold">
                                                            Devolución #{devolucion.id}
                                                        </h3>
                                                        {getEstadoDevolucionBadge(devolucion.estado)}
                                                    </div>
                                                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                                                        <Calendar className="w-4 h-4 inline mr-1" />
                                                        {new Date(devolucion.fecha_devolucion).toLocaleDateString('es-ES')}
                                                        {' | '}
                                                        Creado por: <span className="font-bold">{devolucion.creador?.name || 'Sistema'}</span>
                                                        {devolucion.estado === 'ANULADA' && (
                                                            <>
                                                                {' | '}
                                                                Anulado por: <span className="font-bold">{devolucion.anulador?.name || 'Sistema'}</span>
                                                            </>
                                                        )}
                                                    </p>
                                                    {devolucion.razon_anulacion && (
                                                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                                                            <AlertCircle className="w-4 h-4 inline mr-1" />
                                                            Razón: {devolucion.razon_anulacion}
                                                        </p>
                                                    )}
                                                </div>
                                                {/* BOTONES DE ACCIÓN */}
                                                {devolucion.estado === 'ACTIVA' && (
                                                    <div className="flex gap-2 ml-4">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setDevolucionSeleccionada({ id: devolucion.id, numero: devolucion.id });
                                                                setModalAnularOpen(true);
                                                            }}
                                                            className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 rounded flex items-center gap-1 text-sm transition"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                            Anular
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* DETALLES EXPANDIDOS */}
                                        {isExpanded && (
                                            <div className="p-4 space-y-4">
                                                {/* DETALLES */}
                                                {devolucion.detalles && devolucion.detalles.length > 0 && (
                                                    <div>
                                                        <h4 className="font-bold text-sm mb-2">📋 Detalles de Devolución</h4>
                                                        <div className="bg-gray-50 dark:bg-gray-700 rounded overflow-x-auto">
                                                            <Table>
                                                                <TableHeader>
                                                                    <TableRow>
                                                                        <TableHead>Artículo</TableHead>
                                                                        <TableHead className="text-right">Devuelto (Buen Estado)</TableHead>
                                                                        <TableHead className="text-right">Dañado Total</TableHead>
                                                                        <TableHead className="text-right">Total</TableHead>
                                                                    </TableRow>
                                                                </TableHeader>
                                                                <TableBody>
                                                                    {devolucion.detalles.map((detalle: any, idx: number) => (
                                                                        <TableRow key={idx}>
                                                                            <TableCell>
                                                                                {detalle.prestamo_evento_detalle?.prestable?.nombre || 'N/D'}
                                                                            </TableCell>
                                                                            <TableCell className="text-right">
                                                                                {detalle.cantidad_devuelta}
                                                                            </TableCell>
                                                                            <TableCell className="text-right">
                                                                                {detalle.cantidad_dañada_total}
                                                                            </TableCell>
                                                                            <TableCell className="text-right font-bold">
                                                                                {(detalle.cantidad_devuelta || 0) + (detalle.cantidad_dañada_total || 0)}
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                                </TableBody>
                                                            </Table>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* RESUMEN */}
                                                <div className="grid grid-cols-3 gap-4">
                                                    <div className="p-3 bg-green-50 dark:bg-green-900 rounded">
                                                        <p className="text-sm text-gray-700 dark:text-gray-300">Devuelto Buen Estado</p>
                                                        <p className="text-xl font-bold text-green-700 dark:text-green-300">
                                                            {devolucion.detalles?.reduce((s: number, d: any) => s + (d.cantidad_devuelta || 0), 0) || 0}
                                                        </p>
                                                    </div>
                                                    <div className="p-3 bg-orange-50 dark:bg-orange-900 rounded">
                                                        <p className="text-sm text-gray-700 dark:text-gray-300">Dañado Total</p>
                                                        <p className="text-xl font-bold text-orange-700 dark:text-orange-300">
                                                            {devolucion.detalles?.reduce((s: number, d: any) => s + (d.cantidad_dañada_total || 0), 0) || 0}
                                                        </p>
                                                    </div>
                                                    <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded">
                                                        <p className="text-sm text-gray-700 dark:text-gray-300">Monto Daño Cobrado</p>
                                                        <p className="text-xl font-bold text-blue-700 dark:text-blue-300">
                                                            Bs {Number(devolucion.monto_cobrado_daño_total || 0).toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* POR ALMACÉN */}
                                                {devolucion.detalles && devolucion.detalles.length > 0 && (
                                                    <div>
                                                        <h4 className="font-bold text-sm mb-2">📦 Devoluciones por Almacén</h4>
                                                        <div className="bg-gray-50 dark:bg-gray-700 rounded overflow-x-auto">
                                                            <Table>
                                                                <TableHeader>
                                                                    <TableRow>
                                                                        <TableHead>Artículo</TableHead>
                                                                        <TableHead>Almacén</TableHead>
                                                                        <TableHead className="text-right">Devuelto</TableHead>
                                                                        <TableHead className="text-right">Dañado</TableHead>
                                                                    </TableRow>
                                                                </TableHeader>
                                                                <TableBody>
                                                                    {devolucion.detalles.flatMap((detalle: any) =>
                                                                        (detalle.devolucionesAlmacenes || []).map((almacen: any, idx: number) => (
                                                                            <TableRow key={`${detalle.id}-${idx}`}>
                                                                                <TableCell>
                                                                                    {detalle.prestamoEventoDetalle?.prestable?.nombre || 'N/D'}
                                                                                </TableCell>
                                                                                <TableCell>
                                                                                    {almacen.almacen?.nombre || `Almacén ${almacen.almacenes_prestables_id}`}
                                                                                </TableCell>
                                                                                <TableCell className="text-right">
                                                                                    {almacen.cantidad_devuelta}
                                                                                </TableCell>
                                                                                <TableCell className="text-right">
                                                                                    {almacen.cantidad_dañada_total}
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        ))
                                                                    )}
                                                                </TableBody>
                                                            </Table>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* AUDITORÍA DE DEVOLUCIÓN */}
                                                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded border border-purple-200">
                                                    <p className="text-sm font-bold text-purple-700 dark:text-purple-300 mb-2">Auditoría de Devolución</p>
                                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                                        <div>
                                                            <span className="text-gray-600 dark:text-gray-300">Creado por:</span>
                                                            <span className="font-bold ml-1">{devolucion.creador?.name || 'Sistema'}</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-600 dark:text-gray-300">Fecha:</span>
                                                            <span className="font-bold ml-1">
                                                                {new Date(devolucion.created_at).toLocaleString('es-ES')}
                                                            </span>
                                                        </div>
                                                        {devolucion.estado === 'ANULADA' && (
                                                            <>
                                                                <div>
                                                                    <span className="text-gray-600 dark:text-gray-300">Anulado por:</span>
                                                                    <span className="font-bold ml-1">{devolucion.anulador?.name || 'Sistema'}</span>
                                                                </div>
                                                                <div>
                                                                    <span className="text-gray-600 dark:text-gray-300">Fecha anulación:</span>
                                                                    <span className="font-bold ml-1">
                                                                        {devolucion.fecha_anulacion ? new Date(devolucion.fecha_anulacion).toLocaleString('es-ES') : 'N/D'}
                                                                    </span>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </Card>
                                );
                            })
                        ) : (
                            <Card className="p-6 text-center text-gray-600 dark:text-gray-300">
                                Sin devoluciones registradas
                            </Card>
                        )}
                    </TabsContent>
                </Tabs>

                {/* MODAL ANULAR DEVOLUCIÓN */}
                {devolucionSeleccionada && (
                    <AnularDevolucionModal
                        prestamo_id={prestamo.id}
                        devolucion_id={devolucionSeleccionada.id}
                        devolucion_numero={devolucionSeleccionada.numero}
                        isOpen={modalAnularOpen}
                        onClose={() => {
                            setModalAnularOpen(false);
                            setDevolucionSeleccionada(null);
                        }}
                        onAnulada={() => {
                            if (prestamoId) {
                                cargarPrestamo(prestamoId as string);
                            }
                        }}
                        endpoint="/api/prestamos-evento"
                    />
                )}
            </div>
        </AppLayout>
    );
}
