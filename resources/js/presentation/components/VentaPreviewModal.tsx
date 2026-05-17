import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, ShoppingCart, User, FileText, CreditCard } from 'lucide-react';
import { formatCurrency, formatCurrencyWith2Decimals } from '@/lib/utils';
import type {
    Cliente,
    Moneda,
    EstadoDocumento,
    Producto
} from '@/domain/entities/ventas';
import type { Id } from '@/domain/entities/shared';

interface ComboItemSeleccionado {
    producto_id: number;
    incluido: boolean;
    cantidad?: number;
}

interface DetalleVentaConProducto {
    producto_id: Id;
    cantidad: number;
    precio_unitario: number;
    descuento: number;
    subtotal: number;
    producto?: Producto & { es_combo?: boolean };
    combo_items_seleccionados?: ComboItemSeleccionado[];
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
    estado_logistico?: 'SIN_ENTREGA' | 'PENDIENTE_ENVIO' | 'PROGRAMADO' | 'EN_PREPARACION' | 'PREPARANDO' | 'EN_TRANSITO' | 'ENVIADO' | 'ENTREGADA' | 'ENTREGADO' | 'PROBLEMAS' | 'CANCELADA' | 'CANCELADO' | 'PENDIENTE_RETIRO' | 'RETIRADO';
    empresa_logistica_id?: number | null; // ✅ NUEVO: Empresa de logística
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
    comboItemsMap?: Record<number, any[]>; // ✅ NUEVO: Mapa de items por índice de detalle
}

