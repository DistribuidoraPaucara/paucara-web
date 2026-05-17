import React from 'react';
import { Loader2 } from 'lucide-react';

export interface LoadingOverlayProps {
  isVisible: boolean;
  step?: 'approval' | 'conversion' | 'processing';
  message?: string;
  progress?: number; // 0-100
}

/**
 * Componente reutilizable de overlay con loading
 *
 * @example
 * <LoadingOverlay
 *   isVisible={loading}
 *   step="approval"
 *   message="Guardando datos de coordinación..."
 *   progress={50}
 * />
 */
export function LoadingOverlay({
  isVisible,
  step = 'processing',
  message,
  progress,
}: LoadingOverlayProps) {
  if (!isVisible) return null;

  const titles = {
    approval: '⏳ Aprobando Proforma',
    conversion: '🔄 Convirtiendo a Venta',
    processing: '⏳ Procesando',
  };

  const descriptions = {
    approval: 'Guardando coordinación y aprobando proforma...',
    conversion: 'Creando venta con datos de pago...',
    processing: 'Por favor, no cierre esta ventana',
  };

  const title = titles[step];
  const description = message || descriptions[step];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-sm w-full mx-4 space-y-6 animate-in fade-in duration-300">
        {/* Spinner */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-20 animate-pulse"></div>
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 relative" />
          </div>
        </div>

        {/* Título */}
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>

        {/* Progress bar (opcional) */}
        {progress !== undefined && (
          <div className="space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 text-center">{progress}%</p>
          </div>
        )}

        {/* Nota de seguridad */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <p className="text-xs text-blue-800">
            ✓ Tus datos están seguros. No cierres el navegador durante el procesamiento.
          </p>
        </div>
      </div>
    </div>
  );
}
