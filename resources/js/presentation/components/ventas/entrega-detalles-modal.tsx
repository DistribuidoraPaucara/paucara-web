import React from 'react';
import { formatCurrencyWith2Decimals } from '@/lib/utils';

interface Venta {
    id: number;
    numero: string;
    proforma_numero: string;
    cliente: string;
    usuario: string;
    total: number;
    estado: string;
    estado_entrega?: string;
    tipo_entrega?: string;
    tipo_novedad?: string;
    tienda_abierta?: boolean;
    cliente_presente?: boolean;
    observaciones_logistica?: string;
    estado_pago?: string;
    total_dinero_recibido?: number;
    monto_pendiente?: number;
    confirmado_en?: string;
}

interface EntregaDetallesModalProps {
    isOpen: boolean;
    venta?: Venta;
    onClose: () => void;
}

export default function EntregaDetallesModal({ isOpen, venta, onClose }: EntregaDetallesModalProps) {
    if (!isOpen || !venta) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-900 dark:to-blue-800 px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">📦</span>
                            <div>
                                <h2 className="text-lg font-bold text-white">
                                    Detalles de Entrega - Venta #{venta.numero}
                                </h2>
                                <p className="text-blue-100 text-sm">
                                    Proforma #{venta.proforma_numero}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:bg-blue-500 p-2 rounded-lg transition"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {!venta.confirmado_en ? (
                            <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-yellow-800 dark:text-yellow-300">
                                ⚠️ Esta venta aún no ha sido confirmada en entrega.
                            </div>
                        ) : (
                            <>
                                {/* Información General */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-gray-50 dark:bg-zinc-700/50 rounded-lg p-4">
                                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">
                                            Venta
                                        </p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {venta.numero}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-zinc-700/50 rounded-lg p-4">
                                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">
                                            Cliente
                                        </p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {venta.cliente}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-zinc-700/50 rounded-lg p-4">
                                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">
                                            Usuario
                                        </p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {venta.usuario}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-zinc-700/50 rounded-lg p-4">
                                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">
                                            Total Venta
                                        </p>
                                        <p className="text-sm font-medium text-green-600 dark:text-green-400">
                                            {formatCurrencyWith2Decimals(venta.total)}
                                        </p>
                                    </div>
                                </div>

                                {/* Estado de Entrega */}
                                <div className="border-t border-gray-200 dark:border-zinc-700 pt-4">
                                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                        <span>📋</span> Estado de Entrega
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="bg-gray-50 dark:bg-zinc-700/50 rounded-lg p-4">
                                            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-2">
                                                Estado Documento
                                            </p>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${
                                                venta.estado === 'APROBADO'
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                                    : venta.estado === 'PENDIENTE'
                                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                                                    : venta.estado === 'CANCELADO'
                                                    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                                            }`}>
                                                {venta.estado}
                                            </span>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-zinc-700/50 rounded-lg p-4">
                                            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-2">
                                                Estado Entrega
                                            </p>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${
                                                venta.estado_entrega === 'ENTREGADO'
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                                    : venta.estado_entrega === 'NOVEDAD'
                                                    ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
                                                    : venta.estado_entrega === 'RECHAZADO'
                                                    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                                            }`}>
                                                {venta.estado_entrega || 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Tipo de Entrega */}
                                {venta.tipo_entrega && (
                                    <div className="border-t border-gray-200 dark:border-zinc-700 pt-4">
                                        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                            <span>📦</span> Tipo de Entrega
                                        </h3>
                                        <span className={`px-4 py-2 rounded-full text-sm font-semibold inline-block ${
                                            venta.tipo_entrega === 'COMPLETA'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                                : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
                                        }`}>
                                            {venta.tipo_entrega}
                                        </span>
                                    </div>
                                )}

                                {/* Contexto de Entrega */}
                                <div className="border-t border-gray-200 dark:border-zinc-700 pt-4">
                                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                        <span>🏪</span> Contexto de Entrega
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="bg-gray-50 dark:bg-zinc-700/50 rounded-lg p-4">
                                            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-2">
                                                Tienda
                                            </p>
                                            {venta.tienda_abierta !== null ? (
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${
                                                    venta.tienda_abierta
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                                }`}>
                                                    {venta.tienda_abierta ? '✓ Abierta' : '✗ Cerrada'}
                                                </span>
                                            ) : (
                                                <span className="text-gray-500 dark:text-gray-400">-</span>
                                            )}
                                        </div>
                                        <div className="bg-gray-50 dark:bg-zinc-700/50 rounded-lg p-4">
                                            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-2">
                                                Cliente
                                            </p>
                                            {venta.cliente_presente !== null ? (
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${
                                                    venta.cliente_presente
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                                }`}>
                                                    {venta.cliente_presente ? '✓ Presente' : '✗ Ausente'}
                                                </span>
                                            ) : (
                                                <span className="text-gray-500 dark:text-gray-400">-</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Tipo de Novedad */}
                                {venta.tipo_novedad && (
                                    <div className="border-t border-gray-200 dark:border-zinc-700 pt-4">
                                        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                            <span>⚠️</span> Tipo de Novedad
                                        </h3>
                                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                                            <p className="text-red-800 dark:text-red-300 font-medium">
                                                {venta.tipo_novedad.replace(/_/g, ' ')}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Estado de Pago */}
                                {venta.estado_pago && (
                                    <div className="border-t border-gray-200 dark:border-zinc-700 pt-4">
                                        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                            <span>💰</span> Estado de Pago
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div className="bg-gray-50 dark:bg-zinc-700/50 rounded-lg p-4">
                                                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-2">
                                                    Estado
                                                </p>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${
                                                    venta.estado_pago === 'PAGADO'
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                                        : venta.estado_pago === 'PARCIAL'
                                                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                                                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                                }`}>
                                                    {venta.estado_pago}
                                                </span>
                                            </div>
                                            {venta.total_dinero_recibido > 0 && (
                                                <div className="bg-gray-50 dark:bg-zinc-700/50 rounded-lg p-4">
                                                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-2">
                                                        Monto Recibido
                                                    </p>
                                                    <p className="text-sm font-medium text-green-600 dark:text-green-400">
                                                        {formatCurrencyWith2Decimals(venta.total_dinero_recibido)}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        {venta.monto_pendiente > 0 && (
                                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mt-3">
                                                <p className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase mb-1">
                                                    Monto Pendiente
                                                </p>
                                                <p className="text-lg font-bold text-red-700 dark:text-red-300">
                                                    {formatCurrencyWith2Decimals(venta.monto_pendiente)}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Observaciones */}
                                {venta.observaciones_logistica && (
                                    <div className="border-t border-gray-200 dark:border-zinc-700 pt-4">
                                        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                            <span>📝</span> Observaciones de Logística
                                        </h3>
                                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                            <p className="text-blue-900 dark:text-blue-100 text-sm leading-relaxed">
                                                {venta.observaciones_logistica}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="sticky bottom-0 bg-gray-50 dark:bg-zinc-700/50 border-t border-gray-200 dark:border-zinc-700 px-6 py-3 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium transition"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
