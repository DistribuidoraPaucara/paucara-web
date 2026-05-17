import { useCallback, useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';

export interface CajaStatus {
    tiene_caja_abierta: boolean;
    caja_id: number | null;
    numero_caja: string | null;
    monto_actual: number | null;
    apertura_id: number | null;
}

/**
 * Hook: useCajaStatus
 *
 * Responsabilidades:
 * ✅ Obtener estado de caja actual del usuario
 * ✅ Detectar cambios en estado de caja
 * ✅ Proporcionar métodos para abrir/cerrar caja
 *
 * Uso:
 * ```tsx
 * const { tieneCapaAbierta, cajaActual, abrirCaja, cerrarCaja } = useCajaStatus();
 *
 * if (!tieneCapaAbierta) {
 *    return <AlertSinCaja onAbrir={abrirCaja} />;
 * }
 * ```
 */
export function useCajaStatus() {
    const page = usePage();
    const [estado, setEstado] = useState<CajaStatus>({
        tiene_caja_abierta: false,
        caja_id: null,
        numero_caja: null,
        monto_actual: null,
        apertura_id: null,
    });

    // ✅ Obtener estado de caja del contexto de props del servidor
    useEffect(() => {
        const props = page.props as any;

        // Si viene de la respuesta del servidor
        if (props?.caja_status) {
            setEstado(props.caja_status);
        } else if (props?.user?.empleado) {
            // Calcular estado basado en empleado
            const empleado = props.user.empleado;
            if (empleado.tiene_caja_abierta) {
                setEstado({
                    tiene_caja_abierta: true,
                    caja_id: empleado.caja_abierta?.id,
                    numero_caja: empleado.caja_abierta?.numero,
                    monto_actual: empleado.monto_actual_caja,
                    apertura_id: empleado.apertura_caja_id,
                });
            }
        }
    }, [page.props]);

    /**
     * Redirigir a página de cajas
     */
    const irACajas = useCallback(() => {
        window.location.href = '/cajas';
    }, []);

    /**
     * Abrir caja (redirigir a página de cajas con modal)
     * ✅ Va a /cajas (donde está el modal para abrir caja)
     */
    const abrirCaja = useCallback(() => {
        window.location.href = '/cajas';
    }, []);

    /**
     * Cerrar caja (redirigir a página de cajas)
     * ✅ Va a /cajas (donde está el modal para cerrar caja)
     */
    const cerrarCaja = useCallback(() => {
        window.location.href = '/cajas';
    }, []);

    return {
        tieneCapaAbierta: estado.tiene_caja_abierta,
        cajaActual: {
            id: estado.caja_id,
            numero: estado.numero_caja,
            monto: estado.monto_actual,
            aperturaId: estado.apertura_id,
        },
        abrirCaja,
        cerrarCaja,
        irACajas,
        estado,
    };
}
