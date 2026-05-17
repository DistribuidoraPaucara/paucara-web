import React from 'react';
import type { Producto } from '@/domain/entities/ventas';

interface FarmaciaMedicamentoModalProps {
    producto: Producto | null;
    onClose: () => void;
}

export default function FarmaciaMedicamentoModal({
    producto,
    onClose
}: FarmaciaMedicamentoModalProps) {
    if (!producto) return null;

    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-xl max-w-md w-full">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-900 dark:to-blue-800 px-6 py-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <span>💊</span> Información de Medicamento
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-gray-200 text-xl"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    {/* Nombre del producto */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Producto</h4>
                        <p className="text-base text-gray-900 dark:text-white font-medium">{producto.nombre}</p>
                    </div>

                    {/* Principio activo */}
                    {producto.principio_activo && (
                        <div>
                            <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Principio Activo</h4>
                            <p className="text-sm text-gray-700 dark:text-gray-200 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded border border-blue-200 dark:border-blue-800">
                                {producto.principio_activo}
                            </p>
                        </div>
                    )}

                    {/* Uso de medicación */}
                    {producto.uso_de_medicacion && (
                        <div>
                            <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Uso / Indicaciones</h4>
                            <p className="text-sm text-gray-700 dark:text-gray-200 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded border border-green-200 dark:border-green-800">
                                {producto.uso_de_medicacion}
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 dark:bg-zinc-700 px-6 py-4 flex justify-end rounded-b-lg">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-500 font-medium text-sm"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}
