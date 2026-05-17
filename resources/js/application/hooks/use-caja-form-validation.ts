import { useCallback, useMemo } from 'react';
import { useCajaStatus } from './use-caja-status';

export interface CajaFormValidation {
    /**
     * Indica si hay caja abierta
     */
    tieneCapaAbierta: boolean;

    /**
     * Mensaje de error si no hay caja
     */
    mensajeError: string;

    /**
     * Indica si el formulario debe estar deshabilitado
     */
    debePedirCaja: boolean;

    /**
     * Redirigir a página de cajas
     */
    irACajas: () => void;

    /**
     * Abrir caja
     */
    abrirCaja: () => void;
}

/**
 * Hook: useCajaFormValidation
 *
 * Responsabilidades:
 * ✅ Validar que existe caja abierta para operaciones
 * ✅ Proporcionar estado y mensajes para UI
 * ✅ Desabilitar/habilitar botones según disponibilidad de caja
 *
 * Uso en Ventas:
 * ```tsx
 * const validation = useCajaFormValidation();
 *
 * if (!validation.tieneCapaAbierta) {
 *   return <AlertSinCaja />;
 * }
 *
 * return (
 *   <form>
 *     <button disabled={validation.debePedirCaja}>
 *       Crear Venta
 *     </button>
 *   </form>
 * );
 * ```
 *
 * Uso en Compras:
 * ```tsx
 * const validation = useCajaFormValidation();
 *
 * return (
 *   <form>
 *     {!validation.tieneCapaAbierta && (
 *       <AlertBox message={validation.mensajeError} />
 *     )}
 *     <button disabled={validation.debePedirCaja}>
 *       Crear Compra
 *     </button>
 *   </form>
 * );
 * ```
 */
export function useCajaFormValidation(): CajaFormValidation {
    const { tieneCapaAbierta, abrirCaja, irACajas } = useCajaStatus();

    const mensajeError = useMemo(() => {
        if (!tieneCapaAbierta) {
            return 'Debe abrir una caja antes de realizar esta operación';
        }
        return '';
    }, [tieneCapaAbierta]);

    const debePedirCaja = !tieneCapaAbierta;

    return {
        tieneCapaAbierta,
        mensajeError,
        debePedirCaja,
        irACajas,
        abrirCaja,
    };
}
