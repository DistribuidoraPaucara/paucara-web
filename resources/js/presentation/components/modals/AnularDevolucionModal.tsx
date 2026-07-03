import React, { useState } from 'react';
import { Card } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { AlertCircle, X, Loader } from 'lucide-react';
import axios from 'axios';

interface AnularDevolucionModalProps {
    prestamo_id: number;
    devolucion_id: number;
    devolucion_numero: number;
    isOpen: boolean;
    onClose: () => void;
    onAnulada: () => void; // Callback después de anular exitosamente
    endpoint?: string; // Endpoint dinámico: /api/prestamos-cliente, /api/prestamos-evento, /api/prestamos-proveedor
}

export default function AnularDevolucionModal({
    prestamo_id,
    devolucion_id,
    devolucion_numero,
    isOpen,
    onClose,
    onAnulada,
    endpoint = '/api/prestamos-cliente', // Default endpoint
}: AnularDevolucionModalProps) {
    const [razonAnulacion, setRazonAnulacion] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAnular = async () => {
        if (!razonAnulacion.trim()) {
            setError('Por favor, ingresa una razón para la anulación');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            await axios.post(
                `${endpoint}/${prestamo_id}/devoluciones/${devolucion_id}/anular`,
                { razon_anulacion: razonAnulacion }
            );

            // Éxito: limpiar y cerrar
            setRazonAnulacion('');
            onAnulada(); // Callback para refrescar datos
            onClose();
        } catch (err: any) {
            const mensaje = err.response?.data?.message || 'Error al anular la devolución';
            setError(mensaje);
            console.error('❌ Error anulando devolución:', err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
                <div className="p-6">
                    {/* ENCABEZADO */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                Anular Devolución
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            disabled={loading}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* CONTENIDO */}
                    <div className="space-y-4">
                        {/* NÚMERO DE DEVOLUCIÓN */}
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-200">
                            <p className="text-sm font-medium text-red-800 dark:text-red-300">
                                ⚠️ Vas a anular la Devolución #{devolucion_numero}
                            </p>
                        </div>

                        {/* INFORMACIÓN */}
                        <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                            <p>
                                Al anular esta devolución:
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                                <li>Se revertirán todos los movimientos de stock</li>
                                <li>Las cantidades volverán a estado de deuda</li>
                                <li>Se registrará quién anuló y cuándo</li>
                                <li>Esta acción es irreversible</li>
                            </ul>
                        </div>

                        {/* CAMPO DE RAZÓN */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Razón de la Anulación *
                            </label>
                            <textarea
                                value={razonAnulacion}
                                onChange={(e) => {
                                    setRazonAnulacion(e.target.value);
                                    if (error) setError(null);
                                }}
                                placeholder="Ejemplo: Registro duplicado, Error de entrada, Etc."
                                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                rows={3}
                                disabled={loading}
                            />
                        </div>

                        {/* MENSAJE DE ERROR */}
                        {error && (
                            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-200">
                                <p className="text-sm text-red-800 dark:text-red-300">
                                    ❌ {error}
                                </p>
                            </div>
                        )}

                        {/* BOTONES */}
                        <div className="flex gap-3 pt-4">
                            <button
                                onClick={onClose}
                                disabled={loading}
                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleAnular}
                                disabled={loading || !razonAnulacion.trim()}
                                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader className="w-4 h-4 animate-spin" />
                                        Anulando...
                                    </>
                                ) : (
                                    '❌ Anular Devolución'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
