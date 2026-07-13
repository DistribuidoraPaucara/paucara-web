import React, { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { Loader, X, Trash2 } from 'lucide-react';

interface Producto {
    id: number;
    nombre: string;
    sku?: string;
    precio_unitario: number;
}

interface Detalle {
    id: number;
    producto: Producto;
    cantidad: number;
    precio_unitario: number;
}

interface RegistrarConfirmacionModalProps {
    isOpen: boolean;
    ventaId: number;
    ventaNumero: string;
    entregaId?: number; // ✅ ID de la entrega
    politicaPago?: string; // CREDITO o CONTRA_ENTREGA, etc
    detalles?: Detalle[];
    onClose: () => void;
    onSuccess?: () => void;
}

const TIPO_PAGO_OPTIONS = [
    { value: 'efectivo', label: '💵 Efectivo' },
    { value: 'transferencia', label: '📱 Transferencia/QR' },
];

export default function RegistrarConfirmacionModal({
    isOpen,
    ventaId,
    ventaNumero,
    entregaId,
    politicaPago = '',
    detalles = [],
    onClose,
    onSuccess,
}: RegistrarConfirmacionModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [tipoEntrega, setTipoEntrega] = useState<'COMPLETA' | 'CON_NOVEDAD'>('COMPLETA');
    const [tipoConfirmacion, setTipoConfirmacion] = useState('COMPLETA');
    const [tipoNovedad, setTipoNovedad] = useState('COMPLETA');

    // Montos por tipo de pago
    const [montoEfectivo, setMontoEfectivo] = useState('');
    const [montoTransferencia, setMontoTransferencia] = useState('');

    // Fotos y observaciones
    const [observacionesLogistica, setObservacionesLogistica] = useState('');
    const [observaciones, setObservaciones] = useState('');

    // Devoluciones
    const [productosDevueltos, setProductosDevueltos] = useState<Array<{
        producto_id: number;
        producto_nombre: string;
        cantidad: number;
        precio_unitario: number;
        subtotal: number;
    }>>([]);

    // Determinar si es CREDITO
    const esCredito = politicaPago?.toUpperCase() === 'CREDITO';

    // ✅ DEBUG: Loguear cuando el modal se abre
    React.useEffect(() => {
        if (isOpen) {
            console.log('📝 [RegistrarConfirmacionModal] Modal abierto con:', {
                ventaId,
                ventaNumero,
                entregaId,
                politicaPago,
                esCredito,
                tipoEntrega,
                tipoConfirmacion,
                detallesCount: detalles.length,
            });
        }
    }, [isOpen, ventaId, politicaPago]);

    // Lógica para determinar tipos según tipo_entrega
    const tiposConfirmacionDisponibles = useMemo(() => {
        if (tipoEntrega === 'COMPLETA') {
            return ['COMPLETA'];
        } else {
            return ['CLIENTE_CERRADO', 'RECHAZADO', 'DEVOLUCION_PARCIAL'];
        }
    }, [tipoEntrega]);

    // Actualizar tipo_confirmacion automáticamente
    React.useEffect(() => {
        if (tipoEntrega === 'COMPLETA') {
            setTipoConfirmacion('COMPLETA');
        } else {
            if (!tiposConfirmacionDisponibles.includes(tipoConfirmacion)) {
                setTipoConfirmacion('CLIENTE_CERRADO');
            }
        }
    }, [tipoEntrega]);

    // tipo_novedad siempre es igual a tipo_confirmacion
    React.useEffect(() => {
        setTipoNovedad(tipoConfirmacion);
    }, [tipoConfirmacion]);

    // Determinar qué campos mostrar
    // ✅ CORREGIDO: No mostrar campos de pago si es CREDITO (promesa de pago)
    const mostrarCamposPago = !esCredito && (tipoEntrega === 'COMPLETA' || (tipoEntrega === 'CON_NOVEDAD' && tipoConfirmacion === 'DEVOLUCION_PARCIAL'));

    // ✅ DEBUG: Loguear cuando cambia mostrarCamposPago
    React.useEffect(() => {
        if (isOpen) {
            console.log('🔍 [RegistrarConfirmacionModal] Estado de campos:', {
                esCredito,
                tipoEntrega,
                tipoConfirmacion,
                mostrarCamposPago,
                condicion: `!esCredito && (tipoEntrega === 'COMPLETA' || (tipoEntrega === 'CON_NOVEDAD' && tipoConfirmacion === 'DEVOLUCION_PARCIAL'))`,
            });
        }
    }, [isOpen, esCredito, tipoEntrega, tipoConfirmacion, mostrarCamposPago]);
    const mostrarTablaProductos = tipoEntrega === 'CON_NOVEDAD' && tipoConfirmacion === 'DEVOLUCION_PARCIAL';
    const mostrarSoloFotosYObservaciones =
        (tipoEntrega === 'CON_NOVEDAD' && (tipoConfirmacion === 'RECHAZADO' || tipoConfirmacion === 'CLIENTE_CERRADO' || tipoConfirmacion === 'DEVOLUCION_PARCIAL'));

    const handleAgregarProductoDevuelto = (detalle: Detalle) => {
        const yaAgregado = productosDevueltos.some(p => p.producto_id === detalle.producto.id);
        if (yaAgregado) {
            toast.warning('Este producto ya fue agregado');
            return;
        }

        setProductosDevueltos([
            ...productosDevueltos,
            {
                producto_id: detalle.producto.id,
                producto_nombre: detalle.producto.nombre,
                cantidad: 0, // Cantidad devuelta inicial es 0
                precio_unitario: detalle.precio_unitario,
                subtotal: 0,
            },
        ]);
    };

    const handleRemoverProductoDevuelto = (productoId: number) => {
        setProductosDevueltos(productosDevueltos.filter(p => p.producto_id !== productoId));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Validaciones
            if (!tipoEntrega || !tipoConfirmacion) {
                toast.error('Debe seleccionar tipo de entrega y confirmación');
                setIsSubmitting(false);
                return;
            }

            // Validar campos según tipo
            if (tipoEntrega === 'COMPLETA' && !esCredito) {
                if (!montoEfectivo && !montoTransferencia) {
                    toast.error('Debe ingresar al menos un monto de pago');
                    setIsSubmitting(false);
                    return;
                }
            }

            if (mostrarTablaProductos && productosDevueltos.filter(p => p.cantidad > 0).length === 0) {
                toast.error('Debe ingresar la cantidad devuelta de al menos un producto');
                setIsSubmitting(false);
                return;
            }

            // Construir body
            const body: Record<string, any> = {
                tipo_confirmacion: tipoConfirmacion,
                tipo_entrega: tipoEntrega,
            };

            // ✅ Agregar entrega_id si existe
            if (entregaId) {
                body.entrega_id = entregaId;
            }

            console.log('📤 [RegistrarConfirmacion] Body a enviar:', {
                entrega_id: body.entrega_id,
                tipo_confirmacion: body.tipo_confirmacion,
                tipo_entrega: body.tipo_entrega,
                ...body
            });

            // Agregar montos si aplica
            if (mostrarCamposPago) {
                const totalPago = (montoEfectivo ? parseFloat(montoEfectivo) : 0) +
                                 (montoTransferencia ? parseFloat(montoTransferencia) : 0);
                body.monto_recibido = totalPago;

                // Desglose de pagos
                body.pagos = [];
                if (montoEfectivo) {
                    body.pagos.push({
                        tipo_pago_id: 1, // Efectivo (ajustar según tu BD)
                        monto: parseFloat(montoEfectivo),
                    });
                }
                if (montoTransferencia) {
                    body.pagos.push({
                        tipo_pago_id: 2, // Transferencia (ajustar según tu BD)
                        monto: parseFloat(montoTransferencia),
                    });
                }
            }

            // Observaciones
            if (observacionesLogistica) body.observaciones_logistica = observacionesLogistica;
            if (observaciones) body.observaciones = observaciones;

            // Productos devueltos (solo los con cantidad > 0)
            if (mostrarTablaProductos && productosDevueltos.length > 0) {
                const productosConDevolucion = productosDevueltos.filter(p => p.cantidad > 0);
                if (productosConDevolucion.length > 0) {
                    body.productos_devueltos = productosConDevolucion.map(p => ({
                        producto_id: p.producto_id,
                        producto_nombre: p.producto_nombre,
                        cantidad: p.cantidad,
                        precio_unitario: p.precio_unitario,
                        subtotal: p.subtotal,
                    }));
                }
            }

            const response = await fetch(`/ventas/${ventaId}/confirmaciones`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message || 'Error al registrar la confirmación');
                setIsSubmitting(false);
                return;
            }

            toast.success('Confirmación registrada exitosamente');
            onClose();

            if (onSuccess) {
                setTimeout(() => onSuccess(), 500);
            }
        } catch (error) {
            console.error('Error al registrar confirmación:', error);
            toast.error('Error al registrar la confirmación');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                <div className="bg-white dark:bg-slate-950 rounded-lg shadow-xl w-full max-h-[95vh] overflow-y-auto">
                    {/* Header */}
                    <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-900/70 dark:to-blue-800/60 px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">📦</span>
                            <div>
                                <h2 className="text-lg font-bold text-white">
                                    Registrar Confirmación de Entrega
                                </h2>
                                <p className="text-green-300 text-sm">
                                    Venta #{ventaNumero} | Total: Bs {detalles.reduce((sum, d) => sum + (d.cantidad * d.precio_unitario), 0).toFixed(2)}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="text-white hover:bg-blue-500 p-2 rounded-lg transition disabled:opacity-50"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Tipo de Entrega */}
                        <div className="border-b border-gray-200 dark:border-slate-800 pb-4">
                            <label className="block text-sm font-semibold text-gray-900 dark:text-slate-50 mb-3">
                                Tipo de Entrega
                            </label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border-2 transition"
                                    style={{borderColor: tipoEntrega === 'COMPLETA' ? '#3b82f6' : '#e5e7eb'}}>
                                    <input
                                        type="radio"
                                        name="tipoEntrega"
                                        value="COMPLETA"
                                        checked={tipoEntrega === 'COMPLETA'}
                                        onChange={(e) => setTipoEntrega(e.target.value as 'COMPLETA' | 'CON_NOVEDAD')}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
                                        ✅ Entrega Completa
                                    </span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border-2 transition"
                                    style={{borderColor: tipoEntrega === 'CON_NOVEDAD' ? '#f59e0b' : '#e5e7eb'}}>
                                    <input
                                        type="radio"
                                        name="tipoEntrega"
                                        value="CON_NOVEDAD"
                                        checked={tipoEntrega === 'CON_NOVEDAD'}
                                        onChange={(e) => setTipoEntrega(e.target.value as 'COMPLETA' | 'CON_NOVEDAD')}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
                                        ⚠️ Con Novedad
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Tipo de Confirmación (para CON_NOVEDAD) */}
                        {tipoEntrega === 'CON_NOVEDAD' && (
                            <div className="border-b border-gray-200 dark:border-slate-800 pb-4">
                                <label className="block text-sm font-semibold text-gray-900 dark:text-slate-50 mb-3">
                                    Tipo de Novedad
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                    {['CLIENTE_CERRADO', 'RECHAZADO', 'DEVOLUCION_PARCIAL'].map((tipo) => (
                                        <label key={tipo} className="flex items-center gap-2 p-3 rounded-lg border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer transition">
                                            <input
                                                type="radio"
                                                name="tipoConfirmacion"
                                                value={tipo}
                                                checked={tipoConfirmacion === tipo}
                                                onChange={(e) => setTipoConfirmacion(e.target.value)}
                                                className="w-4 h-4"
                                            />
                                            <span className="text-sm text-gray-700 dark:text-slate-300">
                                                {tipo === 'CLIENTE_CERRADO' && '🏪 Tienda Cerrada'}
                                                {tipo === 'RECHAZADO' && '✗ Rechazado'}
                                                {tipo === 'DEVOLUCION_PARCIAL' && '↩️ Devolución'}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tabla de Productos Devueltos */}
                        {mostrarTablaProductos && (
                            <div className="border-b border-gray-200 dark:border-slate-800 pb-4">
                                <label className="block text-sm font-semibold text-gray-900 dark:text-slate-50 mb-4">
                                    📦 Productos Devueltos
                                </label>

                                {/* Tabla de productos seleccionados - Más explícita */}
                                {detalles.length > 0 && (
                                    <div className="mt-4">
                                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-3 bg-blue-50 dark:bg-blue-900/20 p-2 rounded border border-blue-200 dark:border-blue-800">
                                            ℹ️ Ingresa la cantidad DEVUELTA de cada producto. Si la venta dice 5 y se devuelven 2, ingresa 2
                                        </p>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm border-collapse">
                                                <thead>
                                                    <tr className="bg-gray-100 dark:bg-slate-800 border-b border-gray-300 dark:border-slate-600">
                                                        <th className="text-left py-2 px-3 font-semibold text-gray-900 dark:text-gray-200">Producto</th>
                                                        <th className="text-center py-2 px-3 font-semibold text-gray-900 dark:text-gray-200">Qty Venta</th>
                                                        <th className="text-center py-2 px-3 font-semibold text-gray-900 dark:text-gray-200">Qty Devuelta</th>
                                                        <th className="text-right py-2 px-3 font-semibold text-gray-900 dark:text-gray-200">P. Unit</th>
                                                        <th className="text-right py-2 px-3 font-semibold text-gray-900 dark:text-gray-200">Subtotal</th>
                                                        <th className="text-center py-2 px-3 font-semibold text-gray-900 dark:text-gray-200">Acción</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {detalles.map((detalle) => {
                                                        const devuelto = productosDevueltos.find(p => p.producto_id === detalle.producto.id);
                                                        return (
                                                            <tr
                                                                key={detalle.id}
                                                                className={`border-b border-gray-200 dark:border-slate-700 transition ${
                                                                    devuelto
                                                                        ? 'bg-orange-50 dark:bg-orange-900/10'
                                                                        : 'bg-white dark:bg-slate-900/50 hover:bg-gray-50 dark:hover:bg-slate-800'
                                                                }`}
                                                            >
                                                                <td className="py-3 px-3 text-gray-900 dark:text-white font-medium">
                                                                    {detalle.producto.nombre}
                                                                </td>
                                                                <td className="py-3 px-3 text-center text-gray-900 dark:text-white font-semibold">
                                                                    {detalle.cantidad}
                                                                </td>
                                                                <td className="py-3 px-3 text-center">
                                                                    {devuelto ? (
                                                                        <div className="inline-flex items-center gap-2">
                                                                            <input
                                                                                type="number"
                                                                                min="0"
                                                                                max={detalle.cantidad}
                                                                                value={devuelto.cantidad}
                                                                                onChange={(e) => {
                                                                                    const newQty = parseFloat(e.target.value) || 0;
                                                                                    const updated = productosDevueltos.map(p =>
                                                                                        p.producto_id === detalle.producto.id
                                                                                            ? {
                                                                                                ...p,
                                                                                                cantidad: newQty,
                                                                                                subtotal: newQty * p.precio_unitario,
                                                                                            }
                                                                                            : p
                                                                                    );
                                                                                    setProductosDevueltos(updated);
                                                                                }}
                                                                                className="w-16 rounded-md border border-orange-300 dark:border-orange-600 bg-white dark:bg-slate-800 px-2 py-1 text-sm text-center text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                                            />
                                                                            <span className="text-xs text-gray-600 dark:text-gray-400">
                                                                                max: {detalle.cantidad}
                                                                            </span>
                                                                        </div>
                                                                    ) : (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleAgregarProductoDevuelto(detalle)}
                                                                            className="px-3 py-1 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition font-medium text-xs"
                                                                        >
                                                                            + Agregar
                                                                        </button>
                                                                    )}
                                                                </td>
                                                                <td className="py-3 px-3 text-right text-gray-900 dark:text-white font-medium">
                                                                    Bs {detalle.precio_unitario.toFixed(2)}
                                                                </td>
                                                                <td className="py-3 px-3 text-right text-gray-900 dark:text-white font-semibold">
                                                                    {devuelto ? (
                                                                        <span className="bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded text-orange-700 dark:text-orange-300">
                                                                            Bs {devuelto.subtotal.toFixed(2)}
                                                                        </span>
                                                                    ) : (
                                                                        <span className="text-gray-400">-</span>
                                                                    )}
                                                                </td>
                                                                <td className="py-3 px-3 text-center">
                                                                    {devuelto && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleRemoverProductoDevuelto(devuelto.producto_id)}
                                                                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                                                                            title="Remover producto"
                                                                        >
                                                                            <Trash2 className="w-4 h-4" />
                                                                        </button>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Resumen de Devoluciones y Cálculos Financieros */}
                                        {productosDevueltos.length > 0 && (
                                            <div className="mt-4 space-y-4">
                                                {/* Detalle de Productos Devueltos */}
                                                {/* <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                                                    <h4 className="font-semibold text-orange-900 dark:text-orange-200 mb-3">📦 Detalle de Devoluciones</h4>
                                                    <div className="space-y-2 text-sm">
                                                        {productosDevueltos.map((prod) => (
                                                            <div key={prod.producto_id} className="flex justify-between items-center">
                                                                <span className="text-gray-700 dark:text-gray-300">{prod.producto_nombre}</span>
                                                                <span className="font-semibold text-orange-700 dark:text-orange-300">
                                                                    {prod.cantidad} × Bs {prod.precio_unitario.toFixed(2)} = Bs {prod.subtotal.toFixed(2)}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div> */}

                                                {/* Resumen Financiero */}
                                                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                                    <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-4">💰 Resumen Financiero</h4>
                                                    <div className="space-y-3">
                                                        {/* Total Original */}
                                                        <div className="flex justify-between items-center pb-3 border-b border-blue-200 dark:border-blue-700">
                                                            <span className="text-gray-700 dark:text-gray-300">Total Venta Original:</span>
                                                            <span className="font-bold text-lg text-gray-900 dark:text-white">
                                                                Bs {detalles.reduce((sum, d) => sum + (d.cantidad * d.precio_unitario), 0).toFixed(2)}
                                                            </span>
                                                        </div>

                                                        {/* Total a Devolver */}
                                                        <div className="flex justify-between items-center pb-3 border-b border-blue-200 dark:border-blue-700">
                                                            <span className="text-orange-700 dark:text-orange-300 font-semibold">Total a Devolver:</span>
                                                            <span className="font-bold text-lg text-orange-700 dark:text-orange-300">
                                                                - Bs {productosDevueltos.reduce((sum, p) => sum + p.subtotal, 0).toFixed(2)}
                                                            </span>
                                                        </div>

                                                        {/* Nuevo Total */}
                                                        <div className="flex justify-between items-center pt-2 bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-900/20 p-3 rounded-lg">
                                                            <span className="font-bold text-blue-900 dark:text-blue-200">Nuevo Total de Venta:</span>
                                                            <span className="font-bold text-xl text-blue-700 dark:text-blue-300">
                                                                Bs {(
                                                                    detalles.reduce((sum, d) => sum + (d.cantidad * d.precio_unitario), 0) -
                                                                    productosDevueltos.reduce((sum, p) => sum + p.subtotal, 0)
                                                                ).toFixed(2)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Mensaje si es CREDITO (no se registra pago) */}
                        {esCredito && (
                            <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                                <div className="flex gap-3">
                                    <span className="text-xl">💳</span>
                                    <div>
                                        <p className="font-semibold text-orange-900 dark:text-orange-100">
                                            Venta a Crédito (Promesa de Pago)
                                        </p>
                                        <p className="text-sm text-orange-800 dark:text-orange-200 mt-1">
                                            Esta venta es una promesa de pago. No es necesario registrar detalles de pago en este momento.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Campos de Pago (si aplica) */}
                        {mostrarCamposPago && (
                            <div className="border-b border-gray-200 dark:border-slate-800 pb-4">
                                <label className="block text-sm font-semibold text-gray-900 dark:text-slate-50 mb-4">
                                    💰 Información de Pago
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase mb-2">
                                            Efectivo
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={montoEfectivo}
                                            onChange={(e) => setMontoEfectivo(e.target.value)}
                                            placeholder="0.00"
                                            className="block w-full rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase mb-2">
                                            Transferencia/QR
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={montoTransferencia}
                                            onChange={(e) => setMontoTransferencia(e.target.value)}
                                            placeholder="0.00"
                                            className="block w-full rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                {(montoEfectivo || montoTransferencia || true) && (
                                    <div className="mt-4 grid grid-cols-2 md:grid-cols-2 gap-4">
                                        {/* Total Pagado */}
                                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-semibold text-blue-900 dark:text-blue-200">Total Pagado:</span>
                                                <span className="font-bold text-blue-700 dark:text-blue-300">
                                                    Bs {(
                                                        (montoEfectivo ? parseFloat(montoEfectivo) : 0) +
                                                        (montoTransferencia ? parseFloat(montoTransferencia) : 0)
                                                    ).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Faltante */}
                                        {(() => {
                                            const totalVenta = detalles.reduce((sum, d) => sum + (d.cantidad * d.precio_unitario), 0);
                                            const totalPagado = (montoEfectivo ? parseFloat(montoEfectivo) : 0) + (montoTransferencia ? parseFloat(montoTransferencia) : 0);
                                            const faltante = totalVenta - totalPagado;

                                            return (
                                                <div className={`p-3 rounded-lg border ${
                                                    faltante <= 0
                                                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                                                        : 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
                                                }`}>
                                                    <div className="flex justify-between items-center">
                                                        <span className={`text-sm font-semibold ${
                                                            faltante <= 0
                                                                ? 'text-green-900 dark:text-green-200'
                                                                : 'text-orange-900 dark:text-orange-200'
                                                        }`}>
                                                            {faltante <= 0 ? '✅ Pagado Completo' : '⚠️ Falta pagar:'}
                                                        </span>
                                                        <span className={`font-bold text-lg ${
                                                            faltante <= 0
                                                                ? 'text-green-700 dark:text-green-300'
                                                                : 'text-orange-700 dark:text-orange-300'
                                                        }`}>
                                                            Bs {Math.abs(faltante).toFixed(2)}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                )}
                            </div>
                        )}                        

                        {/* Observaciones (mostrar siempre o solo para RECHAZADO/CLIENTE_CERRADO) */}
                        {(mostrarSoloFotosYObservaciones || tipoEntrega === 'COMPLETA') && (
                            <>
                                <div className="border-b border-gray-200 dark:border-slate-800 pb-4">
                                    <label className="block text-sm font-semibold text-gray-900 dark:text-slate-50 mb-3">
                                        Observaciones Logística
                                    </label>
                                    <textarea
                                        value={observacionesLogistica}
                                        onChange={(e) => setObservacionesLogistica(e.target.value)}
                                        placeholder="Detalle cualquier información relevante sobre la entrega..."
                                        maxLength={1000}
                                        rows={3}
                                        className="block w-full rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                                        {observacionesLogistica.length}/1000
                                    </p>
                                </div>

                                {/* <div>
                                    <label className="block text-sm font-semibold text-gray-900 dark:text-slate-50 mb-3">
                                        Observaciones Generales
                                    </label>
                                    <textarea
                                        value={observaciones}
                                        onChange={(e) => setObservaciones(e.target.value)}
                                        placeholder="Notas adicionales..."
                                        maxLength={500}
                                        rows={3}
                                        className="block w-full rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                                        {observaciones.length}/500
                                    </p>
                                </div> */}
                            </>
                        )}

                        {/* Buttons */}
                        <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-slate-800">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="px-4 py-2 rounded-md border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
                            >
                                {isSubmitting && <Loader className="w-4 h-4 animate-spin" />}
                                {isSubmitting ? 'Registrando...' : 'Registrar Confirmación'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
