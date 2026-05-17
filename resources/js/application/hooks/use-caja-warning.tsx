/**
 * Hook: useCajaWarning
 *
 * Responsabilidades:
 * ✅ Gestionar estado de advertencia de caja no abierta
 * ✅ Mostrar toast una sola vez por sesión
 * ✅ Mantener banner persistente visible
 * ✅ Detectar si hay props de caja_warning desde el backend
 */

import React from 'react';
import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import NotificationService from '@/infrastructure/services/notification.service';
import { router } from '@inertiajs/react';

interface CajaWarning {
    mensaje: string;
    tipo: string;
    mostrar_toast: boolean;
}

/**
 * Hook para manejar advertencias de caja sin abrir
 * Se usa en páginas de ventas para mostrar aviso cuando no hay caja
 */
export function useCajaWarning() {
    const { props } = usePage();
    const [toastShown, setToastShown] = useState(false);

    const warning = (props as any).caja_warning as CajaWarning | undefined;

    useEffect(() => {
        // Mostrar toast solo una vez por sesión
        if (warning && warning.mostrar_toast && !toastShown) {
            const sessionKey = 'caja_warning_shown';
            const alreadyShown = sessionStorage.getItem(sessionKey) === 'true';

            if (!alreadyShown) {
                NotificationService.warning(
                    <div className="space-y-2">
                        <p>{warning.mensaje}</p>
                        <button
                            onClick={() => router.visit('/cajas')}
                            className="text-sm underline hover:no-underline font-medium"
                        >
                            Abrir Caja Ahora →
                        </button>
                    </div>,
                    { autoClose: 10000 }
                );

                setToastShown(true);
                sessionStorage.setItem(sessionKey, 'true');
            }
        }
    }, [warning, toastShown]);

    // Determinar si mostrar el banner persistente
    const shouldShowBanner = !!warning;

    return {
        hasWarning: !!warning,
        warning,
        shouldShowBanner,
        toastShown,
    };
}
