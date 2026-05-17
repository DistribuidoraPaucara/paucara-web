'use client';

import React from 'react';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/presentation/components/ui/alert';
import { Button } from '@/presentation/components/ui/button';

interface AlertSinCajaProps {
    /**
     * Callback para abrir caja
     */
    onAbrir?: () => void;

    /**
     * Callback para ver todas las cajas
     */
    onVerCajas?: () => void;

    /**
     * Mostrar botones de acción
     * @default true
     */
    mostrarBotones?: boolean;

    /**
     * Variante de alerta
     * @default 'default'
     */
    variant?: 'default' | 'destructive';
}

/**
 * Componente: AlertSinCaja
 *
 * Responsabilidades:
 * ✅ Mostrar alerta clara cuando no hay caja abierta
 * ✅ Proporcionar acciones rápidas (Abrir caja, Ver cajas)
 * ✅ Usar colores y iconos para máxima visibilidad
 * ✅ Adaptarse a diferentes contextos
 *
 * Ubicación: Formularios de venta/compra
 *
 * Uso:
 * ```tsx
 * <AlertSinCaja
 *   onAbrir={() => window.location.href = '/cajas'}    // ✅ Ir a página de cajas (modal)
 *   onVerCajas={() => window.location.href = '/cajas'}
 * />
 * ```
 */
export function AlertSinCaja({
    onAbrir,
    onVerCajas,
    mostrarBotones = true,
    variant = 'default',
}: AlertSinCajaProps) {
    return (
        <Alert variant={variant} className="border-amber-300 bg-amber-50 dark:bg-amber-950/30">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertTitle className="text-amber-900 dark:text-amber-100">
                Caja No Abierta
            </AlertTitle>
            <AlertDescription className="text-amber-800 dark:text-amber-200">
                Debes abrir una caja antes de realizar esta operación. Sin una caja abierta,
                no podrás crear ventas, compras u otras operaciones que manipulen dinero.
            </AlertDescription>

            {mostrarBotones && (
                <div className="flex gap-2 mt-4">
                    {onVerCajas && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onVerCajas}
                            className="text-amber-700 dark:text-amber-300"
                        >
                            Ver Cajas
                        </Button>
                    )}
                    {onAbrir && (
                        <Button
                            size="sm"
                            onClick={onAbrir}
                            className="gap-2 bg-amber-600 hover:bg-amber-700"
                        >
                            <span>Abrir Caja</span>
                            <ArrowRight className="h-3 w-3" />
                        </Button>
                    )}
                </div>
            )}
        </Alert>
    );
}
