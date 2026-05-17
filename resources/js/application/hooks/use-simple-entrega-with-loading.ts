/**
 * Application Layer Hook: useSimpleEntregaWithLoading
 *
 * Encapsula la lógica MEJORADA para enviar una entrega simple (1 venta)
 * CON GENERACIÓN AUTOMÁTICA DE REPORTE DE CARGA
 *
 * Flujo completo en una transacción lógica:
 * 1. Validar datos de entrega
 * 2. Crear entrega (POST /api/entregas)
 * 3. Generar reporte de carga (POST /api/reportes-carga)
 * 4. Redirigir a pantalla de reporte o lista de entregas
 *
 * ARQUITECTURA:
 * - Presentación: SimpleEntregaForm (renderiza UI)
 * - Application: Este hook (orquestación de ambas operaciones)
 * - Infrastructure: entregasService, reporteCargoService
 * - Domain: Tipos puros
 */

import { useCallback, useState } from 'react';
import { router } from '@inertiajs/react';
import entregasService from '@/infrastructure/services/entregas.service';
import type { EntregaFormData, VentaConDetalles } from '@/domain/entities/entregas';

interface UseSimpleEntregaWithLoadingReturn {
    submitEntregaWithReporte: (data: EntregaFormData) => Promise<void>;
    isLoading: boolean;
    error: string | null;
}

/**
 * Hook mejorado para gestionar el envío de una entrega simple
 * + generación automática de reporte de carga
 *
 * @param venta Datos de la venta para calcular peso y volumen del reporte
 * @returns Función de submit, estado de loading, y posibles errores
 */
export const useSimpleEntregaWithLoading = (venta: VentaConDetalles): UseSimpleEntregaWithLoadingReturn => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const submitEntregaWithReporte = useCallback(
        async (data: EntregaFormData): Promise<void> => {
            try {
                setIsLoading(true);
                setError(null);

                // ==================== PASO 1: VALIDAR ====================
                console.log('📋 [useSimpleEntregaWithLoading] Validando datos de entrega...');
                const validationErrors = entregasService.validateData(data);
                if (validationErrors.length > 0) {
                    const errorMsg = validationErrors.join('\n');
                    console.error('❌ Errores de validación frontend:', errorMsg);
                    setError(errorMsg);
                    throw new Error(errorMsg);
                }

                // ==================== PASO 2: CREAR ENTREGA ====================
                console.log('📤 [useSimpleEntregaWithLoading] Creando entrega...');
                const url = entregasService.storeUrl();

                // Usar fetch en lugar de router.post para tener control sobre la respuesta
                const entregaResponse = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    },
                    body: JSON.stringify(data),
                });

                if (!entregaResponse.ok) {
                    let errorMsg = 'Error creando entrega';
                    try {
                        const errorData = await entregaResponse.json();
                        errorMsg = errorData.message || errorMsg;
                    } catch (parseError) {
                        // Si no se puede parsear JSON, mostrar el status code
                        errorMsg = `Error del servidor (${entregaResponse.status}): ${entregaResponse.statusText || 'Error desconocido'}`;
                    }
                    console.error('❌ Error en servidor al crear entrega:', errorMsg);
                    setError(errorMsg);
                    throw new Error(errorMsg);
                }

                const entregaResult = await entregaResponse.json();
                const entregaId = entregaResult.data?.id;

                if (!entregaId) {
                    throw new Error('No se pudo obtener el ID de la entrega creada');
                }

                console.log('✅ Entrega creada con ID:', entregaId);

                // ==================== PASO 3: GENERAR REPORTE DE CARGA (OPCIONAL) ====================
                console.log('📋 [useSimpleEntregaWithLoading] Generando reporte de carga...');

                // Calcular peso y volumen desde los detalles de la venta
                const pesoTotal = venta.detalles?.reduce((sum, detalle) => {
                    // Asumir 2kg por unidad si no hay peso específico
                    return sum + (detalle.cantidad * 2);
                }, 0) || 0;

                const reporteData = {
                    entrega_id: entregaId,
                    vehiculo_id: data.vehiculo_id,
                    peso_total_kg: pesoTotal,
                    volumen_total_m3: undefined,
                    descripcion: `Reporte automático para venta #${venta.numero}`,
                };

                const reporteResponse = await fetch('/api/reportes-carga', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    },
                    body: JSON.stringify(reporteData),
                });

                if (!reporteResponse.ok) {
                    // Si falla el reporte, la entrega ya fue creada
                    // Log error pero no falla completamente
                    let errorMsg = 'No se pudo generar el reporte';
                    try {
                        const errorData = await reporteResponse.json();
                        errorMsg = errorData.message || errorMsg;
                    } catch (parseError) {
                        // Si no se puede parsear JSON, mostrar el status code
                        if (reporteResponse.status === 403) {
                            errorMsg = 'Permiso denegado: No tienes permisos para crear reportes de carga';
                        } else {
                            errorMsg = `Error del servidor (${reporteResponse.status}): ${reporteResponse.statusText || 'Error desconocido'}`;
                        }
                    }
                    console.warn('⚠️ Advertencia: Reporte de carga no se pudo generar:', errorMsg);
                    // Continuar y redirigir a la entrega creada (la entrega ya existe)
                } else {
                    const reporteResult = await reporteResponse.json();
                    console.log('✅ Reporte de carga generado con ID:', reporteResult.data?.id);
                }

                // ==================== PASO 4: REDIRIGIR ====================
                console.log('🎉 [useSimpleEntregaWithLoading] Operaciones completadas exitosamente');

                // Redirigir a la página de la entrega
                router.visit(`/logistica/entregas/${entregaId}`, {
                    method: 'get',
                });
            } catch (err) {
                const errorMsg = err instanceof Error ? err.message : 'Error desconocido';
                console.error('❌ [useSimpleEntregaWithLoading] Error general:', errorMsg);
                setError(errorMsg);
                // No relanzar el error, mantener el estado en el componente
            } finally {
                setIsLoading(false);
            }
        },
        [venta]
    );

    return { submitEntregaWithReporte, isLoading, error };
};
