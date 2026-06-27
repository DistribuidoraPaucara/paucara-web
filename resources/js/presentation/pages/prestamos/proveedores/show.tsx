import React, { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/presentation/components/ui/card';
import { Badge } from '@/presentation/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/presentation/components/ui/tabs';
import { ChevronUp, ChevronDown } from 'lucide-react';
import axios from 'axios';

export default function PrestamosProveedoresShow() {
    const { url } = usePage();
    const prestamoId = url.split('/').pop();
    const [prestamo, setPrestamo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expandedDevoluciones, setExpandedDevoluciones] = useState<number[]>([]);

    useEffect(() => {
        if (prestamoId) {
            axios.get(`/api/prestamos-proveedor/${prestamoId}`)
                .then(res => {
                    console.group('📥 PROVEEDOR #' + prestamoId);
                    console.log('✅ Datos del backend:', res.data.data);
                    console.log('🏢 Proveedor:', res.data.data.proveedor);
                    console.log('📋 Detalles:', res.data.data.detalles);
                    console.log('🔄 Devoluciones:', res.data.data.devoluciones);
                    res.data.data.detalles?.forEach((det, idx) => {
                        const totalDevuelto = det.devolucion_detalles?.reduce((s, d) => s + (d.cantidad_devuelta || 0) + (d.cantidad_dañada_total || 0), 0) || 0;
                        console.log(`  Detalle ${idx + 1}:`, {
                            nombre: det.prestable?.nombre,
                            prestada: det.cantidad_prestada,
                            devuelto: totalDevuelto,
                            falta: det.cantidad_prestada - totalDevuelto,
                            estado: det.estado,
                            devoluciones: det.devolucion_detalles
                        });
                    });
                    res.data.data.devoluciones?.forEach((dev, idx) => {
                        const devueltoTotal = dev.detalles?.reduce((s, d) => s + (d.cantidad_devuelta || 0), 0) || 0;
                        const dañadoTotal = dev.detalles?.reduce((s, d) => s + (d.cantidad_dañada_total || 0), 0) || 0;
                        console.log(`  Devolución ${idx + 1}:`, {
                            id: dev.id,
                            fecha: dev.fecha_devolucion,
                            devuelto: devueltoTotal,
                            dañado: dañadoTotal,
                            monto_daño: dev.monto_cobrado_daño_total,
                            detalles: dev.detalles
                        });
                    });
                    console.groupEnd();
                    setPrestamo(res.data.data);
                })
                .catch(err => {
                    console.error('❌ Error obteniendo proveedor:', err.response?.data || err.message);
                })
                .finally(() => setLoading(false));
        }
    }, [prestamoId]);

    if (loading) return <AppLayout><div className="text-center p-8">Cargando...</div></AppLayout>;
    if (!prestamo) return <AppLayout><div className="text-center p-8 text-red-600">Préstamo no encontrado</div></AppLayout>;

    return (
        <AppLayout>
            <div className="max-w-7xl mx-auto py-6 px-4 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-6">
                        <h3 className="text-gray-500 dark:text-gray-400 text-sm uppercase">Proveedor</h3>
                        <p className="text-2xl font-bold mt-2">{prestamo.proveedor?.nombre || 'N/D'}</p>
                    </Card>
                    <Card className="p-6">
                        <h3 className="text-gray-500 dark:text-gray-400 text-sm uppercase">Estado</h3>
                        <Badge className="mt-3">{prestamo.estado}</Badge>
                    </Card>
                    <Card className="p-6">
                        <h3 className="text-gray-500 dark:text-gray-400 text-sm uppercase">Fechas</h3>
                        <p className="text-sm mt-2">
                            <span className="text-gray-600 dark:text-gray-300">Préstamo:</span> {new Date(prestamo.fecha_prestamo).toLocaleDateString()}
                        </p>
                    </Card>
                </div>

                <Card className="p-6">
                    <h2 className="text-xl font-bold mb-4">Información General</h2>
                    <div className="grid grid-cols-4 gap-4">
                        <div>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">Almacén</p>
                            <p className="font-bold">{prestamo.almacen?.nombre || 'N/D'}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">Cantidad</p>
                            <p className="font-bold">{prestamo.cantidad}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">Garantía</p>
                            <p className="font-bold">${Number(prestamo.monto_garantia).toFixed(2)}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">Es Compra</p>
                            <p className="font-bold">{prestamo.es_compra ? 'Sí' : 'No'}</p>
                        </div>
                    </div>
                </Card>

                <Tabs defaultValue="detalles">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="detalles">Artículos ({prestamo.detalles?.length || 0})</TabsTrigger>
                        <TabsTrigger value="devoluciones">Devoluciones ({prestamo.devoluciones?.length || 0})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="detalles" className="space-y-4">
                        {prestamo.detalles?.map((detalle) => (
                            <Card key={detalle.id} className="p-0">
                                <div className="p-4 bg-gray-50 dark:bg-gray-700">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold">{detalle.prestable?.nombre}</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                                Prestado: {detalle.cantidad_prestada} | Devuelto: {detalle.devolucion_detalles?.reduce((s, d) => s + (d.cantidad_devuelta || 0) + (d.cantidad_dañada_total || 0), 0) || 0}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </TabsContent>

                    <TabsContent value="devoluciones" className="space-y-4">
                        {prestamo.devoluciones?.map((devolucion) => {
                            const isExpanded = expandedDevoluciones.includes(devolucion.id);
                            const devueltoTotal = devolucion.detalles?.reduce((s, d) => s + (d.cantidad_devuelta || 0), 0) || 0;
                            const dañadoTotal = devolucion.detalles?.reduce((s, d) => s + (d.cantidad_dañada_total || 0), 0) || 0;
                            return (
                                <Card key={devolucion.id} className="p-0">
                                    <div
                                        className="p-4 bg-gray-50 dark:bg-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                                        onClick={() => setExpandedDevoluciones(prev => prev.includes(devolucion.id) ? prev.filter(id => id !== devolucion.id) : [...prev, devolucion.id])}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-2 flex-1">
                                                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                <div>
                                                    <h3 className="font-bold text-gray-900 dark:text-white">Devolución #{devolucion.id}</h3>
                                                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                                        Fecha: <span className="text-gray-900 dark:text-white">{new Date(devolucion.fecha_devolucion).toLocaleDateString()}</span>
                                                        {' | '}
                                                        Devuelto: <span className="font-bold text-green-600 dark:text-green-400">{devueltoTotal}</span>
                                                        {' | '}
                                                        Dañado: <span className="font-bold text-orange-600 dark:text-orange-400">{dañadoTotal}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {isExpanded && (
                                        <div className="p-4 border-t border-gray-200 dark:border-gray-600 space-y-4">
                                            {devolucion.detalles && devolucion.detalles.length > 0 && (
                                                <div>
                                                    <h4 className="font-bold text-sm mb-3 text-gray-900 dark:text-white">📋 Detalles por Artículo</h4>
                                                    <div className="space-y-2">
                                                        {devolucion.detalles.map((detalle, idx) => (
                                                            <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                                                                <p className="font-bold text-gray-900 dark:text-white">{detalle.detalle_prestamo_proveedor?.prestable?.nombre || 'N/D'}</p>
                                                                <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
                                                                    <div>
                                                                        <p className="text-gray-600 dark:text-gray-300">Buen Estado</p>
                                                                        <p className="font-bold text-green-600 dark:text-green-400">{detalle.cantidad_devuelta || 0}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-gray-600 dark:text-gray-300">Dañado Total</p>
                                                                        <p className="font-bold text-orange-600 dark:text-orange-400">{detalle.cantidad_dañada_total || 0}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-gray-600 dark:text-gray-300">Total</p>
                                                                        <p className="font-bold text-gray-900 dark:text-white">{(detalle.cantidad_devuelta || 0) + (detalle.cantidad_dañada_total || 0)}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {devolucion.monto_cobrado_daño_total > 0 && (
                                                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                                        <span className="font-semibold">💰 Monto Cobrado por Daño:</span>
                                                        <span className="font-bold text-blue-600 dark:text-blue-400 ml-2">${Number(devolucion.monto_cobrado_daño_total).toFixed(2)}</span>
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </Card>
                            );
                        })}
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
