import { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import type { WizardFormData } from '@/presentation/pages/logistica/entregas/components/EntregaFormWizard';

export function useEntregaWizard() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const handleSubmit = async (formData: WizardFormData) => {
        try {
            setIsSubmitting(true);
            setSubmitError(null);

            // Validar datos requeridos
            if (
                !formData.venta_id ||
                !formData.vehiculo_id ||
                !formData.chofer_id ||
                !formData.fecha_programada ||
                !formData.direccion_entrega ||
                !formData.peso_kg
            ) {
                throw new Error('Faltan datos requeridos');
            }

            // Preparar payload
            const payload = {
                venta_id: formData.venta_id,
                vehiculo_id: formData.vehiculo_id,
                chofer_id: formData.chofer_id,
                fecha_programada: formData.fecha_programada,
                direccion_entrega: formData.direccion_entrega,
                peso_kg: formData.peso_kg,
                volumen_m3: formData.volumen_m3,
                observaciones: formData.observaciones,
            };

            // POST a create endpoint
            await new Promise((resolve, reject) => {
                router.post('/logistica/entregas', payload, {
                    onSuccess: () => resolve(null),
                    onError: (errors) => {
                        const errorMsg = Object.values(errors).join(', ');
                        reject(new Error(errorMsg || 'Error al crear entrega'));
                    },
                });
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error desconocido';
            setSubmitError(message);
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        router.visit('/logistica/entregas');
    };

    return {
        isSubmitting,
        submitError,
        handleSubmit,
        handleCancel,
    };
}
