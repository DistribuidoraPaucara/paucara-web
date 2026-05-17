import React, { useState } from 'react';
import { ChevronDown, ShoppingCart, DollarSign, Calendar, MapPin, Package, CheckCircle, AlertCircle, Edit2, Truck, Navigation } from 'lucide-react';
import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import { ReasignarVentaModal } from './ReasignarVentaModal';
import type { VentaEntrega, Entrega } from '@/domain/entities/entregas';

interface DesglosePago {
    tipo_pago_id: number;
    tipo_pago_nombre: string;
    monto: number;
    referencia?: string;
}

interface VentasEntregaSectionProps {
    entrega?: Entrega;
    ventas: VentaEntrega[];
    totalVentas?: number;
    onCorregirPago?: (ventaId: number, ventaNumero: string, ventaTotal: number, desglose: DesglosePago[]) => void;
    onConfirmarEntrega?: (venta: VentaEntrega) => void;
}

const getEstadoColor = (estado: string) => {
    const estadoMap: Record<string, string> = {
        'EN_PREPARACION': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
        'EN_TRANSITO': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200',
        'ENTREGADA': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
        'PROBLEMAS': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200',
        'CANCELADA': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100',
        'PROGRAMADO': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200',
    };
    return estadoMap[estado] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
};

const getTipoPagoColor = (codigo?: string) => {
    const tipoPagoMap: Record<string, string> = {
        'EFECTIVO': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
        'TRANSFERENCIA': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
        'CHEQUE': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200',
        'CREDITO': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200',
        'QR': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200',
    };
    return tipoPagoMap[codigo || ''] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
};

