import { useState } from 'react';
import { router } from '@inertiajs/react';
import type { Id } from '@/domain/entities/shared';
import {
    optimizacionEntregasService,
    type CrearLoteRequest,
} from '@/application/services/optimizacion-entregas.service';

export interface BatchFormData {
    venta_ids: Id[];
    vehiculo_id: Id | null;
    chofer_id: Id | null;
    entregador_id?: Id | null;
    zona_id?: Id | null;
    observaciones?: string;
    // Campos opcionales para caso single (1 venta)
    fecha_programada?: string;
    direccion_entrega?: string;
    // Campos para modo edición
    entrega_id?: Id | null;
}

interface UseBatchState {
    formData: BatchFormData;
    isSubmitting: boolean;
    submitError: string | null;
    successMessage: string | null;
}

export function useEntregaBatch(modo: 'crear' | 'editar' = 'crear', entregaId?: Id) {
    // Helper para obtener fecha actual en formato datetime-local (YYYY-MM-DDTHH:MM)
    const getTodayDateTimeLocal = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const [state, setState] = useState<UseBatchState>({
        formData: {
            venta_ids: [],
            vehiculo_id: null,
            chofer_id: null,
            entregador_id: null,
            zona_id: null,
            observaciones: '',
            fecha_programada: getTodayDateTimeLocal(),
            direccion_entrega: undefined,
            entrega_id: entregaId || null,
        },
        isSubmitting: false,
        submitError: null,
        successMessage: null,
    });

    /**
     * Actualizar datos del formulario
     */
    const updateFormData = (data: Partial<BatchFormData>) => {
        setState((prev) => ({
            ...prev,
            formData: { ...prev.formData, ...data },
            submitError: null,
            successMessage: null,
        }));
    };

    /**
     * Agregar/remover venta del lote
     */
    const toggleVenta = (ventaId: Id) => {
        setState((prev) => {
            const nuevasVentaIds = prev.formData.venta_ids.includes(ventaId)
                ? prev.formData.venta_ids.filter((id) => id !== ventaId)
                : [...prev.formData.venta_ids, ventaId];

            return {
                ...prev,
                formData: {
                    ...prev.formData,
                    venta_ids: nuevasVentaIds,
                },
            };
        });
    };

    /**
     * Seleccionar todas las ventas
     */
    const selectAllVentas = (ventaIds: Id[]) => {
        setState((prev) => ({
            ...prev,
            formData: {
                ...prev.formData,
                venta_ids: ventaIds,
            },
        }));
    };

    /**
     * Limpiar selección de ventas
     */
    const clearVentas = () => {
        setState((prev) => ({
            ...prev,
            formData: {
                ...prev.formData,
                venta_ids: [],
            },
        }));
    };

    /**
     * Crear o actualizar entregas
     */
    const handleSubmit = async (onSuccess?: (entrega: any) => void) => {
        // Validar datos
        if (!state.formData.vehiculo_id || !state.formData.chofer_id) {
            setState((prev) => ({
                ...prev,
                submitError: 'Debe seleccionar vehículo y chofer',
            }));
            return;
        }

        if (state.formData.venta_ids.length === 0) {
            setState((prev) => ({
                ...prev,
                submitError: 'Debe seleccionar al menos una venta',
            }));
            return;
        }

        setState((prev) => ({
            ...prev,
            isSubmitting: true,
            submitError: null,
            successMessage: null,
        }));

        try {
            const request: CrearLoteRequest = {
                venta_ids: state.formData.venta_ids,
                vehiculo_id: state.formData.vehiculo_id,
                chofer_id: state.formData.chofer_id,
                entregador_id: state.formData.entregador_id,
                zona_id: state.formData.zona_id,
                observaciones: state.formData.observaciones,
                fecha_programada: state.formData.fecha_programada,
                direccion_entrega: state.formData.direccion_entrega,
            };

            // 🔧 NUEVO: Detectar si es crear o actualizar
            const isEditMode = modo === 'editar' && entregaId;
            const resultado = isEditMode
                ? await optimizacionEntregasService.actualizarEntrega(entregaId, request)
                : await optimizacionEntregasService.crearLote(request);

            if (resultado.success) {
                setState((prev) => ({
                    ...prev,
                    successMessage: resultado.message,
                    isSubmitting: false,
                }));

                // ✅ ACTUALIZADO: Si hay callback (modal), usarlo; sino, redirigir como antes
                if (onSuccess && resultado.data) {
                    onSuccess(resultado.data);
                } else {
                    // Redirigir a entregas (vista dashboard) después de 2 segundos
                    setTimeout(() => {
                        router.visit('/logistica/entregas?view=dashboard');
                    }, 2000);
                }
            } else {
                setState((prev) => ({
                    ...prev,
                    submitError: resultado.message || 'Error desconocido',
                    isSubmitting: false,
                }));
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : `Error al ${modo === 'editar' ? 'actualizar' : 'crear'} entregas`;
            setState((prev) => ({
                ...prev,
                submitError: message,
                isSubmitting: false,
            }));
        }
    };

    /**
     * Cancelar y volver
     */
    const handleCancel = () => {
        router.visit('/logistica/entregas');
    };

    return {
        ...state,
        updateFormData,
        toggleVenta,
        selectAllVentas,
        clearVentas,
        handleSubmit,
        handleCancel,
    };
}
