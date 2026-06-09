import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/presentation/components/ui/dialog';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { AlertTriangle, Loader2, CheckCircle } from 'lucide-react';
import { useStockRecorredor, type StockCorrectoResult } from '@/application/hooks/use-stock-recorredor';

interface StockRecorrectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    movimientoIdInicial?: number;
}

const StockRecorrectorModal: React.FC<StockRecorrectorModalProps> = ({
    isOpen,
    onClose,
    movimientoIdInicial = 0,
}) => {
    const [movimientoId, setMovimientoId] = useState<string>(movimientoIdInicial?.toString() || '');
    const [resultado, setResultado] = useState<StockCorrectoResult | null>(null);
    const [localError, setLocalError] = useState<string | null>(null);
    const { recorrerStock, isLoading, error } = useStockRecorredor();

    // Sincronizar movimientoIdInicial cuando cambie
    useEffect(() => {
        if (movimientoIdInicial && movimientoIdInicial > 0) {
            setMovimientoId(movimientoIdInicial.toString());
        }
    }, [movimientoIdInicial, isOpen]);

    const handleRecorrer = async () => {
        if (!movimientoId.trim()) {
            setLocalError('Por favor ingresa el ID del movimiento');
            return;
        }

        setLocalError(null);
        setResultado(null);

        const resultado = await recorrerStock(parseInt(movimientoId));
        if (resultado) {
            setResultado(resultado);
        } else {
            setLocalError(error);
        }
    };

    const handleClose = () => {
        setMovimientoId('');
        setResultado(null);
        setLocalError(null);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="w-full max-w-4xl h-screen max-h-[90vh] flex flex-col p-0 gap-0">
                <DialogHeader className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <DialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        Recorredor de Stock Correcto
                    </DialogTitle>
                    <DialogDescription>
                        Calcula los valores correctos considerando la lógica de cada tipo de movimiento
                    </DialogDescription>
                </DialogHeader>

                <div className="overflow-y-auto flex-1 px-6 py-6 space-y-6">
                    {/* Formulario de entrada */}
                    {!resultado && (
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    ID del Movimiento Inicial
                                </label>
                                <Input
                                    type="number"
                                    placeholder="Ej: 17339"
                                    value={movimientoId}
                                    onChange={(e) => {
                                        setMovimientoId(e.target.value);
                                        setLocalError(null);
                                    }}
                                    disabled={isLoading}
                                    className="mt-2 text-base"
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                    Ingresa el ID del movimiento desde donde quieres comenzar el cálculo
                                </p>
                            </div>

                            {(localError || error) && (
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 sm:p-4">
                                    <p className="text-xs sm:text-sm text-red-700 dark:text-red-400">{localError || error}</p>
                                </div>
                            )}

                            <Button
                                onClick={handleRecorrer}
                                disabled={isLoading || !movimientoId.trim()}
                                className="w-full"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Calculando...
                                    </>
                                ) : (
                                    'Calcular Stock Correcto'
                                )}
                            </Button>
                        </div>
                    )}

                    {/* Resultado */}
                    {resultado && (
                        <div className="space-y-4">
                            {/* Advertencias si existen */}
                            {resultado.advertencias && resultado.advertencias.length > 0 && (
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 sm:p-4">
                                    <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2 flex items-center gap-2">
                                        <span className="text-lg">⚠️</span>
                                        Advertencias en Datos Iniciales
                                    </h3>
                                    <ul className="space-y-1 text-xs sm:text-sm text-red-700 dark:text-red-400">
                                        {resultado.advertencias.map((adv, idx) => (
                                            <li key={idx} className="flex gap-2">
                                                <span className="text-red-600 dark:text-red-400 font-bold">•</span>
                                                <span>{adv}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <p className="text-xs text-red-600 dark:text-red-400 mt-2 italic">
                                        Estos datos en BD necesitan corrección manual
                                    </p>
                                </div>
                            )}

                            {/* Información del movimiento */}
                            <div className="space-y-3">
                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 sm:p-4">
                                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 text-sm sm:text-base">
                                        Movimiento Inicial
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                                        <div className="bg-white dark:bg-gray-800/50 p-2 rounded">
                                            <p className="text-gray-600 dark:text-gray-400 text-xs">ID</p>
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                {resultado.movimiento_inicial.id}
                                            </p>
                                        </div>
                                        <div className="bg-white dark:bg-gray-800/50 p-2 rounded">
                                            <p className="text-gray-600 dark:text-gray-400 text-xs">Tipo</p>
                                            <p className="font-semibold text-gray-900 dark:text-white truncate">
                                                {resultado.movimiento_inicial.tipo}
                                            </p>
                                        </div>
                                        <div className="bg-white dark:bg-gray-800/50 p-2 rounded">
                                            <p className="text-gray-600 dark:text-gray-400 text-xs">SKU</p>
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                {resultado.movimiento_inicial.sku}
                                            </p>
                                        </div>
                                        <div className="bg-white dark:bg-gray-800/50 p-2 rounded">
                                            <p className="text-gray-600 dark:text-gray-400 text-xs">Producto</p>
                                            <p className="font-semibold text-gray-900 dark:text-white text-xs truncate" title={resultado.movimiento_inicial.nombre}>
                                                {resultado.movimiento_inicial.nombre}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-3 sm:p-4">
                                    <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-3 text-sm sm:text-base">
                                        Movimiento Final (Hasta)
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-sm">
                                        <div className="bg-white dark:bg-gray-800/50 p-2 rounded">
                                            <p className="text-gray-600 dark:text-gray-400 text-xs">ID</p>
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                {resultado.movimiento_final.id}
                                            </p>
                                        </div>
                                        <div className="bg-white dark:bg-gray-800/50 p-2 rounded">
                                            <p className="text-gray-600 dark:text-gray-400 text-xs">Tipo</p>
                                            <p className="font-semibold text-gray-900 dark:text-white truncate">
                                                {resultado.movimiento_final.tipo}
                                            </p>
                                        </div>
                                        <div className="bg-white dark:bg-gray-800/50 p-2 rounded">
                                            <p className="text-gray-600 dark:text-gray-400 text-xs">Fecha</p>
                                            <p className="font-semibold text-gray-900 dark:text-white text-xs">
                                                {new Date(resultado.movimiento_final.fecha).toLocaleDateString('es-ES')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Stock final correcto */}
                            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 sm:p-4">
                                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                                    <h3 className="font-semibold text-green-900 dark:text-green-100 text-sm sm:text-base">
                                        Stock Final Correcto ({resultado.total_movimientos} mov.)
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 mb-3 sm:mb-4">
                                    <div className="bg-white dark:bg-gray-800 rounded-lg p-2.5 sm:p-3">
                                        <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-1">TOTAL</p>
                                        <p className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                                            {resultado.stock_final_correcto.total.toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 rounded-lg p-2.5 sm:p-3">
                                        <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-1">DISPONIBLE</p>
                                        <p className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
                                            {resultado.stock_final_correcto.disponible.toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 rounded-lg p-2.5 sm:p-3">
                                        <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-1">RESERVADO</p>
                                        <p className="text-xl sm:text-2xl font-bold text-orange-600 dark:text-orange-400">
                                            {resultado.stock_final_correcto.reservado.toFixed(2)}
                                        </p>
                                    </div>
                                </div>

                                {resultado.stock_final_correcto.invariante ? (
                                    <p className="text-xs sm:text-sm text-green-600 dark:text-green-400 font-semibold break-words">
                                        ✓ Invariante: {resultado.stock_final_correcto.total} = {resultado.stock_final_correcto.disponible} + {resultado.stock_final_correcto.reservado}
                                    </p>
                                ) : (
                                    <p className="text-xs sm:text-sm text-red-600 dark:text-red-400 font-semibold">
                                        ✗ Invariante inválido
                                    </p>
                                )}
                            </div>

                            {/* Trace de movimientos */}
                            <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm sm:text-base">Recorrido de Movimientos</h3>
                                <div className="space-y-2">
                                    {resultado.trace.map((mov, idx) => (
                                        <div
                                            key={mov.id}
                                            className={`p-2.5 sm:p-3 rounded-lg text-xs ${
                                                mov.tiene_error
                                                    ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
                                                    : mov.invariante_ok
                                                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                                                    : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                                            }`}
                                        >
                                            <div className="flex justify-between items-start gap-2 mb-2">
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-gray-900 dark:text-white truncate">
                                                        #{mov.id} - {mov.tipo}
                                                    </p>
                                                    <p className="text-gray-600 dark:text-gray-400 text-xs">Cambio: {mov.cambio >= 0 ? '+' : ''}{mov.cambio}</p>
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    {mov.tiene_error && <span className="block text-yellow-600 dark:text-yellow-400 font-bold">⚠️</span>}
                                                    {mov.invariante_ok && !mov.tiene_error && <span className="text-green-600 dark:text-green-400 font-bold">✓</span>}
                                                    {!mov.invariante_ok && !mov.tiene_error && <span className="text-red-600 dark:text-red-400 font-bold">✗</span>}
                                                </div>
                                            </div>

                                            <div className="space-y-1.5 text-xs">
                                                <div className="bg-white dark:bg-gray-800/30 rounded p-1.5">
                                                    <p className="text-gray-600 dark:text-gray-400 font-medium mb-0.5">Anterior</p>
                                                    <p className="font-mono text-xs text-gray-900 dark:text-gray-100 break-words">
                                                        T:{mov.valores_anteriores.total} | D:{mov.valores_anteriores.disponible} | R:{mov.valores_anteriores.reservada}
                                                    </p>
                                                </div>
                                                <div className="bg-white dark:bg-gray-800/30 rounded p-1.5">
                                                    <p className="text-gray-600 dark:text-gray-400 font-medium mb-0.5">Posterior</p>
                                                    <p className="font-mono text-xs text-gray-900 dark:text-gray-100 break-words">
                                                        T:{mov.valores_posteriores.total} | D:{mov.valores_posteriores.disponible} | R:{mov.valores_posteriores.reservada}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Botones de acción */}
                            <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setResultado(null);
                                        setMovimientoId('');
                                    }}
                                    className="flex-1 text-sm"
                                >
                                    Calcular Otro
                                </Button>
                                <Button onClick={handleClose} className="flex-1 text-sm">
                                    Cerrar
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default StockRecorrectorModal;