export default function VentasEntregaSection({ entrega, ventas, onCorregirPago, onConfirmarEntrega }: VentasEntregaSectionProps) {
    console.log('VentasEntregaSection render with ventas:', ventas);
    console.log('🔍 Verificando tipo_pago en ventas:', ventas.map(v => ({ id: v.id, tipo_pago: v.tipo_pago, numero: v.numero })));
    const [expandedVentaId, setExpandedVentaId] = useState<number | null>(null);
    const [reasignarModalOpen, setReasignarModalOpen] = useState(false);
    const [ventaAReasignar, setVentaAReasignar] = useState<VentaEntrega | undefined>(undefined);

    // ✅ Helper para obtener la confirmación de una venta
    const obtenerConfirmacionVenta = (ventaId: number) => {
        if (!entrega?.confirmacionesVentas) return null;
        return entrega.confirmacionesVentas.find((c: any) => c.venta_id === ventaId);
    };

    if (!ventas || ventas.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-950 rounded-lg border border-gray-200 dark:border-slate-800 p-6">
                <div className="flex items-center gap-3 text-gray-500 dark:text-slate-400">
                    <ShoppingCart className="w-5 h-5" />
                    <p className="text-gray-600 dark:text-slate-300">No hay ventas asociadas a esta entrega</p>
                </div>
            </div>
        );
    }

    const montoTotal = ventas.reduce((sum, v) => sum + (typeof v.subtotal === 'string' ? parseFloat(v.subtotal) : v.subtotal || 0), 0);

    // Usar el peso de la entrega si está disponible, sino calcular desde las ventas
    let pesoTotal = 0;
    if (entrega?.peso_kg) {
        pesoTotal = typeof entrega.peso_kg === 'string' ? parseFloat(entrega.peso_kg) : entrega.peso_kg;
    } else {
        pesoTotal = ventas.reduce((sum, v) => sum + (v.peso_estimado || 0), 0);
    }
    pesoTotal = Number(pesoTotal) || 0;

    return (
        <div className="bg-white dark:bg-slate-950 rounded-lg border border-gray-200 dark:border-slate-800 p-6 space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                    <ShoppingCart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Ventas en esta Entrega
                </h2>

                {/* Resumen de métricas */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-50/50 dark:from-slate-800 dark:to-slate-800/70 rounded-lg p-4 border border-blue-200 dark:border-slate-700">
                        <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">Total Ventas</p>
                        <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{ventas.length}</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-50/50 dark:from-slate-800 dark:to-slate-800/70 rounded-lg p-4 border border-green-200 dark:border-slate-700">
                        <p className="text-sm text-green-700 dark:text-green-300 font-medium">Monto Total</p>
                        <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                            Bs. {montoTotal.toFixed(2)}
                        </p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-50/50 dark:from-slate-800 dark:to-slate-800/70 rounded-lg p-4 border border-purple-200 dark:border-slate-700">
                        <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">Peso Total</p>
                        <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                            {pesoTotal.toFixed(2)} kg
                        </p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-orange-50/50 dark:from-slate-800 dark:to-slate-800/70 rounded-lg p-4 border border-orange-200 dark:border-slate-700">
                        <p className="text-sm text-orange-700 dark:text-orange-300 font-medium">Promedio</p>
                        <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                            Bs. {(montoTotal / ventas.length).toFixed(2)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Tabla de ventas */}
            <div className="border border-gray-200 dark:border-slate-800 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        {/* Header de tabla */}
                        <thead>
                            <tr className="bg-gray-50 dark:bg-slate-900/80 border-b border-gray-200 dark:border-slate-800">
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                    Venta
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                    Cliente
                                </th>
                                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">
                                    Items
                                </th>
                                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">
                                    Peso
                                </th>
                                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900 dark:text-white">
                                    Monto
                                </th>
                                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">
                                    Tipo de Pago
                                </th>
                                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">
                                    Tipo Entrega
                                </th>
                                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">
                                    Estado
                                </th>
                                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white w-12">
                                    Detalles
                                </th>
                            </tr>
                        </thead>

                        {/* Body de tabla */}
                        <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
                            {ventas.map((venta, index) => {
                                const isExpanded = expandedVentaId === Number(venta.id);
                                const ventaTotal = (typeof venta.subtotal === 'string' ? parseFloat(venta.subtotal) : venta.subtotal) || 0;
                                const pesoVenta = venta.peso_total_estimado || 0;

                                return (
                                    <React.Fragment key={`venta-${venta.id}`}>
                                        {/* Fila principal de la venta */}
                                        <tr className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        Folio: {venta.id}
                                                    </p>
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {venta.numero}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-gray-900 dark:text-white">
                                                    {venta.cliente?.nombre || 'N/A'}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-900 dark:text-blue-200 text-xs font-semibold">
                                                    {venta.detalles?.length || 0}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right text-gray-900 dark:text-white">
                                                {pesoVenta} kg
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="font-semibold text-green-600 dark:text-green-400">
                                                    Bs. {ventaTotal.toFixed(2)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <Badge className={getTipoPagoColor(venta.tipo_pago?.codigo)}>
                                                    💳 {venta.tipo_pago?.nombre || 'N/A'}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {(() => {
                                                    const confirmacion = obtenerConfirmacionVenta(Number(venta.id));
                                                    if (!confirmacion) {
                                                        return <span className="text-gray-500 dark:text-gray-400 text-sm">Sin confirmar</span>;
                                                    }
                                                    const isTipoEntregaCompleta = confirmacion.tipo_entrega === 'COMPLETA';
                                                    return (
                                                        <Badge className={isTipoEntregaCompleta ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200' : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'}>
                                                            {confirmacion.tipo_entrega === 'COMPLETA' ? '✅ ' : '⚠️ '}{confirmacion.tipo_entrega || 'N/A'}
                                                        </Badge>
                                                    );
                                                })()}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <Badge className={getEstadoColor(venta.estado_logistica?.codigo || 'PROGRAMADO')}>
                                                    {venta.estado_logistica?.codigo || 'PROGRAMADO'}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {venta.detalles && venta.detalles.length > 0 && (
                                                    <button
                                                        onClick={() => setExpandedVentaId(isExpanded ? null : Number(venta.id))}
                                                        className="p-1 hover:bg-gray-200 dark:hover:bg-slate-800 rounded transition"
                                                        title={isExpanded ? 'Ocultar' : 'Ver detalles'}
                                                    >
                                                        <ChevronDown
                                                            className={`w-5 h-5 text-gray-600 dark:text-slate-400 transition-transform ${
                                                                isExpanded ? 'rotate-180' : ''
                                                            }`}
                                                        />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>

                                        {/* Fila expandible - Detalles de la venta */}
                                        {isExpanded && (
                                            <tr className="bg-gray-50 dark:bg-slate-900/50">
                                                <td colSpan={9} className="px-6 py-4">
                                                    <div className="space-y-4">
                                                        {/* Información adicional */}
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-gray-200 dark:border-slate-800">
                                                            {venta.fecha_entrega_comprometida && (
                                                                <div className="flex items-start gap-3">
                                                                    <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400 mt-1 flex-shrink-0" />
                                                                    <div>
                                                                        <p className="text-sm text-gray-500 dark:text-gray-400">Fecha Comprometida</p>
                                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                                            {new Date(venta.fecha_entrega_comprometida).toLocaleDateString('es-ES', {
                                                                                weekday: 'short',
                                                                                year: 'numeric',
                                                                                month: 'short',
                                                                                day: 'numeric',
                                                                            })}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {venta.direccion_entrega && (
                                                                <div className="flex items-start gap-3">
                                                                    <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400 mt-1 flex-shrink-0" />
                                                                    <div>
                                                                        <p className="text-sm text-gray-500 dark:text-gray-400">Dirección Entrega</p>
                                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                                            {venta.direccion_entrega}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Tabla de productos */}
                                                        {venta.detalles && venta.detalles.length > 0 && (
                                                            <div className="space-y-2">
                                                                <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                                                    <Package className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                                    Productos ({venta.detalles.length})
                                                                </h4>
                                                                <div className="overflow-x-auto border border-gray-200 dark:border-slate-800 rounded">
                                                                    <table className="w-full text-sm">
                                                                        <thead>
                                                                            <tr className="bg-gray-100 dark:bg-slate-900">
                                                                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">
                                                                                    Producto
                                                                                </th>
                                                                                <th className="px-4 py-2 text-center text-xs font-semibold text-gray-700 dark:text-gray-300">
                                                                                    Cantidad
                                                                                </th>
                                                                                <th className="px-4 py-2 text-right text-xs font-semibold text-gray-700 dark:text-gray-300">
                                                                                    Precio
                                                                                </th>
                                                                                <th className="px-4 py-2 text-right text-xs font-semibold text-gray-700 dark:text-gray-300">
                                                                                    Subtotal
                                                                                </th>
                                                                                <th className="px-4 py-2 text-right text-xs font-semibold text-gray-700 dark:text-gray-300">
                                                                                    Peso
                                                                                </th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
                                                                            {venta.detalles.map((detalle) => {
                                                                                const precio = typeof detalle.precio_unitario === 'string' ? parseFloat(detalle.precio_unitario) : detalle.precio_unitario;
                                                                                const subtotal = typeof detalle.subtotal === 'string' ? parseFloat(detalle.subtotal) : detalle.subtotal;
                                                                                const pesoItem = (detalle.producto?.peso || 0) * detalle.cantidad;

                                                                                return (
                                                                                    <tr key={detalle.id} className="hover:bg-gray-100 dark:hover:bg-slate-800/80">
                                                                                        <td className="px-4 py-2">
                                                                                            <div>
                                                                                                <p className="font-medium text-gray-900 dark:text-white">
                                                                                                    {detalle.producto?.nombre || 'Producto sin nombre'}
                                                                                                </p>
                                                                                                {detalle.producto?.codigo && (
                                                                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                                                        {detalle.producto.codigo}
                                                                                                    </p>
                                                                                                )}
                                                                                            </div>
                                                                                        </td>
                                                                                        <td className="px-4 py-2 text-center text-gray-900 dark:text-white font-medium">
                                                                                            {Number(detalle.cantidad).toFixed(2)}
                                                                                        </td>
                                                                                        <td className="px-4 py-2 text-right text-gray-900 dark:text-white">
                                                                                            Bs. {precio.toFixed(2)}
                                                                                        </td>
                                                                                        <td className="px-4 py-2 text-right font-semibold text-blue-600 dark:text-blue-400">
                                                                                            Bs. {subtotal.toFixed(2)}
                                                                                        </td>
                                                                                        <td className="px-4 py-2 text-right text-purple-600 dark:text-purple-400 font-medium">
                                                                                            {pesoItem.toFixed(2)} kg
                                                                                        </td>
                                                                                    </tr>
                                                                                );
                                                                            })}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* ✅ Botones de acción */}
                                                        <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-slate-800 mt-4">
                                                            {/* Botón para confirmar/editar entrega (siempre disponible) */}
                                                            {onConfirmarEntrega && (
                                                                <Button
                                                                    size="sm"
                                                                    variant="default"
                                                                    onClick={() => onConfirmarEntrega(venta)}
                                                                    className={`gap-2 ${
                                                                        venta.estado_logistica?.codigo === 'ENTREGADA'
                                                                            ? 'bg-blue-600 hover:bg-blue-700'
                                                                            : 'bg-green-600 hover:bg-green-700'
                                                                    }`}
                                                                >
                                                                    <Truck className="h-4 w-4" />
                                                                    {venta.estado_logistica?.codigo === 'ENTREGADA' ? '✏️ Editar Entrega' : '✅ Confirmar Entrega'}
                                                                </Button>
                                                            )}

                                                            {/* Botón para corregir pagos (solo si está entregada) */}
                                                            {venta.estado_logistica?.codigo === 'ENTREGADA' && onCorregirPago && (
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => {
                                                                        const ventaTotal = typeof venta.total === 'string' ? parseFloat(venta.total) : venta.total || 0;
                                                                        const desglose: DesglosePago[] = venta.desglose_pagos && Array.isArray(venta.desglose_pagos)
                                                                            ? venta.desglose_pagos
                                                                            : [];
                                                                        onCorregirPago(
                                                                            Number(venta.id),
                                                                            venta.numero || '',
                                                                            ventaTotal,
                                                                            desglose
                                                                        );
                                                                    }}
                                                                    className="gap-2"
                                                                >
                                                                    <Edit2 className="h-4 w-4" />
                                                                    ✏️ Corregir Pagos
                                                                </Button>
                                                            )}

                                                            {/* ✅ NUEVO: Botón para reasignar a otra entrega */}
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => {
                                                                    setVentaAReasignar(venta);
                                                                    setReasignarModalOpen(true);
                                                                }}
                                                                className="gap-2 text-orange-600 dark:text-orange-400 border-orange-300 dark:border-orange-800 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                                                            >
                                                                <Navigation className="h-4 w-4" />
                                                                🚚 Reasignar
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ✅ NUEVO: Modal para reasignar venta */}
            <ReasignarVentaModal
                isOpen={reasignarModalOpen}
                venta={ventaAReasignar}
                entregaActual={entrega}
                onClose={() => {
                    setReasignarModalOpen(false);
                    setVentaAReasignar(undefined);
                }}
                onSuccess={() => {
                    // Recargar la página para ver los cambios actualizados
                    window.location.reload();
                }}
            />
        </div>
    );
}
