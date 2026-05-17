/**
 * Hook: Validador de Inventario Inicial
 *
 * Responsabilidades:
 * - Validar items antes de enviar
 * - Manejar confirmación del usuario
 * - Enviar datos al servidor
 * - Procesar respuestas de error del servidor
 * - Mostrar notificaciones apropiadas
 */

import { useCallback } from 'react';
import { router } from '@inertiajs/react';
import NotificationService from '@/infrastructure/services/notification.service';
import type { InventarioItem, CargarInventarioInicialPayload } from '@/domain/entities/inventario-inicial';

interface UseInventarioInicialValidatorOptions {
    items: InventarioItem[];
    onSuccess?: () => void;
}

interface ValidationError {
    field: string;
    mensaje: string;
}

interface UseInventarioInicialValidatorReturn {
    validarYGuardar: (payload: CargarInventarioInicialPayload, onPostSubmit: (data: CargarInventarioInicialPayload) => void, procesando: boolean) => Promise<void>;
    validarItems: (items: InventarioItem[]) => ValidationError[];
}

export function useInventarioInicialValidator({
    items,
    onSuccess,
}: UseInventarioInicialValidatorOptions): UseInventarioInicialValidatorReturn {

    // ✅ Validar que hay al menos un item
    const validarNoVacio = useCallback((): boolean => {
        if (items.length === 0) {
            NotificationService.error('Debe agregar al menos un item');
            return false;
        }
        return true;
    }, [items.length]);

    // ✅ Validar items individuales
    const validarItems = useCallback((itemsAValidar: InventarioItem[]): ValidationError[] => {
        const errores: ValidationError[] = [];

        itemsAValidar.forEach((item, index) => {
            if (!item.producto_id) {
                errores.push({
                    field: `items[${index}].producto_id`,
                    mensaje: `Item ${index + 1}: Debe seleccionar un producto`
                });
            }

            if (!item.almacen_id) {
                errores.push({
                    field: `items[${index}].almacen_id`,
                    mensaje: `Item ${index + 1}: Debe seleccionar un almacén`
                });
            }

            // Convertir cantidad a número y validar
            const cantidad = Number(item.cantidad);
            if (!item.cantidad || isNaN(cantidad) || cantidad <= 0) {
                errores.push({
                    field: `items[${index}].cantidad`,
                    mensaje: `Item ${index + 1}: La cantidad debe ser un número mayor a 0`
                });
            }
        });

        return errores;
    }, []);

    // ✅ Mostrar errores de validación
    const mostrarErroresValidacion = useCallback((errores: ValidationError[]): void => {
        errores.forEach(({ mensaje }) => {
            NotificationService.error(mensaje);
        });
    }, []);

    // ✅ Parsear errores del servidor
    const parsearErroresServidor = useCallback((errorsResponse: unknown): string[] => {
        const mensajes: string[] = [];

        if (!errorsResponse || typeof errorsResponse !== 'object') {
            mensajes.push('Error desconocido al guardar. Por favor, intenta de nuevo.');
            return mensajes;
        }

        if (Array.isArray(errorsResponse)) {
            // Si es un array
            errorsResponse.forEach((error: unknown) => {
                mensajes.push(String(error));
            });
        } else {
            // Si es un objeto (respuesta estándar de Laravel)
            Object.entries(errorsResponse).forEach(([, value]: [string, unknown]) => {
                const errorMsg = Array.isArray(value) ? String(value[0]) : String(value);
                mensajes.push(errorMsg);
            });
        }

        return mensajes;
    }, []);

    // ✅ Mostrar errores del servidor
    const mostrarErroresServidor = useCallback((mensajes: string[]): void => {
        mensajes.forEach(mensaje => {
            NotificationService.error(mensaje);
        });
    }, []);

    // ✅ Pedir confirmación al usuario
    const pedirConfirmacion = useCallback(async (cantidadItems: number): Promise<boolean> => {
        try {
            const confirmado = await NotificationService.confirm(
                `Esta acción registrará el inventario inicial en los almacenes seleccionados.`,
                {
                    title: `¿Confirmar carga de ${cantidadItems} items?`,
                    confirmText: 'Sí, cargar inventario',
                    cancelText: 'Cancelar'
                }
            );
            return confirmado;
        } catch (error) {
            console.error('Error en confirmación:', error);
            return false;
        }
    }, []);

    // ✅ Validar y guardar (orquestador principal)
    const validarYGuardar = useCallback(
        async (
            payload: CargarInventarioInicialPayload,
            onPostSubmit: (data: CargarInventarioInicialPayload) => void,
            procesando: boolean
        ): Promise<void> => {
            try {
                // No proceder si ya está procesando
                if (procesando) return;

                // Validar que hay items
                if (!validarNoVacio()) return;

                // Validar items individuales
                const erroresValidacion = validarItems(payload.items);
                if (erroresValidacion.length > 0) {
                    mostrarErroresValidacion(erroresValidacion);
                    return;
                }

                // Pedir confirmación
                const confirmado = await pedirConfirmacion(payload.items.length);
                if (!confirmado) return;

                // Enviar al servidor
                onPostSubmit(payload);

            } catch (error) {
                console.error('Error en validarYGuardar:', error);
                NotificationService.error('Error inesperado. Revisa la consola para más detalles.');
            }
        },
        [
            validarNoVacio,
            validarItems,
            mostrarErroresValidacion,
            pedirConfirmacion,
        ]
    );

    return {
        validarYGuardar,
        validarItems,
    };
}

// ✅ Manejador de respuesta exitosa
export function crearManejadorExito(onSuccess?: () => void) {
    return () => {
        NotificationService.success('Inventario inicial cargado exitosamente');
        onSuccess?.();
    };
}

// ✅ Manejador de errores del servidor
export function crearManejadorError(parsearErrores: (errors: unknown) => string[], mostrarErrores: (mensajes: string[]) => void) {
    return (errorsResponse: unknown) => {
        console.error('Errores del backend:', errorsResponse);
        const mensajes = parsearErrores(errorsResponse);
        mostrarErrores(mensajes);
    };
}
