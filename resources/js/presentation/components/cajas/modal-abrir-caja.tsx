'use client';

import React, { useEffect, useState } from 'react';
import { useCajaStatus } from '@/application/hooks/use-caja-status';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/presentation/components/ui/dialog';
import { Button } from '@/presentation/components/ui/button';
import { AlertCircle, ArrowRight } from 'lucide-react';

interface ModalAbrirCajaProps {
    /**
     * Mostrar modal automáticamente si no hay caja
     * @default true
     */
    mostrarAuto?: boolean;

    /**
     * Callback cuando se abre la caja
     */
    onAbrirCaja?: () => void;

    /**
     * Callback cuando se cierra el modal
     */
    onClose?: () => void;
}

/**
 * Componente: ModalAbrirCaja
 *
 * Responsabilidades:
 * ✅ Mostrar alerta modal cuando no hay caja abierta
 * ✅ Proporcionar botón para abrir caja rápidamente
 * ✅ Explicar por qué es necesario
 * ✅ Impedir cierres accidentales (backdrop no closeable)
 *
 * Ubicación: Mostrada automáticamente en páginas de venta/compra
 *
 * Uso:
 * ```tsx
 * <ModalAbrirCaja mostrarAuto={true} onAbrirCaja={handleAbrirCaja} />
 * ```
 */
export function ModalAbrirCaja({
    mostrarAuto = true,
    onAbrirCaja,
    onClose,
}: ModalAbrirCajaProps) {
    const { tieneCapaAbierta, abrirCaja, irACajas } = useCajaStatus();
    const [isOpen, setIsOpen] = useState(false);

    // ✅ Mostrar modal automáticamente si no hay caja
    useEffect(() => {
        if (mostrarAuto && !tieneCapaAbierta) {
            setIsOpen(true);
        }
    }, [tieneCapaAbierta, mostrarAuto]);

    const handleAbrirCaja = () => {
        setIsOpen(false);
        onAbrirCaja?.();
        abrirCaja();
    };

    const handleClose = () => {
        setIsOpen(false);
        onClose?.();
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent
                className="max-w-md"
                onInteractOutside={(e) => {
                    // Prevenir cerrar por click fuera
                    e.preventDefault();
                }}
            >
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                        <DialogTitle>Caja No Abierta</DialogTitle>
                    </div>
                    <DialogDescription className="text-left">
                        Debes abrir una caja antes de realizar cualquier operación con dinero
                    </DialogDescription>
                </DialogHeader>

                {/* Contenido de la alerta */}
                <div className="space-y-4 py-4">
                    {/* Razones */}
                    <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-4 space-y-2">
                        <h4 className="font-semibold text-sm text-amber-900 dark:text-amber-100">
                            ¿Por qué es necesario?
                        </h4>
                        <ul className="text-sm text-amber-800 dark:text-amber-200 space-y-1">
                            <li className="flex gap-2">
                                <span>✓</span>
                                <span>Auditoria y trazabilidad de operaciones</span>
                            </li>
                            <li className="flex gap-2">
                                <span>✓</span>
                                <span>Control de efectivo en tiempo real</span>
                            </li>
                            <li className="flex gap-2">
                                <span>✓</span>
                                <span>Cumplimiento de políticas de caja</span>
                            </li>
                        </ul>
                    </div>

                    {/* Info de cajas disponibles */}
                    <div className="text-sm text-muted-foreground">
                        Tienes cajas disponibles asignadas. Abre una de ellas para comenzar a operar.
                    </div>
                </div>

                {/* Acciones */}
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => irACajas()}
                        className="flex-1"
                    >
                        Ver todas las cajas
                    </Button>
                    <Button
                        onClick={handleAbrirCaja}
                        className="flex-1 gap-2"
                    >
                        <span>Abrir Caja</span>
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
