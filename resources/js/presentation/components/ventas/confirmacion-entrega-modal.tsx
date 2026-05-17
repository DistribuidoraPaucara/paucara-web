import React from 'react';
import { formatCurrencyWith2Decimals } from '@/lib/utils';

interface EntregaConfirmacion {
    id: number;
    venta_id: number;
    tipo_entrega?: 'COMPLETA' | 'NOVEDAD';
    tipo_novedad?: string;
    tuvo_problema?: boolean;
    tienda_abierta?: boolean;
    cliente_presente?: boolean;
    motivo_rechazo?: string;
    observaciones_logistica?: string;
    estado_pago?: 'PAGADO' | 'PARCIAL' | 'NO_PAGADO';
    total_dinero_recibido?: number;
    monto_pendiente?: number;
    confirmado_en?: string;
    created_at?: string;
}

interface ConfirmacionEntregaModalProps {
    isOpen: boolean;
    entrega?: EntregaConfirmacion;
    ventaNumero?: string;
    onClose: () => void;
}

export default function ConfirmacionEntregaModal({
    isOpen,
    entrega,
    ventaNumero,
    onClose,
}: ConfirmacionEntregaModalProps) {
    if (!isOpen || !entrega) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                <div className="bg-white dark:bg-slate-950 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-700 dark:from-emerald-900/70 dark:to-emerald-800/60 px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">✓</span>
                            <div>
                                <h2 className="text-lg font-bold text-white">
                                    Confirmación de Entrega
                                </h2>
                                {ventaNumero && (
                                    <p className="text-green-100 text-sm">
                                        Venta #{ventaNumero}
                                    </p>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:bg-green-500 p-2 rounded-lg transition"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Tipo de Entrega */}
                        <div className="border-b border-gray-200 dark:border-slate-800 pb-4">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-slate-50 mb-3 flex items-center gap-2">
                                <span>📦</span> Tipo de Entrega
                            </h3>
                            <span className={`px-4 py-2 rounded-full text-sm font-semibold inline-block ${
                                entrega.tipo_entrega === 'COMPLETA'
                                    ? 'bg-green-100 text-green-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                                    : 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-400'
                            }`}>
                                {entrega.tipo_entrega || 'N/A'}
                            </span>
                        </div>

                        {/* Contexto de Entrega */}
                        <div className="border-b border-gray-200 dark:border-slate-800 pb-4">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-slate-50 mb-3 flex items-center gap-2">
                                <span>🏪</span> Contexto de Entrega
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg p-4">
                                    <p className="text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase mb-2">
                                        Tienda
                                    </p>
                                    {entrega.tienda_abierta !== null && entrega.tienda_abierta !== undefined ? (
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${
                                            entrega.tienda_abierta
                                                ? 'bg-green-100 text-green-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                                                : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
                                        }`}>
                                            {entrega.tienda_abierta ? '✓ Abierta' : '✗ Cerrada'}
                                        </span>
                                    ) : (
                                        <span className="text-gray-500 dark:text-slate-400">-</span>
                                    )}
                                </div>
                                <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg p-4">
                                    <p className="text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase mb-2">
                                        Cliente
                                    </p>
                                    {entrega.cliente_presente !== null && entrega.cliente_presente !== undefined ? (
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${
                                            entrega.cliente_presente
                                                ? 'bg-green-100 text-green-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                                                : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
                                        }`}>
                                            {entrega.cliente_presente ? '✓ Presente' : '✗ Ausente'}
                                        </span>
                                    ) : (
                                        <span className="text-gray-500 dark:text-slate-400">-</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Tipo de Novedad */}
                        {entrega.tipo_novedad && (
                            <div className="border-b border-gray-200 dark:border-slate-800 pb-4">
                                <h3 className="text-sm font-bold text-gray-900 dark:text-slate-50 mb-3 flex items-center gap-2">
                                    <span>⚠️</span> Tipo de Novedad
                                </h3>
                                <div className="bg-orange-50 dark:bg-slate-800/50 border border-orange-200 dark:border-slate-700 rounded-lg p-4">
                                    <p className="text-orange-800 dark:text-orange-400 font-medium">
                                        {entrega.tipo_novedad.replace(/_/g, ' ')}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Motivo de Rechazo */}
                        {entrega.motivo_rechazo && (
                            <div className="border-b border-gray-200 dark:border-slate-800 pb-4">
                                <h3 className="text-sm font-bold text-gray-900 dark:text-slate-50 mb-3 flex items-center gap-2">
                                    <span>🚫</span> Motivo de Rechazo
                                </h3>
                                <div className="bg-red-50 dark:bg-slate-800/50 border border-red-200 dark:border-slate-700 rounded-lg p-4">
                                    <p className="text-red-800 dark:text-red-300 font-medium">
                                        {entrega.motivo_rechazo}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Estado de Pago */}
                        {entrega.estado_pago && (
                            <div className="border-b border-gray-200 dark:border-slate-800 pb-4">
                                <h3 className="text-sm font-bold text-gray-900 dark:text-slate-50 mb-3 flex items-center gap-2">
                                    <span>💰</span> Estado de Pago
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg p-4">
                                        <p className="text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase mb-2">
                                            Estado
                                        </p>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${
                                            entrega.estado_pago === 'PAGADO'
                                                ? 'bg-green-100 text-green-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                                                : entrega.estado_pago === 'PARCIAL'
                                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300'
                                                : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
                                        }`}>
                                            {entrega.estado_pago}
                                        </span>
                                    </div>
                                    {entrega.total_dinero_recibido && entrega.total_dinero_recibido > 0 && (
                                        <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg p-4">
                                            <p className="text-xs font-semibold text-gray-600 dark:text-slate-400 uppercase mb-2">
                                                Monto Recibido
                                            </p>
                                            <p className="text-sm font-medium text-green-600 dark:text-emerald-400">
                                                {formatCurrencyWith2Decimals(entrega.total_dinero_recibido)}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                {entrega.monto_pendiente && entrega.monto_pendiente > 0 && (
                                    <div className="bg-red-50 dark:bg-slate-800/50 border border-red-200 dark:border-slate-700 rounded-lg p-4 mt-3">
                                        <p className="text-xs font-semibold text-red-600 dark:text-red-300 uppercase mb-1">
                                            Monto Pendiente
                                        </p>
                                        <p className="text-lg font-bold text-red-700 dark:text-red-300">
                                            {formatCurrencyWith2Decimals(entrega.monto_pendiente)}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Observaciones */}
                        {entrega.observaciones_logistica && (
                            <div className="border-b border-gray-200 dark:border-slate-800 pb-4">
                                <h3 className="text-sm font-bold text-gray-900 dark:text-slate-50 mb-3 flex items-center gap-2">
                                    <span>📝</span> Observaciones de Logística
                                </h3>
                                <div className="bg-blue-50 dark:bg-slate-800/50 border border-blue-200 dark:border-slate-700 rounded-lg p-4">
                                    <p className="text-blue-900 dark:text-slate-100 text-sm leading-relaxed">
                                        {entrega.observaciones_logistica}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Fecha de Confirmación */}
                        {entrega.confirmado_en && (
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 dark:text-slate-50 mb-3 flex items-center gap-2">
                                    <span>🕐</span> Fecha de Confirmación
                                </h3>
                                <p className="text-sm text-gray-700 dark:text-slate-300">
                                    {new Date(entrega.confirmado_en).toLocaleDateString('es-BO', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="sticky bottom-0 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-200 dark:border-slate-800 px-6 py-3 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-900 dark:text-slate-50 rounded-lg font-medium transition"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
