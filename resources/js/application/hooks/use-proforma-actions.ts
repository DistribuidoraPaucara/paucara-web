/**
 * Application Layer Hook: useProformaActions
 *
 * Encapsula toda la lógica de negocio para acciones sobre proformas
 * (aprobar, rechazar, convertir a venta, guardar coordinación)
 *
 * RESPONSABILIDADES:
 * - Validar permisos (puedeAprobar, puedeRechazar, etc.)
 * - Orquestar llamadas al backend
 * - Manejar estados de carga
 * - Mostrar notificaciones
 * - Delegar presentación al componente
 */

import { useState, useCallback } from 'react';
import { router } from '@inertiajs/react';
import type { Proforma, PaymentData } from '@/domain/entities/proformas';
import { validacionesProforma } from '@/domain/entities/proformas';
import proformasService from '@/infrastructure/services/proformas.service';
import NotificationService from '@/infrastructure/services/notification.service';

/**
 * Datos para guardar coordinación de entrega
 */
export interface CoordinacionData {
    fecha_entrega_confirmada: string;
    hora_entrega_confirmada: string;
    hora_entrega_confirmada_fin?: string;
    comentario_coordinacion: string;
    notas_llamada: string;
    numero_intentos_contacto: number;
    fecha_ultimo_intento?: string;
    resultado_ultimo_intento: string;
    entregado_en: string;
    entregado_a: string;
    observaciones_entrega: string;
    // ✅ NUEVO: Datos de pago para aprobación con pago inmediato
    payment?: PaymentData;
}

/**
 * Estados de carga de acciones
 */
export interface ProformaActionsState {
    isSubmitting: boolean;
    isConverting: boolean;
    isGuardandoCoordinacion: boolean;
}

/**
 * Permisos de acciones sobre la proforma
 */
export interface ProformaPermissions {
    puedeAprobar: boolean;
    puedeRechazar: boolean;
    puedeConvertir: boolean;
    puedeCoordinar: boolean;
}

/**
 * Acciones disponibles sobre la proforma
 */
export interface ProformaActionsHandlers {
    aprobar: (coordinacion?: CoordinacionData) => void;
    rechazar: (motivo: string, coordinacion?: CoordinacionData) => void;
    convertirAVenta: () => void;
    guardarCoordinacion: (coordinacion: CoordinacionData) => void;
}

/**
 * Hook para manejar acciones sobre una proforma
 *
 * @param proforma Proforma a actualizar
 * @param options Opciones adicionales
 * @returns Estados, permisos y manejadores de acciones
 *
 * @example
 * const {
 *   isSubmitting,
 *   puedeAprobar,
 *   aprobar,
 * } = useProformaActions(proforma);
 */
