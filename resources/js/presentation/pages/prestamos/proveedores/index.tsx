import React, { useEffect, useState } from 'react';
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
import prestamoProveedorService from '@/infrastructure/services/prestamo-proveedor.service';
import type { PrestamoProveedor, EstadoPrestamo } from '@/domain/entities/prestamos';
import { Plus, RotateCcw, Printer, Eye, Edit, X, History, MoreHorizontal } from 'lucide-react';
import { OutputSelectionModal } from '@/presentation/components/impresion/OutputSelectionModal';
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
        const precios = Array.isArray(prestable.precios) ? prestable.precios as Array<Record<string, unknown>> : [];
        const condiciones = Array.isArray(prestable.condiciones) ? prestable.condiciones as Array<Record<string, unknown>> : [];

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

    const calcularMontoDaniosTotal = (detallesDevolucion: Array<{
        prestamo_proveedor_detalle_id: number;
        cantidad_devuelta: number;
        cantidad_dañada_parcial: number;
        cantidad_dañada_total: number;
    }>): number => {
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

            return sum + (precioDanio * cantidadDanada);
        }, 0);

        return Number(total.toFixed(2));
    };

    const agregarDetalleADevolucion = (detalleId: number) => {
        const yaExiste = devolucionData.detalles.find(d => d.prestamo_proveedor_detalle_id === detalleId);
        if (!yaExiste) {
            setDevolucionData({
                ...devolucionData,
                detalles: [...devolucionData.detalles, {
                    prestamo_proveedor_detalle_id: detalleId,
                    cantidad_devuelta: 0,
                    cantidad_dañada_parcial: 0,
                    cantidad_dañada_total: 0,
                }],
            });
        }
    };

    const actualizarDetalleDevolucion = (detalleId: number, campo: string, valor: number) => {
        const nuevosDetalles = devolucionData.detalles.map(d =>
            d.prestamo_proveedor_detalle_id === detalleId
                ? { ...d, [campo]: valor }
                : d
        );

        setDevolucionData({
            ...devolucionData,
            detalles: nuevosDetalles,
            monto_cobrado_daño_total: calcularMontoDaniosTotal(nuevosDetalles),
        });
    };

    useEffect(() => {
        fetchPrestamos();
    }, []);

    const fetchPrestamos = async () => {
        try {
            const response = await prestamoProveedorService.getAll({ per_page: 50 });
            setPrestamos((response as any).data || []);
        } finally {
            setLoading(false);
        }
    };

    const handleRegistrarDevolucion = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPrestamo || devolucionData.detalles.length === 0) return;

        try {
            await prestamoProveedorService.registrarDevolucion(
                selectedPrestamo.id,
                devolucionData
            );
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
            const mensajeError = error?.response?.data?.message ||
                                error?.message ||
                                'Error registrando devolución';
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
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[estado as string] || styles.ACTIVO}`}>
                {(estado as string).replace(/_/g, ' ')}
            </span>
        );
    };

    return (
        <AppLayout>
            <Head title="Préstamos a Proveedores" />
            <div className="p-8 bg-white dark:bg-gray-950 min-h-screen">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">🤝 Préstamos a Proveedores</h1>
                    <div className="flex gap-3">
                        <a href="/prestamos/proveedores/prestamos/crear">
                            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                                <Plus size={20} />
                                Nuevo Préstamo
                            </Button>
                        </a>
                        {/* <a href="/prestamos/proveedores/compras/crear">
                            <Button className="gap-2 bg-green-600 hover:bg-green-700">
                                <Plus size={20} />
                                Nueva Compra
                            </Button>
                        </a> */}
                    </div>
                </div>

                {/* Modal de Devolución Flotante - Tabla Editable */}
                {selectedPrestamo && (() => {
                    const prestabesNombres = selectedPrestamo.detalles?.map((d: any) => d.prestable?.nombre).join(', ') || 'N/D';


                    return (
                    <Dialog open={showDevolucionModal} onOpenChange={setShowDevolucionModal}>
                        <DialogContent
                            style={{ width: '90vw', maxWidth: '90vw' }}
                            className="max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 p-2"
                        >
                            <DialogHeader>
                                <DialogTitle>Registrar Devolución</DialogTitle>
                                <DialogDescription>
                                    {prestabesNombres} - {selectedPrestamo.proveedor?.nombre || selectedPrestamo.proveedor?.razon_social}
                                </DialogDescription>
                            </DialogHeader>

                            <form onSubmit={handleRegistrarDevolucion} className="space-y-4">
                            {/* Tabla Editable de Devoluciones */}
                            <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600">
                                            <th className="px-3 py-2 text-left font-semibold text-gray-900 dark:text-white">📦 Prestable</th>
                                            <th className="px-3 py-2 text-center font-semibold text-gray-900 dark:text-white">📤 Prestado</th>
                                            <th className="px-3 py-2 text-center font-semibold text-gray-900 dark:text-white">📥 Devuelto</th>
                                            <th className="px-3 py-2 text-center font-semibold text-gray-900 dark:text-white">⏳ Faltante</th>
                                            <th className="px-3 py-2 text-center font-semibold text-gray-900 dark:text-white">💲 P. Daño</th>
                                            <th className="px-3 py-2 text-center font-semibold text-gray-900 dark:text-white">✏️ Devolviendo</th>
                                            {/* <th className="px-3 py-2 text-center font-semibold text-gray-900 dark:text-white">🔴 D.Parcial</th> */}
                                            <th className="px-3 py-2 text-center font-semibold text-gray-900 dark:text-white">⚫ D.Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(() => {
                                            console.log('=== MODAL DEVOLUCIÓN ABIERTO ===');
                                            console.log('TODOS LOS DETALLES:', selectedPrestamo.detalles);
                                            console.log('devolucionData (estado actual):', devolucionData);
                                            selectedPrestamo.detalles?.forEach((d: any, idx: number) => {
                                                console.log(`Detalle ${idx}:`, d.prestable?.nombre, '| tipo:', d.prestable?.tipo, '| devolucion_detalles:', d.devolucion_detalles);
                                            });

                                            const detalleCanastilla = selectedPrestamo.detalles?.find((d: any) => d.prestable?.tipo === 'CANASTILLA');
                                            const detalleEmbase = selectedPrestamo.detalles?.find((d: any) => d.prestable?.tipo === 'EMBASES');
                                            const capacidadCanastillaGlobal = detalleCanastilla?.prestable?.capacidad || 0;
                                            console.log('detalleCanastilla:', detalleCanastilla);
                                            console.log('detalleEmbase:', detalleEmbase);
                                            console.log('capacidadCanastillaGlobal:', capacidadCanastillaGlobal);

                                            return selectedPrestamo.detalles?.map((detalle: any) => {
                                                const cantidadYaDevuelta = (detalle.devolucion_detalles || detalle.devolucionDetalles)?.reduce((sum: number, d: any) =>
                                                    sum + (d.cantidad_devuelta + d.cantidad_dañada_parcial + d.cantidad_dañada_total), 0) || 0;
                                                const cantidadFaltante = detalle.cantidad_prestada - cantidadYaDevuelta;
                                                const precioDanio = obtenerPrecioDanioPrestable(detalle);
                                                const detalleAct = devolucionData.detalles.find(d => d.prestamo_proveedor_detalle_id === detalle.id);

                                                console.log(`📊 ${detalle.prestable?.nombre}: Prestado=${detalle.cantidad_prestada}, YaDevuelto=${cantidadYaDevuelta}, Faltante=${cantidadFaltante}`);

                                                // Lógica para auto-calcular embases si es canastilla
                                                const esCanastilla = detalle.prestable?.tipo === 'CANASTILLA';
                                                const detalleEmbaseAct = detalleEmbase ? devolucionData.detalles.find(d => d.prestamo_proveedor_detalle_id === detalleEmbase.id) : null;

                                                const handleCantidadCanastilla = (cantidad: number) => {
                                                    console.log('handleCantidadCanastilla llamado con:', cantidad);
                                                    console.log('esCanastilla:', esCanastilla);
                                                    console.log('detalleEmbase:', detalleEmbase);
                                                    console.log('capacidadCanastillaGlobal:', capacidadCanastillaGlobal);

                                                    const nuevosDetalles = [...devolucionData.detalles];
                                                    const indexCanastilla = nuevosDetalles.findIndex(d => d.prestamo_proveedor_detalle_id === detalle.id);

                                                    // Agregar o actualizar canastilla
                                                    if (indexCanastilla >= 0) {
                                                        nuevosDetalles[indexCanastilla].cantidad_devuelta = cantidad;
                                                    } else {
                                                        nuevosDetalles.push({
                                                            prestamo_proveedor_detalle_id: detalle.id,
                                                            cantidad_devuelta: cantidad,
                                                            cantidad_dañada_parcial: 0,
                                                            cantidad_dañada_total: 0,
                                                        });
                                                    }

                                                    // Auto-calcular embases
                                                    if (esCanastilla && detalleEmbase) {
                                                        const embasesCalculados = cantidad * capacidadCanastillaGlobal;
                                                        console.log('embasesCalculados:', embasesCalculados);
                                                        const indexEmbase = nuevosDetalles.findIndex(d => d.prestamo_proveedor_detalle_id === detalleEmbase.id);
                                                        console.log('indexEmbase:', indexEmbase);

                                                        if (indexEmbase >= 0) {
                                                            nuevosDetalles[indexEmbase].cantidad_devuelta = embasesCalculados;
                                                        } else if (embasesCalculados > 0) {
                                                            nuevosDetalles.push({
                                                                prestamo_proveedor_detalle_id: detalleEmbase.id,
                                                                cantidad_devuelta: embasesCalculados,
                                                                cantidad_dañada_parcial: 0,
                                                                cantidad_dañada_total: 0,
                                                            });
                                                        }
                                                        console.log('nuevosDetalles después:', nuevosDetalles);
                                                    }

                                                    setDevolucionData({
                                                        ...devolucionData,
                                                        detalles: nuevosDetalles,
                                                        monto_cobrado_daño_total: calcularMontoDaniosTotal(nuevosDetalles),
                                                    });
                                                };

                                            return (
                                                <tr key={detalle.id} className={`border-b border-gray-200 dark:border-gray-700 ${cantidadFaltante > 0 ? 'hover:bg-gray-50 dark:hover:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900 opacity-60'}`}>
                                                    <td className="px-3 py-2 text-gray-900 dark:text-white font-medium">{detalle.prestable?.nombre}</td>
                                                    <td className="px-3 py-2 text-center text-gray-700 dark:text-gray-300">{detalle.cantidad_prestada}</td>
                                                    <td className="px-3 py-2 text-center text-green-600 dark:text-green-400 font-bold">{cantidadYaDevuelta}</td>
                                                    <td className="px-3 py-2 text-center text-orange-600 dark:text-orange-400 font-bold">{cantidadFaltante}</td>
                                                    <td className="px-3 py-2 text-center text-gray-900 dark:text-white font-semibold">Bs {precioDanio.toFixed(2)}</td>
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
                                                                    if (esCanastilla) {
                                                                        handleCantidadCanastilla(cantidad);
                                                                    } else {
                                                                        if (!detalleAct && cantidad > 0) {
                                                                            agregarDetalleADevolucion(detalle.id);
                                                                        }
                                                                        actualizarDetalleDevolucion(detalle.id, 'cantidad_devuelta', cantidad);
                                                                    }
                                                                }}
                                                                className="w-full px-2 py-1 border border-blue-400 dark:border-blue-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center font-bold focus:ring-2 focus:ring-blue-500"
                                                            />
                                                        ) : (
                                                            <span className="text-gray-400">-</span>
                                                        )}
                                                    </td>
                                                    {/* <td className="px-3 py-2 text-center">
                                                        {detalleAct || (detalle.prestable?.tipo === 'EMBASE' && detalleEmbaseAct) ? (
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                max={detalleAct?.cantidad_devuelta || 0}
                                                                value={detalleAct?.cantidad_dañada_parcial || 0}
                                                                onFocus={() => {
                                                                    if (!detalleAct) {
                                                                        agregarDetalleADevolucion(detalle.id);
                                                                    }
                                                                }}
                                                                onChange={(e) => actualizarDetalleDevolucion(detalle.id, 'cantidad_dañada_parcial', Number(e.target.value))}
                                                                className="w-full px-2 py-1 border border-yellow-400 dark:border-yellow-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center focus:ring-2 focus:ring-yellow-500"
                                                            />
                                                        ) : (
                                                            <span className="text-gray-400">-</span>
                                                        )}
                                                    </td> */}
                                                    <td className="px-3 py-2 text-center">
                                                        {detalleAct || (detalle.prestable?.tipo === 'EMBASE' && detalleEmbaseAct) ? (
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                max={detalleAct?.cantidad_devuelta || 0}
                                                                value={detalleAct?.cantidad_dañada_total || 0}
                                                                onFocus={() => {
                                                                    if (!detalleAct) {
                                                                        agregarDetalleADevolucion(detalle.id);
                                                                    }
                                                                }}
                                                                onChange={(e) => actualizarDetalleDevolucion(detalle.id, 'cantidad_dañada_total', Number(e.target.value))}
                                                                className="w-full px-2 py-1 border border-red-400 dark:border-red-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-center focus:ring-2 focus:ring-red-500"
                                                            />
                                                        ) : (
                                                            <span className="text-gray-400">-</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        });
                                        })()}
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
                                <TableHeader className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                    <TableRow className="border-gray-200 dark:border-gray-700">
                                        <TableHead className="text-gray-900 dark:text-gray-100 w-16">Folio</TableHead>
                                        <TableHead className="text-gray-900 dark:text-gray-100">Proveedor</TableHead>
                                        <TableHead className="text-right text-gray-900 dark:text-gray-100">Total</TableHead>
                                        <TableHead className="text-right text-gray-900 dark:text-gray-100">Devueltas</TableHead>
                                        <TableHead className="text-right text-gray-900 dark:text-gray-100">Pendientes</TableHead>
                                        <TableHead className="text-gray-900 dark:text-gray-100">Garantía</TableHead>
                                        <TableHead className="text-gray-900 dark:text-gray-100">Fecha Préstamo</TableHead>
                                        <TableHead className="text-gray-900 dark:text-gray-100">Plazo</TableHead>
                                        <TableHead className="text-gray-900 dark:text-gray-100">Estado</TableHead>
                                        <TableHead className="text-right text-gray-900 dark:text-gray-100">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {prestamos.map((p) => {
                                        const cantidadTotal = p.detalles?.reduce((sum: number, d: unknown) => {
                                            const detalle = d as Record<string, unknown>;
                                            const cantidadPrestada = Number(detalle.cantidad_prestada || 0);
                                            return sum + cantidadPrestada;
                                        }, 0) || 0;
                                        const cantidadDevuelta = p.detalles?.reduce((sum: number, d: unknown) => {
                                            const detalle = d as Record<string, unknown>;
                                            const devoluciones = (detalle.devolucion_detalles || detalle.devolucionDetalles || []) as unknown[];
                                            const devueltoDetalle = devoluciones.reduce((subtotal: number, dev: unknown) => {
                                                const detalleDev = dev as Record<string, number | undefined>;
                                                return subtotal +
                                                    (detalleDev.cantidad_devuelta || 0) +
                                                    (detalleDev.cantidad_dañada_parcial || 0) +
                                                    (detalleDev.cantidad_dañada_total || 0);
                                            }, 0);

                                            return sum + devueltoDetalle;
                                        }, 0) || 0;
                                        const cantidadPendiente = Math.max(0, cantidadTotal - cantidadDevuelta);

                                        return (
                                            <TableRow key={p.id} className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                                                <TableCell className="text-gray-900 dark:text-gray-100 font-semibold">#{p.id}</TableCell>
                                                <TableCell className="text-gray-900 dark:text-gray-100">{p.proveedor?.nombre || p.proveedor?.razon_social}</TableCell>
                                                <TableCell className="text-right text-gray-900 dark:text-gray-100 font-semibold">{cantidadTotal}</TableCell>
                                                <TableCell className="text-right text-green-700 dark:text-green-400 font-semibold">{cantidadDevuelta}</TableCell>
                                                <TableCell className="text-right text-orange-700 dark:text-orange-400 font-semibold">{cantidadPendiente}</TableCell>
                                                <TableCell className="text-gray-900 dark:text-gray-100">Bs {p.monto_garantia}</TableCell>
                                                <TableCell className="text-gray-900 dark:text-gray-100">
                                                    {new Date(p.fecha_prestamo).toLocaleDateString('es-ES')}
                                                </TableCell>
                                                <TableCell className="text-gray-900 dark:text-gray-100">
                                                    {p.fecha_esperada_devolucion
                                                        ? new Date(p.fecha_esperada_devolucion).toLocaleDateString('es-ES')
                                                        : 'S/P'}
                                                </TableCell>
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
                                                            <DropdownMenuItem onSelect={() => {
                                                                setSelectedPrestamoDetalles(p);
                                                                setShowDetallesModal(true);
                                                            }}>
                                                                <Eye size={16} />
                                                                Ver detalles
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild>
                                                                <a href={`/prestamos/proveedores/${p.id}/devoluciones`}>
                                                                    <History size={16} />
                                                                    Ver historial de devoluciones
                                                                </a>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onSelect={() => {
                                                                setSelectedPrestamoForPrint(p);
                                                                setShowOutputModal(true);
                                                            }}>
                                                                <Printer size={16} />
                                                                Imprimir
                                                            </DropdownMenuItem>
                                                            {['ACTIVO', 'PARCIALMENTE_DEVUELTO'].includes((p.estado || '').trim()) && (
                                                                <DropdownMenuItem onSelect={async () => {
                                                                    try {
                                                                        const response = await fetch(`/api/prestamos-proveedor/${p.id}`);
                                                                        const result = await response.json();
                                                                        if (result.success) {
                                                                            setSelectedPrestamo(result.data);
                                                                            setShowDevolucionModal(true);
                                                                        }
                                                                    } catch (error) {
                                                                        console.error('Error cargando préstamo:', error);
                                                                        setSelectedPrestamo(p);
                                                                        setShowDevolucionModal(true);
                                                                    }
                                                                }}>
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
                </Card>

                {/* Modal de Edición del Préstamo */}
                {selectedPrestamoEdit && (
                    <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                        <DialogContent className="max-w-sm w-full">
                            <DialogHeader>
                                <DialogTitle>Editar Préstamo #{selectedPrestamoEdit.id}</DialogTitle>
                                <DialogDescription>
                                    {selectedPrestamoEdit.proveedor?.nombre || selectedPrestamoEdit.proveedor?.razon_social}
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
                                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-3">Prestables</h3>
                                        <div className="space-y-2">
                                            {selectedPrestamoDetalles.detalles.map((detalle: any, idx: number) => (
                                                <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                                {detalle.prestable?.nombre || 'Prestable'}
                                                            </p>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                                Cantidad: <span className="font-semibold text-gray-900 dark:text-white">{detalle.cantidad_prestada}</span>
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                                detalle.estado === 'ACTIVO'
                                                                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                                                                    : detalle.estado === 'COMPLETAMENTE_DEVUELTO'
                                                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                                                                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                                                            }`}>
                                                                {detalle.estado.replace(/_/g, ' ')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {(() => {
                                                        const devoluciones = detalle.devoluciones || detalle.devolucion_detalles || detalle.devolucionDetalles || [];
                                                        const totalDevuelto = devoluciones.reduce((sum: number, dev: any) => sum + (Number(dev.cantidad_devuelta) || 0), 0);
                                                        const totalDaniado = devoluciones.reduce((sum: number, dev: any) => {
                                                            return sum + (Number(dev.cantidad_dañada_parcial) || 0) + (Number(dev.cantidad_dañada_total) || 0);
                                                        }, 0);
                                                        const pendiente = Math.max(0, Number(detalle.cantidad_prestada || 0) - totalDevuelto);

                                                        return (
                                                            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                                                                <div className="rounded-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-2">
                                                                    <p className="text-gray-500 dark:text-gray-400 text-xs">Devuelto</p>
                                                                    <p className="font-semibold text-green-700 dark:text-green-400">{totalDevuelto}</p>
                                                                </div>
                                                                <div className="rounded-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-2">
                                                                    <p className="text-gray-500 dark:text-gray-400 text-xs">Dañado total</p>
                                                                    <p className="font-semibold text-red-700 dark:text-red-400">{totalDaniado}</p>
                                                                </div>
                                                                <div className="rounded-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-2">
                                                                    <p className="text-gray-500 dark:text-gray-400 text-xs">Pendiente</p>
                                                                    <p className="font-semibold text-orange-700 dark:text-orange-400">{pendiente}</p>
                                                                </div>
                                                            </div>
                                                        );
                                                    })()}
                                                    {(detalle.devoluciones || detalle.devolucion_detalles || detalle.devolucionDetalles) && (detalle.devoluciones || detalle.devolucion_detalles || detalle.devolucionDetalles).length > 0 && (
                                                        <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                                                            {(detalle.devoluciones || detalle.devolucion_detalles || detalle.devolucionDetalles).map((dev: any, devIdx: number) => (
                                                                <div key={devIdx} className="mt-1 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 py-1">
                                                                    <p>
                                                                        Devolución {devIdx + 1}: {Number(dev.cantidad_devuelta) || 0} devueltas
                                                                        {(() => {
                                                                            const totalDaniado = (Number(dev.cantidad_dañada_parcial) || 0) + (Number(dev.cantidad_dañada_total) || 0);
                                                                            return totalDaniado > 0 ? ` | Dañado: ${totalDaniado}` : '';
                                                                        })()}
                                                                        {' '}- {new Date(dev.fecha_devolucion).toLocaleDateString('es-ES')}
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
                        <DialogContent className="max-w-sm w-full">
                            <DialogHeader>
                                <DialogTitle className="text-red-600 dark:text-red-400">Anular Préstamo #{selectedPrestamoAnular.id}</DialogTitle>
                                <DialogDescription>
                                    {selectedPrestamoAnular.proveedor?.nombre || selectedPrestamoAnular.proveedor?.razon_social}
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
                                        placeholder="Ej: Proveedor cambió de política, error administrativo, etc."
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
            </div>
        </AppLayout>
    );
}
