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
import { ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';

interface PrestamoClienteShow {
    id: number;
    prestamo_cliente_id?: number;
    cliente_id: number;
    almacenes_prestables_id: number;
    cantidad: number;
    monto_garantia: string;
    fecha_prestamo: string;
    fecha_esperada_devolucion: string;
    estado: string;
    observaciones?: string;
    cliente?: any;
    almacen?: any;
    chofer?: any;
    detalles?: any[];
    devoluciones?: any[];
}

export default function PrestamosClientesShow() {
    const { url } = usePage();
    const prestamoId = url.split('/').pop();
    const [prestamo, setPrestamo] = useState<PrestamoClienteShow | null>(null);
    const [loading, setLoading] = useState(true);
    const [expandedDetalles, setExpandedDetalles] = useState<number[]>([]);
    const [expandedDevoluciones, setExpandedDevoluciones] = useState<number[]>([]);

    useEffect(() => {
        if (prestamoId) {
            cargarPrestamo(prestamoId);
        }
    }, [prestamoId]);

    const cargarPrestamo = async (id: number) => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/prestamos-cliente/${id}`);
            const prestamo = response.data.data;

            console.group('📥 CLIENTE #' + id);
            console.log('✅ Datos completos del backend:', prestamo);
            console.log('👤 Cliente:', prestamo.cliente);
            console.log('📦 Detalles:', prestamo.detalles);
            console.log('🔄 Devoluciones:', prestamo.devoluciones);

            prestamo.detalles?.forEach((det: any, idx: number) => {
                const totalDevuelto = det.devolucion_detalles?.reduce((s: number, d: any) => s + ((d.cantidad_devuelta || 0) + (d.cantidad_dañada_total || 0)), 0) || 0;
                console.log(`  Detalle ${idx + 1}: ${det.prestable?.nombre}`, {
                    cantidad_prestada: det.cantidad_prestada,
                    total_devuelto: totalDevuelto,
                    falta: det.cantidad_prestada - totalDevuelto,
                    estado: det.estado,
                    almacenes: det.almacenes,
                    devolucion_detalles: det.devolucion_detalles
                });
            });

            prestamo.devoluciones?.forEach((dev: any, idx: number) => {
                console.log(`  Devolución ${idx + 1}:`, {
                    id: dev.id,
                    fecha: dev.fecha_devolucion,
                    cantidad_total_devuelta: dev.cantidad_total_devuelta,
                    monto_garantia_devuelta: dev.monto_garantia_devuelta_total,
                    monto_cobrado_daño: dev.monto_cobrado_daño_total,
                    detalles: dev.detalles
                });
            });
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

    const calcularTotalDevueltoDetalle = (detalle: any) => {
        return detalle.devolucion_detalles?.reduce(
            (sum: number, dev: any) => sum + ((dev.cantidad_devuelta || 0) + (dev.cantidad_dañada_total || 0)),
            0
        ) || 0;
    };

    if (loading) {
        return (
            <AppLayout>
                <div className="flex justify-center items-center h-screen">
                    <div className="text-lg text-gray-600 dark:text-gray-300">Cargando prestamo...</div>
                </div>
            </AppLayout>
        );
    }

    if (!prestamo) {
        return (
            <AppLayout>
                <div className="text-center text-red-600">Prestamo no encontrado</div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="max-w-7xl mx-auto py-6 px-4 space-y-6">
                {/* ENCABEZADO */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-6">
                        <h3 className="text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wide">Cliente</h3>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                            {prestamo.cliente?.nombre || prestamo.cliente?.razon_social || 'N/D'}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            {prestamo.cliente?.nit && `NIT: ${prestamo.cliente.nit}`}
                        </p>
                    </Card>

                    <Card className="p-6">
                        <h3 className="text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wide">Estado</h3>
                        <div className="mt-3">
                            {getEstadoBadge(prestamo.estado)}
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h3 className="text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wide">Fechas</h3>
                        <div className="space-y-2 mt-2">
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

                {/* INFORMACIÓN GENERAL */}
                <Card className="p-6">
                    <h2 className="text-xl font-bold mb-4">Información General</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">Almacén</p>
                            <p className="font-bold">{prestamo.almacen?.nombre || 'N/D'}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">Chofer</p>
                            <p className="font-bold">{prestamo.chofer?.name || 'N/D'}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">Vehículo</p>
                            <p className="font-bold">{prestamo.vehiculo?.placa || 'N/D'}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">Garantía Total</p>
                            <p className="font-bold">${Number(prestamo.monto_garantia || 0).toFixed(2)}</p>
                        </div>
                    </div>
                    {prestamo.observaciones && (
                        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                            <p className="text-sm text-gray-700">
                                <span className="font-semibold">Observaciones:</span> {prestamo.observaciones}
                            </p>
                        </div>
                    )}
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
                                            className="p-4 bg-gray-50 dark:bg-gray-700 border-b cursor-pointer hover:bg-gray-100 transition"
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
                                                                                {almacen.cantidad_prestada}
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                                </TableBody>
                                                            </Table>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* GARANTÍA */}
                                                <div className="p-3 bg-blue-50 rounded">
                                                    <p className="text-sm">
                                                        <span className="text-gray-700">Garantía por unidad:</span>
                                                        <span className="font-bold ml-2">
                                                            ${Number(detalle.prestable?.condiciones?.[0]?.monto_garantia || 0).toFixed(2)}
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
                                            className="p-4 bg-gray-50 dark:bg-gray-700 border-b cursor-pointer hover:bg-gray-100 transition"
                                            onClick={() => toggleDevolucion(devolucion.id)}
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
                                                            Devolución #{devolucion.id}
                                                        </h3>
                                                    </div>
                                                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                                        Fecha: {new Date(devolucion.fecha_devolucion).toLocaleDateString('es-ES')}
                                                        {' | '}
                                                        Total devuelto: <span className="font-bold">{devolucion.cantidad_total_devuelta}</span>
                                                    </p>
                                                </div>
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
                                                                                {detalle.detalle_prestamo_cliente?.prestable?.nombre || 'N/D'}
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
                                                    <div className="p-3 bg-green-50 rounded">
                                                        <p className="text-sm text-gray-700">Devuelto Buen Estado</p>
                                                        <p className="text-xl font-bold text-green-700">
                                                            {devolucion.detalles?.reduce((s: number, d: any) => s + (d.cantidad_devuelta || 0), 0) || 0}
                                                        </p>
                                                    </div>
                                                    <div className="p-3 bg-orange-50 rounded">
                                                        <p className="text-sm text-gray-700">Dañado Total</p>
                                                        <p className="text-xl font-bold text-orange-700">
                                                            {devolucion.detalles?.reduce((s: number, d: any) => s + (d.cantidad_dañada_total || 0), 0) || 0}
                                                        </p>
                                                    </div>
                                                    <div className="p-3 bg-blue-50 rounded">
                                                        <p className="text-sm text-gray-700">Monto Daño Cobrado</p>
                                                        <p className="text-xl font-bold text-blue-700">
                                                            ${Number(devolucion.monto_cobrado_daño_total || 0).toFixed(2)}
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
                                                                        (detalle.devolucion_cliente_detalle_almacenes || []).map((almacen: any, idx: number) => (
                                                                            <TableRow key={`${detalle.id}-${idx}`}>
                                                                                <TableCell>
                                                                                    {detalle.detalle_prestamo_cliente?.prestable?.nombre || 'N/D'}
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
            </div>
        </AppLayout>
    );
}
