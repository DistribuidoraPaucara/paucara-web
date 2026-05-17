import { useEffect } from 'react';
import { useWebSocket } from './use-websocket';
import type { Entrega } from '@/domain/entities/entregas';

/**
 * Tipos de notificaciones soportadas
 */
type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'default';

interface NotificationData {
    title: string;
    description: string;
    type: NotificationType;
    duration?: number;
}

interface UseEntregaNotificationsOptions {
    onNotification?: (data: NotificationData) => void;
    enableLogging?: boolean;
}

/**
 * Hook para manejar notificaciones en tiempo real de entregas
 * Escucha eventos WebSocket y dispara notificaciones
 *
 * Eventos escuchados:
 * - entrega:estado-cambio - Cuando cambia el estado de la entrega
 * - entrega:ubicacion-actualizada - Cuando hay nueva ubicación del chofer
 * - entrega:novedad-reportada - Cuando hay un problema/incidente
 * - entrega:entregada - Cuando se completa la entrega
 *
 * @param entregaId - ID de la entrega a monitorear
 * @param onNotification - Callback cuando ocurre una notificación
 * @param enableLogging - Habilitar logs para debugging
 *
 * @example
 * useEntregaNotifications(19, (data) => {
 *   showToast(data.title, data.description, data.type);
 * });
 */
export function useEntregaNotifications(
    entregaId: number,
    { onNotification, enableLogging = false }: UseEntregaNotificationsOptions = {}
) {
    const { socket, isConnected } = useWebSocket();

    useEffect(() => {
        if (!socket || !isConnected) return;

        const channel = `entrega.${entregaId}`;

        /**
         * Dispara una notificación
         */
        const notify = (data: NotificationData) => {
            if (enableLogging) {
                console.log('[NOTIFICACIONES] Nueva notificación:', data);
            }
            onNotification?.(data);
        };

        /**
         * Evento: Estado de la entrega cambió
         */
        const handleEstadoCambio = (data: Entrega) => {
            notify({
                title: '📋 Estado actualizado',
                description: `Entrega ahora está en: ${data.estado_entrega_nombre || data.estado}`,
                type: 'default',
                duration: 4000,
            });

            if (enableLogging) {
                console.log('[NOTIFICACIONES] Cambio de estado:', {
                    estadoAnterior: data.estado,
                    estadoNuevo: data.estado_entrega_nombre,
                });
            }
        };

        /**
         * Evento: Ubicación del chofer actualizada
         */
        const handleUbicacionActualizada = (data: any) => {
            notify({
                title: '📍 Ubicación actualizada',
                description: `Chofer en movimiento - Vel: ${data.velocidad || 0} km/h`,
                type: 'info',
                duration: 3000,
            });

            if (enableLogging) {
                console.log('[NOTIFICACIONES] Ubicación actualizada:', {
                    latitud: data.latitud,
                    longitud: data.longitud,
                    velocidad: data.velocidad,
                });
            }
        };

        /**
         * Evento: Venta confirmada como cargada
         */
        const handleVentaConfirmada = (data: any) => {
            notify({
                title: '✅ Venta confirmada',
                description: `Venta #${data.venta_id} cargada correctamente`,
                type: 'success',
                duration: 3000,
            });

            if (enableLogging) {
                console.log('[NOTIFICACIONES] Venta confirmada:', {
                    ventaId: data.venta_id,
                    confirmadoPor: data.confirmado_por,
                });
            }
        };

        /**
         * Evento: Novedad/Incidente reportado
         */
        const handleNovedadReportada = (data: any) => {
            notify({
                title: '⚠️ Novedad reportada',
                description: `${data.tipo}: ${data.descripcion}`,
                type: 'warning',
                duration: 5000,
            });

            if (enableLogging) {
                console.log('[NOTIFICACIONES] Novedad reportada:', {
                    tipo: data.tipo,
                    descripcion: data.descripcion,
                    timestamp: data.timestamp,
                });
            }
        };

        /**
         * Evento: Entrega completada
         */
        const handleEntregada = (data: any) => {
            notify({
                title: '✅ ¡Entrega completada!',
                description: `Recibido por: ${data.receptor || 'N/A'}`,
                type: 'success',
                duration: 5000,
            });

            if (enableLogging) {
                console.log('[NOTIFICACIONES] Entrega completada:', {
                    fechaEntrega: data.fecha_entrega,
                    receptor: data.receptor,
                    fotoUrl: data.foto_url,
                });
            }
        };

        /**
         * Registrar listeners para todos los eventos
         */
        socket.on(`${channel}:estado-cambio`, handleEstadoCambio);
        socket.on(`${channel}:ubicacion-actualizada`, handleUbicacionActualizada);
        socket.on(`${channel}:venta-confirmada`, handleVentaConfirmada);
        socket.on(`${channel}:novedad-reportada`, handleNovedadReportada);
        socket.on(`${channel}:entregada`, handleEntregada);

        if (enableLogging) {
            console.log(`[NOTIFICACIONES] Suscrito a canal: ${channel}`);
        }

        /**
         * Cleanup: desuscribirse de los eventos
         */
        return () => {
            socket.off(`${channel}:estado-cambio`, handleEstadoCambio);
            socket.off(`${channel}:ubicacion-actualizada`, handleUbicacionActualizada);
            socket.off(`${channel}:venta-confirmada`, handleVentaConfirmada);
            socket.off(`${channel}:novedad-reportada`, handleNovedadReportada);
            socket.off(`${channel}:entregada`, handleEntregada);

            if (enableLogging) {
                console.log(`[NOTIFICACIONES] Desuscrito de canal: ${channel}`);
            }
        };
    }, [socket, isConnected, entregaId, onNotification, enableLogging]);
}

export default useEntregaNotifications;
