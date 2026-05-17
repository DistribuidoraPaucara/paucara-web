import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog';
import { CheckCircle2, AlertCircle, XCircle, Loader2, RefreshCw } from 'lucide-react';
import { Badge } from '@/presentation/components/ui/badge';
import { useState } from 'react';
import { toast } from 'react-toastify';

interface DetalleReversionModalProps {
    isOpen: boolean;
    onClose: () => void;
    data?: {
        venta_id?: number;
        venta_numero: string;
        venta_estado: string;
        reversión_completa: boolean;
        estado: 'completa' | 'incompleta' | 'sin_reversiones' | 'sin_movimientos';
        movimientos_original: Record<string, number>;
        movimientos_revercion: Record<string, number>;
        detalles: Array<{
            stock_producto_id: number;
            producto_nombre: string;
            cantidad_original: number;
            cantidad_revercion: number | null;
            match: boolean;
            estado: string;
        }>;
    };
    onReversionExecuted?: () => void;
}

export default function DetalleReversionModal({ isOpen, onClose, data, onReversionExecuted }: DetalleReversionModalProps) {
    const [isEjecutando, setIsEjecutando] = useState(false);

    if (!data) return null;

    // 🔍 DEBUG: Log estado del modal
    console.log('📊 [DetalleReversionModal] Datos recibidos:', {
        venta_id: data.venta_id,
        venta_numero: data.venta_numero,
        estado: data.estado,
        reversión_completa: data.reversión_completa,
        movimientos_original: data.movimientos_original,
        movimientos_revercion: data.movimientos_revercion,
        detalles_count: data.detalles?.length,
    });
    console.log('✅ Estado para botón:', {
        mostrar_boton: data.estado === 'incompleta' || data.estado === 'sin-reversiones',
        estado: data.estado,
        es_incompleta: data.estado === 'incompleta',
        es_sin_reversiones: data.estado === 'sin-reversiones',
    });

    const getEstadoIcon = () => {
        switch (data.estado) {
            case 'completa':
                return <CheckCircle2 className="w-5 h-5 text-green-600" />;
            case 'incompleta':
                return <AlertCircle className="w-5 h-5 text-yellow-600" />;
            case 'sin_reversiones':
                return <XCircle className="w-5 h-5 text-red-600" />;
            default:
                return <AlertCircle className="w-5 h-5 text-gray-600" />;
        }
    };

    const getEstadoColor = () => {
        switch (data.estado) {
            case 'completa':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200';
            case 'incompleta':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200';
            case 'sin_reversiones':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200';
        }
    };

    // ✅ NUEVO (2026-02-10): Función para ejecutar reversión manualmente
    const handleEjecutarReversion = async () => {
        if (!data?.venta_id) {
            toast.error('No se puede ejecutar reversión: ID de venta no disponible');
            return;
        }

        if (!window.confirm('¿Ejecutar reversión de stock para esta venta?\n\nEsto registrará los movimientos faltantes.')) {
            return;
        }

        setIsEjecutando(true);
        try {
            // PASO 1: Ejecutar reversión
            const response = await fetch(`/api/ventas/${data.venta_id}/ejecutar-reversion-stock`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            const result = await response.json();

            if (!response.ok) {
                toast.error(result.message || 'Error al ejecutar reversión');
                return;
            }

            toast.success(result.message || 'Reversión ejecutada exitosamente');

            // PASO 2: Re-verificar reversión para obtener datos actualizados
            try {
                const verifyResponse = await fetch(`/api/ventas/${data.venta_id}/verificar-reversion-stock`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    },
                });

                if (verifyResponse.ok) {
                    const verifyData = await verifyResponse.json();
                    // Actualizar datos del modal con la verificación nueva
                    if (verifyData.success) {
                        console.log('✅ Reversión verificada. Estado actualizado:', verifyData.estado);
                        // El componente se volverá a renderizar con los datos nuevos si se actualizan en el padre
                    }
                }
            } catch (verifyError) {
                console.warn('Advertencia al re-verificar reversión:', verifyError);
                // No es crítico si falla la verificación, la reversión se ejecutó
            }

            // PASO 3: Notificar al componente padre para recargar datos
            if (onReversionExecuted) {
                // Esperar un poco para que el usuario vea el mensaje de éxito
                setTimeout(() => {
                    onReversionExecuted();
                }, 1500);
            } else {
                // Si no hay callback, cerrar el modal
                setTimeout(() => {
                    onClose();
                }, 1500);
            }

        } catch (error) {
            console.error('Error ejecutando reversión:', error);
            toast.error('Error al ejecutar reversión de stock');
        } finally {
            setIsEjecutando(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-96 overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {getEstadoIcon()}
                        Auditoría de Reversión de Stock - {data.venta_numero}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Estado General */}
                    <div className={`p-4 rounded-lg ${getEstadoColor()}`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold">Estado de Reversión</h3>
                                <p className="text-sm opacity-90">
                                    {data.reversión_completa ? '✅ Reversión Completa y Correcta' : '⚠️ Reversión Incompleta o Faltante'}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-lg">
                                    {data.estado === 'completa' ? '✅' : data.estado === 'incompleta' ? '⚠️' : '❌'}
                                </Badge>
                                {/* ✅ NUEVO (2026-02-10): Botón para ejecutar reversión si es necesario */}
                                {(data.estado === 'incompleta' || data.estado === 'sin_reversiones') && (
                                    <button
                                        onClick={handleEjecutarReversion}
                                        disabled={isEjecutando}
                                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                                            isEjecutando
                                                ? 'bg-blue-300 text-white cursor-not-allowed opacity-50'
                                                : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
                                        }`}
                                        title="Ejecutar reversión de stock manualmente"
                                    >
                                        {isEjecutando ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Ejecutando...
                                            </>
                                        ) : (
                                            <>
                                                <RefreshCw className="w-4 h-4" />
                                                Ejecutar Reversión
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Resumen de Movimientos */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <h4 className="font-semibold text-sm text-blue-900 dark:text-blue-200">
                                Movimientos Originales
                            </h4>
                            <div className="mt-2 space-y-1 text-sm">
                                {Object.entries(data.movimientos_original).map(([tipo, cantidad]) => (
                                    <div key={tipo} className="flex justify-between">
                                        <span className="text-blue-700 dark:text-blue-300">{tipo}:</span>
                                        <span className="font-mono font-semibold text-blue-900 dark:text-blue-200">
                                            {cantidad}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                            <h4 className="font-semibold text-sm text-green-900 dark:text-green-200">
                                Movimientos de Reversión
                            </h4>
                            <div className="mt-2 space-y-1 text-sm">
                                {Object.entries(data.movimientos_revercion).length > 0 ? (
                                    Object.entries(data.movimientos_revercion).map(([tipo, cantidad]) => (
                                        <div key={tipo} className="flex justify-between">
                                            <span className="text-green-700 dark:text-green-300">{tipo}:</span>
                                            <span className="font-mono font-semibold text-green-900 dark:text-green-200">
                                                +{cantidad}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-red-600 dark:text-red-400">❌ Sin reversiones registradas</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Detalle por Producto */}
                    <div className="border rounded-lg overflow-hidden">
                        <h4 className="font-semibold p-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
                            Detalle de Reversiones por Producto
                        </h4>
                        <div className="divide-y">
                            {data.detalles.map((detalle, idx) => (
                                <div key={idx} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1">
                                            <p className="font-medium text-sm text-gray-900 dark:text-white">
                                                {detalle.producto_nombre}
                                            </p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                Stock ID: {detalle.stock_producto_id}
                                            </p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            {detalle.match ? (
                                                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                                            ) : (
                                                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-2 flex items-center justify-between text-xs font-mono">
                                        <span className={detalle.cantidad_original < 0 ? 'text-red-600 dark:text-red-400' : ''}>
                                            Original: {detalle.cantidad_original}
                                        </span>
                                        <span className="text-gray-500 dark:text-gray-400">→</span>
                                        <span className={detalle.cantidad_revercion && detalle.cantidad_revercion > 0 ? 'text-green-600 dark:text-green-400' : ''}>
                                            Reversión: {detalle.cantidad_revercion !== null ? `+${detalle.cantidad_revercion}` : 'N/A'}
                                        </span>
                                    </div>
                                    <div className="mt-2">
                                        <Badge
                                            variant={detalle.match ? 'default' : 'destructive'}
                                            className="text-xs"
                                        >
                                            {detalle.estado}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Nota de Auditoría */}
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 text-sm text-blue-900 dark:text-blue-200">
                        <p className="font-semibold mb-1">📋 Nota de Auditoría:</p>
                        <p>
                            Esta verificación compara los movimientos originales (CONSUMO_RESERVA o SALIDA_VENTA)
                            con sus correspondientes reversiones (ENTRADA_AJUSTE). Si todas las cantidades coinciden,
                            la reversión de stock fue correcta.
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
