/**
 * Application Layer Hook: useSimpleEntregaSubmit
 *
 * Encapsula la lógica para enviar una entrega simple (1 venta)
 * Delega al servicio de infrastructure para validación y URL
 * Usa Inertia.js router para la solicitud HTTP
 *
 * ARQUITECTURA:
 * - Presentación: CreateEntregasUnificado (solo renderiza y llama hook)
 * - Application: Este hook (orquestación de lógica)
 * - Infrastructure: entregasService (validación y URLs)
 * - Domain: Tipos puros
 */

import { useCallback } from 'react';
import { router } from '@inertiajs/react';
import entregasService from '@/infrastructure/services/entregas.service';
import type { EntregaFormData } from '@/domain/entities/entregas';

interface UseSimpleEntregaSubmitReturn {
    submitEntrega: (data: EntregaFormData) => Promise<void>;
}

/**
 * Hook para gestionar el envío de una entrega simple
 * Centraliza validación, manejo de errores y comunicación HTTP
 */
export const useSimpleEntregaSubmit = (): UseSimpleEntregaSubmitReturn => {
    const submitEntrega = useCallback(async (data: EntregaFormData): Promise<void> => {
        try {
            // Debug: mostrar datos antes de validar
            console.log('📤 [useSimpleEntregaSubmit] Enviando datos:', data);

            // Validar datos usando el servicio
            const validationErrors = entregasService.validateData(data);
            if (validationErrors.length > 0) {
                console.error('❌ [useSimpleEntregaSubmit] Errores de validación frontend:', validationErrors);
                throw new Error(validationErrors.join('\n'));
            }

            // Obtener URL del servicio
            const url = entregasService.storeUrl();

            // Enviar usando Inertia.js router
            // Inertia.js manejará automáticamente:
            // - onSuccess: redirección después de crear
            // - onError: redirección atrás con los errores en props
            router.post(url, data as Record<string, any>, {
                onSuccess: () => {
                    // La redirección ocurre automáticamente en el backend
                    console.log('✅ [useSimpleEntregaSubmit] Entrega creada exitosamente');
                },
                onError: (errors) => {
                    // Cuando hay errores de validación, Inertia.js redirige atrás
                    // Los errores se proporcionan en los props de la página
                    console.error('❌ [useSimpleEntregaSubmit] Errores de validación del servidor:');
                    console.error('   Errores:', errors);

                    // Formatear mensajes de error para mostrar
                    const errorMessages = Object.entries(errors)
                        .map(([field, messages]: [string, any]) => {
                            const msgs = Array.isArray(messages) ? messages : [messages];
                            return `${field}: ${msgs.join(', ')}`;
                        })
                        .join('\n');

                    console.error('   Detalles:\n' + errorMessages);

                    // Mostrar error pero NO lanzar excepción
                    // Inertia.js ya redirigió atrás con los errores en props
                },
            });
        } catch (error) {
            console.error('❌ [useSimpleEntregaSubmit] Error general:', error);
            throw error;
        }
    }, []);

    return { submitEntrega };
};
