/**
 * Tipos y interfaces para el flujo de actualización de cascada de precios
 * en compras cuando hay diferencia de costo
 */

/**
 * Props esperados por ModalComprasDiferenciaCostoComponent
 *
 * Este modal es agnóstico y NO carga datos de API.
 * ProductosTable es responsable de pasar todos los datos necesarios.
 */
export interface ModalComprasDiferenciaCostoProps {
    /** Si el modal está abierto */
    isOpen: boolean;

    /** Callback cuando el usuario cierra el modal */
    onClose: () => void;

    /** Producto para el cual actualizar precios */
    producto: {
        id: number;
        nombre: string;
        sku?: string;
        /** Precios actuales del producto - REQUERIDO */
        precios?: any[]; // PrecioProductoDTO[]
    } | null;

    /** Precio de costo actualmente registrado en el sistema */
    precioActual: number | null;

    /**
     * Nuevo precio de costo que se intentó registrar en la compra.
     * Si es diferente a precioActual, se muestra el modal.
     * IMPORTANTE: Este es el dato que dispara el flujo.
     */
    precioCostoNuevo: number | null;

    /**
     * Callback para guardar precios en BD.
     * El modal llamará este callback cuando el usuario haga clic en "Guardar Cambios".
     *
     * Parámetros esperados:
     * - Array de precios a actualizar, cada uno con:
     *   - precio_id: ID del precio en BD
     *   - precio_nuevo: Nuevo valor del precio
     *   - porcentaje_ganancia: Nuevo % de ganancia
     *   - motivo: String con el motivo de la actualización (texto libre)
     *
     * Debe lanzar Error si falla
     */
    onActualizarPrecios?: (precios: Array<{
        precio_id: number;
        precio_nuevo: number;
        porcentaje_ganancia: number;
        motivo: string;
    }>) => Promise<void>;

    /**
     * Callback opcional cuando se guardan exitosamente los precios
     */
    onSuccess?: () => void;
}

/**
 * Flujo de integración recomendado en ProductosTable
 *
 * 1. Usuario ingresa precio en fila de compra
 * 2. ProductosTable detecta: precio_compra !== precio_costo_actual
 * 3. ProductosTable renderiza un IconButton en la fila
 * 4. Al hacer clic, ProductosTable:
 *    - Abre el modal con isOpen=true
 *    - Pasa el producto con sus precios
 *    - Pasa precioActual = precio_costo_registrado
 *    - Pasa precioCostoNuevo = precio_ingresado_en_compra
 * 5. Usuario edita cascada de precios en modal
 * 6. Usuario guarda → onActualizarPrecios se ejecuta
 * 7. Si éxito → onSuccess() → ProductosTable puede:
 *    - Refrescar vista
 *    - Cerrar modal
 *    - Mostrar notificación
 * 8. Si error → NotificationService.error() en el modal
 */

/**
 * Tipos de datos que ProductosTable debe cargar para pasar al modal
 */
export interface ProductoParaCascada {
    id: number;
    nombre: string;
    sku?: string;

    /**
     * Array de precios del producto
     * Debe tener estructura:
     * - id: number (ID del registro precios_productos)
     * - tipo_precio_id: number
     * - precio_actual: number
     * - margen_ganancia: number (diferencia absoluta costo-precio)
     * - porcentaje_ganancia: number
     * - tipo: {
     *     codigo: 'COSTO' | 'P1' | 'P2' | etc
     *     nombre: string
     *     color: string
     *     es_ganancia: boolean
     *   }
     */
    precios: any[]; // PrecioProductoDTO[]
}

/**
 * Validaciones críticas que ProductosTable debe hacer ANTES de abrir modal
 */
export function validarDatosParaModal(props: ModalComprasDiferenciaCostoProps): {
    esValido: boolean;
    errores: string[];
} {
    const errores: string[] = [];

    if (!props.producto) {
        errores.push('Producto es requerido');
    }

    if (!props.producto?.precios || props.producto.precios.length === 0) {
        errores.push('El producto debe tener precios configurados');
    }

    if (props.precioActual === null || props.precioActual === undefined) {
        errores.push('Precio costo actual es requerido');
    }

    if (props.precioCostoNuevo === null || props.precioCostoNuevo === undefined) {
        errores.push('Precio costo nuevo es requerido');
    }

    if (typeof props.precioActual === 'number' && props.precioActual < 0) {
        errores.push('Precio costo actual no puede ser negativo');
    }

    if (typeof props.precioCostoNuevo === 'number' && props.precioCostoNuevo < 0) {
        errores.push('Precio costo nuevo no puede ser negativo');
    }

    if (!props.onActualizarPrecios) {
        errores.push('onActualizarPrecios callback es requerido');
    }

    return {
        esValido: errores.length === 0,
        errores
    };
}

/**
 * Detecta si hay diferencia significativa de precio
 */
export function tienePreferenciaDiferencia(
    precioActual: number | null,
    precioCostoNuevo: number | null,
    tolerancia: number = 0.01
): boolean {
    if (precioActual === null || precioCostoNuevo === null) {
        return false;
    }

    const diferencia = Math.abs(precioCostoNuevo - precioActual);
    return diferencia > tolerancia;
}
