import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import type { Cliente, Moneda } from '@/domain/entities/ventas';
import type { EstadoDocumento } from '@/domain/entities/estados-documento';
import type { Id } from '@/domain/entities/shared';

// Confirmación compacta antes de crear/actualizar una venta: resumen corto y dos botones.
// Mantiene las mismas props que la vista previa anterior.

interface DetalleVentaConProducto {
    cantidad?: number | string;
    precio_unitario?: number | string;
    subtotal?: number | string;
    producto?: { nombre?: string };
}

interface VentaPreviewData {
    numero: string;
    fecha: string;
    subtotal: number;
    descuento: number;
    impuesto: number;
    total: number;
    observaciones?: string;
    cliente_id: Id;
    usuario_id: number;
    estado_documento_id: Id;
    moneda_id: Id;
    proforma_id?: Id;
    tipo_pago_id?: Id;
    tipo_documento_id?: Id;
    requiere_envio?: boolean;
    canal_origen?: 'APP_EXTERNA' | 'WEB' | 'PRESENCIAL';
    estado_logistico?: string;
    empresa_logistica_id?: number | null;
}

interface VentaPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    data: VentaPreviewData;
    detallesWithProducts: DetalleVentaConProducto[];
    cliente: Cliente | undefined;
    moneda: Moneda | undefined;
    estadoDocumento: EstadoDocumento | undefined;
    processing: boolean;
    isEditing: boolean;
    comboItemsMap?: Record<number, any[]>;
}

export default function VentaPreviewModal({
    isOpen,
    onClose,
    onConfirm,
    data,
    detallesWithProducts,
    cliente,
    moneda,
    processing,
    isEditing,
}: VentaPreviewModalProps) {
    const simbolo = moneda?.simbolo ?? '';
    const unidades = detallesWithProducts.reduce((acc, d) => acc + Number(d.cantidad || 0), 0);
    const total = Number(data.total || 0);

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={processing ? () => {} : onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/30" />
                </Transition.Child>

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-200"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-150"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-900">
                            <Dialog.Title className="text-lg font-semibold text-gray-900 dark:text-white">
                                {isEditing ? 'Confirmar actualización de venta' : 'Confirmar venta'}
                            </Dialog.Title>

                            <dl className="mt-4 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <dt className="text-gray-500 dark:text-gray-400">Cliente</dt>
                                    <dd className="font-medium text-gray-900 dark:text-white">{cliente?.nombre ?? '-'}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-gray-500 dark:text-gray-400">Productos</dt>
                                    <dd className="text-gray-900 dark:text-white">
                                        {detallesWithProducts.length} · {unidades} unid.
                                    </dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-gray-500 dark:text-gray-400">Envío</dt>
                                    <dd className="text-gray-900 dark:text-white">{data.requiere_envio ? 'Sí' : 'No'}</dd>
                                </div>
                                <div className="flex items-center justify-between border-t pt-3 text-base">
                                    <dt className="font-semibold text-gray-900 dark:text-white">Total</dt>
                                    <dd className="font-mono text-lg font-bold text-gray-900 dark:text-white">
                                        {simbolo} {total.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 10 })}
                                    </dd>
                                </div>
                            </dl>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={processing}
                                    className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-zinc-600 dark:text-gray-200 dark:hover:bg-zinc-800"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    onClick={onConfirm}
                                    disabled={processing}
                                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {processing ? 'Guardando...' : isEditing ? 'Actualizar' : 'Confirmar'}
                                </button>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
}
