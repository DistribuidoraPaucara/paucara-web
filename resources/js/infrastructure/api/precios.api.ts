/**
 * API Service para gestión de precios y cascada de precios
 */

/**
 * Actualiza la cascada de precios cuando cambia el costo en una compra
 *
 * @param productoId - ID del producto
 * @param precios - Array de precios a actualizar
 * @returns Respuesta del backend
 * @throws Error si la petición falla
 */
export async function actualizarCascadaPreciosAPI(
    productoId: number,
    precios: Array<{
        precio_id: number;
        precio_nuevo: number;
        porcentaje_ganancia: number;
        motivo: string;
    }>
) {
    try {
        // Obtener CSRF token si es necesario (Laravel)
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

        const response = await fetch('/api/precios/actualizar-cascada', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(csrfToken && { 'X-CSRF-TOKEN': csrfToken })
            },
            body: JSON.stringify({
                producto_id: productoId,
                precios
            })
        });

        // Si respuesta no es OK
        if (!response.ok) {
            let errorMessage = 'Error al actualizar precios';

            try {
                const errorData = await response.json();
                errorMessage = errorData.mensaje ||
                    errorData.message ||
                    errorData.error ||
                    errorMessage;
            } catch {
                // Si no se puede parsear JSON, usar mensaje genérico
                errorMessage = `Error ${response.status}: ${response.statusText}`;
            }

            throw new Error(errorMessage);
        }

        // Parsear respuesta
        const data = await response.json();

        if (!data.success) {
            throw new Error(data.mensaje || 'Error desconocido al actualizar precios');
        }

        return data;
    } catch (error) {
        // Re-lanzar el error para que sea manejado por el caller
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Error desconocido al comunicarse con el servidor');
    }
}

/**
 * Obtiene los precios de un producto
 *
 * @param productoId - ID del producto
 * @returns Datos del producto con sus precios
 * @throws Error si la petición falla
 */
export async function obtenerPreciosProductoAPI(productoId: number) {
    try {
        const response = await fetch(`/api/productos/${productoId}/precios`);

        if (!response.ok) {
            throw new Error('Error al obtener precios del producto');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Error desconocido al obtener precios');
    }
}

/**
 * Obtiene historial de cambios de precios de un producto
 *
 * @param productoId - ID del producto
 * @param limite - Cantidad máxima de registros (default: 50)
 * @returns Array de cambios de precios
 * @throws Error si la petición falla
 */
export async function obtenerHistorialPreciosAPI(
    productoId: number,
    limite: number = 50
) {
    try {
        const params = new URLSearchParams({
            limite: limite.toString()
        });

        const response = await fetch(`/api/productos/${productoId}/historial-precios?${params}`);

        if (!response.ok) {
            throw new Error('Error al obtener historial de precios');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Error desconocido al obtener historial');
    }
}

/**
 * Actualiza el precio de un solo tipo de precio
 *
 * @param precioId - ID del precio
 * @param precioNuevo - Nuevo valor del precio
 * @param motivo - Motivo de la actualización
 * @returns Respuesta del backend
 * @throws Error si la petición falla
 */
export async function actualizarPrecioIndividualAPI(
    precioId: number,
    precioNuevo: number,
    motivo: string
) {
    try {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

        const response = await fetch('/api/precios/actualizar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(csrfToken && { 'X-CSRF-TOKEN': csrfToken })
            },
            body: JSON.stringify({
                precio_id: precioId,
                precio_nuevo: precioNuevo,
                motivo
            })
        });

        if (!response.ok) {
            let errorMessage = 'Error al actualizar precio';

            try {
                const errorData = await response.json();
                errorMessage = errorData.mensaje || errorData.message || errorMessage;
            } catch {
                errorMessage = `Error ${response.status}`;
            }

            throw new Error(errorMessage);
        }

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.mensaje || 'Error desconocido');
        }

        return data;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Error desconocido');
    }
}
