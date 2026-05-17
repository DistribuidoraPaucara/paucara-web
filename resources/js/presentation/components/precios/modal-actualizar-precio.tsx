/**
 * Componente: ModalActualizarPrecioComponent
 * Modal para actualizar precios de productos
 */

import React, { useState } from 'react';
import { formatCurrency } from '@/lib/compras.utils';
import type { PrecioProductoDTO } from '@/domain/entities/precios';

interface ModalActualizarPrecioProps {
    precio: PrecioProductoDTO | null;
    isOpen: boolean;
    loading?: boolean;
    onClose: () => void;
    onGuardar: (precioNuevo: number, motivo: string) => Promise<void>;
}

export const ModalActualizarPrecioComponent: React.FC<ModalActualizarPrecioProps> = ({
    precio,
    isOpen,
    loading = false,
    onClose,
    onGuardar,
}) => {
    const [precioNuevo, setPrecioNuevo] = useState(precio?.precio_actual.toString() || '');
    const [motivo, setMotivo] = useState('');
    const [error, setError] = useState('');

    const handleGuardar = async () => {
        if (!precioNuevo.trim() || !motivo.trim()) {
            setError('Por favor completa todos los campos');
            return;
        }

        try {
            setError('');
            await onGuardar(parseFloat(precioNuevo), motivo);
            // Reset
            setPrecioNuevo('');
            setMotivo('');
            onClose();
        } catch (err: any) {
            setError(err.message || 'Error al actualizar precio');
        }
    };

    if (!isOpen || !precio) return null;

    const diferencia = parseFloat(precioNuevo) - precio.precio_actual;
    const esMayorPrecio = diferencia > 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70">
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl max-w-md w-full mx-4 border border-gray-200 dark:border-slate-700">
                <div className="bg-gray-100 dark:bg-slate-800 px-6 py-4 border-b border-gray-200 dark:border-slate-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-50">
                        Actualizar Precio - {precio.tipo.nombre}
                    </h2>
                </div>

                <div className="px-6 py-4 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded text-red-800 dark:text-red-200 text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                            Precio Anterior
                        </label>
                        <div className="text-2xl font-bold text-gray-900 dark:text-slate-50">
                            {formatCurrency(precio.precio_actual)}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                            Nuevo Precio
                        </label>
                        <input
                            type="number"
                            value={precioNuevo}
                            onChange={(e) => setPrecioNuevo(e.target.value)}
                            step="0.01"
                            min="0"
                            disabled={loading}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-50 placeholder-gray-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:focus:ring-blue-400 disabled:opacity-50"
                            placeholder="0.00"
                        />
                        {precioNuevo && (
                            <div className="mt-2 text-sm">
                                <span className="text-gray-600 dark:text-slate-400">Cambio: </span>
                                <span
                                    className={`font-semibold ${
                                        esMayorPrecio
                                            ? 'text-green-600 dark:text-green-400'
                                            : 'text-red-600 dark:text-red-400'
                                    }`}
                                >
                                    {esMayorPrecio ? '+' : ''}
                                    {formatCurrency(diferencia)}
                                </span>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                            Motivo del Cambio *
                        </label>
                        <textarea
                            value={motivo}
                            onChange={(e) => setMotivo(e.target.value)}
                            placeholder="Ej: Aumento de costo por compra, estrategia comercial, etc."
                            rows={3}
                            disabled={loading}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-50 placeholder-gray-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:focus:ring-blue-400 disabled:opacity-50"
                        />
                    </div>
                </div>

                <div className="bg-gray-50 dark:bg-slate-800 px-6 py-4 border-t border-gray-200 dark:border-slate-700 flex gap-2">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 px-4 py-2 bg-gray-300 dark:bg-slate-700 text-gray-800 dark:text-slate-200 rounded-lg hover:bg-gray-400 dark:hover:bg-slate-600 font-medium disabled:opacity-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleGuardar}
                        disabled={loading}
                        className="flex-1 px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 font-medium disabled:opacity-50 transition-colors"
                    >
                        {loading ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>
            </div>
        </div>
    );
};
