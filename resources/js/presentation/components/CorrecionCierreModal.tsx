import React, { useState } from 'react';
import { X } from 'lucide-react';

interface CorrecionCierreModalProps {
    show: boolean;
    onClose: () => void;
    cierreId: number;
    montoActual: number;
    montoEsperado: number;
    onSuccess?: () => void;
}

/**
 * Modal para que el cajero corrija un cierre de caja rechazado
 *
 * Permite:
 * - Ingresar un nuevo monto real
 * - Ver la diferencia en tiempo real
 * - Agregar observaciones sobre la corrección
 */
export function CorrecionCierreModal({
    show,
    onClose,
    cierreId,
    montoActual,
    montoEsperado,
    onSuccess
}: CorrecionCierreModalProps) {
    const [montoReal, setMontoReal] = useState(montoActual);
    const [observaciones, setObservaciones] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const nuevaDiferencia = montoReal - montoEsperado;
    const diferenciaAnterior = montoActual - montoEsperado;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`/cajas/cierres/${cierreId}/corregir`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
                body: JSON.stringify({
                    monto_real: montoReal,
                    observaciones: observaciones.trim() || null,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al corregir el cierre');
            }

            // Éxito
            setMontoReal(montoActual);
            setObservaciones('');
            onClose();

            if (onSuccess) {
                onSuccess();
            }

            // Recargar página o mostrar notificación
            window.location.reload();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full mx-4">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        🔧 Corregir Cierre de Caja
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                            <p className="text-sm text-red-700 dark:text-red-300">
                                ❌ {error}
                            </p>
                        </div>
                    )}

                    {/* Monto Esperado - Solo lectura */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Monto Esperado
                        </label>
                        <input
                            type="text"
                            disabled
                            value={`$${montoEsperado.toFixed(2)}`}
                            className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Este es el monto que debería tener la caja
                        </p>
                    </div>

                    {/* Monto Anterior - Solo lectura */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Monto Anterior
                        </label>
                        <input
                            type="text"
                            disabled
                            value={`$${montoActual.toFixed(2)}`}
                            className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100"
                        />
                        <p className={`text-xs mt-1 font-medium ${diferenciaAnterior !== 0 ? diferenciaAnterior > 0 ? 'text-green-600' : 'text-red-600' : 'text-gray-500'}`}>
                            {diferenciaAnterior !== 0 ? (
                                <>
                                    {diferenciaAnterior > 0 ? '✅ Sobrante: ' : '❌ Faltante: '}
                                    ${Math.abs(diferenciaAnterior).toFixed(2)}
                                </>
                            ) : (
                                'Sin diferencia'
                            )}
                        </p>
                    </div>

                    {/* Nuevo Monto Real - Editable */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Nuevo Monto Real *
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            value={montoReal}
                            onChange={(e) => setMontoReal(parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    {/* Nueva Diferencia */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Nueva Diferencia
                        </p>
                        <p className={`text-lg font-bold ${nuevaDiferencia !== 0 ? nuevaDiferencia > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
                            {nuevaDiferencia !== 0 ? (
                                <>
                                    {nuevaDiferencia > 0 ? '✅ Sobrante: ' : '❌ Faltante: '}
                                    ${Math.abs(nuevaDiferencia).toFixed(2)}
                                </>
                            ) : (
                                '✅ Sin diferencia'
                            )}
                        </p>
                    </div>

                    {/* Observaciones */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Observaciones (opcional)
                        </label>
                        <textarea
                            value={observaciones}
                            onChange={(e) => setObservaciones(e.target.value)}
                            placeholder="Explica qué corregiste y por qué..."
                            rows={3}
                            maxLength={500}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {observaciones.length}/500 caracteres
                        </p>
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md font-medium disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading || montoReal === montoActual}
                            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium disabled:opacity-50"
                        >
                            {loading ? '⏳ Enviando...' : '✅ Corregir'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CorrecionCierreModal;
