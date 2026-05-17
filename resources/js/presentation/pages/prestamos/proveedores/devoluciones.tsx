import React, { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
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
import ToastContainer from '@/presentation/components/ui/toast-container';
import { OutputSelectionModal } from '@/presentation/components/impresion/OutputSelectionModal';
import prestamoProveedorService from '@/infrastructure/services/prestamo-proveedor.service';
import { ArrowLeft, FileText, Printer, ChevronDown } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/presentation/components/ui/dialog';

interface DevolucionProveedorDetalle {
    id: number;
    devolucion_proveedor_id: number;
    prestamo_proveedor_detalle_id: number;
    cantidad_devuelta: number;
    cantidad_dañada_parcial: number;
    cantidad_dañada_total: number;
    monto_cobrado_daño: number;
    monto_garantia_devuelta: number;
    detallePrestamoProveedor?: {
        id: number;
        prestable_id: number;
        cantidad_prestada: number;
        prestable?: {
            id: number;
            nombre: string;
            tipo: string;
            capacidad?: number;
        };
    };
}

interface DevolucionProveedorHeader {
    id: number;
    prestamo_proveedor_id: number;
    fecha_devolucion: string;
    monto_cobrado_daño_total: number;
    monto_garantia_devuelta_total: number;
    observaciones?: string;
    chofer_id?: number;
    detalles: DevolucionProveedorDetalle[];
}

interface PrestamoProveedorConDevoluciones {
    id: number;
    proveedor: {
        id: number;
        nombre?: string;
        razon_social: string;
    };
    fecha_prestamo: string;
    detalles: any[];
    devoluciones: DevolucionProveedorHeader[];
}

export default function DevolucionesProveedorPage({ prestamoId }: { prestamoId: number }) {
    const [prestamo, setPrestamo] = useState<PrestamoProveedorConDevoluciones | null>(null);
    const [loading, setLoading] = useState(true);
    const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'success' | 'error' | 'warning' | 'info' }>>([]);
    const [mostrarModalImpresion, setMostrarModalImpresion] = useState(false);
    const [devolucionSeleccionada, setDevolucionSeleccionada] = useState<DevolucionProveedorHeader | null>(null);
    const [mostrarModalDetalles, setMostrarModalDetalles] = useState(false);

    const addToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
        const id = Date.now().toString();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), 4000);
    };

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    useEffect(() => {
        const cargarPrestamo = async () => {
            try {
                setLoading(true);
                const data = await prestamoProveedorService.getById(prestamoId);
                setPrestamo(data);
            } catch (error: any) {
                console.error('Error cargando préstamo:', error);
                addToast('Error cargando el préstamo', 'error');
            } finally {
                setLoading(false);
            }
        };

        cargarPrestamo();
    }, [prestamoId]);

    const imprimirDevolucion = (devolucionId: number) => {
        // Generar URL para descargar PDF
        const url = `/api/prestamos-proveedor/${prestamoId}/devoluciones/${devolucionId}/imprimir`;
        window.open(url, '_blank');
    };

    const abrirDetalles = (devolucion: DevolucionProveedorHeader) => {
        console.log('=== DEVOLUCION PROVEEDOR SELECCIONADA ===');
        console.log('Devolucion Header:', devolucion);
        console.log('ID:', devolucion.id);
        console.log('Fecha:', devolucion.fecha_devolucion);
        console.log('Monto Cobrado:', devolucion.monto_cobrado_daño_total);
        console.log('Cantidad de detalles:', devolucion.detalles.length);

        console.log('\n=== DETALLES ===');
        devolucion.detalles.forEach((detalle, idx) => {
            console.log(`\nDetalle ${idx + 1}:`);
            console.log('  ID:', detalle.id);
            console.log('  Cantidades:', {
                devuelta: detalle.cantidad_devuelta,
                parcial: detalle.cantidad_dañada_parcial,
                total: detalle.cantidad_dañada_total
            });
            console.log('  DetallePrestamoProveedor:', detalle.detallePrestamoProveedor);
            console.log('  Prestable:', detalle.detallePrestamoProveedor?.prestable);
            console.log('  Nombre Prestable:', detalle.detallePrestamoProveedor?.prestable?.nombre);
        });
        console.log('================================\n');

        setDevolucionSeleccionada(devolucion);
        setMostrarModalDetalles(true);
    };

    const obtenerTotalDevoluciones = () => {
        if (!prestamo || !prestamo.devoluciones) return 0;
        return prestamo.devoluciones.length;
    };

    const calcularTotalCantidadesDevuelta = (devolucion: DevolucionProveedorHeader) => {
        return devolucion.detalles.reduce((sum, d) => sum + d.cantidad_devuelta, 0);
    };

    const calcularTotalCantidadesDañada = (devolucion: DevolucionProveedorHeader) => {
        return devolucion.detalles.reduce((sum, d) => sum + d.cantidad_dañada_parcial + d.cantidad_dañada_total, 0);
    };

    if (loading) {
        return (
            <AppLayout>
                <Head title="Devoluciones del Préstamo a Proveedor" />
                <div className="p-8 text-center text-gray-600 dark:text-gray-400">Cargando...</div>
            </AppLayout>
        );
    }

    if (!prestamo) {
        return (
            <AppLayout>
                <Head title="Devoluciones del Préstamo a Proveedor" />
                <div className="p-8">
                    <div className="text-center text-red-600">Préstamo no encontrado</div>
                    <div className="mt-4">
                        <Link href="/prestamos/proveedores">
                            <Button className="gap-2">
                                <ArrowLeft size={20} />
                                Volver a Préstamos
                            </Button>
                        </Link>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <Head title="Historial de Devoluciones a Proveedor" />
            <div className="p-8 bg-white dark:bg-gray-950 min-h-screen">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Link href="/prestamos/proveedores">
                            <Button variant="outline" className="gap-2 mb-4">
                                <ArrowLeft size={20} />
                                Volver
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            📋 Historial de Devoluciones al Proveedor
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            Préstamo #{prestamo.id} - {prestamo.proveedor.nombre || prestamo.proveedor.razon_social}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-4xl font-bold text-blue-600">{obtenerTotalDevoluciones()}</div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Devolucion{obtenerTotalDevoluciones() !== 1 ? 'es' : ''} registrada{obtenerTotalDevoluciones() !== 1 ? 's' : ''}</p>
                    </div>
                </div>

                {/* Botón de reimprimir todas las devoluciones */}
                {obtenerTotalDevoluciones() > 0 && (
                    <div className="mb-6 flex justify-end">
                        <Button
                            onClick={() => setMostrarModalImpresion(true)}
                            className="gap-2 bg-blue-600 hover:bg-blue-700"
                        >
                            <Printer size={20} />
                            Reimprimir Comprobante de Devolución
                        </Button>
                    </div>
                )}

                {/* Contenido */}
                {!prestamo?.devoluciones || prestamo.devoluciones.length === 0 ? (
                    <Card className="p-12 text-center">
                        <div className="text-5xl mb-4">📦</div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            No hay devoluciones registradas
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Aún no se ha registrado ninguna devolución para este préstamo
                        </p>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {prestamo?.devoluciones?.map((devolucion: DevolucionProveedorHeader, idx: number) => (
                            <Card key={devolucion.id} className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Devolución #{idx + 1}</p>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            📅 {new Date(devolucion.fecha_devolucion).toLocaleDateString('es-ES')}
                                        </h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                            {devolucion.detalles.length} prestable{devolucion.detalles.length !== 1 ? 's' : ''} devuelto{devolucion.detalles.length !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                    <div className="text-right space-y-2">
                                        <Button
                                            onClick={() => abrirDetalles(devolucion)}
                                            variant="outline"
                                            className="gap-2"
                                            size="sm"
                                        >
                                            <ChevronDown size={16} />
                                            Ver Detalles
                                        </Button>
                                        <Button
                                            onClick={() => setMostrarModalImpresion(true)}
                                            variant="outline"
                                            className="gap-2"
                                            size="sm"
                                        >
                                            <Printer size={16} />
                                            Imprimir
                                        </Button>
                                    </div>
                                </div>

                                {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-2 border-t border-gray-200 dark:border-gray-700">
                                    
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">✅ Total Devuelto en Buen Estado</p>
                                            <p className="font-semibold text-green-600 dark:text-green-400 text-lg">
                                                {calcularTotalCantidadesDevuelta(devolucion)} unidades
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">⚠️ Total Dañado</p>
                                        <p className="font-semibold text-orange-600 dark:text-orange-400 text-lg">
                                            {calcularTotalCantidadesDañada(devolucion)} unidades
                                        </p>
                                    </div>

                                    
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">💰 Monto a Cobrar por Daño</p>
                                            <p className="font-semibold text-blue-600 dark:text-blue-400 text-lg">
                                                Bs {Number(devolucion.monto_cobrado_daño_total).toFixed(2)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">💎 Garantía Devuelta Total</p>
                                            <p className="font-semibold text-green-600 dark:text-green-400 text-lg">
                                                Bs {Number(devolucion.monto_garantia_devuelta_total).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div> */}

                                {devolucion.observaciones && (
                                    <div className="border-t border-gray-200 dark:border-gray-700">
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">📝 Observaciones</p>
                                        <p className="text-sm text-gray-700 dark:text-gray-300 italic bg-gray-50 dark:bg-gray-800 p-3 rounded">
                                            {devolucion.observaciones}
                                        </p>
                                    </div>
                                )}

                                {/* Resumen Visual */}
                                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                            <p className="text-xs text-green-600 dark:text-green-400 font-semibold">BUENAS</p>
                                            <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                                                {calcularTotalCantidadesDevuelta(devolucion)}
                                            </p>
                                        </div>
                                        <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                                            <p className="text-xs text-orange-600 dark:text-orange-400 font-semibold">DAÑADAS</p>
                                            <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                                                {calcularTotalCantidadesDañada(devolucion)}
                                            </p>
                                        </div>
                                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                            <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">A COBRAR</p>
                                            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                                                Bs {Number(devolucion.monto_cobrado_daño_total).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Modal de detalles de devolución */}
                <Dialog open={mostrarModalDetalles} onOpenChange={setMostrarModalDetalles}>
                    <DialogContent
                        style={{ width: '90vw', maxWidth: '90vw' }}
                        className="max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 p-0"
                    >
                        <DialogHeader className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                            <DialogTitle>Detalles de Devolución al Proveedor</DialogTitle>
                            <DialogDescription>
                                Fecha: {devolucionSeleccionada && new Date(devolucionSeleccionada.fecha_devolucion).toLocaleDateString('es-ES')}
                            </DialogDescription>
                            {devolucionSeleccionada && (
                                <DialogDescription>
                                    <div>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">💰 Monto a Cobrar por Daño</p>
                                        <p className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400">
                                            Bs {Number(devolucionSeleccionada.monto_cobrado_daño_total).toFixed(2)}
                                        </p>
                                    </div>
                                </DialogDescription>
                            )}
                        </DialogHeader>

                        {devolucionSeleccionada && (
                            <div className="overflow-y-auto flex-1 px-6 py-4 space-y-6">
                                {/* Tabla de detalles */}
                                <div>
                                    <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">Prestables Devueltos</h4>
                                    <div className="border rounded-lg overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-gray-100 dark:bg-gray-800">
                                                    <TableHead className="text-left min-w-[200px]">Prestable</TableHead>
                                                    <TableHead className="text-center min-w-[80px]">Buenas</TableHead>
                                                    <TableHead className="text-center min-w-[80px]">Daño Parcial</TableHead>
                                                    <TableHead className="text-center min-w-[80px]">Daño Total</TableHead>
                                                    <TableHead className="text-center min-w-[120px]">Total Devuelto</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {devolucionSeleccionada.detalles.map((detalle: DevolucionProveedorDetalle) => (
                                                    <TableRow key={detalle.id}>
                                                        <TableCell className="font-medium">
                                                            {detalle.detallePrestamoProveedor?.prestable?.nombre || 'Prestable desconocido'}
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                                Tipo: {detalle.detallePrestamoProveedor?.prestable?.tipo || 'N/D'}
                                                            </p>
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <span className="inline-block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded text-sm font-semibold">
                                                                {detalle.cantidad_devuelta}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <span className="inline-block bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-2 py-1 rounded text-sm font-semibold">
                                                                {detalle.cantidad_dañada_parcial}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <span className="inline-block bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded text-sm font-semibold">
                                                                {detalle.cantidad_dañada_total}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="text-center font-semibold">
                                                            {detalle.cantidad_devuelta + detalle.cantidad_dañada_parcial + detalle.cantidad_dañada_total}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                                

                                {/* Resumen de montos */}
                                {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                    <div>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">💎 Garantía Devuelta</p>
                                        <p className="text-lg sm:text-xl font-bold text-green-600 dark:text-green-400">
                                            Bs {Number(devolucionSeleccionada.monto_garantia_devuelta_total).toFixed(2)}
                                        </p>
                                    </div>
                                </div> */}

                                {/* Observaciones */}
                                {devolucionSeleccionada.observaciones && (
                                    <div className="border-t pt-4">
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">📝 Observaciones</p>
                                        <p className="text-sm text-gray-700 dark:text-gray-300 italic bg-gray-50 dark:bg-gray-800 p-3 rounded break-words">
                                            {devolucionSeleccionada.observaciones}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Footer con botón - sticky */}
                        {/* <div className="flex justify-end gap-2 p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 bg-white dark:bg-gray-950">
                            <Button
                                onClick={() => setMostrarModalDetalles(false)}
                                variant="outline"
                            >
                                Cerrar
                            </Button>
                        </div> */}
                    </DialogContent>
                </Dialog>

                {/* Modal de selección de formato de impresión */}
                <OutputSelectionModal
                    isOpen={mostrarModalImpresion}
                    onClose={() => setMostrarModalImpresion(false)}
                    documentoId={prestamoId}
                    tipoDocumento="devoluciones-proveedor"
                    documentoInfo={{
                        numero: `#${prestamo?.id}`,
                        fecha: prestamo?.fecha_prestamo ? new Date(prestamo.fecha_prestamo).toLocaleDateString('es-ES') : undefined,
                    }}
                />

                {/* Toast Container */}
                <ToastContainer
                    toasts={toasts}
                    onClose={removeToast}
                />
            </div>
        </AppLayout>
    );
}