export default function VentaPreviewModal({
    isOpen,
    onClose,
    onConfirm,
    data,
    detallesWithProducts,
    cliente,
    moneda,
    estadoDocumento,
    processing,
    isEditing,
    comboItemsMap
}: VentaPreviewModalProps) {
    console.log('🔍 [VentaPreviewModal] Datos recibidos:', {
        data,
        detallesWithProducts,
        cliente,
        moneda,
        estadoDocumento,
        processing,
        isEditing,
        comboItemsMap
    });
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 p-6 text-left align-middle shadow-xl transition-all">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-2xl font-semibold leading-6 text-gray-900 dark:text-white flex items-center gap-3"
                                    >
                                        <ShoppingCart className="h-6 w-6 text-blue-600" />
                                        Vista Previa de {isEditing ? 'Actualización' : 'Venta'}
                                    </Dialog.Title>
                                    <button
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 transition-colors"
                                    >
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {/* Información Principal */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4">
                                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                                                <FileText className="h-4 w-4" />
                                                Información del Documento
                                            </h4>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-gray-600 dark:text-gray-300">Número:</span>
                                                    <span className="text-sm font-medium text-gray-900 dark:text-white">{data.numero}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-gray-600 dark:text-gray-300">Fecha:</span>
                                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {new Date(data.fecha).toLocaleDateString('es-BO', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-gray-600 dark:text-gray-300">Estado:</span>
                                                    <span className="text-sm font-medium text-gray-900 dark:text-white">{estadoDocumento?.nombre}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-gray-600 dark:text-gray-300">Moneda:</span>
                                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {moneda?.nombre} ({moneda?.simbolo})
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4">
                                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                                                <User className="h-4 w-4" />
                                                Información del Cliente
                                            </h4>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-gray-600 dark:text-gray-300">Nombre:</span>
                                                    <span className="text-sm font-medium text-gray-900 dark:text-white">{cliente?.nombre || 'Sin cliente'}</span>
                                                </div>
                                                {cliente?.nit && (
                                                    <div className="flex justify-between">
                                                        <span className="text-sm text-gray-600 dark:text-gray-300">NIT:</span>
                                                        <span className="text-sm font-medium text-gray-900 dark:text-white">{cliente.nit}</span>
                                                    </div>
                                                )}
                                                {cliente?.email && (
                                                    <div className="flex justify-between">
                                                        <span className="text-sm text-gray-600 dark:text-gray-300">Email:</span>
                                                        <span className="text-sm font-medium text-gray-900 dark:text-white">{cliente.email}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Observaciones */}
                                    {data.observaciones && (
                                        <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4">
                                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Observaciones</h4>
                                            <p className="text-sm text-gray-700 dark:text-gray-300">{data.observaciones}</p>
                                        </div>
                                    )}

                                    {/* Detalles de Productos */}
                                    <div className="bg-gray-50 dark:bg-zinc-800 rounded-lg p-4">
                                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                                            Productos ({detallesWithProducts.length} items)
                                        </h4>

                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
                                                <thead>
                                                    <tr>
                                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                            Producto
                                                        </th>
                                                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                            Cantidad
                                                        </th>
                                                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                            Precio Unit.
                                                        </th>
                                                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                            Descuento
                                                        </th>
                                                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                            Subtotal
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
                                                    {detallesWithProducts.map((detalle, index) => {
                                                        const esCombo = detalle.producto?.es_combo === true;
                                                        // ✅ MEJORADO: Obtener items del combo desde comboItemsMap o desde detalle.combo_items_seleccionados
                                                        const comboItemsDelMapa = comboItemsMap?.[index] || [];
                                                        const itemsSeleccionados = comboItemsDelMapa.length > 0
                                                            ? comboItemsDelMapa.filter(item => item.incluido !== false)
                                                            : (detalle.combo_items_seleccionados?.filter(item => item.incluido) || []);

                                                        return (
                                                            <Fragment key={`detalle-${detalle.producto?.id}-${index}`}>
                                                                {/* Fila del Producto / Combo */}
                                                                <tr className={esCombo ? 'bg-purple-50 dark:bg-purple-900/20' : ''}>
                                                                    <td className="px-3 py-2 text-sm">
                                                                        <div>
                                                                            <p className="font-medium text-gray-900 dark:text-white">
                                                                                {esCombo && '📦 '}
                                                                                {detalle.producto?.nombre}
                                                                            </p>
                                                                            {detalle.producto?.codigo && (
                                                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                                    Código: {detalle.producto.codigo}
                                                                                </p>
                                                                            )}
                                                                            {esCombo && itemsSeleccionados.length > 0 && (
                                                                                <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                                                                                    {itemsSeleccionados.length} item(s) seleccionado(s)
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-3 py-2 text-sm text-right text-gray-900 dark:text-white">
                                                                        {detalle.cantidad}
                                                                    </td>
                                                                    <td className="px-3 py-2 text-sm text-right text-gray-900 dark:text-white">
                                                                        {formatCurrencyWith2Decimals(detalle.precio_unitario)}
                                                                    </td>
                                                                    <td className="px-3 py-2 text-sm text-right text-gray-900 dark:text-white">
                                                                        {formatCurrencyWith2Decimals(detalle.descuento)}
                                                                    </td>
                                                                    <td className="px-3 py-2 text-sm text-right font-medium text-gray-900 dark:text-white">
                                                                        {formatCurrencyWith2Decimals(detalle.subtotal)}
                                                                    </td>
                                                                </tr>

                                                                {/* Filas de Items del Combo */}
                                                                {esCombo && itemsSeleccionados.map((item) => {
                                                                    // Obtener el producto_id correctamente según la estructura
                                                                    const productId = item.producto_id || (item as any).producto_id;
                                                                    // El item podría tener producto_nombre o necesitar buscarlo
                                                                    const itemNombre = (item as any)?.producto_nombre ||
                                                                                      (detalle.producto as any)?.comboItems?.find(
                                                                                          (ci: any) => ci.producto_id === productId
                                                                                      )?.producto?.nombre ||
                                                                                      `Producto #${productId}`;
                                                                    const itemSku = (item as any)?.producto_sku;

                                                                    return (
                                                                        <tr key={`combo-item-${productId}`} className="bg-purple-100/50 dark:bg-purple-900/10">
                                                                            <td className="px-3 py-2 text-sm pl-8">
                                                                                <div className="flex items-center gap-3">
                                                                                    <span className="text-purple-600 dark:text-purple-400 text-lg">└─</span>
                                                                                    <div className="flex-1">
                                                                                        <div className="flex items-center gap-2">
                                                                                            <p className="text-sm text-gray-900 dark:text-white font-medium">
                                                                                                {itemNombre}
                                                                                            </p>
                                                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                                                                                                ✓ Incluido
                                                                                            </span>
                                                                                        </div>
                                                                                        {(itemSku || (item as any)?.codigo) && (
                                                                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                                                                Código: {itemSku || (item as any)?.codigo}
                                                                                            </p>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                            <td className="px-3 py-2 text-sm text-right text-gray-900 dark:text-white">
                                                                                {(item as any)?.cantidad || '-'}
                                                                            </td>
                                                                            <td className="px-3 py-2 text-sm text-right text-gray-500 dark:text-gray-400">
                                                                                -
                                                                            </td>
                                                                            <td className="px-3 py-2 text-sm text-right text-gray-500 dark:text-gray-400">
                                                                                -
                                                                            </td>
                                                                            <td className="px-3 py-2 text-sm text-right text-gray-500 dark:text-gray-400">
                                                                                -
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                })}
                                                            </Fragment>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Totales */}
                                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                                            <CreditCard className="h-4 w-4" />
                                            Resumen de Totales
                                        </h4>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600 dark:text-gray-300">Subtotal:</span>
                                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {formatCurrencyWith2Decimals(data.subtotal)}
                                                </span>
                                            </div>
                                            {data.descuento > 0 && (
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-gray-600 dark:text-gray-300">Descuento General:</span>
                                                    <span className="text-sm font-medium text-red-600 dark:text-red-400">
                                                        -{formatCurrencyWith2Decimals(data.descuento)}
                                                    </span>
                                                </div>
                                            )}
                                            {/* Impuesto oculto - por ahora no se requiere */}
                                            {false && data.impuesto > 0 && (
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-gray-600 dark:text-gray-300">Impuestos:</span>
                                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {formatCurrencyWith2Decimals(data.impuesto)}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="border-t border-gray-200 dark:border-zinc-600 pt-2 mt-2">
                                                <div className="flex justify-between">
                                                    <span className="text-lg font-semibold text-gray-900 dark:text-white">TOTAL:</span>
                                                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                                        {formatCurrencyWith2Decimals(data.total)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="mt-8 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 rounded-md hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
                                        disabled={processing}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={onConfirm}
                                        disabled={processing}
                                        className="inline-flex items-center px-6 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {processing ? 'Procesando...' : (isEditing ? 'Confirmar Actualización' : 'Confirmar Venta')}
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
