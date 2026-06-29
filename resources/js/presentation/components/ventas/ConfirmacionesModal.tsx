import { formatCurrencyWith2Decimals } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog';
import { Package, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';

interface ConfirmacionesModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    confirmaciones?: any[];
    venta: any;
    onConfirmacionDeleted?: () => void;
}

export function ConfirmacionesModal({ open, onOpenChange, confirmaciones = [], venta, onConfirmacionDeleted }: ConfirmacionesModalProps) {
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

    const handleDelete = async (confirmacionId: number) => {
        setDeletingId(confirmacionId);
        try {
            const response = await fetch(`/ventas/${venta.id}/confirmaciones/${confirmacionId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                    Accept: 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Error al eliminar la confirmación');
            }

            toast.success('Confirmación eliminada exitosamente');
            setConfirmDeleteId(null);
            onConfirmacionDeleted?.();
        } catch (error) {
            toast.error('Error al eliminar la confirmación');
            console.error(error);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[85vh] !w-[95vw] !max-w-[95vw] overflow-y-auto sm:!max-w-[95vw]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-cyan-600" />
                        Confirmaciones de Entrega
                    </DialogTitle>
                    <DialogDescription>Total de {confirmaciones?.length || 0} confirmación(es)</DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {confirmaciones && confirmaciones.length > 0 ? (
                        confirmaciones.map((confirmacion: any, idx: number) => (
                            <div key={confirmacion.id} className="space-y-4 rounded-lg border border-gray-200 p-4 dark:border-zinc-700">
                                {/* Encabezado de la confirmación */}
                                <div className="flex items-center justify-between border-b border-gray-200 pb-4 dark:border-zinc-700">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Confirmación #{confirmacion.id}</h3>
                                        {confirmacion.confirmado_en && (
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {new Date(confirmacion.confirmado_en).toLocaleDateString('es-ES', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </p>
                                        )}
                                        {confirmacion.confirmado_por && (
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Confirmado por: <span className="font-semibold">{confirmacion.confirmado_por.name}</span>
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between gap-3">
                                        {/* Estados (badges) */}
                                        <div className="flex flex-wrap items-center gap-2">
                                            <div
                                                className={`rounded-full px-3 py-1 text-sm font-semibold ${
                                                    confirmacion.tipo_entrega === 'COMPLETA'
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                                        : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
                                                }`}
                                            >
                                                {confirmacion.tipo_entrega === 'COMPLETA' ? '✅ Completa' : '⚠️ Con Novedad'}
                                            </div>
                                            <div
                                                className={`rounded-full px-3 py-1 text-sm font-semibold ${
                                                    confirmacion.tipo_confirmacion === 'COMPLETA'
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                                        : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
                                                }`}
                                            >
                                                {confirmacion.tipo_confirmacion}
                                            </div>
                                        </div>

                                        {/* Botón Eliminar */}
                                        {confirmDeleteId === confirmacion.id ? (
                                            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-2 dark:border-red-800 dark:bg-red-900/20">
                                                <p className="whitespace-nowrap text-xs font-medium text-red-700 dark:text-red-300">¿Eliminar?</p>
                                                <button
                                                    onClick={() => handleDelete(confirmacion.id)}
                                                    disabled={deletingId === confirmacion.id}
                                                    className="rounded bg-red-600 px-2 py-1 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                                                >
                                                    {deletingId === confirmacion.id ? '...' : 'Sí'}
                                                </button>
                                                <button
                                                    onClick={() => setConfirmDeleteId(null)}
                                                    disabled={deletingId === confirmacion.id}
                                                    className="rounded bg-gray-200 px-2 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-300 disabled:opacity-50 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                                                >
                                                    No
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setConfirmDeleteId(confirmacion.id)}
                                                className="flex items-center gap-1 whitespace-nowrap rounded bg-red-100 px-3 py-1 text-xs font-semibold text-red-600 transition-colors hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                                Eliminar
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Información de Pago */}
                                {(confirmacion.tipo_confirmacion === 'COMPLETA' || confirmacion.tipo_confirmacion === 'DEVOLUCION_PARCIAL') &&
                                    (confirmacion.estado_pago || confirmacion.total_dinero_recibido) && (
                                        <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                                            <h4 className="mb-3 font-semibold text-green-900 dark:text-green-200">💰 Información de Pago</h4>
                                            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                                                {confirmacion.estado_pago && (
                                                    <div>
                                                        <p className="text-xs font-medium text-green-700 uppercase dark:text-green-300">Estado</p>
                                                        <p className="text-sm font-bold text-green-900 dark:text-green-100">
                                                            {confirmacion.estado_pago === 'PAGADO' && '✅ Pagado'}
                                                            {confirmacion.estado_pago === 'PARCIAL' && '⚠️ Parcial'}
                                                            {confirmacion.estado_pago === 'CREDITO' && '💳 Crédito'}
                                                            {confirmacion.estado_pago === 'NO_PAGADO' && '❌ No Pagado'}
                                                        </p>
                                                    </div>
                                                )}
                                                {confirmacion.total_dinero_recibido && (
                                                    <div>
                                                        <p className="text-xs font-medium text-green-700 uppercase dark:text-green-300">Recibido</p>
                                                        <p className="text-sm font-bold text-green-900 dark:text-green-100">
                                                            {formatCurrencyWith2Decimals(
                                                                confirmacion.total_dinero_recibido || 0,
                                                                venta.moneda?.codigo || 'USD',
                                                            )}
                                                        </p>
                                                    </div>
                                                )}
                                                {confirmacion.monto_pendiente && (
                                                    <div>
                                                        <p className="text-xs font-medium text-green-700 uppercase dark:text-green-300">Pendiente</p>
                                                        <p className="text-sm font-bold text-green-900 dark:text-green-100">
                                                            {formatCurrencyWith2Decimals(
                                                                confirmacion.monto_pendiente || 0,
                                                                venta.moneda?.codigo || 'USD',
                                                            )}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                {/* Desglose de Pagos */}
                                {(() => {
                                    let desglose: any[] = [];
                                    if (confirmacion.desglose_pagos) {
                                        if (typeof confirmacion.desglose_pagos === 'string') {
                                            try {
                                                desglose = JSON.parse(confirmacion.desglose_pagos);
                                            } catch (e) {
                                                desglose = [];
                                            }
                                        } else if (Array.isArray(confirmacion.desglose_pagos)) {
                                            desglose = confirmacion.desglose_pagos;
                                        }
                                    }

                                    return (
                                        (confirmacion.tipo_confirmacion === 'COMPLETA' || confirmacion.tipo_confirmacion === 'DEVOLUCION_PARCIAL') &&
                                        desglose.length > 0 && (
                                            <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-900/20">
                                                <h4 className="mb-3 font-semibold text-purple-900 dark:text-purple-200">📊 Desglose de Pagos</h4>
                                                <div className="space-y-2">
                                                    {desglose.map((pago: any, pidx: number) => (
                                                        <div
                                                            key={pidx}
                                                            className="flex items-center justify-between rounded bg-white p-2 dark:bg-zinc-800"
                                                        >
                                                            <span className="text-sm text-purple-700 dark:text-purple-300">
                                                                {pago.tipo_pago_nombre || 'Desconocido'}
                                                            </span>
                                                            <span className="font-bold text-purple-900 dark:text-purple-100">
                                                                {formatCurrencyWith2Decimals(pago.monto || 0, venta.moneda?.codigo || 'USD')}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )
                                    );
                                })()}

                                {/* Productos Devueltos */}
                                {(() => {
                                    let productos: any[] = [];
                                    if (confirmacion.productos_devueltos) {
                                        if (typeof confirmacion.productos_devueltos === 'string') {
                                            try {
                                                productos = JSON.parse(confirmacion.productos_devueltos);
                                            } catch (e) {
                                                productos = [];
                                            }
                                        } else if (Array.isArray(confirmacion.productos_devueltos)) {
                                            productos = confirmacion.productos_devueltos;
                                        }
                                    }

                                    return (
                                        confirmacion.tipo_confirmacion === 'DEVOLUCION_PARCIAL' &&
                                        productos.length > 0 && (
                                            <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-900/20">
                                                <h4 className="mb-3 font-semibold text-orange-900 dark:text-orange-200">
                                                    🔄 Productos Devueltos ({productos.length})
                                                </h4>
                                                <div className="space-y-2">
                                                    {productos.map((prod: any, pidx: number) => (
                                                        <div
                                                            key={pidx}
                                                            className="flex items-center justify-between rounded bg-white p-3 dark:bg-zinc-800"
                                                        >
                                                            <div>
                                                                <p className="text-sm font-medium text-orange-900 dark:text-orange-100">
                                                                    {prod.producto_nombre || 'Producto desconocido'}
                                                                </p>
                                                                <p className="text-xs text-orange-700 dark:text-orange-300">
                                                                    Cantidad: {prod.cantidad}
                                                                </p>
                                                            </div>
                                                            <span className="font-bold text-orange-900 dark:text-orange-100">
                                                                {formatCurrencyWith2Decimals(prod.subtotal || 0, venta.moneda?.codigo || 'USD')}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )
                                    );
                                })()}

                                {/* Observaciones */}
                                {confirmacion.observaciones_logistica && (
                                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-zinc-700 dark:bg-zinc-800">
                                        <h4 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">📝 Observaciones</h4>
                                        <p className="text-sm whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                                            {confirmacion.observaciones_logistica}
                                        </p>
                                    </div>
                                )}

                                {/* Evidencia Fotográfica */}
                                {(confirmacion.fotos?.length > 0 || confirmacion.firma_digital_url || confirmacion.foto_comprobante) && (
                                    <div className="rounded-lg border border-gray-200 p-4 dark:border-zinc-700">
                                        <h4 className="mb-4 font-semibold text-gray-900 dark:text-gray-100">📸 Evidencia Fotográfica</h4>
                                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                                            {confirmacion.fotos?.map((foto: string, fidx: number) => (
                                                <div
                                                    key={`foto-${fidx}`}
                                                    className="relative overflow-hidden rounded-lg bg-gray-100 dark:bg-zinc-800"
                                                >
                                                    <img
                                                        src={foto}
                                                        alt={`Foto entrega ${fidx + 1}`}
                                                        className="h-48 w-full cursor-pointer object-cover transition-transform hover:scale-105"
                                                        onClick={() => window.open(foto, '_blank')}
                                                    />
                                                    <div className="absolute top-2 left-2 rounded bg-black/50 px-2 py-1 text-xs font-semibold text-white">
                                                        📷 {fidx + 1}
                                                    </div>
                                                </div>
                                            ))}
                                            {confirmacion.firma_digital_url && (
                                                <div className="relative overflow-hidden rounded-lg bg-gray-100 dark:bg-zinc-800">
                                                    <img
                                                        src={confirmacion.firma_digital_url}
                                                        alt="Firma digital"
                                                        className="h-48 w-full cursor-pointer object-cover transition-transform hover:scale-105"
                                                        onClick={() => window.open(confirmacion.firma_digital_url, '_blank')}
                                                    />
                                                    <div className="absolute top-2 left-2 rounded bg-blue-600/80 px-2 py-1 text-xs font-semibold text-white">
                                                        ✍️ Firma
                                                    </div>
                                                </div>
                                            )}
                                            {confirmacion.foto_comprobante && (
                                                <div className="relative overflow-hidden rounded-lg bg-gray-100 dark:bg-zinc-800">
                                                    <img
                                                        src={confirmacion.foto_comprobante}
                                                        alt="Comprobante de pago"
                                                        className="h-48 w-full cursor-pointer object-cover transition-transform hover:scale-105"
                                                        onClick={() => window.open(confirmacion.foto_comprobante, '_blank')}
                                                    />
                                                    <div className="absolute top-2 left-2 rounded bg-green-600/80 px-2 py-1 text-xs font-semibold text-white">
                                                        🧾 Comprobante
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="py-8 text-center">
                            <p className="text-gray-500 dark:text-gray-400">No hay confirmaciones registradas para esta venta</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