export function useProformaActions(
    proforma: Proforma,
    options?: {
        onSuccess?: () => void;
        onError?: (error: Error) => void;
    }
) {
    // ============================================
    // ESTADOS DE CARGA
    // ============================================
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isConverting, setIsConverting] = useState(false);
    const [isGuardandoCoordinacion, setIsGuardandoCoordinacion] = useState(false);

    // ============================================
    // VALIDACIONES DE PERMISOS
    // ============================================
    const puedeAprobar = validacionesProforma.puedeAprobar(proforma);
    const puedeRechazar = validacionesProforma.puedeRechazar(proforma);
    const puedeConvertir = validacionesProforma.puedeConvertir(proforma);
    const puedeCoordinar = validacionesProforma.puedeCoordinar(proforma);

    // ============================================
    // ACCIÓN: APROBAR PROFORMA
    // ============================================
    const aprobar = useCallback((coordinacion?: CoordinacionData) => {
        if (!puedeAprobar) {
            NotificationService.warning('Esta proforma no puede ser aprobada en este momento');
            return;
        }

        setIsSubmitting(true);

        // Preparar datos para APROBAR
        const payload = {
            // Coordinación de entrega
            fecha_entrega_confirmada: coordinacion?.fecha_entrega_confirmada,
            hora_entrega_confirmada: coordinacion?.hora_entrega_confirmada,
            hora_entrega_confirmada_fin: coordinacion?.hora_entrega_confirmada_fin,
            comentario_coordinacion: coordinacion?.comentario_coordinacion,
        };

        console.log('%c📤 PASO 1: Aprobando proforma...', 'font-size: 14px; color: blue; font-weight: bold;');
        console.log('Payload de aprobación:', payload);

        // PASO 1: APROBAR LA PROFORMA
        // ✅ Usar fetch en lugar de router.post para mejor control de errores
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

        fetch(proformasService.aprobarUrl(proforma.id), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-Token': csrfToken,
                'X-Inertia': 'false', // ✅ NUEVO: Indicar que NO es Inertia, es JSON
            },
            body: JSON.stringify(payload),
            redirect: 'manual', // ✅ NUEVO: No seguir redirects automáticamente
        })
            .then(response => {
                console.log('%c📥 Respuesta de aprobación recibida', 'color: blue;', {
                    status: response.status,
                    ok: response.ok,
                    redirected: response.redirected,
                    type: response.type,
                });

                // ✅ NUEVO: Detectar redirects
                if (response.type === 'opaqueredirect' || (response.status >= 300 && response.status < 400)) {
                    throw new Error('⚠️ El servidor está redirigiendo. Verifica que el endpoint devuelva JSON, no redirecciones.');
                }

                // Verificar que es JSON antes de parsear
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    console.error('❌ Content-Type incorrecto:', contentType);
                    console.error('Response headers:', response.headers);
                    throw new Error(`❌ Respuesta no es JSON. Content-Type: ${contentType || 'desconocido'}`);
                }

                return response.json().then(data => ({
                    ok: response.ok,
                    status: response.status,
                    data,
                }));
            })
            .then((response) => {
                if (!response.ok) {
                    const errorMessage = response.data?.message || `Error ${response.status} al aprobar la proforma`;
                    throw new Error(errorMessage);
                }

                console.log('%c✅ Proforma aprobada', 'color: green; font-weight: bold;');
                NotificationService.success('Proforma aprobada correctamente');

                // PASO 2: Si incluye pago, CONVERTIR A VENTA
                if (coordinacion?.payment?.con_pago) {
                    console.log('%c📤 PASO 2: Convirtiendo a venta...', 'font-size: 14px; color: blue; font-weight: bold;');

                    const datosConversion = {
                        con_pago: true,
                        tipo_pago_id: coordinacion.payment.tipo_pago_id,
                        politica_pago: coordinacion.payment.politica_pago,
                        monto_pagado: coordinacion.payment.monto_pagado,
                        fecha_pago: coordinacion.payment.fecha_pago,
                        numero_recibo: coordinacion.payment.numero_recibo,
                        numero_transferencia: coordinacion.payment.numero_transferencia,
                    };

                    console.log('Datos de pago:', datosConversion);

                    // ✅ Llamar al endpoint de conversión con fetch (no router.post)
                    fetch(`/proformas/${proforma.id}/convertir-venta`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            'X-Requested-With': 'XMLHttpRequest',
                            'X-CSRF-Token': csrfToken,
                            'X-Inertia': 'false',
                        },
                        body: JSON.stringify(datosConversion),
                        redirect: 'manual',
                    })
                        .then(response => {
                            if (response.type === 'opaqueredirect' || (response.status >= 300 && response.status < 400)) {
                                throw new Error('El servidor está redirigiendo en conversión');
                            }

                            const contentType = response.headers.get('content-type');
                            if (!contentType || !contentType.includes('application/json')) {
                                throw new Error(`Respuesta de conversión no es JSON`);
                            }

                            return response.json().then(data => ({
                                ok: response.ok,
                                status: response.status,
                                data,
                            }));
                        })
                        .then((response) => {
                            if (!response.ok) {
                                const errorMessage = response.data?.message || 'Error al convertir a venta';
                                throw new Error(errorMessage);
                            }

                            console.log('%c✅ Proforma convertida a venta', 'color: green; font-weight: bold;');
                            NotificationService.success('Proforma convertida a venta exitosamente');
                            options?.onSuccess?.();
                            setIsSubmitting(false);

                            // Redirigir si hay redirect_to
                            if (response.data?.redirect_to) {
                                setTimeout(() => {
                                    router.visit(response.data.redirect_to);
                                }, 1000);
                            }
                        })
                        .catch((error) => {
                            console.error('❌ Error al convertir a venta:', error);
                            const errorMessage = error?.message || 'Error al convertir la proforma a venta';
                            NotificationService.error(errorMessage);
                            options?.onError?.(new Error(errorMessage));
                            setIsSubmitting(false);
                        });
                } else {
                    // Sin conversión, solo aprobación
                    options?.onSuccess?.();
                    setIsSubmitting(false);
                }
            })
            .catch((error) => {
                console.error('❌ Error en flujo combinado:', error);
                const errorMessage = error?.message || 'Error al aprobar la proforma';
                NotificationService.error(errorMessage);
                options?.onError?.(new Error(errorMessage));
                setIsSubmitting(false);

                // Log detallado para debugging
                console.log('%c📋 Detalles del error:', 'color: red; font-weight: bold;', {
                    message: error?.message,
                    stack: error?.stack,
                });
            });
    }, [proforma.id, puedeAprobar, options]);

    // ============================================
    // ACCIÓN: RECHAZAR PROFORMA
    // ============================================
    const rechazar = useCallback((motivo: string, coordinacion?: CoordinacionData) => {
        if (!motivo.trim()) {
            NotificationService.warning('Debe indicar un motivo de rechazo');
            return;
        }

        if (!puedeRechazar) {
            NotificationService.warning('Esta proforma no puede ser rechazada en este momento');
            return;
        }

        setIsSubmitting(true);

        // Si hay datos de coordinación, guardarlos primero
        if (coordinacion?.fecha_entrega_confirmada) {
            // Obtener token CSRF del meta tag
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

            fetch(proformasService.coordinarUrl(proforma.id), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-Token': csrfToken,
                },
                body: JSON.stringify(coordinacion),
            })
            .then(response => {
                if (!response.ok) throw new Error('Error al guardar coordinación');
                return response.json();
            })
            .then(() => {
                NotificationService.success('Coordinación guardada correctamente');
                // Una vez guardada la coordinación, proceder a rechazar
                router.post(
                    proformasService.rechazarUrl(proforma.id),
                    { motivo: motivo.trim() },
                    {
                        onSuccess: () => {
                            NotificationService.success('Proforma rechazada correctamente');
                            options?.onSuccess?.();
                            setIsSubmitting(false);
                        },
                        onError: (errors) => {
                            NotificationService.error('Error al rechazar la proforma');
                            console.error('Reject errors:', errors);
                            options?.onError?.(new Error('Error al rechazar'));
                            setIsSubmitting(false);
                        },
                    }
                );
            })
            .catch(() => {
                NotificationService.error('Error al guardar la coordinación');
                setIsSubmitting(false);
            });
        } else {
            // Si no hay coordinación, solo rechazar
            router.post(
                proformasService.rechazarUrl(proforma.id),
                { motivo: motivo.trim() },
                {
                    onSuccess: () => {
                        NotificationService.success('Proforma rechazada correctamente');
                        options?.onSuccess?.();
                        setIsSubmitting(false);
                    },
                    onError: (errors) => {
                        NotificationService.error('Error al rechazar la proforma');
                        console.error('Reject errors:', errors);
                        options?.onError?.(new Error('Error al rechazar'));
                        setIsSubmitting(false);
                    },
                }
            );
        }
    }, [proforma.id, puedeRechazar, options]);

    // ============================================
    // ACCIÓN: CONVERTIR A VENTA
    // ============================================
    const convertirAVenta = useCallback(() => {
        if (!puedeConvertir) {
            NotificationService.warning('Esta proforma no puede ser convertida a venta en este momento');
            return;
        }

        setIsConverting(true);

        // LOG 1: Inicio del proceso
        console.log('🔄 [CONVERTIR A VENTA] Iniciando conversión de proforma', {
            proformaId: proforma.id,
            proformaNumero: proforma.numero,
            proformaEstado: proforma.estado,
            clienteId: proforma.cliente_id,
            montoTotal: proforma.total,
            timestamp: new Date().toISOString(),
        });

        // Usar web endpoint (ProformaController) para compatibilidad con ReservaStock
        const url = proformasService.convertirVentaUrl(proforma.id);

        console.log('📤 [CONVERTIR A VENTA] URL a llamar:', url);

        // Obtener token CSRF del meta tag
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-Token': csrfToken,
            },
            body: JSON.stringify({}),
        })
            .then(response => {
                return response.json().then(data => {
                    return { ok: response.ok, status: response.status, data };
                });
            })
            .then((response) => {
                if (!response.ok) {
                    // Crear error con información adicional
                    const error = new Error(response.data?.message || 'Error al convertir la proforma') as any;
                    error.code = response.data?.code;
                    error.action = response.data?.action;
                    error.responseData = response.data;
                    throw error;
                }

                console.log('✅ [CONVERTIR A VENTA] Conversión exitosa', {
                    timestamp: new Date().toISOString(),
                    data: response.data?.data,
                    redirectTo: response.data?.redirect_to,
                });
                NotificationService.success('Proforma convertida a venta exitosamente');
                options?.onSuccess?.();
                setIsConverting(false);

                // Redirigir a la venta creada
                if (response.data?.redirect_to) {
                    console.log('📍 [CONVERTIR A VENTA] Redirigiendo a:', response.data.redirect_to);
                    setTimeout(() => {
                        router.visit(response.data.redirect_to);
                    }, 1000);
                }
            })
            .catch((error) => {
                console.log('❌ [CONVERTIR A VENTA] Error en la conversión', {
                    error: error.message,
                    code: error.code,
                    timestamp: new Date().toISOString(),
                });

                // Manejar error específico de reservas expiradas
                if (error.code === 'RESERVAS_EXPIRADAS') {
                    console.log('⚠️ [CONVERTIR A VENTA] Las reservas han expirado', {
                        proformaId: error.responseData?.data?.proforma_id,
                        reservasExpiradas: error.responseData?.data?.reservas_expiradas,
                    });

                    // Notificar al callback con información especial
                    const customError = new Error(error.message) as any;
                    customError.code = 'RESERVAS_EXPIRADAS';
                    customError.reservasExpiradas = error.responseData?.data?.reservas_expiradas;
                    customError.endpointRenovacion = error.responseData?.data?.endpoint_renovacion;
                    options?.onError?.(customError);

                    // Mostrar notificación no tan agresiva (es un error "recuperable")
                    NotificationService.warning(error.message);
                } else {
                    NotificationService.error(error.message || 'Error al convertir la proforma');
                    console.error('Convert error:', error);
                    options?.onError?.(error);
                }

                setIsConverting(false);
            });
    }, [proforma.id, puedeConvertir, options]);

    // ============================================
    // ACCIÓN: GUARDAR COORDINACIÓN DE ENTREGA
    // ============================================
    const guardarCoordinacion = useCallback((coordinacion: CoordinacionData) => {
        if (!puedeCoordinar) {
            NotificationService.warning('Esta proforma no puede tener coordinación en este momento');
            return;
        }

        // Validaciones básicas
        if (!coordinacion.fecha_entrega_confirmada) {
            NotificationService.warning('Debe indicar una fecha de entrega');
            return;
        }

        setIsGuardandoCoordinacion(true);

        router.post(
            proformasService.coordinarUrl(proforma.id),
            coordinacion,
            {
                onSuccess: () => {
                    NotificationService.success('Coordinación guardada exitosamente');
                    options?.onSuccess?.();
                    setIsGuardandoCoordinacion(false);
                },
                onError: (errors) => {
                    NotificationService.error('Error al guardar la coordinación');
                    console.error('Coordination errors:', errors);
                    options?.onError?.(new Error('Error al guardar coordinación'));
                    setIsGuardandoCoordinacion(false);
                },
            }
        );
    }, [proforma.id, puedeCoordinar, options]);

    // ============================================
    // ACCIÓN: RENOVAR RESERVAS EXPIRADAS
    // ============================================
    const [isRenovandoReservas, setIsRenovandoReservas] = useState(false);

    const renovarReservas = useCallback((onSuccess?: () => void) => {
        if (!proforma.id) {
            NotificationService.error('ID de proforma no disponible');
            return;
        }

        setIsRenovandoReservas(true);

        console.log('🔄 [RENOVAR RESERVAS] Iniciando renovación para proforma #' + proforma.id);

        // Obtener token CSRF del meta tag
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

        fetch(`/proformas/${proforma.id}/renovar-reservas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-Token': csrfToken,
            },
            body: JSON.stringify({}),
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(error => {
                        throw new Error(error?.message || 'Error al renovar reservas');
                    });
                }
                return response.json();
            })
            .then((data) => {
                console.log('✅ [RENOVAR RESERVAS] Renovación exitosa', {
                    timestamp: new Date().toISOString(),
                    data: data?.data,
                });

                NotificationService.success('Reservas renovadas exitosamente. Válidas por 7 días más.');
                setIsRenovandoReservas(false);
                onSuccess?.();
            })
            .catch((error) => {
                console.log('❌ [RENOVAR RESERVAS] Error en la renovación', {
                    error: error.message,
                    timestamp: new Date().toISOString(),
                });

                NotificationService.error(error.message || 'Error al renovar las reservas');
                console.error('Renovar error:', error);
                setIsRenovandoReservas(false);
            });
    }, [proforma.id]);

    // ============================================
    // RETORNO PÚBLICO
    // ============================================
    return {
        // Estados de carga
        isSubmitting,
        isConverting,
        isGuardandoCoordinacion,
        isRenovandoReservas,

        // Permisos/Validaciones
        puedeAprobar,
        puedeRechazar,
        puedeConvertir,
        puedeCoordinar,

        // Acciones
        aprobar,
        rechazar,
        convertirAVenta,
        guardarCoordinacion,
        renovarReservas,
    };
}

export type UseProformaActionsReturn = ReturnType<typeof useProformaActions>;
