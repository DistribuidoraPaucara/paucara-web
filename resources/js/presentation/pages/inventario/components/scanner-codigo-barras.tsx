import React, { useEffect, useState, useRef, useCallback } from 'react';
import { AlertCircle, X, Barcode, Camera, Check } from 'lucide-react';
import NotificationService from '@/infrastructure/services/notification.service';
import ScannerCamaraModal from './scanner-camara-modal';

interface Props {
    onBarcodeDetected: (codigo: string) => Promise<void>;
    enabled?: boolean;
}

interface ScannerConfig {
    minLength: number;
    maxLength: number;
    timeout: number;
}

const DEFAULT_CONFIG: ScannerConfig = {
    minLength: 6,      // Código mínimo realista (EAN-8 es 8)
    maxLength: 128,    // Máximo realista para códigos de barras
    timeout: 3000,     // 3 segundos para completar entrada
};

export default function ScannerCodigoBarras({ onBarcodeDetected, enabled = true }: Props) {
    const [codigoDetectado, setCodigoDetectado] = useState('');
    const [procesando, setProcesando] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activo, setActivo] = useState(false);
    const [mostrarCamara, setMostrarCamara] = useState(false);
    const [ultimoCodigoDetectado, setUltimoCodigoDetectado] = useState('');

    const codigoTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const codigoBufferRef = useRef('');
    const procesandoRef = useRef(false);
    const ultimoTiempoRef = useRef(0);

    // Detectar si hay un input/textarea enfocado
    const tieneFocoEnInput = useCallback((): boolean => {
        const elemento = document.activeElement;
        return (
            elemento instanceof HTMLInputElement ||
            elemento instanceof HTMLTextAreaElement
        );
    }, []);

    // Validar código de barras
    const validarCodigo = useCallback((codigo: string): { valido: boolean; error?: string } => {
        if (codigo.length < DEFAULT_CONFIG.minLength) {
            return {
                valido: false,
                error: `Código muy corto (mín. ${DEFAULT_CONFIG.minLength} caracteres)`,
            };
        }

        if (codigo.length > DEFAULT_CONFIG.maxLength) {
            return {
                valido: false,
                error: `Código muy largo (máx. ${DEFAULT_CONFIG.maxLength} caracteres)`,
            };
        }

        // Verificar que contiene caracteres válidos para códigos de barras
        if (!/^[a-zA-Z0-9\-._~:/?#\[\]@!$&'()*+,;=]+$/.test(codigo)) {
            return {
                valido: false,
                error: 'Código contiene caracteres inválidos',
            };
        }

        return { valido: true };
    }, []);

    // Procesar código detectado
    const procesarCodigo = useCallback(
        async (codigo: string) => {
            // Evitar procesamiento duplicado rápido (debounce)
            const ahora = Date.now();
            if (
                ultimoTiempoRef.current &&
                ahora - ultimoTiempoRef.current < 1000
            ) {
                return;
            }

            if (procesandoRef.current) return;

            const validacion = validarCodigo(codigo);
            if (!validacion.valido) {
                setError(validacion.error || 'Código inválido');
                setCodigoDetectado(codigo);

                // Auto-limpiar error después de 3 segundos
                setTimeout(() => {
                    setError(null);
                    setCodigoDetectado('');
                }, 3000);
                return;
            }

            // Evitar procesar el mismo código dos veces
            if (codigo === ultimoCodigoDetectado) {
                return;
            }

            procesandoRef.current = true;
            setProcesando(true);
            setCodigoDetectado(codigo);
            setError(null);
            setUltimoCodigoDetectado(codigo);
            ultimoTiempoRef.current = ahora;

            try {
                await onBarcodeDetected(codigo);

                // Mostrar confirmación visual
                setTimeout(() => {
                    setCodigoDetectado('');
                    procesandoRef.current = false;
                    setProcesando(false);
                }, 1000);
            } catch (err) {
                const errorMsg = err instanceof Error ? err.message : 'Error procesando código';
                setError(errorMsg);
                console.error('Error procesando código de barras:', err);

                // Mantener visible el error durante 3 segundos
                setTimeout(() => {
                    setError(null);
                    setCodigoDetectado('');
                    procesandoRef.current = false;
                    setProcesando(false);
                }, 3000);
            }
        },
        [onBarcodeDetected, validarCodigo, ultimoCodigoDetectado]
    );

    // Listener de teclado
    useEffect(() => {
        if (!enabled || !activo) {
            return;
        }

        const handleKeyPress = async (e: KeyboardEvent) => {
            // No capturar si hay foco en input/textarea (excepto si es Enter)
            if (tieneFocoEnInput() && e.key !== 'Enter') {
                return;
            }

            // Ignorar teclas especiales que no son parte del código
            if (
                e.key === 'Meta' ||
                e.key === 'Control' ||
                e.key === 'Alt' ||
                e.key === 'Shift' ||
                e.key === 'Tab' ||
                (e.key === 'Escape' && codigoBufferRef.current === '')
            ) {
                return;
            }

            // Limpiar timeout anterior
            if (codigoTimeoutRef.current) {
                clearTimeout(codigoTimeoutRef.current);
            }

            // Procesar Enter como final de código
            if (e.key === 'Enter') {
                e.preventDefault();
                const codigo = codigoBufferRef.current.trim();
                codigoBufferRef.current = '';

                if (codigo.length > 0) {
                    await procesarCodigo(codigo);
                }
                return;
            }

            // Agregar carácter al buffer
            codigoBufferRef.current += e.key;

            // Timeout para resetear si no hay entrada en X segundos
            codigoTimeoutRef.current = setTimeout(() => {
                if (codigoBufferRef.current.length > 0) {
                    // Auto-procesar si el buffer tiene datos después del timeout
                    const codigo = codigoBufferRef.current.trim();
                    codigoBufferRef.current = '';
                    if (codigo.length > 0) {
                        procesarCodigo(codigo);
                    }
                }
            }, DEFAULT_CONFIG.timeout);
        };

        window.addEventListener('keydown', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
            if (codigoTimeoutRef.current) {
                clearTimeout(codigoTimeoutRef.current);
            }
        };
    }, [enabled, activo, procesarCodigo, tieneFocoEnInput]);

    // Manejar detección de cámara
    const handleCameraDetection = async (codigo: string) => {
        setMostrarCamara(false);
        await procesarCodigo(codigo);
    };

    // No mostrar el botón flotante (deshabilitado)
    if (!codigoDetectado && !procesando && !error && !mostrarCamara) {
        return null;
    }

    return (
        <>
            {/* Indicador flotante de estado */}
            <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 max-w-sm z-40">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                        {procesando ? (
                            <div className="h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                        ) : error ? (
                            <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
                        ) : (
                            <Check className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                        )}

                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                                {procesando
                                    ? 'Procesando código...'
                                    : error
                                        ? 'Error en código'
                                        : 'Código detectado'}
                            </p>

                            {error ? (
                                <p className="text-xs text-red-600 dark:text-red-400 mt-1">{error}</p>
                            ) : codigoDetectado ? (
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-mono break-all">
                                    {codigoDetectado}
                                </p>
                            ) : null}
                        </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex gap-2 flex-shrink-0">
                        {!procesando && !error && (
                            <button
                                onClick={() => setMostrarCamara(true)}
                                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
                                title="Abrir scanner de cámara"
                            >
                                <Camera className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </button>
                        )}

                        <button
                            onClick={() => {
                                setCodigoDetectado('');
                                setError(null);
                                codigoBufferRef.current = '';
                            }}
                            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition"
                            title="Cerrar"
                        >
                            <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        </button>
                    </div>
                </div>

                {/* Barra de progreso durante procesamiento */}
                {procesando && (
                    <div className="mt-3 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 animate-pulse"></div>
                    </div>
                )}
            </div>

            {/* Modal de cámara */}
            {mostrarCamara && (
                <ScannerCamaraModal
                    onClose={() => setMostrarCamara(false)}
                    onDetected={handleCameraDetection}
                />
            )}
        </>
    );
}
