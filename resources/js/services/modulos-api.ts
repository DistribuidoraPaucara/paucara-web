/**
 * @deprecated Este archivo está deprecado.
 * Use @/infrastructure/services/modulos.service.ts en su lugar.
 *
 * Este archivo se mantiene temporalmente por compatibilidad,
 * pero será eliminado en futuras versiones.
 */

import { modulosService } from '@/infrastructure/services/modulos.service';

/**
 * @deprecated Use modulosService de @/infrastructure/services/modulos.service.ts
 */
export const modulosApi = {
    /**
     * @deprecated Use modulosService.obtenerPermisosDisponibles()
     */
    async obtenerPermisosDisponibles(): Promise<string[]> {
        return modulosService.obtenerPermisosDisponibles();
    },

    /**
     * @deprecated Use modulosService.obtenerMatrizAcceso()
     */
    async obtenerMatrizAcceso() {
        return modulosService.obtenerMatrizAcceso();
    },

    /**
     * @deprecated Use modulosService.obtenerRoles()
     */
    async obtenerRoles() {
        return modulosService.obtenerRoles();
    },

    /**
     * @deprecated Use modulosService.obtenerPreviewPorRol()
     */
    async obtenerPreviewPorRol(rolName: string) {
        return modulosService.obtenerPreviewPorRol(rolName);
    },

    /**
     * @deprecated Use modulosService.toggleActivo()
     */
    toggleActivo(id: number): Promise<void> {
        return modulosService.toggleActivo(id);
    },

    /**
     * @deprecated Use modulosService.guardarOrden()
     */
    async guardarOrden(orden: Array<{ id: number; orden: number }>): Promise<void> {
        return modulosService.guardarOrden(orden);
    },
};
