import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog';
import { Button } from '@/presentation/components/ui/button';
import React, { useEffect } from 'react';

export type TipoPrestamoDevolucion = 'cliente' | 'proveedor' | 'evento';

interface DevolucionDetalle {
    [key: string]: any;
    cantidad_devuelta?: number;
    cantidad_dañada_total?: number;
}

interface DevolucionData {
    fecha_devolucion: string;
    monto_cobrado_daño_total: number;
    observaciones: string;
    detalles: DevolucionDetalle[];
}

interface DevolucionModalProps {
    isOpen: boolean;
    onClose: () => void;
    prestamo: any;
    tipoPrestamo: TipoPrestamoDevolucion;
    devolucionData: DevolucionData;
    setDevolucionData: (data: DevolucionData) => void;
    onRegistrarDevolucion: (e: React.FormEvent) => void;
    obtenerMontoDanioTotal: (detalle: any) => number;
    obtenerMontoGarantia?: (detalle: any) => number;
    isSubmitting?: boolean;
    detalleIdField?: string; // Campo ID según el tipo de préstamo
    detallesField?: string; // Campo de detalles en el préstamo
}

export function DevolucionModal({
    isOpen,
    onClose,
    prestamo,
    tipoPrestamo,
    devolucionData,
    setDevolucionData,
    onRegistrarDevolucion,
    obtenerMontoDanioTotal,
    obtenerMontoGarantia,
    isSubmitting = false,
    detalleIdField = 'prestamo_cliente_detalle_id',
    detallesField = 'detalles',
}: DevolucionModalProps) {
    const detalles = prestamo?.[detallesField] || [];

    // Calcular monto total de daños cuando cambian los detalles
    useEffect(() => {
        const montoTotalDanios = devolucionData.detalles.reduce((sum, det) => {
            const detallePrestamo = detalles.find((d: any) => d.id === det[detalleIdField]);
            const montoDanioUnitario = obtenerMontoDanioTotal(detallePrestamo);
            return sum + (Number(det.cantidad_dañada_total || 0) * montoDanioUnitario);
        }, 0);

        if (Number(devolucionData.monto_cobrado_daño_total) !== Number(montoTotalDanios)) {
            setDevolucionData(prev => ({
                ...prev,
                monto_cobrado_daño_total: Number(montoTotalDanios.toFixed(2)),
            }));
        }
    }, [devolucionData.detalles, devolucionData.monto_cobrado_daño_total, detalles]);

    const handleCambiarCantidad = (detalleId: number, cantidad: number, detallePrestamo: any) => {
        const detailExists = devolucionData.detalles.some(d => d[detalleIdField] === detalleId);

        // Si es canastilla, auto-calcular embases (solo para clientes)
        let detallesActualizados = devolucionData.detalles;
        if (tipoPrestamo === 'cliente' && detallePrestamo.prestable?.tipo === 'CANASTILLA') {
            const capacidad = detallePrestamo.prestable?.capacidad || 0;
            const cantidadEmbases = cantidad * capacidad;
            const detalleEmbases = detalles.find((d: any) => d.prestable?.tipo === 'EMBASE' || d.prestable?.tipo === 'EMBASES');

            if (detalleEmbases) {
                const embasesExiste = devolucionData.detalles.some(d => d[detalleIdField] === detalleEmbases.id);
                if (embasesExiste) {
                    detallesActualizados = detallesActualizados.map(d =>
                        d[detalleIdField] === detalleEmbases.id
                            ? { ...d, cantidad_devuelta: cantidadEmbases }
                            : d
                    );
                } else if (cantidadEmbases > 0) {
                    detallesActualizados = [...detallesActualizados, {
                        [detalleIdField]: Number(detalleEmbases.id),
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
                    d[detalleIdField] === detalleId
                        ? { ...d, cantidad_devuelta: cantidad }
                        : d
                )
                : [...detallesActualizados, {
                    [detalleIdField]: detalleId,
                    cantidad_devuelta: cantidad,
                    cantidad_dañada_total: 0,
                }],
        });
    };

    const getDescripcionDetalle = (detalles: any[]) => {
        return detalles
            .map((d: any) => d.prestable?.nombre)
            .filter(Boolean)
            .join(', ') || 'N/D';
    };

    const getClienteNombre = () => {
        if (tipoPrestamo === 'cliente') {
            return prestamo?.cliente?.nombre || prestamo?.cliente?.razon_social;
        } else if (tipoPrestamo === 'proveedor') {
            return prestamo?.proveedor?.nombre || prestamo?.proveedor?.razon_social;
        } else if (tipoPrestamo === 'evento') {
            return prestamo?.nombre_evento;
        }
        return '';
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                style={{ width: '90vw', maxWidth: '90vw' }}
                className="max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 p-2"
            >
                <DialogHeader>
                    <DialogTitle>Registrar Devolución</DialogTitle>
                    <DialogDescription>
                        {getDescripcionDetalle(detalles)} - {getClienteNombre()}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={onRegistrarDevolucion} className="space-y-4">
                    {/* Garantía */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="p-3 rounded-lg border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20">
                            <p className="text-xs text-emerald-700 dark:text-emerald-300">Garantía del préstamo</p>
                            <p className="text-lg font-bold text-emerald-800 dark:text-emerald-200">
                                Bs {Number(prestamo?.monto_garantia || 0).toFixed(2)}
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
                                    <th className="px-3 py-2 text-center font-semibold text-gray-900 dark:text-white">💸 Daño unit.</th>
                                    <th className="px-3 py-2 text-center font-semibold text-gray-900 dark:text-white">🧮 Subtotal daño</th>
                                </tr>
                            </thead>
                            <tbody>
                                {detalles.map((detalle: any) => {
                                    const cantidadYaDevuelta = (detalle.devolucion_detalles || detalle.devolucionDetalles)?.reduce((sum: number, d: any) =>
                                        sum + (d.cantidad_devuelta + d.cantidad_dañada_parcial + d.cantidad_dañada_total), 0) || 0;
                                    const cantidadFaltante = detalle.cantidad - cantidadYaDevuelta;
                                    const detalleAct = devolucionData.detalles.find(d => d[detalleIdField] === detalle.id);
                                    const montoDanioUnitario = obtenerMontoDanioTotal(detalle);
                                    const montoDanioFila = Number(detalleAct?.cantidad_dañada_total || 0) * montoDanioUnitario;

                                    return (
                                        <tr key={detalle.id} className={`border-b border-gray-200 dark:border-gray-700 ${cantidadFaltante > 0 ? 'hover:bg-gray-50 dark:hover:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900 opacity-60'}`}>
                                            <td className="px-3 py-2 text-gray-900 dark:text-white font-medium">{detalle.prestable?.nombre}</td>
                                            <td className="px-3 py-2 text-center text-gray-700 dark:text-gray-300">{detalle.cantidad}</td>
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
                                                            handleCambiarCantidad(detalle.id, cantidad, detalle);
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
                                                                    d[detalleIdField] === detalle.id
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
                        <Button type="submit" className="flex-1" disabled={devolucionData.detalles.length === 0 || isSubmitting}>
                            {isSubmitting ? 'Registrando...' : 'Registrar Devolución'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={() => {
                                onClose();
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
}
