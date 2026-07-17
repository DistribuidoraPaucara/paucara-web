import AppLayout from '@/layouts/app-layout';
import AnularDevolucionModal from '@/presentation/components/modals/AnularDevolucionModal';
import { UbicacionMapModal } from '@/presentation/pages/prestamos/clientes/components/UbicacionMapModal';
import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import { Card } from '@/presentation/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/presentation/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/presentation/components/ui/tabs';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import { AlertCircle, Calendar, ChevronDown, ChevronUp, MapPin, Trash2, User } from 'lucide-react';
import { useEffect, useState } from 'react';

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
    created_by?: number;
    cliente?: any;
    almacen?: any;
    chofer?: any;
    vehiculo?: any;
    creador?: any;
    ubicacion?: any;
    detalles?: any[];
    devoluciones?: any[];
    telefono_cliente_1?: string;
    telefono_cliente_2?: string;
}

export default function PrestamosClientesShow() {
    const { url } = usePage();
    const prestamoId = url.split('/').pop();
    const [prestamo, setPrestamo] = useState<PrestamoClienteShow | null>(null);
    const [loading, setLoading] = useState(true);
    const [expandedDetalles, setExpandedDetalles] = useState<number[]>([]);
    const [expandedDevoluciones, setExpandedDevoluciones] = useState<number[]>([]);
    const [modalAnularOpen, setModalAnularOpen] = useState(false);
    const [devolucionSeleccionada, setDevolucionSeleccionada] = useState<{ id: number; numero: number } | null>(null);
    const [modalUbicacionOpen, setModalUbicacionOpen] = useState(false);

    useEffect(() => {
        if (prestamoId) {
            cargarPrestamo(prestamoId);
        }
    }, [prestamoId]);

    const cargarPrestamo = async (id: string | number) => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/prestamos-cliente/${id}`);
            const prestamo = response.data.data;

            // 🔍 DEBUG: Ver qué datos llegan del backend
            console.group('📥 DATOS DEL BACKEND - CLIENTE #' + id);
            console.log('✅ Préstamo completo:', prestamo);
            console.log('👤 Creador del préstamo:', prestamo.creador);
            console.log('👥 Cliente:', {
                id: prestamo.cliente?.id,
                nombre: prestamo.cliente?.nombre,
                nit: prestamo.cliente?.nit,
                telefono_1: prestamo.cliente?.telefono_cliente_1,
                telefono_2: prestamo.cliente?.telefono_cliente_2,
            });
            console.log('📦 Detalles:', {
                cantidad: prestamo.detalles?.length,
                prestables: prestamo.detalles?.map((d: any) => ({
                    nombre: d.prestable?.nombre,
                    cantidad_prestada: d.cantidad_prestada,
                    almacenes: d.almacenes?.length,
                    devuelto:
                        d.devolucion_detalles?.reduce((s: number, dv: any) => s + (dv.cantidad_devuelta || 0) + (dv.cantidad_dañada_total || 0), 0) ||
                        0,
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
                        prestable: det.detalle_prestamo_cliente?.prestable?.nombre,
                        almacenes: det.devolucion_cliente_detalle_almacenes?.length,
                    })),
                })),
            });
            console.log('📍 Ubicación:', {
                direccion: prestamo.ubicacion?.direccion,
                localidad: prestamo.ubicacion?.localidad?.nombre,
                es_manual: prestamo.ubicacion?.es_ubicacion_manual,
            });
            console.log('🏢 Almacén:', prestamo.almacen);
            console.log('👨‍✈️ Chofer:', prestamo.chofer);
            console.log('🚗 Vehículo:', prestamo.vehiculo);
            console.groupEnd();

            setPrestamo(prestamo);
        } catch (err: any) {
            console.error('❌ Error cargando préstamo:', err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleDetalle = (detalleId: number) => {
        setExpandedDetalles((prev) => (prev.includes(detalleId) ? prev.filter((id) => id !== detalleId) : [...prev, detalleId]));
    };

    const toggleDevolucion = (devolucionId: number) => {
        setExpandedDevoluciones((prev) => (prev.includes(devolucionId) ? prev.filter((id) => id !== devolucionId) : [...prev, devolucionId]));
    };

    const getEstadoBadge = (estado: string) => {
        const variants: Record<string, any> = {
            ACTIVO: { bg: 'bg-blue-100', text: 'text-blue-800', label: '🟦 Activo' },
            PARCIALMENTE_DEVUELTO: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: '🟨 Parcialmente Devuelto' },
            COMPLETAMENTE_DEVUELTO: { bg: 'bg-green-100', text: 'text-green-800', label: '🟩 Completamente Devuelto' },
            CANCELADO: { bg: 'bg-gray-100', text: 'text-gray-800', label: '⬜ Cancelado' },
        };
        const variant = variants[estado] || variants.ACTIVO;
        return <span className={`rounded-full px-3 py-1 text-sm font-medium ${variant.bg} ${variant.text}`}>{variant.label}</span>;
    };

    const getEstadoDevolucionBadge = (estado: string) => {
        const variants: Record<string, any> = {
            ACTIVA: { bg: 'bg-green-100', text: 'text-green-800', label: '✅ Activa' },
            ANULADA: { bg: 'bg-red-100', text: 'text-red-800', label: '❌ Anulada' },
        };
        const variant = variants[estado] || variants.ACTIVA;
        return <span className={`rounded px-2 py-1 text-xs font-medium ${variant.bg} ${variant.text}`}>{variant.label}</span>;
    };

    const calcularTotalDevueltoDetalle = (detalleId: number, activas?: any[]) => {
        const devolucionesActivas = activas || prestamo?.devoluciones?.filter((d: any) => d.estado !== 'ANULADA') || [];

        let total = 0;
        devolucionesActivas.forEach((dev: any) => {
            dev.detalles?.forEach((det: any) => {
                if (det.detalle_prestamo_cliente?.id === detalleId) {
                    total += (det.cantidad_devuelta || 0) + (det.cantidad_dañada_total || 0);
                }
            });
        });
        return total;
    };

    const calcularResumenPrestamo = () => {
        if (!prestamo?.detalles) return { total: 0, devuelto: 0, faltante: 0, tasa: 0 };

        // Filtrar solo devoluciones activas (excluir anuladas)
        const devolucionesActivas = prestamo.devoluciones?.filter((d: any) => d.estado !== 'ANULADA') || [];

        const total = prestamo.detalles.reduce((sum: number, d: any) => sum + (d.cantidad_prestada || 0), 0);
        const devuelto = prestamo.detalles.reduce((sum: number, d: any) => sum + calcularTotalDevueltoDetalle(d.id, devolucionesActivas), 0);
        const faltante = Math.max(0, total - devuelto);
        const tasa = total > 0 ? Math.round((devuelto / total) * 100) : 0;

        return { total, devuelto, faltante, tasa };
    };

    if (loading) {
        return (
            <AppLayout>
                <div className="flex h-screen items-center justify-center">
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
            <div className="space-y-6 px-4 py-6">
                {/* AUDITORÍA DEL PRÉSTAMO */}
                <Card className="border-l-4 border-purple-500 bg-purple-50 p-2 dark:bg-purple-900/20">
                    <h2 className="flex items-center gap-2 text-lg font-bold">
                        <User className="h-5 w-5" />
                        {prestamo.cliente?.nombre || prestamo.cliente?.razon_social || 'N/D'} {getEstadoBadge(prestamo.estado)}
                        <p className="text-xs text-gray-500">{new Date(prestamo.fecha_prestamo).toLocaleDateString('es-ES')}</p>
                    </h2>
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-6">
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Creado por</p>
                            <p className="text-lg font-bold">{prestamo.creador?.name || 'Sistema'}</p>
                            
                            <p className="text-sm">
                                <span className="text-gray-600 dark:text-gray-300">Devolución:</span>
                                <span className="ml-2 font-medium">{new Date(prestamo.fecha_esperada_devolucion).toLocaleDateString('es-ES')}</span>
                            </p>
                        </div>
                        {prestamo.observaciones && (
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-300">Observaciones Generales</p>
                                <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{prestamo.observaciones || 'Ninguna'}</p>
                            </div>
                        )}
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Almacén</p>
                            <p className="font-bold">{prestamo.almacen?.nombre || 'N/D'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Chofer</p>
                            <p className="font-bold">{prestamo.chofer?.name || 'N/D'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Vehículo</p>
                            <p className="font-bold">{prestamo.vehiculo?.placa || 'N/D'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Garantía Total</p>
                            <p className="text-lg font-bold">Bs {Number(prestamo.monto_garantia || 0).toFixed(2)}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
                        {prestamo.telefono_cliente_1 && (
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-300">Teléfono 1</p>
                                <p className="font-medium">{prestamo.telefono_cliente_1}</p>
                            </div>
                        )}
                        {prestamo.telefono_cliente_2 && (
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-300">Teléfono 2</p>
                                <p className="font-medium">{prestamo.telefono_cliente_2}</p>
                            </div>
                        )}
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Localidad</p>
                            <p className="font-medium">{prestamo.ubicacion.localidad?.nombre || 'No especificada'}</p>
                            {prestamo.ubicacion.es_ubicacion_manual && (
                                <Badge variant="outline" className="w-fit">
                                    📍 Ubicación Manual
                                </Badge>
                            )}
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Dirección</p>
                            <p className="font-medium">{prestamo.ubicacion.observaciones || 'No especificada'}</p>
                            {prestamo.ubicacion.latitud && prestamo.ubicacion.longitud && (
                                <Button
                                    onClick={() => setModalUbicacionOpen(true)}
                                    variant="outline"
                                    size="sm"
                                    className="mt-2 w-fit gap-2"
                                >
                                    <MapPin className="h-4 w-4" />
                                    Ver en Mapa
                                </Button>
                            )}
                        </div>
                    </div>
                </Card>

                {/* RESUMEN DE PRÉSTAMO (KPIs) */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    <div className="rounded-md border-blue-200 bg-blue-50 p-2 dark:bg-blue-900/20">
                        <p className="text-sm text-gray-600 dark:text-gray-300">Total Prestado</p>
                        <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{resumen.total}</p>
                    </div>
                    <div className="rounded-md border-green-200 bg-green-50 p-2 dark:bg-green-900/20">
                        <p className="text-sm text-gray-600 dark:text-gray-300">Devuelto</p>
                        <p className="text-3xl font-bold text-green-700 dark:text-green-300">{resumen.devuelto}</p>
                    </div>
                    <div className="rounded-md border-red-200 bg-red-50 p-2 dark:bg-red-900/20">
                        <p className="text-sm text-gray-600 dark:text-gray-300">Faltante</p>
                        <p className="text-3xl font-bold text-red-700 dark:text-red-300">{resumen.faltante}</p>
                    </div>
                    {/* <div className="rounded-md border-purple-200 bg-purple-50 p-2 dark:bg-purple-900/20">
                        <p className="text-sm text-gray-600 dark:text-gray-300">Tasa Devolución</p>
                        <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">{resumen.tasa}%</p>
                    </div> */}
                </div>

                {/* TABS */}
                <Tabs defaultValue="detalles" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="detalles">Artículos Prestados ({prestamo.detalles?.length || 0})</TabsTrigger>
                        <TabsTrigger value="devoluciones">Devoluciones ({prestamo.devoluciones?.length || 0})</TabsTrigger>
                    </TabsList>

                    {/* TAB: DETALLES */}
                    <TabsContent value="detalles" className="space-y-4">
                        {prestamo.detalles && prestamo.detalles.length > 0 ? (
                            prestamo.detalles.map((detalle: any) => {
                                const totalDevuelto = calcularTotalDevueltoDetalle(detalle);
                                const faltante = Math.max(0, detalle.cantidad_prestada - totalDevuelto);
                                const isExpanded = expandedDetalles.includes(detalle.id);

                                return (
                                    <Card key={detalle.id} className="overflow-hidden p-0">
                                        {/* HEADER */}
                                        <div
                                            className="cursor-pointer border-b bg-gray-50 p-4 transition hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600"
                                            onClick={() => toggleDetalle(detalle.id)}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                                        <h3 className="font-bold">{detalle.prestable?.nombre || 'N/D'}</h3>
                                                        <Badge variant="outline">{detalle.prestable?.tipo}</Badge>
                                                    </div>
                                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                                                        Prestado: <span className="font-bold">{detalle.cantidad_prestada}</span>
                                                        {' | '}
                                                        Devuelto: <span className="font-bold text-green-600">{totalDevuelto}</span>
                                                        {' | '}
                                                        Falta:{' '}
                                                        <span className={`font-bold ${faltante > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                            {faltante}
                                                        </span>
                                                    </p>
                                                </div>
                                                <div className="text-right">{getEstadoBadge(detalle.estado)}</div>
                                            </div>
                                        </div>

                                        {/* DETALLES EXPANDIDOS */}
                                        {isExpanded && (
                                            <div className="space-y-4 p-4">
                                                {/* POR ALMACÉN */}
                                                {detalle.almacenes && detalle.almacenes.length > 0 && (
                                                    <div>
                                                        <h4 className="mb-2 text-sm font-bold">📦 Distribución por Almacén</h4>
                                                        <div className="overflow-x-auto rounded bg-gray-50 dark:bg-gray-700">
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
                                                                                {almacen.almacen?.nombre ||
                                                                                    `Almacén ${almacen.almacenes_prestables_id}`}
                                                                            </TableCell>
                                                                            <TableCell className="text-right">{almacen.cantidad}</TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                                </TableBody>
                                                            </Table>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* GARANTÍA */}
                                                <div className="rounded bg-blue-50 p-3 dark:bg-blue-900">
                                                    <p className="text-sm">
                                                        <span className="text-gray-700 dark:text-gray-300">Garantía por unidad:</span>
                                                        <span className="ml-2 font-bold text-blue-700 dark:text-blue-300">
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
                            <Card className="p-6 text-center text-gray-600 dark:text-gray-300">Sin artículos</Card>
                        )}
                    </TabsContent>

                    {/* TAB: DEVOLUCIONES */}
                    <TabsContent value="devoluciones" className="space-y-4">
                        {prestamo.devoluciones && prestamo.devoluciones.length > 0 ? (
                            prestamo.devoluciones.map((devolucion: any) => {
                                const isExpanded = expandedDevoluciones.includes(devolucion.id);

                                return (
                                    <Card key={devolucion.id} className="overflow-hidden p-0">
                                        {/* HEADER */}
                                        <div
                                            className={`cursor-pointer border-b p-4 transition ${
                                                devolucion.estado === 'ANULADA'
                                                    ? 'bg-red-50 hover:bg-red-100 dark:bg-red-900/20'
                                                    : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between" onClick={() => toggleDevolucion(devolucion.id)}>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                                        <h3 className="font-bold">Devolución #{devolucion.id}</h3>
                                                        {getEstadoDevolucionBadge(devolucion.estado)}
                                                    </div>
                                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                                        <Calendar className="mr-1 inline h-4 w-4" />
                                                        {new Date(devolucion.fecha_devolucion).toLocaleDateString('es-ES')}
                                                        {' | '}
                                                        Creado por: <span className="font-bold">{devolucion.creador?.name || 'Sistema'}</span>
                                                        {devolucion.estado === 'ANULADA' && (
                                                            <>
                                                                {' | '}
                                                                Anulado por:{' '}
                                                                <span className="font-bold">{devolucion.anulador?.name || 'Sistema'}</span>
                                                            </>
                                                        )}
                                                    </p>
                                                    {devolucion.razon_anulacion && (
                                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                            <AlertCircle className="mr-1 inline h-4 w-4" />
                                                            Razón: {devolucion.razon_anulacion}
                                                        </p>
                                                    )}
                                                </div>
                                                {/* BOTONES DE ACCIÓN */}
                                                {devolucion.estado === 'ACTIVA' && (
                                                    <div className="ml-4 flex gap-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setDevolucionSeleccionada({ id: devolucion.id, numero: devolucion.id });
                                                                setModalAnularOpen(true);
                                                            }}
                                                            className="flex items-center gap-1 rounded bg-red-100 px-3 py-1 text-sm text-red-700 transition hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                            Anular
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* DETALLES EXPANDIDOS */}
                                        {isExpanded && (
                                            <div className="space-y-4 p-4">
                                                {/* DETALLES */}
                                                {devolucion.detalles && devolucion.detalles.length > 0 && (
                                                    <div>
                                                        <h4 className="mb-2 text-sm font-bold">📋 Detalles de Devolución</h4>
                                                        <div className="overflow-x-auto rounded bg-gray-50 dark:bg-gray-700">
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
                                                                            <TableCell className="text-right">{detalle.cantidad_devuelta}</TableCell>
                                                                            <TableCell className="text-right">
                                                                                {detalle.cantidad_dañada_total}
                                                                            </TableCell>
                                                                            <TableCell className="text-right font-bold">
                                                                                {(detalle.cantidad_devuelta || 0) +
                                                                                    (detalle.cantidad_dañada_total || 0)}
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
                                                    <div className="rounded bg-green-50 p-3 dark:bg-green-900">
                                                        <p className="text-sm text-gray-700 dark:text-gray-300">Devuelto Buen Estado</p>
                                                        <p className="text-xl font-bold text-green-700 dark:text-green-300">
                                                            {devolucion.detalles?.reduce((s: number, d: any) => s + (d.cantidad_devuelta || 0), 0) ||
                                                                0}
                                                        </p>
                                                    </div>
                                                    <div className="rounded bg-orange-50 p-3 dark:bg-orange-900">
                                                        <p className="text-sm text-gray-700 dark:text-gray-300">Dañado Total</p>
                                                        <p className="text-xl font-bold text-orange-700 dark:text-orange-300">
                                                            {devolucion.detalles?.reduce(
                                                                (s: number, d: any) => s + (d.cantidad_dañada_total || 0),
                                                                0,
                                                            ) || 0}
                                                        </p>
                                                    </div>
                                                    <div className="rounded bg-blue-50 p-3 dark:bg-blue-900">
                                                        <p className="text-sm text-gray-700 dark:text-gray-300">Monto Daño Cobrado</p>
                                                        <p className="text-xl font-bold text-blue-700 dark:text-blue-300">
                                                            Bs {Number(devolucion.monto_cobrado_daño_total || 0).toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* POR ALMACÉN */}
                                                {devolucion.detalles && devolucion.detalles.length > 0 && (
                                                    <div>
                                                        <h4 className="mb-2 text-sm font-bold">📦 Devoluciones por Almacén</h4>
                                                        <div className="overflow-x-auto rounded bg-gray-50 dark:bg-gray-700">
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
                                                                        (detalle.devolucion_cliente_detalle_almacenes || []).map(
                                                                            (almacen: any, idx: number) => (
                                                                                <TableRow key={`${detalle.id}-${idx}`}>
                                                                                    <TableCell>
                                                                                        {detalle.detalle_prestamo_cliente?.prestable?.nombre || 'N/D'}
                                                                                    </TableCell>
                                                                                    <TableCell>
                                                                                        {almacen.almacen?.nombre ||
                                                                                            `Almacén ${almacen.almacenes_prestables_id}`}
                                                                                    </TableCell>
                                                                                    <TableCell className="text-right">
                                                                                        {almacen.cantidad_devuelta}
                                                                                    </TableCell>
                                                                                    <TableCell className="text-right">
                                                                                        {almacen.cantidad_dañada_total}
                                                                                    </TableCell>
                                                                                </TableRow>
                                                                            ),
                                                                        ),
                                                                    )}
                                                                </TableBody>
                                                            </Table>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* AUDITORÍA DE DEVOLUCIÓN */}
                                                <div className="rounded border border-purple-200 bg-purple-50 p-3 dark:bg-purple-900/20">
                                                    <p className="mb-2 text-sm font-bold text-purple-700 dark:text-purple-300">
                                                        Auditoría de Devolución
                                                    </p>
                                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                                        <div>
                                                            <span className="text-gray-600 dark:text-gray-300">Creado por:</span>
                                                            <span className="ml-1 font-bold">{devolucion.creador?.name || 'Sistema'}</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-600 dark:text-gray-300">Fecha:</span>
                                                            <span className="ml-1 font-bold">
                                                                {new Date(devolucion.created_at).toLocaleString('es-ES')}
                                                            </span>
                                                        </div>
                                                        {devolucion.estado === 'ANULADA' && (
                                                            <>
                                                                <div>
                                                                    <span className="text-gray-600 dark:text-gray-300">Anulado por:</span>
                                                                    <span className="ml-1 font-bold">{devolucion.anulador?.name || 'Sistema'}</span>
                                                                </div>
                                                                <div>
                                                                    <span className="text-gray-600 dark:text-gray-300">Fecha anulación:</span>
                                                                    <span className="ml-1 font-bold">
                                                                        {devolucion.fecha_anulacion
                                                                            ? new Date(devolucion.fecha_anulacion).toLocaleString('es-ES')
                                                                            : 'N/D'}
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
                            <Card className="p-6 text-center text-gray-600 dark:text-gray-300">Sin devoluciones registradas</Card>
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
                    />
                )}

                {/* MODAL VER UBICACIÓN EN MAPA */}
                {prestamo.ubicacion && (
                    <UbicacionMapModal
                        isOpen={modalUbicacionOpen}
                        onClose={() => setModalUbicacionOpen(false)}
                        onSelect={() => setModalUbicacionOpen(false)}
                        localidades={[]}
                        ubicacionInicial={{
                            latitud: parseFloat(prestamo.ubicacion.latitud),
                            longitud: parseFloat(prestamo.ubicacion.longitud),
                        }}
                        mostrarSelectLocalidad={false}
                    />
                )}
            </div>
        </AppLayout>
    );
}
