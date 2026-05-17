import { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, Loader } from 'lucide-react';
import { Card } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';

interface EntregaCreada {
    id: number;
    numero_entrega: string;
    zona_id: number | null;
    ventas_count: number;
    ventas: Array<{
        id: number;
        numero: string;
        cliente: string;
        total: number;
    }>;
    vehiculo: {
        id: number;
        placa: string;
    };
    chofer: {
        id: number;
        nombre: string;
    };
    peso_kg: number;
    volumen_m3: number;
}

interface VentaPendiente {
    id: number;
    numero: string;
    cliente: string;
    total: number;
    motivo: string;
}

interface ErrorConsolidacion {
    zona_id: number | null;
    mensaje: string;
    ventas: Array<string | number>;
}

interface ConsolidacionResponse {
    success: boolean;
    message: string;
    entregas_creadas: EntregaCreada[];
    ventas_pendientes: VentaPendiente[];
    errores: ErrorConsolidacion[];
    total_entregas_creadas: number;
    total_ventas_pendientes: number;
}

interface ConsolidacionAutomaticaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConsolidacionComplete?: () => void;
}

export default function ConsolidacionAutomaticaModal({
    isOpen,
    onClose,
    onConsolidacionComplete,
}: ConsolidacionAutomaticaModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [resultado, setResultado] = useState<ConsolidacionResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleConsolidar = async () => {
        setIsLoading(true);
        setError(null);
        setResultado(null);

        try {
            const response = await fetch('/api/entregas/consolidar-automatico', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
            });

            const data: ConsolidacionResponse = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al consolidar entregas');
            }

            setResultado(data);

            // Llamar callback opcional
            if (onConsolidacionComplete && data.success) {
                onConsolidacionComplete();
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setError(errorMessage);
            console.error('Error en consolidación automática:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerEntregas = () => {
        window.location.href = '/logistica/entregas';
    };

    const handleCrearMas = () => {
        setResultado(null);
        setError(null);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto dark:bg-slate-900">
                {/* Header */}
                <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 dark:border-slate-700 p-6 bg-white dark:bg-slate-900">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {!resultado && !error ? 'Consolidación Automática' : 'Resultados de Consolidación'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Initial State - Before consolidation */}
                    {!isLoading && !resultado && !error && (
                        <div className="space-y-4">
                            <p className="text-gray-700 dark:text-gray-300">
                                Esto consolidará automáticamente todas las ventas pendientes agrupadas por zona,
                                asignando vehículos y choferes disponibles de forma inteligente.
                            </p>
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                <p className="text-sm text-blue-800 dark:text-blue-200">
                                    <strong>Nota:</strong> Las ventas que no puedan consolidarse (sin vehículos o
                                    choferes disponibles) serán marcadas como pendientes para asignación manual.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <Loader className="h-12 w-12 text-blue-600 animate-spin" />
                            <p className="text-gray-600 dark:text-gray-400 text-lg">
                                Consolidando entregas automáticamente...
                            </p>
                        </div>
                    )}

                    {/* Error State */}
                    {error && !resultado && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold text-red-900 dark:text-red-100">Error</h3>
                                    <p className="text-sm text-red-800 dark:text-red-200 mt-1">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Results */}
                    {resultado && (
                        <div className="space-y-6">
                            {/* Summary */}
                            <div className="grid grid-cols-3 gap-4">
                                <Card className="p-4 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                                    <p className="text-sm text-green-700 dark:text-green-300">Entregas Creadas</p>
                                    <p className="text-3xl font-bold text-green-900 dark:text-green-100 mt-2">
                                        {resultado.total_entregas_creadas}
                                    </p>
                                </Card>
                                <Card className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                                    <p className="text-sm text-yellow-700 dark:text-yellow-300">Pendientes</p>
                                    <p className="text-3xl font-bold text-yellow-900 dark:text-yellow-100 mt-2">
                                        {resultado.total_ventas_pendientes}
                                    </p>
                                </Card>
                                <Card className="p-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                                    <p className="text-sm text-red-700 dark:text-red-300">Errores</p>
                                    <p className="text-3xl font-bold text-red-900 dark:text-red-100 mt-2">
                                        {resultado.errores.length}
                                    </p>
                                </Card>
                            </div>

                            {/* Success Message */}
                            {resultado.success && resultado.total_entregas_creadas > 0 && (
                                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h3 className="font-semibold text-green-900 dark:text-green-100">
                                                ¡Consolidación completada!
                                            </h3>
                                            <p className="text-sm text-green-800 dark:text-green-200 mt-1">
                                                {resultado.message}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Entregas Creadas */}
                            {resultado.entregas_creadas.length > 0 && (
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                                        Entregas Creadas ({resultado.entregas_creadas.length})
                                    </h3>
                                    <div className="space-y-3">
                                        {resultado.entregas_creadas.map((entrega) => (
                                            <Card
                                                key={entrega.id}
                                                className="p-4 bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800"
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <p className="font-semibold text-gray-900 dark:text-white">
                                                            {entrega.numero_entrega}
                                                        </p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                            {entrega.ventas_count} venta{entrega.ventas_count > 1 ? 's' : ''} •{' '}
                                                            {entrega.peso_kg.toFixed(1)} kg • {entrega.volumen_m3.toFixed(1)} m³
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            {entrega.vehiculo.placa}
                                                        </p>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            {entrega.chofer.name}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="mt-2 flex flex-wrap gap-1">
                                                    {entrega.ventas.map((venta) => (
                                                        <span
                                                            key={venta.id}
                                                            className="inline-block text-xs bg-green-200 dark:bg-green-900 text-green-900 dark:text-green-100 px-2 py-1 rounded"
                                                        >
                                                            {venta.numero}
                                                        </span>
                                                    ))}
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Ventas Pendientes */}
                            {resultado.ventas_pendientes.length > 0 && (
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                                        Ventas Pendientes de Asignación ({resultado.ventas_pendientes.length})
                                    </h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-gray-200 dark:border-slate-700">
                                                    <th className="text-left py-2 px-3 font-semibold text-gray-700 dark:text-gray-300">
                                                        Venta
                                                    </th>
                                                    <th className="text-left py-2 px-3 font-semibold text-gray-700 dark:text-gray-300">
                                                        Cliente
                                                    </th>
                                                    <th className="text-right py-2 px-3 font-semibold text-gray-700 dark:text-gray-300">
                                                        Total
                                                    </th>
                                                    <th className="text-left py-2 px-3 font-semibold text-gray-700 dark:text-gray-300">
                                                        Motivo
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {resultado.ventas_pendientes.map((venta) => (
                                                    <tr
                                                        key={venta.id}
                                                        className="border-b border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50"
                                                    >
                                                        <td className="py-2 px-3 font-medium text-gray-900 dark:text-white">
                                                            {venta.numero}
                                                        </td>
                                                        <td className="py-2 px-3 text-gray-700 dark:text-gray-300">
                                                            {venta.cliente}
                                                        </td>
                                                        <td className="py-2 px-3 text-right text-gray-900 dark:text-white">
                                                            Bs. {venta.subtotal.toFixed(2)}
                                                        </td>
                                                        <td className="py-2 px-3 text-yellow-700 dark:text-yellow-300 text-xs">
                                                            {venta.motivo}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Errores */}
                            {resultado.errores.length > 0 && (
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                                        Errores ({resultado.errores.length})
                                    </h3>
                                    <div className="space-y-2">
                                        {resultado.errores.map((err, idx) => (
                                            <Card
                                                key={idx}
                                                className="p-3 bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800"
                                            >
                                                <p className="font-medium text-red-900 dark:text-red-100">
                                                    {err.mensaje}
                                                </p>
                                                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                                                    Ventas afectadas: {err.ventas.join(', ')}
                                                </p>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 flex gap-3 justify-end">
                    {!resultado && !error && (
                        <>
                            <Button onClick={onClose} variant="outline">
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleConsolidar}
                                disabled={isLoading}
                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 dark:bg-blue-700 dark:hover:bg-blue-600 dark:disabled:bg-gray-600 text-white"
                            >
                                {isLoading ? 'Consolidando...' : 'Consolidar Automáticamente'}
                            </Button>
                        </>
                    )}

                    {(resultado || error) && !isLoading && (
                        <>
                            <Button onClick={handleCrearMas} variant="outline">
                                Crear Más
                            </Button>
                            {resultado?.success && resultado?.entregas_creadas.length > 0 && (
                                <Button
                                    onClick={handleVerEntregas}
                                    className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white"
                                >
                                    Ver Entregas Creadas
                                </Button>
                            )}
                            {error && (
                                <Button
                                    onClick={handleConsolidar}
                                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white"
                                >
                                    Reintentar
                                </Button>
                            )}
                        </>
                    )}
                </div>
            </Card>
        </div>
    );
}
