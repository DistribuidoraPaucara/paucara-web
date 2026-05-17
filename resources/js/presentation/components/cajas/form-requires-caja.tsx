'use client';

import React, { ReactNode } from 'react';
import { useCajaFormValidation } from '@/application/hooks/use-caja-form-validation';
import { AlertSinCaja } from './alert-sin-caja';
import { Lock } from 'lucide-react';

interface FormRequiresCajaProps {
    /**
     * Contenido del formulario que requiere caja
     */
    children: ReactNode;

    /**
     * Mostrar alerta si no hay caja
     * @default true
     */
    mostrarAlerta?: boolean;

    /**
     * Mostrar overlay de bloqueo
     * @default true
     */
    mostrarOverlay?: boolean;

    /**
     * Callback cuando se intenta abrir caja
     */
    onAbrirCaja?: () => void;
}

/**
 * Componente: FormRequiresCaja
 *
 * Responsabilidades:
 * ✅ Envolver formularios que requieren caja abierta
 * ✅ Mostrar alerta si no hay caja
 * ✅ Desabilitar interacción con form si no hay caja
 * ✅ Mostrar overlay transparente con icono de bloqueo
 *
 * Ubicación: Envuelve formularios de venta/compra
 *
 * Uso:
 * ```tsx
 * <FormRequiresCaja>
 *   <form>
 *     <input name="cliente_id" />
 *     <button type="submit">Crear Venta</button>
 *   </form>
 * </FormRequiresCaja>
 * ```
 *
 * Si hay caja: Formulario completamente funcional
 * Si NO hay caja:
 *   - Alerta explicativa al inicio
 *   - Overlay oscuro sobre el formulario
 *   - Inputs deshabilitados
 *   - Botones deshabilitados
 */
export function FormRequiresCaja({
    children,
    mostrarAlerta = true,
    mostrarOverlay = true,
    onAbrirCaja,
}: FormRequiresCajaProps) {
    const { tieneCapaAbierta, abrirCaja, irACajas } = useCajaFormValidation();

    const handleAbrir = () => {
        onAbrirCaja?.();
        abrirCaja();
    };

    return (
        <div className="space-y-4">
            {/* ✅ Mostrar alerta si no hay caja */}
            {mostrarAlerta && !tieneCapaAbierta && (
                <AlertSinCaja
                    onAbrir={handleAbrir}
                    onVerCajas={irACajas}
                    mostrarBotones={true}
                />
            )}

            {/* ✅ Form con overlay si no hay caja */}
            <div className="relative">
                {/* Contenido del formulario */}
                <div
                    className={tieneCapaAbierta ? '' : 'opacity-50 pointer-events-none'}
                >
                    {children}
                </div>

                {/* ✅ Overlay si no hay caja */}
                {mostrarOverlay && !tieneCapaAbierta && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm rounded-lg">
                        <div className="flex flex-col items-center gap-2 text-center">
                            <Lock className="h-8 w-8 text-muted-foreground" />
                            <p className="text-sm font-medium text-muted-foreground">
                                Abre una caja para continuar
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
