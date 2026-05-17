/**
 * Hook: useReporteCarga
 *
 * Maneja la lógica para gestionar reportes de carga:
 * - Obtener datos del reporte
 * - Actualizar cantidades cargadas
 * - Verificar detalles
 * - Cambiar estado del reporte
 *
 * ARQUITECTURA:
 * ✅ Maneja estado y lógica de negocio
 * ✅ Delega al componente renderización
 */

import { useState, useCallback } from 'react';
import type { ReporteCarga, DetalleReporteCarga, ActualizarDetalleReporteCargaFormData } from '@/domain/entities/entregas';
import { router } from '@inertiajs/react';

interface UseReporteCargoOptions {
    reporteId: number;
    onSuccess?: (reporte: ReporteCarga) => void;
    onError?: (error: string) => void;
}

export function useReporteCarga({ reporteId, onSuccess, onError }: UseReporteCargoOptions) {
    const [reporte, setReporte] = useState<ReporteCarga | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Obtener datos del reporte
    const obtenerReporte = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch(`/api/reportes-carga/${reporteId}`);
            if (!response.ok) {
                throw new Error('Error obteniendo reporte');
            }

            const result = await response.json();
            if (result.success && result.data) {
                setReporte(result.data);
                onSuccess?.(result.data);
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error desconocido';
            setError(message);
            onError?.(message);
        } finally {
            setIsLoading(false);
        }
    }, [reporteId, onSuccess, onError]);

    // Actualizar cantidad cargada de un detalle
    const actualizarCantidad = useCallback(
        async (detalleId: number, cantidadCargada: number, notas?: string) => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await fetch(
                    `/api/reportes-carga/${reporteId}/detalles/${detalleId}`,
                    {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                        },
                        body: JSON.stringify({
                            cantidad_cargada: cantidadCargada,
                            ...(notas && { notas }),
                        }),
                    }
                );

                if (!response.ok) {
                    throw new Error('Error actualizando cantidad');
                }

                const result = await response.json();
                if (result.success) {
                    // Actualizar el detalle en el estado local
                    setReporte((prev) => {
                        if (!prev) return prev;
                        return {
                            ...prev,
                            detalles: prev.detalles?.map((d) =>
                                d.id === detalleId
                                    ? {
                                          ...d,
                                          cantidad_cargada: cantidadCargada,
                                          notas: notas || d.notas,
                                      }
                                    : d
                            ),
                        };
                    });
                }
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Error desconocido';
                setError(message);
                onError?.(message);
            } finally {
                setIsLoading(false);
            }
        },
        [reporteId, onError]
    );

    // Verificar un detalle
    const verificarDetalle = useCallback(
        async (detalleId: number, notas?: string) => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await fetch(
                    `/api/reportes-carga/${reporteId}/detalles/${detalleId}/verificar`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                        },
                        body: JSON.stringify({
                            ...(notas && { notas }),
                        }),
                    }
                );

                if (!response.ok) {
                    throw new Error('Error verificando detalle');
                }

                const result = await response.json();
                if (result.success) {
                    // Actualizar el detalle en el estado local
                    setReporte((prev) => {
                        if (!prev) return prev;
                        return {
                            ...prev,
                            detalles: prev.detalles?.map((d) =>
                                d.id === detalleId
                                    ? {
                                          ...d,
                                          verificado: true,
                                          notas: notas || d.notas,
                                      }
                                    : d
                            ),
                        };
                    });
                }
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Error desconocido';
                setError(message);
                onError?.(message);
            } finally {
                setIsLoading(false);
            }
        },
        [reporteId, onError]
    );

    // Confirmar carga
    const confirmarCarga = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch(`/api/reportes-carga/${reporteId}/confirmar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (!response.ok) {
                throw new Error('Error confirmando carga');
            }

            const result = await response.json();
            if (result.success && result.data) {
                setReporte(result.data);
                onSuccess?.(result.data);
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error desconocido';
            setError(message);
            onError?.(message);
        } finally {
            setIsLoading(false);
        }
    }, [reporteId, onSuccess, onError]);

    // Marcar como listo para entrega
    const marcarListoParaEntrega = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch(`/api/reportes-carga/${reporteId}/listo-para-entrega`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (!response.ok) {
                throw new Error('Error marcando como listo');
            }

            const result = await response.json();
            if (result.success && result.data) {
                setReporte(result.data);
                onSuccess?.(result.data);
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error desconocido';
            setError(message);
            onError?.(message);
        } finally {
            setIsLoading(false);
        }
    }, [reporteId, onSuccess, onError]);

    // Cancelar reporte
    const cancelarReporte = useCallback(
        async (razon?: string) => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await fetch(`/api/reportes-carga/${reporteId}/cancelar`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    },
                    body: JSON.stringify({
                        ...(razon && { razon }),
                    }),
                });

                if (!response.ok) {
                    throw new Error('Error cancelando reporte');
                }

                const result = await response.json();
                if (result.success && result.data) {
                    setReporte(result.data);
                    onSuccess?.(result.data);
                }
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Error desconocido';
                setError(message);
                onError?.(message);
            } finally {
                setIsLoading(false);
            }
        },
        [reporteId, onSuccess, onError]
    );

    return {
        reporte,
        isLoading,
        error,
        obtenerReporte,
        actualizarCantidad,
        verificarDetalle,
        confirmarCarga,
        marcarListoParaEntrega,
        cancelarReporte,
    };
}
