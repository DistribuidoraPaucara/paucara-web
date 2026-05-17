import React, { useState, useRef } from 'react';
import { X, AlertCircle, Loader, Lightbulb } from 'lucide-react';
import BarcodeScanner from 'react-qr-barcode-scanner';
import type { Result } from '@zxing/library';

interface Props {
    onClose: () => void;
    onDetected: (codigo: string) => Promise<void>;
}

interface ScannerState {
    status: 'ready' | 'processing' | 'success' | 'error';
    message: string;
    detectedCode?: string;
}

export default function ScannerCamaraModal({ onClose, onDetected }: Props) {
    const [state, setState] = useState<ScannerState>({
        status: 'ready',
        message: '✓ Apunta la cámara hacia el código de barras',
    });

    const [torchEnabled, setTorchEnabled] = useState(false);
    const detectedCodesRef = useRef<Set<string>>(new Set());

    // Manejar actualización de frames del scanner
    const handleUpdate = async (error: unknown, result?: Result) => {
        try {
            // Si hay error en la detección (no hay código en este frame), ignorar
            if (error) {
                return;
            }

            // Si no hay resultado, salir
            if (!result) {
                return;
            }

            // Obtener el código detectado
            const codigo = result.getText()?.trim();

            if (!codigo || codigo.length === 0) {
                return;
            }

            // Evitar procesar el mismo código múltiples veces
            if (detectedCodesRef.current.has(codigo)) {
                return;
            }

            // Registrar el código como detectado
            detectedCodesRef.current.add(codigo);

            // Actualizar estado
            setState({
                status: 'processing',
                message: 'Procesando código...',
                detectedCode: codigo,
            });

            // Procesar el código
            try {
                await onDetected(codigo);

                setState({
                    status: 'success',
                    message: `✓ Código detectado: ${codigo}`,
                    detectedCode: codigo,
                });

                // Cerrar automáticamente después de 2 segundos
                setTimeout(() => {
                    onClose();
                }, 2000);
            } catch (processError) {
                const errorMsg =
                    processError instanceof Error
                        ? processError.message
                        : 'Error desconocido';

                setState({
                    status: 'error',
                    message: `Error: ${errorMsg}`,
                    detectedCode: codigo,
                });

                console.error('Error procesando código:', processError);
            }
        } catch (err) {
            console.error('Error en handleUpdate:', err);
        }
    };

    // Manejar errores de cámara
    const handleError = (error: string | DOMException) => {
        console.error('Error en scanner de cámara:', error);

        const errorMsg =
            error instanceof DOMException
                ? error.message
                : String(error || 'Error desconocido');

        const isPermissionDenied =
            errorMsg.includes('Permission') ||
            errorMsg.includes('permission') ||
            errorMsg.includes('NotAllowedError') ||
            errorMsg.includes('NotAllowed') ||
            errorMsg.includes('denied');

        setState({
            status: 'error',
            message: isPermissionDenied
                ? 'Debes permitir acceso a la cámara en los permisos del navegador'
                : `Error de cámara: ${errorMsg}`,
        });
    };

    // Reintentar
    const handleRetry = () => {
        detectedCodesRef.current.clear();
        setState({
            status: 'ready',
            message: '✓ Apunta la cámara hacia el código de barras',
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'processing':
                return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
            case 'ready':
                return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
            case 'success':
                return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
            case 'error':
                return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
            default:
                return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800';
        }
    };

    const getStatusTextColor = (status: string) => {
        switch (status) {
            case 'processing':
                return 'text-blue-700 dark:text-blue-300';
            case 'ready':
            case 'success':
                return 'text-green-700 dark:text-green-300';
            case 'error':
                return 'text-red-700 dark:text-red-300';
            default:
                return 'text-gray-700 dark:text-gray-300';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'processing':
                return <Loader className="h-5 w-5 animate-spin" />;
            case 'error':
                return <AlertCircle className="h-5 w-5" />;
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 dark:bg-black/90 z-[60] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Escanear Código de Barras
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Scanner - Muestra video solo si está listo o procesando */}
                <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4 flex items-center justify-center">
                    {state.status === 'error' ? (
                        <div className="text-center">
                            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                            <p className="text-white text-sm">Error al acceder a cámara</p>
                        </div>
                    ) : (
                        <BarcodeScanner
                            onUpdate={handleUpdate}
                            onError={handleError}
                            width="100%"
                            height="100%"
                            facingMode="environment"
                            torch={torchEnabled}
                            delay={500}
                        />
                    )}
                </div>

                {/* Estado y mensajes */}
                <div
                    className={`rounded-lg p-3 mb-4 border transition-all ${getStatusColor(state.status)}`}
                >
                    <div className="flex gap-2 items-start">
                        {getStatusIcon(state.status) && (
                            <div className="flex-shrink-0">{getStatusIcon(state.status)}</div>
                        )}
                        <p className={`text-sm font-medium ${getStatusTextColor(state.status)}`}>
                            {state.message}
                        </p>
                    </div>

                    {state.detectedCode && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 font-mono break-all">
                            {state.detectedCode}
                        </p>
                    )}
                </div>

                {/* Información de ayuda */}
                {(state.status === 'ready' || state.status === 'processing') && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                            💡 Consejo: Asegúrate que el código esté bien iluminado y dentro del
                            área de enfoque. El scanner soporta códigos de barras estándar (EAN,
                            UPC, Code128, QR, etc.)
                        </p>
                    </div>
                )}

                {/* Botón linterna */}
                {state.status !== 'error' && (
                    <div className="mb-4">
                        <button
                            onClick={() => setTorchEnabled(!torchEnabled)}
                            className={`w-full px-3 py-2 rounded-md text-sm font-medium transition flex items-center justify-center gap-2 ${
                                torchEnabled
                                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-700'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600'
                            }`}
                            title={torchEnabled ? 'Linterna activada' : 'Linterna desactivada'}
                        >
                            <Lightbulb className="h-4 w-4" />
                            {torchEnabled ? 'Linterna ON' : 'Linterna OFF'}
                        </button>
                    </div>
                )}

                {/* Botones */}
                <div className="flex gap-2 mt-auto">
                    {state.status === 'error' && (
                        <button
                            onClick={handleRetry}
                            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition"
                        >
                            Reintentar
                        </button>
                    )}

                    <button
                        onClick={onClose}
                        className={`${state.status === 'error' ? 'flex-1' : 'w-full'} px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md text-sm font-medium transition`}
                    >
                        {state.status === 'success' ? 'Cerrar' : 'Cancelar'}
                    </button>
                </div>
            </div>
        </div>
    );
}
